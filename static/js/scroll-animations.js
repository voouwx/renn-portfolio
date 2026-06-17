(function () {
    'use strict';

    const STAGGER = {
        slide: 120,
        zoom: 140,
        form: 100,
    };

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function revealElement(el, staggerMs) {
        const index = parseInt(el.dataset.delay || '0', 10);
        if (staggerMs > 0) {
            el.style.transitionDelay = `${index * staggerMs}ms`;
        }
        el.classList.add('visible');
    }

    function observeElements(selector, options) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        const reduced = prefersReducedMotion();
        const staggerMs = options.staggerMs || 0;
        const threshold = options.threshold ?? 0.08;

        if (reduced) {
            elements.forEach((el) => revealElement(el, 0));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealElement(entry.target, staggerMs);
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold,
                rootMargin: '0px 0px -40px 0px',
            },
        );

        elements.forEach((el) => {
            observer.observe(el);
            const rect = el.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
            if (inView) {
                revealElement(el, staggerMs);
                observer.unobserve(el);
            }
        });
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = `${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = `${target}${suffix}`;
        }

        requestAnimationFrame(tick);
    }

    function initStatCounters() {
        const stats = document.querySelectorAll('.stat-number[data-count]');
        if (!stats.length) return;

        const reduced = prefersReducedMotion();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    if (reduced) {
                        el.textContent = `${el.dataset.count}${el.dataset.suffix || ''}`;
                    } else {
                        animateCounter(el);
                    }
                    observer.unobserve(el);
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -40px 0px' },
        );

        stats.forEach((stat) => {
            observer.observe(stat);
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (reduced) {
                    stat.textContent = `${stat.dataset.count}${stat.dataset.suffix || ''}`;
                } else {
                    animateCounter(stat);
                }
                observer.unobserve(stat);
            }
        });
    }

    function initScrollAnimations() {
        observeElements('.anim-fade-up', { threshold: 0.1 });
        observeElements('.anim-slide-down', { threshold: 0.08, staggerMs: STAGGER.slide });
        observeElements('.anim-zoom-in', { threshold: 0.08, staggerMs: STAGGER.zoom });
        observeElements('.anim-form-row', { threshold: 0.05, staggerMs: STAGGER.form });
        observeElements('.fade-in', { threshold: 0.08 });
        initStatCounters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();
