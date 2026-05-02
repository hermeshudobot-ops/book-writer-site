"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import Link from "next/link";
import HTMLFlipBook from "react-pageflip";

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
// Page renderer for HTMLFlipBook
// ═══════════════════════════════════════
function PageContent({
  pageNum,
  book,
  slug,
  audio,
  audioPlaying,
}: {
  pageNum: number; // 1..N (1-based index into pages)
  book: BookData;
  slug: string;
  audio: ReturnType<typeof useAudio>;
  audioPlaying: string | null;
}) {
  const bp = book.pages[pageNum - 1];
  if (!bp) return null;

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="w-full flex-[3] relative overflow-hidden">
        <img
          src={`/books/${slug}/images/${bp.image}`}
          alt={`Page ${bp.number}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-[2] flex flex-col items-center justify-center px-4 md:px-8 pb-4 relative">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-black">
          {bp.number}
        </span>
        <div className="my-2">
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
            <rect x="0" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5" />
            <circle cx="20" cy="4" r="3" fill="#f59e0b" opacity="0.4" />
            <rect x="28" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <AudioButton label="🇬🇧 EN" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", pageNum)} />
          <AudioButton label="🇻🇳 VI" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", pageNum)} />
        </div>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center text-stone-800 leading-snug mb-2 px-2"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {bp.title_en}
        </p>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center text-amber-600 leading-snug px-2"
          style={{ fontFamily: "'Nunito', sans-serif" }}>
          {bp.title_vi}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Cover page (hard cover, single page)
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white text-center leading-[0.9] mb-3 tracking-tight drop-shadow-lg"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}
        >
          {book.title_en}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-amber-100/80 mb-8" style={{ fontFamily: "'Nunito', sans-serif" }}>
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
        <div className="text-6xl sm:text-7xl md:text-8xl mb-6">{book.end_emoji || "📖"}</div>
        <p className="text-lg sm:text-xl md:text-2xl text-white text-center max-w-xl leading-snug mb-3" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {book.description_en || "A story to treasure forever."}
        </p>
        <p className="text-base sm:text-lg md:text-xl text-amber-200/70 text-center max-w-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
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
// Main reader with page-flip
// ═══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const [currentPage, setCurrentPage] = useState(0); // 0=cover, 1..N=story pages, N+1=end
  const [uiVisible, setUiVisible] = useState(true);
  const [autoReadMode, setAutoReadMode] = useState(false);
  const [autoReadLang, setAutoReadLang] = useState<"en" | "vi">("vi");
  const uiTimer = useRef<NodeJS.Timeout | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const bookRef = useRef<any>(null); // react-pageflip instance ref

  // ── Auto-read: plays audio → when done advances page → repeats
  const [autoAudioPlaying, setAutoAudioPlaying] = useState<"en" | "vi" | null>(null);
  const autoAudioRef = useRef<HTMLAudioElement | null>(null);
  const [normalAudioPlaying, setNormalAudioPlaying] = useState<"en" | "vi" | null>(null);
  const normalAudioRef = useRef<HTMLAudioElement | null>(null);

  const advancePageFn = useCallback(() => {
    autoTimer.current = setTimeout(() => {
      setCurrentPage((prev) => {
        const flipBook = bookRef.current?.pageFlip;
        if (!flipBook) {
          // Fallback: update state for non-flip pages only
          if (prev >= totalPages) {
            setAutoReadMode(false);
            return totalPages + 1;
          }
          return prev + 1;
        }

        // Use pageFlip to flip
        if (prev < totalPages) {
          // Story page: flip to next (1-based: page 0 is cover, pages 1..N are story)
          flipBook.flipNext();
        }
        // Note: pageFlip handles the visual flip, we track state here
        return prev + 1;
      });
    }, 1200);
  }, [totalPages, bookRef]);

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

  // When in auto-read, play audio on page change
  useEffect(() => {
    if (autoReadMode && currentPage > 0 && currentPage <= totalPages) {
      autoPlay(autoReadLang, currentPage, advancePageFn);
      return () => {
        if (autoAudioRef.current) autoAudioRef.current.pause();
        if (autoTimer.current) clearTimeout(autoTimer.current);
      };
    }
  }, [currentPage, autoReadMode, autoReadLang, autoPlay, advancePageFn]);

  // Listen to page-flip change events
  useEffect(() => {
    const flipBook = bookRef.current?.pageFlip;
    if (!flipBook) return;

    const handler = (e: CustomEvent) => {
      const newPage = e.detail; // new page index (0-based from pageFlip)
      // pageFlip pages: 0=cover(first page), 1..pages.length = story pages
      if (newPage !== undefined && newPage !== currentPage) {
        setCurrentPage(newPage);
        // If in auto-read, play audio for the new page
        if (autoReadMode && newPage > 0 && newPage <= totalPages) {
          if (autoTimer.current) clearTimeout(autoTimer.current);
          autoPlay(autoReadLang, newPage, advancePageFn);
        }
      }
    };

    flipBook.on("flip", handler);
    return () => flipBook.off("flip", handler);
  }, [autoReadMode, autoReadLang, autoPlay, advancePageFn, currentPage, totalPages]);

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
      const flipBook = bookRef.current?.pageFlip;
      if (flipBook && currentPage > 0 && currentPage <= totalPages) {
        autoPlay(autoReadLang, currentPage, advancePageFn);
      } else if (flipBook && currentPage === 0) {
        // Start from first story page
        flipBook.flipNext();
        setCurrentPage(1);
      }
    }
  }, [autoReadMode, currentPage, autoReadLang, normalStop, autoPlay, advancePageFn]);

  const switchAutoLang = useCallback((lang: "en" | "vi") => {
    setAutoReadLang(lang);
    if (currentPage > 0 && currentPage <= totalPages) {
      if (autoAudioRef.current) autoAudioRef.current.pause();
      autoPlay(lang, currentPage, advancePageFn);
    }
  }, [currentPage, autoPlay, advancePageFn]);

  // Auto-hide UI
  useEffect(() => {
    const reset = () => {
      setUiVisible(true);
      if (uiTimer.current) clearTimeout(uiTimer.current);
      uiTimer.current = setTimeout(() => { if (currentPage > 0) setUiVisible(false); }, 5000);
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
  }, [currentPage]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        toggleAutoRead();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAutoRead]);

  // Wheel for page flip
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 1000) return;
      lastWheel = now;

      // Disable scrolling on body
      e.preventDefault();

      const flipBook = bookRef.current?.pageFlip;
      if (!flipBook) return;

      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0 && currentPage < totalPages + 1) {
          // Forward
          if (autoReadMode) {
            if (autoTimer.current) clearTimeout(autoTimer.current);
            if (autoAudioRef.current) autoAudioRef.current.pause();
          }
          flipBook.flipNext();
          setCurrentPage((prev) => prev + 1);
        } else if (e.deltaY < 0 && currentPage > 0) {
          // Back
          if (autoReadMode) {
            if (autoTimer.current) clearTimeout(autoTimer.current);
            if (autoAudioRef.current) autoAudioRef.current.pause();
          }
          flipBook.flipPrev();
          setCurrentPage((prev) => prev - 1);
        }
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [currentPage, autoReadMode]);

  const currentAudioPlaying = autoReadMode ? autoAudioPlaying : normalAudioPlaying;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none flex items-center justify-center">
      {/* Book container centered */}
      <div className="relative w-full max-w-5xl h-[90vh] md:h-[80vh]">
        {/* React-pageflip book */}
        <HTMLFlipBook
          ref={(el) => { bookRef.current = el; }}
          width={550}
          height={733}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1333}
          showCover={true}
          flippingTime={800}
          startPage={0}
          drawShadow={true}
          maxShadowOpacity={0.4}
          showPageCorners={true}
          disableFlipByClick={false}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          mobileScrollSupport={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={50}
          className="mx-auto"
          style={{ boxShadow: "0 0 30px rgba(0,0,0,0.4)" }}
        >
          {/* Cover (hard cover - pages 0) */}
          <div className="w-full h-full bg-stone-100">
            <CoverPage book={book} slug={bookSlug} audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop, playAuto: () => {} }} audioPlaying={currentAudioPlaying} />
          </div>

          {/* Story pages */}
          {book.pages.map((page, idx) => (
            <div key={page.number} className="w-full h-full">
              <PageContent
                pageNum={idx + 1}
                book={book}
                slug={bookSlug}
                audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop, playAuto: () => {} }}
                audioPlaying={currentAudioPlaying}
              />
            </div>
          ))}

          {/* End page */}
          <div className="w-full h-full bg-stone-100">
            <EndPage book={book} audio={{ playing: currentAudioPlaying, play: normalPlay, stop: normalStop, playAuto: () => {} }} audioPlaying={currentAudioPlaying} totalPages={totalPages} />
          </div>
        </HTMLFlipBook>
      </div>

      {/* Top bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${uiVisible || autoReadMode ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
          ← Library
        </Link>
        <div className="flex items-center gap-2">
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
          {autoReadMode && (
            <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
              <button onClick={() => switchAutoLang("en")} className={`px-2 py-1 text-[10px] font-bold transition-colors ${autoReadLang === "en" ? "bg-amber-500 text-white" : "text-white/60 hover:text-white"}`}>EN</button>
              <button onClick={() => switchAutoLang("vi")} className={`px-2 py-1 text-[10px] font-bold transition-colors ${autoReadLang === "vi" ? "bg-amber-500 text-white" : "text-white/60 hover:text-white"}`}>VI</button>
            </div>
          )}
        </div>
      </div>

      {/* Page indicator */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <span className="text-[10px] text-white/60 font-bold">
            {currentPage === 0 ? "Cover" : currentPage > totalPages ? "End" : `${currentPage} / ${totalPages}`}
          </span>
          {autoReadMode && <span className="text-[10px] text-amber-400 ml-1">● Auto</span>}
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');

        body { overflow: hidden; position: fixed; width: 100%; height: 100%; }

        /* Page-flip shadow overrides for depth */
        .stf__page {
          box-shadow: 0 0 4px rgba(0,0,0,0.15);
        }

        /* Flip-book container adjustments */
        .stf__block {
          margin: 0 auto;
        }

        /* Remove page borders */
        .stf__page {
          border: none !important;
        }
      `}</style>
    </div>
  );
}
