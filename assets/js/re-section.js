const isLocal = window.location.protocol === 'file:';
const reData = [];

function generateReCards() {
    const grid = document.getElementById('reGrid');
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'KR';

    if (isLocal) {
        grid.innerHTML = reData.map((item, idx) => `
            <div class="re-card" onclick="toggleReCard(${idx})" data-idx="${idx}">
                <div class="re-month">${item.month}</div>
                <div class="re-title">${item.title}</div>
                <div class="re-status">${lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand'}</div>
                <div class="re-content">
                    <div class="re-section-title">${lang === 'KR' ? '다짐 Resolve' : 'Resolve'}</div>
                    <p class="re-text">${item.resolve}</p>
                    <div class="re-divider"></div>
                    <div class="re-section-title">${lang === 'KR' ? '회고 Retrospect' : 'Retrospect'}</div>
                    <p class="re-text">${item.retrospect}</p>
                </div>
            </div>
        `).join('');
    } else {
        grid.innerHTML = reData.map(item => `
            <a href="${item.url}" class="re-card-link">
                <div class="re-card">
                    <div class="re-month">${item.month}</div>
                    <div class="re-title">${item.title}</div>
                    <div class="re-status">${lang === 'KR' ? '블로그로 이동 →' : 'Go to post →'}</div>
                </div>
            </a>
        `).join('');
    }
}

function toggleReCard(idx) {
    const cards = document.querySelectorAll('.re-card');
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'KR';

    cards.forEach((card, i) => {
        const status = card.querySelector('.re-status');
        if (i === idx) {
            card.classList.toggle('active');
            if (status) {
                status.textContent = card.classList.contains('active')
                    ? (lang === 'KR' ? '클릭하여 접기' : 'Click to collapse')
                    : (lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand');
            }
        } else {
            card.classList.remove('active');
            if (status) status.textContent = lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand';
        }
    });
}
