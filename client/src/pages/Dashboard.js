import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../contexts/VotingContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Vote, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Shield,
  Calendar,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
`;

const ElectionCard = styled.div`
  background: ${props => props.isActive ? '#f0fdf4' : '#f8fafc'};
  border: 1px solid ${props => props.isActive ? '#bbf7d0' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const ElectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ElectionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ElectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isActive ? '#059669' : '#6b7280'};
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const UserInfo = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const UserInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const UserInfoLabel = styled.span`
  font-weight: 500;
  color: #6b7280;
`;

const UserInfoValue = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.verified ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.verified ? '#059669' : '#dc2626'};
  border: 1px solid ${props => props.verified ? '#bbf7d0' : '#fecaca'};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const QuickActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-decoration: none;
  color: #1f2937;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }
`;

const QuickActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const QuickActionTitle = styled.div`
  font-weight: 600;
  text-align: center;
`;

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentElection, stats, isElectionActive } = useVoting();
  const { account } = useWeb3();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (currentElection && account) {
      // Check if user has voted in current election
      // This would be implemented with the actual contract call
      setHasVoted(false); // Placeholder
    }
  }, [currentElection, account]);

  if (!isAuthenticated) {
    return (
      <Container>
        <DashboardContainer>
          <Header>
            <Title>Access Denied</Title>
            <Subtitle>Please connect your wallet and verify your account to access the dashboard.</Subtitle>
          </Header>
        </DashboardContainer>
      </Container>
    );
  }

  return (
    <Container>
      <DashboardContainer>
        <Header>
          <Title>Welcome back, {user?.name}!</Title>
          <Subtitle>Your secure voting dashboard</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <Users size={24} />
            </StatIcon>
            <StatNumber>{stats.totalVoters}</StatNumber>
            <StatLabel>Total Voters</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <Award size={24} />
            </StatIcon>
            <StatNumber>{stats.totalCandidates}</StatNumber>
            <StatLabel>Total Candidates</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <BarChart3 size={24} />
            </StatIcon>
            <StatNumber>{stats.totalElections}</StatNumber>
            <StatLabel>Total Elections</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <Shield size={24} />
            </StatIcon>
            <StatNumber>100%</StatNumber>
            <StatLabel>Security Score</StatLabel>
          </StatCard>
        </StatsGrid>

        <MainContent>
          <Card>
            <CardHeader>
              <CardIcon>
                <Vote size={20} />
              </CardIcon>
              <CardTitle>Current Election</CardTitle>
            </CardHeader>
            
            {currentElection ? (
              <ElectionCard isActive={isElectionActive(currentElection)}>
                <ElectionTitle>{currentElection.title}</ElectionTitle>
                <ElectionDescription>{currentElection.description}</ElectionDescription>
                <ElectionStatus isActive={isElectionActive(currentElection)}>
                  {isElectionActive(currentElection) ? (
                    <>
                      <Clock size={16} />
                      Election in Progress
                    </>
                  ) : (
                    <>
                      <Calendar size={16} />
                      Election Ended
                    </>
                  )}
                </ElectionStatus>
                
                {isElectionActive(currentElection) && !hasVoted && (
                  <ActionButton to="/vote">
                    <Vote size={16} />
                    Cast Your Vote
                  </ActionButton>
                )}
                
                {hasVoted && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: '#059669',
                    marginTop: '1rem',
                    fontWeight: '500'
                  }}>
                    <CheckCircle size={16} />
                    You have voted in this election
                  </div>
                )}
              </ElectionCard>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                <Vote size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No active elections at the moment</p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <User size={20} />
              </CardIcon>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            
            <UserInfo>
              <UserInfoRow>
                <UserInfoLabel>Name:</UserInfoLabel>
                <UserInfoValue>{user?.name}</UserInfoValue>
              </UserInfoRow>
              <UserInfoRow>
                <UserInfoLabel>Voter ID:</UserInfoLabel>
                <UserInfoValue>{user?.voterId}</UserInfoValue>
              </UserInfoRow>
              <UserInfoRow>
                <UserInfoLabel>Email:</UserInfoLabel>
                <UserInfoValue>{user?.email}</UserInfoValue>
              </UserInfoRow>
              <UserInfoRow>
                <UserInfoLabel>Wallet:</UserInfoLabel>
                <UserInfoValue>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</UserInfoValue>
              </UserInfoRow>
              <UserInfoRow>
                <UserInfoLabel>Status:</UserInfoLabel>
                <StatusBadge verified={user?.isVerified}>
                  {user?.isVerified ? (
                    <>
                      <CheckCircle size={14} />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} />
                      Pending Verification
                    </>
                  )}
                </StatusBadge>
              </UserInfoRow>
            </UserInfo>
          </Card>
        </MainContent>

        <QuickActions>
          <QuickActionButton to="/vote">
            <QuickActionIcon>
              <Vote size={24} />
            </QuickActionIcon>
            <QuickActionTitle>Cast Vote</QuickActionTitle>
          </QuickActionButton>
          
          <QuickActionButton to="/results">
            <QuickActionIcon>
              <BarChart3 size={24} />
            </QuickActionIcon>
            <QuickActionTitle>View Results</QuickActionTitle>
          </QuickActionButton>
          
          <QuickActionButton to="/profile">
            <QuickActionIcon>
              <User size={24} />
            </QuickActionIcon>
            <QuickActionTitle>Edit Profile</QuickActionTitle>
          </QuickActionButton>
        </QuickActions>
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;