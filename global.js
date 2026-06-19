/* ==========================================================================
   Dermospace Clinic JS - Shared Global Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Navigation
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuIcon = mobileToggle ? mobileToggle.querySelector('i') : null;

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            if (isOpen && menuIcon) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else if (menuIcon) {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // 3. Mark Active Page Link
    const currentPath = window.location.pathname;
    let currentPage = currentPath.split("/").pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 4. Header Scroll Shrink (Smooth scrolled classes)
    const header = document.querySelector('.site-header');
    
    function checkHeaderScroll() {
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Initial check

    // 5. Scroll Entrance Animations observer
    const animElements = document.querySelectorAll('.scroll-anim');

    if (animElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animates once
                }
            });
        }, observerOptions);

        animElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }
});
