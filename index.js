/* ==========================================================================
   Dermospace Clinic JS Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        
        // Update menu icon between 'menu' and 'x'
        if (isOpen) {
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // 3. Header Scroll Transition (Transparent -> Scroll Gradient Glass)
    const header = document.querySelector('.site-header');
    const heroSection = document.getElementById('home');

    function checkHeaderScroll() {
        const heroHeight = heroSection.offsetHeight;
        if (window.scrollY > (heroHeight - 80)) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Initial check

    // 4. Scroll-Spy (Highlighing active navigation link based on scroll section)
    const sections = document.querySelectorAll('section');
    
    function scrollSpy() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 120; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial check

    // 5. Long Reviews "Read More" Collapsible Text
    const reviewTexts = document.querySelectorAll('.review-text');
    const TRUNCATE_LIMIT = 240; // Characters limit before truncating

    reviewTexts.forEach(el => {
        const fullContent = el.innerHTML.trim();
        
        // If review length exceeds threshold
        if (fullContent.replace(/<[^>]*>/g, '').length > TRUNCATE_LIMIT) {
            // Store full text on element dataset
            el.dataset.fullText = fullContent;
            
            // Get simplified text content for standard slicing
            const textOnly = el.textContent || el.innerText;
            const truncatedText = textOnly.slice(0, TRUNCATE_LIMIT) + '...';
            el.innerHTML = truncatedText;
            
            // Create a read more button
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Read More';
            
            // Append button inside the review content container
            el.parentElement.appendChild(readMoreBtn);

            readMoreBtn.addEventListener('click', () => {
                const isExpanded = readMoreBtn.textContent === 'Read Less';
                if (isExpanded) {
                    el.innerHTML = truncatedText;
                    readMoreBtn.textContent = 'Read More';
                } else {
                    el.innerHTML = fullContent;
                    readMoreBtn.textContent = 'Read Less';
                }
                
                // Adjust slide positioning height if necessary by firing a dummy window resize
                window.dispatchEvent(new Event('resize'));
            });
        }
    });

    // 6. Testimonial Slider / Carousel Functionality
    const sliderContainer = document.getElementById('testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.getElementById('slider-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval;

    // Create pagination dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(slideIdx) {
        currentSlide = (slideIdx + totalSlides) % totalSlides;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Autoplay setup
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 6000); // 6 seconds rotation
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause autoplay on mouse hover over slider
    const sliderWrapper = document.querySelector('.slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    sliderWrapper.addEventListener('mouseleave', startAutoplay);

    // 7. Scroll Animation Triggers (Intersection Observer)
    const animElements = document.querySelectorAll('.scroll-anim');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
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
});
