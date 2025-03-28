"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ItineraryPlan } from "../types/itineraryPlan";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Itineraries = () => {
  const [itineraries, setItineraries] = useState<ItineraryPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("/api/itinerary");
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleNavigate = (id: string) => {
    router.push(`/itinerary/${id}`);
  };

  return (
    <div className="m-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Trips</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : itineraries.length === 0 ? (
        <p className="text-gray-500">No itineraries found.</p>
      ) : (
        <div className="flex flex-wrap gap-4 ">
          {itineraries.map((trip) => (
            <div
              onClick={() => handleNavigate(trip._id)}
              key={trip._id}
              className="relative w-[400px] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
            >
              <Image
                alt="Destination"
                width={300}
                height={200}
                src={trip.image} // Provide a default image
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0  flex items-end justify-end ">
                <h3 className="text-xl p-4  text-white font-bold ">
                  {trip.destination}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itineraries;
