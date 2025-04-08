"use client";
import { useEffect, useState } from "react";
import { ItineraryPlan } from "../types/itineraryPlan";
// import ItineraryCard from "../components/ItineraryCard";
// import Map from "../components/Map";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const ItineraryCard = dynamic(() => import("../components/ItineraryCard"), {
  ssr: false,
});

const GuestItinerary: React.FC = () => {
  console.log("Component is rendering...");

  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null); //  Changed from array to object

  useEffect(() => {
    console.log("useEffect is running...");

    const storedItinerary = localStorage.getItem("guestItinerary");
    console.log("Stored Itinerary:", storedItinerary);

    if (storedItinerary && storedItinerary !== "undefined") {
      //  Check if it's not null or "undefined"
      try {
        const parsedItinerary: ItineraryPlan = JSON.parse(storedItinerary);
        setItinerary(parsedItinerary);
      } catch (error) {
        console.error("Error parsing guestItinerary:", error);
      }
    }
  }, []);

  if (!itinerary) {
    return <p>Loading itinerary...</p>; // Handle null case properly
  }

  console.log("I", itinerary.itinerary);

  return (
    <div className="flex flex-col md:flex-col gap-4 px-4 md:px-6 pt-4 md:pt-6">
      {/* Itinerary Card - Full width on small screens, 50% on medium+ */}
      <div className="w-full flex justify-center">
        <ItineraryCard trip={itinerary} />
      </div>

      {/* Map Section - Prevents touching the top */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg md:self-start mb-5">
        <Map locations={itinerary.itinerary} />
      </div>
    </div>
  );
};

export default GuestItinerary;
