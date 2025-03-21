export interface ItineraryItem {
  day: string;
  date: string;
  activities: string;
  recommendations: string;
  image: string;
  _id: string; // Assuming ObjectId is stored as a string in frontend
}

export interface ItineraryPlan {
  _id: string;
  userId: string;
  destination: string;
  budget: string;
  travelType: string;
  activities: string;
  date: {
    from: string; // ISO date string
    to: string;
  };
  itinerary: ItineraryItem[];
}
