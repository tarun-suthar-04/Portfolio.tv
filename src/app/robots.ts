import type { MetadataRoute } from "next";

/**
 * Robots.txt generation.
 *
 * Production domain is not yet confirmed (see INFO.md §1).
 * The sitemap URL is left relative; once a domain is available, set the
 * NEXT_PUBLIC_SITE_URL environment variable and update the sitemap entry below.
 *
 * Example .env.production:
 *   NEXT_PUBLIC_SITE_URL=https://tarunsuthar.com
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/personal-work"], // canonical is /personal — redirect exists
      },
    ],
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
  };
}
