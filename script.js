document.addEventListener('DOMContentLoaded', () => {
    // 0. Background Slideshow Controller
    // JS-driven instead of pure CSS so exactly one slide is ever visible at a time.
    const bgSlides = document.querySelectorAll('.bg-slide');
    if (bgSlides.length > 0) {
        let currentSlide = 0;
        bgSlides[0].classList.add('active');

        setInterval(() => {
            bgSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % bgSlides.length;
            bgSlides[currentSlide].classList.add('active');
        }, 6000);
    }

    // 0.5 Toggle "required" on guest names based on guest count
    // (a party of 1 has no additional guests to name)
    const guestCountSelect = document.getElementById('guest-count');
    const guestNamesField = document.getElementById('guest-names');

    if (guestCountSelect && guestNamesField) {
        const updateGuestNamesRequirement = () => {
            guestNamesField.required = parseInt(guestCountSelect.value, 10) > 1;
        };
        updateGuestNamesRequirement();
        guestCountSelect.addEventListener('change', updateGuestNamesRequirement);
    }

    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer && window.innerWidth > 768) {
        cursor.style.display = 'block';
        follower.style.display = 'block';

        let mouseX = 0;
        let mouseY = 0;
        let isHovered = false;

        const updateCursorPosition = () => {
            const cursorScale = isHovered ? ' scale(2)' : '';
            const followerScale = isHovered ? ' scale(1.5)' : '';
            cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)${cursorScale}`;
            follower.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)${followerScale}`;
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateCursorPosition();
        });

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, select, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovered = true;
                follower.style.borderColor = 'var(--champagne)';
                updateCursorPosition();
            });
            el.addEventListener('mouseleave', () => {
                isHovered = false;
                follower.style.borderColor = 'var(--border-luxury)';
                updateCursorPosition();
            });
        });
    }

    // 2. Loader Logic
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.querySelector('.hero-content').classList.add('revealed');
        }, 1500);
    }, 3200);

    // 3. Countdown Timer Logic (Updated for November 28, 2026)
    const weddingDate = new Date('2026-11-28T14:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById('countdown').innerHTML = "<h3 class='premium-font'>The Celebration has Begun</h3>";
        }
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

    // 5. RSVP Form Submission Handling
    const rsvpForm = document.getElementById('rsvp-form');
    const statusMsg = document.getElementById('rsvp-status');

    // Paste your Google Apps Script Web App URL here (see setup guide) — ends in /exec
    const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyEs0_DF0qmZoys8VEKuWdICp3D2jtfqJ79bToxa1FNQs4vy_u1P01g55eoQoRdYqZrYQ/exec';

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const name = formData.get('name');
        const attendance = formData.get('attendance');
        const message = formData.get('message');
        const guestCount = formData.get('guestCount');
        const guestNames = formData.get('guestNames');

        const submitBtn = rsvpForm.querySelector('button');
        const originalText = submitBtn.innerText;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Transmitting Reservation...';

        fetch(RSVP_ENDPOINT, {
            method: 'POST',
            // text/plain avoids a CORS preflight request, which Apps Script doesn't handle
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ name, attendance, message, guestCount, guestNames })
        })
            .then(() => {
                submitBtn.innerText = attendance === 'yes' ? 'Welcome' : 'Thank You';
                statusMsg.classList.remove('hidden');

                if (attendance === 'yes') {
                    const partyText = guestCount > 1 ? ` Your party of ${guestCount} is confirmed.` : ' Your presence is confirmed.';
                    statusMsg.innerHTML = `<p class="premium-font">Thank you, ${name}.${partyText} We look forward to celebrating with you!</p>`;
                } else {
                    statusMsg.innerHTML = `<p class="premium-font">Thank you, ${name}. We are sorry you cannot make it, but we appreciate your response.</p>`;
                }

                rsvpForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }, 4000);
            })
            .catch(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                statusMsg.classList.remove('hidden');
                statusMsg.innerHTML = `<p class="premium-font">Something went wrong sending your RSVP. Please try again, or reach out to us directly.</p>`;
            });
    });

    // 6. Parallax Effect for Hero (skipped for users who prefer reduced motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = document.querySelector('.hero-content');
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / 700);
            }
        });
    }
});