"use client";

import { DecoderPoint, CITIES } from "@/app/lib/supabase";
import MapExplorer from "@/app/components/MapExplorer";
import ArchiveHeader from "@/app/components/ArchiveHeader";

interface MapClientProps {
  points: DecoderPoint[];
}

export default function MapClient({ points }: MapClientProps) {
  const uniqueCities = Array.from(new Set(points.map((p) => p.city)));
  const totalPoints = points.length;
  const totalCities = uniqueCities.length;

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
    <div className="relative w-full h-screen overflow-hidden theme-dark" style={{ background: "#111111" }}>
      <ArchiveHeader inverted />

      {/* City pills */}
      <div
        className="hidden md:flex fixed z-40"
        style={{ top: "26px", right: "200px", gap: "26px" }}
      >
        {CITIES.map((city) => (
          <button
            key={city.slug}
            onClick={() => handleCityClick(city)}
            className="font-sans transition-colors duration-fast"
            style={{
              fontSize: "10px",
              color: "#f5f0e8",
              opacity: 0.6,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Map fills viewport below header */}
      <div style={{ paddingTop: "68px", height: "100vh" }}>
        <MapExplorer points={points} className="w-full h-full" />
      </div>

      {/* Flower of Life — dark version */}
      <div className="flower-of-life-dark" />

      {/* Counter */}
      <div className="fixed z-40 hidden md:block" style={{ bottom: "26px", left: "26px" }}>
        <span className="font-sans" style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}>
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>

      <div className="fixed left-1/2 -translate-x-1/2 z-40 md:hidden" style={{ bottom: "26px" }}>
        <span className="font-sans" style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}>
          {totalPoints} secrets across {totalCities} cities
        </span>
      </div>
    </div>
  );
}
