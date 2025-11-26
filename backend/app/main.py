# backend/app/main.py

import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- THIS SECTION FIXES THE MODULE NOT FOUND ERROR ---
# 1. Get the path to the directory containing 'backend' and 'frontend' (project root)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
# 2. Insert the project root path into the system search path
sys.path.insert(0, str(PROJECT_ROOT))
# -----------------------------------------------------

# These imports should now work relative to the project root!
# The code will now look for 'backend.app.routers.jobs'
from backend.app.routers import jobs 


# --- FastAPI Application Instance ---
app = FastAPI(
    title="EditVerse AI Backend",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from ANY website/IP
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ... rest of your code ...
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])

@app.get("/status")
async def get_status():
    return {"status": "ok", "service": app.title}