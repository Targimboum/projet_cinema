// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key

// Keep track of the current page for pagination
let currentPage = 1;

// Function to fetch trending movies from the OMDb API
async function fetchTrendingMovies(page = 1) {
  try {
    // Construct the URL to fetch trending movies with a keyword (e.g., "avengers")
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&s=avengers&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      return data.Search; // Return the list of movies
    } else {
      console.error("Error fetching movies:", data.Error);
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
  const container = document.querySelector("#trending-movies");

  // Append each movie card to the container
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// Function to load more movies when the button is clicked
async function loadMoreMovies() {
  currentPage++; // Move to the next page
  const movies = await fetchTrendingMovies(currentPage); // Fetch new movies
  renderMovies(movies); // Render the new movies
}

// Load trending movies when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  const movies = await fetchTrendingMovies(); // Fetch the first page of movies
  renderMovies(movies); // Render the fetched movies

  // Add an event listener to the "Load More" button
  const loadMoreButton = document.querySelector("#load-more");
  loadMoreButton.addEventListener("click", loadMoreMovies);
});
