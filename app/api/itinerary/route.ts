import connectMongoDB from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  connectMongoDB();

  try {
    const { userId, destination, date, budget, travelType, activities } =
      await req.json();

    if (!destination || !date.from || !date.to) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    const prompt = `
      Generate a detailed travel itinerary for a trip to ${destination}.
      - Travel Dates: ${date.from} to ${date.to}
      - Budget: ${budget}
      - Travel Type: ${travelType}
      - Preferred Activities: ${activities.join(", ")}

      Provide a day-wise itinerary including places to visit, things to do, and recommendations.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const itineraryText = response.choices[0].message.content;

    if (userId) {
      // Save itinerary to MongoDB
      const newItinerary = await Itinerary.create({
        userId,
        destination,
        date,
        budget,
        travelType,
        activities,
        itinerary: itineraryText,
      });

      console.log("newitinerary", newItinerary);

      return NextResponse.json({ itinerary: newItinerary });
    } else {
      // Save to sessionStorage for guest users
      const guestItinerary = {
        destination,
        date,
        budget,
        travelType,
        activities,
        itinerary: itineraryText,
      };

      return NextResponse.json({ itinerary: guestItinerary });
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
