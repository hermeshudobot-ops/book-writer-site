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
// Cover page
// ═══════════════════════════════════════
function CoverPage({ book, slug }: { book: BookData; slug: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`/books/${slug}/images/${book.pages[0]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </div>
      {/* Title */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white text-center leading-[0.9] mb-3 tracking-tight drop-shadow-lg" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>
          The Little<br />
          <span className="text-amber-300">Caterpillar</span>
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/80" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Chú Sâu Bướm Nhỏ
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page — full width image, big text right below
// ═══════════════════════════════════════
function StoryPage({ page, slug }: { page: BookPage; slug: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* ═══ IMAGE: full width, takes ~55% of page ═══ */}
      <div className="w-full flex-[3] relative overflow-hidden">
        <img
          src={`/books/${slug}/images/${page.image}`}
          alt={`Page ${page.number}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ═══ TEXT: right below image, big kid-friendly font ═══ */}
      <div className="flex-[2] flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 pb-6 relative">
        {/* Page number — cute badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {page.number}
          </span>
        </div>

        {/* Small divider */}
        <div className="mt-6 mb-4">
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
            <rect x="0" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
            <circle cx="20" cy="4" r="3" fill="#f59e0b" opacity="0.4"/>
            <rect x="28" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
          </svg>
        </div>

        {/* English — BIG, bold, colorful for kids */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-stone-800 leading-snug mb-3 px-2" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {page.title_en}
        </p>

        {/* Vietnamese — big, clear, warm color */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-amber-600 leading-snug px-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {page.title_vi}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// End page
// ═══════════════════════════════════════
function EndPage({ book }: { book: BookData }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={`/books/${book.slug}/images/${book.pages[book.pages.length - 1]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-6">🦋</div>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center max-w-xl leading-snug mb-3 font-black" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          Even the biggest transformation begins with a tiny step.
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-amber-200/70 text-center max-w-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-12 h-px bg-amber-400/40" />
          <div className="w-12 h-px bg-amber-400/40" />
        </div>
        <p className="mt-6 text-xs text-white/30" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en} · © 2026
        </p>
        <Link href="/" className="mt-6 px-5 py-2 border border-white/20 text-white/60 rounded-full text-xs hover:bg-white/10 transition-all">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main reader
// ═══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const uiTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI
  useEffect(() => {
    const reset = () => {
      setUiVisible(true);
      if (uiTimer.current) clearTimeout(uiTimer.current);
      uiTimer.current = setTimeout(() => setUiVisible(false), 4000);
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

  const goToPage = useCallback((newPage: number) => {
    if (animating || newPage < 0 || newPage > totalPages + 1) return;
    setAnimating(true);
    setPage(newPage);
    setTimeout(() => setAnimating(false), 400);
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

  // Wheel
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 1000) return;
      lastWheel = now;
      if (Math.abs(e.deltaY) > 30) { e.deltaY > 0 ? goNext() : goPrev(); }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  const currentContent = () => {
    if (page === 0) return <CoverPage book={book} slug={bookSlug} />;
    if (page > totalPages) return <EndPage book={book} />;
    return <StoryPage page={book.pages[page - 1]} slug={bookSlug} />;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* ═══ BOOK — fills entire viewport ═══ */}
      <div
        className="w-full h-full overflow-hidden transition-opacity duration-400"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {currentContent()}
      </div>

      {/* ═══ Top bar ═══ */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
          ← Library
        </Link>
        <div className="text-xs text-white/40" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en}
        </div>
      </div>

      {/* ═══ Nav arrows ═══ */}
      <button onClick={goPrev}
        className={`fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 transition-all duration-500 ${page <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white/10 hover:text-white`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={goNext}
        className={`fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 transition-all duration-500 ${page >= totalPages + 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white/10 hover:text-white`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* ═══ Page indicator ═══ */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <span className="text-[10px] text-white/60 font-bold">
            {page === 0 ? "Cover" : page > totalPages ? "End" : page}
          </span>
          <span className="text-[10px] text-white/30">/</span>
          <span className="text-[10px] text-white/40">{totalPages}</span>
        </div>
      </div>

      {/* ═══ Global styles ═══ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Prevent overscroll on mobile */
        body { overflow: hidden; position: fixed; width: 100%; }
      `}</style>
    </div>
  );
}
