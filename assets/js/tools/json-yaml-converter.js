(function () {
  'use strict';

  function yamlStringify(obj, indent) {
    indent = indent || 2;
    const pad = ' '.repeat(indent);
    const lines = [];
    const stack = [{ obj, prefix: '' }];

    while (stack.length) {
      const { obj, prefix } = stack.pop();
      if (Array.isArray(obj)) {
        for (let i = obj.length - 1; i >= 0; i--) {
          const item = obj[i];
          const key = `-`;
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            stack.push({ obj: item, prefix: prefix + pad + '  ' });
            lines.push(`${prefix}${key}`);
            for (const k in item) {
              lines.push(`${prefix + pad}${k}: ${yamlValue(item[k])}`);
            }
          } else {
            lines.push(`${prefix}${key} ${yamlValue(item)}`);
          }
        }
      } else if (obj && typeof obj === 'object') {
        const entries = Object.entries(obj);
        for (let i = entries.length - 1; i >= 0; i--) {
          const [k, v] = entries[i];
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            stack.push({ obj: v, prefix: prefix + pad });
            lines.push(`${prefix}${k}:`);
          } else if (Array.isArray(v)) {
            stack.push({ obj: v, prefix: prefix + pad + '  ' });
            lines.push(`${prefix}${k}:`);
          } else {
            lines.push(`${prefix}${k}: ${yamlValue(v)}`);
          }
        }
      }
    }

    return lines.join('\n');
  }

  function yamlValue(val) {
    if (val === null) return 'null';
    if (val === true) return 'true';
    if (val === false) return 'false';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string') {
      if (val === '' || val.includes(':') || val.includes('#') || val.includes('\n') || /^[,\[\]{}&*?|>!'"%@`]/.test(val)) {
        return `"${val.replace(/"/g, '\\"')}"`;
      }
      return val;
    }
    return String(val);
  }

  function yamlParse(text) {
    text = text.replace(/\r\n/g, '\n').trim();
    if (!text) return {};
    return parseYamlValue(text, 0, 0).value;
  }

  function parseYamlValue(text, start, baseIndent) {
    const trimmed = text.substring(start).trim();
    if (!trimmed.length) return { value: null, pos: start };

    if (trimmed.startsWith('- ')) {
      return parseYamlArray(text, start, baseIndent);
    }
    if (trimmed.includes(':') && !trimmed.startsWith('[') && !trimmed.startsWith('{')) {
      return parseYamlObject(text, start, baseIndent);
    }
    if (trimmed.startsWith('[')) {
      return parseInlineArray(text, start);
    }
    return parseScalar(text, start);
  }

  function parseYamlArray(text, start, baseIndent) {
    const arr = [];
    let pos = start;
    while (pos < text.length) {
      const lineStart = text.substring(pos).search(/\S/);
      if (lineStart === -1) break;
      const line = text.substring(pos + lineStart);
      if (!line.startsWith('- ')) break;
      const content = line.substring(2).trim();
      if (content === '') {
        arr.push(null);
        pos += lineStart + 2;
      } else if (content.includes(':')) {
        const obj = parseYamlObject(text, pos + lineStart, baseIndent + 1);
        arr.push(obj.value);
        pos = obj.pos;
      } else {
        const scalar = parseScalar(text, pos + lineStart);
        arr.push(scalar.value);
        pos = scalar.pos;
      }
      const next = text.indexOf('\n', pos);
      if (next === -1) break;
      pos = next + 1;
    }
    return { value: arr, pos: pos };
  }

  function parseYamlObject(text, start, baseIndent) {
    const obj = {};
    let pos = start;
    while (pos < text.length) {
      const lineStart = text.substring(pos).search(/\S/);
      if (lineStart === -1) break;
      const line = text.substring(pos + lineStart);
      if (lineStart < baseIndent) break;
      const colon = line.indexOf(':');
      if (colon === -1) break;
      const key = line.substring(0, colon).trim();
      const rest = line.substring(colon + 1).trim();
      if (rest === '' || rest === '|' || rest === '>') {
        const next = text.indexOf('\n', pos + lineStart);
        const nextLine = text.substring(next + 1);
        const nextIndent = nextLine.search(/\S/);
        if (nextIndent > baseIndent) {
          const val = parseYamlValue(text, next + 1, nextIndent);
          obj[key] = val.value;
          pos = val.pos;
        } else {
          obj[key] = null;
          pos = next + 1;
        }
      } else {
        const val = parseScalar(text, pos + lineStart + colon + 1);
        obj[key] = val.value;
        pos = val.pos;
      }
      const nl = text.indexOf('\n', pos);
      if (nl === -1) break;
      pos = nl + 1;
    }
    return { value: obj, pos: pos };
  }

  function parseInlineArray(text, start) {
    const end = text.indexOf(']', start);
    if (end === -1) return { value: text.substring(start).trim(), pos: text.length };
    try {
      return { value: JSON.parse(text.substring(start, end + 1)), pos: end + 1 };
    } catch {
      return { value: text.substring(start, end + 1), pos: end + 1 };
    }
  }

  function parseScalar(text, start) {
    const rest = text.substring(start).trim();
    const lineEnd = rest.indexOf('\n');
    const val = lineEnd === -1 ? rest : rest.substring(0, lineEnd);
    let parsed;
    if (val === 'null') parsed = null;
    else if (val === 'true') parsed = true;
    else if (val === 'false') parsed = false;
    else if (!isNaN(val) && val !== '') parsed = Number(val);
    else parsed = val.replace(/^["']|["']$/g, '');
    const pos = start + rest.indexOf(val) + val.length;
    return { value: parsed, pos: pos };
  }

  function init() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const msg = document.getElementById('message');
    let direction = 'json2yaml';

    document.getElementById('dir-json2yaml').addEventListener('click', function () {
      direction = 'json2yaml';
      this.classList.add('btn');
      this.classList.remove('btn-secondary');
      document.getElementById('dir-yaml2json').classList.add('btn-secondary');
      document.getElementById('dir-yaml2json').classList.remove('btn');
    });

    document.getElementById('dir-yaml2json').addEventListener('click', function () {
      direction = 'yaml2json';
      this.classList.add('btn');
      this.classList.remove('btn-secondary');
      document.getElementById('dir-json2yaml').classList.add('btn-secondary');
      document.getElementById('dir-json2yaml').classList.remove('btn');
    });

    document.getElementById('btn-convert').addEventListener('click', () => {
      try {
        if (direction === 'json2yaml') {
          const parsed = JSON.parse(input.value);
          output.value = yamlStringify(parsed);
          msg.innerHTML = '<div class="alert alert-success">Converted to YAML.</div>';
        } else {
          const parsed = yamlParse(input.value);
          output.value = JSON.stringify(parsed, null, 2);
          msg.innerHTML = '<div class="alert alert-success">Converted to JSON.</div>';
        }
      } catch (e) {
        msg.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
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
