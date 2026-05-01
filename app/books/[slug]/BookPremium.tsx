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
// Cover page — full screen
// ═══════════════════════════════════════
function CoverPage({ book, slug }: { book: BookData; slug: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`/books/${slug}/images/${book.pages[0]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
      </div>

      {/* Cover content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center leading-[0.9] mb-3 drop-shadow-lg">
          The Little
          <br />
          <span className="text-amber-300">Caterpillar</span>
        </h1>
        <p className="font-nunito text-xl md:text-3xl text-amber-100/80 mb-10 tracking-wide">
          Chú Sâu Bướm Nhỏ
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page — full screen, image top, text below
// ═══════════════════════════════════════
function StoryPage({ page, slug }: { page: BookPage; slug: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#f5f0e8] relative">
      {/* Image — full width, takes up most of the screen */}
      <div className="w-full aspect-[16/9] relative">
        <img
          src={`/books/${slug}/images/${page.image}`}
          alt={`Page ${page.number}`}
          className="w-full h-full object-cover"
        />
        {/* Subtle fade into the paper below */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f0e8] to-transparent" />
      </div>

      {/* Text area — directly below image */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 pb-8">
        {/* Page label */}
        <div className="mb-6 md:mb-8">
          <span className="inline-block px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-amber-700/60 border border-amber-400/20 rounded-full" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Page {page.number}
          </span>
        </div>
        
        {/* English text — big, bold, kid-friendly */}
        <p className="text-[clamp(1.3rem, 3.5vw, 2.5rem)] md:text-[clamp(1.5rem, 4vw, 3rem)] lg:text-[clamp(1.8rem, 5vw, 4rem)] font-nunito-bold text-center text-stone-800 leading-snug mb-4 drop-shadow-sm max-w-4xl mx-auto px-2" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {page.title_en}
        </p>
        
        {/* Vietnamese text — big, clear, beautiful */}
        <p className="text-[clamp(1.1rem, 2.5vw, 1.8rem)] md:text-[clamp(1.2rem, 3vw, 2.2rem)] lg:text-[clamp(1.4rem, 4vw, 3rem)] font-nunito text-center text-amber-700/80 leading-snug max-w-4xl mx-auto px-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {page.title_vi}
        </p>

        {/* Decorative divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="w-8 h-[2px] bg-amber-600/20 rounded-full" />
          <div className="w-[3px] h-[3px] bg-amber-600/30 rounded-full" />
          <div className="w-8 h-[2px] bg-amber-600/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// End page — full screen
// ═══════════════════════════════════════
function EndPage({ book }: { book: BookData }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`/books/${book.slug}/images/${book.pages[book.pages.length - 1]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        {/* Butterfly */}
        <div className="text-8xl md:text-9xl mb-8 drop-shadow-lg">🦋</div>
        
        {/* Final quote */}
        <p className="font-nunito-bold text-[clamp(1.2rem, 3vw, 2rem)] md:text-[clamp(1.4rem, 4vw, 2.5rem)] text-white text-center max-w-2xl leading-snug mb-4" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          Even the biggest transformation begins with a tiny step.
        </p>
        <p className="font-nunito text-[clamp(1rem, 2.5vw, 1.6rem)] md:text-[clamp(1.1rem, 3vw, 2rem)] text-amber-200/70 text-center max-w-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
        </p>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        <p className="mt-8 text-xs text-white/30" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en} · {book.title_vi} · © 2026
        </p>

        <Link href="/" className="mt-6 px-6 py-2.5 border border-white/20 text-white/60 rounded-full text-sm hover:bg-white/10 transition-all">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main reader component
// ══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [uiVisible, setUiVisible] = useState(true);
  const uiTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Prevent double-click
  const goToPage = useCallback((newPage: number) => {
    if (animating || newPage < 0 || newPage > totalPages + 1) return;
    setAnimDir(newPage > page ? "forward" : "back");
    setAnimating(true);
    setPage(newPage);
    setTimeout(() => setAnimating(false), 500);
  }, [page, totalPages, animating]);

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page]);

  // Swipe
  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => { if (e.touches.length === 1) sx = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Scroll wheel
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 1200) return;
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

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Background for letterbox */}
      <div className="absolute inset-0 bg-stone-950" />

      {/* Book image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Book container — fills maximum space while maintaining aspect ratio */}
        <div className="relative w-full max-h-screen max-w-[1400px]" style={{ aspectRatio: "1 / 1.45" }}>
          {/* Shadow behind book */}
          <div className="absolute inset-0 bg-black/40 blur-2xl scale-[1.02]" />
          
          {/* The actual book */}
          <div className="relative w-full h-full overflow-hidden shadow-2xl shadow-black/60">
            {currentContent()}
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className={`absolute top-3 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
          ← Library
        </Link>
        <div className="text-xs text-white/40" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en}
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={goPrev}
        className={`fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 transition-all duration-500 ${page <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white/10 hover:border-white/20 hover:text-white`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={goNext}
        className={`fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 transition-all duration-500 ${page >= totalPages + 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white/10 hover:border-white/20 hover:text-white`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Bottom page indicator */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <span className="text-[10px] text-white/50">
            {page === 0 ? "Cover" : page > totalPages ? "End" : `Page ${page}`}
          </span>
          <span className="text-[10px] text-white/30">/</span>
          <span className="text-[10px] text-white/50">
            {page > totalPages ? "End" : `${totalPages}`}
          </span>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
