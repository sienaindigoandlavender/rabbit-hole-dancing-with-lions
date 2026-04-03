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
    // For now, all entries are Morocco → Africa
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
      {/* Flower of Life — warm */}
      <div className="flower-of-life" />

      <ArchiveHeader />

      <div style={{ paddingTop: "68px" }}>
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
