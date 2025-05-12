import React from 'react';
import styled from 'styled-components';
import MovieCard from './MovieCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: var(--dark-gray);
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 20px;
`;

const MovieGrid = ({ movies, inWatchlist = false, emptyMessage }) => {
  if (!movies || movies.length === 0) {
    return <EmptyMessage>{emptyMessage || 'No movies found.'}</EmptyMessage>;
  }

  return (
    <Grid>
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          inWatchlist={inWatchlist} 
        />
      ))}
    </Grid>
  );
};

export default MovieGrid; 