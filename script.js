/* ================================================================
   script.js — Portfolio Interactions
   Aditya Chauhan | IIT Guwahati

   QUICK EDITS:
   - Hero typing roles → `roles` array  (~line 90)
   - Particle count/speed → PARTICLE_COUNT, SPEED  (~line 15)
   ================================================================ */

gsap.registerPlugin(ScrollTrigger);

// ================================================================
// 1. PARTICLE CANVAS
// ================================================================
(function () {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    const PARTICLE_COUNT = 55;
    const SPEED = 0.28;
    const CONNECT_DIST = 120;
    const COLORS = [
        'rgba(79,195,247,',   // blue
        'rgba(0,255,136,',    // green
        'rgba(189,147,249,',  // purple
    ];

    let W, H, particles = [];

    const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };

    const make = () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * SPEED,
        vy: (Math.random() - .5) * SPEED,
        r: Math.random() * 1.4 + 0.5,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const init = () => { particles = Array.from({ length: PARTICLE_COUNT }, make); };

    const draw = () => {
        ctx.clearRect(0, 0, W, H);

        // Lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].col + (1 - d / CONNECT_DIST) * 0.22 + ')';
                    ctx.lineWidth = 0.7;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + '0.65)';
            ctx.shadowBlur = 6;
            ctx.shadowColor = p.col + '1)';
            ctx.fill();
            ctx.shadowBlur = 0;

            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        });

        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); draw();
})();

// ================================================================
// 2. CURSOR GLOW (smooth follow)
// ================================================================
(function () {
    const glow = document.getElementById('cursorGlow');
    let mx = -999, my = -999, cx = -999, cy = -999;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const tick = () => {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(tick);
    };
    tick();
})();

// ================================================================
// 3. HERO TYPING EFFECT
//    ▸ Edit the `roles` array to change what cycles in the hero
// ================================================================
(function () {
    const el = document.getElementById('heroTyped');
    if (!el) return;

    const roles = [
        'B.Tech Chemical Engineer @ IIT Guwahati',
        'AI & LLM Pipeline Builder',
        'Smart India Hackathon Winner 🥇',
        'Data Science Enthusiast',
    ];

    let ri = 0, ci = 0, deleting = false;

    const type = () => {
        const cur = roles[ri];
        if (!deleting) {
            el.textContent = cur.slice(0, ci + 1);
            ci++;
            if (ci === cur.length) { deleting = true; setTimeout(type, 1800); return; }
        } else {
            el.textContent = cur.slice(0, ci - 1);
            ci--;
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
        }
        setTimeout(type, deleting ? 40 : 72);
    };

    setTimeout(type, 900);
})();

// ================================================================
// 4. FLOATING CODE ACCENT — fade in on load
// ================================================================
window.addEventListener('load', () => {
    const accent = document.querySelector('.hero-code-accent');
    if (accent) {
        gsap.to(accent, { opacity: 1, x: 0, duration: 1, delay: 1.2, ease: 'power3.out' });
    }
});

// ================================================================
// 5. NAVBAR — scroll class + active link highlighting
// ================================================================
(function () {
    const navbar = document.getElementById('navbar');
    const links = [...document.querySelectorAll('.nl')];
    const sections = [...document.querySelectorAll('section[id]')];

    // Scroll class for shadow
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Active link
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 140) current = s.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }, { passive: true });
})();

// ================================================================
// 6. HAMBURGER MENU
// ================================================================
(function () {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
        btn.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('open');
        btn.classList.remove('open');
    }));
})();

// ================================================================
// 7. GSAP SCROLL REVEAL — smooth staggered animations
// ================================================================
(function () {
    // Generic reveals
    gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 32 },
            {
                opacity: 1, y: 0,
                duration: 0.65,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 86%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // Section titles + labels (slightly faster)
    gsap.utils.toArray('.sec-title, .sec-label').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
    });

    // Skill cards stagger
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 24, scale: 0.97 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.5, delay: i * 0.09, ease: 'back.out(1.3)',
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Project cards stagger
    gsap.utils.toArray('.pcard').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.6, delay: i * 0.14, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Contact cards stagger
    gsap.utils.toArray('.ccard').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.45, delay: i * 0.08, ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
    });
})();

// ================================================================
// 8. VANILLA TILT — 3D project card hover
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 6, speed: 400, glare: true, 'max-glare': 0.1,
        });
    }
});

// ================================================================
// 9. BUTTON RIPPLE
// ================================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      transform: scale(0);
      animation: _ripple .55s ease forwards;
      pointer-events: none;
    `;
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Inject ripple keyframe once
const s = document.createElement('style');
s.textContent = `@keyframes _ripple { to { transform: scale(2.8); opacity: 0; } }`;
document.head.appendChild(s);

// ================================================================
// 10. ASK ME ANYTHING POPUP
// ================================================================
(function () {
    const btn = document.getElementById('amaBtn');
    const popup = document.getElementById('amaPopup');
    const closeBtn = document.getElementById('amaClose');
    const form = document.getElementById('amaForm');
    const successMsg = document.getElementById('amaSuccess');

    if (!btn || !popup) return;

    btn.addEventListener('click', () => {
        popup.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
        popup.classList.remove('open');
        if (successMsg) successMsg.style.display = 'none';
    });

    // Handle Formspree submission without page redirect
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    form.reset();
                    if (successMsg) successMsg.style.display = 'block';
                    setTimeout(() => {
                        popup.classList.remove('open');
                        if (successMsg) successMsg.style.display = 'none';
                    }, 3000);
                }
            } catch (err) {
                console.error('Error submitting form', err);
            }
        });
    }
})();
