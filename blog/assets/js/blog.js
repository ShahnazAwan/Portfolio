/* ═══════════════════════════════════════════════════
   blog.js — Blog Listing Engine
   Reads: POSTS_INDEX from data/posts.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── STATE ── */
const Blog = {
  activeCategory: 'All',
  searchQuery:    '',
  currentSlug:    null,
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Blog.buildFilters();
  Blog.renderGrid();
  Blog.handleDeepLink();
  Blog.setupProgress();
});

/* ── FILTER TAGS ── */
Blog.buildFilters = function() {
  const categories = ['All', ...new Set(POSTS_INDEX.map(p => p.category))];
  const wrap = document.getElementById('filter-tags');
  if (!wrap) return;
  wrap.innerHTML = categories.map(cat => `
    <button class="filter-tag ${cat === 'All' ? 'is-active' : ''}"
      data-cat="${cat}">${cat}</button>
  `).join('');
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.filter-tag');
    if (!btn) return;
    wrap.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('is-active'));
    btn.classList.add('is-active');
    Blog.activeCategory = btn.dataset.cat;
    Blog.renderGrid();
  });
};

/* ── SEARCH ── */
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    Blog.searchQuery = searchInput.value.toLowerCase().trim();
    Blog.renderGrid();
  });
}

/* ── RENDER GRID ── */
Blog.renderGrid = function() {
  const filtered = POSTS_INDEX.filter(post => {
    const matchCat = Blog.activeCategory === 'All' || post.category === Blog.activeCategory;
    const q = Blog.searchQuery;
    const matchSearch = !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const countEl = document.getElementById('post-count');
  if (countEl) countEl.textContent = `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`;

  const grid    = document.getElementById('blog-grid');
  const empty   = document.getElementById('empty-state');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = filtered.map((post, i) => `
    <article class="blog-card" data-slug="${post.slug}"
      style="transition-delay: ${(i % 3) * 0.07}s"
      role="button" tabindex="0"
      aria-label="Read: ${post.title}">
      <div class="blog-card__stripe"></div>
      <div class="blog-card__body">
        <div class="blog-card__meta">
          <span class="badge">${post.category}</span>
          <span class="blog-card__date">${post.date}</span>
          <span class="blog-card__rt">· ${post.readTime}</span>
        </div>
        <h2 class="blog-card__title">${post.title}</h2>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <span class="blog-card__cta">Read post →</span>
      </div>
    </article>
  `).join('');

  /* click handler */
  grid.querySelectorAll('.blog-card').forEach(card => {
    const open = () => Blog.showPost(card.dataset.slug);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });

  /* animate in */
  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.06 });
    grid.querySelectorAll('.blog-card').forEach(el => observer.observe(el));
  });
};

/* ── SHOW POST ── */
Blog.showPost = function(slug) {
  const meta = POSTS_INDEX.find(p => p.slug === slug);
  if (!meta) return;

  history.pushState({ slug }, '', `?post=${slug}`);
  Blog.currentSlug = slug;

  /* populate hero */
  document.getElementById('p-category').textContent = meta.category;
  document.getElementById('p-date').textContent      = meta.date;
  document.getElementById('p-readtime').textContent  = '· ' + meta.readTime;
  document.getElementById('p-title').textContent     = meta.title;
  document.getElementById('p-subtitle').textContent  = meta.subtitle || meta.excerpt;

  /* meta tags */
  Blog.updateMeta(meta.title + ' | Shahnaz Kulsoom', meta.excerpt);

  /* swap views */
  document.getElementById('view-listing').style.display = 'none';
  document.getElementById('view-post').style.display    = 'block';
  const prog = document.getElementById('read-progress');
  if (prog) prog.style.width = '0%';
  window.scrollTo({ top: 0 });

  Post.load(slug);
};

/* ── SHOW LISTING ── */
Blog.showListing = function() {
  history.pushState({}, '', window.location.pathname);
  Blog.currentSlug = null;
  document.getElementById('view-listing').style.display = 'block';
  document.getElementById('view-post').style.display    = 'none';
  const prog = document.getElementById('read-progress');
  if (prog) prog.style.width = '0%';
  Blog.updateMeta('Blog | Shahnaz Kulsoom', 'Technical writing on .NET, Azure, and full-stack development.');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
/* expose for onclick in HTML */
window.showListing = () => Blog.showListing();

/* ── DEEP LINK ── */
Blog.handleDeepLink = function() {
  const slug = new URLSearchParams(window.location.search).get('post');
  if (slug) Blog.showPost(slug);
};

/* ── BROWSER BACK/FORWARD ── */
window.addEventListener('popstate', e => {
  e.state?.slug ? Blog.showPost(e.state.slug) : Blog.showListing();
});

/* ── META TAGS ── */
Blog.updateMeta = function(title, description) {
  document.title = title;
  const set = (sel, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };
  set('meta[name="description"]',       description);
  set('meta[property="og:title"]',      title);
  set('meta[property="og:description"]', description);
  set('meta[property="og:url"]',        window.location.href);
  set('meta[name="twitter:title"]',     title);
  set('meta[name="twitter:description"]', description);
};

/* ── SCROLL PROGRESS ── */
Blog.setupProgress = function() {
  document.addEventListener('scroll', () => {
    if (!Blog.currentSlug) return;
    const prog = document.getElementById('read-progress');
    if (!prog) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) prog.style.width = (window.scrollY / max * 100).toFixed(1) + '%';
  });
};
