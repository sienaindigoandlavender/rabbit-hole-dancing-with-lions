import Link from "next/link";
import { DecoderTrail, getCitySlug } from "@/app/lib/supabase";

interface TrailIndicatorProps {
  trail: DecoderTrail;
  currentPointId: string;
}

export default function TrailIndicator({
  trail,
  currentPointId,
}: TrailIndicatorProps) {
  const currentIndex = trail.point_ids.indexOf(currentPointId);
  const totalPoints = trail.point_ids.length;
  const citySlug = getCitySlug(trail.city);
  const nextPointId =
    currentIndex < totalPoints - 1
      ? trail.point_ids[currentIndex + 1]
      : null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 my-8">
      <p className="text-xs uppercase tracking-widest text-terracotta font-sans mb-2">
        Trail
      </p>
      <p className="font-serif text-lg text-cream mb-2">
        This is part of{" "}
        <span className="text-amber">{trail.title}</span> —{" "}
        {currentIndex + 1} of {totalPoints}
      </p>
      {nextPointId && (
        <Link
          href={`/${citySlug}/${nextPointId}`}
          className="text-amber font-sans text-sm hover:text-amber/80 transition-colors"
        >
          Continue the trail →
        </Link>
      )}
    </div>
  );
}
