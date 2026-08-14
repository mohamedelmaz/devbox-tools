(function () {
  'use strict';

  async function hashText(text, algo) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest(algo, data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function hashBuffer(buffer, algo) {
    const hash = await crypto.subtle.digest(algo, buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function init() {
    const input = document.getElementById('hash-input');
    const results = document.getElementById('hash-results');
    const algos = [
      { name: 'SHA-1', algo: 'SHA-1' },
      { name: 'SHA-256', algo: 'SHA-256' },
      { name: 'SHA-384', algo: 'SHA-384' },
      { name: 'SHA-512', algo: 'SHA-512' },
    ];

    document.getElementById('btn-hash').addEventListener('click', async () => {
      const text = input.value;
      if (!text) return;
      let html = '';
      for (const a of algos) {
        try {
          const hash = await hashText(text, a.algo);
          html += `<div class="card">
            <h4>${a.name}</h4>
            <pre style="background:var(--bg);padding:12px;border-radius:var(--radius-sm);overflow:auto;font-size:0.85rem;word-break:break-all;">${DevBoxSDK.escapeHtml(hash)}</pre>
            <button class="btn btn-sm btn-secondary" data-copy="pre">Copy</button>
          </div>`;
        } catch (e) {
          html += `<div class="alert alert-error">${a.name}: ${e.message}</div>`;
        }
      }
      results.innerHTML = html;
      DevBoxSDK.initCopyButtons();
    });

    input.addEventListener('dragover', e => e.preventDefault());
    input.addEventListener('drop', async e => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const buffer = await file.arrayBuffer();
      let html = '';
      for (const a of algos) {
        try {
          const hash = await hashBuffer(buffer, a.algo);
          html += `<div class="card">
            <h4>${a.name} — ${DevBoxSDK.escapeHtml(file.name)}</h4>
            <pre style="background:var(--bg);padding:12px;border-radius:var(--radius-sm);overflow:auto;font-size:0.85rem;word-break:break-all;">${DevBoxSDK.escapeHtml(hash)}</pre>
          </div>`;
        } catch (err) {
          html += `<div class="alert alert-error">${a.name}: ${err.message}</div>`;
        }
      }
      results.innerHTML = html;
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      results.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
