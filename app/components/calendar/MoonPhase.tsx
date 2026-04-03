"use client";

interface MoonPhaseProps {
  phase: number; // 0-1 where 0=new, 0.5=full
  size?: number;
}

export default function MoonPhase({ phase, size = 200 }: MoonPhaseProps) {
  // Calculate the illumination curve
  // phase 0 = new (dark), 0.5 = full (bright), 1 = new again
  const r = size / 2;
  const illumination = Math.abs(phase - 0.5) * 2; // 0 at new, 1 at full
  const isWaxing = phase < 0.5;

  // The terminator (shadow edge) is an ellipse
  // At new moon, the entire disc is dark
  // At full moon, the entire disc is lit
  // In between, we draw the lit portion using two arcs
  const terminatorX = r * Math.cos(Math.PI * illumination);

  // Determine the sweep for the shadow
  let litPath: string;

  if (phase < 0.01 || phase > 0.99) {
    // New moon — fully dark
    litPath = "";
  } else if (phase > 0.49 && phase < 0.51) {
    // Full moon — fully lit
    litPath = `M ${r} 0 A ${r} ${r} 0 1 1 ${r} ${size} A ${r} ${r} 0 1 1 ${r} 0`;
  } else {
    const sweepOuter = isWaxing ? 1 : 0;
    const sweepInner = illumination > 0.5 ? 1 : 0;
    const tx = isWaxing ? -terminatorX : terminatorX;

    litPath = isWaxing
      ? // Waxing: lit on right
        `M ${r} 0 A ${r} ${r} 0 1 ${sweepOuter} ${r} ${size} A ${Math.abs(tx)} ${r} 0 0 ${sweepInner} ${r} 0`
      : // Waning: lit on left
        `M ${r} 0 A ${r} ${r} 0 1 ${sweepOuter} ${r} ${size} A ${Math.abs(tx)} ${r} 0 0 ${sweepInner} ${r} 0`;
  }

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Glow behind moon */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,240,232,0.08) 0%, rgba(245,240,232,0) 70%)",
          transform: "scale(1.5)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
      >
        {/* Dark disc (shadow side) */}
        <circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="#1a1a1a"
          stroke="#2a2a2a"
          strokeWidth="0.5"
        />

        {/* Lit portion */}
        {litPath && (
          <path
            d={litPath}
            fill="#f5f0e8"
            opacity="0.9"
            style={{
              transition: "d 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />
        )}

        {/* Subtle crater texture */}
        <circle cx={r * 0.7} cy={r * 0.6} r={r * 0.08} fill="#e8e0d0" opacity="0.15" />
        <circle cx={r * 1.2} cy={r * 0.8} r={r * 0.12} fill="#e8e0d0" opacity="0.1" />
        <circle cx={r * 0.9} cy={r * 1.3} r={r * 0.1} fill="#e8e0d0" opacity="0.12" />
        <circle cx={r * 1.1} cy={r * 0.4} r={r * 0.06} fill="#e8e0d0" opacity="0.08" />
      </svg>
    </div>
  );
}
