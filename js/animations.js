/**
 * Scroll animations using Intersection Observer
 * @module animations
 */

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize scroll reveal animations
 */
export function initScrollAnimations() {
    // Skip if user prefers reduced motion
    if (prefersReducedMotion()) {
        // Make all elements visible immediately
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animated');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const delay = entry.target.dataset.animationDelay || 0;

                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        // Add stagger delay to groups
        if (!el.dataset.animationDelay && el.closest('.links-grid')) {
            el.dataset.animationDelay = index * 50;
        }
        observer.observe(el);
    });
}

/**
 * Add animation classes to elements
 */
export function setupAnimationClasses() {
    // Skip if reduced motion
    if (prefersReducedMotion()) return;

    // Link cards - fade in up
    document.querySelectorAll('.link-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'animate-fade-up');
        card.dataset.animationDelay = index * 50;
    });

    // Content cards - fade in
    document.querySelectorAll('.content-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'animate-fade-up');
        card.dataset.animationDelay = index * 100;
    });

    // Skills card
    const skillsCard = document.querySelector('.skills-card');
    if (skillsCard) {
        skillsCard.classList.add('animate-on-scroll', 'animate-fade-up');
    }

    // Timeline items (if exists)
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.add('animate-on-scroll', 'animate-fade-up');
        item.dataset.animationDelay = index * 150;
    });

    // Stats
    document.querySelectorAll('.stat-card').forEach((stat, index) => {
        stat.classList.add('animate-on-scroll', 'animate-scale-in');
        stat.dataset.animationDelay = index * 100;
    });
}
