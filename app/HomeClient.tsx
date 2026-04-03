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
    const flyTo = (window as unknown as Record<string, (lat: number, lng: number) => void>).__mapFlyTo;
    if (flyTo) {
      flyTo(city.lat, city.lng);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navigation onCityClick={handleCityClick} />
      <MapExplorer points={points} />
      <div className="fixed bottom-4 left-6 z-30">
        <p className="font-sans text-xs text-cream/30">
          {totalPoints} secrets across {totalCities} cities
        </p>
      </div>
    </div>
  );
}
