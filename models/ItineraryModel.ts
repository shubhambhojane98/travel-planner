import mongoose, { Schema } from "mongoose";

export interface ItineraryDocument extends Document {
  userId: string; // Associate with a user
  destination: string;
  date: { from: Date; to: Date };
  budget: string;
  travelType: string;
  activities: string[];
  itinerary: string; // AI-generated itinerary
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
  activities: [{ type: String }],
  itinerary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Itinerary ||
  mongoose.model<ItineraryDocument>("Itinerary", ItinerarySchema);
