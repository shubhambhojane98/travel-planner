import { Button } from "@/components/ui/button";
import Image from "next/image";

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
          <Button className="px-6 py-3 font-semibold">Get Started</Button>
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
      <div>
        <h1>Your AI Guide to Perfect Trips</h1>
      </div>
    </div>
  );
}
