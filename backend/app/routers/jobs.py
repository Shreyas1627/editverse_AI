from fastapi import APIRouter, File, UploadFile, Depends,HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
import os

# Import modules from your project structure
from backend.app.db.database import get_db
from backend.app.db.models import VideoJob
from backend.app.tasks import dummy_video_processing,process_video_edit
from backend.app.core.config import settings
from backend.app.core.schemas import PromptRequest,JobStatusResponse


# --- 1. Define the APIRouter Instance ---
# This is the 'router' object that main.py needs to import.
router = APIRouter()
# ----------------------------------------

# Define a storage location relative to the project root (EditVerseAi)
# Ensure this folder exists or create it!
# NOTE: In production, this would be AWS S3 or Supabase Storage.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "temp_storage"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

print(f"DEBUG: Server will save files to: {UPLOAD_DIR}")
# ---------------------------------------------


@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    # db is injected automatically by FastAPI, based on your database.py
    db: Session = Depends(get_db)
):
    """
    Handles the upload of a video file, saves it locally, and creates a
    PENDING job entry in the database.
    """
    
    # 1. Generate a unique filename and define the final path
    # We use a UUID to ensure the filename is unique, preventing overwrites.
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    # 2. Save the file locally using efficient stream copying
    try:
        # Open the destination file in binary write mode
        with open(file_path, "wb") as buffer:
            # Use shutil to efficiently copy the contents of the uploaded file
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        print(f"File upload error: {e}")
        return {"message": "There was an error saving the uploaded file.", "error": str(e)}
    finally:
        # Important: Close the UploadFile object
        await file.close()

    # 3. Create a PENDING job record in the database
    # In a real app, user_id would come from the authentication token.
    new_job = VideoJob(
        user_id=1,  # Placeholder for authenticated user
        original_file_path=str(file_path),
        prompt="Awaiting user prompt...",
        status="UPLOADED"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job) # Reload the job object to get its generated ID

    dummy_video_processing.delay(str(new_job.id), unique_filename)

    return {
        "message": "File uploaded successfully. Ready for prompt submission.",
        "filename": unique_filename,
        "job_id": new_job.id,
        "status": new_job.status
        
    }


@router.post("/{job_id}/prompt")
async def submit_prompt(
    job_id: str, 
    request: PromptRequest, 
    db: Session = Depends(get_db)
):
    """
    User sends a text prompt. We update DB and trigger the Edit Worker.
    """
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Update DB
    job.prompt = request.prompt
    job.status = "QUEUED" # Reset status to queued for editing
    db.commit()

    # Trigger Celery Task
    process_video_edit.delay(job_id, request.prompt)

    return {"message": "Prompt received. Editing started.", "status": "QUEUED"}

# --- 2. CHECK STATUS ---
@router.get("/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str, db: Session = Depends(get_db)):
    """
    Frontend polls this to check if 'status' is 'COMPLETED'.
    """
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": str(job.id),
        "status": job.status,
        "original_file": job.original_file_path,
        "duration": job.duration,
        "width": job.width,
        "height": job.height,
        "error": job.error_message
    }
# --- 3. DOWNLOAD VIDEO ---
@router.get("/{job_id}/download")
async def download_video(job_id: str, db: Session = Depends(get_db)):
    """
    Returns the video file stream.
    """
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.edited_file_path and Path(job.edited_file_path).exists():
        file_path = Path(job.edited_file_path)
        filename = f"edited_{job.id}.mp4"
    else:
        file_path = Path(job.original_file_path)
        filename = f"original_{job.id}.mp4"
    # --------------------

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")
    

  
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on server")

    # Return file stream
    return FileResponse(
        path=file_path, 
        filename=filename,
        media_type="video/mp4"
    )

# NOTE: The /jobs/prompt endpoint will be added here next week!