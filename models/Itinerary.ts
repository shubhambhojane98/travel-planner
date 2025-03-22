import mongoose, { Schema, Document } from "mongoose";

const ItinerarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    destination: { type: String, required: true },
    date: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    budget: { type: String },
    travelType: { type: String },
    activities: { type: String },
    itinerary: [
      {
        day: { type: String, required: true },
        date: { type: String, required: true },
        activities: { type: String, required: true },
        recommendations: { type: String, required: true },
        image: { type: String, required: false }, // ✅ Ensure image field exists
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    ],
  },
  { strict: true }
); // Ensure schema is strict

export default mongoose.models.Itinerary ||
  mongoose.model("Itinerary", ItinerarySchema);
