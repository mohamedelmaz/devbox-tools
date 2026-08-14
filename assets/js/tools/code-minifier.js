(function () {
  'use strict';

  function minify(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,=+\-*/<>!&|]+)\s*/g, '$1')
      .replace(/;\}/g, '}')
      .replace(/\s*([{}[\]();,.:])\s*/g, '$1')
      .trim();
  }

  function beautify(code) {
    let result = '';
    let indent = 0;
    const pad = '  ';
    const tokens = code.replace(/>/g, '>\n').replace(/</g, '\n<').replace(/\{/g, '{\n').replace(/}/g, '\n}').replace(/;/g, ';\n').split('\n');
    tokens.forEach(token => {
      const t = token.trim();
      if (!t) return;
      if (t.startsWith('}') || t.startsWith(']') || t.startsWith(')')) indent = Math.max(0, indent - 1);
      result += pad.repeat(indent) + t + '\n';
      if (t.endsWith('{') || t.endsWith('[') || t.endsWith('(')) indent++;
    });
    return result.trim();
  }

  function init() {
    const input = document.getElementById('code-input');
    const output = document.getElementById('code-output');
    const stats = document.getElementById('code-stats');
    const lang = document.getElementById('lang');

    function showStats(original, result) {
      const before = new Blob([original]).size;
      const after = new Blob([result]).size;
      const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0;
      stats.style.display = 'flex';
      stats.innerHTML = `
        <div class="stat"><span>Before: </span><strong>${DevBoxSDK.formatBytes(before)}</strong></div>
        <div class="stat"><span>After: </span><strong>${DevBoxSDK.formatBytes(after)}</strong></div>
        <div class="stat"><span>Saved: </span><strong>${saved}%</strong></div>
      `;
    }

    document.getElementById('btn-minify').addEventListener('click', () => {
      try {
        const result = minify(input.value);
        output.value = result;
        showStats(input.value, result);
      } catch (e) {
        output.value = '';
      }
    });

    document.getElementById('btn-beautify').addEventListener('click', () => {
      try {
        const result = beautify(input.value);
        output.value = result;
        showStats(input.value, result);
      } catch (e) {
        output.value = '';
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      stats.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
