import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieGrid from './MovieGrid';
import { getMovieRecommendations } from '../data/api';

const PanelContainer = styled.section`
  margin-top: 40px;
  margin-bottom: 40px;
  display: ${props => props.show ? 'block' : 'none'};
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

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const SearchRecommendationsPanel = ({ searchResults, limit = 4 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    // Only get recommendations if we have search results
    if (searchResults && searchResults.length > 0 && !processed) {
      const fetchRecommendations = async () => {
        setLoading(true);
        
        try {
          // Use the first search result as the basis for recommendations
          const referenceMovie = searchResults[0];
          const movieId = referenceMovie.id;
          
          // Get recommendations based on this movie
          const recommendedMovies = await getMovieRecommendations(movieId, limit);
          
          // Filter out movies that are already in search results
          const searchResultIds = searchResults.map(movie => movie.id);
          const filteredRecommendations = recommendedMovies.filter(
            movie => !searchResultIds.includes(movie.id)
          );
          
          setRecommendations(filteredRecommendations);
          setProcessed(true);
        } catch (error) {
          console.error('Error fetching search recommendations:', error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRecommendations();
    }
  }, [searchResults, limit, processed]);

  // Reset processed state when search results change
  useEffect(() => {
    setProcessed(false);
  }, [searchResults]);

  // Don't show if we have no recommendations or only a few search results
  if (!searchResults || searchResults.length < 2 || recommendations.length === 0) {
    return null;
  }

  return (
    <PanelContainer show={recommendations.length > 0}>
      <PanelHeader>
        <PanelTitle>Similar Movies You Might Like</PanelTitle>
      </PanelHeader>

      {loading ? (
        <LoadingIndicator>Finding similar movies...</LoadingIndicator>
      ) : (
        <MovieGrid 
          movies={recommendations} 
          emptyMessage="No similar movies found."
        />
      )}
    </PanelContainer>
  );
};

export default SearchRecommendationsPanel; 