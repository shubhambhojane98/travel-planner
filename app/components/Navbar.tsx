"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  const navItems = [
    { name: "Recommended Trip", path: "/" },
    { name: "Create Trip", path: "/create-trip" },
    ...(isSignedIn ? [{ name: "My Trip", path: "/itinerary" }] : []),
  ];

  return (
    <nav className="bg-black text-white px-6 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">AI Trip Planner</h1>

        {/* Hamburger Menu (Visible on Mobile) */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map(({ name, path }) => (
            <li
              key={name}
              className="relative pb-2 cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              <Link href={path}>{name}</Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons with Flicker Prevention */}
        <div className="hidden md:block">
          {!isLoaded ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile Menu (Shown when Open) */}
      {isOpen && (
        <ul className="flex flex-col mt-4 space-y-4 md:hidden">
          {navItems.map(({ name, path }) => (
            <li
              key={name}
              className="cursor-pointer text-center py-2 border-b border-white"
              onClick={() => setIsOpen(false)}
            >
              <Link href={path}>{name}</Link>
            </li>
          ))}
          <div className="text-center">
            {!isLoaded ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton>
                <Button variant="secondary">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
