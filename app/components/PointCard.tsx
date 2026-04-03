"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DecoderPoint, getCitySlug } from "@/app/lib/supabase";

interface PointCardProps {
  point: DecoderPoint;
  onClose: () => void;
}

export default function PointCard({ point, onClose }: PointCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [closing, setClosing] = useState(false);
  const citySlug = getCitySlug(point.city);

  // Reset state when point changes
  useEffect(() => {
    setRevealed(false);
    setClosing(false);
  }, [point.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  return (
    <>
      {/* Desktop: golden rectangle card at phi vertical line (38.2% from top) */}
      <div
        className={`hidden md:block fixed z-50 overflow-y-auto transition-transform duration-base ease-phi ${closing ? "translate-x-[120%]" : "animate-slideInRight"}`}
        style={{
          right: "26px",
          top: "38.2%",
          transform: closing ? "translateX(120%) translateY(-38.2%)" : undefined,
          width: "380px",
          maxHeight: "615px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "10px",
          padding: "42px 26px",
          boxShadow: "0 26px 68px rgba(0,0,0,0.5)",
        }}
      >
        <CardContent
          point={point}
          citySlug={citySlug}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onClose={handleClose}
        />
      </div>

      {/* Mobile: bottom sheet at phi height (38.2vh) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 overflow-y-auto transition-transform duration-base ease-phi ${closing ? "translate-y-full" : "animate-slideInUp"}`}
        style={{
          height: "38.2vh",
          background: "#1a1a1a",
          borderTop: "1px solid #2a2a2a",
          borderRadius: "10px 10px 0 0",
          padding: "26px",
          boxShadow: "0 -26px 68px rgba(0,0,0,0.5)",
        }}
      >
        <CardContent
          point={point}
          citySlug={citySlug}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onClose={handleClose}
        />
      </div>
    </>
  );
}

function CardContent({
  point,
  citySlug,
  revealed,
  onReveal,
  onClose,
}: {
  point: DecoderPoint;
  citySlug: string;
  revealed: boolean;
  onReveal: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-cream/40 hover:text-cream transition-colors duration-fast text-xl leading-none"
        aria-label="Close"
      >
        ×
      </button>

      {/* Category — phi sm (13px) */}
      <span
        className="font-sans uppercase text-terracotta"
        style={{ fontSize: "13px", letterSpacing: "0.1em" }}
      >
        {point.category}
      </span>

      {/* Title — phi xl (26px) */}
      <h2
        className="font-serif text-cream pr-phi-5"
        style={{ fontSize: "26px", marginTop: "16px", lineHeight: "1.3" }}
      >
        {point.title}
      </h2>

      {/* Question — phi lg (20px) with golden line-height */}
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
        {point.question}
      </p>

      {/* Reveal button or revealed content */}
      {!revealed ? (
        <button
          onClick={onReveal}
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
          {/* Answer — phi base (16px) with golden line-height */}
          <div className="animate-fadeIn-answer">
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
              {point.answer}
            </p>
          </div>

          {/* Darija box — staggered 200ms after answer */}
          {point.darija_word && (
            <div
              className="animate-fadeIn-darija"
              style={{
                marginTop: "42px",
                padding: "26px",
                borderRadius: "10px",
                background: "#222222",
                borderLeft: "3px solid #c4613a",
              }}
            >
              <span
                className="font-serif text-amber"
                style={{ fontSize: "26px" }}
              >
                {point.darija_word}
              </span>
              {point.darija_meaning && (
                <span
                  className="font-sans"
                  style={{
                    fontSize: "13px",
                    marginLeft: "16px",
                    color: "#f5f0e8",
                    opacity: 0.7,
                  }}
                >
                  {point.darija_meaning}
                </span>
              )}
              {point.darija_literal && (
                <p
                  className="font-sans"
                  style={{
                    fontSize: "10px",
                    marginTop: "10px",
                    color: "#f5f0e8",
                    opacity: 0.5,
                  }}
                >
                  Literally: {point.darija_literal}
                </p>
              )}
              {point.darija_context && (
                <p
                  className="font-sans"
                  style={{
                    fontSize: "10px",
                    marginTop: "6px",
                    color: "#f5f0e8",
                    opacity: 0.5,
                  }}
                >
                  {point.darija_context}
                </p>
              )}
            </div>
          )}

          {/* Read full story — staggered 400ms */}
          <Link
            href={`/${citySlug}/${point.id}`}
            className="animate-fadeIn-link font-sans text-amber hover:text-amber/80 transition-colors duration-fast"
            style={{
              display: "block",
              marginTop: "42px",
              fontSize: "13px",
            }}
          >
            Read full story →
          </Link>
        </>
      )}
    </div>
  );
}
