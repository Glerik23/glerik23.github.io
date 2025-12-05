/**
 * Particles background effect
 * @module particles
 */

/** Canvas element */
let canvas = null;

/** Canvas context */
let ctx = null;

/** Particles array */
let particles = [];

/** Animation frame ID */
let animationId = null;

/** Mouse position */
let mouse = { x: null, y: null, radius: 150 };

/** Configuration */
const CONFIG = {
    particleCount: 50,
    particleMinSize: 1,
    particleMaxSize: 3,
    particleColor: 'rgba(145, 70, 255, 0.5)',
    lineColor: 'rgba(145, 70, 255, 0.1)',
    lineMaxDistance: 150,
    speed: 0.5,
    enableOnMobile: false,
    mobileBreakpoint: 768
};

/**
 * Particle class
 */
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize) + CONFIG.particleMinSize;
        this.speedX = (Math.random() - 0.5) * CONFIG.speed;
        this.speedY = (Math.random() - 0.5) * CONFIG.speed;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    update() {
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;

                this.x -= directionX * force * 2;
                this.y -= directionY * force * 2;
            }
        }

        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.particleColor;
        ctx.fill();
    }
}

/**
 * Create particles
 */
function createParticles() {
    particles = [];
    const count = window.innerWidth < CONFIG.mobileBreakpoint ?
        Math.floor(CONFIG.particleCount / 2) : CONFIG.particleCount;

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

/**
 * Draw connections between particles
 */
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.lineMaxDistance) {
                const opacity = 1 - (distance / CONFIG.lineMaxDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(145, 70, 255, ${opacity * 0.1})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

/**
 * Animation loop
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();

    animationId = requestAnimationFrame(animate);
}

/**
 * Handle resize
 */
function handleResize() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles();
}

/**
 * Handle mouse move
 * @param {MouseEvent} e - Mouse event
 */
function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

/**
 * Handle mouse leave
 */
function handleMouseLeave() {
    mouse.x = null;
    mouse.y = null;
}

/**
 * Check if should run on current device
 * @returns {boolean}
 */
function shouldRun() {
    if (!CONFIG.enableOnMobile && window.innerWidth < CONFIG.mobileBreakpoint) {
        return false;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
    }

    return true;
}

/**
 * Initialize particles
 */
export function initParticles() {
    if (!shouldRun()) return;

    // Create canvas
    canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.className = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    createParticles();

    // Start animation
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Pause animation when tab is hidden (performance optimization)
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Handle visibility change - pause animation when tab is hidden
 */
function handleVisibilityChange() {
    if (document.hidden) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    } else {
        if (!animationId && canvas) {
            animate();
        }
    }
}

/**
 * Destroy particles
 */
export function destroyParticles() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvas = null;
        ctx = null;
    }

    particles = [];

    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}
