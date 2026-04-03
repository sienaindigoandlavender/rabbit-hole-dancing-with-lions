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

      const city = CITIES.find(
        (c) => c.name.toLowerCase() === q || c.slug === q
      );
      if (city) {
        const flyTo = (
          window as unknown as Record<string, (lngLat: [number, number], zoom: number) => void>
        ).__mapFlyTo;
        if (flyTo) flyTo(city.center, city.zoom);
        setSearchOpen(false);
        setSearchQuery("");
        return;
      }

      const point = points.find(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
      if (point) {
        const flyTo = (
          window as unknown as Record<string, (lngLat: [number, number], zoom: number) => void>
        ).__mapFlyTo;
        if (flyTo) flyTo([point.lng, point.lat], 14);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [points]
  );

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
    <div className="w-full h-screen overflow-hidden" style={{ background: "#111111" }}>
      {/* Brand — floating top left */}
      <div className="fixed z-50" style={{ top: "26px", left: "26px" }}>
        <Link
          href="/"
          className="font-serif transition-colors duration-fast hover:text-amber"
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

      {/* Search — floating top right */}
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
            {searchQuery.length >= 2 && (
              <div
                className="absolute right-0"
                style={{
                  marginTop: "6px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "rgba(17,17,17,0.95)",
                  border: "1px solid #2a2a2a",
                  borderRadius: "4px",
                  padding: "6px 0",
                  minWidth: "240px",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
                }}
              >
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
                      padding: "6px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: "#f5f0e8",
                      opacity: 0.7,
                    }}
                  >
                    <span style={{ color: "#d4a254" }}>{r.city}</span>
                    <span style={{ opacity: 0.3 }}> — </span>
                    {r.title}
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <p style={{ padding: "6px 16px", fontSize: "11px", fontFamily: "monospace", color: "#f5f0e8", opacity: 0.3 }}>
                    no results
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map — full screen, edge to edge, immersive */}
      <MapExplorer
        points={points}
        center={[20, 15]}
        zoom={1.8}
        showStyleToggle
        showCoordinates
        mapStyle="dark"
        className="w-full h-screen"
      />

      {/* Flower of Life — dark */}
      <div className="flower-of-life-dark" />
    </div>
  );
}
