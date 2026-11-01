/* 2027 mock — specular sheen + section-seam resistance */

(function () {
    const root = document.documentElement;

    window.addEventListener('scroll', () => {
        const y = window.scrollY || 0;
        const shift = 30 - (y % 280) / 8;
        root.style.setProperty('--sheen', shift + '%');
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
        const x = (e.clientX / window.innerWidth) * 40 - 20;
        root.style.setProperty('--sheen', (12 + x) + '%');
    }, { passive: true });

    const sections = () => [...document.querySelectorAll('main > section')];
    let charge = 0;
    const THRESHOLD = 160;
    const SEAM = 88;

    function nextSeam() {
        const y = window.scrollY;
        const viewBottom = y + window.innerHeight;
        for (const section of sections()) {
            const dist = section.offsetTop - viewBottom;
            if (dist < SEAM && dist > -12 && section.offsetTop > y + 24) return section;
        }
        return null;
    }

    function prevSeam() {
        const y = window.scrollY;
        const list = sections();
        for (let i = list.length - 1; i >= 0; i--) {
            const dist = y - list[i].offsetTop;
            if (dist > 0 && dist < SEAM) return list[i];
        }
        return null;
    }

    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) return;
        if (document.querySelector('.re-modal-overlay.show, .cmd-palette-overlay.show')) {
            charge = 0;
            return;
        }

        const dir = Math.sign(e.deltaY);
        if (!dir) return;

        const target = dir > 0 ? nextSeam() : prevSeam();
        if (!target) {
            charge = 0;
            return;
        }

        charge += e.deltaY;
        e.preventDefault();

        if (Math.abs(charge) < THRESHOLD) return;

        charge = 0;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, { passive: false });
})();
