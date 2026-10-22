import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.role}. ${site.tagline}`,
};

const capabilities = [
  "AI Video & Moving Image",
  "Generative Visuals & Portraits",
  "Editorial & Poster Design",
  "Advertising & Visual Concepts",
  "Visual Storytelling & Editing",
  "Color Theory & Composition",
];

const platformLinks = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Fiverr", href: site.fiverr },
].filter((link) => Boolean(link.href));

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      {/* Top Header Row */}
      <header className="about-header-row">
        <div className="about-label-group">
          <span className="eyebrow">About</span>
        </div>

        {site.availability && (
          <div className="about-status" aria-label={`Status: ${site.availability}`}>
            <span className="about-status-dot" aria-hidden="true" />
            <span className="about-status-text">{site.availability}</span>
          </div>
        )}
      </header>

      {/* Main Content Grid */}
      <section className="about-main-content">
        <div className="about-layout-grid">
          {/* Left Column: Identity, Role, Email & Platforms */}
          <div className="about-col-identity">
            <div className="about-name-block">
              <h1 className="about-hero-name">
                Tarun
                <br />
                Suthar<span className="wordmark-dot">.</span>
              </h1>
              <p className="about-role-title">{site.role}</p>
            </div>

            <div className="about-inquiry-block">
              <div className="about-contact-group">
                <span className="eyebrow">Direct Contact</span>
                <a
                  href={`mailto:${site.email || "cdstarun2004@gmail.com"}`}
                  className="about-email-cta"
                  aria-label={`Send email to ${site.email || "cdstarun2004@gmail.com"}`}
                >
                  <span>{site.email || "cdstarun2004@gmail.com"}</span>
                  <span className="about-arrow" aria-hidden="true">↗</span>
                </a>
              </div>

              {platformLinks.length > 0 && (
                <div className="about-platforms-group">
                  <span className="eyebrow">Profiles &amp; Connect</span>
                  <div className="about-platforms-list">
                    {platformLinks.map((platform) => (
                      <a
                        key={platform.label}
                        href={platform.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="about-platform-link"
                        aria-label={`${platform.label} profile (opens in new tab)`}
                      >
                        <span>{platform.label}</span>
                        <span className="about-arrow" aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Statement & Disciplines */}
          <div className="about-col-narrative">
            <div className="about-statement-block">
              <span className="eyebrow">Statement</span>
              <p className="about-statement-lead">
                I explore the possibilities of AI-assisted creativity, visual design, and moving images.
                My work spans AI-generated visuals, posters, portraits, advertising concepts,
                short-form video, and digital compositions.
              </p>
              <p className="about-statement-sub">
                I combine creative experimentation with an understanding of color theory,
                composition, image layers, editing, and visual storytelling.
              </p>
            </div>

            <div className="about-disciplines-block">
              <span className="eyebrow">Focus &amp; Disciplines</span>
              <ul className="about-disciplines-grid" aria-label="Creative disciplines">
                {capabilities.map((cap) => (
                  <li key={cap} className="about-discipline-item">
                    <span className="about-discipline-bullet" aria-hidden="true">—</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Colophon Row */}
      <footer className="about-footer-row">
        <span>{site.name}</span>
        <span className="about-brand-tag">{site.brand}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
