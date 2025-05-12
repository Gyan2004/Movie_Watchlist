import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MovieGrid from '../components/MovieGrid';
import SearchRecommendationsPanel from '../components/SearchRecommendationsPanel';
import { searchMovies } from '../data/movies';

const SearchContainer = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: var(--text-color);
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 30px;
  max-width: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--light-gray);
  border-radius: 4px 0 0 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  @media (max-width: 768px) {
    border-radius: 4px;
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 0 4px 4px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    border-radius: 4px;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ResultsTitle = styled.h2`
  margin: 0;
  color: var(--text-color);
`;

const ResultsCount = styled.span`
  color: var(--dark-gray);
  font-size: 1rem;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: var(--light-gray);
  margin: 40px 0;
`;

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check if a search query was passed via location state
  useEffect(() => {
    if (location.state?.query) {
      setQuery(location.state.query);
      handleSearch(location.state.query);
    }
  }, [location]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchMovies(searchQuery);
      setResults(searchResults);
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <SearchContainer>
      <Title>Search Movies</Title>
      
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Search by title or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </SearchButton>
      </SearchForm>

      {loading && <LoadingIndicator>Searching movies...</LoadingIndicator>}
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {searched && !loading && (
        <>
          <ResultsHeader>
            <ResultsTitle>Search Results</ResultsTitle>
            <ResultsCount>{results.length} movies found</ResultsCount>
          </ResultsHeader>
          
          <MovieGrid 
            movies={results}
            emptyMessage="No movies found matching your search criteria."
          />
          
          {results.length > 0 && (
            <>
              {/* Show recommendations based on search results */}
              <SearchRecommendationsPanel searchResults={results} limit={4} />
            </>
          )}
        </>
      )}
    </SearchContainer>
  );
};

export default Search; 