import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../contexts/VotingContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Settings, 
  Users, 
  Vote, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Clock,
  Award,
  UserCheck,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const AdminContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.active ? 'white' : '#667eea'};
  }
`;

const TabContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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

const SecondaryButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #374151;
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

const ActionButton = styled.button`
  background: ${props => props.verify ? '#10b981' : '#ef4444'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
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

const Admin = () => {
  const { user } = useAuth();
  const { stats, loadStats } = useVoting();
  const { contract } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [voterForm, setVoterForm] = useState({
    address: '',
    voterId: '',
    name: '',
    email: ''
  });
  
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    party: '',
    description: '',
    imageHash: ''
  });
  
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    electionType: 'presidential',
    candidateIds: []
  });

  // Check if user is admin
  const isAdmin = user?.name === 'admin' || user?.email?.includes('admin');

  useEffect(() => {
    loadStats();
  }, []);

  const handleVoterSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.registerVoter(
        voterForm.address,
        voterForm.voterId,
        voterForm.name,
        voterForm.email
      );
      await tx.wait();
      toast.success('Voter registered successfully!');
      setVoterForm({ address: '', voterId: '', name: '', email: '' });
      loadStats();
    } catch (error) {
      console.error('Error registering voter:', error);
      toast.error('Failed to register voter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.addCandidate(
        candidateForm.name,
        candidateForm.party,
        candidateForm.description,
        candidateForm.imageHash
      );
      await tx.wait();
      toast.success('Candidate added successfully!');
      setCandidateForm({ name: '', party: '', description: '', imageHash: '' });
      loadStats();
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Failed to add candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleElectionSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);
      const startTime = Math.floor(new Date(electionForm.startTime).getTime() / 1000);
      const endTime = Math.floor(new Date(electionForm.endTime).getTime() / 1000);
      
      const tx = await contract.createElection(
        electionForm.title,
        electionForm.description,
        startTime,
        endTime,
        electionForm.electionType,
        electionForm.candidateIds.map(id => parseInt(id))
      );
      await tx.wait();
      toast.success('Election created successfully!');
      setElectionForm({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        electionType: 'presidential',
        candidateIds: []
      });
      loadStats();
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Container>
        <AdminContainer>
          <Header>
            <Title>Access Denied</Title>
            <Subtitle>You do not have admin privileges to access this page.</Subtitle>
          </Header>
        </AdminContainer>
      </Container>
    );
  }

  return (
    <Container>
      <AdminContainer>
        <Header>
          <Title>Admin Dashboard</Title>
          <Subtitle>Manage voters, candidates, and elections</Subtitle>
        </Header>

        <TabsContainer>
          <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            <Settings size={20} />
            Overview
          </Tab>
          <Tab active={activeTab === 'voters'} onClick={() => setActiveTab('voters')}>
            <Users size={20} />
            Voters
          </Tab>
          <Tab active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')}>
            <Award size={20} />
            Candidates
          </Tab>
          <Tab active={activeTab === 'elections'} onClick={() => setActiveTab('elections')}>
            <Vote size={20} />
            Elections
          </Tab>
        </TabsContainer>

        {activeTab === 'overview' && (
          <TabContent>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              System Overview
            </h2>
            
            <StatsGrid>
              <StatCard>
                <StatNumber>{stats.totalVoters}</StatNumber>
                <StatLabel>Total Voters</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.totalCandidates}</StatNumber>
                <StatLabel>Total Candidates</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.totalElections}</StatNumber>
                <StatLabel>Total Elections</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.currentElectionId}</StatNumber>
                <StatLabel>Current Election</StatLabel>
              </StatCard>
            </StatsGrid>
          </TabContent>
        )}

        {activeTab === 'voters' && (
          <TabContent>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Register New Voter
            </h2>
            
            <Form onSubmit={handleVoterSubmit}>
              <FormGroup>
                <Label>
                  <Users size={16} />
                  Wallet Address
                </Label>
                <Input
                  type="text"
                  value={voterForm.address}
                  onChange={(e) => setVoterForm({...voterForm, address: e.target.value})}
                  placeholder="0x..."
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Voter ID</Label>
                <Input
                  type="text"
                  value={voterForm.voterId}
                  onChange={(e) => setVoterForm({...voterForm, voterId: e.target.value})}
                  placeholder="Unique voter ID"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={voterForm.name}
                  onChange={(e) => setVoterForm({...voterForm, name: e.target.value})}
                  placeholder="Voter's full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={voterForm.email}
                  onChange={(e) => setVoterForm({...voterForm, email: e.target.value})}
                  placeholder="Voter's email"
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={isLoading}>
                <Plus size={16} />
                {isLoading ? 'Registering...' : 'Register Voter'}
              </Button>
            </Form>
          </TabContent>
        )}

        {activeTab === 'candidates' && (
          <TabContent>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Add New Candidate
            </h2>
            
            <Form onSubmit={handleCandidateSubmit}>
              <FormGroup>
                <Label>
                  <Award size={16} />
                  Candidate Name
                </Label>
                <Input
                  type="text"
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                  placeholder="Candidate's full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Political Party</Label>
                <Input
                  type="text"
                  value={candidateForm.party}
                  onChange={(e) => setCandidateForm({...candidateForm, party: e.target.value})}
                  placeholder="Political party or independent"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={candidateForm.description}
                  onChange={(e) => setCandidateForm({...candidateForm, description: e.target.value})}
                  placeholder="Candidate's background and platform"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Image Hash (IPFS)</Label>
                <Input
                  type="text"
                  value={candidateForm.imageHash}
                  onChange={(e) => setCandidateForm({...candidateForm, imageHash: e.target.value})}
                  placeholder="IPFS hash for candidate image"
                />
              </FormGroup>
              
              <Button type="submit" disabled={isLoading}>
                <Plus size={16} />
                {isLoading ? 'Adding...' : 'Add Candidate'}
              </Button>
            </Form>
          </TabContent>
        )}

        {activeTab === 'elections' && (
          <TabContent>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              Create New Election
            </h2>
            
            <Form onSubmit={handleElectionSubmit}>
              <FormGroup>
                <Label>
                  <Vote size={16} />
                  Election Title
                </Label>
                <Input
                  type="text"
                  value={electionForm.title}
                  onChange={(e) => setElectionForm({...electionForm, title: e.target.value})}
                  placeholder="Election title"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={electionForm.description}
                  onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                  placeholder="Election description"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Calendar size={16} />
                  Start Time
                </Label>
                <Input
                  type="datetime-local"
                  value={electionForm.startTime}
                  onChange={(e) => setElectionForm({...electionForm, startTime: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Clock size={16} />
                  End Time
                </Label>
                <Input
                  type="datetime-local"
                  value={electionForm.endTime}
                  onChange={(e) => setElectionForm({...electionForm, endTime: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Election Type</Label>
                <Input
                  type="text"
                  value={electionForm.electionType}
                  onChange={(e) => setElectionForm({...electionForm, electionType: e.target.value})}
                  placeholder="presidential, parliamentary, local, etc."
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={isLoading}>
                <Plus size={16} />
                {isLoading ? 'Creating...' : 'Create Election'}
              </Button>
            </Form>
          </TabContent>
        )}
      </AdminContainer>
    </Container>
  );
};

export default Admin;