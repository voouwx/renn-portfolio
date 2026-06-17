(function () {
  'use strict';

  const COLORS = {
    violet: 'rgba(139, 124, 246, 0.35)',
    indigo: 'rgba(99, 102, 241, 0.28)',
    cyan: 'rgba(34, 211, 238, 0.22)',
    dot: 'rgba(167, 139, 250, 0.45)',
    line: 'rgba(34, 211, 238, 0.06)',
  };

  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let orbs = [];
    let particles = [];
    let mouse = { x: 0.5, y: 0.5 };
    let animationId = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initOrbs();
      initParticles();
    }

    function initOrbs() {
      orbs = [
        { x: 0.15, y: 0.2, r: Math.min(width, height) * 0.35, color: COLORS.violet, dx: 0.00008, dy: 0.00006 },
        { x: 0.85, y: 0.75, r: Math.min(width, height) * 0.3, color: COLORS.indigo, dx: -0.00006, dy: -0.00005 },
        { x: 0.55, y: 0.45, r: Math.min(width, height) * 0.25, color: COLORS.cyan, dx: 0.00005, dy: -0.00004 },
      ];
    }

    function initParticles() {
      const count = Math.min(48, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      }));
    }

    function drawOrbs() {
      orbs.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;

        if (orb.x < 0.05 || orb.x > 0.95) orb.dx *= -1;
        if (orb.y < 0.05 || orb.y > 0.95) orb.dy *= -1;

        const parallaxX = (mouse.x - 0.5) * 40;
        const parallaxY = (mouse.y - 0.5) * 40;
        const cx = orb.x * width + parallaxX;
        const cy = orb.y * height + parallaxY;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(11, 13, 20, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawParticles() {
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = COLORS.dot;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = COLORS.line;
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      drawOrbs();
      drawParticles();
      animationId = window.requestAnimationFrame(render);
    }

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX / width;
      mouse.y = event.clientY / height;
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });

    resize();
    render();

    window.addEventListener('beforeunload', () => {
      window.cancelAnimationFrame(animationId);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundCanvas);
  } else {
    initBackgroundCanvas();
  }
})();
