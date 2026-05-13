/* ═══════════════════════════════════════════════════
   post.js — On-Demand Post Content Loader
   Loads posts/<slug>.js which sets window.POST_BODY
   ═══════════════════════════════════════════════════ */

'use strict';

const Post = {

  /* ── LOAD POST BODY ── */
  load(slug) {
    const contentEl = document.getElementById('p-content');
    if (!contentEl) return;

    contentEl.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;color:var(--text-subtle);">
        <p style="font-size:0.9rem;">Loading…</p>
      </div>`;

    /* remove previously loaded script tag */
    const prev = document.getElementById('__post_script');
    if (prev) prev.remove();
    window.POST_BODY = null;

    const script  = document.createElement('script');
    script.id     = '__post_script';
    script.src    = `posts/${slug}.js?v=${Date.now()}`;

    script.onload = () => Post.render(contentEl);
    script.onerror = () => {
      contentEl.innerHTML = `
        <div class="container--narrow" style="padding-top:2rem;">
          <p style="color:var(--text-subtle);font-size:0.9rem;">
            Could not load post. Make sure
            <code style="background:var(--primary-light);color:var(--primary-dark);
              padding:1px 5px;border-radius:4px;font-size:0.85em;">
              posts/${slug}.js
            </code>
            exists in the posts/ folder.
          </p>
        </div>`;
    };

    document.body.appendChild(script);
  },

  /* ── RENDER ── */
  render(contentEl) {
    if (!window.POST_BODY) {
      contentEl.innerHTML = '<p style="color:var(--text-subtle);padding:2rem;">Post body is empty.</p>';
      return;
    }
    contentEl.innerHTML = window.POST_BODY;

    /* syntax highlight */
    if (window.hljs) {
      contentEl.querySelectorAll('pre code').forEach(el => {
        delete el.dataset.highlighted;
        hljs.highlightElement(el);
      });
    }
  },

};
