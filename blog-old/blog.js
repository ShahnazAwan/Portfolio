// ═══════════════════════════════════════════════════════════════
//  blog.js — Blog Engine
//  Shahnaz Kulsoom · shahnaz-kulsoom.dev/blog
//
//  Reads POSTS_INDEX from posts.js
//  Loads post body on demand from posts/<slug>.js
//  Supports: search, category filter, URL-based deep linking
// ═══════════════════════════════════════════════════════════════

/* ── STATE ── */
let activeCategory = 'All';
let searchQuery    = '';
let currentPost    = null;

/* ── ELEMENTS ── */
const listingEl  = () => document.getElementById('view-listing');
const postEl     = () => document.getElementById('view-post');
const progressEl = () => document.getElementById('read-progress');
const gridEl     = () => document.getElementById('blog-grid');
const emptyEl    = () => document.getElementById('empty-state');

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  buildFilterTags();
  renderListing();
  handleDeepLink();
  setupScrollProgress();
});

/* ── FILTER TAGS ── */
function buildFilterTags() {
  const categories = ['All', ...new Set(POSTS_INDEX.map(p => p.category))];
  const wrap = document.getElementById('filter-tags');
  wrap.innerHTML = categories.map(cat => `
    <button class="filter-tag ${cat === 'All' ? 'active' : ''}"
      onclick="setCategory('${cat}', this)">${cat}</button>
  `).join('');
}

function setCategory(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderListing();
}

function filterPosts() {
  searchQuery = document.getElementById('search-input').value.toLowerCase();
  renderListing();
}

/* ── LISTING ── */
function renderListing() {
  const filtered = POSTS_INDEX.filter(post => {
    const matchCat    = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.category.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  const countEl = document.getElementById('post-count-text');
  countEl.textContent = `${filtered.length} post${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    gridEl().innerHTML = '';
    emptyEl().style.display = '';
    return;
  }
  emptyEl().style.display = 'none';

  gridEl().innerHTML = filtered.map((post, i) => `
    <article class="blog-card" onclick="showPost('${post.slug}')"
      style="transition-delay:${(i % 3) * 0.07}s">
      <div class="card-stripe"></div>
      <div class="card-body">
        <div class="card-meta">
          <span class="badge">${post.category}</span>
          <span class="card-date">${post.date}</span>
          <span class="card-rt">· ${post.readTime}</span>
        </div>
        <h2 class="card-title">${post.title}</h2>
        <p class="card-excerpt">${post.excerpt}</p>
        <span class="card-cta">Read post →</span>
      </div>
    </article>
  `).join('');

  // Animate cards into view
  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.06 });
    document.querySelectorAll('.blog-card').forEach(el => observer.observe(el));
  });
}

/* ── META TAG HELPER ── */
function setMeta(name, content) {
  let el = document.querySelector(`meta[property="${name}"]`) ||
           document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* ── SHOW POST ── */
function showPost(slug) {
  const meta = POSTS_INDEX.find(p => p.slug === slug);
  if (!meta) return;

  // Update URL without reload
  history.pushState({ slug }, '', `?post=${slug}`);

  // Fill hero
  document.getElementById('p-category').textContent = meta.category;
  document.getElementById('p-date').textContent      = meta.date;
  document.getElementById('p-readtime').textContent  = '· ' + meta.readTime;
  document.getElementById('p-title').textContent     = meta.title;
  document.getElementById('p-subtitle').textContent  = meta.subtitle || meta.excerpt;

  // Update page title + Open Graph / Twitter meta (helps LinkedIn/Twitter previews)
  const pageTitle = meta.title + ' | Shahnaz Kulsoom';
  document.title = pageTitle;
  setMeta('description',       meta.excerpt);
  setMeta('og:title',          pageTitle);
  setMeta('og:description',    meta.excerpt);
  setMeta('og:url',            window.location.href);
  setMeta('og:type',           'article');
  setMeta('twitter:card',      'summary');
  setMeta('twitter:title',     pageTitle);
  setMeta('twitter:description', meta.excerpt);

  // Show post view
  listingEl().style.display = 'none';
  postEl().style.display    = 'block';
  progressEl().style.width  = '0%';
  window.scrollTo({ top: 0 });
  currentPost = slug;

  // Load body JS on demand
  loadPostBody(slug);
}

function loadPostBody(slug) {
  const contentEl = document.getElementById('p-content');
  contentEl.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text3);">Loading…</div>';

  // Remove any previously loaded post script
  const old = document.getElementById('post-script-tag');
  if (old) old.remove();
  window.POST_BODY = null;

  const script = document.createElement('script');
  script.id  = 'post-script-tag';
  script.src = `posts/${slug}.js?v=${Date.now()}`;
  script.onload = () => {
    if (window.POST_BODY) {
      contentEl.innerHTML = window.POST_BODY;
      if (window.hljs) {
        contentEl.querySelectorAll('pre code').forEach(el => {
          delete el.dataset.highlighted;
          hljs.highlightElement(el);
        });
      }
    } else {
      contentEl.innerHTML = '<p style="color:var(--text3);padding:2rem;">Post content not found.</p>';
    }
  };
  script.onerror = () => {
    contentEl.innerHTML = '<p style="color:var(--text3);padding:2rem;">Could not load post. Make sure <code>posts/' + slug + '.js</code> exists in the posts/ folder.</p>';
  };
  document.body.appendChild(script);
}

/* ── SHOW LISTING ── */
function showListing() {
  history.pushState({}, '', window.location.pathname);
  listingEl().style.display = 'block';
  postEl().style.display    = 'none';
  progressEl().style.width  = '0%';
  const pageTitle = 'Blog | Shahnaz Kulsoom';
  document.title = pageTitle;
  setMeta('description',    'Technical writing on .NET, Azure, and full-stack development.');
  setMeta('og:title',       pageTitle);
  setMeta('og:description', 'Technical writing on .NET, Azure, and full-stack development.');
  setMeta('og:url',         window.location.href);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentPost = null;
}

/* ── DEEP LINK ── */
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('post');
  if (slug) showPost(slug);
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  if (e.state?.slug) {
    showPost(e.state.slug);
  } else {
    showListing();
  }
});

/* ── SCROLL PROGRESS ── */
function setupScrollProgress() {
  document.addEventListener('scroll', () => {
    if (!currentPost) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) progressEl().style.width = (window.scrollY / max * 100).toFixed(1) + '%';
  });
}
