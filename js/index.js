// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key

// Keep track of the current page for pagination
let currentPage = 1;

// Function to fetch movies from the OMDb API (only for 2024)
async function fetchTrendingMovies(page = 1) {
  try {
    // Construct the URL to fetch movies with the year 2024
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&s=movie&y=2024&page=${page}`
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

// Function to fetch additional movie details by ID to get the plot
async function fetchMovieDetailsById(movieId) {
  try {
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&i=${movieId}&plot=short`
    );
    const data = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Function to truncate the plot to a specified length
function truncatePlot(plot, maxLength = 150) {
  if (plot && plot.length > maxLength) {
    return plot.substring(0, maxLength) + "..."; // Truncate and add ellipsis
  }
  return plot; // Return the plot as is if it's already short enough
}

// Function to create an HTML movie card
async function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("carte");

  // Fetch additional details (like plot) for the movie
  const movieDetails = await fetchMovieDetailsById(movie.imdbID);

  // Truncate the plot for brevity
  const truncatedPlot = movieDetails
    ? truncatePlot(movieDetails.Plot)
    : "Plot not available.";

  // Add the movie details to the card
  card.innerHTML = `
    <img src="${
      movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
    }" alt="${movie.Title}" />
    <div class="contenu">
      <h3>${movie.Title}</h3>
      <p>${truncatedPlot}</p>
      <a href="movie.html?id=${movie.imdbID}" class="btn">En savoir plus</a>
    </div>
  `;

  return card; // Return the created card
}

// Function to render movies inside the HTML container (Append mode)
async function renderMovies(movies) {
  const container = document.querySelector("#trending-movies");

  // Append each movie card to the container without clearing it
  for (const movie of movies) {
    const card = await createMovieCard(movie);
    container.appendChild(card);
  }
}

// Function to load more movies when the button is clicked
async function loadMoreMovies() {
  currentPage++; // Move to the next page
  const movies = await fetchTrendingMovies(currentPage); // Fetch new movies
  renderMovies(movies); // Append the new movies
}

// Load trending movies when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  const movies = await fetchTrendingMovies(); // Fetch the first page of movies for 2024
  renderMovies(movies); // Render the fetched movies

  // Add an event listener to the "Load More" button
  const loadMoreButton = document.querySelector("#load-more");
  loadMoreButton.addEventListener("click", loadMoreMovies);
});
