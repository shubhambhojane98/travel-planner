import connectMongoDB from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Function to fetch images from Pexels
const fetchImageFromPexels = async (query: string) => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
      }
    );
    const data = await response.json();
    return data.photos.length > 0 ? data.photos[0].src.large : null;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return null;
  }
};

export async function POST(req: Request) {
  await connectMongoDB(); // Ensure DB connection is awaited

  try {
    const {
      userId,
      destination,
      date,
      budget,
      travelType,
      activities,
      from,
      to,
    } = await req.json();

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
    - Travel Dates: ${from} to ${to}.
    - Budget: ${budget}.
    - Travel Type: ${travelType}.
    - Preferred Activities: ${activities}.
    
    Return JSON in the following format:
    {
      "visit": "Clear destination name  for eg- Paris,India, Zurich,Dublin",
      "best_time": "Recommended travel period.",
      "itinerary": [
        {
          "day": "Day X - Title",
          "date": "YYYY-MM-DD",
          "activities": "Activity 1, Activity 2, Activity 3.", 
          "recommendations": "Tip 1, Tip 2.",
          "budget_estimate": "Estimated cost for the day in USD.",
          "transport_suggestion": "Suggested transport options.",
          "image_keywords": "keyword1, keyword2, keyword3",
          "lat": 0.0000,
          "lon": 0.0000
        }
      ]
    }
    **Ensure:**
    - Activities should be detailed and engaging.
    - Recommendations should be a single string (comma-separated).
    - "budget_estimate" is tailored to travel type ${budget} in USD (number only, no labels like 'low', 'medium', or 'high'). (low/medium/high).
    - "transport_suggestion" includes metro, taxi, local transport  or walkability insights.
    - "best_time" should provide the ideal months or seasons for visiting based on weather, crowd levels, and cultural events.
    "image_keywords" should contain one highly relevant keyword that best represents the day's itinerary, focusing on landmarks, destinations, or cultural attractions (e.g., "Eiffel Tower," "Interlaken Lake," "Taj Mahal").    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
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

    console.log(
      "Itinerary being saved:",
      JSON.stringify(itineraryJson, null, 2)
    );

    // **Fetch Images from Pexels for Each Day**
    const enrichedItinerary = await Promise.all(
      itineraryJson.itinerary.map(async (day: any) => {
        const image = await fetchImageFromPexels(`${day.image_keywords}`);
        return { ...day, image: image || "" };
      })
    );

    const finalItinerary = {
      ...itineraryJson, // Keep other properties unchanged
      itinerary: enrichedItinerary, // Update itinerary with images
    };

    const common_image = await fetchImageFromPexels(destination);

    console.log(
      "Final Itinerary with Images:",
      JSON.stringify(finalItinerary, null, 2)
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
          image: common_image,
          visit: finalItinerary.visit,
          best_time: finalItinerary.best_time,
          itinerary: finalItinerary.itinerary.map((day: any) => ({
            day: day.day,
            date: day.date,
            activities: day.activities,
            recommendations: day.recommendations,
            budget_estimate: day.budget_estimate,
            transport_suggestion: day.transport_suggestion,
            image: day.image || "", // 🔥 Force image field inclusion
            lat: day.lat,
            lon: day.lon,
          })),
        });
        const savedItinerary = await Itinerary.findById(newItinerary._id);
        console.log(
          "🔵 Retrieved Itinerary from DB:",
          JSON.stringify(savedItinerary, null, 2)
        );

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
          visit: itineraryJson.visit,
          best_time: itineraryJson.best_time,
          activities: Array.isArray(activities)
            ? activities.join(", ")
            : activities || "",
          image: common_image,
          itinerary: enrichedItinerary.map((day: any) => ({
            ...day,
            image: day.image || "", // ✅ Ensures image is always included
            lat: day.lat,
            lon: day.lon,
          })),
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

export async function GET() {
  try {
    await connectMongoDB();
    const itineraries = await Itinerary.find();

    if (!itineraries) {
      return NextResponse.json(
        { error: "Itineraries not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(itineraries);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
