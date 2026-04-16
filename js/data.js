const PortfolioData = (() => {
    const STORAGE_KEY = 'aryan_portfolio_projects';
    const ADMIN_KEY = 'aryan_admin_password';

    const defaultProjects = [
        { id: '1', title: 'Fitness Tracker App', description: 'A sleek mobile app UI for tracking workouts, calories, and progress with gamification elements.', tags: ['Mobile', 'UI Design', 'Figma'], image: '', link: '', color: '#00d4ff', createdAt: Date.now() },
        { id: '2', title: 'Music Streaming Dashboard', description: 'Dark-themed web dashboard for a music platform with playlist management and audio visualizer.', tags: ['Dashboard', 'Web Design', 'Prototype'], image: '', link: '', color: '#a855f7', createdAt: Date.now() - 1000 },
        { id: '3', title: 'Travel Booking Redesign', description: 'Complete UX overhaul of a travel booking platform focusing on reducing booking friction.', tags: ['UX Research', 'Redesign', 'Case Study'], image: '', link: '', color: '#22c55e', createdAt: Date.now() - 2000 },
        { id: '4', title: 'Crypto Wallet Concept', description: 'Minimalist cryptocurrency wallet interface with real-time charts and secure transaction flow.', tags: ['Fintech', 'Mobile', 'Concept'], image: '', link: '', color: '#f59e0b', createdAt: Date.now() - 3000 }
    ];

    function getProjects() {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) return JSON.parse(s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
        return defaultProjects;
    }
    function saveProjects(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
    function addProject(p) { const all = getProjects(); p.id = Date.now().toString(); p.createdAt = Date.now(); all.unshift(p); saveProjects(all); return p; }
    function updateProject(id, d) { const all = getProjects(); const i = all.findIndex(p => p.id === id); if (i !== -1) { all[i] = { ...all[i], ...d }; saveProjects(all); return all[i]; } return null; }
    function deleteProject(id) { const all = getProjects().filter(p => p.id !== id); saveProjects(all); return all; }
    function getProject(id) { return getProjects().find(p => p.id === id) || null; }
    function setupAdmin(pw) { localStorage.setItem(ADMIN_KEY, btoa(pw)); }
    function verifyAdmin(pw) { const s = localStorage.getItem(ADMIN_KEY); if (!s) { setupAdmin('aryan2026'); return pw === 'aryan2026'; } return btoa(pw) === s; }
    function changePassword(o, n) { if (verifyAdmin(o)) { setupAdmin(n); return true; } return false; }
    function isFirstSetup() { return !localStorage.getItem(ADMIN_KEY); }
    return { getProjects, addProject, updateProject, deleteProject, getProject, verifyAdmin, changePassword, isFirstSetup };
})();
