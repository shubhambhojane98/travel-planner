import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <div className="flex flex-col  md:flex-row  m-3 gap-4">
        {/* Left Section */}
        <div className="w-full md:w-2/5  flex flex-col items-center text-center space-y-6 self-center ">
          <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
            Plan. Explore.{" "}
            <span className="text-gray-600 pb-1 border-b-4 border-blue-600">
              Experience.
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered trip planning made easy! Discover personalized
            itineraries, top recommendations, and seamless travel
            experiences—all in one place.
          </p>
          <Link href="/create-trip">
            <Button className="px-6 py-3 font-semibold">Get Started</Button>
          </Link>
        </div>

        {/* Right Section */}
        <div className=" hidden   md:flex justify-evenly w-full md:w-3/5 gap-4">
          <div className="flex flex-col justify-center space-y-4">
            <Image
              alt="Home"
              className="rounded-md max-w-full"
              src="https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              width={250}
              height={250}
            />
            <Image
              alt="Home"
              className="rounded-md max-w-full"
              src="https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              width={250}
              height={250}
            />
          </div>
          <div className="self-center">
            <Image
              src="https://images.pexels.com/photos/20170699/pexels-photo-20170699/free-photo-of-paris.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Home"
              className="h-1/4 shadow-sm rounded-md max-w-full"
              width={400}
              height={500}
            />
          </div>
        </div>
      </div>
      <div className="pt-5">
        <h1 className="text-center text-2xl font-semibold">
          Your AI Guide to Perfect Trips
        </h1>
        <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl mx-auto p-4">
          {/* Feature 1: Date-wise itinerary planning */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={28} />
                <h3 className="text-xl font-semibold text-gray-800">
                  Date-wise Itinerary
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Get a personalized day-by-day breakdown of your trip. Our AI
                plans out activities, travel suggestion, and breaks, so you can
                explore stress-free.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2: Local attraction suggestions */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-green-600" size={28} />
                <h3 className="text-xl font-semibold text-gray-800">
                  Local Attractions
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Discover must-visit spots, hidden gems, and cultural highlights
                around your destination, tailored to your travel style and
                interests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
