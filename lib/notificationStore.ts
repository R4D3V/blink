"use client";

import { create } from "zustand";

type NotificationState = {
  inApp: boolean;
  browser: boolean;
  push: boolean;
  load: () => void;
  setInApp: (v: boolean) => void;
  setBrowser: (v: boolean) => void;
  setPush: (v: boolean) => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  inApp: true,
  browser: false,
  push: false,
  load: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("blink_notifications");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        set({
          inApp: !!parsed.inApp,
          browser: !!parsed.browser,
          push: !!parsed.push,
        });
      } catch {
        /* ignore */
      }
    }
  },
  setInApp: (v) => {
    const state = get();
    set({ inApp: v });
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "blink_notifications",
        JSON.stringify({ ...state, inApp: v }),
      );
    }
  },
  setBrowser: (v) => {
    const state = get();
    set({ browser: v });
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "blink_notifications",
        JSON.stringify({ ...state, browser: v }),
      );
    }
  },
  setPush: (v) => {
    const state = get();
    set({ push: v });
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "blink_notifications",
        JSON.stringify({ ...state, push: v }),
      );
    }
  },
}));
