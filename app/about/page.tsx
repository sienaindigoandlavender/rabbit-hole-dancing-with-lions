import { Metadata } from "next";
import ArchiveHeader from "@/app/components/ArchiveHeader";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "About — Dancing with Lions",
  description: "An archive of hidden knowledge, mapped onto the world.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flower-of-life" />
      <ArchiveHeader />

      <main className="flex-1 flex items-center justify-center" style={{ padding: "110px 26px" }}>
        <div className="max-w-prose" style={{ textAlign: "center" }}>
          <p className="font-serif" style={{ fontSize: "26px", lineHeight: "1.618", color: "var(--text-primary)", marginBottom: "42px" }}>
            Dancing with Lions is an archive of hidden knowledge.
          </p>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-secondary)", marginBottom: "26px" }}>
            We map what places mean, not just where they are.
          </p>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-secondary)", marginBottom: "26px" }}>
            Every entry is a person. Every story is true.
          </p>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: "1.618", color: "var(--text-secondary)", marginBottom: "42px" }}>
            The archive grows. The knowledge is permanent.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
