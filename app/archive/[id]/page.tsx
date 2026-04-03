import { Metadata } from "next";
import { getPointById, getPointsByCity } from "@/app/lib/supabase";
import ArchiveHeader from "@/app/components/ArchiveHeader";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface EntryPageProps {
  params: { id: string };
}

function getArchiveNumber(id: string, city: string): string {
  const cityCountry: Record<string, string> = {
    Marrakech: "MA", Fes: "MA", Essaouira: "MA", Rabat: "MA",
    Tangier: "MA", Casablanca: "MA", Ouarzazate: "MA", Agadir: "MA",
  };
  const code = cityCountry[city] || "XX";
  const num = id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
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

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const point = await getPointById(params.id);
  if (!point) return { title: "Not Found" };
  return {
    title: `${point.title} — ${point.city} | Dancing with Lions`,
    description: point.question,
    openGraph: {
      title: `${point.title} — ${point.city} | Dancing with Lions`,
      description: point.question,
      type: "article",
      ...(point.hero_image && { images: [{ url: point.hero_image }] }),
    },
    alternates: {
      canonical: `https://dancingwiththelions.com/archive/${params.id}`,
    },
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const point = await getPointById(params.id);
  if (!point) notFound();

  const archiveNumber = getArchiveNumber(point.id, point.city);
  const story = generateStory(point);
  const cityPoints = await getPointsByCity(point.city);
  const currentIndex = cityPoints.findIndex((p) => p.id === point.id);
  const prevPoint = currentIndex > 0 ? cityPoints[currentIndex - 1] : null;
  const nextPoint = currentIndex < cityPoints.length - 1 ? cityPoints[currentIndex + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: point.title,
    description: point.question,
    ...(point.hero_image && { image: point.hero_image }),
    author: { "@type": "Organization", name: "Dancing with Lions" },
    publisher: { "@type": "Organization", name: "Dancing with Lions", url: "https://dancingwiththelions.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://dancingwiththelions.com/archive/${params.id}` },
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="flower-of-life" />
      <ArchiveHeader />

      {/* Title bar — Cereal style */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border-warm bg-paper"
        style={{ height: "42px", marginTop: "68px", padding: "0 26px" }}
      >
        <span className="font-sans" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          ({archiveNumber})
        </span>
        <span
          className="font-serif"
          style={{ fontSize: "16px", fontVariant: "small-caps", letterSpacing: "0.15em", color: "var(--text-primary)" }}
        >
          {point.title}
        </span>
        <span className="font-sans" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Related
        </span>
      </div>

      {/* Previous / Next */}
      <div
        className="flex justify-center"
        style={{ paddingTop: "126px", marginBottom: "26px", gap: "26px" }}
      >
        {prevPoint ? (
          <Link href={`/archive/${prevPoint.id}`} className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
            ← Previous
          </Link>
        ) : <span />}
        {nextPoint ? (
          <Link href={`/archive/${nextPoint.id}`} className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
            Next →
          </Link>
        ) : <span />}
      </div>

      {/* Photo — real photograph or satellite fallback */}
      <div className="max-w-article mx-auto" style={{ padding: "0 26px", marginBottom: "42px" }}>
        {point.photo_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={point.photo_url} alt={point.title} className="w-full h-auto" style={{ borderRadius: "4px" }} />
            {point.photo_credit && (
              <p className="font-sans" style={{ fontSize: "10px", color: "var(--text-tertiary)", marginTop: "6px" }}>
                © {point.photo_credit}
              </p>
            )}
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=16&size=900x556&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`}
              alt={`Satellite view of ${point.title}`}
              className="w-full h-auto"
              style={{ borderRadius: "4px" }}
            />
            <p className="font-sans" style={{ fontSize: "10px", color: "var(--text-tertiary)", marginTop: "6px" }}>
              Satellite imagery · Google Maps
            </p>
          </>
        )}
      </div>

      {/* Entry content */}
      <article className="max-w-prose mx-auto" style={{ padding: "0 26px 110px" }}>
        {/* Archive number */}
        <p className="font-sans" style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
          ({archiveNumber})
        </p>

        {/* Country */}
        <p className="font-sans uppercase" style={{ fontSize: "13px", letterSpacing: "0.1em", color: "var(--text-secondary)", marginTop: "10px" }}>
          {point.city}, Morocco
        </p>

        {/* Title */}
        <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: 400, marginTop: "16px", lineHeight: "1.3", letterSpacing: "0.02em" }}>
          {point.title}
        </h1>

        {/* Question — the epigraph */}
        <blockquote className="font-serif italic" style={{ fontSize: "22px", lineHeight: "1.618", margin: "42px 0", color: "var(--text-primary)" }}>
          {point.question}
        </blockquote>

        {/* Answer — highlighted block */}
        <div style={{ background: "var(--bg-secondary)", borderLeft: "3px solid var(--accent-terracotta)", padding: "26px", borderRadius: "0 4px 4px 0", marginBottom: "42px" }}>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-primary)" }}>
            {point.answer}
          </p>
        </div>

        {/* Story */}
        <div className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-primary)" }}>
          {story.split("\n\n").map((p, i) => (
            <p key={i} style={{ marginBottom: "26px" }}>{p}</p>
          ))}
        </div>

        {/* Darija box */}
        {point.darija_word && (
          <div style={{ background: "var(--bg-secondary)", borderRadius: "10px", padding: "26px", marginTop: "42px" }}>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "10px" }}>
              Darija
            </p>
            <span className="font-serif" style={{ fontSize: "26px", color: "var(--accent-amber)" }}>
              {point.darija_word}
            </span>
            {point.darija_meaning && (
              <span className="font-sans" style={{ fontSize: "13px", marginLeft: "16px", color: "var(--text-secondary)" }}>
                {point.darija_meaning}
              </span>
            )}
            {point.darija_literal && (
              <p className="font-sans" style={{ fontSize: "10px", marginTop: "10px", color: "var(--text-tertiary)" }}>
                Literally: {point.darija_literal}
              </p>
            )}
          </div>
        )}

        {/* Thread links */}
        {nextPoint && (
          <div style={{ marginTop: "42px" }}>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "10px" }}>
              This thread continues in
            </p>
            <Link href={`/archive/${nextPoint.id}`} className="font-sans text-terracotta hover:text-terracotta/80 transition-colors duration-fast" style={{ fontSize: "13px" }}>
              {nextPoint.title} — {nextPoint.city} →
            </Link>
          </div>
        )}

        {/* Book placeholder */}
        <div style={{ marginTop: "42px" }}>
          <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "10px" }}>
            In the library
          </p>
          <p className="font-serif" style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
            <em>The Sheltering Sky</em> — Paul Bowles
          </p>
        </div>

        {/* Back to archive */}
        <div style={{ marginTop: "68px", textAlign: "center" }}>
          <Link href="/" className="font-sans text-text-tertiary hover:text-text-secondary transition-colors duration-fast" style={{ fontSize: "13px" }}>
            ← Return to the archive
          </Link>
        </div>
      </article>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
