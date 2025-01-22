// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key

let currentPage = 1;

// Function to fetch trending movies
async function fetchTrendingMovies(page = 1) {
  const response = await fetch(
    `${apiEndpoint}/trending/movie/week?api_key=${apiKey}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to fetch trending movies");
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
  const container = document.querySelector("#movie-container");
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// Function to view movie details
function viewMovieDetails(movieId) {
  window.location.href = `movie.html?id=${movieId}`;
}

// Function to handle load more button
async function loadMoreMovies() {
  currentPage++;
  try {
    const movies = await fetchTrendingMovies(currentPage);
    renderMovies(movies);
  } catch (error) {
    console.error(error);
  }
}

// Initialize trending movies on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const movies = await fetchTrendingMovies();
    renderMovies(movies);
  } catch (error) {
    console.error(error);
  }

  // Add event listener to load more button
  const loadMoreButton = document.querySelector("#load-more-button");
  loadMoreButton.addEventListener("click", loadMoreMovies);
});
