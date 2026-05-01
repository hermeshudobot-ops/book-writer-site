# BookWriter

AI-generated bilingual children's books showcase site.

Built with Next.js, Tailwind CSS, and Flux AI image generation.

## Live Site

Deployed on [Vercel](https://vercel.com).

## Adding a New Book

1. Generate book with `book-writer-agent` skill
2. Add to `content/books/[slug]/`
3. Update `content/books/index.json`
4. Commit and push — Vercel auto-deploys

## Tech Stack

- Next.js 14 App Router
- Tailwind CSS
- Replicate (Flux Schnell) for illustrations
- ElevenLabs for TTS (optional)
- Vercel for hosting
