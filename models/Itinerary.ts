import mongoose, { Schema } from "mongoose";

export interface ItineraryDocument extends Document {
  userId: string;
  destination: string;
  date: { from: Date; to: Date };
  budget: string;
  travelType: string;
  activities: string[];
  itinerary: {
    day: string;
    date: string;
    activities: { time: string; activity: string }[];
    recommendations: string[];
  }[];
  createdAt: Date;
}

const ItinerarySchema = new Schema<ItineraryDocument>({
  userId: { type: String, required: true },
  destination: { type: String, required: true },
  date: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  budget: { type: String, required: true },
  travelType: { type: String, required: true },
  activities: [{ type: String }], // General activities list
  itinerary: [
    {
      day: { type: String, required: true },
      date: { type: String, required: true },
      activities: [
        {
          time: { type: String, required: true },
          activity: { type: String, required: true },
        },
      ],
      recommendations: [{ type: String }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.Itinerary ||
  mongoose.model<ItineraryDocument>("Itinerary", ItinerarySchema);
