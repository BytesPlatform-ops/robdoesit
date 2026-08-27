import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";

import { site } from "@/data/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Loader } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { BookBar } from "@/components/layout/BookBar";
import { ViewerProvider } from "@/components/video/ViewerContext";
import { Motion } from "@/components/layout/Motion";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ROB DOES IT | Host, Interviewer & Professional Crowd Mover",
    template: "%s — ROB DOES IT",
  },
  description:
    "ROB DOES IT is an entertainment-first media brand in Los Angeles. Rob hosts the room, interviews the people and turns live events into social-first content. Book Rob for events, red carpets and interviews.",
  applicationName: site.name,
  authors: [{ name: site.person }],
  creator: site.person,
  keywords: [
    "ROB DOES IT",
    "event host Los Angeles",
    "red carpet interviewer Los Angeles",
    "event media coverage Los Angeles",
    "event content creator Los Angeles",
    "Hollywood interviewer",
    "professional event host",
    "social media event coverage",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: "ROB DOES IT — Host, Interviewer & Professional Crowd Mover",
    description:
      "Rob doesn't just cover the event. He moves it. Hosting, interviews and social-first event content out of Los Angeles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROB DOES IT — Host, Interviewer & Professional Crowd Mover",
    description:
      "Rob doesn't just cover the event. He moves it. Hosting, interviews and social-first event content out of Los Angeles.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.person,
  alternateName: site.name,
  jobTitle: "Host, Interviewer and Event Media Producer",
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
  sameAs: [
    "https://www.instagram.com/itsrobdoesit/",
    "https://www.youtube.com/@ITSROBDOESIT",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="bg-obsidian text-ivory antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain-global" aria-hidden />
        <Motion>
          <SmoothScroll />
          <Loader />
          <Cursor />
          <ViewerProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <BookBar />
          </ViewerProvider>
        </Motion>
      </body>
    </html>
  );
}
