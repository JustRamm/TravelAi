export interface Activity {
  time: string;
  description: string;
  location: string;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  travel_style: string;
  summary: string;
  days: DayPlan[];
}
