// Configuration file for API keys and other settings

// OMDB API configuration
export const OMDB_CONFIG = {
  /**
   * API key obtained from OMDb API
   * This key has been provided and is already set up for the project
   * If you need to use your own key, you can replace this one or set the
   * REACT_APP_OMDB_API_KEY environment variable
   */
  API_KEY: process.env.REACT_APP_OMDB_API_KEY || 'd00f719e',
  BASE_URL: 'https://www.omdbapi.com'
};

// Application settings
export const APP_CONFIG = {
  APP_NAME: 'Movie Watchlist',
  DEFAULT_ITEMS_PER_PAGE: 12
}; 