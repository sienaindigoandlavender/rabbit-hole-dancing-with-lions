import { DecoderPoint } from "@/app/lib/supabase";

interface DarijaBoxProps {
  point: DecoderPoint;
}

export default function DarijaBox({ point }: DarijaBoxProps) {
  if (!point.darija_word) return null;

  return (
    <div className="bg-dark border border-border rounded-lg p-4 mt-4">
      <p className="text-xs uppercase tracking-widest text-terracotta font-sans mb-2">
        Darija
      </p>
      <p className="font-serif text-2xl text-amber mb-1">{point.darija_word}</p>
      {point.darija_meaning && (
        <p className="font-sans text-sm text-cream/80">{point.darija_meaning}</p>
      )}
      {point.darija_literal && (
        <p className="font-sans text-xs text-cream/50 mt-1">
          Literally: {point.darija_literal}
        </p>
      )}
      {point.darija_context && (
        <p className="font-sans text-sm text-cream/60 mt-2 leading-relaxed">
          {point.darija_context}
        </p>
      )}
    </div>
  );
}
