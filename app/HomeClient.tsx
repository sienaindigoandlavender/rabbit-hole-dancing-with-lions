"use client";

import { DecoderPoint, CITIES } from "@/app/lib/supabase";
import MapExplorer from "@/app/components/MapExplorer";
import Navigation from "@/app/components/Navigation";

interface HomeClientProps {
  points: DecoderPoint[];
}

export default function HomeClient({ points }: HomeClientProps) {
  const uniqueCities = new Set(points.map((p) => p.city));
  const totalPoints = points.length;
  const totalCities = uniqueCities.size;

  const handleCityClick = (city: (typeof CITIES)[number]) => {
    const flyTo = (
      window as unknown as Record<
        string,
        (lngLat: [number, number], zoom: number) => void
      >
    ).__mapFlyTo;
    if (flyTo) {
      flyTo(city.center, city.zoom);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navigation onCityClick={handleCityClick} />
      <MapExplorer points={points} />

      {/* Flower of Life overlay — sacred geometry watermark */}
      <div className="flower-of-life-bg" />

      {/* Bottom left — counter at phi position (desktop) */}
      <div
        className="fixed z-40 hidden md:block"
        style={{ bottom: "26px", left: "26px" }}
      >
        <span
          className="font-sans"
          style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}
        >
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>

      {/* Mobile — bottom centre counter */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 md:hidden"
        style={{ bottom: "26px" }}
      >
        <span
          className="font-sans"
          style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}
        >
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>
    </div>
  );
}
