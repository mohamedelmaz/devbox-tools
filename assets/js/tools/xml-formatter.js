(function () {
  'use strict';

  function init() {
    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');
    const msg = document.getElementById('xml-message');
    const indent = document.getElementById('indent');

    function getIndent() {
      return indent.value === 'tab' ? '\t' : parseInt(indent.value, 10);
    }

    function formatXml(xml) {
      const PADDING = getIndent();
      let formatted = '';
      let pad = 0;
      const tokens = xml.replace(/>\s+</g, '><').replace(/</g, '\n<').replace(/>/g, '>\n').split('\n').filter(s => s.trim());
      tokens.forEach(token => {
        if (token.match(/^<\/\w/)) pad -= 1;
        formatted += PADDING.repeat(Math.max(0, pad)) + token.trim() + '\n';
        if (token.match(/^<\w[^>]*[^/]>.*$/) && !token.match(/^<\w[^>]*\/>/)) pad += 1;
      });
      return formatted.trim();
    }

    function validateXml(xml) {
      const stack = [];
      const regex = /<\/?([a-zA-Z_][\w.-]*)[^>]*>/g;
      let match;
      while ((match = regex.exec(xml)) !== null) {
        const tag = match[1];
        const isClosing = match[0].startsWith('</');
        const isSelfClosing = match[0].endsWith('/>');
        if (isSelfClosing) continue;
        if (isClosing) {
          if (stack.length === 0 || stack[stack.length - 1] !== tag) {
            return `Unexpected closing tag </${tag}> at position ${match.index}`;
          }
          stack.pop();
        } else {
          stack.push(tag);
        }
      }
      if (stack.length > 0) {
        return `Unclosed tag: <${stack[stack.length - 1]}>`;
      }
      return null;
    }

    document.getElementById('btn-format').addEventListener('click', () => {
      try {
        output.value = formatXml(input.value);
        msg.innerHTML = '<div class="alert alert-success">Formatted.</div>';
      } catch (e) {
        msg.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
      }
    });

    document.getElementById('btn-validate').addEventListener('click', () => {
      const err = validateXml(input.value);
      if (err) {
        msg.innerHTML = `<div class="alert alert-error">${err}</div>`;
      } else {
        msg.innerHTML = '<div class="alert alert-success">XML structure is valid. ✓</div>';
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      msg.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
