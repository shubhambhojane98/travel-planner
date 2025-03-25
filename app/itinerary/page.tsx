"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ItineraryPlan } from "../types/itineraryPlan";
import { useRouter } from "next/navigation";

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Trips</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : itineraries.length === 0 ? (
        <p className="text-gray-500">No itineraries found.</p>
      ) : (
        <ul className="space-y-4">
          {itineraries.map((trip) => (
            <div
              onClick={() => handleNavigate(trip._id)}
              key={trip._id}
              className="border p-4 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold">{trip.destination}</h3>
              {/* <p className="text-gray-600">{trip.description}</p> */}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Itineraries;
