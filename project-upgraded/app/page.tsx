import Link from "next/link";
import { ArrowRight, Check, FileDown, MessageCircle, Receipt, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileDown,
    title: "File delivery",
    description: "Upload deliverables directly. Clients download with one click, no Drive links to hunt for."
  },
  {
    icon: Receipt,
    title: "Invoice & payment",
    description: "Set the amount, due date, and your payment link. The Pay button is right there when they open it."
  },
  {
    icon: Zap,
    title: "Project status",
    description: "A single line they can read in two seconds. In progress. Awaiting feedback. Delivered."
  },
  {
    icon: MessageCircle,
    title: "Client chat",
    description: "Feedback comes in one place. You get an email when they write. No more Instagram DMs."
  }
];

const steps = [
  { step: "01", title: "Create a portal", body: "Enter the project name, status, invoice details, and upload files. Takes about 3 minutes." },
  { step: "02", title: "Send one link", body: "Copy the link and send it however you want — email, WhatsApp, DM. They click it. That's it." },
  { step: "03", title: "Look professional", body: "Your client sees a clean, branded page. Not a cluttered inbox thread. Not a confusing folder." }
];

const testimonials = [
  {
    quote: "I used to send files on Drive, invoice on PayPal, and updates on WhatsApp. Now I send one link. Clients actually pay faster.",
    name: "Maya R.",
    role: "Brand designer"
  },
  {
    quote: "The first time a client replied 'this is so professional' I knew it was worth every dollar.",
    name: "Tom K.",
    role: "Freelance developer"
  },
  {
    quote: "Set it up in an afternoon. My clients stopped emailing me asking where their files were.",
    name: "Sara L.",
    role: "Copywriter"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <span className="font-display text-xl text-emerald-700 italic">portalio</span>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              Sign in
            </Link>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/signup">Get started free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 pointer-events-none" />
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center sm:pt-32">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Free to start · No credit card required
          </div>
          <h1 className="animate-fade-up animate-delay-100 mt-7 text-5xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            One link for<br />
            <span className="font-display italic font-normal text-emerald-700">every client project</span>
          </h1>
          <p className="animate-fade-up animate-delay-200 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 sm:text-xl">
            Stop scattering files across Google Drive, invoices across email, and updates across WhatsApp.
            Send clients a single link with everything in one place.
          </p>
          <div className="animate-fade-up animate-delay-300 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full rounded-xl sm:w-auto shadow-md shadow-emerald-900/10">
              <Link href="/signup">
                Create your first portal free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-zinc-400">First portal free. Then $29/month.</p>
          </div>
        </div>
      </section>

      {/* Portal preview mockup */}
      <section className="mx-auto max-w-3xl px-5 pb-28">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-dialog">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-100/70 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-zinc-300" />
              <div className="h-3 w-3 rounded-full bg-zinc-300" />
              <div className="h-3 w-3 rounded-full bg-zinc-300" />
            </div>
            <div className="mx-auto flex-1 max-w-xs rounded-md bg-white border border-zinc-200 px-3 py-1 text-center text-xs text-zinc-400 shadow-sm">
              portalio.app/p/abc123
            </div>
          </div>
          {/* Portal content preview */}
          <div className="p-6 sm:p-8">
            <p className="font-display text-base italic text-emerald-700">portalio</p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Brand Identity Package</h2>
                <p className="mt-1 text-sm text-zinc-500">Prepared for Acme Co.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/60">
                Delivered ✓
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {/* Files card */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Files</p>
                  <p className="text-xs text-zinc-400 bg-zinc-50 rounded-full px-2 py-0.5">3 shared</p>
                </div>
                <div className="mt-3 space-y-1.5">
                  {["logo_final.zip", "brand_guide.pdf", "assets.zip"].map((f) => (
                    <div key={f} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs border border-zinc-100">
                      <span className="truncate text-zinc-700 font-medium">{f}</span>
                      <FileDown className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Invoice card */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-card">
                <p className="text-sm font-semibold">Invoice</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">$1,200</p>
                <p className="mt-1 text-xs text-zinc-400">Due Jun 15, 2026</p>
                <div className="mt-4 rounded-lg bg-primary py-2.5 text-center text-xs font-semibold text-white shadow-sm">
                  Pay Now →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-[#fafaf9] py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Four things.{" "}
              <span className="font-display italic font-normal text-emerald-700">That's the whole product.</span>
            </h2>
            <p className="mx-auto mt-4 text-zinc-500 leading-relaxed">
              No automation. No CRM. No 200-feature dashboard that overwhelms you on day one.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200/50 group-hover:bg-emerald-100 transition-colors">
                  <Icon className="h-4.5 w-4.5 text-emerald-700" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Up and running in{" "}
            <span className="font-display italic font-normal text-emerald-700">one afternoon</span>
          </h2>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {steps.map(({ step, title, body }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-14 hidden h-px w-[calc(100%+2.5rem)] bg-gradient-to-r from-zinc-200 to-transparent sm:block" />
                )}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200/50">
                  {step}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-zinc-100 bg-[#fafaf9] py-28">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Freelancers who stopped{" "}
            <span className="font-display italic font-normal text-emerald-700">duct-taping tools together</span>
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
                <div className="text-2xl font-display italic text-emerald-200 leading-none mb-3">"</div>
                <p className="text-sm leading-relaxed text-zinc-600">{quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                    {name[0]}
                  </div>
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
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Simple pricing
          </h2>
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-dialog">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50">One plan</span>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight">$29</span>
              <span className="pb-2 text-zinc-400 text-sm">/month</span>
            </div>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
              First portal free, no credit card needed. Upgrade when you land your second client.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Unlimited client portals",
                "File sharing & storage",
                "Invoice + payment link",
                "Client chat with email alerts",
                "Project status updates",
                "No client account required"
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/50 shrink-0">
                    <Check className="h-3 w-3 text-emerald-700" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full rounded-xl shadow-md shadow-emerald-900/10" size="lg">
              <Link href="/signup">Start free — no card needed</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-cta relative overflow-hidden py-24 text-white">
        <div className="noise-bg absolute inset-0" />
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl text-balance">
            Your next client deserves a better experience
          </h2>
          <p className="mt-4 text-emerald-200 leading-relaxed">
            Create your first portal in 3 minutes. Free, no card required.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-xl shadow-lg">
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-sm text-zinc-400 sm:flex-row">
          <span className="font-display text-lg italic text-emerald-700">portalio</span>
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
