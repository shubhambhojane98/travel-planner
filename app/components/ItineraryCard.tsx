import React from "react";
import { ItineraryItem, ItineraryPlan } from "../types/itineraryPlan";

const ItineraryCard = ({ trip }: any) => {
  if (!trip || trip.length === 0) {
    return <p>No itinerary available.</p>; // Handle empty state
  }
  console.log(trip);
  return (
    <div className="max-w-2xl m-10  p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold">{trip.destination}</h1>
      <p className="text-gray-500">
        {new Date(trip.date.from).toDateString()} -{" "}
        {new Date(trip.date.to).toDateString()}
      </p>

      {trip.itinerary.map((item: ItineraryItem, index: any) => (
        <div
          key={item._id || index}
          className="mt-6 p-4 bg-gray-100 rounded-lg"
        >
          <p className="text-gray-700 text-right">
            Estimated Budget: ${item.budget_estimate}
          </p>

          <h2 className="text-xl font-semibold">{item.day}</h2>
          <p className="text-gray-500">{item.date}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Activities</h3>
            <p className="text-gray-700">{item.activities}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <p className="text-gray-700">{item.recommendations}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Transport Suggestions</h3>
            <p className="text-gray-700">{item.transport_suggestion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryCard;
