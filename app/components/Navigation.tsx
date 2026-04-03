"use client";

import Link from "next/link";
import { CITIES } from "@/app/lib/supabase";

interface NavigationProps {
  onCityClick?: (city: (typeof CITIES)[number]) => void;
}

export default function Navigation({ onCityClick }: NavigationProps) {
  return (
    <>
      {/* Top left — Brand at phi position */}
      <div className="fixed z-40" style={{ top: "26px", left: "26px" }}>
        <Link
          href="/"
          className="font-serif text-cream hover:text-amber transition-colors duration-fast"
          style={{ fontSize: "20px" }}
        >
          Dancing with Lions
        </Link>
      </div>

      {/* Top right — City pills (desktop) at phi spacing */}
      <div
        className="hidden md:flex fixed z-40"
        style={{ top: "26px", right: "26px", gap: "26px" }}
      >
        {CITIES.map((city) => (
          <button
            key={city.slug}
            onClick={() => onCityClick?.(city)}
            className="font-sans text-cream/60 hover:text-cream transition-colors duration-fast"
            style={{
              fontSize: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Mobile — scrollable pills below brand */}
      <div
        className="md:hidden fixed left-0 right-0 z-40 overflow-x-auto"
        style={{ top: "58px", paddingLeft: "26px", paddingRight: "26px" }}
      >
        <div className="flex whitespace-nowrap pb-2" style={{ gap: "26px" }}>
          {CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => onCityClick?.(city)}
              className="font-sans text-cream/60 hover:text-cream transition-colors duration-fast flex-shrink-0"
              style={{
                fontSize: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
