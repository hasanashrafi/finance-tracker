document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    const storedTheme = localStorage.getItem('theme');

    // On load, set dark mode based on localStorage or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);

    html.classList.toggle('dark', isDarkMode);

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function () {
        html.classList.toggle('dark');
        document.body.classList.toggle('dark');
        document.getElementById('moon').classList.toggle('hidden');
        document.getElementById('sun').classList.toggle('hidden');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
});