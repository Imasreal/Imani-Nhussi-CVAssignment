// Dark mode with persistence and prefer-color-scheme fallback
(function() {
  const STORAGE_KEY = 'cv_dark_mode';
  const body = document.body;
  const toggleBtn = document.getElementById('dark-toggle');

  function applyDark(isDark) {
    if (isDark) {
      body.classList.add('dark');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.textContent = 'Light Mode';
    } else {
      body.classList.remove('dark');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.textContent = 'Toggle Dark Mode';
    }
  }

  // read saved preference
  function getSavedPreference() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') return true;
      if (saved === 'false') return false;
    } catch (e) {
      // ignore localStorage errors (e.g., private mode)
    }
    // fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // toggle (and save)
  function toggle() {
    const isNowDark = !body.classList.contains('dark');
    applyDark(isNowDark);
    try { localStorage.setItem(STORAGE_KEY, isNowDark ? 'true' : 'false'); } catch (e) {}
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // if button missing, nothing to do
    if (!toggleBtn) return;

    // apply initial state
    applyDark(getSavedPreference());

    // click handler
    toggleBtn.addEventListener('click', toggle);

    // also react to system changes (optional)
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', function(e) {
        // only change if user has not set an explicit preference in localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved === null) {
            applyDark(e.matches);
          }
        } catch (err) {
          // ignore
        }
      });
    }
  });
})();

