import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dancing with Lions — Archive of Hidden Knowledge",
  description:
    "An archive of hidden knowledge, mapped onto the world. Every entry is a person. Every story is true.",
  openGraph: {
    title: "Dancing with Lions",
    description:
      "An archive of hidden knowledge, mapped onto the world.",
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
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-P1CGE62ZD4"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P1CGE62ZD4');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-paper text-text-primary">
        {children}
      </body>
    </html>
  );
}
