#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════╗
║           🎯 Luciano CV Manager v1.0                          ║
║     웹페이지의 모든 콘텐츠를 코드 수정 없이 관리합니다        ║
╚═══════════════════════════════════════════════════════════════╝

관리 항목:
1. 프로필 - 이름, 소개, 바이오
2. Journey - 타임라인 항목
3. Work - 프로젝트/논문
4. Contact - 연락처
5. Re - 월별 다짐/회고
6. Git - 커밋 & 푸시
"""

import os
import re
import json
import subprocess
from datetime import datetime

# ═══════════════════════════════════════════════════════════════
# 경로 설정
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, "assets")
JS_DIR = os.path.join(ASSETS_DIR, "js")
POSTS_DIR = os.path.join(SCRIPT_DIR, "_posts")
DATA_FILE = os.path.join(SCRIPT_DIR, "data.json")

# ═══════════════════════════════════════════════════════════════
# 데이터 관리 (JSON 파일로 모든 콘텐츠 저장)
# ═══════════════════════════════════════════════════════════════
DEFAULT_DATA = {
    "profile": {
        "name_kr": "전현준",
        "name_en": "HYUNJUN Jeon",
        "subtitle_kr": "AI & Neuroscience Explorer",
        "subtitle_en": "AI & Neuroscience Explorer",
        "bio_kr": "고개를 들어 세계를 보겠습니다. 세계라는 무대에서 만나뵙겠습니다.<br><br>저는 인공지능과 인류의 뇌를 공부하고 있는 전현준입니다.",
        "bio_en": "I will lift my head and look at the world. I will stand on the stage called the world.<br><br>I am Hyunjun Jeon, studying artificial intelligence and the human brain."
    },
    "journey": [
        {
            "year": "2025 - Present",
            "title_kr": "Independent Research",
            "title_en": "Independent Research",
            "desc_kr": "인공지능과 뇌과학의 교차점에서 새로운 가능성을 탐구하고 있습니다.",
            "desc_en": "Exploring new possibilities at the intersection of AI and neuroscience.",
            "tags": ["AI", "Neuroscience", "Research"]
        },
        {
            "year": "2024",
            "title_kr": "The Beginning",
            "title_en": "The Beginning",
            "desc_kr": "AI의 세계에 첫 발을 내디뎠습니다. 끝없는 호기심이 여정의 시작이었습니다.",
            "desc_en": "Took my first steps into the world of AI. Endless curiosity marked the start of this journey.",
            "tags": ["Learning", "Exploration"]
        }
    ],
    "work": [
        {
            "year": "Coming Soon",
            "title": "Research Papers",
            "desc_kr": "현재 진행 중인 연구가 곧 공개될 예정입니다.",
            "desc_en": "Research in progress. Coming soon.",
            "tags": ["Paper"]
        }
    ],
    "contact": {
        "email": "hyunjun050915@gmail.com",
        "github": "XaicuL",
        "github_url": "https://github.com/XaicuL",
        "devto": "luc1a_no",
        "devto_url": "https://dev.to/luc1a_no",
        "scholar_url": "https://scholar.google.com/citations?user=-7L12NQAAAAJ&hl=en&authuser=1",
        "linkedin": "luciano05",
        "linkedin_url": "https://www.linkedin.com/in/luciano05/"
    },
    "re": [
        {
            "month": "2026.01",
            "url": "/re/2026-01/",
            "title": "다짐과 회고",
            "resolve": "새해의 시작, AI와 뇌과학의 교차점에서 더 깊이 탐구하겠습니다.",
            "retrospect": "아직 진행 중..."
        },
        {
            "month": "2025.12",
            "url": "/re/2025-12/",
            "title": "다짐과 회고",
            "resolve": "한 해를 마무리하며 다음 단계를 준비합니다.",
            "retrospect": "2025년은 AI 연구의 첫 걸음을 뗀 해였습니다."
        },
        {
            "month": "2025.11",
            "url": "/re/2025-11/",
            "title": "다짐과 회고",
            "resolve": "꾸준함의 힘을 믿습니다.",
            "retrospect": "코드와 논문 사이에서 균형을 찾는 법을 배웠습니다."
        }
    ]
}


def load_data():
    """데이터 로드"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_DATA.copy()


def save_data(data):
    """데이터 저장"""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ data.json 저장 완료")


# ═══════════════════════════════════════════════════════════════
# JavaScript 파일 생성
# ═══════════════════════════════════════════════════════════════
def generate_main_js(data):
    """main.js 생성"""
    profile = data["profile"]
    journey = data["journey"]
    work = data["work"]
    contact = data["contact"]
    
    # JSON serialize for JS
    journey_json = json.dumps(journey, ensure_ascii=False)
    work_json = json.dumps(work, ensure_ascii=False)
    
    js_content = f'''/* ==================================
   main.js - Core functionality
   ⚠️ 이 파일은 manager.py가 자동 생성합니다
   ================================== */

// Detect OS for keyboard shortcuts
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0;

if (isMac) document.body.classList.add('is-mac');
else if (isWin) document.body.classList.add('is-win');

let currentLang = 'KR';
const sections = ['hero', 'journey', 'work', 'contact', 're', 'updates'];

// Data from manager.py
const journeyData = {journey_json};
const workData = {work_json};

// Language content - Generated by manager.py
const content = {{
    KR: {{
        heroName: '{profile["name_kr"]}',
        heroSubtitle: '{profile["subtitle_kr"]}',
        bioText: '{profile["bio_kr"]}',
        journeyLabel: 'My Journey',
        workLabel: 'Work & Publications',
        contactLabel: 'Get in Touch',
        downloadCV: 'CV 다운로드',
        updatesLabel: 'Updates'
    }},
    EN: {{
        heroName: '{profile["name_en"]}',
        heroSubtitle: '{profile["subtitle_en"]}',
        bioText: '{profile["bio_en"]}',
        journeyLabel: 'My Journey',
        workLabel: 'Work & Publications',
        contactLabel: 'Get in Touch',
        downloadCV: 'Download CV',
        updatesLabel: 'Updates'
    }}
}};

function renderTimeline(data, containerId) {{
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = data.map(item => `
        <div class="timeline-item">
            <div class="timeline-year">${{item.year}}</div>
            <div class="timeline-title">${{currentLang === 'KR' ? (item.title_kr || item.title) : (item.title_en || item.title)}}</div>
            <div class="timeline-desc">${{currentLang === 'KR' ? item.desc_kr : item.desc_en}}</div>
            <div class="timeline-tags">
                ${{item.tags.map(tag => `<span class="tag">${{tag}}</span>`).join('')}}
            </div>
        </div>
    `).join('');
}}

function updateContent() {{
    const c = content[currentLang];
    for (const key in c) {{
        const el = document.getElementById(key);
        if (el) {{
            if (key === 'bioText') {{
                el.innerHTML = c[key];
            }} else {{
                el.textContent = c[key];
            }}
        }}
    }}
    renderTimeline(journeyData, 'journeyTimeline');
    renderTimeline(workData, 'workTimeline');
    
    // Re-render MathJax after dynamic content is loaded
    if (typeof MathJax !== 'undefined' && MathJax.typeset) {{
        MathJax.typeset();
    }}
}}

async function fetchUpdates() {{
    const grid = document.getElementById('updatesGrid');
    try {{
        const response = await fetch('https://dev.to/api/articles?username={contact.get("devto", "luc1a_no")}&per_page=3');
        const posts = await response.json();
        
        if (posts.length === 0) {{
            grid.innerHTML = '<div class="loading-spinner">No recent updates found.</div>';
            return;
        }}

        grid.innerHTML = posts.map(post => `
            <a href="${{post.url}}" target="_blank" class="update-card">
                <div class="update-date">${{new Date(post.published_at).toLocaleDateString()}}</div>
                <div class="update-title">${{post.title}}</div>
                <div class="update-tags">
                    ${{post.tag_list.map(tag => `<span class="tag">#${{tag}}</span>`).join('')}}
                </div>
            </a>
        `).join('');
    }} catch (error) {{
        grid.innerHTML = '<div class="loading-spinner">Failed to load updates.</div>';
    }}
}}

function toggleLanguage() {{
    currentLang = currentLang === 'KR' ? 'EN' : 'KR';
    document.getElementById('langBtn').textContent = currentLang === 'KR' ? 'EN' : 'KR';
    updateContent();
    if (typeof generateReCards === 'function') {{
        generateReCards();
    }}
}}

function scrollToSection(sectionId) {{
    document.getElementById(sectionId).scrollIntoView({{ behavior: 'smooth' }});
}}

function getCurrentSection() {{
    const scrollTop = window.scrollY;
    let currentSection = 'hero';
    sections.forEach(section => {{
        const el = document.getElementById(section);
        if (el && el.offsetTop - 200 <= scrollTop) {{
            currentSection = section;
        }}
    }});
    return currentSection;
}}

// Progress bar & active nav dot
window.addEventListener('scroll', () => {{
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    let currentSection = 'hero';
    sections.forEach(section => {{
        const el = document.getElementById(section);
        if (el && el.offsetTop - 200 <= scrollTop) {{
            currentSection = section;
        }}
    }});

    document.querySelectorAll('.nav-dot').forEach(dot => {{
        dot.classList.toggle('active', dot.dataset.section === currentSection);
    }});
}});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {{
    const palette = document.getElementById('cmdPalette');
    const isPaletteOpen = palette.classList.contains('show');
    const isCmdK = isMac ? (e.metaKey && e.key === 'k') : (e.ctrlKey && e.key === 'k');

    if (isCmdK) {{
        e.preventDefault();
        openCommandPalette();
        return;
    }}

    if (e.key === 'Escape') {{
        closeCommandPalette();
        return;
    }}

    // Section Shortcuts (1-6)
    const sectionMap = {{
        '1': 'hero', '2': 'journey', '3': 'work',
        '4': 'contact', '5': 're', '6': 'updates'
    }};

    const key = e.key.toLowerCase();
    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

    if (sectionMap[key]) {{
        if (!isInput || isPaletteOpen) {{
            e.preventDefault();
            scrollToSection(sectionMap[key]);
            if (isPaletteOpen) closeCommandPalette();
        }}
    }}

    // Social & Functional Shortcuts
    const socialMap = {{
        'g': '{contact.get("github_url", "https://github.com/XaicuL")}',
        'b': '{contact.get("devto_url", "https://dev.to/luc1a_no")}',
        's': '{contact.get("scholar_url", "https://scholar.google.com/citations?user=-7L12NQAAAAJ&hl=en&authuser=1")}',
        'l': '{contact.get("linkedin_url", "https://www.linkedin.com/in/luciano05/")}'
    }};

    if (socialMap[key]) {{
        if (!isInput || isPaletteOpen) {{
            e.preventDefault();
            window.open(socialMap[key], '_blank');
            if (isPaletteOpen) closeCommandPalette();
        }}
    }}

    if (key === 't') {{
        if (!isInput || isPaletteOpen) {{
            e.preventDefault();
            toggleLanguage();
            if (isPaletteOpen) closeCommandPalette();
        }}
    }}

    if (!isPaletteOpen && !isInput) {{
        if (key === 'j') {{
            const currentIdx = sections.indexOf(getCurrentSection());
            if (currentIdx < sections.length - 1) {{
                scrollToSection(sections[currentIdx + 1]);
            }}
        }}
        if (key === 'k') {{
            const currentIdx = sections.indexOf(getCurrentSection());
            if (currentIdx > 0) {{
                scrollToSection(sections[currentIdx - 1]);
            }}
        }}
    }}
}});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {{
    updateContent();
    fetchUpdates();
    if (typeof generateReCards === 'function') {{
        generateReCards();
    }}
}});
'''
    
    with open(os.path.join(JS_DIR, "main.js"), "w", encoding="utf-8") as f:
        f.write(js_content)
    print("✅ main.js 생성 완료")


def generate_re_section_js(data):
    """re-section.js 생성"""
    re_items = data["re"]
    
    re_data_str = ",\n".join([
        f"    {{ month: '{item['month']}', url: '{item['url']}', title: '{item['title']}', resolve: '{item['resolve']}', retrospect: '{item['retrospect']}' }}"
        for item in re_items
    ])
    
    js_content = f'''/* ==================================
   re-section.js - Monthly Retrospective Section
   ⚠️ 이 파일은 manager.py가 자동 생성합니다
   ================================== */

const isLocal = window.location.protocol === 'file:';

// Re section data - Generated by manager.py
const reData = [
{re_data_str}
];

let activeFilter = 'all';

function generateReCards() {{
    const grid = document.getElementById('reGrid');
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'KR';
    
    const filteredData = activeFilter === 'all' 
        ? reData 
        : reData.filter(item => item.month.startsWith(activeFilter));

    if (isLocal) {{
        grid.innerHTML = filteredData.map((item, idx) => `
            <div class="re-card" onclick="toggleReCard(${{idx}})" data-idx="${{idx}}">
                <div class="re-month">${{item.month}}</div>
                <div class="re-title">${{item.title}}</div>
                <div class="re-status">${{lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand'}}</div>
                <div class="re-content">
                    <div class="re-section-title">${{lang === 'KR' ? '다짐 Resolve' : 'Resolve'}}</div>
                    <p class="re-text">${{item.resolve}}</p>
                    <div class="re-divider"></div>
                    <div class="re-section-title">${{lang === 'KR' ? '회고 Retrospect' : 'Retrospect'}}</div>
                    <p class="re-text">${{item.retrospect}}</p>
                </div>
            </div>
        `).join('');
    }} else {{
        grid.innerHTML = filteredData.map((item) => `
            <a href="${{item.url}}" class="re-card-link">
                <div class="re-card">
                    <div class="re-month">${{item.month}}</div>
                    <div class="re-title">${{item.title}}</div>
                    <div class="re-status">${{lang === 'KR' ? '블로그로 이동 →' : 'Go to post →'}}</div>
                </div>
            </a>
        `).join('');
    }}
    
    updateFilterOptions();
}}

function updateFilterOptions() {{
    const filter = document.getElementById('reYearFilter');
    if (!filter) return;
    
    const years = [...new Set(reData.map(item => item.month.split('.')[0]))].sort().reverse();
    const currentOptions = Array.from(filter.options).map(opt => opt.value);
    
    years.forEach(year => {{
        if (!currentOptions.includes(year)) {{
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + ' Year';
            filter.appendChild(option);
        }}
    }});
}}

function filterReCards() {{
    const filter = document.getElementById('reYearFilter');
    activeFilter = filter.value;
    generateReCards();
}}

function toggleReCard(idx) {{
    const cards = document.querySelectorAll('.re-card');
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'KR';
    
    cards.forEach((card, i) => {{
        if (i === idx) {{
            card.classList.toggle('active');
            const status = card.querySelector('.re-status');
            if (status) {{
                status.textContent = card.classList.contains('active')
                    ? (lang === 'KR' ? '클릭하여 접기' : 'Click to collapse')
                    : (lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand');
            }}
        }} else {{
            card.classList.remove('active');
            const status = card.querySelector('.re-status');
            if (status) {{
                status.textContent = lang === 'KR' ? '클릭하여 펼치기' : 'Click to expand';
            }}
        }}
    }});
}}
'''
    
    with open(os.path.join(JS_DIR, "re-section.js"), "w", encoding="utf-8") as f:
        f.write(js_content)
    print("✅ re-section.js 생성 완료")


def generate_index_html(data):
    """index.html의 링크들을 업데이트"""
    index_path = os.path.join(SCRIPT_DIR, "index.html")
    
    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    contact = data["contact"]
    
    # GitHub 링크 업데이트
    content = re.sub(
        r'<a href="https://github\.com/[^"]*" target="_blank" class="social-link" title="GitHub"',
        f'<a href="{contact.get("github_url", "https://github.com/" + contact["github"])}" target="_blank" class="social-link" title="GitHub"',
        content
    )
    
    # Dev.to 링크 업데이트
    content = re.sub(
        r'<a href="https://dev\.to/[^"]*" target="_blank" class="social-link" title="Dev\.to"',
        f'<a href="{contact.get("devto_url", "https://dev.to/luc1a_no")}" target="_blank" class="social-link" title="Dev.to"',
        content
    )
    
    # Google Scholar 링크 업데이트
    content = re.sub(
        r'<a href="https://scholar\.google\.com/[^"]*" target="_blank" class="social-link"',
        f'<a href="{contact.get("scholar_url", "")}" target="_blank" class="social-link"',
        content
    )
    
    # LinkedIn 링크 업데이트
    content = re.sub(
        r'<a href="https://www\.linkedin\.com/in/[^"]*" target="_blank" class="social-link"',
        f'<a href="{contact.get("linkedin_url", "https://www.linkedin.com/in/luciano05/")}" target="_blank" class="social-link"',
        content
    )
    
    # 이메일 업데이트
    content = re.sub(
        r'<a href="mailto:[^"]*" class="contact-card"',
        f'<a href="mailto:{contact["email"]}" class="contact-card"',
        content
    )
    content = re.sub(
        r'<div class="contact-value">[^<]*@[^<]*</div>',
        f'<div class="contact-value">{contact["email"]}</div>',
        content
    )
    
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ index.html 링크 업데이트 완료")


def rebuild_all(data):
    """모든 파일 재생성"""
    generate_main_js(data)
    generate_re_section_js(data)
    generate_index_html(data)
    print("\n🎉 모든 파일 재생성 완료!")


# ═══════════════════════════════════════════════════════════════
# 메뉴 함수들
# ═══════════════════════════════════════════════════════════════
def manage_profile(data):
    """프로필 관리"""
    print("\n" + "─" * 40)
    print("👤 프로필 관리")
    print("─" * 40)
    print(f"1. 이름 (KR): {data['profile']['name_kr']}")
    print(f"2. 이름 (EN): {data['profile']['name_en']}")
    print(f"3. 소개 (KR): {data['profile']['subtitle_kr']}")
    print(f"4. 소개 (EN): {data['profile']['subtitle_en']}")
    print("5. 바이오 수정")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip()
    
    if choice == "1":
        data['profile']['name_kr'] = input("새 이름 (KR): ").strip()
    elif choice == "2":
        data['profile']['name_en'] = input("새 이름 (EN): ").strip()
    elif choice == "3":
        data['profile']['subtitle_kr'] = input("새 소개 (KR): ").strip()
    elif choice == "4":
        data['profile']['subtitle_en'] = input("새 소개 (EN): ").strip()
    elif choice == "5":
        print("\n현재 바이오 (KR):")
        print(data['profile']['bio_kr'])
        data['profile']['bio_kr'] = input("\n새 바이오 (KR, <br>로 줄바꿈): ").strip()
        data['profile']['bio_en'] = input("새 바이오 (EN): ").strip()
    
    if choice in ["1", "2", "3", "4", "5"]:
        save_data(data)
        rebuild_all(data)


def manage_journey(data):
    """Journey 관리"""
    print("\n" + "─" * 40)
    print("🚀 Journey 관리")
    print("─" * 40)
    
    for i, item in enumerate(data['journey']):
        print(f"{i+1}. [{item['year']}] {item['title_kr']}")
    
    print("\na. 새 항목 추가")
    print("d. 항목 삭제")
    print("e. 항목 수정")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip().lower()
    
    if choice == "a":
        new_item = {
            "year": input("연도 (예: 2025 - Present): ").strip(),
            "title_kr": input("제목 (KR): ").strip(),
            "title_en": input("제목 (EN): ").strip(),
            "desc_kr": input("설명 (KR): ").strip(),
            "desc_en": input("설명 (EN): ").strip(),
            "tags": input("태그 (쉼표로 구분): ").strip().split(",")
        }
        new_item["tags"] = [t.strip() for t in new_item["tags"]]
        
        # 맨 앞에 추가 (최신순)
        data['journey'].insert(0, new_item)
        save_data(data)
        rebuild_all(data)
        
    elif choice == "d":
        idx = int(input("삭제할 번호: ").strip()) - 1
        if 0 <= idx < len(data['journey']):
            del data['journey'][idx]
            save_data(data)
            rebuild_all(data)
            
    elif choice == "e":
        idx = int(input("수정할 번호: ").strip()) - 1
        if 0 <= idx < len(data['journey']):
            item = data['journey'][idx]
            print(f"\n현재: [{item['year']}] {item['title_kr']}")
            item['year'] = input(f"연도 [{item['year']}]: ").strip() or item['year']
            item['title_kr'] = input(f"제목 KR [{item['title_kr']}]: ").strip() or item['title_kr']
            item['title_en'] = input(f"제목 EN [{item['title_en']}]: ").strip() or item['title_en']
            item['desc_kr'] = input(f"설명 KR: ").strip() or item['desc_kr']
            item['desc_en'] = input(f"설명 EN: ").strip() or item['desc_en']
            save_data(data)
            rebuild_all(data)


def manage_work(data):
    """Work 관리"""
    print("\n" + "─" * 40)
    print("📚 Work & Publications 관리")
    print("─" * 40)
    
    for i, item in enumerate(data['work']):
        print(f"{i+1}. [{item['year']}] {item['title']}")
    
    print("\na. 새 항목 추가")
    print("d. 항목 삭제")
    print("e. 항목 수정")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip().lower()
    
    if choice == "a":
        new_item = {
            "year": input("연도: ").strip(),
            "title": input("제목: ").strip(),
            "desc_kr": input("설명 (KR): ").strip(),
            "desc_en": input("설명 (EN): ").strip(),
            "tags": input("태그 (쉼표로 구분): ").strip().split(",")
        }
        new_item["tags"] = [t.strip() for t in new_item["tags"]]
        data['work'].insert(0, new_item)
        save_data(data)
        rebuild_all(data)
        
    elif choice == "d":
        idx = int(input("삭제할 번호: ").strip()) - 1
        if 0 <= idx < len(data['work']):
            del data['work'][idx]
            save_data(data)
            rebuild_all(data)
            
    elif choice == "e":
        idx = int(input("수정할 번호: ").strip()) - 1
        if 0 <= idx < len(data['work']):
            item = data['work'][idx]
            item['year'] = input(f"연도 [{item['year']}]: ").strip() or item['year']
            item['title'] = input(f"제목 [{item['title']}]: ").strip() or item['title']
            item['desc_kr'] = input(f"설명 KR: ").strip() or item['desc_kr']
            item['desc_en'] = input(f"설명 EN: ").strip() or item['desc_en']
            save_data(data)
            rebuild_all(data)


def manage_contact(data):
    """Contact & Links 관리"""
    print("\n" + "─" * 40)
    print("✉️ Contact & Links 관리")
    print("─" * 40)
    print(f"1. Email: {data['contact']['email']}")
    print(f"2. GitHub: {data['contact'].get('github_url', 'https://github.com/' + data['contact']['github'])}")
    print(f"3. Dev.to: {data['contact'].get('devto_url', 'https://dev.to/luc1a_no')}")
    print(f"4. Google Scholar: {data['contact'].get('scholar_url', '(미설정)')}")
    print(f"5. LinkedIn: {data['contact'].get('linkedin_url', '(미설정)')}")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip()
    
    if choice == "1":
        data['contact']['email'] = input("새 이메일: ").strip()
        save_data(data)
        generate_index_html(data)
        print("✅ 이메일 업데이트 완료")
    elif choice == "2":
        username = input("GitHub 사용자명: ").strip()
        data['contact']['github'] = username
        data['contact']['github_url'] = f"https://github.com/{username}"
        save_data(data)
        generate_index_html(data)
        print("✅ GitHub 업데이트 완료")
    elif choice == "3":
        username = input("Dev.to 사용자명: ").strip()
        data['contact']['devto'] = username
        data['contact']['devto_url'] = f"https://dev.to/{username}"
        save_data(data)
        rebuild_all(data) # To update fetch url in js
        print("✅ Dev.to 업데이트 완료")
    elif choice == "4":
        url = input("Google Scholar 프로필 URL: ").strip()
        data['contact']['scholar_url'] = url
        save_data(data)
        generate_index_html(data)
        print("✅ Google Scholar 업데이트 완료")
    elif choice == "5":
        username = input("LinkedIn 사용자명: ").strip()
        data['contact']['linkedin'] = username
        data['contact']['linkedin_url'] = f"https://www.linkedin.com/in/{username}/"
        save_data(data)
        generate_index_html(data)
        print("✅ LinkedIn 업데이트 완료")


def parse_date_input():
    """날짜 입력 처리"""
    year = input("📅 연도 (예: 2026 또는 26): ").strip().replace("년", "")
    if len(year) == 2:
        year = f"20{year}"
    
    month = input("📅 월 (예: 01 또는 1): ").strip().replace("월", "").zfill(2)
    day = input("📅 일 (예: 01 또는 1): ").strip().replace("일", "").zfill(2)
    
    return f"{year}-{month}-{day}", f"{year}.{month}"


def manage_re(data):
    """Re 섹션 관리"""
    print("\n" + "─" * 40)
    print("📝 Re (다짐 & 회고) 관리")
    print("─" * 40)
    
    for i, item in enumerate(data['re']):
        print(f"{i+1}. [{item['month']}] {item['title']}")
    
    print("\na. 새 항목 추가")
    print("d. 항목 삭제")
    print("e. 항목 수정")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip().lower()
    
    if choice == "a":
        date_str, month = parse_date_input()
        
        # 이미 존재하는지 확인
        if any(item['month'] == month for item in data['re']):
            print(f"⚠️ {month}이(가) 이미 존재합니다")
            return
        
        new_item = {
            "month": month,
            "url": f"/re/{date_str[:7].replace('.', '-')}/",
            "title": "다짐과 회고",
            "resolve": input("다짐 내용: ").strip(),
            "retrospect": input("회고 내용: ").strip()
        }
        
        # 맨 앞에 추가 (최신순)
        data['re'].insert(0, new_item)
        
        # Jekyll 포스트 생성
        create_jekyll_post(date_str, month, new_item)
        
        save_data(data)
        rebuild_all(data)
        
    elif choice == "d":
        idx = int(input("삭제할 번호: ").strip()) - 1
        if 0 <= idx < len(data['re']):
            del data['re'][idx]
            save_data(data)
            rebuild_all(data)
            
    elif choice == "e":
        idx = int(input("수정할 번호: ").strip()) - 1
        if 0 <= idx < len(data['re']):
            item = data['re'][idx]
            print(f"\n현재: [{item['month']}]")
            item['resolve'] = input(f"다짐: ").strip() or item['resolve']
            item['retrospect'] = input(f"회고: ").strip() or item['retrospect']
            save_data(data)
            rebuild_all(data)


def create_jekyll_post(date_str, month, item):
    """Jekyll 포스트 생성"""
    filename = f"{date_str}-monthly.md"
    filepath = os.path.join(POSTS_DIR, filename)
    
    if not os.path.exists(POSTS_DIR):
        os.makedirs(POSTS_DIR)
    
    content = f'''---
layout: post
title: "{item['title']}"
month: "{month}"
---

## 다짐 (Resolve)

{item['resolve']}

---

## 회고 (Retrospect)

{item['retrospect']}
'''
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Jekyll 포스트 생성: {filename}")


def git_operations():
    """Git 작업"""
    print("\n" + "─" * 40)
    print("🚀 Git 작업")
    print("─" * 40)
    print("1. 커밋 & 푸시")
    print("2. 상태 확인")
    print("0. 뒤로")
    
    choice = input("\n선택: ").strip()
    
    if choice == "1":
        message = input("커밋 메시지: ").strip() or "Update via manager.py"
        try:
            subprocess.run(["git", "add", "."], cwd=SCRIPT_DIR, check=True)
            subprocess.run(["git", "commit", "-m", message], cwd=SCRIPT_DIR, check=True)
            subprocess.run(["git", "push"], cwd=SCRIPT_DIR, check=True)
            print("✅ Git 커밋 & 푸시 완료!")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Git 오류: {e}")
            
    elif choice == "2":
        subprocess.run(["git", "status"], cwd=SCRIPT_DIR)


# ═══════════════════════════════════════════════════════════════
# 메인 메뉴
# ═══════════════════════════════════════════════════════════════
def main():
    print("\n" + "═" * 50)
    print("     🎯 Luciano CV Manager v1.2")
    print("═" * 50)
    
    data = load_data()
    
    # 첫 실행 시 data.json이 없으면 생성
    if not os.path.exists(DATA_FILE):
        save_data(data)
        rebuild_all(data)
    
    while True:
        print("\n┌─────────────────────────────────────────┐")
        print("│  1. 👤 프로필    2. 🚀 Journey          │")
        print("│  3. 📚 Work      4. ✉️  Contact          │")
        print("│  5. 📝 Re        6. 🔄 전체 재생성      │")
        print("│  7. 🚀 Git                              │")
        print("│  0. 종료                                │")
        print("└─────────────────────────────────────────┘")
        
        choice = input("\n선택: ").strip()
        
        if choice == "0":
            print("\n👋 안녕히 가세요!\n")
            break
        elif choice == "1":
            manage_profile(data)
        elif choice == "2":
            manage_journey(data)
        elif choice == "3":
            manage_work(data)
        elif choice == "4":
            manage_contact(data)
        elif choice == "5":
            manage_re(data)
        elif choice == "6":
            rebuild_all(data)
        elif choice == "7":
            git_operations()
        else:
            print("❌ 잘못된 선택입니다.")


if __name__ == "__main__":
    main()
