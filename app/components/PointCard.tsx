"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DecoderPoint, getCitySlug } from "@/app/lib/supabase";

interface PointCardProps {
  point: DecoderPoint;
  onClose: () => void;
}

export default function PointCard({ point, onClose }: PointCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const citySlug = getCitySlug(point.city);

  // Reset revealed state when point changes
  useEffect(() => {
    setRevealed(false);
    setClosing(false);
  }, [point.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Desktop: right-side panel, vertically centred */}
      <div
        ref={cardRef}
        className={`hidden md:block fixed right-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[calc(100vh-80px)] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${closing ? "translate-x-[120%]" : "animate-slideInRight"}`}
      >
        <CardContent
          point={point}
          citySlug={citySlug}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onClose={handleClose}
        />
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 h-[60vh] bg-[#1a1a1a] border-t border-[#2a2a2a] rounded-t-2xl p-6 z-50 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] overflow-y-auto transition-transform duration-300 ease-out ${closing ? "translate-y-full" : "animate-slideInUp"}`}
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
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors text-xl leading-none"
        aria-label="Close"
      >
        ×
      </button>

      {/* Category */}
      <span className="text-xs uppercase tracking-widest text-terracotta font-sans">
        {point.category}
      </span>

      {/* Title */}
      <h2 className="font-serif text-2xl text-cream mt-3 pr-6">
        {point.title}
      </h2>

      {/* Question */}
      <p
        className={`font-serif italic text-lg mt-4 leading-relaxed transition-opacity duration-400 ${revealed ? "text-cream/50" : "text-cream/85"}`}
      >
        {point.question}
      </p>

      {/* Reveal button or revealed content */}
      {!revealed ? (
        <button
          onClick={onReveal}
          className="mt-6 text-sm text-amber font-sans hover:text-amber/80 transition-colors"
        >
          Reveal →
        </button>
      ) : (
        <div className="animate-fadeIn">
          {/* Answer */}
          <p className="text-base text-cream/90 font-sans mt-4 leading-[1.8]">
            {point.answer}
          </p>

          {/* Darija box */}
          {point.darija_word && (
            <div className="mt-6 p-4 rounded-lg bg-[#222222] border-l-[3px] border-terracotta">
              <span className="text-xl font-serif text-amber">
                {point.darija_word}
              </span>
              {point.darija_meaning && (
                <span className="text-sm text-cream/70 ml-3">
                  {point.darija_meaning}
                </span>
              )}
              {point.darija_literal && (
                <p className="text-xs text-cream/50 mt-2">
                  Literally: {point.darija_literal}
                </p>
              )}
              {point.darija_context && (
                <p className="text-xs text-cream/50 mt-1">
                  {point.darija_context}
                </p>
              )}
            </div>
          )}

          {/* Read full story link */}
          <Link
            href={`/${citySlug}/${point.id}`}
            className="block mt-6 text-sm text-amber font-sans hover:text-amber/80 transition-colors"
          >
            Read full story →
          </Link>
        </div>
      )}
    </>
  );
}
