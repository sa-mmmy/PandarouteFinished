"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div  >
      {/* Menu Button */}
      <button
        className="md:hidden text-white ml-auto hover:text-white absolute right-4 top-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <div
        className={`z-50 absolute top-14 right-0 bg-green-800 w-48 h-auto p-4 shadow-lg rounded-b-lg ${
            isOpen ? "block" : "hidden"
          } transition-all duration-300`}
      >
        <nav className="flex flex-col space-y-4">
          {/* <Link href="/about" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
            About
          </Link>*/}
          <Link href="/" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </nav>
      </div>
    </div>
  );
}