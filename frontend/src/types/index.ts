export interface Activity {
  time: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  weather: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  travel_style: string;
  summary: string;
  days: DayPlan[];
}
