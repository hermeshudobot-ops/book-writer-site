"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface BookPage {
  number: number;
  title_en: string;
  title_vi: string;
  image: string;
}

interface BookData {
  slug: string;
  title_en: string;
  title_vi: string;
  author: string;
  age_range: string;
  description_en?: string;
  description_vi?: string;
  cover_image?: string;
  page_count: number;
  pages: BookPage[];
}

export default function BookReader({
  book,
  bookSlug,
}: {
  book: BookData;
  bookSlug: string;
}) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = book.pages.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update scroll progress
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute("data-page") || "0", 10);
            setCurrent(pageNum);
            setProgress(((pageNum + 1) / (totalPages + 1)) * 100);
          }
        });
      },
      { threshold: 0.6 }
    );

    containerRef.current
      ?.querySelectorAll("[data-page]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [totalPages]);

  // Reveal animations
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) =>
      revealObserver.observe(el)
    );

    return () => revealObserver.disconnect();
  }, [mounted]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const reset = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 4000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("touchstart", reset);
    reset();
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("touchstart", reset);
      clearTimeout(timeout);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        navigateTo(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        navigateTo(current - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const navigateTo = (target: number) => {
    if (target < 0 || target >= totalPages) return;
    setDirection(target > current ? "next" : "prev");
    setCurrent(target);
    const el = document.getElementById(`page-target-${target}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100" ref={containerRef}>
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              left: `${(i * 8.33) % 100}%`,
              top: `${(i * 23.7 + 5) % 90}%`,
              "--duration": `${6 + (i % 4) * 2}s`,
              "--delay": `${i * 0.7}s`,
              opacity: 0.15 + (i % 3) * 0.1,
              width: i % 3 === 0 ? "4px" : "2px",
              height: i % 3 === 0 ? "4px" : "2px",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ─── HERO COVER ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-green-950/40 to-stone-950" />

        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-breathe" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-500/5 blur-3xl animate-breathe" style={{ animationDelay: "3s" }} />

        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 text-center ${mounted ? "" : "opacity-0"}`}
        >
          {/* Animated leaf emoji */}
          <div className="text-7xl md:text-8xl mb-8 anim-float" style={{ animationDelay: "1s" }}>
            🐛🍃
          </div>

          {/* Book title with typewriter-like reveal */}
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4 anim-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="block text-amber-100">The Little</span>
            <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Caterpillar
            </span>
          </h1>

          <p className="font-playfair italic text-xl md:text-2xl text-stone-400 mb-8 anim-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Chú Sâu Bướm Nhỏ
          </p>

          {/* Gold line */}
          <div className="gold-line w-32 mx-auto mb-8 anim-fade-in" style={{ animationDelay: "0.8s" }} />

          {/* Description */}
          <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto mb-10 anim-fade-in-up leading-relaxed" style={{ animationDelay: "1s" }}>
            A beautiful bilingual story about a little caterpillar named Nunu
            who transforms into a magnificent butterfly.
          </p>

          {/* Author & meta */}
          <div className="flex items-center justify-center gap-6 text-sm text-stone-600 mb-12 anim-fade-in" style={{ animationDelay: "1.2s" }}>
            <span>By {book.author}</span>
            <span className="w-1 h-1 rounded-full bg-stone-700" />
            <span>{book.page_count} pages</span>
            <span className="w-1 h-1 rounded-full bg-stone-700" />
            <span>Ages {book.age_range}</span>
          </div>

          {/* Read button */}
          <button
            onClick={() => {
              document.getElementById("page-target-0")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl text-stone-950 font-bold text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 active:scale-95 anim-scale-in"
            style={{ animationDelay: "1.4s" }}
          >
            <span>Begin Reading</span>
            <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          </button>

          {/* Scroll hint */}
          <div className="mt-16 anim-fade-in" style={{ animationDelay: "2s" }}>
            <div className="w-6 h-10 mx-auto rounded-full border-2 border-stone-700 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-amber-400 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOOK PAGES ─── */}
      <main className="relative z-10">
        {book.pages.map((page, idx) => {
          const isRight = idx % 2 === 0;
          return (
            <article
              key={page.number}
              id={`page-target-${idx}`}
              data-page={idx}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <div className="max-w-6xl w-full mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  {/* Image side */}
                  <div
                    className={`flex-1 ${isRight ? "reveal-left" : "reveal-right"}`}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-green-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative page-spread rounded-2xl overflow-hidden shadow-2xl shadow-black/50 anim-glow">
                        {/* Image */}
                        <div className="page-image-wrapper">
                          <img
                            src={`/books/${bookSlug}/images/${page.image}`}
                            alt={`Page ${page.number} illustration`}
                            className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        {/* Page badge */}
                        <div className="page-badge">
                          {page.number} / {book.page_count}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* English text */}
                    <div className="reveal" style={{ transitionDelay: "200ms" }}>
                      <p className="font-playfair text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug text-stone-100 mb-4 text-highlight-bg">
                        {page.title_en}
                      </p>
                    </div>

                    {/* Vietnamese text */}
                    <div className="reveal" style={{ transitionDelay: "400ms" }}>
                      <p className="font-playfair italic text-lg md:text-xl text-stone-500 leading-snug">
                        {page.title_vi}
                      </p>
                    </div>

                    {/* Decorative underline */}
                    <div className="gold-line w-24 mx-auto lg:mx-0 mt-8 reveal" style={{ transitionDelay: "600ms" }} />

                    {/* Page dots indicator */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 mt-6 reveal" style={{ transitionDelay: "700ms" }}>
                      {[...Array(Math.min(totalPages, 8))].map((_, i) => {
                        const showDots = totalPages > 8;
                        let dotIdx: number;
                        if (!showDots) {
                          dotIdx = i;
                        } else if (idx <= 3) {
                          dotIdx = i;
                        } else if (idx >= totalPages - 4) {
                          dotIdx = 8 - (totalPages - idx);
                        } else {
                          dotIdx = Math.min(7, Math.max(1, Math.floor((idx / totalPages) * 8)));
                        }
                        dotIdx = Math.min(7, Math.max(0, Math.round((idx / (totalPages - 1)) * 7)));

                        return (
                          <div
                            key={i}
                            className={`transition-all duration-500 rounded-full ${
                              i === dotIdx
                                ? "w-6 h-2 bg-amber-400"
                                : "w-2 h-2 bg-stone-700"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* ─── END CHAPTER ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-950/20 to-stone-950" />

        {/* Butterfly animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute text-6xl left-1/2 top-1/4"
            style={{ animation: "float 5s ease-in-out infinite" }}
          >
            🦋
          </div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="reveal">
            <div className="text-8xl mb-8">🦋</div>

            <div className="gold-line w-48 mx-auto mb-8" />

            <p className="font-playfair text-3xl md:text-4xl font-semibold text-stone-100 mb-4 leading-snug">
              Even the biggest transformation begins with a tiny step.
            </p>
            <p className="font-playfair italic text-xl text-stone-500 mb-10">
              Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
            </p>

            <div className="gold-line w-32 mx-auto mb-8" />

            <p className="text-stone-600 text-sm">
              {book.title_en} | {book.title_vi}
              <br />
              By {book.author} · © 2026
            </p>

            <Link
              href="/books/little-caterpillar"
              className="inline-block mt-12 px-8 py-3 bg-stone-800 text-stone-300 rounded-full text-sm font-medium hover:bg-stone-700 hover:text-stone-100 transition-all duration-300"
            >
              ← Back to Library
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NAV ARROWS ─── */}
      <div
        className={`fixed inset-y-0 left-4 z-50 flex items-center transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {current > 0 && (
          <button
            onClick={() => navigateTo(current - 1)}
            className="w-12 h-12 rounded-full bg-stone-900/80 backdrop-blur border border-stone-700/50 flex items-center justify-center text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Previous page"
          >
            ←
          </button>
        )}
      </div>
      <div
        className={`fixed inset-y-0 right-4 z-50 flex items-center transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {current < totalPages - 1 && (
          <button
            onClick={() => navigateTo(current + 1)}
            className="w-12 h-12 rounded-full bg-stone-900/80 backdrop-blur border border-stone-700/50 flex items-center justify-center text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Next page"
          >
            →
          </button>
        )}
      </div>

      {/* ─── BOTTOM PAGE INDICATOR ─── */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center gap-3 bg-stone-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-700/50">
          <span className="text-xs text-stone-500">Page</span>
          <span className="text-sm font-bold text-amber-400">{current + 1}</span>
          <span className="text-xs text-stone-600">/</span>
          <span className="text-xs text-stone-500">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
