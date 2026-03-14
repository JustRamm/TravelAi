import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Travel Architect API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# Data Models for JSON Output Enforcement
class Activity(BaseModel):
    time: str = Field(description="Time of the day or duration")
    description: str = Field(description="Detailed description of the activity")
    location: str = Field(description="Name of the place")

class DayPlan(BaseModel):
    day_number: int
    theme: str = Field(description="General theme of the day")
    activities: List[Activity]

class Itinerary(BaseModel):
    destination: str
    travel_style: str
    summary: str = Field(description="Brief overview of the trip")
    days: List[DayPlan]

class TravelRequest(BaseModel):
    destination: str
    travel_style: str

@app.get("/")
async def root():
    return {"message": "AI Travel Architect API is running"}

@app.post("/api/generate", response_model=Itinerary)
async def generate_itinerary(request: TravelRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        Create a detailed 3-day travel itinerary for {request.destination} with a focus on {request.travel_style}.
        Return the itinerary in a structured JSON format following this schema:
        - destination: name of the city/place
        - travel_style: the requested style
        - summary: brief catchy summary of the trip
        - days: array of 3 days
            - day_number: 1, 2, or 3
            - theme: theme for that day
            - activities: array of objects (time, description, location)
        
        Ensure the suggestions are practical and localized to {request.destination}.
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Parse the JSON response
        itinerary_data = json.loads(response.text)
        return itinerary_data

    except Exception as e:
        print(f"Error generating itinerary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
