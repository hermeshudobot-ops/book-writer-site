"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Page data types ───
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

// ─── CSS ───
const styles = {
  flipContainer: {
    position: "relative" as const,
    width: "100%",
    maxWidth: 1100,
    aspectRatio: "1.85 / 1",
    margin: "0 auto",
    perspective: "2200px",
  },
  page: {
    position: "absolute" as const,
    inset: 0,
    transformStyle: "preserve-3d" as const,
    transformOrigin: "left center",
    transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
    zIndex: 1,
    borderRadius: "4px 12px 12px 4px",
    overflow: "hidden",
  },
  pageFront: {
    position: "absolute" as const,
    inset: 0,
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    display: "flex",
  },
  pageBack: {
    position: "absolute" as const,
    inset: 0,
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    transform: "rotateY(180deg)",
    display: "flex",
  },
  flipped: {
    transform: "rotateY(-180deg)",
  },
};

// ─── Component ───
export default function BookPremium({
  book,
  bookSlug,
}: {
  book: BookData;
  bookSlug: string;
}) {
  const totalPages = book.pages.length;
  // Spread index: each spread = left page + right page
  // spread 0 = cover spread (left: cover, right: title page)
  // spread 1 = page 1 (left: blank/title endpaper) + page 2
  // Actually let's simplify: one page at a time, full view
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [showUI, setShowUI] = useState(true);
  const uiTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI
  useEffect(() => {
    const reset = () => {
      setShowUI(true);
      if (uiTimeout.current) clearTimeout(uiTimeout.current);
      uiTimeout.current = setTimeout(() => {
        if (currentPage > 0) setShowUI(false);
      }, 3500);
    };
    const events = ["mousemove", "touchstart", "keypress"] as const;
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (uiTimeout.current) clearTimeout(uiTimeout.current);
    };
  }, [currentPage]);

  // Swipe left/right on touch
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) goToNextPage();
        else goToPrevPage();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  });

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const goToNextPage = useCallback(() => {
    if (isFlipping || currentPage >= totalPages) return;
    setFlipDirection("next");
    setIsFlipping(true);
    setCurrentPage((p) => p + 1);
    setTimeout(() => setIsFlipping(false), 850);
  }, [isFlipping, currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (isFlipping || currentPage <= 0) return;
    setFlipDirection("prev");
    setIsFlipping(true);
    setCurrentPage((p) => p - 1);
    setTimeout(() => setIsFlipping(false), 850);
  }, [isFlipping, currentPage]);

  const progress = ((currentPage + 1) / (totalPages + 1)) * 100;

  // ─── RENDER ───
  return (
    <div className="relative min-h-screen bg-[#0c0a09] overflow-hidden select-none">
      {/* Progress bar */}
      <div className="reading-progress-bar" style={{ width: `${progress}%` }} />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              left: `${(i * 6.9) % 100}%`,
              top: `${(i * 23.1 + 7) % 90}%`,
              animation: `ambient-float ${7 + (i % 5) * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.08 + (i % 4) * 0.04,
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
            }}
          />
        ))}
      </div>

      {/* ─── TOP BAR (show on cover) ─── */}
      {currentPage === 0 && showUI && (
        <div className="absolute top-5 left-5 z-50">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900/70 backdrop-blur-sm rounded-full border border-stone-700/40 text-stone-500 hover:text-amber-400 hover:border-amber-400/30 transition-all text-sm"
          >
            ← Library
          </Link>
        </div>
      )}

      {/* ─── BOOK AREA ─── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div style={styles.flipContainer}>
          {/* Background pages (static stack) */}
          <div className="absolute inset-0 rounded-[4px_12px_12px_4px] overflow-hidden book-cover-glow">
            <div className="w-full h-full paper-texture flex flex-col items-center justify-center spine-shadow">
              {/* Decorative border */}
              <div className="absolute inset-4 border border-amber-700/10 rounded" />
            </div>
          </div>

          {/* Flipping page */}
          {currentPage > 0 && (
            <div
              style={{
                ...styles.page,
                transform: `rotateY(${currentPage > 0 ? "-180deg" : "0deg"})`,
                transitionDuration: "0.8s",
                zIndex: 10,
              }}
            >
              {/* FRONT of flipping page (visible before flip = previous state) */}
              <div style={{ ...styles.pageFront, zIndex: 1 }}>
                <div className="w-full h-full paper-texture flex items-center justify-center p-10 spine-shadow relative">
                  <div className="absolute inset-4 border border-amber-700/10 rounded" />
                  <div className="text-center text-stone-400 font-playfair italic text-xl opacity-30">
                    . . .
                  </div>
                </div>
              </div>
              {/* BACK of flipping page (content after flip) */}
              <div
                style={{
                  ...styles.pageBack,
                  zIndex: 1,
                }}
              >
                {currentPage <= totalPages && currentPage > 0 ? (
                  <div className="w-full h-full paper-texture-left flex flex-col spine-shadow relative">
                    <div className="absolute inset-4 border border-amber-700/10 rounded" />
                    {/* Image */}
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={`/books/${bookSlug}/images/${book.pages[currentPage - 1]?.image}`}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                        {/* Image border */}
                        <div className="absolute inset-1 border border-white/20 rounded" />
                      </div>
                    </div>
                    {/* Text */}
                    <div className="px-8 pb-6 text-center">
                      <p className="font-playfair text-xl md:text-2xl text-stone-800 leading-relaxed mb-2">
                        {book.pages[currentPage - 1]?.title_en}
                      </p>
                      <p className="font-playfair italic text-stone-500 text-base leading-relaxed">
                        {book.pages[currentPage - 1]?.title_vi}
                      </p>
                    </div>
                    {/* Page number */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <span className="page-number">{currentPage}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Current visible page (behind the flip) */}
          <div className="absolute inset-0 rounded-[4px_12px_12px_4px] overflow-hidden book-cover-glow">
            {currentPage === 0 ? (
              // ─── COVER ───
              <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 flex flex-col items-center justify-center relative">
                {/* Decorative border */}
                <div className="absolute inset-5 border border-amber-400/20 rounded" />
                <div className="absolute inset-7 border border-amber-400/10 rounded" />

                {/* Corner decorations */}
                <div className="absolute top-8 left-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute top-8 right-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute bottom-8 left-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute bottom-8 right-8 text-amber-500/30 text-3xl">✦</div>

                {/* Cover image */}
                <div className="relative w-72 md:w-96 aspect-[4/3] rounded-lg overflow-hidden shadow-2xl mb-8">
                  <img
                    src={`/books/${bookSlug}/images/${book.pages[0]?.image}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h1 className="font-playfair text-4xl md:text-6xl font-bold text-amber-100 text-center leading-tight mb-2">
                  The Little
                  <br />
                  <span className="text-amber-300">Caterpillar</span>
                </h1>
                <p className="font-playfair italic text-lg md:text-xl text-emerald-200/70 mb-6">
                  Chú Sâu Bướm Nhỏ
                </p>

                {/* Gold divider */}
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-6" />

                {/* Author */}
                <p className="text-sm text-emerald-200/50 tracking-wider uppercase">
                  Story & Illustrations · {book.author}
                </p>
              </div>
            ) : currentPage <= totalPages ? (
              // ─── STORY PAGE ───
              <div className="w-full h-full paper-texture flex flex-col spine-shadow relative">
                <div className="absolute inset-4 border border-amber-700/10 rounded" />

                {/* Image area */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                  <div className="relative w-full max-w-xl aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={`/books/${bookSlug}/images/${book.pages[currentPage - 1]?.image}`}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-1 border border-white/15 rounded" />
                  </div>
                </div>

                {/* Text area */}
                <div className="px-8 md:px-12 pb-8 text-center">
                  <div className="w-16 h-px bg-amber-700/20 mx-auto mb-4" />
                  <p className="font-playfair text-xl md:text-3xl text-stone-800 leading-relaxed mb-3 max-w-3xl mx-auto">
                    {book.pages[currentPage - 1]?.title_en}
                  </p>
                  <p className="font-playfair italic text-stone-500 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
                    {book.pages[currentPage - 1]?.title_vi}
                  </p>
                </div>

                {/* Page number */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="page-number">— {currentPage} —</span>
                </div>
              </div>
            ) : (
              // ─── END PAGE ───
              <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 flex flex-col items-center justify-center relative">
                <div className="absolute inset-5 border border-amber-400/20 rounded" />
                <div className="absolute inset-7 border border-amber-400/10 rounded" />
                <div className="absolute top-8 left-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute top-8 right-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute bottom-8 left-8 text-amber-500/30 text-3xl">✦</div>
                <div className="absolute bottom-8 right-8 text-amber-500/30 text-3xl">✦</div>

                <div className="text-7xl mb-8">🦋</div>
                <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-8" />
                <p className="font-playfair text-2xl md:text-3xl text-amber-100 text-center leading-relaxed max-w-lg mb-4">
                  Even the biggest transformation begins with a tiny step.
                </p>
                <p className="font-playfair italic text-emerald-200/60 text-lg text-center mb-10">
                  Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-8" />
                <p className="text-sm text-emerald-200/40 text-center">
                  {book.title_en} · By {book.author} · © 2026
                </p>

                <div className="mt-10">
                  <Link
                    href="/"
                    className="px-6 py-2 border border-amber-400/30 text-amber-400/70 rounded-full text-sm hover:bg-amber-400/10 hover:text-amber-300 transition-all"
                  >
                    ← Back to Library
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION ─── */}
      {/* Previous button */}
      <button
        onClick={goToPrevPage}
        className={`nav-btn fixed left-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-stone-900/60 backdrop-blur border border-stone-700/40 flex items-center justify-center text-amber-400 ${currentPage <= 0 ? "opacity-0 pointer-events-none" : showUI ? "opacity-100" : "opacity-0"}`}
        aria-label="Previous page"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {/* Next button */}
      <button
        onClick={goToNextPage}
        className={`nav-btn fixed right-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-stone-900/60 backdrop-blur border border-stone-700/40 flex items-center justify-center text-amber-400 ${currentPage >= totalPages + 1 ? "opacity-0 pointer-events-none" : showUI ? "opacity-100" : "opacity-0"}`}
        aria-label="Next page"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {/* ─── PAGE INDICATOR ─── */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-stone-700/30">
          <span className="text-xs text-stone-500 font-nunito">{currentPage === 0 ? "Cover" : `Page ${currentPage}`}</span>
          <span className="text-xs text-stone-600">/</span>
          <span className="text-xs text-stone-500">{currentPage >= totalPages + 1 ? "End" : `${totalPages}`}</span>
        </div>
      </div>
    </div>
  );
}
