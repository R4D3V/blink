import Link from "next/link";
import Typewriter from "@/components/Typewriter";
import AnimatedCard from "@/components/AnimatedCard";

export const metadata = {
  title: "Welcome - Blink Chat",
};

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Hero Left */}
          <div className="space-y-6">
            <div className="text-6xl">👋</div>

            <Typewriter
              text="Welcome to Blink Chat"
              className="text-4xl md:text-5xl font-display font-black leading-tight"
            />

            <p className="text-lg text-muted-foreground max-w-xl">
              Connect with anyone, anywhere — fast, private, and built for real
              time. Messages sync instantly and one-click video/audio calls get
              you connected.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:shadow-lg"
              >
                Open Chat
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted"
              >
                About Blink
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full text-primary hover:underline"
              >
                See features →
              </a>
            </div>

            <div className="mt-4 text-sm text-muted-foreground max-w-md">
              Demo login is enabled — click "Continue with Google" on the login
              screen to explore without an account.
            </div>
          </div>

          {/* Hero Right - mock device */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-80 h-160 rounded-2xl bg-gradient-to-b from-card/60 to-card/40 border border-border shadow-xl p-4">
              <div className="h-full bg-gradient-to-b from-primary/10 to-secondary/6 rounded-xl p-4 flex flex-col">
                <div className="h-10 flex items-center justify-between mb-3">
                  <div className="w-10 h-3 bg-muted/30 rounded-full" />
                  <div className="w-14 h-3 bg-muted/30 rounded-full" />
                </div>
                <div className="flex-1 rounded-lg bg-muted/20 p-3 grid gap-3">
                  <div className="h-20 bg-card/80 rounded-md" />
                  <div className="h-20 bg-card/80 rounded-md" />
                  <div className="h-20 bg-card/80 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-16 grid md:grid-cols-3 gap-6">
          <AnimatedCard
            title="Real-time Messaging"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l.8-4A8.94 8.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
          >
            <p className="text-slate-300">
              Instant messages with typing indicators and read receipts.
            </p>
          </AnimatedCard>

          <AnimatedCard
            title="Video & Audio Calls"
            delay={120}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h11a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            }
          >
            <p className="text-slate-300">
              Peer-to-peer calls with mute, video, & invite controls.
            </p>
          </AnimatedCard>

          <AnimatedCard
            title="Media & Files"
            delay={240}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
            }
          >
            <p className="text-slate-300">
              Share images, videos, and files quickly and preview them inline.
            </p>
          </AnimatedCard>
        </div>

        {/* Extra Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-card/60 backdrop-blur rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-slate-300">
              We don't sell your data. Local demo mode keeps your info on your
              device unless you connect an external backend. thats when it
              works.
            </p>
          </div>

          <div className="p-6 bg-card/60 backdrop-blur rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Installable</h3>
            <p className="text-slate-300">
              Blink supports PWA installation. Install it on your device for
              faster access and native-like behavior.
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ —{" "}
            <Link href="/about" className="text-primary underline">
              About
            </Link>{" "}
            ·{" "}
            <Link href="/" className="text-primary underline">
              Open Chat
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
