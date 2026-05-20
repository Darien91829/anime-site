// js/app.js
// Handles loading anime data and rendering cards on the homepage

/**
 * Creates a single anime card element.
 * Keeps markup small and focused.
 */
function createAnimeCard(anime) {
  const card = document.createElement("div");
  card.className = "anime-card";
  card.dataset.id = anime.id; // used later for watch page

  card.innerHTML = `
    <img
      src="${anime.thumbnail}"
      alt="${anime.title}"
      class="anime-thumb"
    />
    <div class="anime-info">
      <h3 class="anime-title">${anime.title}</h3>
      <p class="anime-meta">${anime.year} • ${anime.episodes} eps</p>
    </div>
  `;

  // Navigate to watch page with query parameter
  card.addEventListener("click", () => {
    window.location.href = `watch.html?id=${anime.id}`;
  });

  return card;
}

/**
 * Loads anime list from local JSON file and renders it into the grid.
 */
async function loadAnimeList() {
  const grid = document.getElementById("anime-grid");
  if (!grid) return;

  try {
    const response = await fetch("data/anime.json");
    if (!response.ok) {
      throw new Error("Failed to fetch anime.json");
    }

    const animeList = await response.json();

    // Clear grid before rendering
    grid.innerHTML = "";

    animeList.forEach((anime) => {
      const card = createAnimeCard(anime);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>Could not load anime list. Please try again later.</p>";
  }
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", loadAnimeList);