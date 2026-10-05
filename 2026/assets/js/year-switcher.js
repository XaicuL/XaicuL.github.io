/* ==================================
   year-switcher.js - Year archive dropdown
   ================================== */

(function () {
    const switcher = document.getElementById('yearSwitcher');
    const btn = document.getElementById('yearBtn');
    const dropdown = document.getElementById('yearDropdown');

    if (!switcher || !btn || !dropdown) return;

    function openDropdown() {
        dropdown.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
        if (dropdown.hidden) openDropdown();
        else closeDropdown();
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdown();
    });
})();
