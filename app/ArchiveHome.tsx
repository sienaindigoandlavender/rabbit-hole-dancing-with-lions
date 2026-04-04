"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DecoderPoint } from "@/app/lib/supabase";

interface ArchiveHomeProps {
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

export default function ArchiveHome({ points }: ArchiveHomeProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    return Array.from(new Set(points.map((p) => p.category).filter(Boolean)));
  }, [points]);

  const filtered = useMemo(() => {
    if (!activeFilter) return points;
    return points.filter((p) => p.category === activeFilter || p.trail === activeFilter);
  }, [points, activeFilter]);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0" }}>
      {/* ═══ HEADER — Cereal minimal ═══ */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 42px",
          height: "52px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "14px",
            fontVariant: "small-caps",
            letterSpacing: "0.35em",
            color: "#1a1a1a",
            textDecoration: "none",
          }}
        >
          Dancing with Lions
        </Link>
        <div style={{ display: "flex", gap: "42px", alignItems: "center" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "#9b978f",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            {showFilters ? "Close" : "Filter"}
          </button>
          <Link
            href="/about"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "#9b978f",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Information
          </Link>
        </div>
      </header>

      {/* Thin rule */}
      <div style={{ height: "1px", background: "#e5e2db", margin: "0 42px" }} />

      {/* ═══ FILTER PANEL — hidden by default ═══ */}
      {showFilters && (
        <div style={{ padding: "26px 42px", borderBottom: "1px solid #e5e2db" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "68px" }}>
            {categories.length > 0 && (
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#9b978f", marginBottom: "10px" }}>
                  Categories
                </p>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveFilter(activeFilter === c ? null : c)}
                    style={{
                      display: "block",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: activeFilter === c ? "#1a1a1a" : "#9b978f",
                      textDecoration: activeFilter === c ? "underline" : "none",
                      textUnderlineOffset: "3px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ RESULTS LINE ═══ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 42px",
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#c4c0b8" }}>
          Results: {filtered.length}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#c4c0b8" }}>
          Sort by: Unsystematic
        </span>
      </div>

      {/* ═══ MASONRY GRID — Cereal style ═══ */}
      <div
        style={{
          padding: "26px 42px 110px",
          columnCount: 3,
          columnGap: "26px",
        }}
        className="cereal-columns"
      >
        {filtered.map((point, index) => {
          // Cereal uses varied card sizes — some large, some small
          const isLarge = index % 5 === 0;

          return (
            <Link
              key={point.id}
              href={`/dossiers/${point.id}`}
              style={{
                display: "block",
                breakInside: "avoid",
                marginBottom: isLarge ? "68px" : "42px",
                textDecoration: "none",
                opacity: 0,
                animation: `gridFadeIn 500ms ease ${Math.min(index * 60, 600)}ms forwards`,
              }}
            >
              {/* Image — large, dominant */}
              {point.photo_url ? (
                <div style={{ marginBottom: "12px", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={point.photo_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      transition: "opacity 200ms ease",
                    }}
                  />
                </div>
              ) : (
                /* No photo — just text, tighter spacing */
                <div style={{ marginBottom: "6px" }} />
              )}

              {/* Metadata — barely visible */}
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                color: "#c4c0b8",
                letterSpacing: "0.05em",
              }}>
                ({getArchiveNumber(point)})
              </span>

              {/* Title */}
              <p style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: isLarge ? "18px" : "15px",
                color: "#1a1a1a",
                lineHeight: "1.35",
                marginTop: "4px",
                transition: "color 200ms ease",
              }}>
                {point.title}
              </p>
            </Link>
          );
        })}

        {/* Map portal */}
        <Link
          href="/"
          style={{
            display: "block",
            breakInside: "avoid",
            marginBottom: "42px",
            textDecoration: "none",
            opacity: 0,
            animation: "gridFadeIn 500ms ease 300ms forwards",
          }}
        >
          <div style={{
            background: "#111111",
            padding: "68px 26px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#d4a254",
                    opacity: 0.3 + i * 0.15,
                  }}
                />
              ))}
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              color: "#f5f0e8",
              opacity: 0.4,
              letterSpacing: "0.05em",
            }}>
              Explore on the map →
            </span>
          </div>
        </Link>
      </div>

      {/* Responsive columns */}
      <style jsx>{`
        .cereal-columns {
          column-count: 3;
        }
        @media (max-width: 1024px) {
          .cereal-columns {
            column-count: 2 !important;
          }
        }
        @media (max-width: 640px) {
          .cereal-columns {
            column-count: 1 !important;
          }
        }
        .cereal-columns a:hover p {
          color: #c4613a !important;
        }
      `}</style>
    </div>
  );
}
