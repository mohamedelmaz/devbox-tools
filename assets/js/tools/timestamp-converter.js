(function () {
  'use strict';

  function relativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  }

  function init() {
    const unixInput = document.getElementById('unix-input');
    const unixResult = document.getElementById('unix-result');
    const humanInput = document.getElementById('human-input');
    const humanResult = document.getElementById('human-result');

    document.getElementById('btn-unix2human').addEventListener('click', () => {
      const ts = parseFloat(unixInput.value);
      if (isNaN(ts)) { unixResult.innerHTML = '<div class="alert alert-error">Enter a valid timestamp.</div>'; return; }
      const date = new Date((ts > 1e12 ? ts : ts * 1000));
      unixResult.innerHTML = `
        <div class="alert alert-success">
          <strong>ISO 8601:</strong> ${date.toISOString()}<br>
          <strong>Local:</strong> ${date.toLocaleString()}<br>
          <strong>Relative:</strong> ${relativeTime(date)}
        </div>`;
    });

    document.getElementById('btn-human2unix').addEventListener('click', () => {
      const val = humanInput.value;
      if (!val) { humanResult.innerHTML = '<div class="alert alert-error">Select a date.</div>'; return; }
      const date = new Date(val);
      const unix = Math.floor(date.getTime() / 1000);
      humanResult.innerHTML = `<div class="alert alert-success"><strong>Unix:</strong> ${unix}</div>`;
    });

    document.getElementById('btn-now').addEventListener('click', () => {
      const now = Math.floor(Date.now() / 1000);
      unixInput.value = now;
      document.getElementById('btn-unix2human').click();
      humanInput.value = new Date().toISOString().slice(0, 16);
      document.getElementById('btn-human2unix').click();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
