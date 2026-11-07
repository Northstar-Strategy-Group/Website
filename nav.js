(function () {
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!header) return;

  // Mobile menu toggle
  if (toggle && nav) {
    const label = toggle.querySelector('.nav-toggle-label');
    const setMenuOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if (open) header.classList.remove('nav-hidden');
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('open'));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
      if (event.matches) setMenuOpen(false);
    });
  }

  // Hide on scroll down, show on scroll up
  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const menuOpen = nav?.classList.contains('open') ?? false;

      if (y > lastY && y > header.offsetHeight && !menuOpen) {
        header.classList.add('nav-hidden');     // scrolling down
      } else if (y < lastY) {
        header.classList.remove('nav-hidden');  // scrolling up
      }
      lastY = Math.max(y, 0);
      ticking = false;
    });
  }, { passive: true });
})();