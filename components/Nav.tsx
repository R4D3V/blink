import Link from "next/link";
import Logo from "./Logo";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={34} />
          <span className="font-display text-xl italic tracking-tight">
            $NASDOG
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <Link href="/" className="transition hover:text-text">
            Home
          </Link>
          <Link href="/about" className="transition hover:text-text">
            About
          </Link>
          <Link href="/mission" className="transition hover:text-text">
            Mission
          </Link>
        </nav>

        <Link
          href="/buy"
          className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-[#08090b] transition hover:opacity-90"
        >
          Buy $NASDOG
        </Link>
      </div>
    </header>
  );
}
