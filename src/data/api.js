import { OMDB_CONFIG } from './config';

// Format movie data from OMDB API response
const formatMovie = (movie) => ({
  id: movie.imdbID,
  title: movie.Title,
  genre: movie.Genre ? movie.Genre.split(', ') : [],
  rating: movie.imdbRating ? parseFloat(movie.imdbRating) : 0,
  description: movie.Plot || '',
  posterUrl: movie.Poster !== 'N/A' ? movie.Poster : null,
  year: movie.Year ? parseInt(movie.Year) : null,
  director: movie.Director || 'Unknown',
  runtime: movie.Runtime || 'Unknown',
  actors: movie.Actors || 'Unknown'
});

// Search movies by title
export const searchMoviesApi = async (query, page = 1) => {
  if (!query) return [];
  
  try {
    const response = await fetch(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`);
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.error('OMDB API Error:', data.Error);
      return [];
    }
    
    // Get movie IDs from search results
    const movieIds = data.Search.map(movie => movie.imdbID);
    
    // Fetch detailed information for each movie
    const detailedMovies = await Promise.all(
      movieIds.map(id => getMovieDetails(id))
    );
    
    // Filter out any null results
    return detailedMovies.filter(Boolean);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Get movie details by ID
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&i=${id}&plot=full`);
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.error('OMDB API Error:', data.Error);
      return null;
    }
    
    return formatMovie(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Get top rated movies (we'll use a predefined list of IMDb IDs for top movies)
export const getTopRatedMoviesApi = async (limit = 5) => {
  // List of IMDb IDs for top rated movies
  const topMovieIds = [
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0071562', // The Godfather: Part II
    'tt0468569', // The Dark Knight
    'tt0050083', // 12 Angry Men
    'tt0108052', // Schindler's List
    'tt0167260', // The Lord of the Rings: The Return of the King
    'tt0110912', // Pulp Fiction
    'tt0060196', // The Good, the Bad and the Ugly
    'tt0109830', // Forrest Gump
    'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
    'tt0137523', // Fight Club
    'tt0167261', // The Lord of the Rings: The Two Towers
    'tt1375666', // Inception
    'tt0080684'  // Star Wars: Episode V - The Empire Strikes Back
  ];
  
  try {
    // Get details for each movie in the list, up to the limit
    const movies = await Promise.all(
      topMovieIds.slice(0, limit).map(id => getMovieDetails(id))
    );
    
    return movies.filter(Boolean);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

// Get popular/trending movies (we'll use a predefined list for now)
export const getPopularMoviesApi = async (limit = 5) => {
  // List of IMDb IDs for popular/trending movies (you might want to update this list periodically)
  const popularMovieIds = [
    'tt9362722', // Spider-Man: Across the Spider-Verse
    'tt1517268', // Barbie
    'tt15398776', // Oppenheimer
    'tt8589698', // Teenage Mutant Ninja Turtles: Mutant Mayhem
    'tt10366206', // John Wick: Chapter 4
    'tt1630029', // Avatar: The Way of Water
    'tt7286456', // Joker
    'tt1462764', // Inside Out 2
    'tt1745960', // Top Gun: Maverick
    'tt1016150', // Mission: Impossible - Dead Reckoning Part One
    'tt13603966', // The Super Mario Bros. Movie
    'tt10151854', // The Meg 2: The Trench
    'tt9603212', // Mission: Impossible - Dead Reckoning Part One
    'tt6710474', // Everything Everywhere All at Once
    'tt10298810'  // Guardians of the Galaxy Vol. 3
  ];
  
  try {
    // Get details for each movie in the list, up to the limit
    const movies = await Promise.all(
      popularMovieIds.slice(0, limit).map(id => getMovieDetails(id))
    );
    
    return movies.filter(Boolean);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Get movie recommendations based on genre similarity
export const getMovieRecommendations = async (movieId, limit = 5) => {
  try {
    // First, get details of the movie to extract genres
    const movie = await getMovieDetails(movieId);
    if (!movie) return [];
    
    const genres = movie.genre;
    
    // If we don't have genres, return popular movies instead
    if (!genres || genres.length === 0) {
      return getPopularMoviesApi(limit);
    }
    
    // We'll use a predefined list of movies and filter by genre
    // In a real app, you might want to use a more sophisticated recommendation algorithm
    // or integrate with another service that provides recommendations
    
    // Combine popular and top rated movies
    const allMovieIds = [
      ...getTopRatedMoviesIds(),
      ...getPopularMoviesIds()
    ];
    
    // Remove duplicates
    const uniqueMovieIds = [...new Set(allMovieIds)];
    
    // Remove the current movie from recommendations
    const filteredIds = uniqueMovieIds.filter(id => id !== movieId);
    
    // Fetch details for all potential recommendation movies
    const potentialRecommendations = await Promise.all(
      filteredIds.map(id => getMovieDetails(id))
    );
    
    // Filter out null results
    const validMovies = potentialRecommendations.filter(Boolean);
    
    // Sort by genre similarity (number of matching genres)
    const recommendedMovies = validMovies
      .map(m => {
        const matchingGenres = m.genre.filter(g => genres.includes(g)).length;
        return { ...m, matchScore: matchingGenres };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
    
    return recommendedMovies;
  } catch (error) {
    console.error('Error getting movie recommendations:', error);
    return [];
  }
};

// Helper function to get IDs of top rated movies
function getTopRatedMoviesIds() {
  return [
    'tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083',
    'tt0108052', 'tt0167260', 'tt0110912', 'tt0060196', 'tt0109830',
    'tt0120737', 'tt0137523', 'tt0167261', 'tt1375666', 'tt0080684'
  ];
}

// Helper function to get IDs of popular movies
function getPopularMoviesIds() {
  return [
    'tt9362722', 'tt1517268', 'tt15398776', 'tt8589698', 'tt10366206',
    'tt1630029', 'tt7286456', 'tt1462764', 'tt1745960', 'tt1016150',
    'tt13603966', 'tt10151854', 'tt9603212', 'tt6710474', 'tt10298810'
  ];
}

// Search by genre (not directly supported by OMDB, so we'll combine search with filtering)
export const searchByGenre = async (genre, limit = 10) => {
  try {
    // Get a mix of top-rated and popular movies
    const moviesPool = await Promise.all([
      getTopRatedMoviesApi(15),
      getPopularMoviesApi(15)
    ]);
    
    // Flatten and filter by genre
    const allMovies = moviesPool.flat().filter(Boolean);
    const filteredMovies = allMovies.filter(movie => 
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
    
    // Remove duplicates by ID
    const uniqueMovies = [];
    const seenIds = new Set();
    
    for (const movie of filteredMovies) {
      if (!seenIds.has(movie.id)) {
        seenIds.add(movie.id);
        uniqueMovies.push(movie);
      }
    }
    
    return uniqueMovies.slice(0, limit);
  } catch (error) {
    console.error('Error searching by genre:', error);
    return [];
  }
}; 