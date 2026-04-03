"use client";

import {
  FestivalDate,
  FESTIVALS,
  TRADITION_COLORS,
  Tradition,
} from "@/app/lib/calendarData";

interface TimelineProps {
  festivalDates: FestivalDate[];
  activeTraditions: Set<Tradition>;
  onSelectFestival: (festivalId: string, date: string) => void;
  selectedFestivalId: string | null;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Timeline({
  festivalDates,
  activeTraditions,
  onSelectFestival,
  selectedFestivalId,
}: TimelineProps) {
  const filtered = festivalDates.filter((fd) => {
    const festival = FESTIVALS[fd.festivalId];
    return festival && activeTraditions.has(festival.tradition);
  });

  // Position a date on the timeline (0-100%)
  function getPosition(dateStr: string): number {
    const d = new Date(dateStr + "T00:00:00");
    const start = new Date(d.getFullYear(), 0, 1).getTime();
    const end = new Date(d.getFullYear(), 11, 31).getTime();
    return ((d.getTime() - start) / (end - start)) * 100;
  }

  return (
    <div className="w-full" style={{ padding: "0 26px" }}>
      {/* Month labels */}
      <div className="relative" style={{ height: "16px", marginBottom: "6px" }}>
        {MONTHS.map((month, i) => (
          <span
            key={month}
            className="absolute font-sans"
            style={{
              left: `${(i / 12) * 100 + 100 / 24}%`,
              fontSize: "10px",
              color: "#f5f0e8",
              opacity: 0.3,
              transform: "translateX(-50%)",
            }}
          >
            {month}
          </span>
        ))}
      </div>

      {/* Timeline bar */}
      <div
        className="relative w-full"
        style={{
          height: "42px",
          background: "#1a1a1a",
          borderRadius: "10px",
          border: "1px solid #2a2a2a",
        }}
      >
        {/* Month dividers */}
        {MONTHS.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i / 12) * 100}%`,
              width: "1px",
              background: "#2a2a2a",
            }}
          />
        ))}

        {/* Festival dots */}
        {filtered.map((fd) => {
          const festival = FESTIVALS[fd.festivalId];
          if (!festival) return null;
          const pos = getPosition(fd.date);
          const color = TRADITION_COLORS[festival.tradition];
          const isSelected = selectedFestivalId === fd.festivalId;

          return (
            <button
              key={`${fd.festivalId}-${fd.date}`}
              onClick={() => onSelectFestival(fd.festivalId, fd.date)}
              className="absolute transition-transform duration-fast"
              style={{
                left: `${pos}%`,
                top: "50%",
                transform: `translate(-50%, -50%) scale(${isSelected ? 1.5 : 1})`,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: color,
                border: "none",
                cursor: "pointer",
                boxShadow: isSelected
                  ? `0 0 10px ${color}`
                  : `0 0 4px ${color}40`,
                zIndex: isSelected ? 10 : 1,
              }}
              title={festival.name}
            />
          );
        })}
      </div>
    </div>
  );
}
