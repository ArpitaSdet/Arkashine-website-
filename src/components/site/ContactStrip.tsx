import { MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/content";

/**
 * "Contact us" block shown at the end of every page: phone, WhatsApp, office.
 * tone="light" for light pages, "dark" for dark-green pages.
 */
export function ContactStrip({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const card = dark
    ? "border-white/15 bg-white/[0.06] text-[#fff] hover:bg-white/[0.12]"
    : "border-[#162a54]/10 bg-[#fff] text-[#162a54] hover:border-[#1E7A33]/40 hover:shadow-md";
  const label = dark ? "text-[#a7d48a]" : "text-[#1E7A33]";
  const sub = dark ? "text-[#fff]/70" : "text-[#5b6575]";
  const items = [
    { icon: Phone, k: "Call us", v: `+91 ${company.phone}`, href: company.phoneHref },
    { icon: MessageCircle, k: "WhatsApp", v: `+91 ${company.phone}`, href: company.whatsapp },
  ];
  const emails = [
    { label: "karbari.rsudha@gmail.com", href: "mailto:karbari.rsudha@gmail.com" },
    { label: "sudha.karbari@arkashine-innovations.com", href: "mailto:sudha.karbari@arkashine-innovations.com" },
  ];
  return (
    <section aria-label="Contact ArkaShine" className={`py-12 ${dark ? "bg-[#12352f]" : "bg-[#eaf5dc]"} ${className}`}>
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`font-mono text-xs font-bold uppercase tracking-[0.18em] ${label}`}>Contact us</p>
            <h2 className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${dark ? "text-[#fff]" : "text-[#162a54]"}`}>Talk to the ArkaShine team</h2>
            <p className={`mt-1 flex items-center gap-1.5 text-sm ${sub}`}>
              <MapPin className="h-4 w-4 shrink-0" /> {company.address} · Mon–Sat, 9:30 AM – 6:30 PM IST
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[460px]">
            {items.map(({ icon: Icon, k, v, href }) => (
              <a
                key={k}
                href={href}
                target={k === "WhatsApp" ? "_blank" : undefined}
                rel={k === "WhatsApp" ? "noopener noreferrer" : undefined}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${card}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E7A33] text-[#fff] transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className={`block font-mono text-[10px] uppercase tracking-[0.16em] ${sub}`}>{k}</span>
                  <span className="block truncate text-sm font-semibold">{v}</span>
                </span>
              </a>
            ))}
            <div className={`col-span-1 sm:col-span-2 rounded-2xl border px-4 py-3 ${dark ? "border-white/15 bg-white/[0.06]" : "border-[#162a54]/10 bg-[#fff]"}`}>
              <span className={`block font-mono text-[10px] uppercase tracking-[0.16em] mb-1 ${sub}`}>Email us</span>
              {emails.map((e) => (
                <a key={e.href} href={e.href} className={`block truncate text-sm font-medium transition-colors hover:text-[#1E7A33] ${dark ? "text-[#fff]/90" : "text-[#162a54]"}`}>{e.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
