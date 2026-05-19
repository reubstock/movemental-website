import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about-movements", label: "About Movements" },
  { href: "/examples", label: "Examples" },
  { href: "/tools", label: "Tools" },
  { href: "/team", label: "Team" },
  { href: "/engage", label: "Engage" },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/movemental.svg"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-extrabold text-zinc-900 text-base tracking-tight">
                movementum
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              We turn promising ideas into global movements. The Open Letter
              is the keystone; everything else amplifies it.
            </p>
          </div>

          {/* Site map */}
          <nav className="flex flex-col gap-2">
            <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-zinc-500">
              Site
            </div>
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-zinc-700 hover:text-brand transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Reach */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-zinc-500">
              Reach
            </div>
            <Link
              href="/engage#contact"
              className="text-sm text-zinc-700 hover:text-brand transition-colors"
            >
              Get in touch
            </Link>
            <a
              href="https://www.linkedin.com/in/reubensteiger/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-700 hover:text-brand transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} Movementum.</div>
          <div className="font-mono tracking-wider uppercase text-[10px]">
            Movement, not marketing.
          </div>
        </div>
      </div>
    </footer>
  );
}
