"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/about-movements", label: "About Movements" },
  { href: "/examples", label: "Examples" },
  { href: "/matic", label: "MATIC" },
  { href: "/engage", label: "Engage" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-3.5 flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/movemental.svg"
            alt=""
            width={32}
            height={32}
            className="w-7 h-7 md:w-8 md:h-8"
            priority
          />
          <span className="font-extrabold text-zinc-900 text-base tracking-tight">
            movemental
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 ml-2">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-semibold transition-colors ${
                  active
                    ? "text-brand"
                    : "text-zinc-700 hover:text-brand"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/engage"
          className="hidden md:inline-flex items-center bg-zinc-900 hover:bg-brand text-white text-xs font-extrabold tracking-wide uppercase px-4 py-2 rounded-full ml-auto transition-colors"
        >
          Get in touch
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto p-1.5 text-zinc-900"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-2 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base font-semibold border-b border-zinc-100 last:border-b-0 ${
                  pathname === l.href ? "text-brand" : "text-zinc-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
