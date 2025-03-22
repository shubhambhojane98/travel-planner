"use client";
import ItineraryCard from "@/app/components/ItineraryCard";
import Map from "@/app/components/Map";
import { RootState } from "@/app/store/store";
import { ItineraryItem, ItineraryPlan } from "@/app/types/itineraryPlan";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useSelector } from "react-redux";

const Itinerary = () => {
  const params = useParams();
  const id = params.id;

  const [trip, setTrip] = useState<ItineraryPlan | null>(null);
  const [error, setError] = useState<string>("");

  console.log("ID", id);

  useEffect(() => {
    if (!id) return;

    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/itinerary/${id}`);
        const data: ItineraryPlan = await response.json();
        console.log("DATA", data);

        if (!response.ok) throw new Error("Failed to load itinerary");
        setTrip(data);
      } catch (err) {
        setError((err as Error).message || "An unknown error occurred");
      }
    };

    fetchItinerary();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!trip) return <p>Loading itineraries...</p>;

  return (
    // <div>
    //   <ItineraryCard trip={trip} />
    //   <Map locations={trip.itinerary} />
    // </div>

    <div className="flex flex-col md:flex-row gap-4 px-4 md:px-6 pt-4 md:pt-6">
      {/* Itinerary Card - Full width on small screens, 50% on medium+ */}
      <div className="w-full md:w-1/2">
        <ItineraryCard trip={trip} />
      </div>

      {/* Map Section - Prevents touching the top */}
      <div className="w-full md:w-[48%] h-[400px] rounded-lg overflow-hidden shadow-lg md:self-start">
        <Map locations={trip.itinerary} />
      </div>
    </div>
  );
};

export default Itinerary;
