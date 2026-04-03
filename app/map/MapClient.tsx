"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DecoderPoint, CITIES } from "@/app/lib/supabase";
import MapExplorer from "@/app/components/MapExplorer";

interface MapClientProps {
  points: DecoderPoint[];
}

export default function MapClient({ points }: MapClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) return;

      // Try to match a city
      const city = CITIES.find(
        (c) =>
          c.name.toLowerCase() === q ||
          c.slug === q
      );
      if (city) {
        const flyTo = (
          window as unknown as Record<
            string,
            (lngLat: [number, number], zoom: number) => void
          >
        ).__mapFlyTo;
        if (flyTo) {
          flyTo(city.center, city.zoom);
        }
        setSearchOpen(false);
        setSearchQuery("");
        return;
      }

      // Try to match a point title or city name
      const point = points.find(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      if (point) {
        const flyTo = (
          window as unknown as Record<
            string,
            (lngLat: [number, number], zoom: number) => void
          >
        ).__mapFlyTo;
        if (flyTo) {
          flyTo([point.lng, point.lat], 14);
        }
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [points]
  );

  // ESC closes search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#111111" }}
    >
      {/* Brand — top left */}
      <div className="fixed z-50" style={{ top: "26px", left: "26px" }}>
        <Link
          href="/"
          className="font-serif transition-colors duration-fast"
          style={{
            fontSize: "16px",
            fontVariant: "small-caps",
            letterSpacing: "0.3em",
            color: "#f5f0e8",
          }}
        >
          Dancing with Lions
        </Link>
      </div>

      {/* Search — top right */}
      <div className="fixed z-50" style={{ top: "26px", right: "26px" }}>
        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            className="font-sans transition-colors duration-fast"
            style={{
              fontSize: "13px",
              color: "#f5f0e8",
              opacity: 0.6,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="flex items-center"
            style={{ gap: "10px" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities, places..."
              autoFocus
              className="font-sans bg-transparent focus:outline-none"
              style={{
                fontSize: "13px",
                color: "#f5f0e8",
                borderBottom: "1px solid rgba(245,240,232,0.2)",
                padding: "4px 0",
                width: "200px",
              }}
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="font-sans"
              style={{
                fontSize: "13px",
                color: "#f5f0e8",
                opacity: 0.3,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </form>
        )}
      </div>

      {/* Map fills entire viewport — no header, no padding */}
      <MapExplorer points={points} className="w-full h-screen" />

      {/* Flower of Life — dark */}
      <div className="flower-of-life-dark" />
    </div>
  );
}
