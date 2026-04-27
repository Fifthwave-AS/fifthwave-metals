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

    // ═══════════════════════════════════════════
    // Hero Canvas: Vertical Scan Matrix (Option 5)
    // ═══════════════════════════════════════════
    let scanX = canvas.width * 0.4;

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Move scan line left to right
        scanX += 3;
        
        // Reset scan line when it goes off screen right
        if (scanX > canvas.width + 100) {
            scanX = canvas.width * 0.4; // Start from edge of text fade
        }
        
        // Draw the trailing gradient for the scanner
        const grad = ctx.createLinearGradient(scanX - 150, 0, scanX, 0);
        grad.addColorStop(0, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0)`);
        grad.addColorStop(1, `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.25)`);
        
        ctx.fillStyle = grad;
        ctx.fillRect(scanX - 150, 0, 150, canvas.height);
        
        // Draw the bright leading edge of the scanner
        ctx.fillStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.8)`;
        ctx.fillRect(scanX, 0, 2, canvas.height);
        
        // Draw random data numbers simulating active scanning
        ctx.fillStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.6)`;
        ctx.font = '11px monospace';
        
        // Render rows of data
        for (let y = 20; y < canvas.height; y += 40) {
            // Only draw data points randomly behind the scanner
            if (Math.random() > 0.85) {
                const dataValue = (Math.random() * 100).toFixed(2);
                ctx.fillText(dataValue, scanX + 15, y);
                
                // Occasional data labels
                if (Math.random() > 0.7) {
                    const labels = ['Cu %', 'Fe', 'pH', 'Flow'];
                    const label = labels[Math.floor(Math.random() * labels.length)];
                    ctx.fillText(label, scanX + 15, y - 12);
                }
            }
        }
        
        // Subtle horizontal tracking lines
        ctx.strokeStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.05)`;
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 80) {
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.4, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
});
