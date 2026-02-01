"use client";

import { useNotificationStore } from "@/lib/notificationStore";

export async function requestBrowserPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window))
    return "denied";
  const permission = await Notification.requestPermission();
  useNotificationStore.getState().setBrowser(permission === "granted");
  return permission;
}

export function showBrowserNotification(
  title: string,
  opts?: { body?: string; url?: string },
) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const n = new Notification(title, { body: opts?.body });
  n.onclick = (e) => {
    e.preventDefault();
    try {
      window.focus();
      if (opts?.url) window.location.href = opts.url;
    } catch {}
    n.close();
  };
}
