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

class TrimAction(BaseModel):
    type: str = "trim"
    start: float
    end: float

class AspectRatioAction(BaseModel):
    type: str = "aspect_ratio"
    ratio: str # e.g., "9:16"

class FilterAction(BaseModel):
    type: str = "filter"
    name: str # e.g., "grayscale", "contrast"

class SpeedAction(BaseModel):
    type: str = "speed"
    value: float # e.g., 2.0 for 2x speed

# --- UPDATED: Text Action with Positioning ---
class TextAction(BaseModel):
    type: str = "add_text"
    content: str
    position: str = "center" # New: top, bottom, center

# --- NEW: Transition Action ---
class TransitionAction(BaseModel):
    type: str = "fade"
    kind: str = "in" # "in" or "out"
    duration: float = 1.0

# --- 3. The Container for AI Output ---
class EditInstructions(BaseModel):
    # The AI returns a list of ANY of these actions
    actions: List[Union[TrimAction, AspectRatioAction, FilterAction, SpeedAction, TextAction, TransitionAction]]