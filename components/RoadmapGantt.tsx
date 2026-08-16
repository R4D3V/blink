const rows = [
  { q: "Q1", title: "Fair launch", color: "#e8b34a", start: 0, width: 3 },
  { q: "Q2", title: "Distribution", color: "#3fe0a5", start: 3, width: 3 },
  { q: "Q3", title: "Tier-2 exchanges", color: "#8b8d94", start: 6, width: 3 },
  { q: "Q4", title: "Tier-1 push", color: "#5c5e64", start: 9, width: 3 },
];

const X0 = 150;
const MW = 40;
const ROW_H = 44;
const TOP = 44;
const BAR_H = 18;

const xFor = (month: number) => X0 + month * MW;
const cyFor = (row: number) => TOP + row * ROW_H + ROW_H / 2;

export default function RoadmapGantt() {
  return (
    <svg
      viewBox="0 0 640 240"
      className="w-full"
      role="img"
      aria-label="Twelve month roadmap: fair launch in Q1, distribution in Q2, tier-2 exchanges in Q3, tier-1 push in Q4"
    >
      {/* quarter axis */}
      {rows.map((r) => (
        <text
          key={r.q}
          x={xFor(r.start) + (r.width * MW) / 2}
          y="18"
          textAnchor="middle"
          fontSize="10"
          fill="var(--muted-2)"
          fontFamily="var(--font-mono)"
        >
          {r.q}
        </text>
      ))}

      {/* now marker */}
      <line
        x1={xFor(0)}
        y1="24"
        x2={xFor(0)}
        y2={TOP + ROW_H * rows.length}
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <text
        x={xFor(0) + 6}
        y="16"
        fontSize="9"
        fill="var(--gold)"
        fontFamily="var(--font-mono)"
      >
        NOW
      </text>

      {/* grid */}
      {[0, 3, 6, 9, 12].map((m) => (
        <line
          key={m}
          x1={xFor(m)}
          y1="24"
          x2={xFor(m)}
          y2={TOP + ROW_H * rows.length}
          stroke="var(--line)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      ))}

      {/* month ticks */}
      {[0, 3, 6, 9, 12].map((m) => (
        <text
          key={m}
          x={xFor(m)}
          y={TOP + ROW_H * rows.length + 14}
          textAnchor="middle"
          fontSize="8"
          fill="var(--muted-2)"
          fontFamily="var(--font-mono)"
        >
          {m}
        </text>
      ))}

      {/* bars */}
      {rows.map((r, i) => {
        const cy = cyFor(i);
        return (
          <g key={r.q}>
            <text
              x={X0 - 12}
              y={cy - 5}
              textAnchor="end"
              fontSize="10"
              fill={r.color}
              fontFamily="var(--font-mono)"
            >
              {r.q}
            </text>
            <text
              x={X0 - 12}
              y={cy + 11}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted)"
            >
              {r.title}
            </text>
            <rect
              className="gantt-bar"
              x={xFor(r.start)}
              y={cy - BAR_H / 2}
              width={r.width * MW}
              height={BAR_H}
              rx="4"
              fill={r.color}
              style={{ animationDelay: `${i * 140}ms` }}
            />
            <circle
              cx={xFor(r.start)}
              cy={cy}
              r="3.5"
              fill={r.color}
              stroke="var(--bg)"
              strokeWidth="1.5"
            />
          </g>
        );
      })}

      {/* target */}
      <path
        d={`M ${xFor(12)} ${cyFor(3) - BAR_H / 2 - 2} L ${xFor(12) + 6} ${
          cyFor(3)
        } L ${xFor(12)} ${cyFor(3) + BAR_H / 2 + 2} Z`}
        fill="var(--gold)"
      />
      <text
        x={xFor(12) - 8}
        y={cyFor(3) + 26}
        textAnchor="end"
        fontSize="9"
        fill="var(--gold)"
        fontFamily="var(--font-mono)"
      >
        TARGET
      </text>
    </svg>
  );
}