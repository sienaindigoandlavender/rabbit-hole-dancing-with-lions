import { Metadata } from "next";
import ArchiveHeader from "@/app/components/ArchiveHeader";
import Footer from "@/app/components/Footer";
import GlossaryClient from "./GlossaryClient";

export const metadata: Metadata = {
  title: "Glossary — Dancing with Lions",
  description: "Cultural terms, architectural vocabulary, and definitions from the archive.",
};

const GLOSSARY_TERMS = [
  { term: "darija", definition: "The spoken Arabic dialect of Morocco and the Maghreb. Distinct from Modern Standard Arabic. Includes Amazigh, French, and Spanish loanwords. The language of the street, the souk, and the home." },
  { term: "dhikr", definition: "Sufi devotional practice of rhythmic chanting or recitation of the names of God. Often performed in circles, sometimes with movement. The word means 'remembrance.'" },
  { term: "foundouk", definition: "A caravanserai — an urban inn built around a central courtyard, used by travelling merchants. Ground floor for goods and animals, upper floors for sleeping. Many survive in Fes and Marrakech as artisan workshops." },
  { term: "khettara", definition: "Underground water channels, similar to Persian qanat. Built to carry groundwater from the Atlas foothills to cities and oases without evaporation. Some in Marrakech are over 1,000 years old." },
  { term: "ksar", definition: "A fortified village in southern Morocco, built of rammed earth (pisé). Plural: ksour. Aït Benhaddou is the most famous. The architecture is defensive, communal, and perfectly adapted to the Saharan edge." },
  { term: "madrasa", definition: "A school of Islamic learning, typically attached to a mosque. In Morocco, the Marinid dynasty built the greatest examples — the Bou Inania in Fes is a masterpiece of carved stucco, zellige, and cedar." },
  { term: "mihrab", definition: "The niche in a mosque wall indicating the direction of Mecca (the qibla). Often the most decorated element of the mosque. Its shape creates acoustic amplification for the imam's voice." },
  { term: "pisé", definition: "Rammed earth construction. Layers of damp earth packed between wooden forms. The material of Marrakech's walls, southern ksour, and kasbahs. Warm in winter, cool in summer. The colour of the earth determines the colour of the city." },
  { term: "qibla", definition: "The direction of the Kaaba in Mecca, toward which Muslims pray. Every mosque is oriented to the qibla. In Morocco, this is roughly east-southeast." },
  { term: "tamazight", definition: "The Amazigh (Berber) language family, indigenous to North Africa. Three main variants in Morocco: Tarifit (Rif), Tamazight (Middle Atlas), and Tashelhit (Souss/High Atlas). Official language since 2011." },
  { term: "tariqa", definition: "A Sufi order or brotherhood. Morocco has several active tariqas, including the Qadiriyya, Tijaniyya, and Boutchichiyya. Each has its own chain of spiritual transmission (silsila) traced back to the Prophet." },
  { term: "zaouia", definition: "A Sufi lodge and sanctuary, often built around the tomb of a saint (wali). A place of worship, teaching, and shelter. The zaouia of Moulay Idriss II in Fes is the spiritual heart of the city." },
  { term: "zellige", definition: "Geometric mosaic tilework, hand-cut from glazed terracotta. Each piece (tessera) is chipped by hand to precise geometric shapes, then assembled face-down into panels. The mathematics are Islamic — no figurative imagery, only infinite pattern." },
].sort((a, b) => a.term.localeCompare(b.term));

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="flower-of-life" />
      <ArchiveHeader />

      <div style={{ paddingTop: "110px", paddingBottom: "110px" }}>
        <div className="max-w-prose mx-auto" style={{ padding: "0 26px" }}>
          <h1
            className="font-serif"
            style={{ fontSize: "42px", fontWeight: 400, marginBottom: "68px" }}
          >
            Glossary
          </h1>

          <GlossaryClient terms={GLOSSARY_TERMS} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
