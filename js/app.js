// js/app.js
// Handles loading live anime data from Jikan API and rendering cards on the homepage

/**
 * Creates a single anime card element using mobile live API keys.
 * Matches your green/black theme class architecture.
 */
function createAnimeCard(anime) {
  const card = document.createElement("div");
  card.className = "anime-card";
  
  // Pass the unique MyAnimeList ID into a data attribute for routing
  card.dataset.id = anime.mal_id; 

  // Safely extract genres into a clean subtext string
  const genres = anime.genres ? anime.genres.map((g) => g.name).join(", ") : "Anime";

  card.innerHTML = `
    <div class="anime-poster" style="background-image: url('${anime.images.jpg.image_url}')"></div>
    <div class="anime-info">
      <div class="anime-title">${anime.title}</div>
      <div class="anime-rating">
        <i class="fas fa-star"></i> ${anime.score || "N/A"}
      </div>
      <div class="anime-genres">${genres}</div>
    </div>
  `;

  // Navigate to mobile watch page with URL query parameter matching player.js
  card.addEventListener("click", () => {
    window.location.href = `watch.html?id=${anime.mal_id}`;
  });

  return card;
}

/**
 * Loads trending anime list directly from the live open Jikan API.
 * Injects cards into your updated 3-column index container.
 */
async function loadAnimeList() {
  // Target container matching your updated index.html id selector
  const grid = document.getElementById("animeGrid");
  if (!grid) return;

  try {
    // Reaching out to live server endpoints over secure browser handshake
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    if (!response.ok) {
      throw new Error("Failed to fetch top anime from Jikan API");
    }

    const jsonResult = await response.json();
    
    // Jikan wraps its main response array inside the .data object property
    const animeList = jsonResult.data;

    // Clear loading states or previous items inside container grid
    grid.innerHTML = "";

    // Loop through response payload and generate visual layout cards
    animeList.forEach((anime) => {
      const card = createAnimeCard(anime);
      grid.appendChild(card);
    });
    
  } catch (error) {
    console.error("Error drawing workspace layout view grid:", error);
    grid.innerHTML = `
      <p style="grid-column: 1/-1; color: var(--accent-green); text-align: center; padding: 2rem 0;">
        Could not load live anime list. Please check your network connection.
      </p>
    `;
  }
}

// Global script init hook
document.addEventListener("DOMContentLoaded", loadAnimeList);
