(function () {
  'use strict';

  const presets = {
    email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    phone: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,4}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
    url: 'https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+',
    ip: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    date: '\\d{4}-\\d{2}-\\d{2}',
  };

  function init() {
    const regexInput = document.getElementById('regex');
    const flagsInput = document.getElementById('flags');
    const testString = document.getElementById('test-string');
    const matchesDiv = document.getElementById('regex-matches');
    const presetsSel = document.getElementById('presets');

    presetsSel.addEventListener('change', () => {
      if (presets[presetsSel.value]) {
        regexInput.value = presets[presetsSel.value];
      }
    });

    document.getElementById('btn-test').addEventListener('click', () => {
      try {
        const pattern = new RegExp(regexInput.value, flagsInput.value);
        const text = testString.value;
        const matches = [];
        if (flagsInput.value.includes('g')) {
          let m;
          while ((m = pattern.exec(text)) !== null) {
            matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
          }
        } else {
          const m = pattern.exec(text);
          if (m) matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
        }
        let html = '';
        if (matches.length) {
          html = '<h4>Matches:</h4><ul>';
          matches.forEach((m, i) => {
            html += `<li><strong>${DevBoxSDK.escapeHtml(m.text)}</strong> at index ${m.index}`;
            if (m.groups.length) html += ` — groups: ${m.groups.map(g => DevBoxSDK.escapeHtml(g)).join(', ')}`;
            html += '</li>';
          });
          html += '</ul>';
        } else {
          html = '<div class="alert alert-info">No matches found.</div>';
        }
        matchesDiv.innerHTML = html;
      } catch (e) {
        matchesDiv.innerHTML = `<div class="alert alert-error">Invalid regex: ${e.message}</div>`;
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      regexInput.value = '';
      flagsInput.value = 'g';
      testString.value = '';
      matchesDiv.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
