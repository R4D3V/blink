import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-display font-black tracking-tight">About Blink</h1>
            <p className="mt-2 text-slate-300 max-w-xl">Fast, private, and delightful real-time chat with built-in video & audio.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/welcome" className="px-4 py-2 bg-primary rounded-full font-medium hover:shadow-lg">Welcome</Link>
            <Link href="/" className="px-4 py-2 border border-border rounded-full text-foreground hover:bg-muted">Open Chat</Link>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-card/60 backdrop-blur rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-slate-300">We're building innovative solutions to help you stay connected and productive.</p>
          </div>

          <div className="p-6 bg-card/60 backdrop-blur rounded-lg">
            <h3 className="text-xl font-semibold mb-2">What We Do</h3>
            <ul className="text-slate-300 space-y-2">
              <li>✨ Create seamless user experiences</li>
              <li>🚀 Build scalable applications</li>
              <li>🔒 Prioritize privacy and performance</li>
            </ul>
          </div>

          <div className="p-6 bg-card/60 backdrop-blur rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
            <p className="text-slate-300">Have questions? Contact <a href="mailto:hello@blink.com" className="text-primary underline">hello@blink.com</a></p>
          </div>
        </div>

        <section className="p-6 bg-gradient-to-r from-primary/10 via-secondary/8 to-primary/6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Why Blink?</h2>
          <p className="text-slate-300 max-w-2xl leading-relaxed">Blink is built to make real-time communication simple. With a modern UI, fast messaging, and peer-to-peer calls, Blink helps you connect without friction.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/welcome" className="px-5 py-3 bg-primary rounded-full text-white font-medium hover:shadow-lg">Back to Welcome</Link>
            <Link href="/" className="px-5 py-3 border border-border rounded-full text-foreground hover:bg-muted">Open Chat</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

