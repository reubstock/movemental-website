import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/movemental.svg"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-extrabold text-zinc-900 text-sm">
            movemental
          </span>
        </Link>
        <div className="text-xs text-zinc-500">
          © Movemental · We turn promising ideas into global movements.
        </div>
      </div>
    </footer>
  );
}
