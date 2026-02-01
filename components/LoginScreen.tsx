"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { generateId, createAvatarUrl } from "@/lib/utils";
import Typewriter from "@/components/Typewriter";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    // Demo login - In production, use real Google OAuth
    setTimeout(() => {
      const demoUser = {
        id: generateId(),
        name: "Demo User",
        email: "demo@blinkchat.com",
        avatar: createAvatarUrl("Demo User", "#ff3c78"),
      };

      setUser(demoUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("blink_user", JSON.stringify(demoUser));
      }
      setIsLoading(false);
    }, 800);
  };

  const handleGuest = () => {
    setIsLoading(true);
    const guest = {
      id: generateId(),
      name: "Guest",
      email: `guest+${Date.now()}@blinkchat.com`,
      avatar: createAvatarUrl("Guest", "#7c3aed"),
    };
    setUser(guest);
    if (typeof window !== "undefined")
      localStorage.setItem("blink_user", JSON.stringify(guest));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Hero */}
      <aside className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/5 p-8 flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            BLINK
          </h1>

          <div className="mb-6 text-lg text-muted-foreground flex items-center gap-2">
            <Typewriter
              text={"Connect instantly. Secure by design. Built for speed."}
            />
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Blink is a modern real-time chat app with voice & video calls, quick
            sharing, and secure messaging. Designed to stay light and fast—so
            you can focus on the conversation.
          </p>

          <ul className="grid gap-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="font-medium">Privacy-first</div>
                <div className="text-muted-foreground text-xs">
                  Messages are kept private and simple. No tracking, just chat.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-medium">Realtime</div>
                <div className="text-muted-foreground text-xs">
                  Low-latency messaging via WebSocket and optimized sync.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="font-medium">Cross-platform</div>
                <div className="text-muted-foreground text-xs">
                  Works on desktop and mobile with the same great experience.
                </div>
              </div>
            </li>
          </ul>

          <div className="mt-8 flex gap-4 items-center">
            <Link href="/about" className="text-sm text-primary underline">
              Learn more
            </Link>

            <Link
              href="/settings"
              className="ml-auto text-sm text-muted-foreground underline"
            >
              Notification settings
            </Link>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-28 -bottom-24 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -right-24 top-10 w-72 h-72 bg-secondary/10 blur-2xl rounded-full" />
      </aside>

      {/* Right: Login Card */}
      <main className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="p-8 bg-card border border-border rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                B
              </div>
              <div>
                <h2 className="text-xl font-semibold">Welcome back</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to continue chatting
                </p>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 mb-4 px-4 py-3 rounded-lg bg-primary text-white font-medium hover:shadow-md disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={handleGuest}
              className="w-full flex items-center justify-center gap-2 mb-2 px-4 py-3 rounded-lg border border-border text-sm"
            >
              Continue as guest
            </button>

            <div className="mt-6 text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div>
              New here?{" "}
              <Link href="/welcome" className="text-primary underline">
                Explore Blink
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
