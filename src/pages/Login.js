import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const LoginCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 30px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: var(--text-color);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--primary-color);
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;

  a {
    color: var(--primary-color);
    font-weight: 500;
  }
`;

const DemoAccount = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const isSuccessful = login(username, password);
    
    if (isSuccessful) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError('');
    
    const isSuccessful = login('demo', 'password');
    
    if (isSuccessful) {
      navigate('/dashboard');
    } else {
      setError('Demo account not available');
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login to Your Account</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        
        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
        
        <DemoAccount>
          <p>Just want to try it out?</p>
          <Link to="#" onClick={handleDemoLogin}>
            Use Demo Account
          </Link>
        </DemoAccount>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 