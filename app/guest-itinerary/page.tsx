"use client";
import { useEffect, useState } from "react";
import { ItineraryItem } from "../types/itineraryPlan";
import ItineraryCard from "../components/ItineraryCard";
import { usePathname } from "next/navigation";

const GuestItinerary = () => {
  console.log("Component is rendering...");

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    console.log("useEffect is running...");

    try {
      const storedItinerary = localStorage.getItem("guestItinerary");
      console.log("Stored Itinerary:", storedItinerary);

      if (storedItinerary) {
        setItinerary(JSON.parse(storedItinerary));
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  return (
    <div>
      <ItineraryCard trip={itinerary} />
    </div>
  );
};

export default GuestItinerary;
