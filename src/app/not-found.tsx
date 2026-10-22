import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="page-shell not-found-page">
      <span className="eyebrow">404</span>
      <h1 className="not-found-title">
        Not<br />found<span className="wordmark-dot">.</span>
      </h1>
      <div className="not-found-body">
        <p>This page does not exist or has been moved.</p>
        <Link href="/" className="text-link">
          Back to portfolio <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
