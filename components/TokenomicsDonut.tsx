const segments = [
  { label: "Liquidity pool", pct: 60, color: "#e8b34a" },
  { label: "Community & airdrops", pct: 20, color: "#3fe0a5" },
  { label: "Marketing & CEX listings", pct: 12, color: "#8b8d94" },
  { label: "Team", pct: 8, color: "#5c5e64" },
];

const R = 42;
const C = 2 * Math.PI * R;

export default function TokenomicsDonut() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-56 shrink-0 md:w-64"
      role="img"
      aria-label="Token supply split: 60% liquidity pool, 20% community and airdrops, 12% marketing and CEX listings, 8% team"
    >
      <g transform="rotate(-90 50 50)">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--line)"
          strokeWidth="14"
        />
        {segments.map((s, i) => {
          const len = (s.pct / 100) * C;
          const offset = segments
            .slice(0, i)
            .reduce((sum, seg) => sum + (seg.pct / 100) * C, 0);
          return (
            <circle
              key={s.label}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </g>
      <text
        x="50"
        y="47"
        textAnchor="middle"
        fontSize="18"
        fill="var(--text)"
        fontFamily="var(--font-mono)"
      >
        1B
      </text>
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="6.5"
        fill="var(--muted-2)"
        fontFamily="var(--font-mono)"
      >
        TOTAL SUPPLY
      </text>
    </svg>
  );
}