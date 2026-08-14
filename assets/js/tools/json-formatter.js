(function () {
  'use strict';

  function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const msg = document.getElementById('json-message');
    const stats = document.getElementById('json-stats');
    const indent = document.getElementById('indent');

    function getIndent() {
      return indent.value === 'tab' ? '\t' : parseInt(indent.value, 10);
    }

    function showMessage(text, type) {
      msg.innerHTML = text ? `<div class="alert alert-${type}">${text}</div>` : '';
    }

    function showStats(obj) {
      const json = JSON.stringify(obj);
      const keys = countKeys(obj);
      const depth = getDepth(obj);
      stats.style.display = 'flex';
      stats.innerHTML = `
        <div class="stat"><span>Keys: </span><strong>${keys}</strong></div>
        <div class="stat"><span>Depth: </span><strong>${depth}</strong></div>
        <div class="stat"><span>Size: </span><strong>${DevBoxSDK.formatBytes(new Blob([json]).size)}</strong></div>
      `;
    }

    function countKeys(obj) {
      let count = 0;
      if (obj && typeof obj === 'object') {
        for (const k in obj) {
          count++;
          if (obj[k] && typeof obj[k] === 'object') {
            count += countKeys(obj[k]);
          }
        }
      }
      return count;
    }

    function getDepth(obj) {
      if (!obj || typeof obj !== 'object') return 0;
      let max = 0;
      for (const k in obj) {
        const d = getDepth(obj[k]) + 1;
        if (d > max) max = d;
      }
      return max;
    }

    document.getElementById('btn-format').addEventListener('click', () => {
      try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, getIndent());
        showMessage('Formatted successfully.', 'success');
        showStats(parsed);
      } catch (e) {
        output.value = '';
        showMessage(`Error at line ${getLineNumber(input.value, e)}: ${e.message}`, 'error');
        stats.style.display = 'none';
      }
    });

    document.getElementById('btn-minify').addEventListener('click', () => {
      try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
        showMessage('Minified successfully.', 'success');
        showStats(parsed);
      } catch (e) {
        output.value = '';
        showMessage(`Error: ${e.message}`, 'error');
        stats.style.display = 'none';
      }
    });

    document.getElementById('btn-validate').addEventListener('click', () => {
      try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, getIndent());
        showMessage('Valid JSON! ✓', 'success');
        showStats(parsed);
      } catch (e) {
        output.value = '';
        showMessage(`Invalid JSON at line ${getLineNumber(input.value, e)}: ${e.message}`, 'error');
        stats.style.display = 'none';
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      showMessage('');
      stats.style.display = 'none';
    });
  }

  function getLineNumber(text, error) {
    const pos = error.message.match(/position (\d+)/);
    if (!pos) return '?';
    const index = parseInt(pos[1], 10);
    return text.substring(0, index).split('\n').length;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
