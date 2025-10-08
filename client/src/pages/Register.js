import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { Vote, ArrowLeft, CheckCircle, AlertCircle, User, Mail, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
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
  text-align: center;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const RegisterButton = styled.button`
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
  margin-top: 1rem;

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

const ConnectButton = styled.button`
  width: 100%;
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    color: #667eea;
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

const HelpText = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
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

const Register = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected, isConnecting, account } = useWeb3();
  const { registerUser, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    voterId: '',
    name: '',
    email: '',
    reason: ''
  });
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      setStatus({ type: 'success', message: 'Wallet connected successfully!' });
    } else {
      setStatus({ type: 'error', message: 'Failed to connect wallet. Please try again.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setStatus({ type: 'error', message: 'Please connect your wallet first.' });
      return;
    }

    if (!formData.voterId || !formData.name || !formData.email) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const success = await registerUser(formData);
    if (success) {
      setStatus({ 
        type: 'success', 
        message: 'Registration successful! Please wait for admin verification before you can vote.' 
      });
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <BackLink to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackLink>

        <Logo>
          <LogoIcon>
            <Vote size={24} />
          </LogoIcon>
          <Title>Register to Vote</Title>
        </Logo>
        
        <Subtitle>Join the secure blockchain voting system</Subtitle>

        {!isConnected ? (
          <>
            <ConnectButton onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet First'}
            </ConnectButton>
            
            <HelpText>
              <HelpTitle>Registration Process:</HelpTitle>
              <HelpList>
                <HelpItem>
                  <CheckCircle size={16} />
                  Connect your Web3 wallet (MetaMask recommended)
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  Fill in your registration details
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  Submit for admin verification
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  Wait for approval to start voting
                </HelpItem>
              </HelpList>
            </HelpText>
          </>
        ) : (
          <>
            {status && (
              <StatusCard type={status.type}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                {status.message}
              </StatusCard>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <Hash size={16} />
                  Voter ID *
                </Label>
                <Input
                  type="text"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleInputChange}
                  placeholder="Enter your unique voter ID"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <User size={16} />
                  Full Name *
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Mail size={16} />
                  Email Address *
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Why do you want to participate? (Optional)</Label>
                <TextArea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Tell us why you want to participate in blockchain voting..."
                />
              </FormGroup>

              <RegisterButton type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register as Voter'}
              </RegisterButton>
            </Form>

            <HelpText>
              <HelpTitle>Important Notes:</HelpTitle>
              <HelpList>
                <HelpItem>
                  <CheckCircle size={16} />
                  Your wallet address: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  Registration requires admin approval
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  You can only register once per wallet
                </HelpItem>
                <HelpItem>
                  <CheckCircle size={16} />
                  Keep your wallet secure and backed up
                </HelpItem>
              </HelpList>
            </HelpText>
          </>
        )}
      </RegisterCard>
    </Container>
  );
};

export default Register;