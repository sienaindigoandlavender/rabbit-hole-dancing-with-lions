import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dancing with Lions — Cultural Intelligence",
  description:
    "A cultural intelligence platform. Discover what places mean, not just where they are.",
  openGraph: {
    title: "Dancing with Lions",
    description:
      "A cultural intelligence platform. Discover what places mean, not just where they are.",
    url: "https://dancingwiththelions.com",
    siteName: "Dancing with Lions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-dark text-cream">
        {children}
      </body>
    </html>
  );
}
