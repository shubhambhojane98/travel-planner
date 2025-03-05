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

const TravelForm = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, watch } = useForm();
  const onSubmit = (data: any) => console.log(data);

  const travelTypes = ["Family", "Solo", "Friends", "Couple"];
  const budgets = ["Low", "Medium", "High"];
  const activities = [
    "Outdoor Adventure",
    "City Sightseeing",
    "Beaches",
    "Food Exploration",
    "Hiking",
    "Cultural Tours",
  ];

  const selectedBudget = watch("budget");
  const selectedActivities = watch("activities") || [];
  const selectedTravel = watch("travelType");

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
          <div className="flex justify-evenly mt-2">
            {travelTypes.map((travel) => (
              <label
                className={` cursor-pointer border rounded-md py-4 px-8  font-medium ${
                  selectedTravel === travel.toLowerCase()
                    ? "outline outline-2 outline-black"
                    : ""
                }`}
                key={travel}
              >
                <Input
                  className="mt-2 hidden"
                  type="radio"
                  {...register("travelType", { required: true })}
                  value={travel.toLowerCase()}
                />
                {travel}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xl  font-medium ">What is Your Budget?</Label>
          <div className="flex justify-evenly mt-2">
            {budgets.map((budget) => (
              <label
                className={` cursor-pointer border rounded-md py-4 px-8 font-medium  ${
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
                {budget}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xl  font-medium ">
            Which activities are you interested in?
          </Label>
          <div className="flex justify-evenly flex-wrap space-x-2 space-y-3 mt-2">
            {activities.map((activity) => {
              const isSelected = selectedActivities.includes(
                activity.toLowerCase().replace(/ /g, "_")
              );
              return (
                <label
                  key={activity}
                  className={`cursor-pointer border rounded-md py-4 px-8 font-medium ${
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

        <Button className="w-1/4 self-center">Submit</Button>
      </form>
    </div>
  );
};

export default TravelForm;
