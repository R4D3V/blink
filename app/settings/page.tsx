"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/lib/notificationStore";
import { requestBrowserPermission } from "@/lib/notifications";
import Link from "next/link";

export default function SettingsPage() {
  const { inApp, browser, push, load, setInApp, setBrowser, setPush } =
    useNotificationStore();

  useEffect(() => {
    load();
  }, [load]);

  const handleBrowserToggle = async () => {
    if (!browser) {
      const p = await requestBrowserPermission();
      setBrowser(p === "granted");
    } else {
      setBrowser(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Notification Settings</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">In‑app toasts</p>
            <p className="text-sm text-muted-foreground">
              Show toasts while using the app
            </p>
          </div>
          <button
            onClick={() => setInApp(!inApp)}
            className={`px-3 py-1 rounded ${inApp ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            {inApp ? "On" : "Off"}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Browser notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive native browser notifications when away
            </p>
          </div>
          <button
            onClick={handleBrowserToggle}
            className={`px-3 py-1 rounded ${browser ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            {browser ? "Enabled" : "Enable"}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Push notifications (coming)</p>
            <p className="text-sm text-muted-foreground">
              Subscribe to push notifications (Phase 3)
            </p>
          </div>
          <button
            onClick={() => setPush(!push)}
            className={`px-3 py-1 rounded ${push ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            {push ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="pt-4">
          <Link href="/welcome" className="text-sm text-primary underline">
            Back to Welcome
          </Link>
        </div>
      </div>
    </div>
  );
}
