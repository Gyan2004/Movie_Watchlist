import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import RecommendationsPanel from '../components/RecommendationsPanel';
import { useAuth } from '../context/AuthContext';
import { getMoviesByIds } from '../data/movies';

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text-color);
`;

const SearchButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: #ff5252;
  }
`;

const SectionTitle = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 10px;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 80px;
    height: 4px;
    background-color: var(--primary-color);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
`;

const EmptyStateTitle = styled.h3`
  margin-bottom: 10px;
  color: var(--text-color);
`;

const EmptyStateText = styled.p`
  margin-bottom: 20px;
  color: var(--dark-gray);
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  color: #e53935;
  text-align: center;
  padding: 20px;
  background-color: rgba(229, 57, 53, 0.1);
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Dashboard = () => {
  const { getWatchlist, currentUser } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const watchlistIds = getWatchlist();
        
        // Fetch watchlist movies
        const watchlist = await getMoviesByIds(watchlistIds);
        setWatchlistMovies(watchlist);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load your watchlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [getWatchlist]);

  return (
    <div>
      <DashboardHeader>
        <Title>
          {currentUser ? `${currentUser.username}'s Watchlist` : 'My Watchlist'}
        </Title>
        <SearchButton to="/search">Search Movies</SearchButton>
      </DashboardHeader>

      {loading ? (
        <LoadingIndicator>Loading your watchlist...</LoadingIndicator>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <section>
            <SectionTitle>My Watchlist</SectionTitle>
            
            {watchlistMovies.length > 0 ? (
              <MovieGrid 
                movies={watchlistMovies} 
                inWatchlist={true} 
              />
            ) : (
              <EmptyState>
                <EmptyStateTitle>Your watchlist is empty</EmptyStateTitle>
                <EmptyStateText>
                  Start adding movies to your watchlist to keep track of what you want to watch.
                </EmptyStateText>
                <SearchButton to="/search">Browse Movies</SearchButton>
              </EmptyState>
            )}
          </section>

          {/* Recommendations Panel */}
          <RecommendationsPanel limit={8} />
        </>
      )}
    </div>
  );
};

export default Dashboard; 