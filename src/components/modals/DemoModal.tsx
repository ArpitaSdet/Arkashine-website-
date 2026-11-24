"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Check, ArrowRight, ArrowLeft, MapPin, User, Phone, CalendarDays, Mail } from "lucide-react";

export function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState("FPO / Farmer Group");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step < 3) return setStep(step + 1);
    if (!name.trim() || !phone.trim() || !date) {
      setError("Please add your name, phone and a preferred date.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, date, orgType, location }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setSubmitted(true);
    } catch {
      setError("We couldn't send your booking right now. Please try again, or WhatsApp us on +91 96112 97893.");
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg bg-[#0C0F14] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 z-10 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-white/15 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-[#4F9484]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-2xl text-white">
              Demonstration Booked
            </h3>
            <p className="font-sans text-sm text-[#CBD5E1] max-w-xs mx-auto">
              Our Bengaluru team will contact {name || "you"} within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? "w-8 bg-[#2F6F62]"
                        : i < step
                        ? "w-4 bg-white/40"
                        : "w-4 bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#94A3B8]">
                Step 0{step} / 03
              </span>
            </div>

            {/* Step 1: Organisation Type */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl text-white mb-1">
                    Select Organisation Type
                  </h3>
                  <p className="font-sans text-xs text-[#8F99B0]">
                    Help us prepare a tailored operational deployment model.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    "FPO / Farmer Group",
                    "Corporate Agriculture",
                    "CSR Foundation",
                    "NGO / Non-Profit",
                    "Agri-Input Company",
                    "Government / KVK",
                    "Soil Entrepreneur",
                    "Other",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrgType(type)}
                      className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                        orgType === type
                          ? "bg-white text-[#0C0F14] font-medium border-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl text-white mb-1">
                    Operating Cluster
                  </h3>
                  <p className="font-sans text-xs text-[#8F99B0]">
                    Where would you like the field equipment demonstrated?
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F99B0]" />
                    <input
                      type="text"
                      placeholder="District, State (e.g. Mysuru, Karnataka)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#2F6F62]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl text-white mb-1">
                    Contact Details
                  </h3>
                  <p className="font-sans text-xs text-[#8F99B0]">
                    We will send deployment details and confirm live test timing.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F99B0]" />
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#2F6F62]"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F99B0]" />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#2F6F62]"
                    />
                  </div>

                  <div className="relative">
                    <CalendarDays className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F99B0]" />
                    <input
                      type="date"
                      aria-label="Preferred demo date"
                      value={date}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs [color-scheme:dark] focus:outline-none focus:border-[#2F6F62]"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F99B0]" />
                    <input
                      type="tel"
                      placeholder="WhatsApp Mobile (+91)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#2F6F62]"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">{error}</p>}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-full text-xs text-[#8F99B0] hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={sending}
                className="btn-primary disabled:opacity-60"
              >
                <span>{step === 3 ? (sending ? "Sending…" : "Confirm Demo") : "Proceed"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
