import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.brand}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.brand,
    title: `${site.name} — ${site.brand}`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.brand}`,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to self for faster font loading if a web font is added later */}
        <link rel="preconnect" href="/" />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
