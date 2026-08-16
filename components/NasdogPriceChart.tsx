"use client";

import { useEffect, useMemo, useState } from "react";

const MINT = "HCeLw23AT2q8zK9Gvo8rVEY1wtHRx6dNDyaBVv6tpump";
const PAIR = "GwprKrefYG2UGq3ozEKJxv95FXpmqWXsgocFfVm27hkx";
const PUMP_URL = `https://pump.fun/coin/${MINT}`;
const DEX_URL =
  "https://dexscreener.com/solana/gwprkrefyg2ugq3ozekjxv95fxpmqwxsgocffvm27hkx";

const OHLCV_URL = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${PAIR}/ohlcv/minute?aggregate=1&limit=120&currency=usd`;
const PAIR_URL = `https://api.dexscreener.com/latest/dex/tokens/${MINT}`;

type Candle = [number, number, number, number, number, number];

type Pair = {
  priceUsd: string;
  priceChange: { h24: string };
  volume: { h24: number };
  marketCap: number;
  fdv: number;
  url?: string;
};

const W = 640;
const H = 220;
const PAD = { top: 14, right: 10, bottom: 26, left: 52 };

function fmtUsd(n: number) {
  if (n >= 1) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function fmtTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtCompact(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function NasdogPriceChart() {
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [pair, setPair] = useState<Pair | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCandles = async () => {
      try {
        const res = await fetch(OHLCV_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const list = data?.data?.attributes?.ohlcv_list;
        if (!cancelled && Array.isArray(list)) setCandles(list);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const loadPair = async () => {
      try {
        const res = await fetch(PAIR_URL);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const p = data?.pairs?.[0];
        if (!cancelled && p) setPair(p);
      } catch {
        /* keep the last known value */
      }
    };

    loadCandles();
    loadPair();
    const candleTimer = setInterval(loadCandles, 60000);
    const pairTimer = setInterval(loadPair, 30000);
    return () => {
      cancelled = true;
      clearInterval(candleTimer);
      clearInterval(pairTimer);
    };
  }, []);

  const points = useMemo<{ x: number; y: number; price: number }[] | null>(
    () => {
      if (!candles || candles.length === 0) return null;
      const closes = candles.map((c) => c[4]);
      const data = closes.length === 1 ? [closes[0], closes[0]] : closes;
      const min = Math.min(...data);
      const max = Math.max(...data);
      const span = max - min || 1;
      const iw = W - PAD.left - PAD.right;
      const ih = H - PAD.top - PAD.bottom;
      return data.map((price, i) => ({
        x: PAD.left + (i / (data.length - 1)) * iw,
        y: PAD.top + ih - ((price - min) / span) * ih,
        price,
      }));
    },
    [candles]
  );

  const lastClose = candles?.[candles.length - 1]?.[4];
  const firstTs = candles?.[0]?.[0];
  const lastTs = candles?.[candles.length - 1]?.[0];
  const current = pair ? parseFloat(pair.priceUsd) : lastClose ?? null;
  const change = pair ? parseFloat(pair.priceChange.h24) : null;
  const positive = (change ?? 0) >= 0;
  const volume = pair?.volume.h24 ?? 0;
  const marketCap = pair?.marketCap ?? pair?.fdv ?? 0;

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

  const minP = points ? Math.min(...points.map((p) => p.price)) : null;
  const maxP = points ? Math.max(...points.map((p) => p.price)) : null;
  const midP = minP !== null && maxP !== null ? (minP + maxP) / 2 : null;
  const ih = H - PAD.top - PAD.bottom;

  return (
    <div className="mt-10 rounded-3xl border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-2">
            $NASDOG / USD
          </p>
          <p className="mt-1 font-mono text-3xl md:text-4xl">
            {current !== null ? `$${fmtUsd(current)}` : "—"}
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
            aria-label="$NASDOG price since launch"
          >
            <defs>
              <linearGradient id="nasdog-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3fe0a5" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#3fe0a5" stopOpacity="0" />
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
                  {fmtUsd(p)}
                </text>
              ) : null
            )}

            {firstTs !== undefined && lastTs !== undefined && (
              <>
                <text
                  x={PAD.left}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--muted-2)"
                  fontFamily="var(--font-mono)"
                >
                  {fmtTime(firstTs)}
                </text>
                <text
                  x={W - PAD.right}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--muted-2)"
                  fontFamily="var(--font-mono)"
                >
                  {fmtTime(lastTs)}
                </text>
              </>
            )}

            <path className="chart-area" d={areaPath} fill="url(#nasdog-area)" />

            <path
              className="chart-line"
              d={linePath}
              pathLength={1}
              fill="none"
              stroke="#3fe0a5"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="4"
              fill="#3fe0a5"
            />
          </svg>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-2">Market cap</p>
          <p className="mt-1 font-mono text-sm text-text">
            {marketCap > 0 ? fmtCompact(marketCap) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-2">24h volume</p>
          <p className="mt-1 font-mono text-sm text-text">
            {volume > 0 ? fmtCompact(volume) : "—"}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-2">Dex</p>
          <p className="mt-1 font-mono text-sm text-text">Pump.fun</p>
        </div>
      </div>

      <p className="mt-5 flex flex-wrap items-center justify-between gap-2 text-right font-mono text-xs text-muted-2">
        <span>Since launch · via GeckoTerminal & DexScreener</span>
        <span className="flex gap-4">
          <a
            href={PUMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mint underline underline-offset-4 hover:text-text"
          >
            Pump.fun
          </a>
          <a
            href={DEX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mint underline underline-offset-4 hover:text-text"
          >
            Chart ↗
          </a>
        </span>
      </p>
    </div>
  );
}