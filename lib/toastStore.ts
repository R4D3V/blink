"use client";

import { create } from "zustand";

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  conversationId?: string;
  createdAt: number;
};

type ToastState = {
  toasts: ToastItem[];
  addToast: (t: Omit<ToastItem, "id" | "createdAt">) => string;
  removeToast: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: ({ title, message, conversationId }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const item: ToastItem = {
      id,
      title,
      message,
      conversationId,
      createdAt: Date.now(),
    };
    set((s) => ({ toasts: [...s.toasts, item] }));
    return id;
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
