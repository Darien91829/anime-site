// player.js

// Gogoanime base URL frequently changes. Update as needed.
const GOGO_BASE = "https://anitaku.pe"; 
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Use a proxy to bypass CORS restrictions

// 1. Parse URL Parameters (?title=Naruto&episodes=220)
const urlParams = new URLSearchParams(window.location.search);
const animeTitle = urlParams.get('title');
const totalEpisodes = parseInt(urlParams.get('episodes')) || 1;

document.addEventListener("DOMContentLoaded", async () => {
    if (animeTitle) {
        console.log(`Loading player for: ${animeTitle}`);
        const showSlug = await fetchGogoanimeSlug(animeTitle);
        
        if (showSlug) {
            generateEpisodeList(showSlug, totalEpisodes);
            // Default to loading episode 1
            loadEpisodeStream(showSlug, 1);
        } else {
            alert("Could not automatically locate streams on Gogoanime for this title.");
        }
    }
});

// 2. Search Gogoanime via CORS Proxy to get the unique show slug
async function fetchGogoanimeSlug(title) {
    const searchUrl = `${CORS_PROXY}${GOGO_BASE}/filter.html?keyword=${encodeURIComponent(title)}`;
    
    try {
        const response = await fetch(searchUrl);
        const htmlText = await response.text();
        
        // Use DOMParser to parse the HTML string just like BeautifulSoup
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const firstResult = doc.querySelector('ul.items li p.name a');
        if (firstResult) {
            const href = firstResult.getAttribute('href'); // e.g., "/category/naruto"
            return href.replace('/category/', ''); // returns "naruto"
        }
    } catch (err) {
        console.error("Scraping failed:", err);
    }
    return null;
}

// 3. Render the video player using Gogoanime's direct iframe embed structure
function loadEpisodeStream(slug, episodeNumber) {
    const videoPlayerFrame = document.getElementById("video-player"); // Your <iframe> element id
    
    // Gogoanime embeds follow this specific layout
    const streamEmbedUrl = `${GOGO_BASE}/${slug}-episode-${episodeNumber}`;
    
    // Note: To embed directly without the website layout, standard gogo scrapers 
    // fetch the episode page and scrape the iframe source (`src`) tagged inside `.play-video`.
    // For now, this will direct to the stream asset endpoint:
    videoPlayerFrame.src = streamEmbedUrl;
}

// 4. Generate buttons for your UI based on AniList episode data
function generateEpisodeList(slug, episodesCount) {
    const container = document.getElementById("episode-container"); // Your episode layout container
    container.innerHTML = ""; 

    for (let i = 1; i <= episodesCount; i++) {
        const btn = document.createElement("button");
        btn.innerText = `Ep ${i}`;
        btn.onclick = () => loadEpisodeStream(slug, i);
        container.appendChild(btn);
    }
}
