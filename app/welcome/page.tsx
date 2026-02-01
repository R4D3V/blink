import Link from "next/link";
import Typewriter from '@/components/Typewriter'

export const metadata = {
  title: "Welcome - Blink Chat",
};

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-3xl text-center p-8">
        <div className="mb-6 text-6xl">👋</div>
        <Typewriter
          text="Welcome to Blink Chat"
          className="text-5xl font-display font-black mb-4"
        />
        <p className="text-lg text-muted-foreground mb-8">
          Connect with anyone, anywhere. Fast, secure, and delightful real-time
          chat with video & audio built in.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:shadow-lg"
          >
            Open Chat
          </Link>

          <Link
            href="/"
            className="px-6 py-3 border border-border rounded-full text-foreground hover:bg-muted"
          >
            Get Started
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Want to learn more? Check the docs in the repository or open the app
          directly.{" "}
          <Link href="/" className="text-primary font-medium">
            Open Chat
          </Link>
        </p>
      </div>
    </main>
  );
}
