(function () {
  'use strict';

  function initFocusTyped() {
    const el = document.querySelector('.hero-focus-typed');
    if (!el || typeof Typed === 'undefined') {
      return;
    }

    /* eslint-disable no-new */
    new Typed(el, {
      strings: ['Data Science', 'AI Security', 'TinyML', 'MLOps'],
      typeSpeed: 75,
      backSpeed: 45,
      backDelay: 1800,
      startDelay: 600,
      loop: true,
      smartBackspace: true,
      showCursor: true,
      cursorChar: '|',
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFocusTyped);
  } else {
    initFocusTyped();
  }
})();
