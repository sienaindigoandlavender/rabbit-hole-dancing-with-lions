"use client";

import Link from "next/link";
import { CITIES } from "@/app/lib/supabase";

interface NavigationProps {
  onCityClick?: (city: (typeof CITIES)[number]) => void;
}

export default function Navigation({ onCityClick }: NavigationProps) {
  return (
    <>
      {/* Top left — Brand */}
      <div className="fixed top-6 left-6 z-40">
        <Link
          href="/"
          className="font-serif text-xl text-cream hover:text-amber transition-colors"
        >
          Dancing with Lions
        </Link>
      </div>

      {/* Top right — City pills (desktop) */}
      <div className="hidden md:flex fixed top-6 right-6 z-40 gap-4">
        {CITIES.map((city) => (
          <button
            key={city.slug}
            onClick={() => onCityClick?.(city)}
            className="text-xs text-cream/60 hover:text-cream transition-colors font-sans"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Mobile — scrollable pills below brand */}
      <div className="md:hidden fixed top-14 left-0 right-0 z-40 overflow-x-auto px-6">
        <div className="flex gap-4 whitespace-nowrap pb-2">
          {CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => onCityClick?.(city)}
              className="text-xs text-cream/60 hover:text-cream transition-colors font-sans flex-shrink-0"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
