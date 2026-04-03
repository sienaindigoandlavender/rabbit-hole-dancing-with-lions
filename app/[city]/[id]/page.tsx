import { Metadata } from "next";
import {
  getPointById,
  getPointsByCity,
  getTrailsByCity,
  getCityFromSlug,
} from "@/app/lib/supabase";
import StoryLayout from "@/app/components/StoryLayout";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface StoryPageProps {
  params: { city: string; id: string };
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const point = await getPointById(params.id);
  if (!point) return { title: "Not Found" };

  const cityName = getCityFromSlug(params.city);
  return {
    title: `${point.title} — ${cityName} | Dancing with Lions`,
    description: point.question,
    openGraph: {
      title: `${point.title} — ${cityName} | Dancing with Lions`,
      description: point.question,
      ...(point.hero_image && {
        images: [{ url: point.hero_image }],
      }),
      type: "article",
    },
    alternates: {
      canonical: `https://dancingwiththelions.com/${params.city}/${params.id}`,
    },
  };
}

function generateDeepContent(point: { title: string; question: string; answer: string; city: string; category: string }): string {
  const paragraphs = [
    `The story begins not with a guidebook, but with a question most visitors never think to ask. ${point.question} In ${point.city}, this is the kind of knowledge that separates the traveller from the tourist. The answer sits in plain sight, waiting for someone curious enough to look.`,

    `${point.answer} But that is only the surface. Peel back a layer and you find something older, something rooted in the way this city has always done things. The locals know this. They have known it for generations. It is passed down in conversation, not in textbooks.`,

    `To understand this, you have to understand ${point.city} itself. This is a city that has always traded in two currencies: commerce and knowledge. The merchants who built its souks also built its libraries. The artisans who shaped its walls also shaped its identity. Nothing here is accidental.`,

    `Walk through the medina in the early morning, before the tour groups arrive. The light falls differently at this hour. Shopkeepers arrange their wares with a precision that speaks to centuries of practice. The geometry of the streets is not random — it was designed to funnel wind, to create shade, to direct the flow of people toward places that matter.`,

    `The ${point.category.toLowerCase()} traditions of ${point.city} are older than most European capitals. They predate the borders of the modern nation-state. They survived colonial administration, independence movements, and the flattening force of globalisation. They survive because they are useful, not because they are preserved as museum pieces.`,

    `Consider what ${point.title.toLowerCase()} means in context. It is not a monument frozen in time. It is a living practice, a thread in the fabric of daily life. The people who maintain this knowledge do not think of it as heritage. They think of it as Tuesday.`,

    `There is a particular quality to the way ${point.city} holds its secrets. The city does not hide them exactly — it simply does not advertise them. The information is there for anyone who asks the right question, who lingers in the right doorway, who sits in the right cafe at the right hour.`,

    `Scholars have written about this phenomenon. The French geographer who mapped the medina in 1912 noted that the most important buildings were often the least visible from the main thoroughfares. The British diplomat who passed through in 1865 described a city of "infinite corridors, each leading to a world entire unto itself."`,

    `The practical implications for the modern visitor are straightforward. Slow down. Look up. Notice the details that the rushing crowd misses. The carved plasterwork above a doorway. The particular shade of blue on a set of tiles. The way an old man greets a shopkeeper — the specific words, the gesture, the pause before speaking.`,

    `This is what ${point.title.toLowerCase()} teaches, if you let it. Not a fact to be memorised, but a way of seeing. The city rewards attention. Every corner turned reveals something the last corner promised. Every question answered opens two more. This is the rabbit hole. This is where it gets interesting.`,
  ];

  return paragraphs.join("\n\n");
}

export default async function StoryPage({ params }: StoryPageProps) {
  const point = await getPointById(params.id);
  if (!point) notFound();

  const cityName = getCityFromSlug(params.city);
  const cityPoints = await getPointsByCity(cityName);
  const currentIndex = cityPoints.findIndex((p) => p.id === point.id);
  const prevPoint = currentIndex > 0 ? cityPoints[currentIndex - 1] : null;
  const nextPoint =
    currentIndex < cityPoints.length - 1 ? cityPoints[currentIndex + 1] : null;

  // Find trail this point belongs to
  const trails = await getTrailsByCity(cityName);
  const trail = trails.find((t) => t.point_ids.includes(point.id)) || null;

  const deepContent = generateDeepContent(point);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: point.title,
    description: point.question,
    ...(point.hero_image && { image: point.hero_image }),
    author: {
      "@type": "Organization",
      name: "Dancing with Lions",
    },
    publisher: {
      "@type": "Organization",
      name: "Dancing with Lions",
      url: "https://dancingwiththelions.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dancingwiththelions.com/${params.city}/${params.id}`,
    },
  };

  return (
    <div className="min-h-screen bg-dark overflow-y-auto h-screen">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="font-serif text-xl text-cream hover:text-amber transition-colors"
        >
          Dancing with Lions
        </Link>
        <span className="text-cream/20">/</span>
        <Link
          href={`/${params.city}`}
          className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
        >
          {cityName}
        </Link>
      </nav>

      <StoryLayout
        point={point}
        trail={trail}
        nextPoint={nextPoint}
        prevPoint={prevPoint}
        deepContent={deepContent}
      />

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
