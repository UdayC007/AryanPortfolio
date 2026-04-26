// Aryan — public site (server-backed)
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 50));

  const burger = $('nav-burger');
  const navLinks = $('nav-links');
  if (burger) {
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
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href');
      if (target.length < 2) return;
      const t = document.querySelector(target);
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  function watchReveals() { document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el)); }
  watchReveals();

  // Zone timer (kept from original)
  const zt = $('zone-timer');
  if (zt) {
    let t = 5 * 60;
    setInterval(() => {
      t = (t - 1 + 360) % 360 + 60;
      const m = Math.floor(t / 60).toString().padStart(2, '0');
      const s = (t % 60).toString().padStart(2, '0');
      zt.textContent = `${m}:${s}`;
    }, 1000);
  }

  loadSite();
  loadProjects();

  async function loadSite() {
    try {
      const r = await fetch('/api/site');
      const s = await r.json();
      const p = s.profile || {};
      const c = s.contact || {};

      const fullName = (p.name || 'Aryan Chaudhary');
      const parts = fullName.split(' ');
      const first = (parts[0] || 'Aryan').toUpperCase();
      const last  = (parts.slice(1).join(' ') || 'Chaudhary').toUpperCase();
      const initial = (parts.slice(-1)[0] || 'C').charAt(0).toUpperCase();

      if ($('hero-first')) $('hero-first').textContent = first;
      if ($('hero-last'))  $('hero-last').textContent = last;
      if ($('hero-title')) $('hero-title').textContent = (p.title || 'UI/UX DESIGNER').toUpperCase();
      if ($('hero-college')) $('hero-college').textContent = '📍 ' + (p.college || '').toUpperCase();
      if ($('hero-tagline') && p.tagline) $('hero-tagline').textContent = p.tagline;

      $('nav-name').textContent = `${first}_${initial}`;
      $('footer-name').textContent = `★ ${fullName.toUpperCase()} © ${new Date().getFullYear()}`;
      document.title = `${fullName} — ${p.title || 'Designer'}`;

      if ($('about-name'))    $('about-name').textContent = fullName;
      if ($('about-college')) $('about-college').textContent = p.college || '';
      if ($('about-rank'))    $('about-rank').textContent = `${p.year || ''} — ${p.title || ''}`;
      if ($('about-bio'))     $('about-bio').textContent = p.bio || '';
      if ($('personal-touch')) $('personal-touch').textContent = p.personalTouch || '—';
      if ($('goals-text'))     $('goals-text').textContent = p.goals || '—';

      // Photos
      const photos = s.photos || {};
      if (photos.hero) {
        const h = $('hero-portrait-photo');
        if (h) { h.innerHTML = `<img src="${esc(photos.hero)}" alt="">`; h.classList.add('has-photo'); }
      }
      if (photos.about) {
        const a = $('about-portrait');
        if (a) { a.innerHTML = `<img src="${esc(photos.about)}" alt="">`; a.classList.add('has-photo'); }
      }
      if (photos.brand) {
        document.querySelectorAll('.brand-mark').forEach(el => {
          el.innerHTML = `<img src="${esc(photos.brand)}" class="brand-mark-img" alt="">`;
        });
      }

      // Subjects
      const subs = s.subjects || [];
      const sg = $('subject-grid');
      if (sg) {
        sg.innerHTML = subs.length
          ? subs.map(sub => `
              <div class="subject-card reveal">
                ${sub.code ? `<div class="subject-code">${esc(sub.code)}</div>` : ''}
                <div class="subject-name">${esc(sub.name)}</div>
                <div class="subject-faculty ${sub.faculty ? '' : 'empty'}">${esc(sub.faculty) || 'Faculty TBD'}</div>
              </div>`).join('')
          : `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center">No subjects loaded — add them in the admin panel.</p>`;
      }

      // Skills (rebuild stat-cards with rings)
      const skills = s.skills || [];
      const sk = $('stats-grid');
      if (sk) {
        sk.innerHTML = (skills.length ? skills : []).map(sk => `
          <div class="stat-card reveal">
            <div class="stat-bar-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" class="ring-bg"/>
                <circle cx="50" cy="50" r="40" class="ring-fill" style="--percent:${Math.max(0, Math.min(100, sk.level || 0))}"/>
              </svg>
              <span class="stat-percent">${Math.max(0, Math.min(100, sk.level || 0))}</span>
            </div>
            <h4>${esc(sk.name)}</h4>
            <p>${esc(sk.rank ? 'Rank ' + sk.rank : '')}</p>
          </div>`).join('') || '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center">No skills set yet.</p>';
      }

      // Comms
      const links = [];
      if (c.email)     links.push({ tag: '[E]', label: 'EMAIL',     value: c.email,                                href: 'mailto:' + c.email });
      if (c.instagram) links.push({ tag: '[I]', label: 'INSTAGRAM', value: '@' + c.instagram,                      href: 'https://instagram.com/' + c.instagram });
      if (c.twitter)   links.push({ tag: '[T]', label: 'TWITTER',   value: '@' + c.twitter,                        href: 'https://twitter.com/' + c.twitter });
      if (c.linkedin)  links.push({ tag: '[L]', label: 'LINKEDIN',  value: c.linkedin.replace(/^https?:\/\//, ''), href: c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin });
      const ml = $('msg-links');
      if (ml) ml.innerHTML = links.map(l => `
        <a href="${esc(l.href)}" target="_blank" rel="noopener" class="comms-link">
          <span class="comms-key">${esc(l.tag)}</span>
          <span class="comms-label">${esc(l.label)}</span>
          <span class="comms-value">${esc(l.value)}</span>
          <span class="comms-arrow">→</span>
        </a>`).join('') || '<p style="color:var(--text-muted)">Comms channel offline. Add socials in the admin panel.</p>';

      watchReveals();
    } catch (e) { console.error('loadSite failed', e); }
  }

  async function loadProjects() {
    try {
      const r = await fetch('/api/projects');
      const projects = await r.json();
      const grid = $('projects-grid');
      const empty = $('no-projects');
      if ($('project-count')) $('project-count').textContent = String(projects.length);
      if (!projects.length) { grid.style.display = 'none'; empty.style.display = ''; return; }
      grid.style.display = ''; empty.style.display = 'none';
      grid.innerHTML = projects.map(p => {
        const cover = p.images && p.images[0];
        const thumb = cover
          ? `<img src="${esc(cover)}" alt="${esc(p.title)}">`
          : `<div class="project-thumb-placeholder" style="background:${esc(p.color || '#f2a900')}">${esc((p.title || '?').charAt(0))}</div>`;
        const tags = (p.tags || []).slice(0, 3).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
        const photos = (p.images || []).length;
        const photosBadge = photos > 1 ? `<span class="project-tag">${photos} PHOTOS</span>` : '';
        return `
          <a class="project-card reveal" href="/project/${p.id}">
            <div class="project-thumb">${thumb}</div>
            <div class="project-body">
              <div class="project-tags">${tags}${photosBadge}</div>
              <h3 class="project-title">${esc(p.title)}</h3>
              <p class="project-desc">${esc((p.description || '').slice(0, 130))}${(p.description || '').length > 130 ? '…' : ''}</p>
              <span class="project-link">OPEN INTEL →</span>
            </div>
          </a>`;
      }).join('');
      watchReveals();
    } catch (e) {
      $('projects-grid').innerHTML = `<p style="color:var(--red)">Couldn't load projects: ${esc(e.message)}</p>`;
    }
  }
});
