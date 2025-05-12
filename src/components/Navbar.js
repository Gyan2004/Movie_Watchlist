import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  background-color: var(--white);
  box-shadow: var(--shadow);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: var(--white);
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    color: var(--primary-color);
  }
`;

const NavButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'var(--white)' : 'var(--text-color)'};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => props.primary ? '#ff5252' : 'var(--light-gray)'};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarContainer>
      <div className="container">
        <NavContent>
          <Logo to="/">MovieWatchlist</Logo>
          
          <MobileMenuButton onClick={toggleMenu}>
            ☰
          </MobileMenuButton>

          <NavLinks isOpen={isMenuOpen}>
            <NavLink to="/">Home</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">My Watchlist</NavLink>
                <NavLink to="/search">Search Movies</NavLink>
                <NavButton onClick={handleLogout}>Logout</NavButton>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavButton as={Link} to="/register" primary>Register</NavButton>
              </>
            )}
          </NavLinks>
        </NavContent>
      </div>
    </NavbarContainer>
  );
};

export default Navbar; 