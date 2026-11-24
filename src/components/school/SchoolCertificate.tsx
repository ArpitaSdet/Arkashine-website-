"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Award, Clock, Sprout, Users } from "lucide-react";

const POINTS = [
  { icon: Clock, label: "72 hours" },
  { icon: Sprout, label: "Lab + field" },
  { icon: Users, label: "Farmer advisory" },
];

export function SchoolCertificate({ certificateImg = "/images/school/student_certificate.jpg" }: { certificateImg?: string }) {
  return (
    <section
      id="student-certificate"
      className="relative flex min-h-[calc(100svh-5rem)] snap-start items-center overflow-hidden bg-[#fbf7ee] py-10 text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_35%_50%,rgba(234,179,8,0.18),transparent)]" />

      <div className="container-site relative z-10 grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* paper certificate behind, digital certificate printing out in front, then the "verified" stamp */}
        <div className="relative lg:col-span-7" style={{ perspective: 1400 }}>
          <div className="relative mx-auto aspect-[1.25/1] w-full max-w-[min(100%,calc((100svh-11rem)*1.25))]">
            <motion.div
              className="absolute left-0 top-0 w-[68%] overflow-hidden rounded-2xl border-4 border-[#e6c46a] shadow-[0_30px_70px_-20px_rgba(19,32,27,0.45)]"
              initial={{ opacity: 0, rotate: -14, x: -40 }}
              whileInView={{ opacity: 1, rotate: -6, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ rotate: -2, scale: 1.03, zIndex: 20 }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              style={{ aspectRatio: "1200 / 896" }}
            >
              <Image src={certificateImg} alt="Printed ArkaShine Young Soil Scientist certificate" fill sizes="460px" className="object-cover" />
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-0 z-10 w-[64%]"
              initial={{ opacity: 0, y: 120, rotateX: 35 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8, rotateY: -6 }}
              transition={{ type: "spring", stiffness: 55, damping: 14, delay: 0.35 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_40px_80px_-25px_rgba(19,32,27,0.55)] ring-1 ring-ink/5">
                <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "597 / 518" }}>
                  <Image src="/images/school/portal-certificate-hd.webp" alt="Digital Young Soil Scientist certificate from the student portal, with QR verification" fill sizes="440px" className="object-cover" />
                  <motion.span
                    className="pointer-events-none absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-[#8cbf5f]/35 to-transparent"
                    initial={{ top: "-15%" }}
                    whileInView={{ top: "110%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 1.1, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <motion.span
                className="absolute -right-4 -top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-[#e6c46a] bg-[#e6f2d9] text-[#a87412] shadow-lg"
                initial={{ opacity: 0, scale: 2.4, rotate: -40 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 2.4 }}
              >
                <Award className="h-6 w-6" strokeWidth={1.6} />
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Verified</span>
              </motion.span>
              <motion.span
                className="absolute -bottom-4 left-5 rounded-full bg-forest px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ivory shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.8 }}
              >
                QR-verified · print or download
              </motion.span>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e6c46a] bg-white shadow-sm px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a87412]">
            <Award className="h-3.5 w-3.5" />
            Certificate
          </div>
          <h2 className="display mt-4 text-3xl font-bold text-forest [text-wrap:balance] sm:text-5xl">Every student earns one.</h2>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-ink/65">
            The Young Soil Scientist certificate recognises lab work, field sampling and real advice given to farmers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.span
                  key={p.label}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 + i * 0.08 }}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/5 bg-white px-4 py-2 font-mono text-xs text-ink shadow-sm"
                >
                  <Icon className="h-4 w-4 text-botanical-dark" strokeWidth={1.5} />
                  {p.label}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
