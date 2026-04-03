import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-warm" style={{ padding: "42px 26px" }}>
      <div className="max-w-article mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "42px", marginBottom: "42px" }}>
          <div>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "16px" }}>
              Explore
            </p>
            <div className="flex flex-col" style={{ gap: "6px" }}>
              <Link href="/map" className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
                The Map
              </Link>
              <Link href="/calendar" className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
                Sacred Calendar
              </Link>
              <Link href="/glossary" className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
                Glossary
              </Link>
            </div>
          </div>

          <div>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "16px" }}>
              About
            </p>
            <div className="flex flex-col" style={{ gap: "6px" }}>
              <Link href="/about" className="font-sans text-text-secondary hover:text-text-primary transition-colors duration-fast" style={{ fontSize: "13px" }}>
                Information
              </Link>
            </div>
          </div>

          <div>
            <p className="font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "16px" }}>
              Legal
            </p>
            <div className="flex flex-col" style={{ gap: "6px" }}>
              <span className="font-sans" style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
                Privacy Policy
              </span>
              <span className="font-sans" style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
                Terms of Service
              </span>
            </div>
          </div>
        </div>

        <p className="font-sans" style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
          © 2026 Dancing with Lions
        </p>
      </div>
    </footer>
  );
}
