"use client";

/**
 * A button that opens an enquiry form and emails it to the ArkaShine team
 * via /api/enquiry. kind = "partner" | "proposal" | "message".
 */

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send, X } from "lucide-react";

type Kind = "partner" | "proposal" | "message";

const COPY: Record<Kind, { title: string; sub: string; cta: string }> = {
  partner: { title: "Partner with ArkaShine", sub: "Tell us about your institution and we'll get back within two working days.", cta: "Send partnership request" },
  proposal: { title: "Request a proposal", sub: "Share a few details and we'll send a tailored School Innovation Lab proposal.", cta: "Request proposal" },
  message: { title: "Email us", sub: "Write to the ArkaShine team — we reply by email or phone.", cta: "Send message" },
};

type Audience = "school" | "soil-partner" | "general";
const OPTIONS: Record<Audience, { roles: string[]; orgTypes: string[]; orgLabel: string; orgHint: string; partnerSub: string; email: string }> = {
  school: {
    roles: ["Principal", "Teacher", "Trustee / Management", "CSR lead", "Parent", "Other"],
    orgTypes: ["School", "Educational trust", "CSR programme", "NGO", "Government", "Other"],
    orgLabel: "School / organisation",
    orgHint: "Name of your institution",
    partnerSub: "Tell us about your institution and we'll get back within two working days.",
    email: "you@school.edu.in",
  },
  general: {
    roles: ["Farmer", "FPO / farmer group", "Distributor / dealer", "Institution / university", "Government / KVK", "CSR / NGO", "Other"],
    orgTypes: ["Individual", "FPO", "Company", "Institution", "Government", "NGO / CSR", "Other"],
    orgLabel: "Organisation (if any)",
    orgHint: "Organisation or business name",
    partnerSub: "Tell us what you need and we'll get back within two working days.",
    email: "you@example.com",
  },
  "soil-partner": {
    roles: ["Soil entrepreneur", "FPO representative", "Distributor / dealer", "Agri-input company", "CSR / NGO lead", "Other"],
    orgTypes: ["Individual / entrepreneur", "FPO", "Dealer / distributor", "Agri-input company", "NGO / CSR", "Government / KVK", "Other"],
    orgLabel: "Organisation (if any)",
    orgHint: "FPO, firm or business name",
    partnerSub: "Tell us about yourself and your region. We'll send the partner pack within two working days.",
    email: "you@example.com",
  },
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#3f5a4f]">{label}</span>
      {children}
    </label>
  );
}

const input =
  "w-full rounded-xl border border-emerald-900/15 bg-[#f4faf1] px-3.5 py-2.5 text-sm text-[#13201b] placeholder:text-[#8a9690] focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/15";

export function EnquiryButton({ kind, className, children, audience = "school" }: { kind: Kind; className?: string; children: ReactNode; audience?: Audience }) {
  const o = OPTIONS[audience];
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [f, setF] = useState<Record<string, string>>({ role: "", orgType: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name?.trim() || (!f.phone?.trim() && !f.email?.trim())) {
      setError("Please add your name and a phone number or email.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, kind, audience, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
      setError("We couldn't send this right now. Please try again, or WhatsApp us on +91 96112 97893.");
    }
  };

  const c = kind === "partner" ? { ...COPY.partner, sub: o.partnerSub } : COPY[kind];
  const full = kind !== "message";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setState("idle");
          setError("");
        }}
        className={className}
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div className="absolute inset-0 bg-[#0e2a21]/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={c.title}
                  className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 text-[#13201b] shadow-2xl sm:p-8"
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                >
                  <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full p-2 text-[#5b6575] hover:bg-emerald-50" aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>

                  {state === "done" ? (
                    <div className="py-10 text-center">
                      <motion.span
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 14 }}
                      >
                        <Check className="h-8 w-8" />
                      </motion.span>
                      <h3 className="mt-5 font-display text-2xl font-bold text-[#0e2a21]">Thank you, {f.name?.split(" ")[0] || "there"}!</h3>
                      <p className="mt-2 text-sm text-[#5b6575]">Your details have reached the ArkaShine team. We&rsquo;ll be in touch shortly.</p>
                      <button type="button" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} className="space-y-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[#0e2a21]">{c.title}</h3>
                        <p className="mt-1 text-sm text-[#5b6575]">{c.sub}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Full name *">
                          <input className={input} value={f.name || ""} onChange={set("name")} placeholder="Your name" autoComplete="name" />
                        </Field>
                        {full && (
                          <Field label="Your role">
                            <select className={input} value={f.role} onChange={set("role")}>
                              <option value="">Select</option>
                              {o.roles.map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </select>
                          </Field>
                        )}
                        <Field label="Email">
                          <input className={input} type="email" value={f.email || ""} onChange={set("email")} placeholder={o.email} autoComplete="email" />
                        </Field>
                        <Field label="Phone / WhatsApp">
                          <input className={input} type="tel" value={f.phone || ""} onChange={set("phone")} placeholder="+91" autoComplete="tel" />
                        </Field>
                        {full && (
                          <>
                            <Field label={o.orgLabel}>
                              <input className={input} value={f.organisation || ""} onChange={set("organisation")} placeholder={o.orgHint} />
                            </Field>
                            <Field label="Organisation type">
                              <select className={input} value={f.orgType} onChange={set("orgType")}>
                                <option value="">Select</option>
                                {o.orgTypes.map((r) => (
                                  <option key={r}>{r}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="City / district">
                              <input className={input} value={f.city || ""} onChange={set("city")} placeholder="e.g. Mysuru, Karnataka" />
                            </Field>
                          </>
                        )}
                        {kind === "proposal" && (
                          <>
                            <Field label="Number of students">
                              <input className={input} inputMode="numeric" value={f.students || ""} onChange={set("students")} placeholder="e.g. 40" />
                            </Field>
                            <Field label="Preferred start">
                              <input className={input} type="month" value={f.start || ""} onChange={set("start")} />
                            </Field>
                          </>
                        )}
                      </div>

                      <Field label={kind === "message" ? "Your message *" : "Anything else we should know?"}>
                        <textarea className={`${input} min-h-[96px]`} value={f.message || ""} onChange={set("message")} placeholder="Write here…" />
                      </Field>

                      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                      <button
                        type="submit"
                        disabled={state === "sending"}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {state === "sending" ? "Sending…" : c.cta}
                      </button>
                      <p className="text-center text-xs text-[#5b6575]">We only use these details to reply to you. See our privacy policy.</p>
                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
