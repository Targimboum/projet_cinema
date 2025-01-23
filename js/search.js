// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Votre clé API valide

// Variables pour la recherche et la pagination
let currentPage = 1;
let currentQuery = "";

// Sélection des éléments HTML
const searchInput = document.querySelector(".search-input");
const searchResultsContainer = document.querySelector("#search-results");
const loadMoreButton = document.querySelector("#load-more");

// Vérifie si les éléments HTML sont bien trouvés
if (!searchInput || !searchResultsContainer || !loadMoreButton) {
  console.error("Un ou plusieurs éléments HTML requis sont introuvables !");
}

// Fonction pour récupérer les films via l'API OMDb
async function fetchMovies(query, page = 1) {
  try {
    // Construire l'URL de la requête
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&s=${encodeURIComponent(
        query
      )}&page=${page}`
    );

    const data = await response.json();

    if (data.Response === "True") {
      console.log("Films trouvés :", data.Search); // Debugging : Afficher les résultats dans la console
      return data.Search; // Retourne la liste des films
    } else {
      console.warn("Aucun film trouvé :", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    return [];
  }
}

// Fonction pour afficher les films dans le conteneur HTML
function displayMovies(movies, append = false) {
  if (!append) {
    searchResultsContainer.innerHTML = ""; // Efface les anciens résultats
  }

  if (movies.length === 0) {
    searchResultsContainer.innerHTML = "<p>Aucun film trouvé.</p>";
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("carte");

    // Contenu de la carte avec les informations du film
    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
      }" alt="${movie.Title}" />
      <div class="contenu">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <a href="movie.html?id=${movie.imdbID}" class="btn">En savoir plus</a>
      </div>
    `;

    searchResultsContainer.appendChild(card);
  });
}

// Fonction pour gérer la recherche en temps réel
async function handleSearch(event) {
  currentQuery = searchInput.value.trim(); // Récupérer la valeur saisie
  currentPage = 1; // Réinitialiser la pagination

  if (currentQuery === "") {
    searchResultsContainer.innerHTML = "<p>Veuillez entrer un mot-clé.</p>";
    return;
  }

  console.log("Recherche en cours pour :", currentQuery); // Debugging

  const movies = await fetchMovies(currentQuery, currentPage); // Récupère les résultats de recherche
  displayMovies(movies); // Affiche les films
}

// Fonction pour charger plus de résultats
async function loadMoreResults() {
  if (currentQuery === "") return; // Ne rien faire si aucune recherche en cours

  currentPage++; // Incrémenter la page
  console.log("Chargement de la page :", currentPage); // Debugging

  const movies = await fetchMovies(currentQuery, currentPage); // Récupérer les résultats de la page suivante
  displayMovies(movies, true); // Ajouter les nouveaux résultats à la suite
}

// Initialisation des écouteurs d'événements
document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si les éléments sont trouvés avant d'ajouter des écouteurs
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  } else {
    console.error("Barre de recherche introuvable !");
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", loadMoreResults);
  } else {
    console.error("Bouton 'Charger plus' introuvable !");
  }
});
