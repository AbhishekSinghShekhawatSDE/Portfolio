document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle (Button in Hero Section) ---
const themeToggleHero = document.getElementById('themeToggleHero');
const themeToggleHeroIcon = document.getElementById('themeToggleHeroIcon'); // The <span> inside the button that holds the icon
const sunIconHTML = '<i class="fas fa-sun text-yellow-400"></i>';    // HTML for the sun icon
const moonIconHTML = '<i class="fas fa-moon text-primary"></i>';      // HTML for the moon icon (adjust text-primary if needed)

// Function to apply the theme based on localStorage or system preference
const applyTheme = () => {
    if (localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (themeToggleHeroIcon) themeToggleHeroIcon.innerHTML = sunIconHTML; // Show sun in dark mode
    } else {
        document.documentElement.classList.remove('dark');
        if (themeToggleHeroIcon) themeToggleHeroIcon.innerHTML = moonIconHTML; // Show moon in light mode
    }
};

// Apply the theme when the page loads
applyTheme();

// Add event listener to the button if it exists
if (themeToggleHero) {
    themeToggleHero.addEventListener('click', () => {
        // Toggle the 'dark' class on the <html> element
        const isDarkMode = document.documentElement.classList.toggle('dark');
        
        // Save the user's preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update the button's icon
        if (isDarkMode) {
            if (themeToggleHeroIcon) themeToggleHeroIcon.innerHTML = sunIconHTML;
        } else {
            if (themeToggleHeroIcon) themeToggleHeroIcon.innerHTML = moonIconHTML;
        }
    });
}

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i'); // Get the icon element
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            }
        });
    }

    // --- Smooth Scroll for Nav Links & Close Mobile Menu on Click ---
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const navbar = document.querySelector('nav'); // Get the navbar element

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return; // Prevent error for href="#"

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if a link is clicked from mobile menu
            if (mobileMenu && link.classList.contains('nav-link-mobile') && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const mobileMenuIcon = mobileMenuButton.querySelector('i');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll (ScrollSpy) ---
    const sections = document.querySelectorAll('section[id]');
    const desktopNavLinks = document.querySelectorAll('nav .hidden.md\\:flex a.nav-link'); // Escaped colon for querySelector
    const mobileNavLinksList = document.querySelectorAll('#mobileMenu a.nav-link-mobile');

    function setActiveLink() {
        let currentSectionId = '';
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 70; // Adjusted offset for better accuracy
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (!currentSectionId && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) { // Check if at bottom
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
    setActiveLink(); // Initial call to set active link on page load

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Optional: AOS Animation (if you decide to use it) ---
    // 1. Add CDN link for CSS in <head>: <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    // 2. Add CDN link for JS before </body>: <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    // 3. Then initialize:
    /*
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,    // values from 0 to 3000, with step 50ms
            offset: 120,      // offset (in px) from the original trigger point
            once: true,       // whether animation should happen only once - while scrolling down
            easing: 'ease-in-out', // default easing for AOS animations
        });
    }
    */
    // 4. Add data-aos attributes to HTML elements e.g. <div data-aos="fade-up"></div>
});