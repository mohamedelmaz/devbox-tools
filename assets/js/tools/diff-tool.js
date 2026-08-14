(function () {
  'use strict';

  function lcs(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    const result = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        result.unshift({ type: 'same', value: a[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: 'added', value: b[j - 1] });
        j--;
      } else {
        result.unshift({ type: 'removed', value: a[i - 1] });
        i--;
      }
    }
    return result;
  }

  function init() {
    const a = document.getElementById('text-a');
    const b = document.getElementById('text-b');
    const output = document.getElementById('diff-output');
    const stats = document.getElementById('diff-stats');

    document.getElementById('btn-compare').addEventListener('click', () => {
      const linesA = a.value.split('\n');
      const linesB = b.value.split('\n');
      const diff = lcs(linesA, linesB);
      let added = 0, removed = 0;
      let html = '<div style="font-family:var(--font-mono);font-size:0.85rem;line-height:1.8;">';
      diff.forEach(item => {
        if (item.type === 'same') {
          html += `<div style="color:var(--text-muted);">  ${DevBoxSDK.escapeHtml(item.value)}</div>`;
        } else if (item.type === 'added') {
          html += `<div style="background:rgba(16,185,129,0.12);color:var(--success);">+ ${DevBoxSDK.escapeHtml(item.value)}</div>`;
          added++;
        } else {
          html += `<div style="background:rgba(239,68,68,0.12);color:var(--error);">- ${DevBoxSDK.escapeHtml(item.value)}</div>`;
          removed++;
        }
      });
      html += '</div>';
      output.innerHTML = html;
      stats.style.display = 'flex';
      stats.innerHTML = `
        <div class="stat"><span>Added: </span><strong>${added}</strong></div>
        <div class="stat"><span>Removed: </span><strong>${removed}</strong></div>
      `;
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      a.value = '';
      b.value = '';
      output.innerHTML = '';
      stats.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
