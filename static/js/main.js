(function initLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loading-bar');
    const percent = document.getElementById('loading-percent');
    if (!screen) return;

    document.body.classList.add('loading');

    let progress = 0;
    const interval = setInterval(() => {
        const increment = progress < 70
            ? Math.random() * 8
            : Math.random() * 15;
        progress = Math.min(progress + increment, 100);

        if (bar) bar.style.width = progress + '%';
        if (percent) percent.textContent = Math.floor(progress) + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                screen.classList.add('hidden');
                document.body.classList.remove('loading');
                setTimeout(() => screen.remove(), 500);
            }, 300);
        }
    }, 80);

    setTimeout(() => {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (percent) percent.textContent = '100%';
        setTimeout(() => {
            if (screen) {
                screen.classList.add('hidden');
                document.body.classList.remove('loading');
            }
            setTimeout(() => { if (screen) screen.remove(); }, 500);
        }, 300);
    }, 4000);
})();

/**
 * Global UI interactions: fade-in observer, scroll-to-top, nav highlighting, and particles.
 */
document.addEventListener('DOMContentLoaded', () => {
    initScrollToTop();
    initActiveNav();
    initSmoothScrollNav();
    initHamburger();
    initTiltEffect();
    initScrollAnimations();
    initGlitchCounters();
    initSkillBars();
    initFormRowAnimations();
    generateParticles();
});

/**
 * Repeated scroll animations — re-triggers on every viewport enter/exit.
 */
function initScrollAnimations() {
    const animatedEls = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedEls.forEach((el) => observer.observe(el));
}

/**
 * Glitch counter effect for stat numbers — resets on scroll out for replay.
 */
function initGlitchCounters() {
    const counters = document.querySelectorAll('.glitch-counter');
    const triggered = new WeakSet();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                runGlitchCounter(entry.target);
            } else {
                triggered.delete(entry.target);
                entry.target.textContent = '0' + (entry.target.dataset.suffix || '');
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));

    function runGlitchCounter(el) {
        if (triggered.has(el)) return;
        triggered.add(el);

        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const GLITCH_DURATION = 700;
        const SETTLE_DURATION = 400;
        const startTime = performance.now();

        function frame(now) {
            const elapsed = now - startTime;

            if (elapsed < GLITCH_DURATION) {
                const randomVal = Math.floor(Math.random() * 999);
                el.textContent = randomVal + suffix;
                requestAnimationFrame(frame);
            } else if (elapsed < GLITCH_DURATION + SETTLE_DURATION) {
                const settleProgress =
                    (elapsed - GLITCH_DURATION) / SETTLE_DURATION;
                const eased = 1 - Math.pow(1 - settleProgress, 3);
                const currentVal = Math.floor(eased * target);
                el.textContent = currentVal + suffix;
                requestAnimationFrame(frame);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(frame);
    }
}

/**
 * Contact form row animations — repeated fade-in on scroll.
 */
function initFormRowAnimations() {
    const rows = document.querySelectorAll('.anim-form-row');
    if (!rows.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    rows.forEach((row) => {
        const delay = parseInt(row.dataset.delay || '0', 10) * 100;
        row.style.transitionDelay = `${delay}ms`;
        observer.observe(row);
    });
}

/**
 * 3D tilt effect on profile orbit — follows cursor with cosmic glow.
 */
function initTiltEffect() {
    const card = document.getElementById('tilt-card');
    if (!card) {
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const inner = card.querySelector('.profile-orbit-inner');
    const glow = card.querySelector('.profile-orbit-glow');
    const MAX_TILT = 18;

    if (!inner || !glow) {
        return;
    }

    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        const tiltX = -(mouseY / (rect.height / 2)) * MAX_TILT;
        const tiltY = (mouseX / (rect.width / 2)) * MAX_TILT;

        inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        const glowX = ((mouseX / rect.width) * 100) + 50;
        const glowY = ((mouseY / rect.height) * 100) + 50;
        glow.style.background = `radial-gradient(
            circle at ${glowX}% ${glowY}%,
            rgba(0, 229, 255, 0.2),
            transparent 60%
        )`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        glow.style.background = `radial-gradient(
            circle at 30% 30%,
            rgba(0, 229, 255, 0.15),
            transparent 60%
        )`;
    });
}

/**
 * Synchronized skill bar fill + percent counter — repeats on scroll re-entry.
 */
function initSkillBars() {
    const cards = document.querySelectorAll('.skill-category-card');
    if (!cards.length) return;

    const triggered = new WeakSet();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!triggered.has(entry.target)) {
                    triggered.add(entry.target);
                    animateSkillsInCard(entry.target);
                }
            } else {
                triggered.delete(entry.target);
                entry.target.querySelectorAll('.skill-bar-fill')
                    .forEach((bar) => { bar.style.width = '0%'; });
                entry.target.querySelectorAll('.skill-percent')
                    .forEach((p) => { p.textContent = '0%'; });
            }
        });
    }, { threshold: 0.3 });

    cards.forEach((card) => observer.observe(card));

    function animateSkillsInCard(card) {
        const items = card.querySelectorAll('.skill-item');
        items.forEach((item, idx) => {
            const bar = item.querySelector('.skill-bar-fill');
            const percentEl = item.querySelector('.skill-percent');
            if (!bar || !percentEl) return;

            const target = parseInt(bar.dataset.width, 10);

            setTimeout(() => {
                const DURATION = 1000;
                const startTime = performance.now();

                function frame(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / DURATION, 1);
                    const eased = 1 - Math.pow(1 - progress, 2);
                    const currentVal = Math.round(eased * target);

                    bar.style.width = currentVal + '%';
                    percentEl.textContent = currentVal + '%';

                    if (progress < 1) requestAnimationFrame(frame);
                }
                requestAnimationFrame(frame);
            }, idx * 100);
        });
    }
}

/**
 * Highlight active nav link based on scroll position.
 */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    if (!sections.length || !navLinks.length) {
        return;
    }

    function updateActiveNav() {
        let currentSection = '';
        const scrollY = window.scrollY;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

/**
 * Mobile hamburger menu — toggle, overlay, close on link click.
 */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu(open) {
        hamburger.classList.toggle('open', open);
        navLinks.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        toggleMenu(!isOpen);
    });

    overlay.addEventListener('click', () => toggleMenu(false));

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggleMenu(false);
        }
    }, { passive: true });
}

/**
 * Smooth-scroll to homepage sections; keep address bar clean (no #hash).
 */
function initSmoothScrollNav() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!navLinks.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHomepage = document.getElementById('hero') !== null;
    const cleanPath = window.location.pathname;

    if (isHomepage) {
        navLinks.forEach((link) => {
            link.setAttribute('href', cleanPath);
        });
    }

    function scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });

        if (window.location.hash) {
            history.replaceState(null, '', cleanPath);
        }
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const sectionId = link.dataset.section;
            if (!sectionId) return;

            if (isHomepage) {
                event.preventDefault();
                scrollToSection(sectionId);
            }
        });
    });

    if (isHomepage && window.location.hash) {
        const targetId = window.location.hash.slice(1);
        requestAnimationFrame(() => {
            scrollToSection(targetId);
        });
    }
}

/**
 * Show scroll-to-top button after 300px and smooth-scroll on click.
 */
function initScrollToTop() {
    const button = document.getElementById('scroll-top');
    if (!button) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            button.hidden = false;
            button.classList.add('scroll-top--visible');
        } else {
            button.classList.remove('scroll-top--visible');
            button.hidden = true;
        }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    });
}

/**
 * Generate floating code-symbol particles across all pages.
 */
function generateParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const symbols = ['{', '}', '</', '>', '//', '#', '=', ';'];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.setAttribute('aria-hidden', 'true');
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${8 + Math.random() * 10}s`;
        document.body.appendChild(particle);
    }
}
