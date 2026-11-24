"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, MapPin } from "lucide-react";

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setDownloaded(false);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    setDownloaded(true);
    // Trigger download simulation or actual file if available
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-2xl bg-white text-navy rounded-3xl overflow-hidden shadow-2xl z-10 my-8 border border-black/10"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#16262C] text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#4F9484]" />
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Official Soil Intelligence Report</h3>
                  <p className="text-[11px] text-white/60 font-mono">Sample Slip &amp; Card · SOILENZ 2.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal / Card Preview */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto font-sans">
              {/* Report Header */}
              <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-widest font-mono text-leaf-dark font-bold">ArkaShine Verified</div>
                  <h4 className="text-xl font-extrabold text-navy">SOIL HEALTH ASSESSMENT</h4>
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Plot #4B · Bidar Taluk, Karnataka (17.9104° N, 77.5199° E)
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-muted">
                  <div>Date: 04-Nov-2026</div>
                  <div>Device: SL2-KA-0941</div>
                  <div className="text-leaf-dark font-semibold">Test Time: 18m 42s</div>
                </div>
              </div>

              {/* Farmer and Field details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-mint/50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-muted block">Farmer</span>
                  <span className="font-semibold text-navy">Ramesh Patil</span>
                </div>
                <div>
                  <span className="text-muted block">Crop Intended</span>
                  <span className="font-semibold text-navy">Soybean / Gram</span>
                </div>
                <div>
                  <span className="text-muted block">Acreage</span>
                  <span className="font-semibold text-navy">4.5 Acres</span>
                </div>
                <div>
                  <span className="text-muted block">Partner</span>
                  <span className="font-semibold text-navy">Bidar Agri FPO</span>
                </div>
              </div>

              {/* 14 Parameters Table */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2 font-bold flex items-center justify-between">
                  <span>Parameter Scan Results (14 Parameters)</span>
                  <span className="text-leaf font-bold">✓ Calibrated</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  {[
                    { name: "pH", val: "6.8", status: "Optimal", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "EC", val: "0.42 dS/m", status: "Safe", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Org Carbon (OC)", val: "0.58 %", status: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
                    { name: "Nitrogen (N)", val: "279 kg/ha", status: "Low", color: "text-red-600 bg-red-50 border-red-200" },
                    { name: "Phosphorus (P)", val: "22 kg/ha", status: "Adequate", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Potassium (K)", val: "285 kg/ha", status: "High", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Calcium (Ca)", val: "1,420 ppm", status: "Sufficient", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Magnesium (Mg)", val: "310 ppm", status: "Sufficient", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Sulphur (S)", val: "14.2 ppm", status: "Adequate", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Zinc (Zn)", val: "0.78 ppm", status: "Deficient", color: "text-red-600 bg-red-50 border-red-200" },
                    { name: "Iron (Fe)", val: "6.4 ppm", status: "Adequate", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Manganese (Mn)", val: "4.8 ppm", status: "Adequate", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Copper (Cu)", val: "1.1 ppm", status: "Adequate", color: "text-leaf bg-emerald-50 border-emerald-200" },
                    { name: "Boron (B)", val: "0.45 ppm", status: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
                  ].map((item) => (
                    <div key={item.name} className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span>{item.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="font-bold text-navy text-sm mt-1">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored Dosage Recommendation */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs">
                <div className="font-bold text-navy flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-leaf" />
                  Algorithm Dosage Recommendation (Soybean · 4.5 Acres)
                </div>
                <p className="text-navy/80 leading-relaxed">
                  Reduce DAP by <strong>15%</strong> due to existing adequate phosphorus reserve. Apply <strong>Zinc Sulphate @ 10 kg/acre</strong> to resolve acute micro-nutrient deficiency. Estimated fertilizer input savings: <strong>₹2,450 / acre</strong>.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted">Generated via ArkaShine Soil Partner App & Cloud</span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-muted hover:text-navy hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2F6F62] hover:bg-[#2F6F62] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
                >
                  {downloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Printing / Saving...
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      Print / Download Sample PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
