"use client";

import Link from "next/link";

interface ArchiveHeaderProps {
  inverted?: boolean;
}

export default function ArchiveHeader({ inverted = false }: ArchiveHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: "52px",
        paddingLeft: "42px",
        paddingRight: "42px",
        background: inverted ? "#111111" : "#f7f5f0",
      }}
    >
      <Link
        href="/"
        className="font-serif transition-colors duration-fast"
        style={{
          fontSize: "14px",
          fontVariant: "small-caps",
          letterSpacing: "0.35em",
          color: inverted ? "#f5f0e8" : "#1a1a1a",
        }}
      >
        Dancing with Lions
      </Link>

      <div className="flex items-center" style={{ gap: "42px" }}>
        <Link
          href="/dossiers"
          className="font-sans transition-colors duration-fast"
          style={{
            fontSize: "11px",
            color: inverted ? "rgba(245,240,232,0.5)" : "#9b978f",
            letterSpacing: "0.02em",
          }}
        >
          Dossiers
        </Link>
        <Link
          href="/about"
          className="font-sans transition-colors duration-fast"
          style={{
            fontSize: "11px",
            color: inverted ? "rgba(245,240,232,0.5)" : "#9b978f",
            letterSpacing: "0.02em",
          }}
        >
          Information
        </Link>
      </div>
    </header>
  );
}
