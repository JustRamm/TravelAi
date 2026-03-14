import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

# --- Config Setup ---
# loading dotenv so it picks up the api key locally from the file
# dont forget to add .env on prod
load_dotenv()

# App name maybe change this later
server_app = FastAPI(title="Travel Planner V1")

# CORS Policy: Restricted to local development for initial release phase.
server_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# init gen client
API_KEY_SECRET = os.getenv("GOOGLE_API_KEY")
if not API_KEY_SECRET:
    print("[Error] damn, GOOGLE_API_KEY is missing. check env vars.")
    # raise Exception("no key")

genai.configure(api_key=API_KEY_SECRET)

# Data Models for JSON Output Enforcement
class Activity(BaseModel):
    time: str = Field(description="Time of the day or duration")
    description: str = Field(description="Detailed description of the activity")
    location: str = Field(description="Name of the place")
    lat: float = Field(description="Latitude of the location")
    lng: float = Field(description="Longitude of the location")

class DayPlan(BaseModel):
    day_number: int
    theme: str = Field(description="General theme of the day")
    weather: str = Field(description="Brief predicted weather/atmosphere for this day (e.g., 'Sunny, 22°C')")
    activities: List[Activity]

class Itinerary(BaseModel):
    destination: str
    travel_style: str
    summary: str = Field(description="Brief overview of the trip")
    days: List[DayPlan]

class TravelRequest(BaseModel):
    destination: str
    travel_style: str

@server_app.get("/health")
async def check_api_status():
    """Utility endpoint to verify service availability."""
    return {"status": "operational", "engine": "Gemini-Flash-Hybrid"}

from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google.api_core import exceptions

# Models to try in order of preference
MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest", # This is Gemini 1.5 Flash
    "gemini-flash-lite-latest",
]

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type((exceptions.ResourceExhausted, exceptions.ServiceUnavailable)),
    reraise=True
)
def call_gemini(model_name: str, prompt: str):
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction="You are a professional travel architect. Always respond in valid JSON following the provided schema. Do not include markdown formatting like ```json ... ``` in your response."
    )
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    if not response.text:
        raise Exception("AI returned empty response")
    return json.loads(response.text)

@server_app.post("/api/generate", response_model=Itinerary)
async def create_travel_itinerary(user_req: TravelRequest):
    """
    Main endpoint that talks to LLM.
    # TODO: this needs to be refactored eventually, way too much stuff in one func
    """
    if not API_KEY_SECRET:
        raise HTTPException(status_code=500, detail="API credentials not found.")

    # debugging user req
    print("got req:", user_req.destination, user_req.travel_style)

    # construct the prompt
    # tried using few-shot prompting here before but it was too slow
    system_prompt = f"""
    Build a bespoke 3-day travel plan for {user_req.destination} centered on {user_req.travel_style}.
    
    Output Format (Strict JSON):
    {{
        "destination": "{user_req.destination}",
        "travel_style": "{user_req.travel_style}",
        "summary": "High-level overview",
        "days": [
            {{
                "day_number": 1,
                "theme": "Theme title",
                "weather": "Atmospheric condition",
                "activities": [
                    {{
                        "time": "HH:MM AM/PM",
                        "description": "Details",
                        "location": "Venue Name",
                        "lat": 0.0,
                        "lng": 0.0
                    }}
                ]
            }}
        ]
    }}
    
    Processing Rules:
    - Use authentic geolocation coordinates.
    - Weather should match the destination's current season.
    """

    generation_fault = None
    for active_model in MODELS_TO_TRY:
        try:
            print(f"trying model: {active_model}...")
            # old way:
            # res = genai.GenerativeModel("gemini-1.5-flash").generate_content(...)
            generated_res = call_gemini(active_model, system_prompt)
            return generated_res
        except exceptions.ResourceExhausted:
            print(f"[Warning] quota hit for {active_model}. moving on.")
            generation_fault = "Quota Limit: Please wait 60 seconds."
            continue
        except Exception as e:
            raw_err = str(e).lower()
            print(f"[System Error] {active_model} failed: {e}")
            if "429" in raw_err or "quota" in raw_err:
                continue
            generation_fault = str(e)
            break
    
    raise HTTPException(
        status_code=429 if generation_fault and "Quota" in generation_fault else 500, 
        detail=generation_fault or "The architect is currently unavailable."
    )

if __name__ == "__main__":
    import uvicorn
    # Starting internal dev server on local port 8000
    uvicorn.run(server_app, host="0.0.0.0", port=8000)
