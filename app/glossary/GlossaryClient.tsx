"use client";

import { useState } from "react";

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface GlossaryClientProps {
  terms: GlossaryTerm[];
}

export default function GlossaryClient({ terms }: GlossaryClientProps) {
  const [search, setSearch] = useState("");

  const filtered = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search terms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full font-sans bg-transparent focus:outline-none"
        style={{
          fontSize: "16px",
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
          color: "var(--text-primary)",
          marginBottom: "42px",
        }}
      />

      <div className="flex flex-col" style={{ gap: "42px" }}>
        {filtered.map((t) => (
          <div key={t.term}>
            <h2
              className="font-serif"
              style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "6px" }}
            >
              {t.term}
            </h2>
            <p
              className="font-sans"
              style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-secondary)" }}
            >
              {t.definition}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="font-sans" style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            No terms found.
          </p>
        )}
      </div>
    </>
  );
}
