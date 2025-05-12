# Movie Watchlist Application

A full-featured React application that allows users to discover, search, and organize their favorite movies in a personal watchlist with recommendations.

![Movie Watchlist App](https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg)

## Features

### User Authentication
- **User Registration:** Create a new account with username and password
- **User Login:** Secure authentication system
- **Protected Routes:** Certain pages are only accessible to logged-in users
- **Local Storage:** User data persists between sessions

### Movie Discovery
- **Home Page Showcase:** Featured top-rated and popular movies
- **Search Functionality:** Find movies by title or genre
- **OMDB API Integration:** Real-time movie data from The Open Movie Database
- **Movie Details:** View comprehensive information about each movie including:
  - Title, year, and director
  - Rating and genres
  - Plot description
  - Movie poster

### Watchlist Management
- **Add to Watchlist:** Save movies you want to watch
- **Remove from Watchlist:** Delete movies from your collection
- **View Watchlist:** See all your saved movies in one place
- **Watchlist Persistence:** Your list is saved even after you close the browser

### Smart Recommendations
- **Personalized Recommendations:** Get movie suggestions based on your watchlist
- **Search-Based Recommendations:** Discover similar movies based on your searches
- **Contextual Suggestions:** Different recommendation sources based on your activity:
  - For users with watchlist: Recommendations based on genre preferences
  - For new users: Top-rated movie suggestions
  - For search results: Similar movies to what you're searching for
- **Refresh Function:** Get new recommendations with a click

### User Interface
- **Responsive Design:** Works on desktops, tablets, and mobile devices
- **Modern Styling:** Clean and intuitive interface with styled-components
- **Loading States:** Visual indicators during data fetching
- **Error Handling:** Graceful error messages when something goes wrong
- **Empty States:** Helpful guidance when no data is available
- **API Status Indicator:** Shows connection status with the OMDB API

## Pages

### Home Page
- Hero section with app introduction
- Recommended movies section with personalized suggestions
- Top-rated movies showcase
- Popular movies section
- Call-to-action buttons for registration

### Search Page
- Search bar for finding movies by title or genre
- Search results display with movie cards
- Similar movie recommendations based on search results
- Empty state guidance when no results are found

### Dashboard
- Personal watchlist display with all saved movies
- Personalized movie recommendations
- Empty state guidance for new users
- Quick access to search functionality

### Login/Register Pages
- User-friendly authentication forms
- Input validation
- Error messaging for failed attempts

## Technical Implementation

### API Integration
- **OMDB API:** Integration with a comprehensive movie database
- **Fallback System:** Local data backup if API is unavailable
- **API Key Management:** Secure configuration with environment variables

### State Management
- **React Context:** Global state management for authentication and user data
- **Local Storage:** Persistent data between sessions
- **React Hooks:** Modern state management within components

### Component Architecture
- **Reusable Components:** Modular design for maintainability
- **Styled Components:** Scoped styling for each component
- **Conditional Rendering:** Different UI states based on data availability

### Performance Considerations
- **Async Data Loading:** Non-blocking API requests
- **Loading States:** Visual feedback during data fetching
- **Error Boundaries:** Graceful handling of failures
- **Optimized Recommendations:** Smart caching and selective re-fetching

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`

## API Key

This application comes with a pre-configured OMDB API key (`d00f719e`), so you can use it right away without needing to set up your own API key.

If you want to use your own API key, please refer to the [API_KEY_SETUP.md](API_KEY_SETUP.md) file for instructions.

## Demo Account

For quick testing, you can use the demo account:
- Username: `demo`
- Password: `password`

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── MovieCard.js   # Individual movie display
│   ├── MovieGrid.js   # Grid layout for multiple movies
│   ├── Navbar.js      # Navigation header
│   ├── ProtectedRoute.js # Authentication wrapper
│   ├── RecommendationsPanel.js # Movie recommendation component
│   └── SearchRecommendationsPanel.js # Search-based suggestions
├── context/           # React context for state management
│   └── AuthContext.js # Authentication and user data
├── data/              # API and data handling
│   ├── api.js         # OMDB API service
│   ├── apiTest.js     # API testing utilities
│   ├── config.js      # Configuration settings
│   └── movies.js      # Movie data operations
├── pages/             # Main application views
│   ├── Dashboard.js   # User's watchlist and recommendations
│   ├── Home.js        # Landing page with movie showcases
│   ├── Login.js       # Authentication page
│   ├── Register.js    # User registration
│   └── Search.js      # Movie search functionality
└── App.js             # Main application component
```

## Dependencies

- React
- React Router
- Styled Components
- OMDB API

## Notes

- User data (accounts and watchlists) is stored in the browser's local storage
- If the OMDB API is unavailable, the application falls back to using local sample data 