import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-display text-lg italic">$NASDOG</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              A Solana memecoin built on MrNasdog&rsquo;s research desk. Public
              supply, public liquidity, no promises dressed up as guarantees.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-2">
                Site
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><Link href="/" className="hover:text-text">Home</Link></li>
                <li><Link href="/about" className="hover:text-text">About</Link></li>
                <li><Link href="/mission" className="hover:text-text">Mission</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-2">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><a href="https://x.com/mrnasdog" className="hover:text-text">X</a></li>
                <li><a href="https://www.instagram.com/mrnasdog1" className="hover:text-text">Instagram</a></li>
                <li><a href="https://www.tiktok.com/@mrnasdog" className="hover:text-text">TikTok</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted-2 md:flex-row md:items-center md:justify-between">
          <p>$NASDOG · Solana network · Not investment advice.</p>
          <p>Crypto assets are volatile and can lose all value. Do your own research.</p>
        </div>
      </div>
    </footer>
  );
}
