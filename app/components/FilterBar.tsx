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
    <div
      className="border-b border-border-warm"
      style={{ padding: "26px 26px 16px" }}
    >
      <div className="max-w-article mx-auto">
        <div className="flex flex-wrap" style={{ gap: "42px" }}>
          {/* Continents */}
          {availableContinents.length > 0 && (
            <div>
              <p
                className="font-sans text-text-tertiary uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  marginBottom: "10px",
                }}
              >
                Continents
              </p>
              <div className="flex flex-col" style={{ gap: "4px" }}>
                {availableContinents.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      onFilter(activeFilter === c ? null : c)
                    }
                    className={`font-sans text-left transition-colors duration-fast ${activeFilter === c ? "text-text-primary underline" : "text-text-secondary hover:text-text-primary"}`}
                    style={{
                      fontSize: "13px",
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

          {/* Threads */}
          {availableThreads.length > 0 && (
            <div>
              <p
                className="font-sans text-text-tertiary uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  marginBottom: "10px",
                }}
              >
                Threads
              </p>
              <div className="flex flex-col" style={{ gap: "4px" }}>
                {availableThreads.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      onFilter(activeFilter === t ? null : t)
                    }
                    className={`font-sans text-left transition-colors duration-fast ${activeFilter === t ? "text-text-primary underline" : "text-text-secondary hover:text-text-primary"}`}
                    style={{
                      fontSize: "13px",
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

        {/* Results count + sort */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: "16px" }}
        >
          <span className="font-sans text-text-tertiary" style={{ fontSize: "13px" }}>
            Results: {totalResults.toLocaleString()}
          </span>
          <span className="font-sans text-text-tertiary" style={{ fontSize: "13px" }}>
            Sort by: Unsystematic
          </span>
        </div>
      </div>
    </div>
  );
}
