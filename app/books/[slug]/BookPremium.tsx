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
}

// ═══════════════════════════════════════
// Audio player with auto-read support
// ═══════════════════════════════════════
function useAudio(slug: string, onEnded?: () => void) {
  const [playing, setPlaying] = useState<"en" | "vi" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndRef = useRef<(() => void) | null>(null);

  const play = useCallback(
    (lang: "en" | "vi", pageNum: number) => {
      if (audioRef.current) audioRef.current.pause();
      if (onEnded) onEndRef.current = onEnded;
      setPlaying(lang);
      const audio = new Audio(`/books/${slug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
      audioRef.current = audio;
      audio.play().catch(() => setPlaying(null));
      audio.onended = () => {
        setPlaying(null);
        if (onEndRef.current) onEndRef.current();
      };
    },
    [slug, onEnded]
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(null);
    onEndRef.current = null;
  }, []);

  const playAuto = useCallback(
    (lang: "en" | "vi", pageNum: number, onEnd: () => void) => {
      if (audioRef.current) audioRef.current.pause();
      onEndRef.current = onEnd;
      setPlaying(lang);
      const audio = new Audio(`/books/${slug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
      audioRef.current = audio;
      audio.play().catch(() => setPlaying(null));
      audio.onended = () => {
        setPlaying(null);
        if (onEndRef.current) onEndRef.current();
      };
    },
    [slug]
  );

  useEffect(() => () => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  return { playing, play, stop, playAuto };
}

// ═══════════════════════════════════════
// SVG Icon components
// ═══════════════════════════════════════
function PlayIcon() {
  return <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l10 6-10 6V4z" /></svg>;
}

function PauseIcon() {
  return <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" /></svg>;
}

function AutoPlayIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 3l14 9-14 9V3z" fill={active ? "currentColor" : "none"} />
      <rect x="19" y="6" width="3" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

function AudioButton({ label, playing, onClick }: { label: string; playing: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 select-none ${
        playing
          ? "bg-amber-400 text-white scale-105 shadow-lg shadow-amber-400/30"
          : "bg-white/90 text-stone-600 hover:bg-amber-100 hover:text-amber-700 border border-stone-200"
      }`}
      style={{ fontFamily: "'Nunito', sans-serif", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
      <span>{label}</span>
    </button>
  );
}

// ═══════════════════════════════════════
// Cover page
// ═══════════════════════════════════════
function CoverPage({ book, slug, audio, audioPlaying }: { book: BookData; slug: string; audio: ReturnType<typeof useAudio>; audioPlaying: string | null }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={`/books/${slug}/images/${book.pages[0]?.image}`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/70" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pb-20">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white text-center leading-[0.9] mb-3 tracking-tight drop-shadow-lg"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}
        >
          {book.title_en}
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/80 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_vi}
        </p>
        <div className="flex items-center gap-3">
          <AudioButton label="🇬🇧 English" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", 1)} />
          <AudioButton label="🇻🇳 Tiếng Việt" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", 1)} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page
// ═══════════════════════════════════════
function StoryPage({ bp, slug, audio, audioPlaying, pageNum }: { bp: BookPage; slug: string; audio: ReturnType<typeof useAudio>; audioPlaying: string | null; pageNum: number }) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="w-full flex-[3] relative overflow-hidden">
        <img src={`/books/${slug}/images/${bp.image}`} alt={`Page ${bp.number}`} className="w-full h-full object-cover" />
      </div>
      <div className="flex-[2] flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 pb-6 relative">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {bp.number}
        </span>
        <div className="my-3">
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
            <rect x="0" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5" />
            <circle cx="20" cy="4" r="3" fill="#f59e0b" opacity="0.4" />
            <rect x="28" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5" />
          </svg>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <AudioButton label="🇬🇧 EN" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", pageNum)} />
          <AudioButton label="🇻🇳 VI" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", pageNum)} />
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-stone-800 leading-snug mb-3 px-2" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {bp.title_en}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-amber-600 leading-snug px-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {bp.title_vi}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// End page
// ═══════════════════════════════════════
function EndPage({ book, audio, audioPlaying, totalPages }: { book: BookData; audio: ReturnType<typeof useAudio>; audioPlaying: string | null; totalPages: number }) {
  const last = totalPages;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={`/books/${book.slug}/images/${book.pages[last - 1]?.image}`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-6">📖</div>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center max-w-xl leading-snug mb-3" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {book.description_en || "A story to treasure forever."}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-amber-200/70 text-center max-w-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.description_vi}
        </p>
        <div className="flex items-center gap-3 mt-6 mb-8">
          <AudioButton label="🇬🇧 EN" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", last)} />
          <AudioButton label="🇻🇳 VI" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", last)} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-amber-400/40" />
          <div className="w-12 h-px bg-amber-400/40" />
        </div>
        <p className="mt-6 text-xs text-white/30" style={{ fontFamily: "'Nunito', sans-serif" }}>{book.title_en} · © 2026</p>
        <Link href="/" className="mt-6 px-5 py-2 border border-white/20 text-white/60 rounded-full text-xs hover:bg-white/10 transition-all">← Back to Library</Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Main reader
// ═══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const [page, setPage] = useState(0); // 0=cover, 1..N=story, N+1=end
  const [animating, setAnimating] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [autoReadMode, setAutoReadMode] = useState(false);
  const [autoReadLang, setAutoReadLang] = useState<"en" | "vi">("vi");
  const uiTimer = useRef<NodeJS.Timeout | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Auto-read: plays audio → when done → advances page → repeats
  const advancePage = useRef<(() => void) | null>(null);

  const advancePageFn = useCallback(() => {
    autoTimer.current = setTimeout(() => {
      setPage((prev) => {
        if (prev >= totalPages) {
          // End of book
          setAutoReadMode(false);
          return totalPages + 1;
        }
        return prev + 1;
      });
    }, 1200);
  }, [totalPages]);

  // Audio hook — auto-read variant
  const [normalMode, setNormalMode] = useState(false);
  const [normalAudioPlaying, setNormalAudioPlaying] = useState<"en" | "vi" | null>(null);
  const normalAudioRef = useRef<HTMLAudioElement | null>(null);

  const normalPlay = useCallback((lang: "en" | "vi", pageNum: number) => {
    if (normalAudioRef.current) normalAudioRef.current.pause();
    setNormalAudioPlaying(lang);
    const audio = new Audio(`/books/${bookSlug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
    normalAudioRef.current = audio;
    audio.play().catch(() => setNormalAudioPlaying(null));
    audio.onended = () => setNormalAudioPlaying(null);
  }, [bookSlug]);

  const normalStop = useCallback(() => {
    if (normalAudioRef.current) {
      normalAudioRef.current.pause();
      normalAudioRef.current.currentTime = 0;
    }
    setNormalAudioPlaying(null);
  }, []);

  // Auto audio
  const autoAudioRef = useRef<HTMLAudioElement | null>(null);

  const autoPlay = useCallback(
    (lang: "en" | "vi", pageNum: number, onEnd: () => void) => {
      if (autoAudioRef.current) autoAudioRef.current.pause();
      setAutoAudioPlaying(lang);
      const audio = new Audio(`/books/${bookSlug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
      autoAudioRef.current = audio;
      audio.play().catch(() => {
        setAutoAudioPlaying(null);
        setAutoReadMode(false);
      });
      audio.onended = () => {
        setAutoAudioPlaying(null);
        onEnd();
      };
      audio.onerror = () => {
        setAutoAudioPlaying(null);
        setAutoReadMode(false);
      };
    },
    [bookSlug]
  );

  const [autoAudioPlaying, setAutoAudioPlaying] = useState<"en" | "vi" | null>(null);

  // When in auto-read, play audio on page change
  useEffect(() => {
    if (autoReadMode && page > 0 && page <= totalPages) {
      autoPlay(autoReadLang, page, advancePageFn);
      return () => {
        if (autoAudioRef.current) autoAudioRef.current.pause();
        if (autoTimer.current) clearTimeout(autoTimer.current);
      };
    }
  }, [page, autoReadMode, autoReadLang, autoPlay, advancePageFn]);

  // Toggle auto-read
  const toggleAutoRead = useCallback(() => {
    if (autoReadMode) {
      setAutoReadMode(false);
      if (autoAudioRef.current) {
        autoAudioRef.current.pause();
        setAutoAudioPlaying(null);
      }
      if (autoTimer.current) clearTimeout(autoTimer.current);
    } else {
      normalStop();
      setAutoReadMode(true);
      if (page === 0) {
        setPage(1);
      } else if (page > 0 && page <= totalPages) {
        autoPlay(autoReadLang, page, advancePageFn);
      }
    }
  }, [autoReadMode, page, autoReadLang, normalStop, autoPlay, advancePageFn]);

  // Switch language during auto-read
  const switchAutoLang = useCallback((lang: "en" | "vi") => {
    setAutoReadLang(lang);
    if (page > 0 && page <= totalPages) {
      if (autoAudioRef.current) autoAudioRef.current.pause();
      autoPlay(lang, page, advancePageFn);
    }
  }, [page, autoPlay, advancePageFn]);

  // ── Navigate
  const goToPage = useCallback((newPage: number) => {
    if (newPage < 0 || newPage > totalPages + 1 || animating) return;
    if (autoReadMode) {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (autoAudioRef.current) autoAudioRef.current.pause();
      if (newPage > 0 && newPage <= totalPages) {
        autoPlay(autoReadLang, newPage, advancePageFn);
      }
    } else {
      normalStop();
    }
    setAnimating(true);
    setPage(newPage);
    setTimeout(() => setAnimating(false), 400);
  }, [totalPages, animating, autoReadMode, autoReadLang, autoPlay, advancePageFn, normalStop]);

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page]);

  // Auto-hide UI
  useEffect(() => {
    const reset = () => {
      setUiVisible(true);
      if (uiTimer.current) clearTimeout(uiTimer.current);
      uiTimer.current = setTimeout(() => { if (page > 0) setUiVisible(false); }, 5000);
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
  }, [page]);

  // Swipe
  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => { if (e.touches.length === 1) sx = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
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
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "a" || e.key === "A") toggleAutoRead();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleAutoRead]);

  // Wheel
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 1000) return;
      lastWheel = now;
      if (Math.abs(e.deltaY) > 30) e.deltaY > 0 ? goNext() : goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  // Show current playing state
  const currentAudioPlaying = autoReadMode ? autoAudioPlaying : normalAudioPlaying;

  // Content renderer
  const renderContent = () => {
    if (page === 0) return <CoverPage book={book} slug={bookSlug} audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop }} audioPlaying={currentAudioPlaying} />;
    if (page > totalPages) return <EndPage book={book} audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop }} audioPlaying={currentAudioPlaying} totalPages={totalPages} />;
    return (
      <StoryPage
        bp={book.pages[page - 1]}
        slug={bookSlug}
        audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop }}
        audioPlaying={currentAudioPlaying}
        pageNum={page}
      />
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Book */}
      <div className="w-full h-full overflow-hidden" style={{ opacity: animating ? 0 : 1 }}>
        {renderContent()}
      </div>

      {/* Top bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${uiVisible || autoReadMode ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
          ← Library
        </Link>
        <div className="flex items-center gap-2">
          {/* Auto-read toggle */}
          <button
            onClick={toggleAutoRead}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              autoReadMode
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "bg-black/40 backdrop-blur-sm text-white/60 hover:text-white"
            }`}
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <AutoPlayIcon active={autoReadMode} />
            <span>{autoReadMode ? "Reading…" : "Auto-Read"}</span>
          </button>
          {/* Language selector — visible in auto-read */}
          {autoReadMode && (
            <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
              <button onClick={() => switchAutoLang("en")} className={`px-2 py-1 text-[10px] font-bold transition-colors ${autoReadLang === "en" ? "bg-amber-500 text-white" : "text-white/60 hover:text-white"}`}>EN</button>
              <button onClick={() => switchAutoLang("vi")} className={`px-2 py-1 text-[10px] font-bold transition-colors ${autoReadLang === "vi" ? "bg-amber-500 text-white" : "text-white/60 hover:text-white"}`}>VI</button>
            </div>
          )}
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={goPrev}
        className={`fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={goNext}
        className={`fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page >= totalPages + 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Page indicator */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <span className="text-[10px] text-white/60 font-bold">
            {page === 0 ? "Cover" : page > totalPages ? "End" : page}
          </span>
          <span className="text-[10px] text-white/30">/</span>
          <span className="text-[10px] text-white/40">{totalPages}</span>
          {autoReadMode && <span className="text-[10px] text-amber-400 ml-1">● Auto</span>}
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');

        body { overflow: hidden; position: fixed; width: 100%; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
        }
      `}</style>
    </div>
  );
}
