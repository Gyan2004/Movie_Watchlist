import {
  searchMoviesApi,
  getMovieDetails,
  getTopRatedMoviesApi,
  getPopularMoviesApi,
  getMovieRecommendations,
  searchByGenre
} from './api';

// Fallback movies array for when the API is unavailable
const fallbackMovies = [
  {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    genre: ['Drama'],
    rating: 9.3,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    year: 1994,
    director: 'Frank Darabont'
  },
  {
    id: 'tt0068646',
    title: 'The Godfather',
    genre: ['Crime', 'Drama'],
    rating: 9.2,
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    year: 1972,
    director: 'Francis Ford Coppola'
  },
  {
    id: 'tt0468569',
    title: 'The Dark Knight',
    genre: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    year: 2008,
    director: 'Christopher Nolan'
  },
  {
    id: 'tt0110912',
    title: 'Pulp Fiction',
    genre: ['Crime', 'Drama'],
    rating: 8.9,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    year: 1994,
    director: 'Quentin Tarantino'
  },
  {
    id: 'tt0137523',
    title: 'Fight Club',
    genre: ['Drama'],
    rating: 8.8,
    description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
    year: 1999,
    director: 'David Fincher'
  }
];

// Get top rated movies
export const getTopRatedMovies = async (limit = 5) => {
  try {
    const apiMovies = await getTopRatedMoviesApi(limit);
    return apiMovies.length > 0 
      ? apiMovies 
      : fallbackMovies.slice(0, limit);
  } catch (error) {
    console.error('Error getting top rated movies, using fallback data:', error);
    return fallbackMovies.slice(0, limit);
  }
};

// Get popular movies
export const getPopularMovies = async (limit = 5) => {
  try {
    const apiMovies = await getPopularMoviesApi(limit);
    return apiMovies.length > 0 
      ? apiMovies 
      : fallbackMovies.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular movies, using fallback data:', error);
    return fallbackMovies.slice(0, limit);
  }
};

// Search movies by title or genre
export const searchMovies = async (query) => {
  try {
    // Try to determine if this is a genre search
    const commonGenres = ['action', 'adventure', 'animation', 'comedy', 'crime', 
                          'documentary', 'drama', 'family', 'fantasy', 'horror', 
                          'mystery', 'romance', 'sci-fi', 'thriller', 'war', 'western'];
    
    const queryLower = query.toLowerCase();
    const isGenreSearch = commonGenres.some(genre => genre === queryLower);
    
    // If it's a genre search, use the genre-specific function
    if (isGenreSearch) {
      const genreResults = await searchByGenre(query);
      if (genreResults.length > 0) {
        return genreResults;
      }
    }
    
    // Otherwise, use the regular title search
    const apiResults = await searchMoviesApi(query);
    if (apiResults.length > 0) {
      return apiResults;
    }
    
    // Fallback to local search if API fails
    return fallbackMovies.filter(movie => 
      movie.title.toLowerCase().includes(queryLower) || 
      movie.genre.some(g => g.toLowerCase().includes(queryLower))
    );
  } catch (error) {
    console.error('Error searching movies, using fallback data:', error);
    const queryLower = query.toLowerCase();
    return fallbackMovies.filter(movie => 
      movie.title.toLowerCase().includes(queryLower) || 
      movie.genre.some(g => g.toLowerCase().includes(queryLower))
    );
  }
};

// Get movie by ID
export const getMovieById = async (id) => {
  try {
    const movieDetails = await getMovieDetails(id);
    if (movieDetails) {
      return movieDetails;
    }
    
    // Fallback to local data if API fails
    return fallbackMovies.find(movie => movie.id === id);
  } catch (error) {
    console.error('Error getting movie by ID, using fallback data:', error);
    return fallbackMovies.find(movie => movie.id === id);
  }
};

// Get movies by IDs
export const getMoviesByIds = async (ids) => {
  try {
    if (!ids || ids.length === 0) return [];
    
    const movies = await Promise.all(
      ids.map(async (id) => {
        try {
          return await getMovieById(id);
        } catch (error) {
          console.error(`Error getting movie with ID ${id}:`, error);
          return null;
        }
      })
    );
    
    return movies.filter(Boolean); // Remove any null results
  } catch (error) {
    console.error('Error getting movies by IDs, using fallback data:', error);
    return fallbackMovies.filter(movie => ids.includes(movie.id));
  }
};

// Get recommendations based on watchlist
export const getRecommendations = async (watchlistIds, limit = 5) => {
  try {
    // If watchlist is empty, return popular movies
    if (!watchlistIds || watchlistIds.length === 0) {
      return await getPopularMovies(limit);
    }

    // Use the first movie from watchlist to get recommendations
    const recommendationId = watchlistIds[0];
    const recommendations = await getMovieRecommendations(recommendationId, limit * 2);
    
    // Filter out movies already in watchlist
    const filteredRecommendations = recommendations.filter(
      movie => !watchlistIds.includes(movie.id)
    );
    
    // If we don't have enough recommendations, get popular movies as backup
    if (filteredRecommendations.length < limit) {
      const popularMovies = await getPopularMovies(limit * 2);
      const additionalRecommendations = popularMovies
        .filter(movie => 
          !watchlistIds.includes(movie.id) && 
          !filteredRecommendations.some(rec => rec.id === movie.id)
        )
        .slice(0, limit - filteredRecommendations.length);
      
      return [...filteredRecommendations, ...additionalRecommendations].slice(0, limit);
    }
    
    return filteredRecommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommendations, using fallback data:', error);
    
    // If watchlist is empty, return top fallback movies
    if (!watchlistIds || watchlistIds.length === 0) {
      return fallbackMovies.slice(0, limit);
    }

    // Simple fallback recommendation logic
    const watchlistMovies = fallbackMovies.filter(movie => watchlistIds.includes(movie.id));
    const unwatchedMovies = fallbackMovies.filter(movie => !watchlistIds.includes(movie.id));
    
    // Return unwatched movies
    return unwatchedMovies.slice(0, limit);
  }
};

// Export fallback movies for direct access if needed
export const fallbackMoviesList = fallbackMovies; 