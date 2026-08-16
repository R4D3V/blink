const headlines = [
  "$NASDOG · live on Solana",
  "Liquidity locked at launch",
  "Contract renounced — no admin keys",
  "8yrs of research, one token",
  "Public supply. Public wallet. No VC unlock.",
  "Roadmap: CEX listing targeted in 12 months",
  "Top dog of the pack — SOL memecoin",
];

export default function Ticker() {
  const track = [...headlines, ...headlines];
  return (
    <div className="w-full overflow-hidden border-b border-line bg-surface">
      <div className="flex w-max marquee-track">
        {track.map((h, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-2 text-xs font-mono text-muted whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
