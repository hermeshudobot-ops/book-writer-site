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
  description_en?: string;
  description_vi?: string;
  pages: BookPage[];
  page_count: number;
  end_emoji?: string;
}

// ═══════════════════════════════════════
// SVG Icons
// ═══════════════════════════════════════
function SpeakerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

// ═══════════════════════════════════════
// Cover page — language selection
// ═══════════════════════════════════════
function CoverPage({
  book, slug, language, onChooseLang, onStartReading
}: {
  book: BookData; slug: string; language: "en" | "vi" | null;
  onChooseLang: (l: "en" | "vi") => void; onStartReading: () => void
}) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={`/books/${slug}/images/${book.pages[0]?.image}`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/70" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pb-20">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white text-center leading-[0.9] mb-3 tracking-tight drop-shadow-lg"
          style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_en}
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/80 mb-10 text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_vi}
        </p>

        {/* Language choice buttons — big, clear, kid-friendly */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button onClick={() => onChooseLang("vi")}
            className={`flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 rounded-2xl text-xl sm:text-2xl font-bold transition-all shadow-xl ${
              language === "vi"
                ? "bg-amber-500 text-white scale-105 shadow-amber-500/40"
                : "bg-white/90 text-stone-700 hover:bg-white hover:scale-105"
            }`}
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            <span className="text-3xl">🇻🇳</span>
            <span>Tiếng Việt</span>
          </button>
          <button onClick={() => onChooseLang("en")}
            className={`flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 rounded-2xl text-xl sm:text-2xl font-bold transition-all shadow-xl ${
              language === "en"
                ? "bg-amber-500 text-white scale-105 shadow-amber-500/40"
                : "bg-white/90 text-stone-700 hover:bg-white hover:scale-105"
            }`}
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            <span className="text-3xl">🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        {/* Selected language hint */}
        {language && (
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-white/50 transition-all" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {language === "vi" ? "Nghe và đọc bằng tiếng Việt" : "Listen and read in English"}
            </p>
            <button onClick={onStartReading}
              className="px-8 py-3 bg-amber-500/90 hover:bg-amber-400 text-white text-lg font-bold rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 animate-pulse"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              {language === "vi" ? "▶ Bắt đầu đọc" : "▶ Start Reading"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page — shows only selected language
// ═══════════════════════════════════════
function StoryPage({
  bp, slug, isPlaying, language
}: {
  bp: BookPage; slug: string; isPlaying: boolean; language: "en" | "vi"
}) {
  return (
    <div className="w-full h-full relative bg-[#1a1510] overflow-hidden">
      <img src={`/books/${slug}/images/${bp.image}`} alt={`Page ${bp.number}`}
        className="w-full h-full object-contain" />
      <span className="absolute top-3 left-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-black shadow-md"
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        {bp.number}
      </span>
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/90 text-white animate-pulse">
          <SpeakerIcon size={14} />
          <span className="text-[10px] font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {language === "vi" ? "Đang đọc" : "Reading"}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-8 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center pb-4">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white text-center leading-snug"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {language === "en" ? bp.title_en : bp.title_vi}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// End page — shows only selected language
// ═══════════════════════════════════════
function EndPage({ book, isPlaying, language }: { book: BookData; isPlaying: boolean; language: "en" | "vi" }) {
  const last = book.pages.length;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={`/books/${book.slug}/images/${book.pages[last - 1]?.image}`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-6">{book.end_emoji || "📖"}</div>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center max-w-xl leading-snug mb-3" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {language === "en" ? (book.description_en || "A story to treasure forever.") : (book.description_vi || "Một câu chuyện đáng nhớ mãi.")}
        </p>
        <div className="flex items-center gap-3 mt-4 mb-6"><div className="w-12 h-px bg-amber-400/40" /><div className="w-12 h-px bg-amber-400/40" /></div>
        <p className="text-xs text-white/30" style={{ fontFamily: "'Nunito', sans-serif" }}>{book.title_en} · © 2026</p>
        <Link href="/" className="mt-6 px-5 py-2 border border-white/20 text-white/60 rounded-full text-xs hover:bg-white/10 transition-all">← Library</Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Render content for a page number
// ═══════════════════════════════════════
function renderPageContent(
  pg: number, total: number, book: BookData, slug: string, playing: boolean,
  chosenLang: "en" | "vi" | null,
  onChooseLang: (l: "en" | "vi") => void, onStartReading: () => void
) {
  if (pg === 0) return <CoverPage book={book} slug={slug} language={chosenLang} onChooseLang={onChooseLang} onStartReading={onStartReading} />;
  if (pg > total) return <EndPage book={book} isPlaying={playing} language={chosenLang || "vi"} />;
  return <StoryPage bp={book.pages[pg - 1]} slug={slug} isPlaying={playing} language={chosenLang || "vi"} />;
}

const FLIP_DURATION = 800;

// ═══════════════════════════════════════
// MAIN: Kid-friendly reader
// ═══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;

  // Core state
  const [page, setPage] = useState(0);
  // "en" or "vi" — chosen on cover, used for text + audio throughout
  // On cover we use null (not chosen yet), tracked separately
  const [chosenLang, setChosenLang] = useState<"en" | "vi" | null>(null);
  const lang = chosenLang || "vi"; // default fallback

  // Flip animation
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [flipNewPage, setFlipNewPage] = useState<number | null>(null);

  // Audio — auto-play on page change when language is chosen
  const [audioActive, setAudioActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flipTimerRef = useRef<number | null>(null);
  const autoAdvanceRef = useRef<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // UI
  const [showUI, setShowUI] = useState(true);
  const uiTimer = useRef<NodeJS.Timeout | null>(null);

  // Play audio for a given page
  const playAudio = useCallback((pg: number, language: "en" | "vi", autoNext = false) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audioNum = pg <= totalPages && pg > 0 ? pg : 1;
    const src = `/books/${bookSlug}/audio/page_${String(audioNum).padStart(2, "0")}_${language}.mp3`;
    const audio = new Audio(src);
    setAudioActive(true);

    audio.onended = () => {
      setAudioActive(false);
      audioRef.current = null;
      if (autoNext && pg < totalPages) {
        autoAdvanceRef.current = window.setTimeout(() => {
          goToPage(pg + 1, "next");
        }, 1500);
      }
    };
    audio.onerror = () => {
      setAudioActive(false);
      audioRef.current = null;
      if (autoNext && pg < totalPages) {
        autoAdvanceRef.current = window.setTimeout(() => {
          goToPage(pg + 1, "next");
        }, 1500);
      }
    };

    audioRef.current = audio;
    audio.play().catch(() => setAudioActive(false));
  }, [bookSlug, totalPages]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null; }
    setAudioActive(false);
  }, []);

  // Navigate with page flip + auto-play audio
  const goToPage = useCallback((newPage: number, direction: "next" | "prev") => {
    if (newPage < 0 || newPage > totalPages + 1 || flipDir !== null) return;
    stopAudio();
    if (autoAdvanceRef.current !== null) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null; }

    setFlipNewPage(newPage);
    setFlipDir(direction);

    const timer = window.setTimeout(() => {
      setPage(newPage);
      // Auto-play audio when reading (not on cover)
      if (newPage > 0 && newPage <= totalPages && chosenLang) {
        playAudio(newPage, chosenLang, autoAdvance);
      }
      setFlipNewPage(null);
      setFlipDir(null);
    }, FLIP_DURATION + 50);

    flipTimerRef.current = timer;
  }, [totalPages, flipDir, stopAudio, chosenLang, autoAdvance, playAudio]);

  // Language chosen on cover → start reading
  const handleChooseLang = useCallback((l: "en" | "vi") => {
    setChosenLang(l);
  }, []);

  const handleStartReading = useCallback(() => {
    if (chosenLang) {
      goToPage(1, "next");
    }
  }, [chosenLang, goToPage]);

  // Tap zones
  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (flipDir !== null) return;

    // On cover page: tap starts reading if language chosen
    if (page === 0) {
      if (chosenLang) {
        handleStartReading();
      }
      return;
    }

    const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const width = window.innerWidth;
    const tapRatio = clientX / width;

    // Left 20% = go back
    if (tapRatio < 0.20) {
      if (page === 1) {
        // Back to cover from page 1
        setPage(0);
      } else {
        goToPage(page - 1, "prev");
      }
      return;
    }
    // Right 20% = go forward
    if (tapRatio > 0.80) {
      goToPage(page + 1, "next");
      return;
    }
    // Center: replay audio for current page
    if (page > 0 && page <= totalPages) {
      playAudio(page, chosenLang || "vi", false);
    }
  }, [flipDir, page, totalPages, chosenLang, goToPage, playAudio, handleStartReading]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goToPage(page + 1, "next"); }
      if (e.key === "ArrowLeft") { e.preventDefault(); page === 1 ? setPage(0) : goToPage(page - 1, "prev"); }
      if (e.key === "l" || e.key === "L") { setChosenLang(l => l === "en" ? "vi" : "en"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPage, page]);

  // Auto-hide UI — only when reading (not on cover)
  useEffect(() => {
    if (page === 0) { setShowUI(true); return; }
    const reset = () => {
      setShowUI(true);
      if (uiTimer.current) clearTimeout(uiTimer.current);
      uiTimer.current = setTimeout(() => setShowUI(false), 4000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("touchstart", reset);
    reset();
    return () => { window.removeEventListener("mousemove", reset); window.removeEventListener("touchstart", reset); if (uiTimer.current) clearTimeout(uiTimer.current); };
  }, [page]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      stopAudio();
    };
  }, [stopAudio]);

  // Page indicator label
  const pageLabel = (p: number) => {
    if (p === 0) return chosenLang === "en" ? "Cover" : "Bìa";
    if (p > totalPages) return chosenLang === "en" ? "End" : "Hết";
    return `${p}/${totalPages}`;
  };

  const bgPage = flipNewPage !== null ? flipNewPage : page;
  const isFlipping = flipDir !== null;

  // Top bar — only show when reading
  const isReading = page > 0;
  const langLabel = lang === "en" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt";

  return (
    <div className="relative w-full h-screen bg-[#2a2320] overflow-hidden select-none">

      {/* Tap zones — full screen */}
      <div className="absolute inset-0 z-40" onClick={handleTap} onTouchEnd={handleTap}
        style={{ touchAction: "manipulation" }}>
        <div className="absolute inset-y-0 left-0 w-[20%] md:w-[15%] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[20%] md:w-[15%] pointer-events-none" />
      </div>

      {/* Background page */}
      <div className="absolute inset-0 pointer-events-none">
        {renderPageContent(bgPage, totalPages, book, bookSlug, audioActive && bgPage === page,
          chosenLang || "vi", handleChooseLang, handleStartReading)}
      </div>

      {/* Flip curtain */}
      {isFlipping && page !== null && (
        <div className="absolute inset-0"
          style={{
            transformOrigin: flipDir === "next" ? "left center" : "right center",
            transform: `perspective(2000px) rotateY(${flipDir === "next" ? -180 : 180}deg)`,
            transition: `transform ${FLIP_DURATION}ms cubic-bezier(0.645, 0.045, 0.355, 1.0)`,
            backfaceVisibility: "hidden", transformStyle: "preserve-3d", zIndex: 10, pointerEvents: "none",
          }}
        >
          {renderPageContent(page, totalPages, book, bookSlug, false, chosenLang || "vi", handleChooseLang, handleStartReading)}
          <div className={`absolute inset-y-0 ${flipDir === "next" ? "left-0" : "right-0"} w-[25%] pointer-events-none`}
            style={{
              background: flipDir === "next"
                ? "linear-gradient(to right, rgba(0,0,0,0.12), transparent)"
                : "linear-gradient(to left, rgba(0,0,0,0.12), transparent)",
            }} />
        </div>
      )}

      {/* Top bar — only when reading */}
      {isReading && (
        <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${showUI ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Link href="/" className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
            ← {chosenLang === "en" ? "Library" : "Thư viện"}
          </Link>
          <div className="flex items-center gap-2">
            {/* Quick language switch */}
            <button onClick={() => setChosenLang(l => l === "en" ? "vi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 backdrop-blur-sm text-amber-300 hover:text-amber-200 transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              {langLabel}
            </button>
            {/* Auto-advance */}
            <button onClick={() => setAutoAdvance(a => !a)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${autoAdvance ? "bg-amber-500 text-white" : "bg-black/40 text-white/60"}`}
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              ⏭ {chosenLang === "en" ? "Auto" : "Tự động"}
            </button>
          </div>
        </div>
      )}

      {/* Back arrow hint on left edge */}
      {isReading && (
        <div className={`absolute left-0 top-0 bottom-0 w-[20%] md:w-[15%] z-30 flex items-center justify-start pl-2 md:pl-3 pointer-events-none transition-opacity duration-500 ${showUI ? "opacity-100" : "opacity-0"}`}>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-white/70">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      )}
      <div className={`absolute right-0 top-0 bottom-0 w-[20%] md:w-[15%] z-30 flex items-center justify-end pr-2 md:pr-3 pointer-events-none transition-opacity duration-500 ${showUI ? "opacity-100" : "opacity-0"}`}>
        {page <= totalPages - 1 && (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-white/70">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
      </div>

      {/* Replay hint */}
      {showUI && isReading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-opacity duration-500 flex items-center gap-2 text-white/20">
          <SpeakerIcon />
          <span className="text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {chosenLang === "en" ? "Tap to replay" : "Chạm để nghe lại"}
          </span>
        </div>
      )}

      {/* Page indicator */}
      {isReading && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <span className="text-[10px] text-white/60 font-bold">{pageLabel(page)}</span>
            {audioActive && <span className="text-[10px] text-amber-400 ml-1 animate-pulse">🔊 {chosenLang === "en" ? "Reading" : "Đang đọc"}</span>}
            {autoAdvance && !audioActive && <span className="text-[10px] text-white/40 ml-1">⏭ {chosenLang === "en" ? "Auto" : "Tự động"}</span>}
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');
        body { overflow: hidden; position: fixed; width: 100%; }
      `}</style>
    </div>
  );
}
