/**
 * PulsePlay - Gaming Hub Core Logic
 * 1. Neon Particle Generator
 * 2. Backend Proxy Integration (Twitch & YouTube)
 * 3. Marquee Control
 */

const API_BASE_URL = "https://pulseplay-backend.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    initNeonParticles();
    updateDashboardFromBackend();
    handleMarquee();
});

// --- 1. NEON PARTICLES GENERATOR ---
function initNeonParticles() {
    const container = document.querySelector('.neon-particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = Math.random() * 15 + 10 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(particle);
    }
}

// --- 2. BACKEND API LOGIC ---

async function updateDashboardFromBackend() {
    // 1. Fetch Featured Twitch Streams from Backend
    try {
        const twitchRes = await fetch(`${API_BASE_URL}/twitch`);
        const twitchStreams = await twitchRes.json();
        updateTwitchCards(twitchStreams);
    } catch (e) { console.error("Twitch Backend Error:", e); }

    // 2. Fetch Featured Clips/Featured Data
    try {
        const featuredRes = await fetch(`${API_BASE_URL}/featured`);
        const featuredData = await featuredRes.json();
        updateFeaturedClips(featuredData);
    } catch (e) { console.error("Featured Clips Error:", e); }
}

function updateTwitchCards(streams) {
    const cards = document.querySelectorAll('.streamer-card[data-platform="twitch"]');
    
    cards.forEach(card => {
        const username = card.dataset.username.toLowerCase();
        // Find if our specific streamer is in the "Top Streams" list from backend
        const streamData = streams.find(s => s.name.toLowerCase() === username);
        const badge = card.querySelector('.status-badge');

        if (streamData) {
            if (badge) {
                badge.textContent = '● LIVE';
                badge.style.background = '#ff0055';
                badge.style.boxShadow = '0 0 10px #ff0055';
            }
            card.querySelector('.viewers').textContent = `${streamData.viewers.toLocaleString()} viewers`;
            card.querySelector('.title').textContent = streamData.title;
            card.querySelector('.game').textContent = streamData.game;
            card.querySelector('.avatar').src = streamData.thumbnail;
            card.style.borderColor = '#ff0055';
        } else {
            if (badge) badge.textContent = 'Offline';
        }
    });
}

function updateFeaturedClips(clips) {
    const grid = document.getElementById('featured-clips');
    if (!grid || !clips.length) return;

    grid.innerHTML = clips.map(clip => `
        <div class="video-card">
            <iframe 
                src="${clip.embedUrl}" 
                frameborder="0" 
                allowfullscreen="true" 
                scrolling="no" 
                height="200" 
                width="350">
            </iframe>
            <p>${clip.title}</p>
        </div>
    `).join('');
}

// --- 3. UI EXTRAS ---
function handleMarquee() {
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        marquee.addEventListener('mouseenter', () => marquee.querySelector('p').style.animationPlayState = 'paused');
        marquee.addEventListener('mouseleave', () => marquee.querySelector('p').style.animationPlayState = 'running');
    }
}