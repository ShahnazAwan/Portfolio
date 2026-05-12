// ─────────────────────────────────────────────────────────────
//  BLOG POSTS — Shahnaz Kulsoom
//
//  ⚠️  NOTE: This file is for reference / external tooling only.
//  The blog SPA (blog/index.html) reads posts from the POSTS
//  array defined at the bottom of index.html itself.
//
//  HOW TO PUBLISH A NEW POST:
//  1. Open blog/studio.html in your browser
//  2. Write your post (or use AI Assist to draft it)
//  3. Click "Copy post object for index.html"
//  4. Open blog/index.html and paste inside the POSTS array
//  5. Save — the listing updates automatically.
//
//  This file mirrors the same data so you have a clean reference.
//  Keep it in sync manually if you use it for other tooling.
// ─────────────────────────────────────────────────────────────

const POSTS = [
  {
    slug:     "why-i-switched-to-dotnet-8",
    title:    "Why I Switched from .NET 6 to .NET 8 and Never Looked Back",
    category: ".NET",
    date:     "May 2026",
    readTime: "5 min read",
    excerpt:  "A practical walkthrough of the performance gains, new APIs, and developer experience improvements that made .NET 8 a game-changer for our enterprise projects.",
    subtitle: "Real numbers, real projects — here's what actually changed when we migrated."
  },
  {
    slug:     "redis-caching-strategies",
    title:    "Redis Caching Strategies That Cut Our API Response Time by 60%",
    category: "Azure",
    date:     "April 2026",
    readTime: "7 min read",
    excerpt:  "Real-world patterns for using Redis in .NET microservices — from cache-aside to pub/sub, with code examples from production systems.",
    subtitle: "Practical patterns we use in production — not textbook theory."
  }

  // ── ADD MORE ENTRIES BELOW after publishing via studio.html ─
  // {
  //   slug:     "your-post-slug",
  //   title:    "Your Post Title",
  //   category: "Category Label",
  //   date:     "June 2026",
  //   readTime: "4 min read",
  //   excerpt:  "Short description shown on the listing card.",
  //   subtitle: "One-liner shown under the title inside the post."
  // },
];
