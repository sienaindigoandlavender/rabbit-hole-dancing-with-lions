import { DecoderPoint } from "@/app/lib/supabase";

interface CityHeaderProps {
  city: string;
  points: DecoderPoint[];
}

export default function CityHeader({ city, points }: CityHeaderProps) {
  const categoryCounts = points.reduce(
    (acc, p) => {
      const cat = p.category.toLowerCase();
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryBreakdown = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `${count} ${cat}`)
    .join(" · ");

  return (
    <div className="px-6 pt-20 pb-8 max-w-6xl mx-auto">
      <h1 className="font-serif text-5xl md:text-7xl text-cream mb-4">
        {city}
      </h1>
      <p className="font-sans text-sm text-cream/50 tracking-wide">
        {categoryBreakdown}
      </p>
    </div>
  );
}
