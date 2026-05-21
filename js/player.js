// player.js

// Gogoanime base URL frequently changes. Update as needed.
const GOGO_BASE = "https://anitaku.pe"; 
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Use a proxy to bypass CORS restrictions
const ANILIST_API_URL = 'https://graphql.anilist.co';

// 1. Parse URL Parameters (?title=Naruto&episodes=220)
const urlParams = new URLSearchParams(window.location.search);
const animeTitle = urlParams.get('title');
const totalEpisodes = parseInt(urlParams.get('episodes')) || 1;

document.addEventListener("DOMContentLoaded", async () => {
    if (animeTitle) {
        console.log(`Loading player for: ${animeTitle}`);
        
        // Update the basic title on screen instantly
        document.getElementById('animeTitle').innerText = animeTitle;
        
        // Fetch detailed data (synopsis, genre, cover image) from AniList
        const metaData = await fetchAniListDetails(animeTitle);
        let posterUrl = "https://via.placeholder.com/160x90/1a1a24/ff3366?text=Anime";
        
        if (metaData) {
            document.getElementById('animeDescription').innerHTML = metaData.description || "No description available.";
            document.getElementById('animeGenre').innerText = metaData.genres[0] || "Anime";
            if (metaData.coverImage && metaData.coverImage.large) {
                posterUrl = metaData.coverImage.large; // Use their poster image for episode thumbnails!
            }
        }

        // Search Gogoanime for the stream mapping
        const showSlug = await fetchGogoanimeSlug(animeTitle);
        
        if (showSlug) {
            generateEpisodeList(showSlug, totalEpisodes, posterUrl);
            // Default to loading episode 1
            loadEpisodeStream(showSlug, 1);
        } else {
            document.getElementById('episodeListContainer').innerHTML = `
                <div style="padding: 20px; color: #ff3366; text-align: center;">
                    Could not sync streams automatically for this title.
                </div>`;
        }
    }
});

// 2. Fetch specific layout details from AniList API
async function fetchAniListDetails(title) {
    const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        description
        genres
        coverImage {
          large
        }
      }
    }`;
    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { search: title } })
        });
        const json = await response.json();
        return json.data.Media;
    } catch (e) {
        console.error("Failed fetching AniList details:", e);
        return null;
    }
}

// 3. Search Gogoanime via CORS Proxy to get the unique show slug
async function fetchGogoanimeSlug(title) {
    const searchUrl = `${CORS_PROXY}${GOGO_BASE}/filter.html?keyword=${encodeURIComponent(title)}`;
    
    try {
        const response = await fetch(searchUrl);
        const htmlText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const firstResult = doc.querySelector('ul.items li p.name a');
        if (firstResult) {
            const href = firstResult.getAttribute('href'); 
            return href.replace('/category/', ''); 
        }
    } catch (err) {
        console.error("Scraping failed:", err);
    }
    return null;
}

// 4. Render the video player inside your layout iframe
function loadEpisodeStream(slug, episodeNumber) {
    const videoPlayerFrame = document.getElementById("animePlayer"); 
    
    // Updates embed url targets
    const streamEmbedUrl = `${GOGO_BASE}/${slug}-episode-${episodeNumber}`;
    videoPlayerFrame.src = streamEmbedUrl;
    
    // Updates UI Badges
    document.getElementById('episodeBadge').innerText = `EP ${episodeNumber} Playing`;
}

// 5. Generate beautiful card anchor-links mapping your custom layout design
function generateEpisodeList(slug, episodesCount, posterUrl) {
    const container = document.getElementById("episodeListContainer"); 
    container.innerHTML = ""; 

    for (let i = 1; i <= episodesCount; i++) {
        const epLink = document.createElement("a");
        epLink.href = "#";
        // Sets up clean default item selection styles matching style.css definitions
        epLink.className = `episode-item ${i === 1 ? 'active' : ''}`;
        
        epLink.innerHTML = `
            <img class="ep-thumb" src="${posterUrl}" alt="Episode ${i}" style="object-fit: cover;">
            <div class="ep-meta">
              <span class="ep-number">Episode ${i}</span>
              <span class="ep-name">Watch Stream</span>
            </div>
        `;
        
        epLink.onclick = (e) => {
            e.preventDefault();
            
            // Clean active visual highlights from sidebar entries
            document.querySelectorAll('.episode-item').forEach(el => el.classList.remove('active'));
            epLink.classList.add('active');
            
            loadEpisodeStream(slug, i);
        };
        
        container.appendChild(epLink);
    }
}
