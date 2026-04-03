"use client";

import Link from "next/link";
import { CITIES } from "@/app/lib/supabase";

interface NavigationProps {
  onCityClick?: (city: (typeof CITIES)[number]) => void;
}

export default function Navigation({ onCityClick }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none">
      <Link
        href="/"
        className="font-serif text-xl text-cream pointer-events-auto hover:text-amber transition-colors"
      >
        Dancing with Lions
      </Link>
      <div className="hidden md:flex items-center gap-1 pointer-events-auto">
        {CITIES.map((city, i) => (
          <span key={city.slug} className="flex items-center">
            <button
              onClick={() => onCityClick?.(city)}
              className="text-sm text-cream/70 hover:text-cream transition-colors font-sans"
            >
              {city.name}
            </button>
            {i < CITIES.length - 1 && (
              <span className="text-cream/30 mx-1">·</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
