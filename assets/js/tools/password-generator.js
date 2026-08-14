(function () {
  'use strict';

  function generatePassword(length, upper, lower, numbers, symbols) {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return '';

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(n => chars[n % chars.length]).join('');
  }

  function strength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 24) score++;
    if (score <= 2) return { label: 'Weak', color: 'var(--error)' };
    if (score <= 4) return { label: 'Medium', color: 'var(--warning)' };
    if (score <= 6) return { label: 'Strong', color: 'var(--success)' };
    return { label: 'Very Strong', color: '#10b981' };
  }

  function init() {
    const length = document.getElementById('length');
    const lengthVal = document.getElementById('length-val');
    const output = document.getElementById('password-output');
    const meter = document.getElementById('strength-meter');

    length.addEventListener('input', () => { lengthVal.textContent = length.value; });

    document.getElementById('btn-generate').addEventListener('click', () => {
      const pwd = generatePassword(
        parseInt(length.value, 10),
        document.getElementById('chk-upper').checked,
        document.getElementById('chk-lower').checked,
        document.getElementById('chk-numbers').checked,
        document.getElementById('chk-symbols').checked
      );
      output.value = pwd;
      const s = strength(pwd);
      meter.innerHTML = `<div style="display:flex;align-items:center;gap:12px;">
        <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden;">
          <div style="width:${(s.label === 'Weak' ? 25 : s.label === 'Medium' ? 50 : s.label === 'Strong' ? 75 : 100)}%;height:100%;background:${s.color};border-radius:4px;"></div>
        </div>
        <span style="font-size:0.85rem;font-weight:600;color:${s.color};">${s.label}</span>
      </div>`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
