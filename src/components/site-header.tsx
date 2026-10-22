"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { projectBySlug } from "@/data/projects";

const links = [
  { href: "/personal", label: "Personal" },
  { href: "/commercials", label: "Commercials" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentProject = pathname.startsWith("/projects/") ? projectBySlug(pathname.split("/").pop() ?? "") : undefined;

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label={`${site.name} home`} onClick={() => setOpen(false)}>
        {site.name}
      </Link>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="primary-navigation" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href || currentProject?.category === link.label ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
