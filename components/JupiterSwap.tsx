"use client";

import { useRef } from "react";
import Script from "next/script";

const MINT = "HCeLw23AT2q8zK9Gvo8rVEY1wtHRx6dNDyaBVv6tpump";

declare global {
  interface Window {
    Jupiter?: {
      init: (config: Record<string, unknown>) => void;
      close?: () => void;
    };
  }
}

export default function JupiterSwap() {
  const initRef = useRef(false);

  return (
    <div className="rounded-3xl border border-line bg-surface p-4 md:p-6">
      <Script
        src="https://plugin.jup.ag/plugin-v1.js"
        strategy="afterInteractive"
        onReady={() => {
          if (initRef.current) return;
          initRef.current = true;
          window.Jupiter?.init({
            displayMode: "integrated",
            integratedTargetId: "jupiter-plugin",
            formProps: {
              initialInputMint:
                "So11111111111111111111111111111111111111112",
              initialOutputMint: MINT,
              fixedMint: MINT,
            },
          });
        }}
      />
      <div
        id="jupiter-plugin"
        className="w-full"
        style={{ height: 520 }}
      />
    </div>
  );
}