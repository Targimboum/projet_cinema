// API configuration
const apiEndpoint = "https://www.omdbapi.com";
const apiKey = "d9d9e11f"; // Your valid OMDb API key

// Function to fetch movie details by ID
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${apiEndpoint}/?apikey=${apiKey}&i=${movieId}&plot=full`
    );
    const movie = await response.json();

    if (movie.Response === "True") {
      return movie; // Return movie details
    } else {
      console.error("Error fetching movie details:", movie.Error);
      return null;
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

// Function to render movie details in the HTML
function renderMovieDetails(movie) {
  // Update the movie title
  document.querySelector(".Titre h1").textContent = movie.Title;

  // Update the movie poster
  const imgElement = document.querySelector(".illustration img");
  imgElement.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";
  imgElement.alt = movie.Title;

  // Add movie details
  const content = document.querySelector(".film-content");
  content.innerHTML = `
    <h4>Genre</h4>
    <p>${movie.Genre}</p>

    <h4>Ratings</h4>
    <p>${movie.imdbRating} / 10</p>

    <h4>Release Date</h4>
    <p>${movie.Released}</p>

    <div class="ligne-de-separation"></div>

    <h3>Plot</h3>
    <p>${movie.Plot}</p>

    <div class="ligne-de-separation"></div>

    <h4>Actors</h4>
    <p>${movie.Actors}</p>
  `;
}

// Load movie details when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (!movieId) {
    console.error("No movie ID provided in the URL.");
    return;
  }

  const movie = await fetchMovieDetails(movieId); // Fetch movie details
  if (movie) {
    renderMovieDetails(movie); // Render the details
  }
});
