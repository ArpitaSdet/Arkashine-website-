"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Sparkles } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  summary: string;
  highlight: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "soil-diagnostics-rapid-testing",
    title: "Beyond Reagent Bottles: The Science of Rapid On-Field Soil Diagnostics",
    category: "Hardware & Science",
    categoryColor: "bg-emerald-50 text-[#162a54] border-emerald-200",
    date: "November 2026",
    readTime: "6 min read",
    image: "/images/products/soillenz-2-studio.webp",
    imageAlt: "SoiLenz 2.0 and pH bottle combination in studio",
    summary:
      "Conventional soil testing requires weeks of laboratory turnaround. Here is how ArkaShine's patented multi-parameter sensor array measures nutrient levels in under 5 minutes with high accuracy against ICAR benchmarks.",
    highlight: "14 Parameters · 5-Min Readout",
  },
  {
    slug: "soil-health-saturation-village-level",
    title: "Bridging the Soil Health Gap: How Portable Testing Saturates Villages in Real Time",
    category: "Rural Agronomy",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: "October 2026",
    readTime: "4 min read",
    image: "/images/field/farmers-with-soillenz.webp",
    imageAlt: "Indian farmers receiving printed Soil Health Cards with SoiLenz",
    summary:
      "Less than 18% of smallholders have soil cards before sowing. Doorstep village testing across Bidar delivered same-day printed tickets, cutting excess Urea application by 24% and saving ₹4,200 per acre in crop inputs.",
    highlight: "Same-Day Delivery · 1,500+ Farmers",
  },
  {
    slug: "school-innovation-lab-stem-agriculture",
    title: "When Classrooms Meet Farmlands: The Rise of School-Based Soil Innovation Labs",
    category: "STEM & Community",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: "September 2026",
    readTime: "5 min read",
    image: "/images/school/lab_students.jpg",
    imageAlt: "High school students operating SoiLenz in school laboratory",
    summary:
      "High school students in semi-urban Karnataka are diagnosing farm samples, interpreting soil health data, and advising farming families through an intensive 4-week summer innovation program.",
    highlight: "4-Week Cohort · 25 Villages",
  },
];

export function HomeBlogSection() {
  return (
    // Clean, crisp white background as requested
    <section id="blog" className="home-keep relative bg-ivory py-20 sm:py-28 text-slate-900 border-t border-slate-200">
      <div className="container-site max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#162a54] font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              FIELD RESEARCH &middot; EDITORIAL NOTES
            </div>
            <h2 className="display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Stories from the Soil.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-[38ch] leading-relaxed">
            Data, field notes, and deep-tech hardware dispatches directly from ArkaShine's R&amp;D engineering lab in Bengaluru, Karnataka.
          </p>
        </div>

        {/* 3-Column Blog Cards with Photos on White Background */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#fafaf9] overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Category Pill Tag */}
                  <span
                    className={`absolute top-4 left-4 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider font-semibold shadow-sm backdrop-blur-md ${post.categoryColor}`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  {/* Meta Bar */}
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      {post.readTime}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 flex items-center justify-between border-t border-slate-200/70 text-xs font-mono">
                <span className="font-semibold text-[#162a54] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                  {post.highlight}
                </span>

                <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-slate-800 group-hover:text-emerald-700 transition-colors">
                  Read Article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
