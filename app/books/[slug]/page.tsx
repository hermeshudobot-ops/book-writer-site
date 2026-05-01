import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Link from "next/link";

interface BookPage {
  number: number;
  title_en: string;
  title_vi: string;
  image: string;
}

interface Book {
  slug: string;
  title_en: string;
  title_vi: string;
  author: string;
  age_range: string;
  description_en?: string;
  description_vi?: string;
  cover_image?: string;
  page_count: number;
  pages: BookPage[];
}

async function getBook(slug: string): Promise<Book | null> {
  const bookPath = path.join(process.cwd(), "content", "books", slug, "book.json");
  if (!fs.existsSync(bookPath)) return null;
  const content = fs.readFileSync(bookPath, "utf-8");
  return JSON.parse(content);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Book Not Found" };
  return {
    title: `${book.title_en} | BookWriter`,
    description: book.description_en || `A bilingual children's book: ${book.title_en} / ${book.title_vi}`,
  };
}

export default async function BookReader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-green-800/95 backdrop-blur text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-green-200 hover:text-white transition-colors">
            ← Library
          </Link>
          <div className="text-center">
            <h1 className="font-bold text-lg">{book.title_en}</h1>
            <p className="text-xs text-green-200 italic">{book.title_vi}</p>
          </div>
          <div className="text-xs text-green-300">
            {book.page_count} pages
          </div>
        </div>
      </header>

      {/* Book reading area */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {book.pages.map((page) => (
          <article
            key={page.number}
            id={`page-${page.number}`}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* Full-width image */}
            <div className="relative w-full aspect-[16/9] bg-green-50">
              <img
                src={`/books/${book.slug}/images/${page.image}`}
                alt={`Page ${page.number} illustration`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Bilingual text */}
            <div className="px-6 py-5 text-center">
              <p className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                {page.title_en}
              </p>
              <p className="mt-2 text-sm md:text-base text-gray-500 italic leading-relaxed">
                {page.title_vi}
              </p>
              <div className="mt-3 text-xs text-gray-400">
                {page.number} / {book.page_count}
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Closing / End page */}
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-8">
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-10 text-center shadow-md border border-amber-100">
          <div className="text-6xl mb-4">🦋</div>
          <p className="text-lg font-semibold text-gray-800 leading-relaxed">
            "Even the biggest transformation begins with a tiny step."
          </p>
          <p className="mt-2 text-sm text-gray-500 italic">
            "Ngay cả sự thay đổi lớn nhất cũng bắt đầu từ một bước nhỏ."
          </p>
          <div className="mt-6 text-xs text-gray-400">
            {book.title_en} | {book.title_vi}<br />
            By {book.author} · © 2026
          </div>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-green-700 text-white rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
          >
            ← Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
