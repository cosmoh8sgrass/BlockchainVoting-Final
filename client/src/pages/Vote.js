import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../contexts/VotingContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Vote as VoteIcon, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Shield,
  ArrowLeft,
  Calendar,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const VoteContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const VoteCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ElectionInfo = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const ElectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ElectionDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ElectionMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const MetaIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetaContent = styled.div`
  flex: 1;
`;

const MetaLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const CandidatesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CandidateCard = styled.div`
  background: ${props => props.selected ? '#f0fdf4' : 'white'};
  border: 2px solid ${props => props.selected ? '#10b981' : '#e5e7eb'};
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.selected ? '#10b981' : '#667eea'};
  }
`;

const CandidateImage = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
`;

const CandidateName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const CandidateParty = styled.div`
  color: #667eea;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
`;

const CandidateDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const VoteButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
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
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WarningCard = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Vote = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentElection, candidates, castVote, isElectionActive, isLoading } = useVoting();
  const { account } = useWeb3();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (voteSuccess) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [voteSuccess]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate first');
      return;
    }

    if (!currentElection) {
      toast.error('No active election found');
      return;
    }

    setIsVoting(true);
    const success = await castVote(currentElection.id, selectedCandidate.id);
    
    if (success) {
      setVoteSuccess(true);
      toast.success('Vote cast successfully!');
    }
    
    setIsVoting(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  const getTimeRemaining = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = parseInt(endTime) - now;
    
    if (remaining <= 0) return 'Election ended';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <VoteContainer>
          <Header>
            <Title>Access Denied</Title>
            <Subtitle>Please connect your wallet and verify your account to vote.</Subtitle>
          </Header>
        </VoteContainer>
      </Container>
    );
  }

  if (!user?.isVerified) {
    return (
      <Container>
        <VoteContainer>
          <Header>
            <Title>Account Not Verified</Title>
            <Subtitle>Your account is pending verification. Please wait for admin approval.</Subtitle>
          </Header>
        </VoteContainer>
      </Container>
    );
  }

  if (voteSuccess) {
    return (
      <Container>
        {showConfetti && <Confetti />}
        <VoteContainer>
          <VoteCard>
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                Vote Cast Successfully!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Thank you for participating in the democratic process. Your vote has been recorded on the blockchain.
              </p>
              <Link to="/results" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                <Award size={20} />
                View Results
              </Link>
            </div>
          </VoteCard>
        </VoteContainer>
      </Container>
    );
  }

  if (!currentElection || !isElectionActive(currentElection)) {
    return (
      <Container>
        <VoteContainer>
          <BackLink to="/dashboard">
            <ArrowLeft size={16} />
            Back to Dashboard
          </BackLink>
          <Header>
            <Title>No Active Election</Title>
            <Subtitle>There are no active elections at the moment. Please check back later.</Subtitle>
          </Header>
        </VoteContainer>
      </Container>
    );
  }

  return (
    <Container>
      <VoteContainer>
        <BackLink to="/dashboard">
          <ArrowLeft size={16} />
          Back to Dashboard
        </BackLink>

        <Header>
          <Title>Cast Your Vote</Title>
          <Subtitle>Make your voice heard in the democratic process</Subtitle>
        </Header>

        <VoteCard>
          <ElectionInfo>
            <ElectionTitle>{currentElection.title}</ElectionTitle>
            <ElectionDescription>{currentElection.description}</ElectionDescription>
            
            <ElectionMeta>
              <MetaItem>
                <MetaIcon>
                  <Calendar size={20} />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>Start Time</MetaLabel>
                  <MetaValue>{formatTime(currentElection.startTime)}</MetaValue>
                </MetaContent>
              </MetaItem>
              
              <MetaItem>
                <MetaIcon>
                  <Clock size={20} />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>End Time</MetaLabel>
                  <MetaValue>{formatTime(currentElection.endTime)}</MetaValue>
                </MetaContent>
              </MetaItem>
              
              <MetaItem>
                <MetaIcon>
                  <Users size={20} />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>Total Voters</MetaLabel>
                  <MetaValue>{currentElection.totalVoters}</MetaValue>
                </MetaContent>
              </MetaItem>
              
              <MetaItem>
                <MetaIcon>
                  <VoteIcon size={20} />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>Votes Cast</MetaLabel>
                  <MetaValue>{currentElection.totalVotes}</MetaValue>
                </MetaContent>
              </MetaItem>
            </ElectionMeta>
          </ElectionInfo>

          <WarningCard>
            <AlertCircle size={24} />
            <div>
              <strong>Important:</strong> You can only vote once per election. Your vote is final and cannot be changed once submitted. Make sure you have selected the correct candidate before proceeding.
            </div>
          </WarningCard>

          <CandidatesSection>
            <SectionTitle>
              <VoteIcon size={20} />
              Select Your Candidate
            </SectionTitle>
            
            <CandidatesGrid>
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  selected={selectedCandidate?.id === candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  {selectedCandidate?.id === candidate.id && (
                    <SelectedIndicator>
                      <CheckCircle size={16} />
                    </SelectedIndicator>
                  )}
                  
                  <CandidateImage>
                    {candidate.name.charAt(0)}
                  </CandidateImage>
                  
                  <CandidateName>{candidate.name}</CandidateName>
                  <CandidateParty>{candidate.party}</CandidateParty>
                  <CandidateDescription>{candidate.description}</CandidateDescription>
                </CandidateCard>
              ))}
            </CandidatesGrid>
          </CandidatesSection>

          <VoteButton 
            onClick={handleVote} 
            disabled={!selectedCandidate || isVoting}
          >
            {isVoting ? (
              'Casting Vote...'
            ) : (
              <>
                <VoteIcon size={20} />
                Cast Vote for {selectedCandidate?.name || 'Selected Candidate'}
              </>
            )}
          </VoteButton>
        </VoteCard>
      </VoteContainer>
    </Container>
  );
};

export default Vote;