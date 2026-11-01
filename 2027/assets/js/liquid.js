/* 2027 mock — specular sheen + section-seam resistance */

(function () {
    const root = document.documentElement;
    const map = document.getElementById('liquid-map');

    function buildMap(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(w, h);
        const data = image.data;
        const lenses = [
            { cx: w * 0.5, cy: h * 0.48, r: Math.min(w, h) * 0.46 },
            { cx: w * 0.24, cy: h * 0.7, r: Math.min(w, h) * 0.22 }
        ];

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let dx = 0;
                let dy = 0;
                lenses.forEach((lens) => {
                    const ox = x - lens.cx;
                    const oy = y - lens.cy;
                    const dist = Math.hypot(ox, oy);
                    const inner = lens.r * 0.58;
                    if (dist >= lens.r || dist <= inner) return;
                    const t = (dist - inner) / (lens.r - inner);
                    const mag = Math.pow(t, 1.35);
                    dx += (ox / dist) * mag;
                    dy += (oy / dist) * mag;
                });
                dx = Math.max(-1, Math.min(1, dx));
                dy = Math.max(-1, Math.min(1, dy));
                const i = (y * w + x) * 4;
                data[i] = 128 + dx * 127;
                data[i + 1] = 128 + dy * 127;
                data[i + 2] = 128;
                data[i + 3] = 255;
            }
        }
        ctx.putImageData(image, 0, 0);
        return canvas.toDataURL();
    }

    if (map) {
        const href = buildMap(480, 300);
        map.setAttribute('href', href);
        map.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY || 0;
        root.style.setProperty('--field-y', (y * 0.18) + 'px');
        root.style.setProperty('--ly', (-18 + (y % 900) / 18) + 'vh');
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        root.style.setProperty('--lx', x + 'vw');
        root.style.setProperty('--ly', `calc(${y}vh + ${(window.scrollY % 900) / 18 - 18}vh)`);
        cursorTargetX = e.clientX;
        cursorTargetY = e.clientY;
    }, { passive: true });

    let cursorTargetX = window.innerWidth * 0.62;
    let cursorTargetY = window.innerHeight * 0.42;
    let cursorX = cursorTargetX;
    let cursorY = cursorTargetY;

    function followCursor() {
        cursorX += (cursorTargetX - cursorX) * 0.07;
        cursorY += (cursorTargetY - cursorY) * 0.07;
        root.style.setProperty('--cx', cursorX + 'px');
        root.style.setProperty('--cy', cursorY + 'px');
        requestAnimationFrame(followCursor);
    }
    followCursor();

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
