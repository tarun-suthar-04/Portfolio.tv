import type { Metadata } from "next";
import { site } from "@/data/site";
import { PortraitRotation } from "./portrait-rotation";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.role}. ${site.tagline}`,
};

const disciplines = [
  "AI Video & Moving Image",
  "Generative Visuals & Portraits",
  "Editorial & Poster Design",
  "Advertising & Visual Concepts",
  "Visual Storytelling & Editing",
  "Color Theory & Composition",
];

const profiles = [
  { label: "GitHub", href: site.github, mark: "github" },
  { label: "LinkedIn", href: site.linkedin, mark: "linkedin" },
  { label: "Fiverr", href: site.fiverr, mark: "fiverr" },
].filter((profile) => Boolean(profile.href));

function ProfileMark({ mark }: { mark: string }) {
  if (mark === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="about-profile-icon" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }

  if (mark === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="about-profile-icon" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 8 24 9" aria-hidden="true" className="about-profile-icon about-profile-icon-fiverr" fill="currentColor">
      <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99a.995.995 0 0 0-.002 1.99m-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858c.43 0 .732-.175.83-.487l1.425.4c-.351.848-1.22 1.364-2.255 1.364c-1.748 0-2.549-1.355-2.549-2.515c0-1.14.703-2.505 2.45-2.505c1.856 0 2.471 1.384 2.471 2.408c0 .224-.01.37-.02.477zm-1.562-.945c-.04-.42-.342-.81-.889-.81c-.508 0-.81.225-.908.81zM7.508 15.44h1.416l1.767-4.874h-1.62l-.86 2.837l-.878-2.837H5.72l1.787 4.874zm-6.6 0H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z" />
    </svg>
  );
}

export default function AboutPage() {
  const email = site.email || "cdstarun2004@gmail.com";

  return (
    <main className="page-shell about-page">
      <header className="about-header-row">
        <span className="about-top-label">About</span>
        {site.availability && (
          <p className="about-status" aria-label={`Status: ${site.availability}`}>
            <span className="about-status-dot" aria-hidden="true" />
            <span>{site.availability}</span>
          </p>
        )}
      </header>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <h1 id="about-title" className="about-hero-name">Tarun<br />Suthar</h1>
          <p className="about-role-title">{site.role}</p>
        </div>
        <PortraitRotation />
      </section>

      <section className="about-statement-section" aria-label="Statement and disciplines">
        <div className="about-statement-column">
          <span className="eyebrow">Statement</span>
          <p className="about-statement-lead">I explore the possibilities of AI-assisted creativity, visual design, and moving images.</p>
          <p className="about-statement-sub">My work spans AI-generated visuals, posters, portraits, advertising concepts, short-form video, and digital compositions — combining creative experimentation with an understanding of color theory, composition, image layers, editing, and visual storytelling.</p>
        </div>
        <div className="about-disciplines-column">
          <span className="eyebrow">Focus &amp; disciplines</span>
          <ul className="about-disciplines-list">
            {disciplines.map((discipline) => (
              <li key={discipline}><span aria-hidden="true">—</span>{discipline}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-stats" aria-labelledby="about-stats-heading">
        <h2 id="about-stats-heading" className="eyebrow">At a glance</h2>
        <dl className="about-stats-list">
          <div><dt>AI visuals</dt><dd>100+</dd></div>
          <div><dt>Videos</dt><dd>30+</dd></div>
          <div><dt>Creative explorations</dt><dd aria-label="Infinity">∞</dd></div>
        </dl>
      </section>

      <section className="about-contact" aria-label="Contact and profiles">
        <div className="about-contact-column">
          <span className="eyebrow">Direct contact</span>
          <a href={`mailto:${email}`} className="about-email-cta">
            <span>{email}</span><span aria-hidden="true">↗</span>
          </a>
        </div>
        {profiles.length > 0 && (
          <div className="about-profiles-column">
            <span className="eyebrow">Profiles &amp; connect</span>
            <ul className="about-profiles-list">
              {profiles.map((profile) => (
                <li key={profile.label}>
                  <a href={profile.href} target="_blank" rel="noreferrer noopener" aria-label={`${profile.label} profile, opens in a new tab`}>
                    <ProfileMark mark={profile.mark} /><span className="about-external-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className="about-footer-row">
        <span>{site.name}</span>
        <span className="about-brand-tag">{site.brand}</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
