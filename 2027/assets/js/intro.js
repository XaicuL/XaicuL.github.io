/* 2027 — letters surge forward, gather from random points, then ignite.
   Section words appear on the way in and fade once that section settles. */

(function () {
    const word = 'LUCIANO';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const intro = document.getElementById('lucianoIntro');
    const row = document.getElementById('lucianoIntroWord');
    const mark = document.getElementById('sectionMark');
    const sections = [
        { id: 'journey', label: 'JOURNEY' },
        { id: 'work', label: 'WORK' },
        { id: 're', label: 'RE' }
    ];

    const letters = word.split('').map((ch, i) => {
        const el = document.createElement('span');
        el.textContent = alphabet[(i * 5) % 26];
        row.appendChild(el);
        return { ch, el, locked: false, x: 0, y: 0 };
    });

    let stopped = false;
    let frame = 0;
    const timers = [];
    let glyphTimer = 0;

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
        window.clearInterval(glyphTimer);
        document.body.classList.remove('intro-on');
        if (intro) intro.remove();
        placeSection();
    }

    function openSite() {
        if (!intro || intro.classList.contains('is-leave')) return;
        stopped = true;
        timers.forEach((id) => window.clearTimeout(id));
        window.clearInterval(glyphTimer);
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

    function ignite() {
        window.clearInterval(glyphTimer);
        letters.forEach((letter, i) => {
            later(() => {
                letter.locked = true;
                letter.el.textContent = letter.ch;
                letter.el.classList.add('is-set');
            }, i * 130);
        });
        later(openSite, letters.length * 130 + 480);
    }

    function gather() {
        const stage = row.getBoundingClientRect();
        letters.forEach((letter) => {
            letter.el.style.transition = 'none';
            let x = Math.random() * window.innerWidth - stage.left;
            let y = Math.random() * window.innerHeight - stage.top;
            const dx = x - letter.x;
            const dy = y - letter.y;
            if (Math.hypot(dx, dy) < 180) {
                x += dx >= 0 ? 220 : -220;
                y += dy >= 0 ? 160 : -160;
            }
            place(letter.el, x, y, 0, 0.5);
        });
        row.getBoundingClientRect();
        letters.forEach((letter, i) => {
            later(() => {
                letter.el.style.transition = 'transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)';
                place(letter.el, letter.x, letter.y, 0, 1);
            }, 40 + i * 120);
        });
        later(ignite, 40 + (letters.length - 1) * 120 + 740);
    }

    function surge() {
        const width = row.offsetWidth;
        const height = row.offsetHeight;
        letters.forEach((letter) => {
            letter.x = letter.el.offsetLeft;
            letter.y = letter.el.offsetTop;
        });
        row.style.width = width + 'px';
        row.style.height = height + 'px';
        row.classList.add('is-flying');
        const cx = width / 2 - 20;
        const cy = height / 2;
        letters.forEach((letter) => {
            letter.el.style.transition = 'none';
            place(letter.el, cx, cy, -640, 0.18);
        });
        row.getBoundingClientRect();
        letters.forEach((letter) => {
            letter.el.style.transition = 'transform 0.78s cubic-bezier(0.16, 1, 0.3, 1)';
            place(letter.el, cx, cy, 180, 1.28);
        });
        later(gather, 980);
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

    glyphTimer = window.setInterval(() => {
        frame += 1;
        letters.forEach((letter, i) => {
            if (letter.locked) return;
            letter.el.textContent = alphabet[(frame * 2 + i * 4) % 26];
        });
    }, 48);

    surge();
})();
