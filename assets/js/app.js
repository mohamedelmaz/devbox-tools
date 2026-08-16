(function () {
  'use strict';

  const THEME_KEY = 'devbox-theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function initTheme() {
    const stored = getStoredTheme();
    applyTheme(stored || getSystemTheme());
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  function updateToggleIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function initThemeToggle() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleTheme();
        updateToggleIcon();
      });
    });
    updateToggleIcon();
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('tool-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.bento .card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        const match = !q || title.includes(q) || desc.includes(q);
        card.style.display = match ? '' : 'none';
      });
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }
  }

  // ---- Clipboard fallback ----
  function fallbackCopyText(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      console.warn('Fallback copy failed:', e);
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => fallbackCopyText(text));
    } else {
      return Promise.resolve(fallbackCopyText(text));
    }
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector(btn.getAttribute('data-copy'));
        if (!target) return;
        const text = target.value || target.textContent || '';
        if (!text) return;

        const original = btn.textContent;
        copyText(text).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = original, 1500);
        });
      });
    });
  }

  // ---- Dropdowns with guard, ARIA, and Escape key ----
  function initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = toggle.nextElementSibling;
        // ✅ Guard: check if menu exists
        if (!menu || !menu.classList) return;

        // Close other open dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          if (m !== menu) m.classList.remove('show');
        });

        const isOpen = menu.classList.contains('show');
        menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded', !isOpen);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // ✅ Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.nav-links.open').forEach(n => n.classList.remove('open'));
        document.querySelectorAll('.menu-toggle[aria-expanded="true"]').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function init() {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    initSearch();
    registerServiceWorker();
    initCopyButtons();
    initDropdowns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();