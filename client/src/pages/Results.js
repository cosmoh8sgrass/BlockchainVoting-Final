import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useVoting } from '../contexts/VotingContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar, 
  Clock,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ResultsContainer = styled.div`
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

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const ExportButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
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

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ResultsTable = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #374151;
`;

const RankCell = styled.td`
  padding: 1rem;
  color: #374151;
  font-weight: 600;
  text-align: center;
`;

const VoteCountCell = styled.td`
  padding: 1rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
`;

const PercentageCell = styled.td`
  padding: 1rem;
  color: #667eea;
  font-weight: 600;
  text-align: right;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const WinnerCard = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px rgba(16, 185, 129, 0.2);
`;

const WinnerIcon = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #10b981;
`;

const WinnerName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WinnerParty = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const WinnerVotes = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const WinnerLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: #9ca3af;
`;

const COLORS = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Results = () => {
  const { currentElection, candidates, getElectionResults, loadCurrentElection } = useVoting();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadResults = async () => {
    if (!currentElection) return;
    
    setIsLoading(true);
    try {
      const electionResults = await getElectionResults(currentElection.id);
      if (electionResults) {
        const resultsWithCandidates = electionResults.candidateIds.map((candidateId, index) => {
          const candidate = candidates.find(c => c.id === candidateId);
          return {
            id: candidateId,
            name: candidate?.name || 'Unknown',
            party: candidate?.party || 'Independent',
            votes: parseInt(electionResults.voteCounts[index]) || 0,
            percentage: 0 // Will be calculated below
          };
        });

        const totalVotes = resultsWithCandidates.reduce((sum, candidate) => sum + candidate.votes, 0);
        
        const resultsWithPercentages = resultsWithCandidates.map(candidate => ({
          ...candidate,
          percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
        }));

        // Sort by votes (descending)
        resultsWithCandidates.sort((a, b) => b.votes - a.votes);

        setResults(resultsWithCandidates);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [currentElection, candidates]);

  const handleRefresh = () => {
    loadResults();
  };

  const handleExport = () => {
    if (!results) return;
    
    const csvContent = [
      ['Rank', 'Candidate', 'Party', 'Votes', 'Percentage'],
      ...results.map((candidate, index) => [
        index + 1,
        candidate.name,
        candidate.party,
        candidate.votes,
        `${candidate.percentage.toFixed(2)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${currentElection?.title || 'results'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const chartData = results?.map((candidate, index) => ({
    name: candidate.name,
    votes: candidate.votes,
    percentage: candidate.percentage,
    color: COLORS[index % COLORS.length]
  })) || [];

  const pieData = results?.map((candidate, index) => ({
    name: candidate.name,
    value: candidate.votes,
    color: COLORS[index % COLORS.length]
  })) || [];

  if (!currentElection) {
    return (
      <Container>
        <ResultsContainer>
          <EmptyState>
            <EmptyIcon>
              <BarChart3 size={40} />
            </EmptyIcon>
            <h2>No Election Data</h2>
            <p>There are no elections to display results for.</p>
          </EmptyState>
        </ResultsContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ResultsContainer>
        <Header>
          <Title>Election Results</Title>
          <Subtitle>Live results for {currentElection.title}</Subtitle>
        </Header>

        <Controls>
          <RefreshButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Refreshing...' : 'Refresh Results'}
          </RefreshButton>
          <ExportButton onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </ExportButton>
        </Controls>

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <Users size={24} />
            </StatIcon>
            <StatNumber>{currentElection.totalVoters}</StatNumber>
            <StatLabel>Total Voters</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <BarChart3 size={24} />
            </StatIcon>
            <StatNumber>{currentElection.totalVotes}</StatNumber>
            <StatLabel>Votes Cast</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <TrendingUp size={24} />
            </StatIcon>
            <StatNumber>
              {currentElection.totalVoters > 0 
                ? ((currentElection.totalVotes / currentElection.totalVoters) * 100).toFixed(1)
                : 0}%
            </StatNumber>
            <StatLabel>Turnout Rate</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <Clock size={24} />
            </StatIcon>
            <StatNumber>
              {lastUpdated.toLocaleTimeString()}
            </StatNumber>
            <StatLabel>Last Updated</StatLabel>
          </StatCard>
        </StatsGrid>

        {results && results.length > 0 && (
          <>
            <WinnerCard>
              <WinnerIcon>
                <Award size={40} />
              </WinnerIcon>
              <WinnerName>{results[0].name}</WinnerName>
              <WinnerParty>{results[0].party}</WinnerParty>
              <WinnerVotes>{results[0].votes.toLocaleString()}</WinnerVotes>
              <WinnerLabel>Votes ({results[0].percentage.toFixed(2)}%)</WinnerLabel>
            </WinnerCard>

            <ChartsSection>
              <ChartCard>
                <ChartTitle>
                  <BarChart3 size={20} />
                  Vote Distribution
                </ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard>
                <ChartTitle>
                  <TrendingUp size={20} />
                  Vote Share
                </ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </ChartsSection>

            <ResultsTable>
              <TableTitle>
                <Award size={20} />
                Detailed Results
              </TableTitle>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Rank</TableHeader>
                    <TableHeader>Candidate</TableHeader>
                    <TableHeader>Party</TableHeader>
                    <TableHeader>Votes</TableHeader>
                    <TableHeader>Percentage</TableHeader>
                    <TableHeader>Progress</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {results.map((candidate, index) => (
                    <TableRow key={candidate.id}>
                      <RankCell>{index + 1}</RankCell>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.party}</TableCell>
                      <VoteCountCell>{candidate.votes.toLocaleString()}</VoteCountCell>
                      <PercentageCell>{candidate.percentage.toFixed(2)}%</PercentageCell>
                      <TableCell>
                        <ProgressBar>
                          <ProgressFill percentage={candidate.percentage} />
                        </ProgressBar>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </ResultsTable>
          </>
        )}

        {(!results || results.length === 0) && !isLoading && (
          <EmptyState>
            <EmptyIcon>
              <BarChart3 size={40} />
            </EmptyIcon>
            <h2>No Results Available</h2>
            <p>Results will be displayed here once votes are cast.</p>
          </EmptyState>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default Results;