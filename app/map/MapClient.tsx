"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { DecoderPoint, CITIES } from "@/app/lib/supabase";
import MapExplorer from "@/app/components/MapExplorer";

interface MapClientProps {
  points: DecoderPoint[];
}

export default function MapClient({ points }: MapClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return points
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [points, searchQuery]);

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

      {/* Search — top right, terminal style */}
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
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
              className="flex items-center"
              style={{ gap: "10px" }}
            >
              <span style={{ fontSize: "13px", color: "#d4a254", fontFamily: "monospace" }}>›</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                autoFocus
                className="bg-transparent focus:outline-none"
                style={{
                  fontSize: "13px",
                  color: "#f5f0e8",
                  fontFamily: "monospace",
                  padding: "4px 0",
                  width: "200px",
                  border: "none",
                }}
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                style={{ fontSize: "13px", color: "#f5f0e8", opacity: 0.3, background: "none", border: "none", cursor: "pointer" }}
              >
                ×
              </button>
            </form>
            {/* Live results */}
            {searchQuery.length >= 2 && (
              <div style={{ marginTop: "6px", maxHeight: "200px", overflowY: "auto" }}>
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      const flyTo = (window as unknown as Record<string, (lngLat: [number, number], zoom: number) => void>).__mapFlyTo;
                      if (flyTo) flyTo([r.lng, r.lat], 14);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="block w-full text-left transition-colors duration-fast"
                    style={{
                      padding: "6px 0 6px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: "#f5f0e8",
                      opacity: 0.6,
                    }}
                  >
                    <span style={{ color: "#d4a254" }}>{r.city}</span>
                    <span style={{ opacity: 0.3 }}> — </span>
                    {r.title}
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <p style={{ padding: "6px 0 6px 16px", fontSize: "11px", fontFamily: "monospace", color: "#f5f0e8", opacity: 0.3 }}>
                    no results
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map — global view: centre [20, 15], zoom 2 */}
      <MapExplorer points={points} center={[20, 15]} zoom={2} showStyleToggle showCoordinates className="w-full h-screen" />

      {/* Flower of Life — dark */}
      <div className="flower-of-life-dark" />

      {/* Counter — bottom left, above coordinates */}
      <div className="fixed z-40" style={{ bottom: "42px", left: "26px" }}>
        <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.25, fontFamily: "monospace" }}>
          {points.length} signals · {Array.from(new Set(points.map((p) => p.city))).length || 1} countries
        </span>
      </div>
    </div>
  );
}
