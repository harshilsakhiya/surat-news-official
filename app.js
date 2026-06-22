document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME MANAGEMENT (LIGHT/DARK)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        toggleIcon.className = 'ri-sun-line';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleIcon.className = 'ri-moon-line';
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleIcon.className = 'ri-moon-line';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            toggleIcon.className = 'ri-sun-line';
        }
    });

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header Scroll Shadow / Shrink Effect
    const headerNav = document.getElementById('header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerNav.classList.add('scrolled');
        } else {
            headerNav.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // STATS COUNT UP ANIMATION
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.getAttribute('data-decimal') === 'true';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            let current = (target / totalSteps) * step;
            if (step >= totalSteps) {
                current = target;
                clearInterval(timer);
            }
            
            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, stepTime);
    };

    const statsSection = document.getElementById('stats');
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => animateCounter(num));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // SURAT HUB FEED TAB SWITCHER
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Add active to current button
            btn.classList.add('active');

            // Find and show corresponding panel
            const panelId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(panelId);
            
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // COLLABORATION PORTAL FORM HANDLING
    // ==========================================================================
    const collabForm = document.getElementById('collab-form');
    const successOverlay = document.getElementById('form-success');
    const closeSuccessBtn = document.getElementById('close-success');

    if (collabForm) {
        collabForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Standard form validation
            let isValid = true;
            const inputs = collabForm.querySelectorAll('.form-input[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--accent-rose)';
                } else {
                    input.style.borderColor = 'var(--border-color)';
                }
            });

            if (!isValid) return;

            // Submit Button state change (Loading animation effect)
            const submitBtn = collabForm.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ri-loader-4-line spin-icon"></i> Sending Proposal...';
            submitBtn.disabled = true;

            // Simulate API Request (1.5 seconds delay)
            setTimeout(() => {
                successOverlay.classList.add('active');
                collabForm.reset();
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    // Input line animations border color reset on typing
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = 'var(--accent-cyan)';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
    });

    // ==========================================================================
    // PARALLAX EFFECT FOR HERO
    // ==========================================================================
    const heroSection = document.querySelector('.hero-section');
    const floatingCard = document.querySelector('.floating-card');
    
    if (heroSection && floatingCard) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Convert to rotation angle
            const rotateX = -(y / rect.height) * 20; // max 10 deg
            const rotateY = (x / rect.width) * 20;  // max 10 deg
            
            floatingCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            floatingCard.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            floatingCard.style.transition = 'transform 0.5s ease';
        });

        heroSection.addEventListener('mouseenter', () => {
            floatingCard.style.transition = 'none';
        });
    }
});
