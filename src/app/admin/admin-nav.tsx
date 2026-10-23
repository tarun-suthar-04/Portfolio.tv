"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/projects", label: "Projects", exact: false },
  { href: "/admin/projects/new", label: "Add Work", exact: true },
  { href: "/admin/categories", label: "Categories", exact: false },
  { href: "/admin/media", label: "Media Library", exact: false },
  { href: "/admin/settings", label: "Settings", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation">
      {navLinks.map(({ href, label, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname === href || (href !== "/admin" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={isActive ? "is-active" : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
