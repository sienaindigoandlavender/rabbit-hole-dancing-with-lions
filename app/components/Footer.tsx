import Link from "next/link";
import { CITIES } from "@/app/lib/supabase";

export default function Footer() {
  return (
    <footer>
      <div className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">
                Explore
              </h3>
              <div className="flex flex-col gap-2">
                {CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="font-sans text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">
                About
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  className="font-sans text-sm text-cream/60 hover:text-cream transition-colors"
                >
                  About
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">
                Legal
              </h3>
              <div className="flex flex-col gap-2">
                <span className="font-sans text-sm text-cream/40">
                  Privacy Policy
                </span>
                <span className="font-sans text-sm text-cream/40">
                  Terms of Service
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Translate Widget */}
        <div className="border-t border-border px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div id="google_translate_element"></div>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  function googleTranslateElementInit() {
                    new google.translate.TranslateElement(
                      { pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                      'google_translate_element'
                    );
                  }
                `,
              }}
            />
            <script
              src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
              async
            />
          </div>
        </div>
      </div>

      <div className="bg-dark px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-sans text-xs text-cream/30">
            © 2026 Dancing with Lions
          </p>
        </div>
      </div>
    </footer>
  );
}
