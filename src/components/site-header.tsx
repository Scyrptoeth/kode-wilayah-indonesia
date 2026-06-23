"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Wilayah" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link className="brand" href="/" aria-label="Kode Wilayah Indonesia">
          <span className="brand-mark" aria-hidden="true">
            ID
          </span>
          <span>Kode Wilayah Indonesia</span>
        </Link>

        <nav aria-label="Navigasi utama">
          <ul className="header-nav">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="header-nav-link"
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
