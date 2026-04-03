"use client";

import Link from "next/link";
import { DecoderPoint, DecoderTrail } from "@/app/lib/supabase";
import MapExplorer from "@/app/components/MapExplorer";

interface CityClientProps {
  points: DecoderPoint[];
  trails: DecoderTrail[];
  cityInfo: { center: [number, number]; zoom: number };
  citySlug: string;
}

export default function CityClient({
  points,
  trails,
  cityInfo,
  citySlug,
}: CityClientProps) {
  return (
    <>
      {/* City map */}
      <div className="px-6 max-w-6xl mx-auto mb-12">
        <div className="rounded-lg overflow-hidden border border-border">
          <MapExplorer
            points={points}
            center={cityInfo.center}
            zoom={cityInfo.zoom}
            showCard={false}
            className="w-full h-[400px]"
          />
        </div>
      </div>

      {/* Point cards grid */}
      <div className="px-6 max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((point) => (
            <Link
              key={point.id}
              href={`/${citySlug}/${point.id}`}
              className="block bg-card border border-border rounded-lg p-6 hover:border-border-hover transition-colors"
            >
              <p className="text-xs uppercase tracking-widest text-terracotta font-sans mb-2">
                {point.category}
              </p>
              <h3 className="font-serif text-xl text-cream mb-2">
                {point.title}
              </h3>
              <p className="font-serif italic text-base text-cream/60 leading-relaxed">
                {point.question.length > 100
                  ? point.question.slice(0, 100) + "..."
                  : point.question}
              </p>
              <span className="inline-block mt-3 text-amber font-sans text-sm">
                Discover →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trails section */}
      {trails.length > 0 && (
        <div className="px-6 max-w-6xl mx-auto mb-16">
          <h2 className="font-serif text-3xl text-cream mb-6">Trails</h2>
          <div className="space-y-4">
            {trails.map((trail) => (
              <div
                key={trail.id}
                className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif text-2xl text-cream mb-2">
                    {trail.title}
                  </h3>
                  <p className="font-sans text-sm text-cream/60 leading-relaxed">
                    {trail.description}
                  </p>
                  <p className="font-sans text-xs text-cream/40 mt-2">
                    {trail.point_ids.length} secrets
                  </p>
                </div>
                {trail.point_ids[0] && (
                  <Link
                    href={`/${citySlug}/${trail.point_ids[0]}`}
                    className="text-amber font-sans text-sm hover:text-amber/80 transition-colors whitespace-nowrap"
                  >
                    Begin trail →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
