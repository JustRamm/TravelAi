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
        # Use system_instruction to enforce JSON schema strictly
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction="You are a professional travel architect. Always respond in valid JSON following the provided schema. Do not include markdown formatting like ```json ... ``` in your response."
        )
        
        prompt = f"""
        Create a detailed 3-day travel itinerary for {request.destination} with a focus on {request.travel_style}.
        
        The JSON schema must be:
        {{
            "destination": "string",
            "travel_style": "string",
            "summary": "string",
            "days": [
                {{
                    "day_number": number,
                    "theme": "string",
                    "activities": [
                        {{
                            "time": "string",
                            "description": "string",
                            "location": "string"
                        }}
                    ]
                }}
            ]
        }}
        
        Ensure exactly 3 days. Activities should be specific to {request.destination}.
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        if not response.text:
            raise Exception("AI returned empty response")
            
        # Parse the JSON response
        itinerary_data = json.loads(response.text)
        return itinerary_data

    except Exception as e:
        error_msg = str(e)
        print(f"Error generating itinerary: {error_msg}")
        
        # Friendly error messages for common Gemini issues
        if "429" in error_msg:
            raise HTTPException(status_code=429, detail="Gemini API Quota Exceeded. Please wait a minute or check your billing.")
        if "403" in error_msg:
            raise HTTPException(status_code=403, detail="Gemini API Key is invalid or has no access.")
        
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
