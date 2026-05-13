  let currentTpl = 'sky';
  let currentCat = '.NET';
  const LI_TPLS = ['li-pulse','li-navy','li-gold','li-coral','li-code'];

  // ── TEMPLATE ──────────────────────────────────────────
  function setTemplate(name, el) {
    document.querySelectorAll('.tpl-card2').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const card = document.getElementById('preview-card');
    card.className = 'tpl-' + name + (LI_TPLS.includes(name) ? ' li-mode' : '');
    currentTpl = name;
    const isLI     = LI_TPLS.includes(name);
    const isCode   = name === 'li-code';
    // Blog-only fields
    document.getElementById('field-subtitle').style.display = isLI ? 'none' : '';
    document.getElementById('field-date').style.display     = isLI ? 'none' : '';
    document.getElementById('field-rt').style.display       = isLI ? 'none' : '';
    // Content field — hide for code post (has its own code fields)
    document.getElementById('f-body').closest('.field').style.display = isCode ? 'none' : '';
    // Code-post-only fields
    document.getElementById('field-code-lang').style.display     = isCode ? '' : 'none';
    document.getElementById('field-code-snippet').style.display  = isCode ? '' : 'none';
    document.getElementById('field-code-takeaway').style.display = isCode ? '' : 'none';
    // Hint text
    document.getElementById('preview-hint').textContent = isCode ? 'Live preview — Code Post (LinkedIn)' : isLI ? 'Live preview — 560×560px (LinkedIn)' : 'Live preview — 680px wide';
    sync();
  }

  // ── CATEGORY ──────────────────────────────────────────
  function setCat(el) {
    document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    currentCat = el.textContent;
    document.getElementById('f-cat-custom').value = '';
    sync();
  }
  function syncCat() {
    const v = document.getElementById('f-cat-custom').value.trim();
    if (v) {
      document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
      currentCat = v;
    }
    sync();
  }

  // ── ADDON TOGGLES ─────────────────────────────────────
  const addonState = { code: false, compare: false };
  function toggleAddon(id) {
    addonState[id] = !addonState[id];
    const body   = document.getElementById('body-' + id);
    const toggle = document.getElementById('toggle-' + id);
    body.style.display   = addonState[id] ? '' : 'none';
    toggle.classList.toggle('on', addonState[id]);
    sync();
  }

  // ── SYNC FORM → PREVIEW ───────────────────────────────
  function sync() {
    const title    = document.getElementById('f-title').value.trim()    || 'Your post title goes here';
    const subtitle = document.getElementById('f-subtitle').value.trim() || 'A short subtitle that gives readers context.';
    const date     = document.getElementById('f-date').value.trim()     || 'May 2026';
    const readtime = document.getElementById('f-readtime').value.trim() || '5 min read';
    const body     = document.getElementById('f-body').value.trim();
    const author   = document.getElementById('f-author').value.trim()   || 'Shahnaz Kulsoom';

    document.getElementById('pc-cat').textContent      = currentCat;
    document.getElementById('pc-title').textContent    = title;
    document.getElementById('pc-subtitle').textContent = subtitle;
    document.getElementById('pc-meta').innerHTML       = `<span>${date}</span> · ${readtime}`;

    const isLI = LI_TPLS.includes(currentTpl);
    const handle = '@' + author.toLowerCase().replace(/\s+/g, '');
    const svgBookmark = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
    const svgHeart    = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    const svgShare    = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;

    if (isLI) {
      document.getElementById('pc-footer').innerHTML = `
        <div class="li-author">
          <div class="li-name">${author}</div>
          <div class="li-handle">${handle}</div>
        </div>
        <div class="li-actions">
          ${svgBookmark}${svgHeart}${svgShare}
        </div>`;
    } else {
      document.getElementById('pc-footer').innerHTML = `<span>By <strong>${author}</strong></span><span>shahnaz-kulsoom.dev/blog</span>`;
    }

    // Parse body: ## lines → h2, blank-line-separated → p
    const bodyEl = document.getElementById('pc-body');

    // ── li-code special render ──
    if (currentTpl === 'li-code') {
      const snippet   = document.getElementById('f-code-snippet').value || '// paste your code on the left →';
      const lang      = document.getElementById('f-code-lang').value || 'csharp';
      const takeaways = document.getElementById('f-code-takeaway').value
        .split('\n').map(l => l.trim()).filter(Boolean);
      const langLabel = { csharp:'Program.cs', javascript:'index.js', typescript:'types.ts', python:'main.py', sql:'query.sql', bash:'script.sh', json:'config.json', yaml:'config.yml' }[lang] || lang;
      const takeawayHTML = takeaways.map(t => `<div class="li-takeaway-item">${t}</div>`).join('');
      bodyEl.innerHTML = `
        <div class="li-code-window">
          <div class="li-code-winbar">
            <div class="li-code-dot" style="background:#ff5f57;"></div>
            <div class="li-code-dot" style="background:#febc2e;"></div>
            <div class="li-code-dot" style="background:#28c840;"></div>
            <div class="li-code-filetag">${langLabel}</div>
          </div>
          <pre><code>${snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
        </div>
        ${takeaways.length ? `<div class="li-takeaway">${takeawayHTML}</div>` : ''}`;
      return;
    }
    if (!body) {
      bodyEl.innerHTML = '<p>Start typing in the content field and your post will appear here.</p>';
    } else {
    const lines = body.split('\n');
    let html = '';
    let para = [];
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (para.length) { html += '<p>' + para.join(' ') + '</p>'; para = []; }
        html += '<h2>' + line.slice(3) + '</h2>';
      } else if (line.trim() === '') {
        if (para.length) { html += '<p>' + para.join(' ') + '</p>'; para = []; }
      } else {
        para.push(line.trim());
      }
    }
    if (para.length) html += '<p>' + para.join(' ') + '</p>';
    bodyEl.innerHTML = html || '<p>' + body + '</p>';
    }

    // ── Append inline code block ──
    if (addonState.code) {
      const code  = document.getElementById('f-inline-code').value || '// your code here';
      const file  = document.getElementById('f-inline-file').value || 'snippet';
      const esc   = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const block = document.createElement('div');
      block.className = 'pc-code-block';
      block.innerHTML = `
        <div class="pc-code-bar">
          <div class="pc-code-dot" style="background:#ff5f57;"></div>
          <div class="pc-code-dot" style="background:#febc2e;"></div>
          <div class="pc-code-dot" style="background:#28c840;"></div>
          <div class="pc-code-file">${file}</div>
        </div>
        <pre class="pc-code-pre">${esc}</pre>`;
      bodyEl.appendChild(block);
    }

    // ── Append compare block ──
    if (addonState.compare) {
      const good  = document.getElementById('f-cmp-good').value || '// good way';
      const bad   = document.getElementById('f-cmp-bad').value  || '// bad way';
      const lbl   = document.getElementById('f-cmp-label').value || 'Code Comparison';
      const escG  = good.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const escB  = bad.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const block = document.createElement('div');
      block.className = 'pc-compare-block';
      block.innerHTML = `
        <div class="pc-compare-label">${lbl}</div>
        <div class="pc-compare-grid">
          <div class="pc-cmp-panel">
            <div class="pc-cmp-bar good">✅ Good way</div>
            <pre class="pc-cmp-pre">${escG}</pre>
          </div>
          <div class="pc-cmp-panel">
            <div class="pc-cmp-bar bad">❌ Bad way</div>
            <pre class="pc-cmp-pre">${escB}</pre>
          </div>
        </div>`;
      bodyEl.appendChild(block);
    }

    // ── Update fit indicator for LinkedIn cards ──
    const fitWrap = document.getElementById('fit-bar-wrap');
    const fitTip  = document.getElementById('fit-tip');
    if (isLI) {
      fitWrap.style.display = '';
      const card = document.getElementById('preview-card');
      const used = card.scrollHeight;
      const avail = 560;
      const pct = Math.min(Math.round((used / avail) * 100), 100);
      const fill = document.getElementById('fit-fill');
      const pctEl = document.getElementById('fit-pct');
      fill.style.width = pct + '%';
      fill.className = 'fit-fill' + (pct > 95 ? ' over' : pct > 80 ? ' warn' : '');
      pctEl.textContent = pct + '%';
      document.getElementById('fit-label').textContent = pct >= 100 ? 'Overflowing' : 'Content fit';
      fitTip.classList.toggle('show', used > avail);
    } else {
      fitWrap.style.display = 'none';
      fitTip.classList.remove('show');
    }
  }

  function updateCount() {
    const words = document.getElementById('f-body').value.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('char-count').textContent = words + ' words';
  }

  // ── RESET ─────────────────────────────────────────────
  // ── EXPORT POST FILE (.js for blog + metadata for posts.js) ─
  function exportPostFile() {
    const title    = document.getElementById('f-title').value.trim()    || 'Untitled Post';
    const subtitle = document.getElementById('f-subtitle').value.trim() || '';
    const excerpt  = document.getElementById('f-excerpt').value.trim()  || subtitle;
    const date     = document.getElementById('f-date').value.trim()     || 'May 2026';
    const readTime = document.getElementById('f-readtime').value.trim() || '5 min read';
    const author   = document.getElementById('f-author').value.trim()   || 'Shahnaz Kulsoom';
    const cat      = activeCategory;
    const slug     = makeSlug(title);

    // Build the HTML body from the current rendered preview
    const bodyHTML = document.getElementById('pc-body').innerHTML
      .replace(/`/g, '\\`').replace(/\${/g, '\\${');

    // 1. The post content JS file (drop into posts/ folder)
    const postFileContent =
`// posts/${slug}.js
// Generated by composer.html on ${new Date().toLocaleDateString()}
// Drop this file into your blog/posts/ folder.

window.POST_BODY = \`
${bodyHTML}
\`;
`;

    // 2. The metadata snippet (paste one line into posts.js POSTS_INDEX)
    const metaSnippet =
`  {
    slug:     "${slug}",
    title:    "${title.replace(/"/g, '\\"')}",
    category: "${cat}",
    date:     "${date}",
    readTime: "${readTime}",
    excerpt:  "${excerpt.replace(/"/g, '\\"')}",
    subtitle: "${subtitle.replace(/"/g, '\\"')}"
  },`;

    // Download the .js file
    saveDataURL(
      'data:text/javascript;charset=utf-8,' + encodeURIComponent(postFileContent),
      slug + '.js'
    );

    // Copy the metadata snippet to clipboard
    navigator.clipboard.writeText(metaSnippet).then(() => {
      toast(`✓ "${slug}.js" downloaded — paste into blog/posts/\n✓ Metadata copied — paste into POSTS_INDEX in posts.js`);
    }).catch(() => {
      toast(`✓ "${slug}.js" downloaded — drop it in blog/posts/\n  Also add metadata to posts.js manually.`);
    });
  }

  function resetForm() {
    ['f-title','f-subtitle','f-body','f-cat-custom'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-date').value = 'May 2026';
    document.getElementById('f-readtime').value = '5 min read';
    document.getElementById('f-author').value = 'Shahnaz Kulsoom';
    document.querySelectorAll('.cat').forEach((c,i) => c.classList.toggle('active', i===0));
    currentCat = '.NET';
    sync();
    updateCount();
  }

  // ── TOAST ─────────────────────────────────────────────
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ── DOWNLOAD IMAGE ────────────────────────────────────
  // ── CSP-SAFE DOWNLOAD HELPER ──────────────────────────
  // Appends a real <a> to <body> so CSP data: URIs are allowed
  function saveDataURL(dataURL, filename) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 200);
  }

  // ── DOWNLOAD POST IMAGE ───────────────────────────────
  async function downloadImage() {
    const btn = document.getElementById('img-btn');
    btn.classList.add('loading');
    btn.textContent = '…';
    try {
      const target = document.getElementById('canvas-wrap');
      const card   = document.getElementById('preview-card');

      const wrap = document.createElement('div');
      wrap.style.cssText = `position:fixed;top:0;left:-9999px;z-index:-1;
        width:${target.offsetWidth}px;background:transparent;pointer-events:none;`;
      const clone = target.cloneNode(true);
      clone.style.cssText = `width:${target.offsetWidth}px;border-radius:12px;overflow:hidden;position:relative;`;
      wrap.appendChild(clone);
      document.body.appendChild(wrap);
      await new Promise(r => setTimeout(r, 60));

      const canvas = await html2canvas(clone, {
        scale: 2, useCORS: true, backgroundColor: null, logging: false,
        scrollX: 0, scrollY: 0,
        width: clone.offsetWidth, height: clone.offsetHeight
      });
      document.body.removeChild(wrap);

      const slug = (document.getElementById('f-title').value.trim() || 'post')
        .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      saveDataURL(canvas.toDataURL('image/png'), slug + '.png');
      toast('✓ Image downloaded!');
    } catch(e) {
      toast('⚠ Export failed — check console.');
      console.error(e);
    } finally {
      btn.classList.remove('loading');
      btn.textContent = '⬇ Image';
    }
  }

  // ── DOWNLOAD PDF (iframe, no blob: URL) ───────────────
  const themes = {
    sky:       { bg:'#fff', heroBg:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', catBg:'#e0f2fe', catColor:'#0369a1', catBorder:'rgba(14,165,233,0.25)', title:'#0f172a', subtitle:'#475569', accent:'#0ea5e9', bodyText:'#475569', h2:'#0f172a', footerBorder:'#e2e8f0', footerText:'#94a3b8', titleFont:"'Raleway',sans-serif" },
    noir:      { bg:'#0f172a', heroBg:'#0f172a', catBg:'rgba(56,189,248,0.1)', catColor:'#38bdf8', catBorder:'rgba(56,189,248,0.2)', title:'#f1f5f9', subtitle:'#94a3b8', accent:'#38bdf8', bodyText:'#94a3b8', h2:'#e2e8f0', footerBorder:'#1e293b', footerText:'#475569', titleFont:"'Raleway',sans-serif" },
    serif:     { bg:'#fffdf7', heroBg:'#fffdf7', catBg:'transparent', catColor:'#92400e', catBorder:'none', title:'#1c1208', subtitle:'#78350f', accent:'#d4a853', bodyText:'#44310a', h2:'#1c1208', footerBorder:'#f0d9a0', footerText:'#a16207', titleFont:"'Playfair Display',serif" },
    mint:      { bg:'#f0fdf4', heroBg:'linear-gradient(135deg,#f0fdf4,#dcfce7)', catBg:'#bbf7d0', catColor:'#14532d', catBorder:'#86efac', title:'#052e16', subtitle:'#166534', accent:'#16a34a', bodyText:'#166534', h2:'#052e16', footerBorder:'#86efac', footerText:'#4ade80', titleFont:"'Raleway',sans-serif" },
    mono:      { bg:'#1a1a2e', heroBg:'#1a1a2e', catBg:'rgba(167,139,250,0.1)', catColor:'#a78bfa', catBorder:'rgba(167,139,250,0.2)', title:'#e2e8f0', subtitle:'#6b7280', accent:'#a78bfa', bodyText:'#9ca3af', h2:'#a78bfa', footerBorder:'#2d2d44', footerText:'#4b5563', titleFont:"'JetBrains Mono',monospace" },
    blush:     { bg:'#fff5f5', heroBg:'linear-gradient(135deg,#fff5f5,#ffe4e6)', catBg:'#fecdd3', catColor:'#9f1239', catBorder:'#fda4af', title:'#4c0519', subtitle:'#881337', accent:'#e11d48', bodyText:'#881337', h2:'#4c0519', footerBorder:'#fecdd3', footerText:'#fda4af', titleFont:"'Playfair Display',serif" },
    'li-pulse':{ bg:'#fff', heroBg:'#fff', catBg:'transparent', catColor:'#0a66c2', catBorder:'none', title:'#0f172a', subtitle:'', accent:'#0a66c2', bodyText:'#334155', h2:'#0a66c2', footerBorder:'#e2e8f0', footerText:'#64748b', titleFont:"'Raleway',sans-serif", liMode:true },
    'li-navy': { bg:'#0f2b4d', heroBg:'#0f2b4d', catBg:'transparent', catColor:'#60a5fa', catBorder:'none', title:'#f0f9ff', subtitle:'', accent:'#60a5fa', bodyText:'#94a3b8', h2:'#60a5fa', footerBorder:'#1e4d8c', footerText:'#475569', titleFont:"'Raleway',sans-serif", liMode:true },
    'li-gold': { bg:'#1c1208', heroBg:'linear-gradient(135deg,#1c1208,#2d1f0a)', catBg:'transparent', catColor:'#d4a853', catBorder:'none', title:'#fef3c7', subtitle:'', accent:'#d4a853', bodyText:'#d4a853', h2:'#fef3c7', footerBorder:'#2d1f0a', footerText:'#78350f', titleFont:"'Playfair Display',serif", liMode:true },
    'li-coral':{ bg:'#fff', heroBg:'linear-gradient(135deg,#ff6b35,#f7c59f)', catBg:'transparent', catColor:'rgba(255,255,255,0.85)', catBorder:'none', title:'#fff', subtitle:'', accent:'#ff6b35', bodyText:'#374151', h2:'#ff6b35', footerBorder:'#f3f4f6', footerText:'#9ca3af', titleFont:"'Raleway',sans-serif", liMode:true },
    'li-code': { bg:'#0f172a', heroBg:'#0f172a', catBg:'rgba(125,211,252,0.1)', catColor:'#7dd3fc', catBorder:'rgba(125,211,252,0.2)', title:'#f1f5f9', subtitle:'', accent:'#7dd3fc', bodyText:'#94a3b8', h2:'#7dd3fc', footerBorder:'#1e293b', footerText:'#475569', titleFont:"'Raleway',sans-serif", liMode:true, codeMode:true },
  };

  function downloadPDF() {
    const title    = document.getElementById('f-title').value.trim()    || 'Post';
    const subtitle = document.getElementById('f-subtitle').value.trim() || '';
    const date     = document.getElementById('f-date').value.trim();
    const readtime = document.getElementById('f-readtime').value.trim();
    const author   = document.getElementById('f-author').value.trim()   || 'Shahnaz Kulsoom';
    const body     = document.getElementById('pc-body').innerHTML;
    const isLI     = LI_TPLS.includes(currentTpl);
    const t        = themes[currentTpl];
    const monoFont = currentTpl === 'mono' ? "'JetBrains Mono',monospace" : "'DM Sans',sans-serif";
    const inBadge  = `<span style="background:${t.accent};color:#fff;border-radius:4px;padding:2px 6px;font-size:0.65rem;font-weight:800;margin-right:6px;">in</span>`;

    const printDoc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&family=Raleway:wght@700;800&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:${monoFont};background:${t.bg};color:${t.bodyText};max-width:${isLI?'620px':'780px'};margin:0 auto;${isLI?'aspect-ratio:1/1;display:flex;flex-direction:column;':''}padding:0;}
.hero{padding:${isLI?'2rem 2.5rem 1.25rem':'3rem 3.5rem 2.5rem'};background:${t.heroBg};border-bottom:${isLI&&currentTpl==='li-pulse'?'3px solid #0a66c2':isLI&&currentTpl==='li-gold'?'2px solid #d4a853':'1px solid '+t.footerBorder};}
.cat{display:inline-flex;align-items:center;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${t.catColor};margin-bottom:0.75rem;}
h1{font-family:${t.titleFont};font-size:${isLI?'1.7rem':'2.1rem'};font-weight:${currentTpl==='mono'?500:currentTpl==='li-gold'?700:800};line-height:1.2;color:${t.title};margin-bottom:0.65rem;letter-spacing:-0.02em;}
.subtitle{font-size:1rem;color:${t.subtitle};line-height:1.65;margin-bottom:1rem;font-weight:300;${currentTpl==='serif'||currentTpl==='blush'?'font-style:italic;':''}}
.meta{font-size:0.75rem;color:${t.footerText};}.meta span{color:${t.accent};}
.content{padding:${isLI?'1.25rem 2.5rem 1.5rem':'2.5rem 3.5rem 3rem'};${isLI?'flex:1;':''}}
p{font-size:${isLI?'0.88rem':'0.96rem'};color:${t.bodyText};line-height:1.85;margin-bottom:1rem;font-weight:${isLI?400:300};${currentTpl==='serif'||currentTpl==='blush'?'font-family:Playfair Display,serif;':''}}
h2{font-family:${t.titleFont};font-size:1rem;font-weight:${currentTpl==='mono'?500:700};color:${t.h2};margin:1.5rem 0 0.6rem;${currentTpl==='serif'?'border-left:3px solid #d4a853;padding-left:0.75rem;':''}}
.footer{padding:0.9rem ${isLI?'2.5rem':'3.5rem'};border-top:1px solid ${t.footerBorder};display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;color:${t.footerText};${isLI?'margin-top:auto;background:'+t.bg+';':''}}
.footer strong{color:${t.accent};}
@media print{body{padding:0;}h2{page-break-after:avoid;}p{page-break-inside:avoid;}}
</style></head><body>
<div class="hero">
  <div class="cat">${isLI?inBadge:''}${currentCat}</div>
  <h1>${title}</h1>
  ${!isLI&&subtitle?`<div class="subtitle">${subtitle}</div>`:''}
  ${!isLI?`<div class="meta"><span>${date}</span> · ${readtime}</div>`:''}
</div>
<div class="content">${body}</div>
<div class="footer"><span>By <strong>${author}</strong></span><span>${isLI?'linkedin.com/in/shahnaz-kulsoom':'shahnaz-kulsoom.dev/blog'}</span></div>
<script>window.addEventListener('load',()=>{setTimeout(()=>{window.print();},700);});<\/script>
</body></html>`;

    // Write into a hidden iframe — avoids blob: and popup blockers
    let iframe = document.getElementById('__pdf_iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = '__pdf_iframe';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:900px;height:700px;border:none;';
      document.body.appendChild(iframe);
    }
    iframe.contentDocument.open();
    iframe.contentDocument.write(printDoc);
    iframe.contentDocument.close();
    toast('Print dialog will open — choose "Save as PDF"');
  }

  // ── DOWNLOAD CODE CARD IMAGE ──────────────────────────
  async function downloadCodeImage() {
    const btn = document.querySelector('.code-sidebar .btn-outline');
    btn.textContent = '…rendering';
    btn.disabled = true;
    try {
      const card = document.getElementById('code-card');
      const canvas = await html2canvas(card, {
        scale: 3, useCORS: true, backgroundColor: null, logging: false, allowTaint: true
      });
      const slug = (document.getElementById('c-caption').value.trim() || 'code-card')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      saveDataURL(canvas.toDataURL('image/png'), slug + '.png');
      toast('✓ Code card downloaded at 3× resolution!');
    } catch(e) {
      toast('⚠ Export failed — check console.');
      console.error(e);
    } finally {
      btn.textContent = '⬇ Download Card as Image';
      btn.disabled = false;
    }
  }

  // ── MODE SWITCHING ────────────────────────────────────
  let currentMode = 'post'; // 'post' | 'li' | 'code'

  function switchMode(mode) {
    currentMode = mode;
    // Update tab styles
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + mode).classList.add('active');
    // Show/hide panels
    document.getElementById('post-panel').style.display = (mode === 'post' || mode === 'li') ? '' : 'none';
    document.getElementById('code-panel').classList.toggle('active', mode === 'code');
    // PDF button only for post/li
    document.getElementById('pdf-btn').style.display = mode === 'code' ? 'none' : '';
    document.getElementById('img-btn').style.display = mode === 'code' ? 'none' : '';

    if (mode === 'li') {
      // Auto-pick first LinkedIn template if not already on one
      if (!LI_TPLS.includes(currentTpl)) {
        const liCard = document.querySelector('[data-tpl="li-pulse"]');
        setTemplate('li-pulse', liCard);
      }
    } else if (mode === 'post') {
      // Auto-pick first blog template if on a LinkedIn one
      if (LI_TPLS.includes(currentTpl)) {
        const skyCard = document.querySelector('[data-tpl="sky"]');
        setTemplate('sky', skyCard);
      }
    }
  }

  // ── CODE CARD STATE ───────────────────────────────────
  const CODE_THEMES = {
    'night-owl':    { bg:'#011627', bar:'#01111d', text:'#d6deeb', accent:'#7fdbca' },
    'dracula':      { bg:'#282a36', bar:'#1e1f29', text:'#f8f8f2', accent:'#bd93f9' },
    'github-dark':  { bg:'#0d1117', bar:'#010409', text:'#c9d1d9', accent:'#58a6ff' },
    'monokai':      { bg:'#272822', bar:'#1a1a16', text:'#f8f8f2', accent:'#a6e22e' },
    'solarized-dark':{ bg:'#002b36', bar:'#001f27', text:'#839496', accent:'#268bd2' },
    'one-dark':     { bg:'#282c34', bar:'#21252b', text:'#abb2bf', accent:'#61afef' },
    'github':       { bg:'#ffffff', bar:'#f6f8fa', text:'#24292e', accent:'#0366d6' },
    'ayu-light':    { bg:'#fafafa', bar:'#f0f0f0', text:'#575f66', accent:'#ff9940' },
  };

  // hljs cdn theme map
  const HLJS_CSS = {
    'night-owl':    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/night-owl.min.css',
    'dracula':      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dracula.min.css',
    'github-dark':  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
    'monokai':      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css',
    'solarized-dark':'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/solarized-dark.min.css',
    'one-dark':     'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
    'github':       'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css',
    'ayu-light':    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/ayu-light.min.css',
  };

  let codeTheme = 'night-owl';
  let codeBg    = 'linear-gradient(135deg,#667eea,#764ba2)';

  // Load highlight.js dynamically
  const hljsScript = document.createElement('script');
  hljsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  hljsScript.onload = () => syncCode();
  document.head.appendChild(hljsScript);

  let hljsStyleEl = document.createElement('link');
  hljsStyleEl.rel = 'stylesheet';
  hljsStyleEl.href = HLJS_CSS['night-owl'];
  document.head.appendChild(hljsStyleEl);

  function setCodeTheme(name, el) {
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    codeTheme = name;
    // Swap hljs CSS
    hljsStyleEl.href = HLJS_CSS[name];
    syncCode();
  }

  function setCodeBg(el) {
    document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    codeBg = el.dataset.bg;
    syncCode();
  }

  function syncCode() {
    const code     = document.getElementById('code-input').value || '// Paste your code on the left →';
    const lang     = document.getElementById('c-lang').value;
    const title    = document.getElementById('c-title').value || lang;
    const caption  = document.getElementById('c-caption').value;
    const author   = document.getElementById('c-author').value || '@shahnaz_kulsoom';
    const fontSize = document.getElementById('c-fontsize').value + 'px';
    const t        = CODE_THEMES[codeTheme];

    // Background
    document.getElementById('code-card-bg').style.background = codeBg;

    // Window bar
    const bar = document.getElementById('code-window-bar');
    bar.style.background = t.bar;
    document.getElementById('code-win-title').style.color = t.text;
    document.getElementById('code-win-title').textContent = title;

    // Code display
    const display = document.getElementById('code-display');
    display.style.background = t.bg;
    display.style.fontSize = fontSize;

    const codeEl = document.getElementById('code-highlighted');
    codeEl.className = 'language-' + lang;
    codeEl.textContent = code;
    if (window.hljs) {
      delete codeEl.dataset.highlighted;
      hljs.highlightElement(codeEl);
    }

    // Caption
    document.getElementById('code-caption-el').textContent = caption;
    document.getElementById('code-author-el').textContent  = author;

    // Caption text color — light or dark based on bg
    const isDarkBg = codeBg.includes('#0f172a') || codeBg.includes('#1a1a2e') || codeBg.includes('135deg,#0f') || codeBg.includes('135deg,#1a');
    const captionColor = (codeBg === '#f1f5f9') ? '#1e293b' : '#ffffff';
    document.getElementById('code-caption-el').style.color = captionColor;
    document.getElementById('code-author-el').style.color  = captionColor === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.5)';
  }

  // ── DOWNLOAD CODE CARD AS IMAGE ───────────────────────
  async function downloadCodeImage() {
    const btn = document.querySelector('.code-sidebar .btn-outline');
    btn.textContent = '…rendering';
    btn.disabled = true;
    try {
      const card = document.getElementById('code-card');
      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true
      });
      const slug = (document.getElementById('c-caption').value.trim() || 'code-card')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const link = document.createElement('a');
      link.download = slug + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('✓ Code card downloaded at 3× resolution!');
    } catch(e) {
      toast('⚠ Export failed — check console.');
      console.error(e);
    } finally {
      btn.textContent = '⬇ Download Card as Image';
      btn.disabled = false;
    }
  }
