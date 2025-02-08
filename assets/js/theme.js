// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const themeIcon = document.querySelector('.theme-icon i');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Theme switch handler
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-sun';
        }
    }

    themeSwitch.addEventListener('change', switchTheme, false);
}); 