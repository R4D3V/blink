"use client";

import { useEffect } from "react";
import { useToastStore } from "@/lib/toastStore";

export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => remove(t.id), 5000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="w-80 max-w-full bg-card/90 text-card-foreground p-3 rounded-lg shadow-lg border border-border flex flex-col gap-1"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold">{t.title ?? "Message"}</div>
            <button
              onClick={() => remove(t.id)}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Dismiss"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {t.message}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Click to open
          </div>
        </div>
      ))}
    </div>
  );
}
