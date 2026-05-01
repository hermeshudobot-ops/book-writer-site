import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import BookPremium from "./BookPremium";

interface BookmarkPageProps {
  params: Promise<{ slug: string }>;
}

async function getBook(slug: string) {
  const bookPath = path.join(process.cwd(), "content", "books", slug, "book.json");
  if (!fs.existsSync(bookPath)) return null;
  return JSON.parse(fs.readFileSync(bookPath, "utf-8"));
}

export async function generateStaticParams() {
  const booksDir = path.join(process.cwd(), "content", "books");
  if (!fs.existsSync(booksDir)) return [];
  return fs.readdirSync(booksDir).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BookmarkPageProps) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Not Found" };
  return {
    title: `${book.title_en} — ${book.title_vi}`,
    description: book.description_en,
  };
}

export default async function BookPage({ params }: BookmarkPageProps) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  return <BookPremium book={book} bookSlug={slug} />;
}
