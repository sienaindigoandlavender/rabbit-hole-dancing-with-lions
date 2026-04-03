import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "About — Dancing with Lions",
  description: "A cultural intelligence platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col overflow-y-auto h-screen">
      <nav className="px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl text-cream hover:text-amber transition-colors"
        >
          Dancing with Lions
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-prose text-center space-y-6">
          <p className="font-serif text-2xl text-cream leading-relaxed">
            Dancing with Lions is a cultural intelligence platform.
          </p>
          <p className="font-sans text-base text-cream/70 leading-relaxed">
            We publish what places mean, not just where they are.
          </p>
          <p className="font-sans text-base text-cream/70 leading-relaxed">
            Every city has a hidden layer. We make it visible.
          </p>
          <p className="font-sans text-sm text-cream/40 mt-12">
            hello@dancingwiththelions.com
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
