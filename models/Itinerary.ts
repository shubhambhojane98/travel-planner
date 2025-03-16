import mongoose, { Schema, Document } from "mongoose";

const ItinerarySchema = new Schema({
  userId: { type: String, required: false }, // Optional for guest users
  destination: { type: String, required: true },
  date: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  budget: { type: String, required: false },
  travelType: { type: String, required: false },

  activities: { type: String, required: false }, // Simple string instead of an array

  itinerary: [
    {
      day: { type: String, required: true },
      date: { type: String, required: true },
      activities: { type: String, required: true }, // Single string instead of an array
      recommendations: { type: String, required: false }, // Single string instead of an array
    },
  ],
});

export default mongoose.models.Itinerary ||
  mongoose.model("Itinerary", ItinerarySchema);
