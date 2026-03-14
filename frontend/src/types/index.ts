export interface Activity {
  time: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  cost_estimate: string;
  transport_details: string;
  nearest_station: string;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  weather: string;
  activities: Activity[];
}

export interface Transport {
  mode: string;
  details: string;
  cost: string;
  booking_link: string;
}

export interface Accommodation {
  name: string;
  description: string;
  cost_per_night: string;
  booking_link: string;
}

export interface Itinerary {
  destination: string;
  travel_style: string;
  summary: string;
  transport: Transport;
  accommodation: Accommodation;
  days: DayPlan[];
}
