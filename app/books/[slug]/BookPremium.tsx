"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

//─────────────────────────────────────────────
// Types
//─────────────────────────────────────────────
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
  page_count: number;
  pages: BookPage[];
}

//─────────────────────────────────────────────
// Page content
//─────────────────────────────────────────────
function CoverPage({ book, slug }: { book: BookData; slug: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 via-stone-900 to-green-950 flex flex-col items-center justify-center relative">
      {/* Decorative border */}
      <div className="absolute inset-4 border border-amber-400/25 rounded-sm" />
      <div className="absolute inset-6 border border-amber-400/10 rounded-sm" />
      {/* Corner ornaments */}
      {["top-6 left-8", "top-6 right-8", "bottom-6 left-8", "bottom-6 right-8"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-amber-500/30 text-2xl font-playfair`}>✦</div>
      ))}
      {/* Cover image */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl shadow-black/50 mb-8 border-2 border-amber-400/20">
        <img
          src={`/books/${slug}/images/${book.pages[0]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      {/* Title */}
      <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 text-center leading-[1.1] mb-2">
        The Little Caterpillar
      </h1>
      <p className="font-playfair italic text-lg md:text-xl text-green-200/70 mb-6">
        Chú Sâu Bướm Nhỏ
      </p>
      {/* Divider */}
      <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4" />
      <p className="text-xs text-green-200/40 tracking-widest uppercase">{book.author}</p>
    </div>
  );
}

function ContentPage({ page, pageNum, slug }: { page: BookPage; pageNum: number; slug: string }) {
  return (
    <div className="w-full h-full bg-[#f5f0e8] flex flex-col relative">
      {/* Faux paper texture */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to right, #ede7db 0%, #f5f0e8 8%, #faf8f2 92%, #ede7db 100%)",
      }} />
      {/* Inner border */}
      <div className="absolute inset-4 border border-stone-300/40 rounded-sm pointer-events-none z-10" />
      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 z-10">
        <div className="relative w-full max-w-2xl aspect-[4/3] rounded shadow-xl overflow-hidden">
          <img
            src={`/books/${slug}/images/${page.image}`}
            alt={`Page ${page.number}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Text */}
      <div className="px-8 md:px-16 pb-8 text-center z-10">
        <div className="w-12 h-px bg-amber-700/30 mx-auto mb-3" />
        <p className="font-playfair text-lg md:text-2xl text-stone-800 leading-relaxed mb-2 max-w-2xl mx-auto">
          {page.title_en}
        </p>
        <p className="font-playfair italic text-stone-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          {page.title_vi}
        </p>
      </div>
      {/* Page number */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
        <span className="text-xs text-stone-400 font-playfair tracking-widest">— {page.number} —</span>
      </div>
    </div>
  );
}

function EndPage({ book }: { book: BookData }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 via-stone-900 to-green-950 flex flex-col items-center justify-center relative">
      <div className="absolute inset-4 border border-amber-400/25 rounded-sm" />
      <div className="absolute inset-6 border border-amber-400/10 rounded-sm" />
      {["top-6 left-8", "top-6 right-8", "bottom-6 left-8", "bottom-6 right-8"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-amber-500/30 text-2xl font-playfair`}>✦</div>
      ))}
      <div className="text-7xl mb-8 z-10">🦋</div>
      <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-8" />
      <p className="font-playfair text-xl md:text-2xl text-amber-100 text-center max-w-md leading-relaxed mx-8 mb-3 z-10">
        Even the biggest transformation begins with a tiny step.
      </p>
      <p className="font-playfair italic text-green-200/50 text-lg text-center mb-10 z-10">
        Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
      </p>
      <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-6" />
      <p className="text-xs text-green-200/40 z-10">{book.title_en} · © 2026</p>
      <Link href="/" className="mt-8 px-5 py-2 border border-amber-400/30 text-amber-400/60 rounded-full text-xs hover:bg-amber-400/10 hover:text-amber-300 transition-all z-10">
        ← Back to Library
      </Link>
    </div>
  );
}

//─────────────────────────────────────────────
// Helper: what content belongs on a given spread
//─────────────────────────────────────────────
// spread -1 = cover (page 0) — front cover displayed
// spread 0  = first content page (page 1)
// spread 1  = second content page (page 2)
// ...
// spread N = last content page (page N)
// spread N+1 = end page
// So we map spread index to book content
function getPageContent(book: BookData, spread: number) {
  const n = book.pages.length;
  if (spread < 0) return { type: "cover" } as const;
  if (spread >= n) return { type: "end" } as const;
  return { type: "content", page: book.pages[spread], pageNum: spread + 1 } as const;
}

//─────────────────────────────────────────────
// Main component
//─────────────────────────────────────────────
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const totalSpreads = totalPages + 2; // cover + pages + end
  // Current spread: 0 = cover, 1 = page 1, 2 = page 2, ... N = page N, N+1 = end
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const flipDir = useRef<"next" | "prev">("next");
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

  // Swipe
  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 60) { dx < 0 ? goNext() : goPrev(); }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  });

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const goNext = useCallback(() => {
    if (flipping || spread >= totalSpreads - 1) return;
    flipDir.current = "next";
    setFlipping(true);
    setSpread((s) => s + 1);
    setTimeout(() => setFlipping(false), 900);
  }, [flipping, spread, totalSpreads]);

  const goPrev = useCallback(() => {
    if (flipping || spread <= 0) return;
    flipDir.current = "prev";
    setFlipping(true);
    setSpread((s) => s - 1);
    setTimeout(() => setFlipping(false), 900);
  }, [flipping, spread]);

  // Progress
  const progress = ((spread + 1) / totalSpreads) * 100;

  return (
    <div className="relative min-h-screen bg-stone-950 overflow-hidden select-none flex items-center justify-center">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 z-[1000] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(217,119,6,0.4)]"
        style={{ width: `${progress}%` }} />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-400/20"
            style={{
              width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
              left: `${(i * 6.9) % 100}%`, top: `${(i * 23 + 5) % 90}%`,
              animation: `float ${6 + (i % 5) * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }} />
        ))}
      </div>

      {/* Library link */}
      {spread === 0 && uiVisible && (
        <div className="absolute top-5 left-5 z-50">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-stone-900/70 backdrop-blur rounded-full border border-stone-700/40 text-stone-500 hover:text-amber-400 transition-all text-sm">
            ← Library
          </Link>
        </div>
      )}

      {/* ─── BOOK CONTAINER ─── */}
      <div className="relative z-10 w-[90%] max-w-[1100px] aspect-[1.7/1] perspective-book">
        {/* Spine shadow */}
        <div className="absolute inset-0 rounded-r-xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]" />

        {/* Static BACK page (always visible behind flip) */}
        <div className="absolute inset-0 rounded-r-xl overflow-hidden">
          <BackSlot book={book} slug={bookSlug} spread={spread} />
        </div>

        {/* ─── FRONT FLIPPING PAGE ─── */}
        <div
          className="absolute inset-0 z-20 rounded-r-xl overflow-hidden origin-left preserve-3d"
          style={{
            transform: spread > 0 ? "rotateY(-180deg)" : "rotateY(0deg)",
            transition: "transform 0.9s cubic-bezier(0.645,0.045,0.355,1)",
          }}
        >
          {/* FRONT face — shown BEFORE flip (current page) */}
          <div className="absolute inset-0 backface-hidden">
            <BackSlot book={book} slug={bookSlug} spread={spread - 1 < 0 ? 0 : spread} />
          </div>
          {/* BACK face — shown AFTER flip (next page) */}
          <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg)" }}>
            <BackSlot book={book} slug={bookSlug} spread={spread} />
          </div>
        </div>
      </div>

      {/* ─── NAV BUTTONS ─── */}
      <button onClick={goPrev}
        className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-stone-900/60 backdrop-blur border border-stone-700/40 flex items-center justify-center text-amber-400 transition-all duration-500 ${spread <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-amber-400/10 hover:border-amber-400/30 hover:scale-110`}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={goNext}
        className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-stone-900/60 backdrop-blur border border-stone-700/40 flex items-center justify-center text-amber-400 transition-all duration-500 ${spread >= totalSpreads - 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-amber-400/10 hover:border-amber-400/30 hover:scale-110`}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* ─── PAGE DOTS ─── */}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 transition-all duration-700 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        {Array.from({ length: totalSpreads }).map((_, i) => (
          <button key={i} onClick={() => { setSpread(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === spread ? "bg-amber-400 w-5" : "bg-stone-700 hover:bg-stone-500"}`}
            aria-label={`Go to ${i === 0 ? "cover" : i === totalSpreads - 1 ? "end" : `page ${i}`}`}
          />
        ))}
      </div>
    </div>
  );
}

// Helper component to render the page content
function BackSlot({ book, slug, spread }: { book: BookData; slug: string; spread: number }) {
  const content = getPageContent(book, spread);
  if (content.type === "cover") return <CoverPage book={book} slug={slug} />;
  if (content.type === "end") return <EndPage book={book} />;
  return <ContentPage page={content.page} pageNum={content.pageNum} slug={slug} />;
}
