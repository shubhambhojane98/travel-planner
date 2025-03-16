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

    // **Updated Prompt to Expect String Activities & Recommendations**
    const prompt = `
    Generate a detailed travel itinerary for a trip to ${destination}.
- Travel Dates: ${date.from} to ${date.to}
- Budget: ${budget}
- Travel Type: ${travelType}
- Preferred Activities: ${activities}
    Return JSON in the following format:
    [
      {
        "day": "Day X - Title",
        "date": "YYYY-MM-DD",
        "activities": "Activity 1, Activity 2, Activity 3", 
        "recommendations": "Tip 1, Tip 2"
      }
    ]
    Ensure activities should be in detail and recommendations are always **single strings** (comma-separated).
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
      console.log("Parsed Itinerary:", itineraryJson);
    } catch (error) {
      console.error("Error parsing itinerary JSON:", error);
      return NextResponse.json({ error: "Failed to parse itinerary JSON" });
    }

    // **Ensure activities & recommendations are stored as single strings**
    // itineraryJson = itineraryJson.map((day: any) => ({
    //   ...day,
    //   activities: typeof day.activities === "string" ? day.activities : "",
    //   recommendations:
    //     typeof day.recommendations === "string" ? day.recommendations : "",
    // }));

    console.log(
      "Itinerary being saved:",
      JSON.stringify(itineraryJson, null, 2)
    );

    if (userId) {
      // Save itinerary to MongoDB
      try {
        const newItinerary = await Itinerary.create({
          userId,
          destination,
          date,
          budget,
          travelType,
          activities: Array.isArray(activities)
            ? activities.join(", ")
            : activities || "", // Convert to single string
          itinerary: itineraryJson, // Ensure proper structure
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
          activities: Array.isArray(activities)
            ? activities.join(", ")
            : activities || "",
          itinerary: itineraryJson,
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
