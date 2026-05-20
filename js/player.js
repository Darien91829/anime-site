// js/player.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Grab the URL Query Parameter (e.g., ?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (animeId) {
        loadWatchPageDetails(animeId);
    } else {
        // Fallback redirection to homepage if no ID is passed
        window.location.href = 'index.html';
    }
});

/**
 * Fetches data and updates the video screen and textual metadata blocks.
 */
async function loadWatchPageDetails(id) {
    try {
        const response = await fetch('data/anime.json');
        const animeList = await response.json();

        // Find the specific anime object matching the URL ID
        const selectedAnime = animeList.find(anime => anime.id === id);

        if (!selectedAnime) {
            document.getElementById('animeTitle').textContent = "Anime Not Found";
            return;
        }

        // 2. Map JSON data fields to the DOM elements
        document.getElementById('animeTitle').textContent = selectedAnime.title;
        document.getElementById('animeDescription').textContent = selectedAnime.description;
        document.getElementById('animeGenre').textContent = selectedAnime.genre.join(' / ');
        
        // Update document tab title dynamically
        document.title = `Watching ${selectedAnime.title} - StreamNihongo`;

        // 3. Generate Mock Episode Data based on the episode count in JSON
        generateEpisodeSidebar(selectedAnime);

    } catch (error) {
        console.error('Error rendering watch view details:', error);
    }
}

/**
 * Dynamically builds the clickable episode list inside the right-hand panel.
 */
function generateEpisodeSidebar(anime) {
    const listContainer = document.getElementById('episodeListContainer');
    listContainer.innerHTML = ''; // Clear out the placeholder HTML structure

    // Limit generation to maximum 12 episodes for UI cleanliness if count is huge
    const totalEpisodesToShow = Math.min(anime.episodes, 12);

    for (let i = 1; i <= totalEpisodesToShow; i++) {
        const epItem = document.createElement('a');
        epItem.href = '#';
        
        // Set first episode to active state visually out of the box
        epItem.className = `episode-item ${i === 1 ? 'active' : ''}`;

        epItem.innerHTML = `
            <img class="ep-thumb" src="${anime.image}" alt="Episode Thumbnail">
            <div class="ep-meta">
                <span class="ep-number">Episode ${i}</span>
                <span class="ep-name">Chapter Source File ${i}</span>
            </div>
        `;

        // 4. Interactive Click Event to mimic episode switching
        epItem.addEventListener('click', (e) => {
            e.preventDefault();

            // Strip out active class from the old item
            document.querySelector('.episode-item.active')?.classList.remove('active');
            
            // Apply active class to the current target item
            epItem.classList.add('active');

            // Update badge above description box
            document.getElementById('episodeBadge').textContent = `EP ${i} Playing`;

            // Reset video source file to simulate reload (using placeholder stream)
            const player = document.getElementById('animePlayer');
            player.currentTime = 0;
            player.play();
        });

        listContainer.appendChild(epItem);
    }
}
