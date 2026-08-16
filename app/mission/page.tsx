import Reveal from "@/components/Reveal";

const roadmap = [
  {
    q: "Q1",
    title: "Fair launch",
    items: [
      "Deploy on Solana, LP seeded and locked",
      "Mint authority and freeze authority revoked",
      "Contract and LP lock verified on-chain, links published",
      "Community channels open — X, Telegram, Discord",
    ],
  },
  {
    q: "Q2",
    title: "Distribution",
    items: [
      "Holder milestones unlock community airdrops",
      "First DEX-tracker and CoinGecko / CoinMarketCap listings",
      "Volume-based marketing push, meme and clip campaigns",
      "First on-chain buyback from marketing wallet, published",
    ],
  },
  {
    q: "Q3",
    title: "Tier-2 exchanges",
    items: [
      "Apply to mid-tier centralized exchanges (KuCoin, MEXC, Gate)",
      "Market maker onboarding to support listed order books",
      "Merchandise and community-run initiatives",
      "Second research-style transparency report on supply & holders",
    ],
  },
  {
    q: "Q4",
    title: "Tier-1 push",
    items: [
      "Applications open with tier-1 exchanges (Binance, Coinbase, OKX)",
      "Liquidity depth targets set as a listing prerequisite",
      "Full first-year transparency report, in the style of the research desk",
      "Roadmap for year two published to the community",
    ],
  },
];

export default function Mission() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">
        Mission
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl italic leading-tight md:text-5xl">
        Twelve months, one job: earn a real listing.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
        $NASDOG doesn&rsquo;t promise a listing — it promises a schedule for
        earning one. Liquidity, holder count, and volume are the gates;
        exchanges decide the rest. Here&rsquo;s the plan we&rsquo;re holding
        ourselves to.
      </p>
    </Reveal>

      <div className="mt-16 space-y-0 border-t border-line">
        {roadmap.map((r, i) => (
          <Reveal key={r.q} delay={i * 60}>
            <div className="grid gap-4 border-b border-line py-10 md:grid-cols-[120px_1fr]">
              <div>
                <p className="font-mono text-xs text-muted-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-3xl italic text-gold">{r.q}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl italic">{r.title}</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {r.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 rounded-3xl border border-line bg-surface p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
          The honest part
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl italic md:text-3xl">
          No exchange listing is guaranteed — not by us, not by anyone.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Centralized exchanges set their own bars for liquidity, volume, and
          compliance, and they can change without notice. This roadmap is
          our target and our accountability structure, not a promise. $NASDOG
          is a speculative asset with no intrinsic value guarantee — hold
          only what you can afford to lose, and do your own research before
          buying.
        </p>
      </Reveal>
    </main>
  );
}
