// Homepage only (desktop widths): when you scroll DOWN, the navbar moves up at
// exactly the same speed as the rest of the page, so it looks like it is sliding
// away together with the content over the banner photo. When you scroll UP it
// slides back in on its own, as before. On phones and tablets (900px and below)
// this file does nothing and nav.js behaves as usual.
(function () {
  const header = document.getElementById('site-header');
  if (!header || !document.body.classList.contains('home-page')) return;

  const desktop = window.matchMedia('(min-width: 901px)');
  let lastY = Math.max(window.scrollY, 0);
  let offset = 0;        // how far the navbar has moved up (0 = fully visible)
  let ticking = false;

  function reset() {
    offset = 0;
    header.style.transition = '';
    header.style.transform = '';
  }

  function update() {
    ticking = false;
    const y = Math.max(window.scrollY, 0);
    const delta = y - lastY;
    lastY = y;

    if (!desktop.matches) { reset(); return; }

    if (delta > 0) {
      // Scrolling down: follow the page, no animation
      offset = Math.min(header.offsetHeight, offset + delta);
      header.style.transition = 'none';
      header.style.transform = 'translateY(' + (-offset) + 'px)';
    } else if (delta < 0 && offset > 0) {
      // Scrolling up: slide back in (uses the animation from style.css)
      offset = 0;
      header.style.transition = '';
      header.style.transform = 'translateY(0)';
    }
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  desktop.addEventListener('change', reset);
})();
