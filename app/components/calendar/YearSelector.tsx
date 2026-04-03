"use client";

interface YearSelectorProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  availableYears: number[];
}

export default function YearSelector({
  selectedYear,
  onSelectYear,
  availableYears,
}: YearSelectorProps) {
  return (
    <div className="flex justify-center" style={{ gap: "26px" }}>
      {availableYears.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          className="font-sans transition-colors duration-fast"
          style={{
            fontSize: "13px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: year === selectedYear ? "#d4a254" : "#f5f0e8",
            opacity: year === selectedYear ? 1 : 0.4,
          }}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
