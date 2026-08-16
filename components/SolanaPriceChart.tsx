"use client";

import { useEffect, useMemo, useState } from "react";

type Point = { x: number; y: number; ts: number; price: number };
type Live = { usd: number; usd_24h_change: number };

const HISTORY_URL =
  "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=7";
const LIVE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true";

const W = 640;
const H = 220;
const PAD = { top: 14, right: 10, bottom: 26, left: 44 };

function fmtPrice(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function SolanaPriceChart() {
  const [prices, setPrices] = useState<[number, number][] | null>(null);
  const [live, setLive] = useState<Live | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const res = await fetch(HISTORY_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data.prices)) setPrices(data.prices);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const loadLive = async () => {
      try {
        const res = await fetch(LIVE_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!cancelled && data?.solana) setLive(data.solana);
      } catch {
        /* keep the last known value */
      }
    };

    loadHistory();
    loadLive();
    const timer = setInterval(loadLive, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const points = useMemo<Point[] | null>(() => {
    if (!prices || prices.length < 2) return null;
    const min = Math.min(...prices.map(([, p]) => p));
    const max = Math.max(...prices.map(([, p]) => p));
    const span = max - min || 1;
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    return prices.map(([ts, price], i) => ({
      x: PAD.left + (i / (prices.length - 1)) * iw,
      y: PAD.top + ih - ((price - min) / span) * ih,
      ts,
      price,
    }));
  }, [prices]);

  const linePath = points
    ? points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(" ")
    : "";

  const areaPath = points
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD.bottom} L ${
        PAD.left
      } ${H - PAD.bottom} Z`
    : "";

  const current = live?.usd ?? points?.[points.length - 1]?.price ?? null;
  const change = live?.usd_24h_change ?? null;
  const positive = (change ?? 0) >= 0;

  const minP = points ? Math.min(...points.map((p) => p.price)) : null;
  const maxP = points ? Math.max(...points.map((p) => p.price)) : null;
  const midP = minP !== null && maxP !== null ? (minP + maxP) / 2 : null;
  const ih = H - PAD.top - PAD.bottom;
  const midIdx = points ? Math.floor((points.length - 1) / 2) : 0;

  return (
    <div className="mt-10 rounded-3xl border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">
            SOL / USD
          </p>
          <p className="mt-1 font-mono text-3xl md:text-4xl">
            {current !== null ? `$${fmtPrice(current)}` : "—"}
          </p>
        </div>
        <div
          className={`font-mono text-sm ${
            positive ? "text-mint" : "text-red-400"
          }`}
        >
          {change !== null
            ? `${positive ? "↑" : "↓"} ${Math.abs(change).toFixed(2)}% · 24h`
            : "24h"}
        </div>
      </div>

      <div className="mt-4">
        {failed ? (
          <div className="flex h-[220px] w-full items-center justify-center rounded-2xl border border-line bg-bg text-sm text-muted">
            Market data unavailable right now. Refresh to retry.
          </div>
        ) : !points ? (
          <div className="h-[220px] w-full animate-pulse rounded-2xl border border-line bg-bg" />
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label="Solana price over the last 7 days"
          >
            <defs>
              <linearGradient id="sol-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8b34a" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#e8b34a" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 1, 2].map((i) => {
              const y = PAD.top + (i / 2) * ih;
              return (
                <line
                  key={i}
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="var(--line)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              );
            })}

            {[maxP, midP, minP].map((p, i) =>
              p !== null ? (
                <text
                  key={i}
                  x={PAD.left - 6}
                  y={PAD.top + (i / 2) * ih + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="var(--muted-2)"
                  fontFamily="var(--font-mono)"
                >
                  {fmtPrice(p)}
                </text>
              ) : null
            )}

            {[0, midIdx, points.length - 1].map((idx) => (
              <text
                key={idx}
                x={points[idx].x}
                y={H - 8}
                textAnchor="middle"
                fontSize="9"
                fill="var(--muted-2)"
                fontFamily="var(--font-mono)"
              >
                {fmtDate(points[idx].ts)}
              </text>
            ))}

            <path
              className="chart-area"
              d={areaPath}
              fill="url(#sol-area)"
            />

            <path
              className="chart-line"
              d={linePath}
              pathLength={1}
              fill="none"
              stroke="#e8b34a"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4"
              fill="#e8b34a"
            />
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4"
              fill="none"
              stroke="#e8b34a"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        )}
      </div>

      <p className="mt-3 text-right font-mono text-xs text-muted-2">
        7-day history · via CoinGecko
      </p>
    </div>
  );
}