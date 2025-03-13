import connectMongoDB from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  await connectMongoDB(); // Ensure DB connection is awaited

  try {
    const { userId, destination, date, budget, travelType, activities } =
      await req.json();

    if (!destination || !date?.from || !date?.to) {
      return NextResponse.json(
        {
          error: "Missing required fields: destination, date.from, or date.to",
        },
        { status: 400 }
      );
    }

    const prompt = `
    Generate a concise travel itinerary for ${destination} from ${date.from} to ${date.to}.
    Use a compact JSON format with:
    - "day": "Day X"
    - "date": "YYYY-MM-DD"
    - "activities": [{"time": "HH:mm", "activity": "Brief Title", "details": "Brief description"}]
    - "recommendations": ["Short tip 1", "Short tip 2"]
    
    Ensure every activity has a "details" field.
    Keep descriptions minimal and within 1000 tokens.
    Return **only** the JSON, without extra text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const itineraryText = response.choices[0]?.message?.content?.trim();
    console.log("OpenAI Response:", itineraryText);

    if (!itineraryText) {
      console.error("Received null itinerary text");
      return NextResponse.json({ error: "Itinerary data is missing" });
    }

    // Clean the OpenAI response (remove Markdown JSON formatting)
    const cleanedText = itineraryText.replace(/```json|```/g, "").trim();

    let itineraryJson;
    try {
      itineraryJson = JSON.parse(cleanedText);

      // Validate that itinerary items contain required fields
      if (
        !Array.isArray(itineraryJson.itinerary) ||
        itineraryJson.itinerary.some((item: any) => !item.day || !item.date)
      ) {
        throw new Error("Invalid itinerary format: Missing 'day' or 'date'");
      }
    } catch (error) {
      console.error("Error parsing itinerary JSON:", error);
      return NextResponse.json({ error: "Failed to parse itinerary JSON" });
    }

    if (userId) {
      // Save itinerary to MongoDB
      try {
        const newItinerary = await Itinerary.create({
          userId,
          destination,
          date,
          budget,
          travelType,
          activities,
          itinerary: itineraryJson.itinerary, // Ensure proper structure
        });
        console.log("Saved Itinerary:", newItinerary);
        return NextResponse.json({ success: true, itinerary: newItinerary });
      } catch (mongoError: any) {
        console.error("MongoDB Error:", mongoError);
        return NextResponse.json(
          { error: "Database validation failed", details: mongoError.message },
          { status: 500 }
        );
      }
    } else {
      // Return itinerary for guest users
      return NextResponse.json({
        itinerary: {
          destination,
          date,
          budget,
          travelType,
          activities,
          itinerary: itineraryJson.itinerary,
        },
      });
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
