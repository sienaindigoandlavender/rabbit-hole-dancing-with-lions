"use client";

import { useState, useMemo } from "react";
import { DecoderPoint } from "@/app/lib/supabase";
import ArchiveHeader from "@/app/components/ArchiveHeader";
import FilterBar from "@/app/components/FilterBar";
import ArchiveGrid from "@/app/components/ArchiveGrid";

interface ArchiveHomeProps {
  points: DecoderPoint[];
}

export default function ArchiveHome({ points }: ArchiveHomeProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const continents = useMemo(() => {
    return points.length > 0 ? ["Africa"] : [];
  }, [points]);

  const threads = useMemo(() => {
    const trails = Array.from(new Set(points.map((p) => p.trail).filter(Boolean)));
    return trails as string[];
  }, [points]);

  const filtered = useMemo(() => {
    if (!activeFilter) return points;
    return points.filter(
      (p) => p.city === activeFilter || p.trail === activeFilter || p.category === activeFilter
    );
  }, [points, activeFilter]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="flower-of-life" />
      <ArchiveHeader />

      {/* Content below header */}
      <div style={{ paddingTop: "94px" }}>
        <FilterBar
          totalResults={filtered.length}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          availableContinents={continents}
          availableThreads={threads}
        />

        <ArchiveGrid points={filtered} />
      </div>
    </div>
  );
}
