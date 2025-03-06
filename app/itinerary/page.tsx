"use client";
import React, { useState } from "react";
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
import { DateRange } from "react-day-picker";
import Image from "next/image";

const TravelForm = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm();
  const onSubmit = (data: any) => console.log(data);

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

  const today = startOfDay(new Date()); // Get today's date at midnight

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange?.to) {
      setDate(selectedRange);
      setOpen(false); // Close popover when a valid range is selected
    } else {
      setDate(selectedRange);
    }
  };

  return (
    <div className="">
      <form
        className="w-2/4 flex flex-col justify-evenly h-screen mx-auto mt-10 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <Label className="text-xl  font-medium ">
            Where do you plan to go?
          </Label>
          <Input
            className="mt-2"
            type="text"
            placeholder="Paris"
            {...register("destination", { required: true })}
            // value={destination}
          />
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
                  selected={date} // Ensure proper type
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={
                    (day) =>
                      isBefore(day, today) || // Disable past dates
                      (date?.from
                        ? isAfter(day, addDays(date.from, 14))
                        : false) // Disable dates beyond 14 days from selected start date
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-xl font-medium ">Select your trip type:</Label>
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
          <Label className="text-xl  font-medium  ">What is Your Budget?</Label>
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
    </div>
  );
};

export default TravelForm;
