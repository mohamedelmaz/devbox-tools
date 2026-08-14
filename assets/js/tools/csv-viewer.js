(function () {
  'use strict';

  function parseCSV(text, delimiter) {
    delimiter = delimiter || detectDelimiter(text);
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === delimiter) { row.push(field.trim()); field = ''; }
        else if (c === '\n' || c === '\r') {
          if (field || row.length) { row.push(field.trim()); rows.push(row); row = []; field = ''; }
        } else {
          field += c;
        }
      }
    }
    if (field || row.length) { row.push(field.trim()); rows.push(row); }
    return rows;
  }

  function detectDelimiter(text) {
    const first = text.split('\n')[0];
    if (first.includes('\t')) return '\t';
    if (first.includes(';')) return ';';
    return ',';
  }

  function init() {
    const input = document.getElementById('csv-input');
    const tableWrap = document.getElementById('csv-table-wrap');
    const table = document.getElementById('csv-table');
    const msg = document.getElementById('csv-message');

    function render() {
      const text = input.value.trim();
      if (!text) { tableWrap.style.display = 'none'; return; }
      try {
        const rows = parseCSV(text);
        if (!rows.length) { tableWrap.style.display = 'none'; return; }
        table.innerHTML = '';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        rows[0].forEach(cell => { const th = document.createElement('th'); th.textContent = cell; headRow.appendChild(th); });
        thead.appendChild(headRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        for (let i = 1; i < rows.length; i++) {
          const tr = document.createElement('tr');
          rows[i].forEach(cell => { const td = document.createElement('td'); td.textContent = cell; tr.appendChild(td); });
          tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        tableWrap.style.display = 'block';
        msg.innerHTML = `<div class="alert alert-success">Rendered ${rows.length - 1} rows.</div>`;
      } catch (e) {
        msg.innerHTML = `<div class="alert alert-error">Error: ${e.message}</div>`;
      }
    }

    document.getElementById('btn-render').addEventListener('click', render);

    function exportCSV() {
      const rows = parseCSV(input.value);
      download(rows.map(r => r.join(',')).join('\n'), 'data.csv', 'text/csv');
    }

    function exportTSV() {
      const rows = parseCSV(input.value);
      download(rows.map(r => r.join('\t')).join('\n'), 'data.tsv', 'text/tab-separated-values');
    }

    function exportJSON() {
      const rows = parseCSV(input.value);
      const headers = rows[0];
      const data = rows.slice(1).map(r => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = r[i]);
        return obj;
      });
      download(JSON.stringify(data, null, 2), 'data.json', 'application/json');
    }

    function download(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }

    document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
    document.getElementById('btn-export-tsv').addEventListener('click', exportTSV);
    document.getElementById('btn-export-json').addEventListener('click', exportJSON);
    document.getElementById('btn-clear').addEventListener('click', () => {
      input.value = '';
      tableWrap.style.display = 'none';
      msg.innerHTML = '';
    });

    input.addEventListener('dragover', e => e.preventDefault());
    input.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => { input.value = ev.target.result; render(); };
      reader.readAsText(file);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
