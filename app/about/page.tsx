import Image from "next/image";
import Reveal from "@/components/Reveal";

const facts = [
  { label: "Origin", value: "Ex-VC, $50M AUM, quit in 2018" },
  { label: "Track record", value: "8 years of public crypto research" },
  { label: "Token launched", value: "2026, Solana network" },
  { label: "Style", value: "Research-first, no unlocks, no hype cycles" },
];

export default function About() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">
        About
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl italic leading-tight md:text-5xl">
        Eight years on the desk, before $NASDOG ever existed.
      </h1>

      <Reveal className="mt-14 grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line">
          <Image
            src="/mrnasdog-portrait.jpg"
            alt="MrNasdog"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6 text-base leading-relaxed text-muted">
          <p>
            MrNasdog spent years managing money for other people before
            walking away from it in 2018 to run a portfolio in the open —
            no fund structure, no fees, no hidden book. Every call, every
            drawdown, every recovery has been posted publicly since.
          </p>
          <p>
            That habit of showing the work — supply schedules, unlock
            calendars, the boring mechanics behind a token&rsquo;s price —
            is the same lens $NASDOG is built through. The coin isn&rsquo;t
            trying to be a research desk&rsquo;s opposite; it&rsquo;s trying
            to be what that desk would actually launch: a fair supply, a
            locked pool, and nothing sold to insiders before the public
            could buy in.
          </p>
          <p>
            $NASDOG lives on Solana for the same reason the research does —
            fast, cheap, and legible. Anyone can pull up the chain and check
            the claims instead of taking them on faith.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs text-muted-2">{f.label}</p>
                <p className="mt-1 text-sm text-text">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-20 rounded-3xl border border-line bg-surface p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
          Why a memecoin
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl italic md:text-3xl">
          Because research alone doesn&rsquo;t give people something to hold.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Readers of the research already picked their own bags. $NASDOG is
          the one asset that belongs to the desk itself — a way for the
          community that&rsquo;s followed the calls to own a piece of the
          brand, not just the coins it covers.
        </p>
      </Reveal>
    </main>
  );
}
