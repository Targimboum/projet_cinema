// movie.js: Display detailed information about a selected movie.

// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key
// Function to fetch movie details
async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `${apiEndpoint}/movie/${movieId}?api_key=${apiKey}`
  );
  if (!response.ok) throw new Error("Failed to fetch movie details");
  const data = await response.json();
  return data;
}

// Function to render movie details on the page
function renderMovieDetails(movie) {
  const container = document.querySelector("#movie-details-container");

  container.innerHTML = `
      <div class="movie-detail-card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }" />
          <div class="movie-detail-info">
              <h2>${movie.title}</h2>
              <p><strong>Release Date:</strong> ${movie.release_date}</p>
              <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
              <p><strong>Overview:</strong> ${movie.overview}</p>
              <p><strong>Genres:</strong> ${movie.genres
                .map((genre) => genre.name)
                .join(", ")}</p>
          </div>
      </div>
  `;
}

// Initialize movie details on page load
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (!movieId) {
    console.error("No movie ID provided in the URL");
    return;
  }

  try {
    const movie = await fetchMovieDetails(movieId);
    renderMovieDetails(movie);
  } catch (error) {
    console.error(error);
  }
});
