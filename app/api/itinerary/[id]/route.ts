import Itinerary from "@/models/Itinerary";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    if (!id)
      return NextResponse.json(
        { error: "Itinerary ID is required" },
        { status: 400 }
      );

    const itinerary = await Itinerary.findOne({ _id: id });
    console.log("itinerary", itinerary);

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
