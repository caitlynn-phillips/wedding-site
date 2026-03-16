document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        follower.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        });

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, select, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2)';
                follower.style.transform += ' scale(1.5)';
                follower.style.borderColor = 'var(--champagne)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
                follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
                follower.style.borderColor = 'var(--border-luxury)';
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
    }, 2500);

    // 3. Countdown Timer Logic (Updated for November 28, 2026)
    const weddingDate = new Date('November 28, 2026 15:00:00').getTime();

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

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const name = formData.get('name');

        const submitBtn = rsvpForm.querySelector('button');
        const originalText = submitBtn.innerText;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Transmitting Reservation...';

        setTimeout(() => {
            submitBtn.innerText = 'Welcome';
            statusMsg.classList.remove('hidden');

            statusMsg.innerHTML = `<p class="premium-font">Thank you, ${name}. Your presence is requested and confirmed. More details will follow.</p>`;

            rsvpForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }, 4000);
        }, 2500);
    });

    // 6. Parallax Effect for Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });
});
