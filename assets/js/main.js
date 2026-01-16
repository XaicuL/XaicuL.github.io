const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
document.getElementById('cmdKey').textContent = isMac ? '⌘' : 'Ctrl';

let currentLang = 'KR';
const sections = ['hero', 'journey', 'work', 'contact', 're'];

const content = {
    KR: {
        heroName: '전현준',
        heroSubtitle: 'AI & Neuroscience Explorer',
        bioText: '고개를 들어 세계를 보겠습니다. 세계라는 무대에서 만나뵙겠습니다.<br><br>저는 인공지능과 인류의 뇌를 공부하고 있는 전현준입니다.',
        journeyLabel: 'My Journey',
        journey1Title: 'Independent Research',
        journey1Desc: '인공지능과 뇌과학의 교차점에서 새로운 가능성을 탐구하고 있습니다.',
        journey2Title: 'The Beginning',
        journey2Desc: 'AI의 세계에 첫 발을 내디뎠습니다. 끝없는 호기심이 여정의 시작이었습니다.',
        workLabel: 'Work & Publications',
        workDesc: '현재 진행 중인 연구가 곧 공개될 예정입니다.',
        contactLabel: 'Get in Touch',
        downloadCV: 'CV 다운로드'
    },
    EN: {
        heroName: 'HYUNJUN Jeon',
        heroSubtitle: 'AI & Neuroscience Explorer',
        bioText: 'I will lift my head and look at the world. I will stand on the stage called the world.<br><br>I am Hyunjun Jeon, studying artificial intelligence and the human brain.',
        journeyLabel: 'My Journey',
        journey1Title: 'Independent Research',
        journey1Desc: 'Exploring new possibilities at the intersection of AI and neuroscience.',
        journey2Title: 'The Beginning',
        journey2Desc: 'Took my first steps into the world of AI. Endless curiosity marked the start of this journey.',
        workLabel: 'Work & Publications',
        workDesc: 'Research in progress. Coming soon.',
        contactLabel: 'Get in Touch',
        downloadCV: 'Download CV'
    }
};

function updateContent() {
    const c = content[currentLang];
    for (const key in c) {
        const el = document.getElementById(key);
        if (el) {
            el[key === 'bioText' ? 'innerHTML' : 'textContent'] = c[key];
        }
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'KR' ? 'EN' : 'KR';
    document.getElementById('langBtn').textContent = currentLang === 'KR' ? 'EN' : 'KR';
    updateContent();
    if (typeof generateReCards === 'function') generateReCards();
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function getCurrentSection() {
    const scrollTop = window.scrollY;
    let current = 'hero';
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el && el.offsetTop - 200 <= scrollTop) current = s;
    });
    return current;
}

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progressBar').style.width = (scrollTop / docHeight) * 100 + '%';

    const current = getCurrentSection();
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.section === current);
    });
});

document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
    }
    if (e.key === 'Escape') closeCommandPalette();

    if (!document.getElementById('cmdPalette').classList.contains('show')) {
        const keys = { '1': 'hero', '2': 'journey', '3': 'work', '4': 'contact', '5': 're' };
        if (keys[e.key]) scrollToSection(keys[e.key]);
        if (e.key.toLowerCase() === 'g') window.open('https://github.com/XaicuL', '_blank');
        if (e.key.toLowerCase() === 'l') toggleLanguage();

        const idx = sections.indexOf(getCurrentSection());
        if (e.key.toLowerCase() === 'j' && idx < sections.length - 1) scrollToSection(sections[idx + 1]);
        if (e.key.toLowerCase() === 'k' && idx > 0) scrollToSection(sections[idx - 1]);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateContent();
    if (typeof generateReCards === 'function') generateReCards();
});
