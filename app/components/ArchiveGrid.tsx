"use client";

import Link from "next/link";
import { DecoderPoint } from "@/app/lib/supabase";

interface ArchiveGridProps {
  points: DecoderPoint[];
}

function getArchiveNumber(point: DecoderPoint): string {
  const cityMap: Record<string, string> = {
    Marrakech: "MA",
    Fes: "MA",
    Essaouira: "MA",
    Rabat: "MA",
    Tangier: "MA",
    Casablanca: "MA",
    Ouarzazate: "MA",
    Agadir: "MA",
  };
  const code = cityMap[point.city] || "XX";
  const num = point.id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
}

export default function ArchiveGrid({ points }: ArchiveGridProps) {
  return (
    <div
      className="masonry-grid"
      style={{ padding: "26px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {points.map((point, index) => (
        <Link
          key={point.id}
          href={`/archive/${point.id}`}
          className="block group"
          style={{
            animation: `gridFadeIn 600ms var(--ease-phi) ${Math.min(index * 100, 1000)}ms both`,
          }}
        >
          {/* Hero image placeholder */}
          {point.hero_image && (
            <div className="overflow-hidden" style={{ borderRadius: "4px", marginBottom: "10px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={point.hero_image}
                alt={point.title}
                className="w-full h-auto transition-opacity duration-fast group-hover:opacity-100"
                style={{ opacity: 0.9 }}
              />
            </div>
          )}

          {/* Archive number */}
          <p
            className="font-sans"
            style={{ fontSize: "10px", color: "var(--text-tertiary)" }}
          >
            ({getArchiveNumber(point)})
          </p>

          {/* Title */}
          <p
            className="font-serif group-hover:text-terracotta transition-colors duration-fast"
            style={{
              fontSize: "16px",
              color: "var(--text-primary)",
              marginTop: "4px",
              lineHeight: "1.3",
            }}
          >
            {point.title}
          </p>
        </Link>
      ))}

      {/* Map portal card */}
      <Link
        href="/map"
        className="block group"
        style={{
          animation: `gridFadeIn 600ms var(--ease-phi) 300ms both`,
        }}
      >
        <div
          style={{
            background: "#111111",
            borderRadius: "4px",
            padding: "42px 26px",
            marginBottom: "10px",
          }}
        >
          <div className="flex justify-center" style={{ gap: "6px", marginBottom: "16px" }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#d4a254",
                  opacity: 0.5 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
          <p
            className="font-sans text-center"
            style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.6 }}
          >
            Explore the archive on the map →
          </p>
        </div>
      </Link>
    </div>
  );
}
