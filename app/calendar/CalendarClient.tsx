"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import MoonPhase from "@/app/components/calendar/MoonPhase";
import Timeline from "@/app/components/calendar/Timeline";
import FestivalCard from "@/app/components/calendar/FestivalCard";
import TraditionFilter from "@/app/components/calendar/TraditionFilter";
import YearSelector from "@/app/components/calendar/YearSelector";
import {
  Tradition,
  TRADITION_COLORS,
  FESTIVALS,
  FESTIVAL_DATES,
  CONVERGENCES,
  getMoonPhase,
  getMoonPhaseName,
} from "@/app/lib/calendarData";

// Approximate Hijri date (simplified calculation)
function getHijriDate(date: Date): string {
  const hijriEpoch = new Date(622, 6, 16).getTime();
  const daysSinceEpoch =
    (date.getTime() - hijriEpoch) / (1000 * 60 * 60 * 24);
  const hijriYear = Math.floor(daysSinceEpoch / 354.36667);
  const dayInYear = daysSinceEpoch - hijriYear * 354.36667;
  const hijriMonth = Math.floor(dayInYear / 29.53) + 1;
  const hijriDay = Math.floor(dayInYear % 29.53) + 1;

  const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Ula",
    "Jumada al-Thani",
    "Rajab",
    "Shaban",
    "Ramadan",
    "Shawwal",
    "Dhul Qadah",
    "Dhul Hijjah",
  ];

  const monthName = hijriMonths[Math.min(hijriMonth - 1, 11)] || "Muharram";
  return `${hijriDay} ${monthName} ${hijriYear}`;
}

// Chinese zodiac year
function getChineseZodiac(year: number): string {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  const index = (year - 4) % 12;
  return `Year of the ${animals[index]}`;
}

export default function CalendarClient() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedFestival, setSelectedFestival] = useState<{
    id: string;
    date: string;
  } | null>(null);
  const [activeTraditions, setActiveTraditions] = useState<Set<Tradition>>(
    new Set<Tradition>([
      "islamic",
      "chinese",
      "hindu",
      "persian",
      "jewish",
      "buddhist",
      "solar",
    ])
  );

  const today = useMemo(() => new Date(), []);
  const moonPhase = useMemo(() => getMoonPhase(today), [today]);
  const moonPhaseName = useMemo(() => getMoonPhaseName(moonPhase), [moonPhase]);

  const gregorianDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hijriDate = getHijriDate(today);
  const chineseZodiac = getChineseZodiac(today.getFullYear());

  const festivalDates = FESTIVAL_DATES[selectedYear] || [];

  const yearConvergences = CONVERGENCES.filter(
    (c) => c.year === selectedYear
  );

  const handleToggleTradition = useCallback((tradition: Tradition) => {
    setActiveTraditions((prev) => {
      const next = new Set(prev);
      if (next.has(tradition)) {
        next.delete(tradition);
      } else {
        next.add(tradition);
      }
      return next;
    });
  }, []);

  const handleSelectFestival = useCallback((id: string, date: string) => {
    setSelectedFestival((prev) =>
      prev?.id === id ? null : { id, date }
    );
  }, []);

  // ESC to close card
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedFestival(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const selectedFestivalData = selectedFestival
    ? FESTIVALS[selectedFestival.id]
    : null;

  return (
    <div
      className="relative min-h-screen bg-dark overflow-y-auto"
      style={{ overflowX: "hidden" }}
    >
      {/* Flower of Life overlay */}
      <div className="flower-of-life-bg" />

      {/* Navigation */}
      <div className="fixed z-40" style={{ top: "26px", left: "26px" }}>
        <Link
          href="/"
          className="font-serif text-cream hover:text-amber transition-colors duration-fast"
          style={{ fontSize: "20px" }}
        >
          Dancing with Lions
        </Link>
      </div>

      {/* Stars background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cream"
            style={{
              width: `${1 + Math.random()}px`,
              height: `${1 + Math.random()}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: 0.1 + Math.random() * 0.15,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col items-center"
        style={{
          paddingTop: "110px",
          paddingBottom: "110px",
          minHeight: "100vh",
          zIndex: 2,
        }}
      >
        {/* Triple date display */}
        <div className="text-center" style={{ marginBottom: "42px" }}>
          <p
            className="font-serif text-cream"
            style={{ fontSize: "20px", opacity: 0.9 }}
          >
            {hijriDate}
            <span style={{ opacity: 0.3 }}> · </span>
            {gregorianDate}
            <span style={{ opacity: 0.3 }}> · </span>
            {chineseZodiac}
          </p>
        </div>

        {/* Moon at phi point */}
        <div style={{ marginBottom: "16px" }}>
          <MoonPhase phase={moonPhase} size={200} />
        </div>

        {/* Moon phase name */}
        <p
          className="font-sans text-center"
          style={{
            fontSize: "10px",
            color: "#f5f0e8",
            opacity: 0.4,
            marginBottom: "68px",
          }}
        >
          {moonPhaseName}
        </p>

        {/* Year selector */}
        <div style={{ marginBottom: "26px" }}>
          <YearSelector
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            availableYears={[2026, 2027]}
          />
        </div>

        {/* Timeline */}
        <div
          className="w-full"
          style={{ maxWidth: "900px", marginBottom: "26px" }}
        >
          <Timeline
            festivalDates={festivalDates}
            activeTraditions={activeTraditions}
            onSelectFestival={handleSelectFestival}
            selectedFestivalId={selectedFestival?.id || null}
          />
        </div>

        {/* Tradition filters */}
        <div style={{ marginBottom: "42px" }}>
          <TraditionFilter
            activeTraditions={activeTraditions}
            onToggle={handleToggleTradition}
          />
        </div>

        {/* Convergence moments */}
        {yearConvergences.length > 0 && (
          <div
            className="w-full"
            style={{ maxWidth: "580px", marginBottom: "42px" }}
          >
            {yearConvergences.map((conv, i) => (
              <div
                key={i}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  padding: "26px",
                  marginBottom: "16px",
                }}
              >
                <p
                  className="font-sans uppercase"
                  style={{
                    fontSize: "10px",
                    color: "#c4613a",
                    letterSpacing: "0.1em",
                    marginBottom: "10px",
                  }}
                >
                  Convergence
                </p>
                <p
                  className="font-serif italic"
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.618",
                    color: "#f5f0e8",
                    opacity: 0.85,
                  }}
                >
                  {conv.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Festival list (text, below timeline) */}
        <div className="w-full" style={{ maxWidth: "580px" }}>
          <p
            className="font-sans uppercase"
            style={{
              fontSize: "10px",
              color: "#f5f0e8",
              opacity: 0.3,
              letterSpacing: "0.1em",
              marginBottom: "16px",
              paddingLeft: "26px",
            }}
          >
            {selectedYear} Festivals
          </p>
          <div className="flex flex-col" style={{ gap: "4px" }}>
            {festivalDates
              .filter((fd) => {
                const f = FESTIVALS[fd.festivalId];
                return f && activeTraditions.has(f.tradition);
              })
              .map((fd) => {
                const festival = FESTIVALS[fd.festivalId];
                if (!festival) return null;
                const d = new Date(fd.date + "T00:00:00");
                const dateLabel = d.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                });
                const isSelected = selectedFestival?.id === fd.festivalId;

                return (
                  <button
                    key={`${fd.festivalId}-${fd.date}`}
                    onClick={() =>
                      handleSelectFestival(fd.festivalId, fd.date)
                    }
                    className="flex items-center text-left transition-colors duration-fast"
                    style={{
                      padding: "10px 26px",
                      borderRadius: "10px",
                      background: isSelected ? "#1a1a1a" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      gap: "16px",
                    }}
                  >
                    <span
                      className="inline-block rounded-full flex-shrink-0"
                      style={{
                        width: "6px",
                        height: "6px",
                        background:
                          TRADITION_COLORS[festival.tradition],
                      }}
                    />
                    <span
                      className="font-sans flex-shrink-0"
                      style={{
                        fontSize: "10px",
                        color: "#f5f0e8",
                        opacity: 0.4,
                        width: "50px",
                      }}
                    >
                      {dateLabel}
                    </span>
                    <span
                      className="font-serif"
                      style={{
                        fontSize: "16px",
                        color: isSelected ? "#d4a254" : "#f5f0e8",
                        opacity: isSelected ? 1 : 0.7,
                      }}
                    >
                      {festival.name}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Festival card overlay */}
      {selectedFestivalData && selectedFestival && (
        <FestivalCard
          festival={selectedFestivalData}
          date={selectedFestival.date}
          onClose={() => setSelectedFestival(null)}
        />
      )}
    </div>
  );
}
