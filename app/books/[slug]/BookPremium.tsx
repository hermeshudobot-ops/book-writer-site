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
function CoverPage({ book, slug, audioPlaying, onPlay }: { book: BookData; slug: string; audioPlaying: string | null; onPlay: (lang: string, page: number) => void }) {
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
        <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/80 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.title_vi}
        </p>
        <div className="flex items-center gap-3">
          <AudioButton label="🇬🇧 English" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? onPlay("", 0) : onPlay("en", 1)} />
          <AudioButton label="🇻🇳 Tiếng Việt" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? onPlay("", 0) : onPlay("vi", 1)} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page
// ═══════════════════════════════════════
function StoryPage({ bp, slug, audioPlaying, onPlay }: { bp: BookPage; slug: string; audioPlaying: string | null; onPlay: (lang: string, page: number) => void }) {
  return (
    <div className="w-full h-full relative bg-[#1a1510] overflow-hidden">
      {/* Full-screen image, contained (no stretch, black bars fill sides) */}
      <img src={`/books/${slug}/images/${bp.image}`} alt={`Page ${bp.number}`}
        className="w-full h-full object-contain" />

      {/* Page number badge — top-left corner */}
      <span className="absolute top-3 left-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-black shadow-md"
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        {bp.number}
      </span>

      {/* Text overlay bar — bottom, with gradient backdrop */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-10 pb-4 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Audio buttons */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <AudioButton label="🇬🇧 EN" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? onPlay("", bp.number) : onPlay("en", bp.number)} />
            <AudioButton label="🇻🇳 VI" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? onPlay("", bp.number) : onPlay("vi", bp.number)} />
          </div>
          {/* English text — large, white, bold with text-shadow for readability */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white text-center leading-snug mb-1"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {bp.title_en}
          </p>
          {/* Vietnamese text — slightly smaller, warm amber */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-200/90 text-center leading-snug"
            style={{ fontFamily: "'Nunito', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {bp.title_vi}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// End page
// ═══════════════════════════════════════
function EndPage({ book, audioPlaying, onPlay, totalPages }: { book: BookData; audioPlaying: string | null; onPlay: (lang: string, page: number) => void; totalPages: number }) {
  const last = totalPages;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={`/books/${book.slug}/images/${book.pages[last - 1]?.image}`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-6">{book.end_emoji || "📖"}</div>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center max-w-xl leading-snug mb-3" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {book.description_en || "A story to treasure forever."}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-amber-200/70 text-center max-w-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {book.description_vi}
        </p>
        <div className="flex items-center gap-3 mt-6 mb-8">
          <AudioButton label="🇬🇧 EN" playing={audioPlaying === "en"} onClick={() => audioPlaying === "en" ? onPlay("", last) : onPlay("en", last)} />
          <AudioButton label="🇻🇳 VI" playing={audioPlaying === "vi"} onClick={() => audioPlaying === "vi" ? onPlay("", last) : onPlay("vi", last)} />
        </div>
        <div className="flex items-center gap-3"><div className="w-12 h-px bg-amber-400/40" /><div className="w-12 h-px bg-amber-400/40" /></div>
        <p className="mt-6 text-xs text-white/30" style={{ fontFamily: "'Nunito', sans-serif" }}>{book.title_en} · © 2026</p>
        <Link href="/" className="mt-6 px-5 py-2 border border-white/20 text-white/60 rounded-full text-xs hover:bg-white/10 transition-all">← Back to Library</Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Book page flip reader — CSS 3D transforms
// ═══════════════════════════════════════
export default function BookPremium({ book, bookSlug }: { book: BookData; bookSlug: string }) {
  const totalPages = book.pages.length;
  const [page, setPage] = useState(0);
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [flipProgress, setFlipProgress] = useState(0); // 0-1
  const [uiVisible, setUiVisible] = useState(true);
  const [autoReadMode, setAutoReadMode] = useState(false);
  const [autoReadLang, setAutoReadLang] = useState<"en" | "vi">("vi");
  const uiTimer = useRef<NodeJS.Timeout | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const flipRaf = useRef<number | null>(null);
  const flipStartRef = useRef<number>(0);
  const FLIP_DURATION = 600; // ms

  // Audio
  const [audioPlaying, setAudioPlaying] = useState<"en" | "vi" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoAudioRef = useRef<HTMLAudioElement | null>(null);
  const [autoAudioPlaying, setAutoAudioPlaying] = useState<"en" | "vi" | null>(null);
  const advanceRef = useRef<(() => void) | null>(null);

  const playAudio = useCallback((lang: "en" | "vi", pageNum: number) => {
    if (audioRef.current) audioRef.current.pause();
    setAudioPlaying(lang);
    const audio = new Audio(`/books/${bookSlug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
    audioRef.current = audio;
    audio.play().catch(() => setAudioPlaying(null));
    audio.onended = () => setAudioPlaying(null);
  }, [bookSlug]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setAudioPlaying(null);
  }, []);

  const advancePageFn = useCallback(() => {
    autoTimer.current = setTimeout(() => {
      goToPage(page + 1, "next");
    }, 1200);
  }, [page]);

  const autoPlayAudio = useCallback((lang: "en" | "vi", pageNum: number) => {
    if (autoAudioRef.current) autoAudioRef.current.pause();
    setAutoAudioPlaying(lang);
    const audio = new Audio(`/books/${bookSlug}/audio/page_${String(pageNum).padStart(2, "0")}_${lang}.mp3`);
    autoAudioRef.current = audio;
    audio.play().catch(() => { setAutoAudioPlaying(null); setAutoReadMode(false); });
    audio.onended = () => { setAutoAudioPlaying(null); if (advanceRef.current) advanceRef.current(); };
  }, [bookSlug]);

  advanceRef.current = advancePageFn;

  // Auto-read
  useEffect(() => {
    if (autoReadMode && page > 0 && page <= totalPages) {
      autoPlayAudio(autoReadLang, page);
      return () => { if (autoAudioRef.current) autoAudioRef.current.pause(); };
    }
  }, [page, autoReadMode, autoReadLang, autoPlayAudio]);

  // Page flip animation via requestAnimationFrame
  const goToPage = useCallback((newPage: number, direction: "next" | "prev") => {
    if (newPage < 0 || newPage > totalPages + 1 || flipDir !== null) return;
    if (autoReadMode) {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (autoAudioRef.current) autoAudioRef.current.pause();
    } else stopAudio();

    setFlipDir(direction);
    flipStartRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - flipStartRef.current;
      const progress = Math.min(elapsed / FLIP_DURATION, 1);
      setFlipProgress(progress);

      // At the halfway point, swap to the new page content
      if (progress >= 0.5) {
        setPage(newPage);
      }

      if (progress < 1) {
        flipRaf.current = requestAnimationFrame(animate);
      } else {
        setFlipProgress(0);
        setFlipDir(null);
        flipRaf.current = null;
      }
    };

    flipRaf.current = requestAnimationFrame(animate);
  }, [totalPages, flipDir, autoReadMode, stopAudio]);

  // Cleanup
  useEffect(() => {
    return () => { if (flipRaf.current) cancelAnimationFrame(flipRaf.current); };
  }, []);

  const goNext = useCallback(() => goToPage(page + 1, "next"), [goToPage, page]);
  const goPrev = useCallback(() => goToPage(page - 1, "prev"), [goToPage, page]);

  const toggleAutoRead = useCallback(() => {
    if (autoReadMode) {
      setAutoReadMode(false);
      if (autoAudioRef.current) { autoAudioRef.current.pause(); setAutoAudioPlaying(null); }
      if (autoTimer.current) clearTimeout(autoTimer.current);
    } else {
      stopAudio();
      setAutoReadMode(true);
      if (page === 0) { setPage(1); }
      else if (page > 0 && page <= totalPages) autoPlayAudio(autoReadLang, page);
    }
  }, [autoReadMode, page, autoReadLang, stopAudio, totalPages, autoPlayAudio]);

  const switchAutoLang = useCallback((lang: "en" | "vi") => {
    setAutoReadLang(lang);
    if (page > 0 && page <= totalPages) {
      if (autoAudioRef.current) autoAudioRef.current.pause();
      autoPlayAudio(lang, page);
    }
  }, [page, totalPages, autoPlayAudio]);

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
    return () => { window.removeEventListener("mousemove", reset); window.removeEventListener("touchstart", reset); window.removeEventListener("keydown", reset); if (uiTimer.current) clearTimeout(uiTimer.current); };
  }, [page]);

  // Swipe
  useEffect(() => {
    let sx = 0;
    const onStart = (e: TouchEvent) => { if (e.touches.length === 1) sx = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev(); };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
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

  const currentAudioPlaying = autoReadMode ? autoAudioPlaying : audioPlaying;

  const renderContent = () => {
    if (page === 0) return <CoverPage book={book} slug={bookSlug} audioPlaying={currentAudioPlaying} onPlay={(lang, p) => { if (lang) playAudio(lang as "en" | "vi", p); else stopAudio(); }} />;
    if (page > totalPages) return <EndPage book={book} audioPlaying={currentAudioPlaying} onPlay={(lang, p) => { if (lang) playAudio(lang as "en" | "vi", p); else stopAudio(); }} totalPages={totalPages} />;
    return <StoryPage bp={book.pages[page - 1]} slug={bookSlug} audioPlaying={currentAudioPlaying} onPlay={(lang, p) => { if (lang) playAudio(lang as "en" | "vi", p); else stopAudio(); }} />;
  };

  // Calculate 3D flip transforms
  const isFlipping = flipDir !== null;
  const flipP = flipProgress; // 0-1

  // When flipping: we render TWO page layers
  // - Back layer: the page being flipped away (current content at page)
  //   - But page has already been swapped at progress=0.5, so we need to render the OLD page
  // - Front layer: the page being flipped in
  // Solution: use CSS perspective + rotateY on the flipping layer

  // For forward (next): right page flips leftward, revealing page on left
  // For backward (prev): left page flips rightward

  // Since we swap page content at progress=0.5, we can't easily get the "old" page.
  // Better approach: pre-render both + flip.
  // Simplest correct approach: render content behind + flip curtain in front.

  // The flip curtain approach:
  // - Render current page as background
  // - Render "curtain" div that is the next page, rotating like a page flip
  // - Curtain starts at rotateY(0) and goes to rotateY(-180deg)
  // - Perspective applied to container

  // For the "old page" (behind the curtain), we need to know what it was.
  // Since we already call setPage at progress >= 0.5, the content underneath 
  // is the new page. The curtain is the old page flipping away.

  // Actually, let me rethink. The classic page flip:
  // You're viewing page N. When flipping forward:
  // - A layer showing page N+1 rotates open from right to left
  // - This reveals page N+1 underneath
  // 
  // In our case with the setTimeout setPage trick:
  // - Background starts as page N, updates to N+1 at halfway
  // - The curtain (rotating layer) starts as page N+1, needs to be page N at halfway
  //
  // This is getting overly complex. Let me use a simpler but still beautiful approach:
  // CSS perspective page curtain flip.

  // Page flip via curtain technique:
  // The curtain layer is the PAGE BEING FLIPPED OVER.
  // It starts covering the screen (rotateY 0deg, facing you).
  // It rotates to -180deg (for forward flip) showing its BACK — which is the new page.
  
  // We need TWO renders:
  // 1. The page underneath (what you see after flip completes)
  // 2. The curtain (what you see during the flip, rotating away)
  
  // For forward flip: curtain = OLD page (page N), underneath = NEW page (page N+1)
  // For backward flip: curtain = OLD page (page N), underneath = NEW page (page N-1)

  // Since setPage fires at progress >= 0.5:
  // - progress 0-0.49: content = PAGE N (correct, this is what's behind curtain)
  // - progress 0.5+: content = PAGE N+1 (correct, this is what's revealed)
  // 
  // Curtain: always shows the OLD page. But we can't easily render it with setPage.
  // 
  // Workaround: render the curtain content based on the DIRECTION and PREVIOUS page.
  // Track prevPage separately.
  
  const curtainPage = flipDir === "next" ? page - 1 : page + 1;
  
  const renderCurtainPage = () => {
    // The page that's on the curtain (being flipped away)
    if (curtainPage < 0 || curtainPage > totalPages + 1) return null;
    if (curtainPage === 0) return <CoverPage book={book} slug={bookSlug} audioPlaying={null} onPlay={() => {}} />;
    if (curtainPage > totalPages) return <EndPage book={book} audioPlaying={null} onPlay={() => {}} totalPages={totalPages} />;
    return <StoryPage bp={book.pages[curtainPage - 1]} slug={bookSlug} audioPlaying={null} onPlay={() => {}} />;
  };

  // Easing: ease-in-out
  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const eased = easeInOutCubic(flipP);

  // Curtain rotation:
  // Next: 0 deg → -180 deg (flips from right to left)
  // Prev: 0 deg → +180 deg (flips from left to right)
  const rotation = flipDir === "next" ? -eased * 180 : eased * 180;
  
  // Shadow intensity for depth during flip
  const shadowIntensity = Math.sin(eased * Math.PI) * 0.3;

  return (
    <div className="relative w-full h-screen bg-[#2a2320] overflow-hidden select-none"
      style={{ perspective: "2000px" }}>
      
      {/* Underlying page (what you see after flip or before flip starts) */}
      <div className="w-full h-full"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {renderContent()}
      </div>

      {/* Flip curtain overlay — only visible during flip */}
      {isFlipping && (
        <div
          className="absolute inset-0 origin-left"
          style={{
            transformOrigin: flipDir === "next" ? "left center" : "right center",
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Front of curtain — the page being flipped away (old page) */}
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            {renderCurtainPage()}
          </div>
          {/* Back of curtain — shows when page has rotated past 90deg */}
          <div className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Mirror of the new page — but we just show a paper-colored background 
                or the flipped-page shadow effect */}
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(to right, #e8e4df, #faf8f4)" }}>
              {/* Subtle spine shadow */}
              <div className="absolute inset-y-0 left-0 w-[20%]"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
                }} />
            </div>
          </div>
        </div>
      )}

      {/* Depth shadow during flip */}
      {isFlipping && (
        <div className="absolute inset-0 pointer-events-none z-[9]"
          style={{
            background: `radial-gradient(ellipse at ${flipDir === "next" ? "left" : "right"} center, transparent 60%, rgba(0,0,0,${shadowIntensity * 0.5}) 100%)`,
            transition: "none",
          }} />
      )}

      {/* Top bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 transition-opacity duration-500 ${uiVisible || autoReadMode ? "opacity-100" : "opacity-0"}`}>
        <Link href="/" className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/60 hover:text-white transition-all text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>← Library</Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleAutoRead} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${autoReadMode ? "bg-amber-500 text-white shadow-md shadow-amber-500/25" : "bg-black/40 backdrop-blur-sm text-white/60 hover:text-white"}`} style={{ fontFamily: "'Nunito', sans-serif" }}>
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

      {/* Nav arrows */}
      <button onClick={goPrev}
        className={`fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page <= 0 || (!uiVisible && !isFlipping) ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={goNext}
        className={`fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page >= totalPages + 1 || (!uiVisible && !isFlipping) ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Page indicator */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <span className="text-[10px] text-white/60 font-bold">{page === 0 ? "Cover" : page > totalPages ? "End" : `${page}/${totalPages}`}</span>
          {autoReadMode && <span className="text-[10px] text-amber-400 ml-1">● Auto</span>}
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap');
        body { overflow: hidden; position: fixed; width: 100%; }
      `}</style>
    </div>
  );
}
