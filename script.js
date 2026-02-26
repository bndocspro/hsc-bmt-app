/* ============================================
   HSC BMT - Premium Landing Page Scripts
   Lenis Smooth Scroll, Parallax, Line Draw,
   Scroll Reveals, Counter Animations,
   and Micro-Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Lenis Smooth Scroll Initialization
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // Connect Lenis to requestAnimationFrame loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 1. Cursor Glow Effect
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursorGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // ==========================================
    // 2. Navbar Scroll Effects
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll(scrollY) {
        // Navbar glass effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 3. Parallax Effect (driven by Lenis scroll)
    // ==========================================
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function handleParallax() {
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax'));
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = centerY - window.innerHeight / 2;
            const offset = distance * speed;

            el.style.transform = `translateY(${offset}px)`;
        });
    }

    // ==========================================
    // 4. Screenshot Carousel (replaces old parallax)
    // ==========================================
    function screenshotParallax() {
        // Carousel handles its own animations now
    }

    // ==========================================
    // 5. Lenis Scroll Event (drives nav, parallax)
    // ==========================================
    lenis.on('scroll', ({ scroll }) => {
        handleNavScroll(scroll);
        handleParallax();
        screenshotParallax();
    });

    // Back to top click — use Lenis scrollTo
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // ==========================================
    // 6. Mobile Menu
    // ==========================================
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                lenis.stop();
            } else {
                document.body.style.overflow = '';
                lenis.start();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                lenis.start();

                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.5 });
                }
            });
        });
    }

    // ==========================================
    // 7. Scroll Reveal Animation (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-float');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 8. Highlight Text Animation
    // ==========================================
    const highlightTexts = document.querySelectorAll('[data-highlight]');

    const highlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('highlighted');
                }, 400);
            }
        });
    }, {
        threshold: 0.5
    });

    highlightTexts.forEach(el => highlightObserver.observe(el));

    // ==========================================
    // 9. Counter Animation
    // ==========================================
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = isDecimal ? target.toFixed(1) : target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ==========================================
    // 10. Feature Card Icon Line Draw
    // ==========================================
    const featureCards = document.querySelectorAll('.feature-card');

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2 });

    featureCards.forEach(card => featureObserver.observe(card));

    // ==========================================
    // 11. Step Line Draw Animation
    // ==========================================
    const stepLine = document.querySelector('.step-line-draw');

    if (stepLine) {
        const stepLineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stepLine.classList.add('animated');
                }
            });
        }, { threshold: 0.2 });

        stepLineObserver.observe(stepLine);
    }

    // ==========================================
    // 12. Subject Card Tilt Effect
    // ==========================================
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateX(0)';
        });
    });

    // ==========================================
    // 13. Feature Card Glow Follow
    // ==========================================
    featureCards.forEach(card => {
        const glow = card.querySelector('.feature-card-glow');
        if (!glow) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.left = (x - rect.width) + 'px';
            glow.style.top = (y - rect.height) + 'px';
        });
    });

    // ==========================================
    // 14. Smooth Scroll for ALL anchor links (via Lenis)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, { offset: -80, duration: 1.5 });
            }
        });
    });

    // ==========================================
    // 15. Page Load Animation Sequence
    // ==========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger hero animations immediately
        setTimeout(() => {
            const heroRevealElements = document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale, .hero .reveal-float');
            heroRevealElements.forEach(el => {
                el.classList.add('revealed');
            });

            // Trigger text reveal after hero appears
            setTimeout(() => {
                document.querySelectorAll('[data-text-reveal]').forEach(el => {
                    el.classList.add('text-revealed');
                });
            }, 400);
        }, 300);
    });

    // ==========================================
    // 16. Particle System
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        const connectionDistance = 120;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 170, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 170, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse interaction with particles
        let particleMouseX = 0, particleMouseY = 0;
        document.addEventListener('mousemove', (e) => {
            particleMouseX = e.clientX;
            particleMouseY = e.clientY;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // Subtle mouse repulsion
                const dx = p.x - particleMouseX;
                const dy = p.y - particleMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 0.02;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // 17. Scroll Velocity Indicator
    // ==========================================
    const velocityIndicator = document.createElement('div');
    velocityIndicator.classList.add('velocity-indicator');
    document.body.appendChild(velocityIndicator);

    let lastScroll = 0;
    let velocityDecay;

    lenis.on('scroll', ({ scroll, velocity }) => {
        // Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scroll / docHeight;
        velocityIndicator.style.transform = `scaleX(${progress})`;

        // Velocity-based opacity
        const absVelocity = Math.min(Math.abs(velocity), 5);
        velocityIndicator.style.opacity = 0.3 + absVelocity * 0.14;

        lastScroll = scroll;
    });

    // ==========================================
    // 18. Magnetic Button Effect
    // ==========================================
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });

        // Ripple effect on click
        btn.addEventListener('click', (e) => {
            const ripple = btn.querySelector('.btn-ripple');
            if (!ripple) return;

            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rippleEl = ripple.querySelector('::after') || ripple;
            ripple.style.setProperty('--ripple-x', x + 'px');
            ripple.style.setProperty('--ripple-y', y + 'px');
        });
    });

    // ==========================================
    // 19. Text Character Split Animation
    // ==========================================
    document.querySelectorAll('[data-text-reveal]').forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = '';

        // Use Intl.Segmenter for proper Bengali grapheme cluster segmentation
        let segments;
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const segmenter = new Intl.Segmenter('bn', { granularity: 'grapheme' });
            segments = [...segmenter.segment(text)].map(s => s.segment);
        } else {
            segments = [...text];
        }

        segments.forEach((char, i) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.04}s`;
            el.appendChild(span);
        });
    });

    // ==========================================
    // 20. Feature Card 3D Tilt
    // ==========================================
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * -6;
            const tiltY = (x - 0.5) * 6;

            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ==========================================
    // 21. Subject Card Stagger Classes
    // ==========================================
    document.querySelectorAll('.subject-card').forEach((card, i) => {
        card.classList.add(`stagger-${(i % 10) + 1}`);
    });

    // ==========================================
    // 22. Screenshot Carousel System
    // ==========================================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselProgress = document.getElementById('carouselProgress');
    const totalSlides = carouselSlides.length;

    let currentSlide = 0;
    let carouselAutoplayInterval;
    let carouselProgressInterval;
    const autoplayDelay = 4000; // 4s per slide
    let isCarouselPaused = false;

    // Position slides around the center
    function updateCarouselPositions() {
        carouselSlides.forEach((slide, index) => {
            const diff = index - currentSlide;
            // Wrap around for circular carousel
            let adjustedDiff = diff;
            if (adjustedDiff > totalSlides / 2) adjustedDiff -= totalSlides;
            if (adjustedDiff < -totalSlides / 2) adjustedDiff += totalSlides;

            let position;
            if (adjustedDiff === 0) position = 'center';
            else if (adjustedDiff === -1) position = 'left-1';
            else if (adjustedDiff === -2) position = 'left-2';
            else if (adjustedDiff === 1) position = 'right-1';
            else if (adjustedDiff === 2) position = 'right-2';
            else position = 'hidden';

            slide.setAttribute('data-position', position);
        });

        // Update dots
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        updateCarouselPositions();
        resetAutoplay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Progress bar animation
    function startProgress() {
        if (carouselProgress) {
            let startTime = Date.now();
            clearInterval(carouselProgressInterval);
            carouselProgressInterval = setInterval(() => {
                if (isCarouselPaused) return;
                const elapsed = Date.now() - startTime;
                const percent = Math.min((elapsed / autoplayDelay) * 100, 100);
                carouselProgress.style.width = percent + '%';
            }, 30);
        }
    }

    function resetAutoplay() {
        clearInterval(carouselAutoplayInterval);
        clearInterval(carouselProgressInterval);
        if (carouselProgress) carouselProgress.style.width = '0%';
        startProgress();
        carouselAutoplayInterval = setInterval(() => {
            if (!isCarouselPaused) nextSlide();
        }, autoplayDelay);
    }

    // Event listeners
    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            prevSlide();
        });
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            nextSlide();
        });
    }

    carouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });

    // Click on side slides to navigate
    carouselSlides.forEach(slide => {
        slide.addEventListener('click', () => {
            const pos = slide.getAttribute('data-position');
            if (pos === 'left-1' || pos === 'left-2') prevSlide();
            else if (pos === 'right-1' || pos === 'right-2') nextSlide();
        });
    });

    // Pause on hover
    const carouselWrapper = document.getElementById('screenshotCarousel');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            isCarouselPaused = true;
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            isCarouselPaused = false;
        });
    }

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only when carousel is in viewport
        if (carouselWrapper) {
            const rect = carouselWrapper.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
                if (e.key === 'ArrowLeft') prevSlide();
                else if (e.key === 'ArrowRight') nextSlide();
            }
        }
    });

    // Initialize carousel
    if (totalSlides > 0) {
        updateCarouselPositions();
        resetAutoplay();
    }

    // Initial calls
    handleNavScroll(window.scrollY);
    handleParallax();

    console.log('🚀 HSC BMT Landing Page loaded with enhanced motion graphics!');
});
