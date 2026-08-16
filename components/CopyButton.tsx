"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted transition hover:border-muted hover:text-text"
    >
      {copied ? "Copied" : "Copy CA"}
    </button>
  );
}