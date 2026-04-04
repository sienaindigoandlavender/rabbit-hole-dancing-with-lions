"use client";

import Link from "next/link";
import { DecoderPoint } from "@/app/lib/supabase";

interface ArchiveGridProps {
  points: DecoderPoint[];
}

function getArchiveNumber(point: DecoderPoint): string {
  const cityMap: Record<string, string> = {
    Marrakech: "MA", Fes: "MA", Essaouira: "MA", Rabat: "MA",
    Tangier: "MA", Casablanca: "MA", Ouarzazate: "MA", Agadir: "MA",
  };
  const code = cityMap[point.city] || "XX";
  const num = point.id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
}

export default function ArchiveGrid({ points }: ArchiveGridProps) {
  return (
    <div
      style={{
        padding: "0 42px 110px",
        maxWidth: "1400px",
        margin: "0 auto",
        columns: "3",
        columnGap: "42px",
      }}
      className="cereal-grid"
    >
      <style jsx>{`
        @media (max-width: 1024px) {
          .cereal-grid { columns: 2 !important; }
        }
        @media (max-width: 640px) {
          .cereal-grid { columns: 1 !important; }
        }
      `}</style>

      {points.map((point, index) => (
        <Link
          key={point.id}
          href={`/dossiers/${point.id}`}
          className="block group"
          style={{
            breakInside: "avoid",
            marginBottom: "42px",
            animation: `gridFadeIn 600ms var(--ease-phi) ${Math.min(index * 80, 800)}ms both`,
          }}
        >
          {/* Photo — varied aspect ratios like Cereal */}
          {point.photo_url && (
            <div style={{ marginBottom: "16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={point.photo_url}
                alt={point.title}
                className="w-full h-auto transition-opacity duration-fast group-hover:opacity-100"
                style={{ opacity: 0.92, display: "block" }}
              />
            </div>
          )}

          {/* Archive number — tiny, barely there */}
          <p
            className="font-sans"
            style={{
              fontSize: "9px",
              color: "#9b978f",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            ({getArchiveNumber(point)})
          </p>

          {/* Title — the only thing that matters */}
          <p
            className="font-serif group-hover:text-terracotta transition-colors duration-fast"
            style={{
              fontSize: "15px",
              color: "#1a1a1a",
              lineHeight: "1.35",
              fontWeight: 400,
            }}
          >
            {point.title}
          </p>
        </Link>
      ))}

      {/* Map portal — dark card in the grid */}
      <Link
        href="/"
        className="block group"
        style={{
          breakInside: "avoid",
          marginBottom: "42px",
          animation: `gridFadeIn 600ms var(--ease-phi) 400ms both`,
        }}
      >
        <div
          style={{
            background: "#111111",
            padding: "68px 26px",
          }}
        >
          <div className="flex justify-center" style={{ gap: "6px", marginBottom: "16px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  background: "#d4a254",
                  opacity: 0.4 + i * 0.12,
                }}
              />
            ))}
          </div>
          <p
            className="font-sans text-center"
            style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.5, letterSpacing: "0.05em" }}
          >
            Explore on the map →
          </p>
        </div>
      </Link>
    </div>
  );
}
