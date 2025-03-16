"use client";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { error } from "console";
import { setItinerary } from "../store/itinerarySlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";

const TravelForm = () => {
  // const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null); // FIX: Proper Type
  const fetchIdRef = useRef(0); // Tracks latest API request

  const { register, handleSubmit, control, watch, setValue } = useForm();
  const { user } = useUser();
  const userId = user?.id;

  const itinerary = useSelector(
    (state: RootState) => state.itinerary.itinerary
  );

  console.log("IT", itinerary);

  const onSubmit = async (data: any) => {
    setLoading(true); // ✅ Start loading

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      });

      const result = await response.json();
      if (response.ok) {
        dispatch(setItinerary(result.itinerary)); // Save to Redux
        router.push(`/itinerary`); // ✅ Redirect immediately
        return; // ✅ Prevent further execution (No need to set loading false)
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.log("Error", error);
    }

    setLoading(false); // ✅ Only set loading false if there’s an error
  };

  const travelTypes = [
    { name: "Family", icon: "/family.png" },
    { name: "Solo", icon: "/solo.png" },
    { name: "Friends", icon: "/friends.png" },
    { name: "Couple", icon: "/couple.png" },
  ];

  const budgets = [
    {
      budget: "Low",
      range: "0 - 1000 USD",
    },
    {
      budget: "Medium",
      range: "1000 - 2000 USD",
    },
    {
      budget: "High",
      range: "2000+ USD",
    },
  ];
  const activities = [
    "Outdoor Adventure",
    "City Sightseeing",
    "Beaches",
    "Food Exploration",
    "Hiking",
    "Cultural Tours",
  ];

  const selectedBudget = watch("budget") || "";
  const selectedActivities = watch("activities") || [];
  const selectedTravelType = watch("travelType") || "";
  const date = watch("date") || "";

  const today = startOfDay(new Date()); // Get today's date at midnight

  // Handle date selection
  const handleSelect: SelectRangeEventHandler = (selectedDate) => {
    if (!selectedDate) return; // Ensure valid date selection

    setValue("date", selectedDate); // Update form state

    // Close popover only when both start and end dates are selected
    if (selectedDate.from && selectedDate.to) {
      setOpen(false);
    }
  };

  const fetchSuggestions = async (query: any, fetchId: number) => {
    if (query.length < 2) return;
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=9aae5e7f02e045cfaaf6879208937f71`
      );
      const data = await response.json();
      setSuggestions(
        data.features.map((feature: any) => feature.properties.formatted)
      );
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleDestinationChange = (e: any) => {
    const value = e.target.value;
    setDestination(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim() === "") {
      setSuggestions([]); // Clear suggestions when input is empty
    } else {
      const fetchId = ++fetchIdRef.current;
      debounceRef.current = setTimeout(
        () => fetchSuggestions(value, fetchId),
        300
      );
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setDestination(suggestion);
    setSuggestions([]);
  };

  console.log(suggestions);

  return (
    <div className="">
      {loading ? (
        // ✅ Show loader while API is in progress
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-3 text-lg font-medium">Generating Itinerary...</p>
        </div>
      ) : (
        <form
          className="w-2/4 flex flex-col justify-evenly h-screen mx-auto mt-10 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative">
            <input type="hidden" {...register("date")} />
            <Label className="text-xl  font-medium ">
              Where do you plan to go?
            </Label>
            <Input
              className="mt-2 "
              type="text"
              placeholder="Paris"
              {...register("destination", { required: true })}
              value={destination}
              onChange={handleDestinationChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full  shadow-md max-h-40 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="">
            <Label className="text-xl  font-medium ">
              When are you planning to travel?
            </Label>
            <div className="mt-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !date?.from ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from || today}
                    selected={date}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    disabled={(day) =>
                      isBefore(day, today) ||
                      (date?.from
                        ? isAfter(day, addDays(date.from, 14))
                        : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label className="text-xl font-medium ">
              Select your trip type:
            </Label>
            <div className="flex justify-evenly mt-2 flex-wrap md:flex-nowrap gap-2">
              {travelTypes.map(({ name, icon }) => (
                <label
                  className={` cursor-pointer border rounded-md w-56 h-20 p-2 font-medium ${
                    selectedTravelType === name.toLowerCase()
                      ? "outline outline-2 outline-black"
                      : ""
                  }`}
                  key={name}
                >
                  <Input
                    className="mt-2 hidden"
                    type="radio"
                    {...register("travelType", { required: true })}
                    value={name.toLowerCase()}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Image width={30} height={20} src={icon} alt={name} />
                    <h1 className="text-lg">{name}</h1>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xl  font-medium  ">
              What is Your Budget?
            </Label>
            <div className="flex justify-evenly flex-wrap mt-2 gap-2">
              {budgets.map(({ budget, range }) => (
                <label
                  className={` cursor-pointer border rounded-md w-56 h-16 p-2 font-medium  ${
                    selectedBudget === budget.toLowerCase()
                      ? "outline outline-2 outline-black"
                      : ""
                  }`}
                  key={budget}
                >
                  <Input
                    className="mt-2 hidden"
                    type="radio"
                    {...register("budget", { required: true })}
                    value={budget.toLowerCase()}
                  />
                  <div className="flex flex-col  items-center justify-center">
                    <h1 className="text-lg">{budget}</h1>
                    <h6 className="text-sm text-gray-400">{range}</h6>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xl  font-medium ">
              Which activities are you interested in?
            </Label>
            <div className="flex justify-evenly flex-wrap gap-2 mt-2">
              {activities.map((activity) => {
                const isSelected = selectedActivities.includes(
                  activity.toLowerCase().replace(/ /g, "_")
                );
                return (
                  <label
                    key={activity}
                    className={`cursor-pointer border rounded-md w-56 h-16 p-2 font-medium  ${
                      isSelected ? "outline outline-2 outline-black" : ""
                    }`}
                  >
                    <Input
                      className="hidden"
                      type="checkbox"
                      {...register("activities")}
                      value={activity.toLowerCase().replace(/ /g, "_")}
                    />
                    {activity}
                  </label>
                );
              })}
            </div>
          </div>

          <Button className="w-1/4 self-center mt-2">Submit</Button>
        </form>
      )}
    </div>
  );
};

export default TravelForm;
