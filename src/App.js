import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { testApiKey } from './data/apiTest';
import { OMDB_CONFIG } from './data/config';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  padding: 20px 0;
`;

const ApiStatus = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: ${props => props.isValid ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)'};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

function App() {
  const { isAuthenticated } = useAuth();
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    // Test the API key when the app loads
    const checkApiKey = async () => {
      const result = await testApiKey();
      setApiStatus(result);
      
      // Log the result to the console
      if (result.success) {
        console.log(`API Key "${OMDB_CONFIG.API_KEY}" is valid! Connected to OMDB API.`);
      } else {
        console.warn(`API Key validation failed. Using fallback movie data.`);
        console.error(result.error);
      }
    };

    checkApiKey();
  }, []);

  return (
    <AppContainer>
      <Navbar />
      <Content>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Content>
      
      {apiStatus && (
        <ApiStatus isValid={apiStatus.success}>
          {apiStatus.success 
            ? `✅ OMDB API Connected: ${apiStatus.data?.Title || 'API Working'}`
            : `⚠️ API Error: Using fallback data`
          }
        </ApiStatus>
      )}
    </AppContainer>
  );
}

export default App; 