document.addEventListener('DOMContentLoaded', () => {
    const themeToggleHero = document.getElementById('themeToggleHero');
    const themeToggleHeroIconSpan = document.getElementById('themeToggleHeroIcon');
    const sunIconHTML = '<i class="fas fa-sun text-yellow-400 fa-lg"></i>';
    const moonIconHTML = '<i class="fas fa-moon text-primary dark:text-yellow-400 fa-lg"></i>';

    const applyTheme = () => {
        const isDarkMode = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            if (themeToggleHeroIconSpan) themeToggleHeroIconSpan.innerHTML = sunIconHTML;
            if (themeToggleHero) themeToggleHero.setAttribute('title', 'Switch to Light Mode');
        } else {
            document.documentElement.classList.remove('dark');
            if (themeToggleHeroIconSpan) themeToggleHeroIconSpan.innerHTML = moonIconHTML;
            if (themeToggleHero) themeToggleHero.setAttribute('title', 'Switch to Dark Mode');
        }
    };

    applyTheme();

    if (themeToggleHero) {
        themeToggleHero.addEventListener('click', () => {
            const isDarkMode = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            applyTheme();
        });
    }

    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
                mobileMenuButton.setAttribute('aria-label', 'Open menu');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
                mobileMenuButton.setAttribute('aria-label', 'Close menu');
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const navbar = document.querySelector('nav');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                // For fixed navbar, the target element's top needs to be offset by navbar height.
                // The hero section itself now has padding to account for the navbar.
                // So, scrolling to `elementPosition - navbarHeight` might be correct if the hero section's top padding *wasn't* already considering the navbar.
                // However, since hero section's padding `pt-20` or `pt-24` is designed to place content *below* the navbar,
                // we should scroll to the targetElement's top. The `scroll-smooth` and `scroll-margin-top` (if set on sections)
                // or manual offset can handle this.
                // The current calculation for `offsetPosition` for smooth scroll should still work correctly, as it calculates the
                // position needed for the top of the target element to align just below the fixed navbar.
                 let offsetPosition = elementPosition - navbarHeight;

                // Special handling for #home: it already has top padding for navbar
                if (targetId === '#home') {
                    offsetPosition = elementPosition; // Scroll to its actual top
                     // Or to be slightly below the navbar if home's padding isn't precise
                    if (elementPosition > navbarHeight) { // only adjust if it's not already at top
                        offsetPosition = elementPosition - navbarHeight;
                    } else {
                        offsetPosition = 0; // Go to very top for #home
                    }
                }


                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            if (mobileMenu && link.classList.contains('nav-link-mobile') && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const mobileMenuIcon = mobileMenuButton.querySelector('i');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                    mobileMenuButton.setAttribute('aria-label', 'Open menu');
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const desktopNavLinks = document.querySelectorAll('nav .hidden.md\\:flex a.nav-link');
    const mobileNavLinksList = document.querySelectorAll('#mobileMenu a.nav-link-mobile');

    function setActiveLink() {
        let currentSectionId = '';
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        // Adjust scrollThreshold based on new layout where sections themselves have top padding related to navbar_height
        const scrollThreshold = navbarHeight + 20; // A bit more lenient

        sections.forEach(section => {
            // The top padding of sections (like pt-20 on #home) means their offsetTop is 0 or near 0 for #home.
            // BoundingClientRect().top is more reliable for fixed nav.
            const sectionTopViewport = section.getBoundingClientRect().top;

            if (sectionTopViewport <= scrollThreshold && sectionTopViewport < window.innerHeight - section.offsetHeight / 2 ) {
                 if (section.getBoundingClientRect().bottom > scrollThreshold) {
                    currentSectionId = section.getAttribute('id');
                 }
            }
        });


        // Fallback for when scrolled to the very top or bottom
        if (window.scrollY < sections[0].offsetTop + sections[0].offsetHeight / 2 - navbarHeight) {
             currentSectionId = sections[0].getAttribute('id');
        } else if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 20) { // Near bottom
            const lastSection = sections[sections.length - 1];
            if (lastSection) currentSectionId = lastSection.getAttribute('id');
        }


        [desktopNavLinks, mobileNavLinksList].forEach(linkList => {
            linkList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
