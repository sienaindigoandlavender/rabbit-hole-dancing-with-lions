"use client";

import { useState } from "react";
import Link from "next/link";
import { DecoderPoint, getCitySlug } from "@/app/lib/supabase";
import DarijaBox from "./DarijaBox";

interface PointCardProps {
  point: DecoderPoint;
  onClose: () => void;
}

export default function PointCard({ point, onClose }: PointCardProps) {
  const [revealed, setRevealed] = useState(false);
  const citySlug = getCitySlug(point.city);

  return (
    <div className="fixed right-6 top-20 w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-card border border-border rounded-lg p-6 z-40 shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors text-lg"
      >
        ×
      </button>

      <p className="text-xs uppercase tracking-widest text-terracotta font-sans mb-3">
        {point.category}
      </p>

      <h2 className="font-serif text-2xl text-cream mb-3 pr-6">
        {point.title}
      </h2>

      <p className="font-serif italic text-lg text-cream/80 mb-4 leading-relaxed">
        {point.question}
      </p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-amber font-sans text-sm hover:text-amber/80 transition-colors"
        >
          Reveal →
        </button>
      ) : (
        <div className="animate-fadeIn">
          <p className="font-sans text-base text-cream/90 leading-relaxed mb-4">
            {point.answer}
          </p>

          {point.darija_word && <DarijaBox point={point} />}

          <Link
            href={`/${citySlug}/${point.id}`}
            className="inline-block mt-4 text-amber font-sans text-sm hover:text-amber/80 transition-colors"
          >
            Read full story →
          </Link>
        </div>
      )}
    </div>
  );
}
