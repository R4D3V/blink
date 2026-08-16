import type { Metadata } from "next";
import Link from "next/link";
import JupiterSwap from "@/components/JupiterSwap";
import CopyButton from "@/components/CopyButton";

const MINT = "HCeLw23AT2q8zK9Gvo8rVEY1wtHRx6dNDyaBVv6tpump";
const PUMP_URL = `https://pump.fun/coin/${MINT}`;
const JUPITER_URL = `https://jup.ag/swap/SOL-${MINT}`;
const DEX_URL =
  "https://dexscreener.com/solana/gwprkrefyg2ugq3ozekjxv95fxpmqwxsgocffvm27hkx";

export const metadata: Metadata = {
  title: "Buy $NASDOG — Swap SOL for $NASDOG",
  description:
    "Swap SOL for $NASDOG directly through Jupiter. Liquidity lives on pump.fun — public supply, public liquidity, no admin keys.",
};

export default function BuyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">
          Buy
        </p>
        <h1 className="mt-4 font-display text-4xl italic leading-tight md:text-5xl">
          Get $NASDOG, straight from the desk.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Swap SOL for $NASDOG in a few clicks. Connect your wallet in the
          widget, set your amount, and the order routes through pump.fun
          liquidity — no account, no approvals, no middlemen.
        </p>
      </div>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_340px]">
        <JupiterSwap />

        <aside className="space-y-6">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">
              Contract
            </p>
            <p className="mt-3 break-all font-mono text-sm text-text">
              {MINT}
            </p>
            <div className="mt-4">
              <CopyButton text={MINT} />
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-2">
              Links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={PUMP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint underline underline-offset-4 hover:text-text"
                >
                  Pump.fun →
                </a>
              </li>
              <li>
                <a
                  href={JUPITER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint underline underline-offset-4 hover:text-text"
                >
                  Open swap in Jupiter →
                </a>
              </li>
              <li>
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint underline underline-offset-4 hover:text-text"
                >
                  Chart on DexScreener →
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-6 text-sm leading-relaxed text-muted">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-2">
              The honest part
            </p>
            <p className="mt-3">
              $NASDOG is a memecoin with no intrinsic value guarantee. Price
              can move fast and liquidity is concentrated on pump.fun. Hold
              only what you can afford to lose, and do your own research
              before buying.
            </p>
          </div>

          <p className="text-xs text-muted-2">
            Need help? Start on the{" "}
            <Link href="/mission" className="text-mint underline underline-offset-4 hover:text-text">
              roadmap
            </Link>
            , or read{" "}
            <Link href="/about" className="text-mint underline underline-offset-4 hover:text-text">
              where $NASDOG comes from
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}