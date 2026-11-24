"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, ShieldCheck, Sparkles } from "lucide-react";

interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  title?: string;
}

export function VideoLightbox({
  isOpen,
  onClose,
  videoSrc = "/video/soillenz-field-demo.mp4",
  title = "SOILENZ 2.0 · Field Demonstration",
}: VideoLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-4xl bg-[#0C0F14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#2F6F62]" />
                <h3 className="text-white font-medium text-sm sm:text-base tracking-tight">{title}</h3>
                <span className="text-xs bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded-full">
                  60s Demo
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close video player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player or High-Tech Simulated Field Stream */}
            <div className="relative aspect-video w-full bg-[#0C0F14] overflow-hidden flex items-center justify-center">
              <video
                src={videoSrc}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                poster="/images/products/soillenz-2-studio.webp"
                onError={(e) => {
                  // Fallback to stylized high-tech video simulation if local mp4 not found
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />

              {/* Styled Fallback Video Screen */}
              <div
                className="hidden absolute inset-0 flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0F1B4C] via-[#0A1236] to-[#04091A]"
              >
                <div className="w-20 h-20 rounded-full bg-[#E8B15D]/20 border border-[#E8B15D]/40 flex items-center justify-center mb-5 text-[#E8B15D] shadow-[0_0_30px_rgba(232,177,93,0.3)]">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Live Field Test & Thermal Printing</h4>
                <p className="text-sm text-white/60 max-w-md mb-6 leading-relaxed">
                  Demonstrating rapid 5-gram soil testing, Bluetooth handshake to Soil Partner App, and instant receipt printing in Bidar, Karnataka.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/50">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#E8B15D]" /> IN 387972 Capillary Tech</span>
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#6FA898]" /> 14 Parameters Calibrated</span>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
              <p>Filmed on site with FPO soil partners in Karnataka & Odisha.</p>
              <span className="text-white/40">Press ESC to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
