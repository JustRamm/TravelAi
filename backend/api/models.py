from typing import List, Optional
from pydantic import BaseModel, Field

class Activity(BaseModel):
    time: str = Field("09:00 AM", description="Chronological marker or duration")
    description: str = Field("Enjoy the surroundings.", description="Linguistic detail of the activity")
    location: str = Field("Local point of interest", description="Geographical identifier")
    lat: float = Field(0.0, description="Latitude coordinate")
    lng: float = Field(0.0, description="Longitude coordinate")
    cost_estimate: str = Field("Variable", description="Financial projection")
    transport_details: str = Field("Local transition", description="Logistical transition info")
    nearest_station: str = Field("Available nearby", description="Proximal transit hub")

class Accommodation(BaseModel):
    name: str = Field("Signature Stay", description="Establishment nomenclature")
    description: str = Field("A curated premium choice.", description="Qualitative reasoning for selection")
    cost_per_night: str = Field("Upon inquiry", description="Nightly rate projection")
    booking_link: str = Field("#", description="Direct reservation interface")

class Transport(BaseModel):
    mode: str = Field("Local", description="Dimensional modality (Flight, Rail, etc.)")
    details: str = Field("Coordinated transit", description="Specific operational markers")
    cost: str = Field("Included", description="Aggregate transition cost")
    booking_link: str = Field("#", description="Direct reservation interface link")

class DayPlan(BaseModel):
    day_number: int = 1
    theme: str = Field("Exploration", description="Conceptual anchor for the day")
    weather: str = Field("Pleasant", description="Atmospheric projection")
    activities: List[Activity] = Field(default_factory=list)

class Itinerary(BaseModel):
    destination: str = Field("Global Destination", description="Geographical focus")
    travel_style: str = Field("Custom", description="Architectural style")
    summary: str = Field("A bespoke journey curated for you.", description="Executive narrative summary")
    transport: Transport = Field(default_factory=lambda: Transport(mode="Local", details="Coordinated transit", cost="Variable", booking_link="#"), description="Primary orbital transport")
    accommodation: Accommodation = Field(default_factory=lambda: Accommodation(name="Signature Stay", description="Premium curated selection", cost_per_night="Upon inquiry", booking_link="#"), description="Resident anchor point")
    days: List[DayPlan] = Field(default_factory=list)

class TravelRequest(BaseModel):
    country: str = Field(default="India")
    state: str = Field(default="Whole Country")
    travel_style: str = Field(default="Adventure")
    num_people: int = 1

class RegenerateRequest(BaseModel):
    country: str = Field(default="India")
    state: str = Field(default="Whole Country")
    travel_style: str = Field(default="Adventure")
    day_theme: str = Field(default="Exploration")
    time: str = Field(default="09:00 AM")
    old_activity: str = Field(default="Points of interest")
