"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DecoderPoint } from "@/app/lib/supabase";

interface PointCardProps {
  point: DecoderPoint;
  onClose: () => void;
}

function getArchiveNumber(point: DecoderPoint): string {
  const code = "MA";
  const num = point.id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
}

function formatCoord(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export default function PointCard({ point, onClose }: PointCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setClosing(false);
  }, [point.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  const archiveNum = getArchiveNumber(point);
  const coords = formatCoord(point.lat, point.lng);

  return (
    <>
      {/* Desktop card */}
      <div
        className={`hidden md:block fixed z-50 overflow-y-auto transition-transform duration-base ease-phi ${closing ? "translate-x-[120%]" : "animate-slideInRight"}`}
        style={{
          right: "26px",
          top: "38.2%",
          transform: closing ? "translateX(120%) translateY(-38.2%)" : undefined,
          width: "380px",
          maxHeight: "615px",
          background: "#f7f5f0",
          border: "1px solid #e5e2db",
          borderRadius: "10px",
          boxShadow: "0 26px 68px rgba(120,100,80,0.15)",
          overflow: "hidden",
        }}
      >
        <FileBar archiveNum={archiveNum} coords={coords} city={point.city} onClose={handleClose} />
        <div style={{ padding: "26px 26px 42px" }}>
          <CardContent point={point} revealed={revealed} onReveal={() => setRevealed(true)} />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 overflow-y-auto transition-transform duration-base ease-phi ${closing ? "translate-y-full" : "animate-slideInUp"}`}
        style={{
          height: "38.2vh",
          background: "#f7f5f0",
          borderTop: "1px solid #e5e2db",
          borderRadius: "10px 10px 0 0",
          boxShadow: "0 -26px 68px rgba(120,100,80,0.15)",
          overflow: "hidden",
        }}
      >
        <FileBar archiveNum={archiveNum} coords={coords} city={point.city} onClose={handleClose} />
        <div style={{ padding: "16px 26px 26px" }}>
          <CardContent point={point} revealed={revealed} onReveal={() => setRevealed(true)} />
        </div>
      </div>
    </>
  );
}

/* File header bar — like opening a file in the system */
function FileBar({
  archiveNum,
  coords,
  city,
  onClose,
}: {
  archiveNum: string;
  coords: string;
  city: string;
  onClose: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "10px 16px",
        background: "#efede6",
        borderBottom: "1px solid #e5e2db",
      }}
    >
      <div className="flex items-center" style={{ gap: "16px" }}>
        <span style={{ fontSize: "10px", color: "#d4a254", fontFamily: "monospace" }}>
          {archiveNum}
        </span>
        <span style={{ fontSize: "10px", color: "#9b978f", fontFamily: "monospace" }}>
          {coords}
        </span>
        <span style={{ fontSize: "10px", color: "#6b6860", fontFamily: "monospace" }}>
          {city}
        </span>
      </div>
      <button
        onClick={onClose}
        style={{
          fontSize: "13px",
          color: "#9b978f",
          background: "none",
          border: "none",
          cursor: "pointer",
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

function CardContent({
  point,
  revealed,
  onReveal,
}: {
  point: DecoderPoint;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <>
      {/* Category */}
      <span
        className="font-sans uppercase text-terracotta"
        style={{ fontSize: "13px", letterSpacing: "0.1em" }}
      >
        {point.category}
      </span>

      {/* Title */}
      <h2
        className="font-serif text-text-primary"
        style={{ fontSize: "26px", marginTop: "16px", lineHeight: "1.3" }}
      >
        {point.title}
      </h2>

      {/* Question */}
      <p
        className={`font-serif italic ${revealed ? "hermetic-polarity-dim" : ""}`}
        style={{
          fontSize: "20px",
          lineHeight: "1.618",
          marginTop: "26px",
          color: "#1a1a1a",
          opacity: revealed ? undefined : 0.85,
        }}
      >
        {point.question}
      </p>

      {!revealed ? (
        <button
          onClick={onReveal}
          className="font-sans text-terracotta hover:text-terracotta/80 transition-colors duration-fast"
          style={{ fontSize: "13px", marginTop: "42px", background: "none", border: "none", cursor: "pointer" }}
        >
          Reveal →
        </button>
      ) : (
        <>
          {/* Answer */}
          <div className="hermetic-rhythm-1">
            <p
              className="font-sans"
              style={{ fontSize: "16px", lineHeight: "1.618", marginTop: "26px", color: "#1a1a1a", opacity: 0.9 }}
            >
              {point.answer}
            </p>
          </div>

          {/* Darija box */}
          {point.darija_word && (
            <div
              className="hermetic-rhythm-2"
              style={{ marginTop: "42px", padding: "26px", borderRadius: "10px", background: "#efede6", borderLeft: "3px solid #c4613a" }}
            >
              <span className="font-serif" style={{ fontSize: "26px", color: "#d4a254" }}>
                {point.darija_word}
              </span>
              {point.darija_meaning && (
                <span className="font-sans" style={{ fontSize: "13px", marginLeft: "16px", color: "#6b6860" }}>
                  {point.darija_meaning}
                </span>
              )}
              {point.darija_literal && (
                <p className="font-sans" style={{ fontSize: "10px", marginTop: "10px", color: "#9b978f" }}>
                  Literally: {point.darija_literal}
                </p>
              )}
            </div>
          )}

          {/* Read full entry */}
          <Link
            href={`/archive/${point.id}`}
            className="hermetic-rhythm-3 font-sans text-terracotta hover:text-terracotta/80 transition-colors duration-fast"
            style={{ display: "block", marginTop: "42px", fontSize: "13px" }}
          >
            Read full entry →
          </Link>
        </>
      )}
    </>
  );
}
