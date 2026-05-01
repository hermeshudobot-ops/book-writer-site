"use client";

import Link from "next/link";
import booksIndex from "@/content/books/index.json";

interface BookEntry {
  slug: string;
  title_en: string;
  title_vi: string;
  author: string;
  age_range: string;
  cover_image: string;
  page_count: number;
  featured?: boolean;
  status: string;
}

export default function Home() {
  const books = (booksIndex.books || []) as BookEntry[];
  const published = books.filter((b) => b.status === "published");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-white">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <span className="text-xl font-extrabold text-green-800 tracking-tight">BookWriter</span>
        </a>
        <div className="text-sm text-gray-500">AI-Generated Children&apos;s Books</div>
      </nav>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-center">
        <div className="text-6xl md:text-7xl mb-6">🐛🦋</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Beautiful Stories,<br />
          <span className="text-green-700">Made With AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
          Bilingual children&apos;s books in English &amp; Vietnamese, created with care and artificial intelligence.
        </p>
        <p className="text-base text-gray-400 italic max-w-xl mx-auto">
          Những câu chuyện song ngữ tuyệt đẹp, được tạo ra bằng AI.
        </p>
      </header>

      {/* Books Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">📖 Our Books</h2>

        {published.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-lg">New book coming soon…</p>
            <p className="text-sm">Sách mới sắp ra mắt…</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {published.map((book) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-[16/9] bg-green-100 overflow-hidden">
                <img
                  src={`/books/${book.slug}/${book.cover_image}`}
                  alt={book.title_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {book.featured && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ✨ Featured
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                  {book.title_en}
                </h3>
                <p className="text-sm text-gray-500 italic">{book.title_vi}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-3 space-x-4">
                  <span>👤 {book.author}</span>
                  <span>📄 {book.page_count} pages</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">🎯 Ages {book.age_range}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white/70 backdrop-blur py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About BookWriter</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Each book is carefully crafted by a human author with AI assistance.
            Stories are written for young minds — bilingual, colorful, and full of wonder.
            Illustrated with photorealistic nature photography that brings characters to life.
          </p>
          <p className="text-gray-500 italic text-sm">
            Mỗi cuốn sách được tạo ra bởi tác giả với sự hỗ trợ của AI.
            Câu chuyện song ngữ, đầy màu sắc, dành cho trí óc trẻ thơ.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-200 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-2">
          <p className="font-semibold">© 2026 BookWriter by Hung Manh Do</p>
          <p className="text-green-400 text-sm">Made with ❤️ and AI</p>
        </div>
      </footer>
    </div>
  );
}
