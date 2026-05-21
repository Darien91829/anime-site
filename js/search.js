// search.js

const ANILIST_API_URL = 'https://graphql.anilist.co';

async function searchAnime(queryText) {
    const query = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          episodes
          description
        }
      }
    }`;

    const variables = { search: queryText };

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        
        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error("Error fetching from AniList:", error);
        return [];
    }
}

// Example usage: 
// When a user clicks a search result, pass the title and total episodes to player.js
function handleAnimeSelect(anime) {
    const gogoQueryTitle = anime.title.romaji; // Best for Gogoanime mapping
    window.location.href = `watch.html?title=${encodeURIComponent(gogoQueryTitle)}&episodes=${anime.episodes}`;
}
