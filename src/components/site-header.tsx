"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
type NavCategory={name:string;slug:string};

export function SiteHeader({categories=[]}:{categories?:NavCategory[]}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if(pathname.startsWith("/admin")) return null;

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label={`${site.name} home`} onClick={() => setOpen(false)}>
        {site.name}
      </Link>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="primary-navigation" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
        {categories.map((category) => (
          <Link key={category.slug} href={category.slug === "stories" || category.slug === "commercials" || category.slug === "personal" ? `/${category.slug}` : `/category/${category.slug}`} onClick={() => setOpen(false)} aria-current={pathname === `/${category.slug}` || pathname === `/category/${category.slug}` ? "page" : undefined}>
            {category.name}
          </Link>
        ))}
        <Link href="/about" onClick={() => setOpen(false)} aria-current={pathname === "/about" ? "page" : undefined}>About</Link>
      </nav>
    </header>
  );
}
