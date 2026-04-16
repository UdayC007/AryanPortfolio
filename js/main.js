document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

    // Mobile menu
    const burger = document.getElementById('nav-burger');
    const navLinks = document.getElementById('nav-links');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('mobile-open');
        document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 100, behavior: 'smooth' });
        });
    });

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));

    // --- PUBG HUD: Project kill counter ---
    const projects = PortfolioData.getProjects();
    const countEl = document.getElementById('project-count');
    if (countEl && projects) {
        let count = 0;
        const target = projects.length;
        const interval = setInterval(() => {
            count++;
            countEl.textContent = count;
            if (count >= target) clearInterval(interval);
        }, 200);
    }

    // --- PUBG HUD: Zone timer (counts up like game timer) ---
    const timerEl = document.getElementById('zone-timer');
    if (timerEl) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const m = String(Math.floor(seconds / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            timerEl.textContent = m + ':' + s;
        }, 1000);
    }

    // --- Render Projects ---
    function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    function renderProjects() {
        const projects = PortfolioData.getProjects();
        const grid = document.getElementById('projects-grid');
        const empty = document.getElementById('no-projects');
        if (!projects || !projects.length) { grid.style.display = 'none'; empty.style.display = ''; return; }
        grid.style.display = ''; empty.style.display = 'none';
        grid.innerHTML = '';
        projects.forEach((p) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            const thumb = p.image
                ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
                : `<div class="project-thumb-placeholder">${esc(p.title.charAt(0))}</div>`;
            const tags = (p.tags||[]).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
            const link = p.link ? `<a href="${esc(p.link)}" target="_blank" class="project-link">OPEN CRATE →</a>` : '';
            card.innerHTML = `<div class="project-thumb">${thumb}</div><div class="project-body"><div class="project-tags">${tags}</div><h3 class="project-title">${esc(p.title)}</h3><p class="project-desc">${esc(p.description)}</p>${link}</div>`;
            grid.appendChild(card);
            setTimeout(() => obs.observe(card), 50);
        });
    }
    renderProjects();

    // --- Health bar decreases on scroll (fun effect) ---
    const healthFill = document.querySelector('.health-fill');
    const healthText = document.querySelector('.health-text');
    if (healthFill) {
        window.addEventListener('scroll', () => {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(window.scrollY / maxScroll, 1);
            const hp = Math.max(100 - Math.floor(scrollPercent * 80), 20);
            healthFill.style.width = hp + '%';
            if (healthText) healthText.textContent = 'HP ' + hp;
            if (hp < 50) {
                healthFill.style.background = 'linear-gradient(90deg, #e53935, #ff7043)';
            } else {
                healthFill.style.background = 'linear-gradient(90deg, #4caf50, #8bc34a)';
            }
        });
    }

    // Hero parallax
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        if (s < window.innerHeight && heroContent) {
            heroContent.style.transform = `translateY(${s * 0.12}px)`;
            heroContent.style.opacity = 1 - s / (window.innerHeight * 0.8);
        }
    });
});
