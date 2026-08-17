const fs = require('fs');

const unis = JSON.parse(fs.readFileSync('universities.json', 'utf8'));
const list = Array.isArray(unis) ? unis : unis.universities;

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const rows = list.map(u => {
  const tags = (u.tags || []).slice(0, 4).map(t => `<span style="display:inline-block;margin:0 4px 4px 0;padding:2px 8px;background:#f0eeff;border-radius:20px;font-size:12px;color:#5b4fff;">${esc(t)}</span>`).join('');
  const rank = u.qsRank ? `#${u.qsRank} QS World University Rankings` : '';
  const desc = u.overview ? `<p style="font-size:14px;color:#3d3d5c;margin:6px 0 0;">${esc(u.overview.slice(0, 200))}${u.overview.length > 200 ? '…' : ''}</p>` : '';
  return `<article style="border:1px solid #e2e2ee;border-radius:12px;padding:16px 20px;margin-bottom:16px;background:#fff;">
  <h2 style="font-size:17px;font-weight:700;color:#1a1a2e;margin:0 0 2px;">${esc(u.name)}</h2>
  <p style="font-size:13px;color:#7b7b9a;margin:0 0 6px;">📍 ${esc(u.city)}, ${esc(u.country)}${rank ? ` &nbsp;·&nbsp; ${esc(rank)}` : ''}</p>
  ${tags ? `<div style="margin-bottom:6px;">${tags}</div>` : ''}
  ${desc}
</article>`;
}).join('\n');

const staticBlock = `<!-- static-uni-list-start -->
<noscript>
<div style="max-width:860px;margin:0 auto;padding:40px 20px;font-family:Inter,sans-serif;">
  <h1 style="font-family:serif;font-size:32px;color:#1a1a2e;margin-bottom:8px;">Exchange University Directory</h1>
  <p style="color:#7b7b9a;font-size:15px;margin-bottom:32px;">Browse ${list.length} universities across ${[...new Set(list.map(u=>u.country))].length} countries available for student exchange programs.</p>
${rows}
</div>
</noscript>
<!-- static-uni-list-end -->`;

let html = fs.readFileSync('index.html', 'utf8');

// Remove any previous injection
html = html.replace(/<!-- static-uni-list-start -->[\s\S]*?<!-- static-uni-list-end -->\n?/g, '');

// Inject just before </body>
html = html.replace('</body>', staticBlock + '\n</body>');

fs.writeFileSync('index.html', html);
console.log(`Injected static list of ${list.length} universities into index.html`);
