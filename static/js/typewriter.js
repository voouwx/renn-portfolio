(function() {
  'use strict';

  function initTypewriter() {
    const roleEl = document.querySelector('.hero-role-text');
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (!roleEl) return;

    roleEl.textContent = '';

    const ROLES = [
      'Data Scientist',
      'TinyML Engineer',
      'Cybersecurity Enthusiast',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
      if (subtitleEl) {
        subtitleEl.classList.add('is-typing');
      }

      const currentRole = ROLES[roleIndex];

      if (!isDeleting) {
        roleEl.textContent = currentRole.slice(0, charIndex);
        charIndex += 1;
        if (charIndex > currentRole.length) {
          isDeleting = true;
          charIndex = currentRole.length;
          setTimeout(typeRole, 1800);
          return;
        }
        setTimeout(typeRole, 80);
      } else {
        roleEl.textContent = currentRole.slice(0, charIndex);
        charIndex -= 1;
        if (charIndex < 0) {
          isDeleting = false;
          charIndex = 0;
          roleIndex = (roleIndex + 1) % ROLES.length;
          setTimeout(typeRole, 300);
          return;
        }
        setTimeout(typeRole, 40);
      }
    }

    setTimeout(typeRole, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
  } else {
    initTypewriter();
  }
})();
