// Sélectionner les éléments DOM
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");
const loadMoreButton = document.getElementById("load-more");

// Variables pour gérer la recherche et la pagination
let searchQuery = "";
let currentPage = 1;
const resultsPerPage = 10;
const apiKey = "d9d9e11f";

// Fonction pour effectuer la recherche
const fetchSearchResults = async () => {
  searchQuery = searchInput.value;

  if (searchQuery.trim() === "") {
    resultsContainer.innerHTML = ""; // Clear les résultats si le champ est vide
    return;
  }

  console.log("Recherche pour:", searchQuery); // Ajout de logs pour déboguer

  try {
    // URL correcte de l'API OMDb pour rechercher des films
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&page=${currentPage}`
    );

    // Vérifie si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données reçues:", data); // Ajout d'un log pour afficher les données de l'API

    // Vérifie si des films ont été trouvés
    if (data.Response === "True") {
      // Affichage des résultats
      data.Search.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("carte");

        movieCard.innerHTML = `
          <img src="${
            movie.Poster !== "N/A" ? movie.Poster : "default-image.jpg"
          }" alt="${movie.Title}">
          <div class="contenu">
            <h3>${movie.Title}</h3>
            <p>${
              movie.Year
            }</p>  <!-- Remplacement du plot par l'année de sortie -->
            <a href="movie.html?i=${
              movie.imdbID
            }" class="btn">En savoir plus</a>
          </div>
        `;

        resultsContainer.appendChild(movieCard);
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats:", error);
    // Aucun message d'erreur visible
  }
};

// Fonction pour charger plus de résultats
const loadMoreResults = () => {
  currentPage++;
  fetchSearchResults();
};

// Événement sur le champ de recherche (recherche en temps réel)
searchInput.addEventListener("input", () => {
  currentPage = 1; // Reset de la pagination
  resultsContainer.innerHTML = ""; // Clear les résultats précédents
  fetchSearchResults();
});

// Événement sur le bouton "Charger plus"
loadMoreButton.addEventListener("click", loadMoreResults);

// Lancement initial de la recherche (si un texte est déjà dans le champ)
fetchSearchResults();
