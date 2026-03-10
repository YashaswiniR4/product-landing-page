/**
 * SmartX Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Animation
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1200);
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isMenuOpen = navLinks.classList.contains('active');
            menuBtn.innerHTML = isMenuOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            if (window.lucide) lucide.createIcons();
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i data-lucide="menu"></i>';
                if (window.lucide) lucide.createIcons();
            });
        });
    }

    // 4. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 6. Testimonial Slider
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    const updateSlider = (index) => {
        if (!track || dots.length === 0) return;

        const card = track.querySelector('.testimonial-card');
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;

        // On mobile it's 100% width, on tablet 50%, etc.
        // We just move by index * cardWidth
        const moveAmount = index * (cardWidth + gap);
        track.style.transform = `translateX(-${moveAmount}px)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            clearInterval(sliderInterval); // Stop autoplay on interaction
        });
    });

    // Resizing window might change card width, update slider
    window.addEventListener('resize', () => updateSlider(currentIndex));

    // Autoplay
    let sliderInterval = setInterval(() => {
        if (dots.length > 0) {
            let nextIndex = (currentIndex + 1) % dots.length;
            updateSlider(nextIndex);
        }
    }, 6000);

    // 7. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        if (window.lucide) lucide.createIcons();

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            themeToggle.innerHTML = newTheme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
            if (window.lucide) lucide.createIcons();
        });
    }

    // 8. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.style.display = 'flex';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 600) backToTopBtn.style.display = 'none';
                }, 300);
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 9. Login & Register Modals Logic
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtns = document.querySelectorAll('#nav-login-btn, #mobile-login-btn, #to-login');
    const registerBtns = document.querySelectorAll('#nav-register-btn, #mobile-register-btn, #to-register, [href="#"].cta-banner .btn, .hero-btns .btn-primary, .demo-btns .btn-primary');
    const closeBtns = document.querySelectorAll('.close-modal');

    const openModal = (modal) => {
        // Close other modal if open
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    });

    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === registerModal) {
            closeModal();
        }
    });

    // Form Submissions
    const handleFormSubmit = (e, type) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Show success state
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0 auto;"></span>';
        btn.disabled = true;

        setTimeout(() => {
            alert(`${type} successful! Welcome to SmartX.`);
            btn.innerHTML = originalText;
            btn.disabled = false;
            closeModal();
            e.target.reset();
        }, 1500);
    };

    document.getElementById('login-form').addEventListener('submit', (e) => handleFormSubmit(e, 'Login'));
    document.getElementById('register-form').addEventListener('submit', (e) => handleFormSubmit(e, 'Registration'));

    // Fix CTA Button in Banner (linking it to Register)
    const ctaBtn = document.querySelector('.cta-banner .btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    }

    // Fix Hero "Buy Now" button
    const buyNowBtn = document.querySelector('.hero-btns .btn-primary');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    }
});
