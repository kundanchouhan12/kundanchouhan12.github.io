/* ===== Common JS: Theme Toggle, Navbar, Utilities ===== */

(function () {
  'use strict';

  // ---- Theme Management ----
  const THEME_KEY = 'toolsite-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // Apply theme immediately to avoid flash
  applyTheme(getTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  });

  // ---- File size formatter ----
  window.formatSize = function (bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ---- Download helper ----
  window.downloadBlob = function (blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  window.downloadDataUrl = function (dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  };

  // ---- Copy to clipboard ----
  window.copyToClipboard = function (text, btnEl) {
    navigator.clipboard.writeText(text).then(() => {
      if (btnEl) {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copied!';
        btnEl.classList.add('copied');
        setTimeout(() => {
          btnEl.innerHTML = orig;
          btnEl.classList.remove('copied');
        }, 2000);
      }
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (btnEl) {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✅ Copied!';
        btnEl.classList.add('copied');
        setTimeout(() => {
          btnEl.innerHTML = orig;
          btnEl.classList.remove('copied');
        }, 2000);
      }
    });
  };

  // ---- Drag and drop helper ----
  window.initDropZone = function (dropZoneId, inputId, onFiles) {
    const zone = document.getElementById(dropZoneId);
    const input = document.getElementById(inputId);
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      onFiles(e.dataTransfer.files);
    });
    if (input) {
      input.addEventListener('change', () => onFiles(input.files));
    }
  };

  // ---- Show/Hide alert ----
  window.showAlert = function (containerId, message, type) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.className = 'alert alert-' + (type || 'info');
    el.innerHTML = (type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ') + message;
    el.classList.remove('hidden');
  };

  window.hideAlert = function (containerId) {
    const el = document.getElementById(containerId);
    if (el) el.classList.add('hidden');
  };

  // ---- Progress bar ----
  window.setProgress = function (fillId, pct) {
    const el = document.getElementById(fillId);
    if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%';
  };

})();
