"use client";

import { useState } from "react";
import { Festival, TRADITION_COLORS } from "@/app/lib/calendarData";

interface FestivalCardProps {
  festival: Festival;
  date: string;
  onClose: () => void;
}

export default function FestivalCard({
  festival,
  date,
  onClose,
}: FestivalCardProps) {
  const [revealed, setRevealed] = useState(false);
  const color = TRADITION_COLORS[festival.tradition];
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div
      className="animate-slideInUp"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(580px, calc(100vw - 52px))",
        maxHeight: "615px",
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "10px 10px 0 0",
        padding: "42px 26px",
        boxShadow: "0 -26px 68px rgba(0,0,0,0.5)",
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        className="absolute text-cream/40 hover:text-cream transition-colors duration-fast text-xl leading-none"
        style={{ top: "16px", right: "16px" }}
        aria-label="Close"
      >
        ×
      </button>

      {/* Tradition dot + date */}
      <div className="flex items-center" style={{ gap: "10px" }}>
        <span
          className="inline-block rounded-full"
          style={{
            width: "10px",
            height: "10px",
            background: color,
          }}
        />
        <span
          className="font-sans"
          style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.5 }}
        >
          {formattedDate}
        </span>
      </div>

      {/* Festival name */}
      <h2
        className="font-serif text-cream"
        style={{ fontSize: "26px", marginTop: "16px", lineHeight: "1.3" }}
      >
        {festival.name}
      </h2>

      {/* Question */}
      <p
        className="font-serif italic"
        style={{
          fontSize: "20px",
          lineHeight: "1.618",
          marginTop: "26px",
          color: "#f5f0e8",
          opacity: revealed ? 0.5 : 0.85,
          transition: "opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {festival.question}
      </p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="font-sans text-amber hover:text-amber/80 transition-colors duration-fast"
          style={{
            fontSize: "13px",
            marginTop: "42px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reveal →
        </button>
      ) : (
        <>
          <div className="hermetic-rhythm-1">
            <p
              className="font-sans"
              style={{
                fontSize: "16px",
                lineHeight: "1.618",
                marginTop: "26px",
                color: "#f5f0e8",
                opacity: 0.9,
              }}
            >
              {festival.answer}
            </p>
          </div>

          {festival.cities && festival.cities.length > 0 && (
            <div
              className="hermetic-rhythm-2 flex flex-wrap"
              style={{ marginTop: "26px", gap: "10px" }}
            >
              {festival.cities.map((city) => (
                <a
                  key={city}
                  href={`/${city.toLowerCase()}`}
                  className="font-sans text-amber/70 hover:text-amber transition-colors duration-fast"
                  style={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    border: "1px solid #2a2a2a",
                    borderRadius: "10px",
                  }}
                >
                  {city} →
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
