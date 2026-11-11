/* Dropdown for the "About" item in the navigation bar.
   - Desktop: opens on hover (see style.css), or when clicked.
   - Phone/tablet: tap "About" to show or hide the links underneath it.
   - Pressing Esc, clicking elsewhere, or tabbing away closes it. */
(function () {
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  var hoverDesktop = window.matchMedia('(hover: hover) and (min-width: 901px)');

  function setOpen(dd, open) {
    var toggle = dd.querySelector('.nav-dropdown-toggle');
    dd.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Runs in the "capture" phase, i.e. before any other script sees the click,
  // so tapping "About" only opens the dropdown (it can never close the
  // whole phone menu by accident).
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.closest) return;

    var toggle = target.closest('.nav-dropdown-toggle');
    if (toggle) {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return; // let "open in new tab" work
      e.preventDefault();
      e.stopPropagation();
      var dd = toggle.closest('.nav-dropdown');
      setOpen(dd, !dd.classList.contains('is-open'));
      return;
    }

    // A click anywhere else closes any open dropdown
    dropdowns.forEach(function (d) {
      if (!d.contains(target)) setOpen(d, false);
    });
  }, true);

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    // Space bar also toggles it (links normally only respond to Enter)
    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        e.preventDefault();
        setOpen(dd, !dd.classList.contains('is-open'));
      }
    });

    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dd.classList.contains('is-open')) {
        setOpen(dd, false);
        toggle.focus();
      }
    });

    // Tabbing out of the dropdown closes it
    dd.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setOpen(dd, false);
    });

    // On desktop, moving the mouse away closes it
    dd.addEventListener('mouseleave', function () {
      if (hoverDesktop.matches) setOpen(dd, false);
    });
  });
})();
