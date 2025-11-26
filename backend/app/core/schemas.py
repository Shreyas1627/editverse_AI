# backend/app/core/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Union

# 1. Request Model for the Prompt Endpoint
class PromptRequest(BaseModel):
    prompt: str # The raw text: "Cut first 5 seconds"

# 2. Response Model for Job Status
class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    original_file: str
    duration: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    error: Optional[str] = None