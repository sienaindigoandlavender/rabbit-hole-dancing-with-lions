import { Metadata } from "next";
import ArchiveHeader from "@/app/components/ArchiveHeader";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "The Archive — Dancing with Lions",
  description: "You don't need a plane ticket to travel. You need a story.",
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="flower-of-life" />
      <ArchiveHeader />

      <article
        className="max-w-prose mx-auto font-serif"
        style={{
          paddingTop: "136px",
          paddingBottom: "110px",
          paddingLeft: "26px",
          paddingRight: "26px",
          fontSize: "20px",
          lineHeight: "1.618",
          color: "#1a1a1a",
        }}
      >
        <p style={{ marginBottom: "42px" }}>
          You don&rsquo;t need a plane ticket to travel.
        </p>

        <p style={{ marginBottom: "42px" }}>
          You need a story about a general who crossed the Alps with elephants and died alone with poison on his lips. You need a painting of a swimmer on a cave wall in a desert that hasn&rsquo;t seen rain in five thousand years. You need to know that a woman in 9th-century Fes spent her entire inheritance building a university that is still open. You need to hear that the same mosque was built in Marrakech and Seville by the same hands in the same century, and that the strait between them is only fourteen kilometres wide.
        </p>

        <p style={{ marginBottom: "42px" }}>
          You need a thread to pull. And then another. And then another.
        </p>

        <p style={{ marginBottom: "42px" }}>
          Dancing with Lions is an archive. Not a travel guide. Not a magazine. Not a blog. There are no issue numbers, no publication dates, no articles that age. The archive is permanent. What was true about Hannibal is still true. What was true about Shahrazad is still true. The knowledge does not expire because it was never news. It was always there, waiting.
        </p>

        <p style={{ marginBottom: "42px" }}>
          The map is the interface. Tap a point. A question appears. The question leads to a person. The person leads to a story. The story leads to a book, a film, a piece of music, another country, another century. You entered because you were curious about Morocco. An hour later you are in Sudan, looking at pyramids you didn&rsquo;t know existed, reading about a king whose name is in the Bible.
        </p>

        <p style={{ marginBottom: "42px" }}>
          You didn&rsquo;t plan this. The archive pulled you in. That is how it works.
        </p>

        <p style={{ marginBottom: "42px" }}>
          This is for everyone who travels with their mind. The woman on her couch on a Sunday afternoon who surfaces three hours later having crossed six countries and two millennia. The student who cannot afford a flight but can afford a library card. The father who hasn&rsquo;t left his city in years but knows more about Samarkand than most people who&rsquo;ve been there. The grandmother who once walked the medina and now walks it again through a story that puts her back inside the sound of the call to prayer.
        </p>

        <p style={{ marginBottom: "42px" }}>
          There is no correct way to use the archive. There is no starting point. There is no order. Like any library, there are a hundred doors and every one is an entrance.
        </p>

        <p style={{ marginBottom: "42px" }}>
          Walk in through a story about a woman who survived with a cliffhanger. Walk in through a map of Sudan. Walk in through a book someone recommended. Walk in through a film you just watched and a question it left unanswered. Walk in through a playlist that made you feel homesick for a place you&rsquo;ve never been. Walk in through a photograph. Walk in through a calendar that told you a billion people are fasting today and you wanted to know why.
        </p>

        <p style={{ marginBottom: "42px" }}>
          Browse. Wander. Follow what interests you. Ignore what doesn&rsquo;t. Some people come for a single question and leave. Some people stay for hours. Both are right. The archive is not a course. There is no curriculum. There is no progress bar. There is no certificate at the end. There is just the world, waiting to be explored in whatever order you choose.
        </p>

        <p style={{ marginBottom: "42px" }}>
          We are curators. We gather stories from every corner of the world &mdash; the ones that make you stop and say &ldquo;I didn&rsquo;t know that.&rdquo; We pair them with the books that go deeper, the films that bring them to life, the music that lets you hear the place. We draw threads between countries that most maps keep separate. We put it all on a map because a map is how humans have always understood the world.
        </p>

        <p style={{ marginBottom: "42px" }}>
          The archive grows. New countries. New stories. New threads. The map is never finished because the world is never finished. There is always another point glowing on the horizon. There is always another question.
        </p>

        <p style={{ marginBottom: "42px" }}>
          You don&rsquo;t need a passport. You don&rsquo;t need a budget. You don&rsquo;t need permission.
        </p>

        <p>
          You just need to be curious.
        </p>
      </article>

      <Footer />
    </div>
  );
}
