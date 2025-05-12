import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getRecommendations, getTopRatedMovies } from '../data/movies';
import MovieGrid from './MovieGrid';

const PanelContainer = styled.section`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 10px;
  margin: 0;

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

const RefreshButton = styled.button`
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  color: #e53935;
  text-align: center;
  padding: 15px;
  background-color: rgba(229, 57, 53, 0.1);
  border-radius: 4px;
  margin-bottom: 20px;
`;

const InfoMessage = styled.div`
  padding: 15px;
  color: var(--dark-gray);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const RecommendationsPanel = ({ limit = 6 }) => {
  const { getWatchlist, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      let movies = [];
      
      if (isAuthenticated) {
        const watchlistIds = getWatchlist();
        if (watchlistIds.length > 0) {
          // If user has watchlist, get recommendations based on it
          movies = await getRecommendations(watchlistIds, limit);
        } else {
          // If watchlist is empty, get popular movies
          movies = await getTopRatedMovies(limit);
        }
      } else {
        // For non-authenticated users, show top rated movies
        movies = await getTopRatedMovies(limit);
      }
      
      setRecommendations(movies);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load movie recommendations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [isAuthenticated, getWatchlist]); // Re-fetch when auth state or watchlist changes

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Recommended For You</PanelTitle>
        <RefreshButton onClick={handleRefresh} disabled={loading || refreshing}>
          {refreshing ? 'Refreshing...' : '↻ Refresh'}
        </RefreshButton>
      </PanelHeader>

      {!isAuthenticated && (
        <InfoMessage>
          Sign in to get personalized movie recommendations based on your watchlist!
        </InfoMessage>
      )}

      {isAuthenticated && getWatchlist().length === 0 && (
        <InfoMessage>
          Add movies to your watchlist to get personalized recommendations based on your preferences.
        </InfoMessage>
      )}

      {loading ? (
        <LoadingIndicator>Loading recommendations...</LoadingIndicator>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <MovieGrid 
          movies={recommendations} 
          emptyMessage="No recommendations available at the moment. Try refreshing or add more movies to your watchlist."
        />
      )}
    </PanelContainer>
  );
};

export default RecommendationsPanel; 