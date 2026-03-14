import os
from fastapi import APIRouter, HTTPException
from .models import TravelRequest, RegenerateRequest, Itinerary, Activity
from .engine import ArchitectEngine

router = APIRouter(prefix="/api")

# Initialize Engine Bridge
engine = ArchitectEngine(api_key=os.getenv("GOOGLE_API_KEY", ""))

@router.get("/health")
async def probe():
    return {"status": "synchronized", "version": "2.1.0-Flash-Refined"}

@router.post("/generate", response_model=Itinerary)
async def map_journey(req: TravelRequest):
    try:
        return await engine.architect_journey(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/regenerate_activity", response_model=Activity)
async def swap_component(req: RegenerateRequest):
    try:
        return await engine.refine_component(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
