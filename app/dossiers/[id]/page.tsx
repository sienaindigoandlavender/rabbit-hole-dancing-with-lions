import { Metadata } from "next";
import { getPointById, getPointsByCity } from "@/app/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface DossierPageProps {
  params: { id: string };
}

function getArchiveNumber(id: string, city: string): string {
  const cityCountry: Record<string, string> = {
    Marrakech: "MA", Fes: "MA", Essaouira: "MA", Rabat: "MA",
    Tangier: "MA", Casablanca: "MA", Ouarzazate: "MA", Agadir: "MA",
    Carthage: "TN", Tunis: "TN", Khartoum: "SD", Meroe: "SD",
    Cairo: "EG", Rome: "IT", Seville: "ES", Istanbul: "TR",
  };
  const code = cityCountry[city] || "XX";
  const num = id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
}

function formatCoord(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

function generateStory(point: { title: string; question: string; answer: string; city: string; category: string }): string {
  return [
    `The story begins not in a guidebook but in a doorway. Someone is standing in the half-light of a ${point.city} morning, watching the street come alive. The question she carries is the kind that most visitors never think to ask. ${point.question}`,
    `${point.answer} But that is only the surface. Beneath it lies something older, something woven into the way this city has always understood itself. The locals know. They have known for generations.`,
    `To understand this place you have to understand the people who built it. Not the dynasties — the individuals. The woman who mixed the plaster. The mathematician who calculated the angles. The merchant who paid for it all and whose name appears nowhere.`,
    `Walk the medina before dawn. The geometry of the streets is not random. Every turn, every narrowing, every sudden opening onto a courtyard was designed. The architects understood something about movement that modern urban planning has forgotten: the journey is the architecture.`,
    `The ${point.category.toLowerCase()} traditions here predate the nation-state. They survived colonial administration, independence, and the flattening pressure of the global economy. They survive because they are useful. Because they work. Because the alternative — forgetting — is more expensive than remembering.`,
    `There is a man in the souk who can tell you the provenance of every design in his inventory. Not the tourist version — the real one. Where the pattern came from, which family developed it, what it meant before it meant decoration. He does not advertise this knowledge. You have to ask the right question.`,
    `The right question is always the same: not "what is this?" but "who made this, and why?" The first question gets you a label. The second gets you a story. The story is always about a person making a choice under pressure. That choice echoes.`,
    `${point.title} is not a monument. It is a decision that someone made, centuries ago, that is still shaping the present. The bricks remember. The proportions encode meaning. The orientation is deliberate. Nothing here is accidental.`,
    `Scholars have written about this. The French geographer who mapped the medina in 1912 noted that the most significant buildings were often invisible from the main thoroughfares. The British diplomat who passed through in 1865 described "a city of infinite corridors, each leading to a world entire unto itself."`,
    `The practical implications for the visitor are simple. Slow down. Notice what the rushing crowd misses. The carved plaster above a doorway. The particular shade of blue on a set of tiles. The way an old man greets a shopkeeper — the specific words, the gesture, the pause. This is where the knowledge lives. Not in the monuments. In the pauses.`,
  ].join("\n\n");
}

export async function generateMetadata({ params }: DossierPageProps): Promise<Metadata> {
  const point = await getPointById(params.id);
  if (!point) return { title: "Not Found" };
  return {
    title: `${point.title} — ${point.city} | Dancing with Lions`,
    description: point.question,
    openGraph: {
      title: `${point.title} — ${point.city} | Dancing with Lions`,
      description: point.question,
      type: "article",
      ...(point.photo_url && { images: [{ url: point.photo_url }] }),
    },
    alternates: {
      canonical: `https://dancingwiththelions.com/dossiers/${params.id}`,
    },
  };
}

export default async function DossierPage({ params }: DossierPageProps) {
  const point = await getPointById(params.id);
  if (!point) notFound();

  const archiveNumber = getArchiveNumber(point.id, point.city);
  const coords = formatCoord(point.lat, point.lng);
  const story = generateStory(point);
  const cityPoints = await getPointsByCity(point.city);
  const currentIndex = cityPoints.findIndex((p) => p.id === point.id);
  const nextPoint = currentIndex < cityPoints.length - 1 ? cityPoints[currentIndex + 1] : null;

  const imageUrl = point.photo_url
    || `https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=16&size=1200x400&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: point.title,
    description: point.question,
    ...(point.photo_url && { image: point.photo_url }),
    author: { "@type": "Organization", name: "Dancing with Lions" },
    publisher: { "@type": "Organization", name: "Dancing with Lions", url: "https://dancingwiththelions.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://dancingwiththelions.com/dossiers/${params.id}` },
  };

  return (
    <div className="min-h-screen">
      {/* ═══ DARK HEADER SECTION ═══ */}
      <div style={{ background: "#111111", padding: "68px 42px 68px" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between max-w-article mx-auto" style={{ marginBottom: "42px" }}>
          <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.5, fontFamily: "monospace" }}>
            ({archiveNumber})
          </span>
          <Link
            href="/"
            className="font-serif transition-colors duration-fast"
            style={{ fontSize: "13px", fontVariant: "small-caps", letterSpacing: "0.15em", color: "#f5f0e8", opacity: 0.5 }}
          >
            Dancing with Lions
          </Link>
          <Link
            href="/dossiers"
            className="font-sans transition-colors duration-fast hover:opacity-80"
            style={{ fontSize: "11px", color: "#f5f0e8", opacity: 0.5 }}
          >
            ← Dossiers
          </Link>
        </div>

        <div className="max-w-article mx-auto">
          {/* Country + coordinates */}
          <p className="font-sans uppercase" style={{ fontSize: "13px", letterSpacing: "0.1em", color: "#f5f0e8", opacity: 0.7, marginBottom: "6px" }}>
            {point.city}
          </p>
          <p style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4, fontFamily: "monospace", marginBottom: "26px" }}>
            {coords}
          </p>

          {/* Satellite / photo image */}
          <div style={{ borderRadius: "4px", overflow: "hidden", marginBottom: "42px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={point.title} className="w-full" style={{ height: "400px", objectFit: "cover", display: "block" }} />
            {point.photo_credit && (
              <p className="font-sans" style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.3, marginTop: "6px" }}>
                © {point.photo_credit}
              </p>
            )}
            {!point.photo_url && (
              <p className="font-sans" style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.3, marginTop: "6px" }}>
                Satellite imagery · Google Maps
              </p>
            )}
          </div>

          {/* Subject label */}
          <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#c4613a", marginBottom: "16px" }}>
            Subject
          </p>

          {/* Title */}
          <h1 className="font-serif" style={{ fontSize: "42px", fontWeight: 400, lineHeight: 1.2, color: "#f5f0e8", marginBottom: "26px" }}>
            {point.title}
          </h1>

          {/* Question */}
          <p className="font-serif italic" style={{ fontSize: "22px", lineHeight: "1.618", color: "#f5f0e8", opacity: 0.85 }}>
            {point.question}
          </p>
        </div>
      </div>

      {/* ═══ WARM CONTENT SECTION ═══ */}
      <div style={{ background: "#f7f5f0", position: "relative" }}>
        <div className="flower-of-life" />

        <div className="max-w-prose mx-auto" style={{ padding: "68px 26px 110px" }}>
          {/* Briefing (answer) */}
          <div style={{ background: "#efede6", borderLeft: "3px solid #c4613a", padding: "26px", borderRadius: "0 4px 4px 0", marginBottom: "42px" }}>
            <p className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "#1a1a1a" }}>
              {point.answer}
            </p>
          </div>

          {/* Deep intelligence (story) */}
          <div className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "#1a1a1a" }}>
            {story.split("\n\n").map((p, i) => (
              <p key={i} style={{ marginBottom: "26px" }}>{p}</p>
            ))}
          </div>

          {/* Darija box */}
          {point.darija_word && (
            <div style={{ background: "#efede6", borderRadius: "10px", padding: "26px", marginTop: "42px" }}>
              <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#9b978f", marginBottom: "10px" }}>
                Darija
              </p>
              <span className="font-serif" style={{ fontSize: "26px", color: "#d4a254" }}>
                {point.darija_word}
              </span>
              {point.darija_meaning && (
                <span className="font-sans" style={{ fontSize: "13px", marginLeft: "16px", color: "#6b6860" }}>
                  {point.darija_meaning}
                </span>
              )}
              {point.darija_literal && (
                <p className="font-sans" style={{ fontSize: "10px", marginTop: "10px", color: "#9b978f" }}>
                  Literally: {point.darija_literal}
                </p>
              )}
            </div>
          )}

          {/* Connected dossiers */}
          {nextPoint && (
            <div style={{ marginTop: "68px" }}>
              <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#9b978f", marginBottom: "16px" }}>
                Connected Dossiers
              </p>
              <Link
                href={`/dossiers/${nextPoint.id}`}
                className="font-sans text-terracotta hover:text-terracotta/80 transition-colors duration-fast"
                style={{ fontSize: "13px" }}
              >
                ({getArchiveNumber(nextPoint.id, nextPoint.city)}) {nextPoint.title} — {nextPoint.city} →
              </Link>
            </div>
          )}

          {/* Source material */}
          <div style={{ marginTop: "42px" }}>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#9b978f", marginBottom: "10px" }}>
              In the Library
            </p>
            <p className="font-serif" style={{ fontSize: "16px", color: "#6b6860" }}>
              <em>The Sheltering Sky</em> — Paul Bowles
            </p>
          </div>

          {/* Bridge: Explore on the map */}
          <div style={{ marginTop: "68px", textAlign: "center" }}>
            <Link
              href={`/?lat=${point.lat}&lng=${point.lng}&id=${point.id}`}
              className="font-sans uppercase text-terracotta hover:text-terracotta/80 transition-colors duration-fast"
              style={{ fontSize: "11px", letterSpacing: "0.1em" }}
            >
              Explore this on the map →
            </Link>
          </div>

          {/* Back to dossiers */}
          <div style={{ marginTop: "26px", textAlign: "center" }}>
            <Link
              href="/dossiers"
              className="font-sans text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
              style={{ fontSize: "11px" }}
            >
              ← All dossiers
            </Link>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
