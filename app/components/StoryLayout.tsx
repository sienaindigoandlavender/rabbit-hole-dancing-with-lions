import { DecoderPoint, DecoderTrail, getCitySlug } from "@/app/lib/supabase";
import DarijaBox from "./DarijaBox";
import TrailIndicator from "./TrailIndicator";
import Link from "next/link";

interface StoryLayoutProps {
  point: DecoderPoint;
  trail?: DecoderTrail | null;
  nextPoint?: DecoderPoint | null;
  prevPoint?: DecoderPoint | null;
  deepContent: string;
}

export default function StoryLayout({
  point,
  trail,
  nextPoint,
  prevPoint,
  deepContent,
}: StoryLayoutProps) {
  const citySlug = getCitySlug(point.city);

  return (
    <article className="max-w-prose mx-auto px-6 py-16">
      {/* Category */}
      <p className="text-xs uppercase tracking-widest text-terracotta font-sans mb-4">
        {point.category}
      </p>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
        {point.title}
      </h1>

      {/* Question as epigraph */}
      <blockquote className="font-serif italic text-xl md:text-2xl text-cream/80 my-8 leading-relaxed">
        {point.question}
      </blockquote>

      {/* Hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {point.hero_image && (
        <div className="my-8 rounded-lg overflow-hidden">
          <img
            src={point.hero_image}
            alt={point.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Answer as highlighted block */}
      <div className="bg-card border-l-[3px] border-terracotta p-6 my-8 rounded-r-lg">
        <p className="font-sans text-base text-cream/90 leading-relaxed">
          {point.answer}
        </p>
      </div>

      {/* Deep content */}
      <div className="prose-dwl font-sans text-base text-cream/85 leading-[1.8] space-y-4">
        {deepContent.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Darija box */}
      {point.darija_word && (
        <div className="mt-8">
          <DarijaBox point={point} />
        </div>
      )}

      {/* Trail indicator */}
      {trail && <TrailIndicator trail={trail} currentPointId={point.id} />}

      {/* Navigation */}
      <div className="border-t border-border mt-12 pt-8 flex justify-between items-start">
        {prevPoint ? (
          <Link
            href={`/${citySlug}/${prevPoint.id}`}
            className="group max-w-[45%]"
          >
            <p className="font-sans text-xs text-cream/40 mb-1">
              ← Previous
            </p>
            <p className="font-serif text-lg text-cream/70 group-hover:text-cream transition-colors">
              {prevPoint.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {nextPoint ? (
          <Link
            href={`/${citySlug}/${nextPoint.id}`}
            className="group max-w-[45%] text-right"
          >
            <p className="font-sans text-xs text-cream/40 mb-1">
              Next in {point.city} →
            </p>
            <p className="font-serif text-lg text-cream/70 group-hover:text-cream transition-colors">
              {nextPoint.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Back to city */}
      <div className="mt-8 text-center">
        <Link
          href={`/${citySlug}`}
          className="font-sans text-sm text-cream/40 hover:text-cream/60 transition-colors"
        >
          ← All secrets in {point.city}
        </Link>
      </div>
    </article>
  );
}
