import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Card = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoPoster = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #757575;
  text-align: center;
  padding: 20px;
`;

const Rating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin-bottom: 5px;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Genres = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray);
  margin-bottom: 10px;
`;

const Year = styled.span`
  background-color: var(--light-gray);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 10px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  background-color: ${props => props.remove ? 'var(--light-gray)' : 'var(--primary-color)'};
  color: ${props => props.remove ? 'var(--text-color)' : 'var(--white)'};
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;

  &:hover {
    background-color: ${props => props.remove ? 'var(--dark-gray)' : '#ff5252'};
    color: var(--white);
  }
`;

const MovieCard = ({ movie, inWatchlist = false }) => {
  const { addToWatchlist, removeFromWatchlist, isAuthenticated } = useAuth();

  const handleAddToWatchlist = () => {
    addToWatchlist(movie.id);
  };

  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(movie.id);
  };

  // Handle empty genre array
  const genreText = Array.isArray(movie.genre) && movie.genre.length > 0 
    ? movie.genre.join(', ') 
    : 'Not categorized';

  // Set default values for missing data
  const movieRating = typeof movie.rating === 'number' ? movie.rating : 0;
  const releaseYear = movie.year || 'N/A';
  const director = movie.director || 'Unknown';

  return (
    <Card>
      <PosterContainer>
        {movie.posterUrl ? (
          <Poster 
            src={movie.posterUrl} 
            alt={`${movie.title} poster`} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
        ) : (
          <NoPoster>No poster available</NoPoster>
        )}
        <Rating>{movieRating.toFixed(1)}</Rating>
      </PosterContainer>
      <CardContent>
        <Title title={movie.title}>{movie.title}</Title>
        <Genres>{genreText}</Genres>
        <div>
          <Year>{releaseYear}</Year>
          <span>{director}</span>
        </div>
        {isAuthenticated && (
          <CardActions>
            {inWatchlist ? (
              <Button 
                onClick={handleRemoveFromWatchlist} 
                remove
              >
                Remove from Watchlist
              </Button>
            ) : (
              <Button onClick={handleAddToWatchlist}>
                Add to Watchlist
              </Button>
            )}
          </CardActions>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard; 