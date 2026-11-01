/* 2027 — LUCIANO condenses, bursts through the screen, then gathers back. */

(function () {
    const word = 'LUCIANO';
    const intro = document.getElementById('lucianoIntro');
    const row = document.getElementById('lucianoIntroWord');
    const mark = document.getElementById('sectionMark');
    const sections = [
        { id: 'journey', label: 'JOURNEY' },
        { id: 'work', label: 'WORK' },
        { id: 're', label: 'RE' }
    ];

    const letters = word.split('').map((ch) => {
        const el = document.createElement('span');
        el.textContent = ch;
        row.appendChild(el);
        return { ch, el, x: 0, y: 0, bx: 0, by: 0, bz: 0, bs: 1 };
    });

    let stopped = false;
    const timers = [];

    function later(fn, ms) {
        const id = window.setTimeout(() => {
            if (!stopped) fn();
        }, ms);
        timers.push(id);
    }

    function place(el, x, y, z, s) {
        el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px) scale(' + s + ')';
    }

    function finish() {
        stopped = true;
        timers.forEach((id) => window.clearTimeout(id));
        document.body.classList.remove('intro-on');
        if (intro) intro.remove();
        placeSection();
    }

    function openSite() {
        if (!intro || intro.classList.contains('is-leave')) return;
        stopped = true;
        timers.forEach((id) => window.clearTimeout(id));
        intro.classList.add('is-leave');
        window.setTimeout(finish, 900);
    }

    function approach(topRatio) {
        const fadeInFrom = 0.92;
        const fullFrom = 0.48;
        const fullUntil = 0.02;
        const fadeOutBy = -0.2;
        if (topRatio >= fadeInFrom || topRatio <= fadeOutBy) return 0;
        if (topRatio >= fullFrom) return (fadeInFrom - topRatio) / (fadeInFrom - fullFrom);
        if (topRatio >= fullUntil) return 1;
        return (topRatio - fadeOutBy) / (fullUntil - fadeOutBy);
    }

    function placeSection() {
        if (!mark) return;
        const h = window.innerHeight || 1;
        let bestLabel = '';
        let best = 0;
        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (!el) return;
            const opacity = approach(el.getBoundingClientRect().top / h);
            if (opacity > best) {
                best = opacity;
                bestLabel = section.label;
            }
        });
        if (bestLabel) mark.textContent = bestLabel;
        mark.style.opacity = String(best);
    }

    function gather() {
        letters.forEach((letter, i) => {
            later(() => {
                letter.el.style.transition = 'none';
                place(letter.el, letter.bx, letter.by, letter.bz, letter.bs);
                letter.el.style.opacity = '0';
                row.getBoundingClientRect();
                letter.el.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';
                place(letter.el, letter.x, letter.y, 0, 1);
                letter.el.style.opacity = '1';
                later(() => letter.el.classList.add('is-set'), 420);
            }, i * 140);
        });
        later(openSite, (letters.length - 1) * 140 + 980);
    }

    function bang() {
        letters.forEach((letter, i) => {
            const angle = (i / letters.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
            const dist = Math.max(window.innerWidth, window.innerHeight) * (0.42 + Math.random() * 0.28);
            letter.bx = letter.x + Math.cos(angle) * dist;
            letter.by = letter.y + Math.sin(angle) * dist * 0.72;
            letter.bz = 280 + Math.random() * 220;
            letter.bs = 1.7 + Math.random() * 0.8;
            letter.el.style.transition = 'transform 0.42s cubic-bezier(0.15, 0.7, 0.2, 1), opacity 0.42s ease';
            place(letter.el, letter.bx, letter.by, letter.bz, letter.bs);
            letter.el.style.opacity = '0';
        });
        later(gather, 520);
    }

    function condense() {
        const width = row.offsetWidth;
        const height = row.offsetHeight;
        letters.forEach((letter) => {
            letter.x = letter.el.offsetLeft;
            letter.y = letter.el.offsetTop;
            letter.w = letter.el.offsetWidth;
            letter.h = letter.el.offsetHeight;
        });
        row.style.width = width + 'px';
        row.style.height = height + 'px';
        row.classList.add('is-flying');
        const rowRect = row.getBoundingClientRect();
        const letterW = letters[0].w || 40;
        const gap = letterW * 0.46;
        const total = gap * (letters.length - 1);
        letters.forEach((letter, i) => {
            const centerX = window.innerWidth / 2 - total / 2 + i * gap;
            const centerY = window.innerHeight / 2;
            const tx = centerX - rowRect.left - letter.w / 2;
            const ty = centerY - rowRect.top - letter.h / 2;
            letter.el.style.transition = 'none';
            letter.el.style.opacity = '1';
            place(letter.el, tx, ty, 0, 1);
        });
        later(bang, 1100);
    }

    window.addEventListener('scroll', placeSection, { passive: true });
    window.addEventListener('resize', placeSection);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish();
        return;
    }

    intro.addEventListener('click', openSite);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') openSite();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(condense);
    } else {
        condense();
    }
})();
