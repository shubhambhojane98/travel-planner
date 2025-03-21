"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Itineraries = () => {
  const itinerary = useSelector(
    (state: RootState) => state.itinerary.itinerary
  );
  console.log("mytrip", itinerary);
  return <div>myTrip</div>;
};

export default Itineraries;
