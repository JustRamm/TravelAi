import os
import json
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google.api_core import exceptions
from .models import TravelRequest, RegenerateRequest

# LLM Convergence Hierarchy
ORCHESTRATION_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-flash-latest"
]

class ArchitectEngine:
    """
    Core AI Orchestration Engine.
    Handles high-fidelity prompt construction and LLM convergence.
    """
    
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Cloud infrastructure credentials missing.")
        genai.configure(api_key=api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((exceptions.ResourceExhausted, exceptions.ServiceUnavailable)),
        reraise=True
    )
    def _dispatch_request(self, model_name: str, payload: str):
        """Internal dispatcher with retry logic."""
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction="Role: Professional Travel Architect. Output: Valid Schema-compliant JSON. Style: Bespoke, Elite, Accurate."
        )
        response = model.generate_content(
            payload,
            generation_config={"response_mime_type": "application/json"}
        )
        if not response or not response.text:
            raise RuntimeError("Engine returned null trajectory.")
        return json.loads(response.text)

    async def architect_journey(self, request: TravelRequest):
        """Constructs a complete 3-day travel itinerary."""
        prompt = self._build_generation_prompt(request)
        result = self._converge_on_result(prompt)
        
        # Injection Logic: Ensure requested context is preserved in the data
        result["destination"] = result.get("destination") or f"{request.state}, {request.country}"
        result["travel_style"] = result.get("travel_style") or request.travel_style
        return result

    async def refine_component(self, request: RegenerateRequest):
        """Refines a specific activity within an existing plan."""
        prompt = self._build_regeneration_prompt(request)
        return self._converge_on_result(prompt)

    def _converge_on_result(self, prompt: str):
        """Cycles through the model hierarchy to ensure successful generation."""
        last_error = None
        for model in ORCHESTRATION_MODELS:
            try:
                data = self._dispatch_request(model, prompt)
                print(f"[Engine] Convergence successful using {model}")
                return data
            except exceptions.ResourceExhausted:
                last_error = "Engine Quota Exhausted."
                continue
            except Exception as e:
                print(f"[Engine Logic] Model {model} failure: {e}")
                last_error = str(e)
                continue
        raise RuntimeError(f"Engine failed to converge: {last_error}")

    def _build_generation_prompt(self, req: TravelRequest):
        return f"""
        Objective: Architect a 3-day high-fidelity itinerary for {req.state}, {req.country}.
        Style Profile: {req.travel_style}
        Group Multiplier: {req.num_people} travelers.
        
        CRITICAL: The JSON response MUST contain the following root fields:
        - "destination": "{req.state}, {req.country}"
        - "travel_style": "{req.travel_style}"
        - "summary": A professional overview of the journey.
        - "transport": Primary transit details.
        - "accommodation": Lodging details.
        - "days": A list of 3 DayPlan objects.
        
        Requirements:
        - Authenticated geolocation (lat/lng) for every activity.
        - Realistic cost projections.
        - Atmospheric, high-fidelity descriptions.
        """

    def _build_regeneration_prompt(self, req: RegenerateRequest):
        return f"""
        Objective: Replace existing activity '{req.old_activity}' in {req.state}, {req.country}.
        Window: {req.time}
        Theme: {req.day_theme}
        Style: {req.travel_style}
        
        Output: A single valid 'Activity' JSON object.
        """
