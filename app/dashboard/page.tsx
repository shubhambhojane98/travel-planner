"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Trips = () => {
  const itinerary = useSelector(
    (state: RootState) => state.itinerary.itinerary
  );

  console.log("IT", itinerary);
  return <div>Trips</div>;
};

export default Trips;
