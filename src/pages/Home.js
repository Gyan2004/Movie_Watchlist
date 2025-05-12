import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import RecommendationsPanel from '../components/RecommendationsPanel';
import { getTopRatedMovies, getPopularMovies } from '../data/movies';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX1000.jpg');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin: -20px 0 30px;
  padding: 0 20px;
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 30px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: #ff5252;
    transform: translateY(-3px);
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 2rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 10px;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100px;
    height: 4px;
    background-color: var(--primary-color);
  }
`;

const MoviesSection = styled.section`
  margin-bottom: 40px;
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

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch top rated movies
        const topRated = await getTopRatedMovies(6);
        setTopMovies(topRated);
        
        // Fetch popular movies
        const popular = await getPopularMovies(6);
        setPopularMovies(popular);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Your Personal Movie Watchlist</HeroTitle>
          <HeroText>
            Discover, track, and organize your favorite movies in one place.
            Create your personalized watchlist and never miss a movie again.
          </HeroText>
          <HeroButton to="/register">Get Started</HeroButton>
        </HeroContent>
      </HeroSection>

      <div className="container">
        {loading ? (
          <LoadingIndicator>Loading movies...</LoadingIndicator>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            {/* Recommendations Panel */}
            <RecommendationsPanel limit={6} />
            
            <MoviesSection>
              <SectionTitle>Top Rated Movies</SectionTitle>
              <MovieGrid 
                movies={topMovies} 
                emptyMessage="No top rated movies available at the moment."
              />
            </MoviesSection>

            <MoviesSection>
              <SectionTitle>Popular Movies</SectionTitle>
              <MovieGrid 
                movies={popularMovies} 
                emptyMessage="No popular movies available at the moment."
              />
            </MoviesSection>
          </>
        )}
      </div>
    </>
  );
};

export default Home; 