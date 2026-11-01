/* 2027 — Luciano letter lock, then a giant CV that yields as the hero leaves center */

(function () {
    const word = 'LUCIANO';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const intro = document.getElementById('lucianoIntro');
    const row = document.getElementById('lucianoIntroWord');
    const mark = document.getElementById('cvMark');
    const hero = document.getElementById('hero');
    const stepMs = 48;

    const letters = word.split('').map((ch, i) => {
        const el = document.createElement('span');
        const mid = (word.length - 1) / 2;
        const arc = -Math.pow(i - mid, 2) * 7;
        el.style.setProperty('--arc', arc + 'px');
        el.textContent = alphabet[(i * 5) % 26];
        row.appendChild(el);
        return { ch, el, lockAt: 7 + i * 3 };
    });

    function placeCv() {
        if (!hero || !mark) return;
        const rect = hero.getBoundingClientRect();
        const viewMid = window.innerHeight * 0.5;
        const sectionMid = rect.top + rect.height * 0.5;
        const passed = viewMid - sectionMid;
        const fadeStart = window.innerHeight * 0.06;
        const fadeEnd = window.innerHeight * 0.4;
        let opacity = 1;
        if (passed > fadeStart) opacity = 1 - (passed - fadeStart) / (fadeEnd - fadeStart);
        opacity = Math.max(0, Math.min(1, opacity));
        mark.style.setProperty('--cv-opacity', String(opacity));
    }

    function finish() {
        document.body.classList.remove('intro-on');
        if (intro) intro.remove();
        placeCv();
    }

    function openSite() {
        if (!intro || intro.classList.contains('is-leave')) return;
        intro.classList.add('is-leave');
        window.setTimeout(finish, 900);
    }

    let frame = 0;
    function tick() {
        frame += 1;
        let done = true;
        letters.forEach((letter, i) => {
            if (frame >= letter.lockAt) {
                letter.el.textContent = letter.ch;
                letter.el.classList.add('is-set');
                return;
            }
            done = false;
            letter.el.textContent = alphabet[(frame * 2 + i * 4) % 26];
        });
        if (!done) {
            window.setTimeout(tick, stepMs);
            return;
        }
        window.setTimeout(openSite, 460);
    }

    window.addEventListener('scroll', placeCv, { passive: true });
    window.addEventListener('resize', placeCv);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish();
        return;
    }

    intro.addEventListener('click', openSite);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') openSite();
    });

    tick();
})();
