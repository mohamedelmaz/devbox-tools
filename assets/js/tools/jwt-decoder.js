(function () {
  'use strict';

  function base64UrlDecode(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return decodeURIComponent(atob(s).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  }

  function init() {
    const input = document.getElementById('jwt-input');
    const cards = document.getElementById('jwt-cards');

    document.getElementById('btn-decode').addEventListener('click', () => {
      const token = input.value.trim();
      const parts = token.split('.');
      if (parts.length !== 3) {
        cards.innerHTML = '<div class="alert alert-error">Invalid JWT format. Expected 3 parts separated by dots.</div>';
        return;
      }
      try {
        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        const signature = parts[2];

        let status = '';
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          status = now > payload.exp ? '<span class="alert alert-error">Expired</span>' : '<span class="alert alert-success">Valid</span>';
        }

        cards.innerHTML = `
          <div class="card">
            <h3>Header</h3>
            <pre style="background:var(--bg);padding:12px;border-radius:var(--radius-sm);overflow:auto;font-size:0.85rem;">${DevBoxSDK.escapeHtml(JSON.stringify(header, null, 2))}</pre>
          </div>
          <div class="card">
            <h3>Payload</h3>
            ${status}
            <pre style="background:var(--bg);padding:12px;border-radius:var(--radius-sm);overflow:auto;font-size:0.85rem;">${DevBoxSDK.escapeHtml(JSON.stringify(payload, null, 2))}</pre>
          </div>
          <div class="card">
            <h3>Signature</h3>
            <pre style="background:var(--bg);padding:12px;border-radius:var(--radius-sm);overflow:auto;font-size:0.85rem;word-break:break-all;">${DevBoxSDK.escapeHtml(signature)}</pre>
          </div>
        `;
      } catch (e) {
        cards.innerHTML = `<div class="alert alert-error">Error decoding JWT: ${e.message}</div>`;
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      cards.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
