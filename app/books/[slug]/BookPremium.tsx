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
// Audio player hooks
// ═══════════════════════════════════════
function useAudio(slug: string) {
  const [playing, setPlaying] = useState<"en" | "vi" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((lang: "en" | "vi", pageNum: number) => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(lang);
    const audio = new Audio(`/books/${slug}/audio/page_${String(pageNum).padStart(2, '0')}_${lang}.mp3`);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => setPlaying(null);
  }, [slug]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(null);
  }, []);

  return { playing, play, stop };
}

// ═══════════════════════════════════════
// SVG Icon components
// ═══════════════════════════════════════
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l10 6-10 6V4z" /></svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" /></svg>
  );
}

function AudioButton({ label, langCode, playing, onClick, pageNum }: { label: string; langCode: string; playing: boolean; onClick: () => void; pageNum: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
        playing
          ? "bg-amber-400 text-white scale-105 shadow-lg shadow-amber-400/30"
          : "bg-white/90 text-stone-600 hover:bg-amber-100 hover:text-amber-700 border border-stone-200"
      }`}
      style={{ fontFamily: "'Nunito', sans-serif" }}
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
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white text-center leading-[0.9] mb-3 tracking-tight drop-shadow-lg" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>
          The Little<br />
          <span className="text-amber-300">Caterpillar</span>
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/80 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Chú Sâu Bướm Nhỏ
        </p>
        {/* Audio buttons for cover */}
        <div className="flex items-center gap-3">
          <AudioButton
            label="🇬🇧 English"
            langCode="en"
            playing={audioPlaying === "en"}
            pageNum={1}
            onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", 1)}
          />
          <AudioButton
            label="🇻🇳 Tiếng Việt"
            langCode="vi"
            playing={audioPlaying === "vi"}
            pageNum={1}
            onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", 1)}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Story page
// ═══════════════════════════════════════
function StoryPage({ page, slug, audio, audioPlaying, pageNum }: { page: BookPage; slug: string; audio: ReturnType<typeof useAudio>; audioPlaying: string | null; pageNum: number }) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* === IMAGE: full width, takes ~55% of page === */}
      <div className="w-full flex-[3] relative overflow-hidden">
        <img
          src={`/books/${slug}/images/${page.image}`}
          alt={`Page ${page.number}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* === TEXT: right below image, big kid-friendly font === */}
      <div className="flex-[2] flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 pb-6 relative">
        {/* Page number */}
        <div className="mt-6 mb-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-black" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {page.number}
          </span>
        </div>

        {/* Small divider */}
        <div className="mb-3">
          <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
            <rect x="0" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
            <circle cx="20" cy="4" r="3" fill="#f59e0b" opacity="0.4"/>
            <rect x="28" y="3" width="12" height="2" rx="1" fill="#f59e0b" opacity="0.5"/>
          </svg>
        </div>

        {/* Audio buttons */}
        <div className="flex items-center gap-3 mb-4">
          <AudioButton
            label="🇬🇧 English"
            langCode="en"
            playing={audioPlaying === "en"}
            pageNum={pageNum}
            onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", pageNum)}
          />
          <AudioButton
            label="🇻🇳 Tiếng Việt"
            langCode="vi"
            playing={audioPlaying === "vi"}
            pageNum={pageNum}
            onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", pageNum)}
          />
        </div>

        {/* English */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-stone-800 leading-snug mb-3 px-2" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          {page.title_en}
        </p>

        {/* Vietnamese */}
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
function EndPage({ book, audio, audioPlaying }: { book: BookData; audio: ReturnType<typeof useAudio>; audioPlaying: string | null }) {
  const lastPage = book.pages.length;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={`/books/${book.slug}/images/${book.pages[lastPage - 1]?.image}`}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="text-7xl sm:text-8xl md:text-9xl mb-6">🦋</div>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center max-w-xl leading-snug mb-3 font-black" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          Even the biggest transformation begins with a tiny step.
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-amber-200/70 text-center max-w-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ.
        </p>
        {/* Audio buttons for end page */}
        <div className="flex items-center gap-3 mt-6">
          <AudioButton
            label="🇬🇧 English"
            langCode="en"
            playing={audioPlaying === "en"}
            pageNum={lastPage}
            onClick={() => audioPlaying === "en" ? audio.stop() : audio.play("en", lastPage)}
          />
          <AudioButton
            label="🇻🇳 Tiếng Việt"
            langCode="vi"
            playing={audioPlaying === "vi"}
            pageNum={lastPage}
            onClick={() => audioPlaying === "vi" ? audio.stop() : audio.play("vi", lastPage)}
          />
        </div>
        <div className="mt-6 flex items-center gap-3">
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
  const audio = useAudio(bookSlug);
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
    audio.stop();
    setAnimating(true);
    setPage(newPage);
    setTimeout(() => setAnimating(false), 400);
  }, [audio, totalPages, animating]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* ═══ BOOK ═══ */}
      <div className="w-full h-full overflow-hidden" style={{ opacity: animating ? 0 : 1 }}>
        {page === 0 ? (
          <CoverPage book={book} slug={bookSlug} audio={audio} audioPlaying={audio.playing} />
        ) : page > totalPages ? (
          <EndPage book={book} audio={audio} audioPlaying={audio.playing} />
        ) : (
          <StoryPage page={book.pages[page - 1]} slug={bookSlug} audio={audio} audioPlaying={audio.playing} pageNum={page} />
        )}
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
      <button onClick={() => goToPage(page - 1)}
        className={`fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page <= 0 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer select-none`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={() => goToPage(page + 1)}
        className={`fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 transition-all duration-300 ${page >= totalPages + 1 || !uiVisible ? "opacity-0 pointer-events-none" : "opacity-100"} hover:bg-white hover:shadow-lg hover:scale-110 active:scale-90 active:bg-amber-100 cursor-pointer select-none`}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* ═══ Page indicator ═══ */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${uiVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10" style={{ fontFamily: "'Nunito', sans-serif" }}>
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

        body { overflow: hidden; position: fixed; width: 100%; }
      `}</style>
    </div>
  );
}
