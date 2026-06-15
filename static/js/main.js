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
    initFadeInObserver();
    initScrollToTop();
    initActiveNav();
    initSmoothScrollNav();
    initSkillBars();
    generateParticles();
});

/**
 * Animate skill progress bars when they enter the viewport.
 */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width || 80;
                setTimeout(() => {
                    bar.style.width = `${targetWidth}%`;
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach((bar) => observer.observe(bar));
}

/**
 * Scroll-triggered fade-in animation via IntersectionObserver.
 */
function initFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 },
    );

    fadeElements.forEach((el) => observer.observe(el));
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
 * Smooth-scroll to homepage sections when nav links are clicked.
 */
function initSmoothScrollNav() {
    const navLinks = document.querySelectorAll('.nav-link[href*="#"]');
    if (!navLinks.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.includes('#')) {
                return;
            }

            const targetId = href.split('#')[1];
            const target = document.getElementById(targetId);
            if (!target) {
                return;
            }

            const isHomepage = document.getElementById('hero') !== null;
            if (!isHomepage) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        });
    });
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
