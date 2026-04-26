document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════
    // Navbar scroll effect
    // ═══════════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ═══════════════════════════════════════════
    // Smooth scrolling for anchor links
    // ═══════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ═══════════════════════════════════════════
    // Intersection Observer for scroll animations
    // ═══════════════════════════════════════════
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

    // Trigger hero animations immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // ═══════════════════════════════════════════
    // Hero Canvas: Tech/Automation Overlay
    // ═══════════════════════════════════════════
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COPPER = { r: 224, g: 108, b: 45 };
    const COPPER_LIGHT = { r: 255, g: 139, b: 77 };

    function resize() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Scanning analysis nodes — positioned in the right half of the hero
    const nodes = [];
    const NODE_COUNT = 18;

    function initNodes() {
        nodes.length = 0;
        const w = canvas.width;
        const h = canvas.height;
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: w * 0.4 + Math.random() * w * 0.55,
                y: h * 0.1 + Math.random() * h * 0.8,
                baseR: 2 + Math.random() * 3,
                r: 2 + Math.random() * 3,
                pulseSpeed: 0.5 + Math.random() * 1.5,
                pulsePhase: Math.random() * Math.PI * 2,
                opacity: 0.25 + Math.random() * 0.35,
                // Each node has a data label
                label: ['Cu 0.6%', 'pH 2.1', 'T 42°C', 'K -11.2', 'ε 0.38', 'Δσ 2.4', 'Q 15L/h', 'Fe³⁺', 'Ag ppm', 'μ 0.82', 'P 1.2atm', 'η 87%', 'ρ 2.7', 'dP/dt', 'SG 3.1', 'Eh 450', 'DO 3.2', 'SO₄²⁻'][i],
                showLabel: Math.random() > 0.5,
                driftX: (Math.random() - 0.5) * 0.15,
                driftY: (Math.random() - 0.5) * 0.1,
            });
        }
    }
    initNodes();
    window.addEventListener('resize', initNodes);

    // Connections between nearby nodes
    function getConnections() {
        const conns = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < canvas.width * 0.2) {
                    conns.push({ a: i, b: j, dist });
                }
            }
        }
        return conns;
    }

    // Horizontal scan line
    let scanY = 0;

    function drawFrame(time) {
        const t = time * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ── Horizontal scan line (sweeps down slowly) ──
        scanY = (t * 30) % canvas.height;
        const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
        scanGrad.addColorStop(0, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0)`);
        scanGrad.addColorStop(0.5, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.12)`);
        scanGrad.addColorStop(1, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0)`);
        ctx.fillStyle = scanGrad;
        ctx.fillRect(canvas.width * 0.35, scanY - 30, canvas.width * 0.65, 60);

        // ── Subtle grid lines ──
        ctx.strokeStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.04)`;
        ctx.lineWidth = 0.5;
        const gridSpacing = 60;
        for (let x = canvas.width * 0.4; x < canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.4, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // ── Update and draw nodes ──
        nodes.forEach((n, i) => {
            // Gentle drift
            n.x += n.driftX;
            n.y += n.driftY;
            if (n.x < canvas.width * 0.35 || n.x > canvas.width) n.driftX *= -1;
            if (n.y < 0 || n.y > canvas.height) n.driftY *= -1;

            // Pulse
            const pulse = Math.sin(t * n.pulseSpeed + n.pulsePhase);
            n.r = n.baseR + pulse * 1.5;
            const alpha = n.opacity + pulse * 0.1;

            // Glow
            const glowGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
            glowGrad.addColorStop(0, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, ${alpha * 0.3})`);
            glowGrad.addColorStop(1, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0)`);
            ctx.fillStyle = glowGrad;
            ctx.fillRect(n.x - n.r * 6, n.y - n.r * 6, n.r * 12, n.r * 12);

            // Core dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, Math.max(n.r, 1), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, ${alpha})`;
            ctx.fill();

            // Outer ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 3 + pulse * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COPPER_LIGHT.r},${COPPER_LIGHT.g},${COPPER_LIGHT.b}, ${alpha * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Data labels on select nodes
            if (n.showLabel) {
                ctx.font = '600 9px Inter, sans-serif';
                ctx.fillStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, ${alpha * 0.7})`;
                ctx.fillText(n.label, n.x + n.r * 4, n.y + 3);
            }
        });

        // ── Draw connections ──
        const conns = getConnections();
        conns.forEach(c => {
            const a = nodes[c.a];
            const b = nodes[c.b];
            const lineAlpha = 0.08 * (1 - c.dist / (canvas.width * 0.2));

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Traveling data packet along some connections
            if (c.a % 3 === 0) {
                const progress = (t * 0.3 + c.a * 0.5) % 1;
                const px = a.x + (b.x - a.x) * progress;
                const py = a.y + (b.y - a.y) * progress;
                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${COPPER_LIGHT.r},${COPPER_LIGHT.g},${COPPER_LIGHT.b}, ${lineAlpha * 4})`;
                ctx.fill();
            }
        });

        // ── Crosshair targeting reticle on a key node ──
        const target = nodes[2];
        const reticleSize = 18 + Math.sin(t * 2) * 3;
        ctx.strokeStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.2)`;
        ctx.lineWidth = 0.8;
        // Top
        ctx.beginPath(); ctx.moveTo(target.x, target.y - reticleSize); ctx.lineTo(target.x, target.y - reticleSize * 0.5); ctx.stroke();
        // Bottom
        ctx.beginPath(); ctx.moveTo(target.x, target.y + reticleSize); ctx.lineTo(target.x, target.y + reticleSize * 0.5); ctx.stroke();
        // Left
        ctx.beginPath(); ctx.moveTo(target.x - reticleSize, target.y); ctx.lineTo(target.x - reticleSize * 0.5, target.y); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(target.x + reticleSize, target.y); ctx.lineTo(target.x + reticleSize * 0.5, target.y); ctx.stroke();
        // Corner brackets
        const bSize = 8;
        ctx.strokeStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.15)`;
        // Top-left
        ctx.beginPath(); ctx.moveTo(target.x - reticleSize, target.y - reticleSize); ctx.lineTo(target.x - reticleSize + bSize, target.y - reticleSize); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(target.x - reticleSize, target.y - reticleSize); ctx.lineTo(target.x - reticleSize, target.y - reticleSize + bSize); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(target.x + reticleSize, target.y - reticleSize); ctx.lineTo(target.x + reticleSize - bSize, target.y - reticleSize); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(target.x + reticleSize, target.y - reticleSize); ctx.lineTo(target.x + reticleSize, target.y - reticleSize + bSize); ctx.stroke();

        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
});
