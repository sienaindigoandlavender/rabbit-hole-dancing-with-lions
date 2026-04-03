"use client";

import Link from "next/link";

interface ArchiveHeaderProps {
  inverted?: boolean;
}

export default function ArchiveHeader({ inverted = false }: ArchiveHeaderProps) {
  const textColor = inverted ? "text-cream" : "text-text-primary";
  const secondaryColor = inverted ? "text-cream/50" : "text-text-secondary";
  const borderColor = inverted ? "border-border" : "border-border-warm";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b ${borderColor}`}
      style={{
        height: "68px",
        paddingLeft: "26px",
        paddingRight: "26px",
        background: inverted ? "#111111" : "#f7f5f0",
      }}
    >
      <Link
        href="/"
        className={`font-serif ${textColor} hover:text-terracotta transition-colors duration-fast`}
        style={{
          fontSize: "16px",
          fontVariant: "small-caps",
          letterSpacing: "0.3em",
        }}
      >
        Dancing with Lions
      </Link>

      <div className="flex items-center" style={{ gap: "26px" }}>
        <Link
          href="/map"
          className={`font-sans ${secondaryColor} hover:${textColor} transition-colors duration-fast`}
          style={{ fontSize: "13px" }}
        >
          Map
        </Link>
        <Link
          href="/calendar"
          className={`font-sans ${secondaryColor} hover:${textColor} transition-colors duration-fast`}
          style={{ fontSize: "13px" }}
        >
          Calendar
        </Link>
        <Link
          href="/about"
          className={`font-sans ${secondaryColor} hover:${textColor} transition-colors duration-fast`}
          style={{ fontSize: "13px" }}
        >
          Information
        </Link>
      </div>
    </header>
  );
}
