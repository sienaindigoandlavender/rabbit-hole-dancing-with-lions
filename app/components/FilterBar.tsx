"use client";

interface FilterBarProps {
  totalResults: number;
  activeFilter: string | null;
  onFilter: (filter: string | null) => void;
  availableContinents: string[];
  availableThreads: string[];
}

export default function FilterBar({
  totalResults,
  activeFilter,
  onFilter,
  availableContinents,
  availableThreads,
}: FilterBarProps) {
  return (
    <div style={{ padding: "0 42px 42px" }}>
      {/* Filters — right-aligned, Cereal style */}
      <div className="flex justify-end" style={{ gap: "68px", marginBottom: "26px" }}>
        {availableContinents.length > 0 && (
          <div>
            <p
              className="font-sans uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "#9b978f",
                marginBottom: "10px",
              }}
            >
              Continents
            </p>
            <div className="flex flex-col" style={{ gap: "3px" }}>
              {availableContinents.map((c) => (
                <button
                  key={c}
                  onClick={() => onFilter(activeFilter === c ? null : c)}
                  className="font-sans text-left transition-colors duration-fast"
                  style={{
                    fontSize: "12px",
                    color: activeFilter === c ? "#1a1a1a" : "#9b978f",
                    textDecoration: activeFilter === c ? "underline" : "none",
                    textUnderlineOffset: "3px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableThreads.length > 0 && (
          <div>
            <p
              className="font-sans uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "#9b978f",
                marginBottom: "10px",
              }}
            >
              Threads
            </p>
            <div className="flex flex-col" style={{ gap: "3px" }}>
              {availableThreads.map((t) => (
                <button
                  key={t}
                  onClick={() => onFilter(activeFilter === t ? null : t)}
                  className="font-sans text-left transition-colors duration-fast"
                  style={{
                    fontSize: "12px",
                    color: activeFilter === t ? "#1a1a1a" : "#9b978f",
                    textDecoration: activeFilter === t ? "underline" : "none",
                    textUnderlineOffset: "3px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results + sort — full width, spaced apart */}
      <div className="flex items-center justify-between">
        <span className="font-sans" style={{ fontSize: "11px", color: "#9b978f" }}>
          Results: {totalResults}
        </span>
        <span className="font-sans" style={{ fontSize: "11px", color: "#9b978f" }}>
          Sort by: Unsystematic
        </span>
      </div>
    </div>
  );
}
