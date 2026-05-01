"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
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
  description?: string;
  pages: BookPage[];
  page_count: number;
}

// ═══════════════════════════════════════
// Page components
// ═══════════════════════════════════════

function CoverPage({ book, slug }: { book: BookData; slug: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-green-950 via-neutral-900 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201,168,76,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(34,139,34,0.2) 0%, transparent 50%)`
      }} />

      {/* Cover content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        {/* Cover image — elegant frame */}
        <div className="relative mb-8 md:mb-10">
          <div className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-amber-800/40 shadow-2xl">
            <img
              src={`/books/${slug}/images/${book.pages[0]?.image}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle glow behind image */}
          <div className="absolute inset-0 rounded-full bg-amber-400/5 blur-2xl -z-10" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-amber-50 text-center leading-tight mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Little
          <br />
          <span className="text-amber-300">Caterpillar</span>
        </h1>

        <p className="font-serif italic text-lg md:text-xl lg:text-2xl text-green-200/50 mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Chú Sâu Bướm Nhỏ
        </p>

        {/* Elegant divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
          <span className="text-amber-800 text-xs">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        {/* Author */}
        <p className="text-xs md:text-sm text-green-200/30 tracking-[0.3em] uppercase" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Story & Illustrations by {book.author}
        </p>
      </div>
    </div>
  );
}

function StoryPage({ page, slug }: { page: BookPage; slug: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#faf8f3]">
      {/* Top margin area */}
      <div className="h-[8%]" />

      {/* Image — centered, elegant frame */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16">
        <div className="relative w-full max-w-2xl aspect-[4/3] bg-white shadow-xl rounded-sm overflow-hidden">
          {/* White border frame */}
          <div className="absolute inset-[8px] border border-amber-200/30 rounded-sm z-10 pointer-events-none" />
          <img
            src={`/books/${slug}/images/${page.image}`}
            alt={`Page ${page.number}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 lg:px-24 pb-6">
        <div className="max-w-2xl w-full text-center">
          {/* Small decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-amber-400/40" />
          </div>

          {/* English */}
          <p className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-800 leading-relaxed mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {page.title_en}
          </p>

          {/* Vietnamese — clearly visible */}
          <p className="font-serif text-base sm:text-lg md:text-xl text-neutral-500 italic leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {page.title_vi}
          </p>
        </div>
      </div>

      {/* Bottom margin + page number */}
      <div className="h-[4%] flex items-center justify-center">
        <span className="text-[10px] text-neutral-400 tracking-[0.25em] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {page.number}
        </span>
      </div>
    </div>
  );
}

function EndPage({ book }: { book: BookData }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-green-950 via-neutral-900 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201,168,76,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(34,139,34,0.2) 0%, transparent 50%)`
      }} />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        {/* Butterfly */}
        <div className="text-6xl md:text-8xl mb-8">🦋</div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
          <span className="text-amber-800 text-xs">✦</span>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        {/* Final quote */}
        <p className="font-serif text-lg md:text-xl lg:text-2xl text-amber-50 text-center max-w-lg leading-relaxed mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Even the biggest transformation begins with a tiny step.
        </p>
        <p className="font-serif text-sm md:text-base lg:text-lg text-green-200/40 italic mb-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        <p className="text-xs text-green-200/25" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en} · {book.title_vi} · © 2026
        </p>

        {/* Back to library */}
        <Link href="/" className="mt-10 px-6 py-2.5 border border-amber-700/30 text-amber-400/60 rounded-full text-xs hover:bg-amber-400/10 hover:text-amber-300 transition-all duration-300">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main reader component
// ═══════════════════════════════════════

export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  // Page index: 0 = cover, 1..N = story pages, N+1 = end
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [uiVisible, setUiVisible] = useState(true);
  const uiTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI
  useEffect(() => {
    const reset = () => {
      setUiVisible(true);
      if (uiTimer.current) clearTimeout(uiTimer.current);
      uiTimer.current = setTimeout(() => setUiVisible(false), 5000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("touchstart", reset);
    window.addEventListener("keydown", reset);
    reset();
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("keydown", reset);
      if (uiTimer.current) clearTimeout(uiTimer.current);
    };
  }, []);

  // Page change handler (prevents double-click)
  const goToPage = useCallback((newPage: number) => {
    if (animating || newPage < 0 || newPage > totalPages + 1) return;
    setAnimDir(newPage > page ? "forward" : "back");
    setAnimating(true);
    setPage(newPage);
    // Animation length: 600ms
    setTimeout(() => setAnimating(false), 650);
  }, [page, totalPages, animating]);

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page]);

  // Swipe support
  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 1) sx = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) {
        dx < 0 ? goNext() : goPrev();
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault(); goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault(); goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Mouse wheel (throttled)
  useEffect(() => {
    let wheelTimer = 0;
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 1200) return; // Cool down
      lastWheel = now;
      if (Math.abs(e.deltaY) > 30) {
        e.deltaY > 0 ? goNext() : goPrev();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  const progress = ((page + 1) / (totalPages + 2)) * 100;

  // Determine current content
  const currentContent = () => {
    if (page === 0) return <CoverPage book={book} slug={bookSlug} />;
    if (page > totalPages) return <EndPage book={book} />;
    return <StoryPage page={book.pages[page - 1]} slug={bookSlug} />;
  };

  // Next content (shown after transition)
  const nextContent = () => {
    if (animDir === "forward") {
      if (page + 1 === 0) return <CoverPage book={book} slug={bookSlug} />;
      if (page + 1 > totalPages) return <EndPage book={book} />;
      return <StoryPage page={book.pages[page]} slug={bookSlug} />;
    } else {
      if (page - 1 === 0) return <CoverPage book={book} slug={bookSlug} />;
      if (page - 1 > totalPages) return <EndPage book={book} />;
      return <StoryPage page={book.pages[page - 2]} slug={bookSlug} />;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden select-none">
      {/* ─── Ambient particles ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-400/10"
            style={{
              width: 3, height: 3,
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 21 + 5) % 90}%`,
              animation: `float ${5 + (i % 5) * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }} />
        ))}
      </div>

      {/* ─── Top bar ─── */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 transition-opacity duration-700 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900/70 backdrop-blur-md rounded-full border border-neutral-700/30 text-neutral-500 hover:text-amber-400 transition-all text-xs">
          ← Library
        </Link>
        <div className="text-xs text-neutral-600" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en}
        </div>
      </div>

      {/* ─── Main book area ─── */}
      <div className="relative z-10 w-[88%] md:w-[80%] lg:w-[70%] max-w-[1200px]" style={{ aspectRatio: "1 / 1.35" }}>
        {/* Page transition overlay */}
        {animating && (
          <div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: animDir === "forward"
                ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.4) 20%, transparent 80%, transparent)"
                : "linear-gradient(270deg, transparent, rgba(0,0,0,0.4) 20%, transparent 80%, transparent)",
              animation: `sweep 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}
          />
        )}

        {/* The book page */}
        <div className="relative w-full h-full overflow-hidden rounded-sm shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(0,0,0,0.3)]">
          {currentContent()}
        </div>
      </div>

      {/* ─── Nav: prev ─── */}
      <button onClick={goPrev}
        className={`fixed left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/20 flex items-center justify-center text-neutral-500 transition-all duration-700 ${page <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-amber-400/10 hover:border-amber-600/30 hover:text-amber-400 hover:scale-110`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* ─── Nav: next ─── */}
      <button onClick={goNext}
        className={`fixed right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/20 flex items-center justify-center text-neutral-500 transition-all duration-700 ${page >= totalPages + 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-amber-400/10 hover:border-amber-600/30 hover:text-amber-400 hover:scale-110`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* ─── Page progress (bottom) ─── */}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="flex items-center gap-3 bg-neutral-900/60 backdrop-blur-sm px-5 py-2 rounded-full border border-neutral-700/20">
          <span className="text-[11px] text-neutral-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {page === 0 ? "Cover" : page > totalPages ? "End" : `Page ${page} of ${totalPages}`}
          </span>
        </div>
      </div>

      {/* ─── Global styles ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Nunito:wght@300;400;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.05; }
          25% { transform: translateY(-15px) translateX(5px); opacity: 0.2; }
          75% { transform: translateY(10px) translateX(-5px); opacity: 0.1; }
        }

        @keyframes sweep {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(120, 120, 120, 0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(120, 120, 120, 0.5); }
      `}</style>
    </div>
  );
}
