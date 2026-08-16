import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TokenomicsDonut from "@/components/TokenomicsDonut";

const stats = [
  { label: "Chain", value: "Solana" },
  { label: "Total supply", value: "1,000,000,000" },
  { label: "Tax", value: "0 / 0" },
  { label: "LP", value: "Locked" },
];

const tokenomics = [
  {
    label: "Liquidity pool",
    pct: "60%",
    note: "Locked at launch, seeded on Raydium",
  },
  {
    label: "Community & airdrops",
    pct: "20%",
    note: "Vested, released across roadmap phases",
  },
  {
    label: "Marketing & CEX listings",
    pct: "12%",
    note: "Exchange fees, market makers, campaigns",
  },
  { label: "Team", pct: "8%", note: "12-month linear vest, no early unlock" },
];

const roadmapPreview = [
  {
    phase: "Phase 1",
    title: "Launch & lock",
    detail: "Fair launch on Solana, LP locked, contract renounced.",
  },
  {
    phase: "Phase 2",
    title: "Pack grows",
    detail: "CEX-1 listing push, holder milestones, first buybacks.",
  },
  {
    phase: "Phase 3",
    title: "Tier-1 listing",
    detail: "Major exchange application window, market maker onboarding.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
        <Reveal className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">
              Live on Solana
            </p>
            <h1 className="mt-5 font-display text-5xl italic leading-[1.05] text-balance md:text-6xl">
              The dog that actually did the research.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Before $NASDOG, there was eight years of public crypto research —
              real portfolios, real drawdowns, posted in the open. This is that
              desk, turned into a token the pack can actually hold.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4" id="buy">
              <button className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[#08090b] transition hover:opacity-90">
                <a
                  href="https://pump.fun/coin/HCeLw23AT2q8zK9Gvo8rVEY1wtHRx6dNDyaBVv6tpump"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on Pump.fun
                </a>
              </button>
              <button className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-mono text-muted transition hover:border-muted hover:text-text">
                Copy CA
                <span className="text-muted-2">
                  HCeLw23AT2q8zK9Gvo8rVEY1wtHRx6dNDyaBVv6tpump
                </span>
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <p className="text-xs text-muted-2">{s.label}</p>
                  <p className="mt-1 font-mono text-sm text-text">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-line bg-surface">
              <Image
                src="/mrnasdog-portrait.jpg"
                alt="MrNasdog"
                fill
                sizes="(min-width: 768px) 384px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xl">
              <p className="text-xs text-muted-2">Since inception</p>
              <p className="font-mono text-lg text-mint">Public track record</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Tokenomics */}
      <section className="border-t border-line bg-surface/40">
        <Reveal className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
            Tokenomics
          </p>
          <h2 className="mt-3 font-display text-3xl italic md:text-4xl">
            Where the supply actually goes.
          </h2>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[auto_1fr]">
            <Reveal className="mx-auto md:mx-0">
              <TokenomicsDonut />
            </Reveal>

            <div className="divide-y divide-line border-t border-line">
              {tokenomics.map((t) => (
                <div
                  key={t.label}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 py-5 md:grid-cols-[2fr_1fr_2fr]"
                >
                  <p className="text-sm font-medium text-text">{t.label}</p>
                  <p className="font-mono text-xl text-gold md:text-right">
                    {t.pct}
                  </p>
                  <p className="hidden text-sm text-muted md:block">{t.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Roadmap preview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
              12-month roadmap
            </p>
            <h2 className="mt-3 font-display text-3xl italic md:text-4xl">
              Launch to listing.
            </h2>
          </div>
          <Link
            href="/mission"
            className="text-sm text-mint underline underline-offset-4 hover:text-text"
          >
            See the full roadmap →
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {roadmapPreview.map((r, i) => (
            <Reveal key={r.phase} delay={i * 100}>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="font-mono text-xs text-muted-2">{r.phase}</p>
                <p className="mt-2 font-display text-xl italic">{r.title}</p>
                <p className="mt-3 text-sm text-muted">{r.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
