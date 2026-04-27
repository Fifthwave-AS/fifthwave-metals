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
    // Hero Canvas: Vertical Scan Matrix & Background Rotation
    // ═══════════════════════════════════════════
    let scanX = canvas.width * 0.4;
    
    // Array of images representing Options 1-4 from the preview
    const bgImages = [
        'assets/mine_option_a.png', // Currently displayed (Option 3)
        'assets/mine_option_b.png', // Option 2
        'assets/mine_option_c.jpg', // Option 1
        'assets/mine_option_d.jpg'  // Option 4
    ];
    let currentBgIndex = 0;

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Move scan line left to right
        scanX += 3;
        
        // Reset scan line when it goes off screen right
        if (scanX > canvas.width + 100) {
            scanX = canvas.width * 0.4; // Start from edge of text fade
            
            // Rotate background image
            currentBgIndex = (currentBgIndex + 1) % bgImages.length;
            const heroPhoto = document.querySelector('.hero-photo');
            if (heroPhoto) {
                heroPhoto.style.backgroundImage = `url('${bgImages[currentBgIndex]}')`;
            }
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
        
        // Render stable rows of data (no vertical jittering)
        const dataLabels = [
            'Cu 0.61%', 'Fe 1.2%', 'pH 2.1', 'Flow 14L/h', 
            'Temp 42°C', 'Yield 87%', 'Dens 2.4', 'Ox 450mV'
        ];
        
        for (let i = 0; i < dataLabels.length; i++) {
            const y = 80 + (i * 60); // Evenly spaced vertically
            
            // Draw the data label tracking the scanner
            ctx.fillText(dataLabels[i], scanX + 15, y);
            
            // Draw a tiny trailing dot
            ctx.beginPath();
            ctx.arc(scanX + 8, y - 3, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COPPER_LIGHT.r},${COPPER_LIGHT.g},${COPPER_LIGHT.b}, 0.8)`;
            ctx.fill();
            ctx.fillStyle = `rgba(${COPPER.r},${COPPER.g},${COPPER.b}, 0.6)`; // Reset text color
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
