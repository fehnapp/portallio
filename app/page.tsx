import Link from "next/link";
import { ArrowRight, Check, FileDown, MessageCircle, Receipt, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: FileDown, title: "File delivery", description: "Upload deliverables directly. Clients download with one click — no Google Drive links to hunt for." },
  { icon: Receipt, title: "Invoice & payment", description: "Set the amount, due date, and payment method. The Pay button is right there when they open it." },
  { icon: Zap, title: "Project status", description: "A single line they can read in two seconds. In progress. Awaiting feedback. Delivered." },
  { icon: MessageCircle, title: "Client chat", description: "Feedback comes in one place. You get an email when they write. No more Instagram DMs." }
];

const steps = [
  { n: "01", title: "Create a portal", body: "Add project name, status, invoice details, and files. Takes about 3 minutes." },
  { n: "02", title: "Send one link", body: "Copy the link and send it via email, WhatsApp, or DM. They click it. That's it." },
  { n: "03", title: "Look professional", body: "Your client sees a clean branded page — not a cluttered inbox thread or confusing folder." }
];

const testimonials = [
  { quote: "I used to send files on Drive, invoice on PayPal, updates on WhatsApp. Now I send one link. Clients pay faster.", name: "Maya R.", role: "Brand designer" },
  { quote: "The first time a client replied 'this is so professional' I knew it was worth it.", name: "Tom K.", role: "Freelance developer" },
  { quote: "Set it up in an afternoon. Clients stopped asking me where their files were.", name: "Sara L.", role: "Copywriter" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <span className="text-xl font-bold text-emerald-600">portalio</span>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Sign in</Link>
            <Button asChild size="sm"><Link href="/signup">Get started free</Link></Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center sm:pt-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Free to start · No credit card required
        </div>
        <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          One link for every<br /><span className="text-emerald-600">client project</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
          Stop scattering files, invoices, and updates across different apps. Send clients a single link with everything in one place.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Create your first portal free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <p className="text-sm text-zinc-400">First portal free · Then $29/month</p>
        </div>
      </section>

      {/* Mockup */}
      <section className="mx-auto max-w-3xl px-5 pb-28">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50" style={{boxShadow:"0 20px 60px rgba(0,0,0,0.08)"}}>
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-4 py-2.5">
            <div className="flex gap-1.5">
              {[0,1,2].map(i => <div key={i} className="h-3 w-3 rounded-full bg-zinc-300" />)}
            </div>
            <div className="mx-auto max-w-xs flex-1 rounded-md border border-zinc-200 bg-white px-3 py-1 text-center text-xs text-zinc-400">
              portalio.app/p/abc123
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-bold text-emerald-600">portalio</p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Brand Identity Package</h2>
                <p className="mt-1 text-sm text-zinc-500">Prepared for Acme Co.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Delivered ✓</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Files</p>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">3 shared</span>
                </div>
                {["logo_final.zip","brand_guide.pdf","assets.zip"].map(f => (
                  <div key={f} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs border border-zinc-100 mb-1.5">
                    <span className="truncate font-medium text-zinc-700">{f}</span>
                    <FileDown className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm font-semibold">Invoice</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">$1,200</p>
                <p className="mt-1 text-xs text-zinc-400">Due Jun 15, 2026</p>
                <div className="mt-4 rounded-lg bg-emerald-600 py-2.5 text-center text-xs font-semibold text-white cursor-pointer">Pay Now →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Four things. That's the whole product.</h2>
            <p className="mt-4 leading-relaxed text-zinc-500">No automation. No CRM. No 200-feature dashboard that overwhelms you on day one.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Up and running in one afternoon</h2>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {steps.map(({ n, title, body }) => (
              <div key={n}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">{n}</div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-28">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Freelancers who stopped duct-taping tools together</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="text-4xl text-emerald-200 font-serif leading-none">"</div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">{name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-zinc-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-28">
        <div className="mx-auto max-w-md px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight">Simple pricing</h2>
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">One plan</span>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">$29</span>
              <span className="pb-2 text-sm text-zinc-400">/month</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">First portal free, no card needed. Upgrade when you land your second client.</p>
            <ul className="mt-6 space-y-2.5">
              {["Unlimited client portals","File sharing & storage","Invoice + payment link","Client chat with email alerts","Project status updates","Visa, Mastercard & Apple Pay","No client account required"].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 shrink-0">
                    <Check className="h-3 w-3 text-emerald-700" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full" size="lg"><Link href="/signup">Start free — no card needed</Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-white" style={{background:"linear-gradient(135deg,#1a7a5e,#145c47)"}}>
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Your next client deserves a better experience</h2>
          <p className="mt-4 text-emerald-200">Create your first portal in 3 minutes. Free, no card required.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/signup">Get started free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-sm text-zinc-400 sm:flex-row">
          <span className="font-bold text-emerald-600">portalio</span>
          <p>© {new Date().getFullYear()} Portalio. Built for freelancers.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-zinc-600 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-zinc-600 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
