"use client";

import {
  Tradition,
  TRADITION_COLORS,
  TRADITION_LABELS,
} from "@/app/lib/calendarData";

interface TraditionFilterProps {
  activeTraditions: Set<Tradition>;
  onToggle: (tradition: Tradition) => void;
}

const ALL_TRADITIONS: Tradition[] = [
  "islamic",
  "chinese",
  "hindu",
  "persian",
  "jewish",
  "buddhist",
  "solar",
];

export default function TraditionFilter({
  activeTraditions,
  onToggle,
}: TraditionFilterProps) {
  return (
    <div
      className="flex flex-wrap justify-center"
      style={{ gap: "6px" }}
    >
      {ALL_TRADITIONS.map((t) => {
        const active = activeTraditions.has(t);
        const color = TRADITION_COLORS[t];
        return (
          <button
            key={t}
            onClick={() => onToggle(t)}
            className="font-sans transition-all duration-fast"
            style={{
              fontSize: "10px",
              padding: "4px 16px",
              borderRadius: "10px",
              background: active ? `${color}20` : "transparent",
              border: `1px solid ${active ? color : "#2a2a2a"}`,
              color: active ? color : "#f5f0e880",
              cursor: "pointer",
            }}
          >
            {TRADITION_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}
