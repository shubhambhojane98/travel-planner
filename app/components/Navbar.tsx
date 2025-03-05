"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Recommended Trip", path: "/recommended" },
    { name: "Create Trip", path: "/itinerary" },
    { name: "My Trip", path: "/my-trips" },
  ];

  return (
    <nav className="bg-black text-white px-6 py-3  shadow-lg">
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

        {/* Sign In Button */}
        <Button variant="secondary">Sign In</Button>
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
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Sign In
          </Button>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
