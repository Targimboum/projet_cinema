// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key

// Search state
let searchQuery = "";
let currentPage = 1;

// Function to fetch search results by query
async function fetchSearchResults(query, page = 1) {
  try {
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&s=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      return data.Search; // Return the search results
    } else {
      console.error("Error fetching search results:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
}

// Function to create an HTML movie card
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("carte");

  // Add the movie details to the card
  card.innerHTML = `
    <img src="${
      movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
    }" alt="${movie.Title}" />
    <div class="contenu">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <a href="movie.html?id=${movie.imdbID}" class="btn">More Info</a>
    </div>
  `;

  return card; // Return the created card
}

// Function to render movies inside the HTML container
function renderMovies(movies) {
  const container = document.querySelector("#search-results");

  // Append each movie card to the container
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// Function to handle the search form submission
async function handleSearch(event) {
  event.preventDefault(); // Prevent page reload
  const queryInput = document.querySelector("#search-input");
  searchQuery = queryInput.value.trim();
  currentPage = 1;

  const container = document.querySelector("#search-results");
  container.innerHTML = ""; // Clear previous results

  const movies = await fetchSearchResults(searchQuery); // Fetch search results
  renderMovies(movies); // Render the results
}

// Function to load more search results
async function loadMoreResults() {
  currentPage++; // Move to the next page
  const movies = await fetchSearchResults(searchQuery, currentPage); // Fetch next page of results
  renderMovies(movies); // Render the new results
}

// Initialize event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", handleSearch); // Handle form submission

  const loadMoreButton = document.querySelector("#load-more");
  loadMoreButton.addEventListener("click", loadMoreResults); // Handle "Load More" button click
});
