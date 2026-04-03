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

      {/* Bottom left — counter */}
      <div className="fixed bottom-6 left-6 z-40 md:block hidden">
        <span className="text-xs font-sans text-cream/40">
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>

      {/* Mobile — bottom centre counter */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <span className="text-xs font-sans text-cream/40">
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>
    </div>
  );
}
