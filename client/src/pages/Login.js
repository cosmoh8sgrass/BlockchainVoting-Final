import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { Vote, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const ConnectButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusCard = styled.div`
  background: ${props => props.type === 'success' ? '#f0fdf4' : '#fef2f2'};
  border: 1px solid ${props => props.type === 'success' ? '#bbf7d0' : '#fecaca'};
  color: ${props => props.type === 'success' ? '#166534' : '#dc2626'};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const HelpText = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: left;
`;

const HelpTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const HelpList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HelpItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Login = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected, isConnecting } = useWeb3();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isConnected, isAuthenticated, navigate]);

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      setStatus({ type: 'success', message: 'Wallet connected successfully!' });
      
      // Try to login
      const loginSuccess = await login();
      if (loginSuccess) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStatus({ 
          type: 'error', 
          message: 'Wallet connected but you are not registered. Please register first.' 
        });
      }
    } else {
      setStatus({ type: 'error', message: 'Failed to connect wallet. Please try again.' });
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>
          <LogoIcon>
            <Vote size={24} />
          </LogoIcon>
          <Title>BlockVote</Title>
        </Logo>
        
        <Subtitle>Connect your wallet to access the voting system</Subtitle>

        {status && (
          <StatusCard type={status.type}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.message}
          </StatusCard>
        )}

        <ConnectButton 
          onClick={handleConnect} 
          disabled={isConnecting || isLoading}
        >
          {isConnecting || isLoading ? 'Connecting...' : 'Connect Wallet'}
        </ConnectButton>

        <BackLink to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackLink>

        <HelpText>
          <HelpTitle>How to get started:</HelpTitle>
          <HelpList>
            <HelpItem>
              <CheckCircle size={16} />
              Install MetaMask or another Web3 wallet
            </HelpItem>
            <HelpItem>
              <CheckCircle size={16} />
              Connect your wallet to this application
            </HelpItem>
            <HelpItem>
              <CheckCircle size={16} />
              Register as a voter if you haven't already
            </HelpItem>
            <HelpItem>
              <CheckCircle size={16} />
              Wait for admin verification
            </HelpItem>
          </HelpList>
        </HelpText>
      </LoginCard>
    </Container>
  );
};

export default Login;