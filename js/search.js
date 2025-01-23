const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Ta clé API valide OMDb
let currentPage = 1;
let currentQuery = "";

// Sélection des éléments HTML
const searchInput = document.querySelector("#search-input");
const searchResultsContainer = document.querySelector("#search-results");
const loadMoreButton = document.querySelector("#load-more");

// Fonction pour récupérer les films via l'API
async function fetchMovies(query, page = 1) {
  const response = await fetch(
    `${apiEndpoint}/?apikey=${apiKey}&s=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  const data = await response.json();

  if (data.Response === "True") {
    return data.Search;
  } else {
    console.warn("Aucun film trouvé", data.Error);
    return [];
  }
}

// Fonction pour afficher les films
function displayMovies(movies, append = false) {
  if (!append) {
    searchResultsContainer.innerHTML = "";
  }

  if (movies.length === 0) {
    searchResultsContainer.innerHTML = "<p>Aucun film trouvé.</p>";
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("carte");

    // Création de la carte pour chaque film
    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
      }" alt="${movie.Title}" />
      <div class="contenu">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <a href="movie.html?id=${movie.imdbID}" class="btn">Plus d'infos</a>
      </div>
    `;
    searchResultsContainer.appendChild(card);
  });
}

// Fonction pour gérer la recherche en temps réel (avec délai)
let searchTimeout;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout); // Annule la recherche précédente
  currentQuery = searchInput.value.trim();

  if (currentQuery === "") {
    searchResultsContainer.innerHTML =
      "<p>Veuillez entrer un terme de recherche.</p>";
    return;
  }

  // Déclenche la recherche après un délai (500ms)
  searchTimeout = setTimeout(async () => {
    currentPage = 1; // Réinitialiser la pagination
    const movies = await fetchMovies(currentQuery, currentPage);
    displayMovies(movies);
  }, 500); // Délai de 500ms
});

// Fonction pour charger plus de résultats
loadMoreButton.addEventListener("click", async () => {
  if (currentQuery === "") return;

  currentPage++; // Page suivante
  const movies = await fetchMovies(currentQuery, currentPage);
  displayMovies(movies, true); // Ajout des nouveaux résultats
});
