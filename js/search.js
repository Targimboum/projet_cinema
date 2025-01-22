// search.js: Handle movie search functionality with dynamic results.

const apiEndpoint = "https://api.themoviedb.org/3";
const apiKey = "https://www.omdbapi.com/?apikey=${apiKey}&s="; // Remplacez par votre clé d'API

let searchQuery = "";
let currentPage = 1;

// Function to fetch search results
async function fetchSearchResults(query, page = 1) {
  const response = await fetch(
    `${apiEndpoint}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to fetch search results");
  const data = await response.json();
  return data.results;
}

// Function to create movie card
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }" />
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.overview.slice(0, 100)}...</p>
            <button onclick="viewMovieDetails(${
              movie.id
            })">View Details</button>
        </div>
    `;

  return card;
}

// Function to render movies on the page
function renderMovies(movies) {
  const container = document.querySelector("#search-results-container");
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// Function to view movie details
function viewMovieDetails(movieId) {
  window.location.href = `movie.html?id=${movieId}`;
}

// Function to handle search form submission
async function handleSearch(event) {
  event.preventDefault();
  const queryInput = document.querySelector("#search-input");
  searchQuery = queryInput.value;
  currentPage = 1;

  try {
    const resultsContainer = document.querySelector(
      "#search-results-container"
    );
    resultsContainer.innerHTML = ""; // Clear previous results

    const movies = await fetchSearchResults(searchQuery);
    renderMovies(movies);
  } catch (error) {
    console.error(error);
  }
}

// Function to handle load more button
async function loadMoreResults() {
  currentPage++;
  try {
    const movies = await fetchSearchResults(searchQuery, currentPage);
    renderMovies(movies);
  } catch (error) {
    console.error(error);
  }
}

// Initialize search functionality on page load
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", handleSearch);

  const loadMoreButton = document.querySelector("#load-more-button");
  loadMoreButton.addEventListener("click", loadMoreResults);
});
