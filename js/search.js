// js/search.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    // Only run if the search input exists on the current page
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

/**
 * Filters the anime array based on user input and re-renders the cards.
 */
async function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const container = document.getElementById('anime-container');

    try {
        // Fetch the local dataset
        const response = await fetch('data/anime.json');
        const animeList = await response.json();

        // If search bar is empty, show everything
        if (query === '') {
            renderAnimeCards(animeList);
            return;
        }

        // Filter by English title or alternate title
        const filteredAnime = animeList.filter(anime => {
            const matchesTitle = anime.title.toLowerCase().includes(query);
            const matchesAltTitle = anime.alt_title && anime.alt_title.toLowerCase().includes(query);
            return matchesTitle || matchesAltTitle;
        });

        // Update the layout with filtered results
        if (filteredAnime.length > 0) {
            renderAnimeCards(filteredAnime);
        } else {
            // UI Feedback for no results found
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No anime found matching "${event.target.value}"</p>
                    <p style="font-size: 0.9rem;">Try checking your spelling or search another title.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error handling live search:', error);
    }
}
