document.addEventListener('DOMContentLoaded', async () => {
    // Load the navbar
    const navbarContainer = document.getElementById('navbar-container');
    try {
        const response = await fetch('/components/navbar.html');
        const html = await response.text();
        navbarContainer.innerHTML = html;

        // Set active nav item based on current page
        const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });

        // Initialize theme switcher after navbar is loaded
        initializeThemeSwitcher();

        // Initialize mobile sidebar toggle
        initializeMobileSidebar();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
});

// Initialize mobile sidebar toggle
function initializeMobileSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });

        // Close sidebar when window is resized above mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
            }
        });

        // Close sidebar when clicking a nav link on mobile
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('show');
                }
            });
        });
    }
}

// Initialize theme switcher
function initializeThemeSwitcher() {
    const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }

    // Theme switch handler
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    themeSwitch.addEventListener('change', switchTheme, false);
} 