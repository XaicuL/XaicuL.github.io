/* 2027 mock — background light. The full-screen refraction filter is gone; it repainted every frame. */

(function () {
    const root = document.documentElement;

    let lastY = window.scrollY || 0;
    let scrollIdle;
    let scrollQueued = false;

    function markScroll(delta) {
        if (Math.abs(delta) < 0.5) return;
        const down = delta > 0;
        document.body.classList.toggle('scroll-down', down);
        document.body.classList.toggle('scroll-up', !down);
        const flow = Math.min(72, Math.abs(delta));
        root.style.setProperty('--flow', flow + 'px');
        clearTimeout(scrollIdle);
        scrollIdle = setTimeout(() => {
            document.body.classList.remove('scroll-down', 'scroll-up');
            root.style.setProperty('--flow', '0px');
        }, 220);
    }

    function paintScroll() {
        scrollQueued = false;
        const y = window.scrollY || 0;
        root.style.setProperty('--field-y', (y * 0.18) + 'px');
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY || 0;
        markScroll(y - lastY);
        lastY = y;
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(paintScroll);
    }, { passive: true });

    let cursorTargetX = window.innerWidth * 0.62;
    let cursorTargetY = window.innerHeight * 0.42;
    let cursorX = cursorTargetX;
    let cursorY = cursorTargetY;
    let cursorRaf = 0;
    let pointerQueued = false;
    let pendingX = cursorTargetX;
    let pendingY = cursorTargetY;

    function followCursor() {
        const dx = cursorTargetX - cursorX;
        const dy = cursorTargetY - cursorY;
        cursorX += dx * 0.12;
        cursorY += dy * 0.12;
        root.style.setProperty('--cx', cursorX + 'px');
        root.style.setProperty('--cy', cursorY + 'px');
        if (Math.abs(dx) < 0.6 && Math.abs(dy) < 0.6) {
            cursorRaf = 0;
            return;
        }
        cursorRaf = requestAnimationFrame(followCursor);
    }

    window.addEventListener('pointermove', (e) => {
        pendingX = e.clientX;
        pendingY = e.clientY;
        if (pointerQueued) return;
        pointerQueued = true;
        requestAnimationFrame(() => {
            pointerQueued = false;
            const x = (pendingX / window.innerWidth - 0.5) * 12;
            const y = (pendingY / window.innerHeight - 0.5) * 10;
            root.style.setProperty('--lx', x + 'vw');
            root.style.setProperty('--ly', y + 'vh');
            cursorTargetX = pendingX;
            cursorTargetY = pendingY;
            if (!cursorRaf) cursorRaf = requestAnimationFrame(followCursor);
        });
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
        if (document.body.classList.contains('intro-on')) {
            e.preventDefault();
            return;
        }
        if (e.ctrlKey || e.metaKey) return;
        if (document.querySelector('.re-modal-overlay.show, .cmd-palette-overlay.show')) {
            charge = 0;
            return;
        }

        const dir = Math.sign(e.deltaY);
        if (!dir) return;
        markScroll(dir);

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
