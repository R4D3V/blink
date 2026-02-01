import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import AnimatedCard from '@/components/AnimatedCard'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-display font-black tracking-tight">About Blink</h1>
            <p className="mt-2 text-slate-300 max-w-xl">
              Fast, private, and delightful real-time chat with built-in video &
              audio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="flex gap-3">
              <Link href="/welcome" className="px-4 py-2 bg-primary rounded-full font-medium hover:shadow-lg">Welcome</Link>
              <Link href="/" className="px-4 py-2 border border-border rounded-full text-foreground hover:bg-muted">Open Chat</Link>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard
            title="Our Mission"
            delay={0}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z"/></svg>}
          >
            <p>We're building innovative solutions to help you stay connected and productive.</p>
          </AnimatedCard>

          <AnimatedCard
            title="What We Do"
            delay={120}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
          >
            <ul className="space-y-2">
              <li>✨ Create seamless user experiences</li>
              <li>🚀 Build scalable applications</li>
              <li>🔒 Prioritize privacy and performance</li>
            </ul>
          </AnimatedCard>

          <AnimatedCard
            title="Get in Touch"
            delay={240}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"/></svg>}
          >
            <p>Have questions? Contact <a href="mailto:hello@blink.com" className="text-primary underline">hello@blink.com</a></p>
          </AnimatedCard>
        </div>

        <AnimatedCard title="Why Blink?" delay={320} icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>}>
          <p className="text-slate-300 max-w-2xl leading-relaxed">Blink is built to make real-time communication simple. With a modern UI, fast messaging, and peer-to-peer calls, Blink helps you connect without friction.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/welcome" className="px-5 py-3 bg-primary rounded-full text-white font-medium hover:shadow-lg">Back to Welcome</Link>
            <Link href="/" className="px-5 py-3 border border-border rounded-full text-foreground hover:bg-muted">Open Chat</Link>
          </div>
        </AnimatedCard>
      </div>
    </main>
  )
}
