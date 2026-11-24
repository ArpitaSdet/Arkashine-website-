import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ContactStrip } from "@/components/site/ContactStrip";

export interface PolicySection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Shared layout for the policy pages: readable column, contents list, light green page. */
export function PolicyPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  intro?: ReactNode;
  sections: PolicySection[];
}) {
  return (
    <div className="min-h-screen bg-[#eef6ea] text-[#13201b]">
      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#1f5246]">
        <div className="container-site flex h-16 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2.5 text-ivory">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
            <Image src="/images/logo/arkashine-logo-bold-white.png" alt="ArkaShine" width={494} height={156} unoptimized className="h-8 w-auto" />
          </Link>
          <nav className="flex gap-4 font-mono text-xs uppercase tracking-wider text-ivory/85">
            <Link href="/privacy-policy" className="hover:text-botanical">Privacy</Link>
            <Link href="/shipping-policy" className="hover:text-botanical">Shipping</Link>
            <Link href="/cancellation-refund-policy" className="hover:text-botanical">Refunds</Link>
          </nav>
        </div>
      </header>

      <div className="container-site grid max-w-6xl grid-cols-1 gap-10 py-14 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-[#0e2a21] sm:text-4xl">{title}</h1>
            {updated && <p className="mt-2 text-sm text-[#5b6575]">Last updated: {updated}</p>}
            {sections.length > 3 && (
              <ol className="mt-6 hidden space-y-1.5 border-l border-emerald-900/15 pl-4 text-sm lg:block">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[#3f5a4f] hover:text-emerald-700">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>

        <article className="space-y-8 lg:col-span-9">
          {intro && <div className="rounded-2xl border border-emerald-900/10 bg-white/70 p-6 text-[15px] leading-relaxed">{intro}</div>}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white/70 p-6">
              <h2 className="font-display text-xl font-bold text-[#0e2a21]">
                {sections.length > 3 ? `${i + 1}. ` : ""}
                {s.title}
              </h2>
              <div className="policy-body mt-3 space-y-3 text-[15px] leading-relaxed text-[#2b3a33]">{s.body}</div>
            </section>
          ))}
          <p className="text-sm text-[#5b6575]">© ArkaShine Innovations Pvt. Ltd. · www.arkashine-innovations.com · All Rights Reserved</p>
        </article>
      </div>
      <ContactStrip />
    </div>
  );
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 marker:text-emerald-600">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-[#5b4a1f]">{children}</p>;
}
