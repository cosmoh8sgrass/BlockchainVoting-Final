import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const VotingContext = createContext();

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

export const VotingProvider = ({ children }) => {
  const { contract, account } = useWeb3();
  const { user, isAuthenticated } = useAuth();
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentElection, setCurrentElection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalCandidates: 0,
    totalElections: 0,
    currentElectionId: 0,
  });

  // Load contract statistics
  const loadStats = async () => {
    if (!contract) return;

    try {
      const stats = await contract.getContractStats();
      setStats({
        totalVoters: stats._totalVoters.toString(),
        totalCandidates: stats._totalCandidates.toString(),
        totalElections: stats._totalElections.toString(),
        currentElectionId: stats._currentElectionId.toString(),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load all elections
  const loadElections = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const electionsList = [];
      
      for (let i = 1; i <= parseInt(stats.totalElections); i++) {
        try {
          const election = await contract.getElectionInfo(i);
          electionsList.push({
            id: election.id.toString(),
            title: election.title,
            description: election.description,
            startTime: election.startTime.toString(),
            endTime: election.endTime.toString(),
            isActive: election.isActive,
            totalVoters: election.totalVoters.toString(),
            totalVotes: election.totalVotes.toString(),
            electionType: election.electionType,
          });
        } catch (error) {
          console.error(`Error loading election ${i}:`, error);
        }
      }
      
      setElections(electionsList);
    } catch (error) {
      console.error('Error loading elections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load candidates for a specific election
  const loadElectionCandidates = async (electionId) => {
    if (!contract) return;

    try {
      const candidateIds = await contract.getElectionCandidates(electionId);
      const candidatesList = [];

      for (const candidateId of candidateIds) {
        try {
          const candidate = await contract.getCandidateInfo(candidateId);
          candidatesList.push({
            id: candidate.id.toString(),
            name: candidate.name,
            party: candidate.party,
            description: candidate.description,
            voteCount: candidate.voteCount.toString(),
            isActive: candidate.isActive,
            imageHash: candidate.imageHash,
          });
        } catch (error) {
          console.error(`Error loading candidate ${candidateId}:`, error);
        }
      }

      setCandidates(candidatesList);
    } catch (error) {
      console.error('Error loading election candidates:', error);
    }
  };

  // Load current election
  const loadCurrentElection = async () => {
    if (!contract || !stats.currentElectionId) return;

    try {
      const election = await contract.getElectionInfo(stats.currentElectionId);
      setCurrentElection({
        id: election.id.toString(),
        title: election.title,
        description: election.description,
        startTime: election.startTime.toString(),
        endTime: election.endTime.toString(),
        isActive: election.isActive,
        totalVoters: election.totalVoters.toString(),
        totalVotes: election.totalVotes.toString(),
        electionType: election.electionType,
      });

      // Load candidates for current election
      await loadElectionCandidates(stats.currentElectionId);
    } catch (error) {
      console.error('Error loading current election:', error);
    }
  };

  // Cast a vote
  const castVote = async (electionId, candidateId) => {
    if (!contract || !isAuthenticated) {
      toast.error('Please connect and verify your wallet first');
      return false;
    }

    try {
      setIsLoading(true);
      const tx = await contract.castVote(electionId, candidateId);
      await tx.wait();
      
      toast.success('Vote cast successfully!');
      
      // Refresh data
      await loadCurrentElection();
      await loadStats();
      
      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has voted in specific election
  const hasVotedInElection = async (electionId) => {
    if (!contract || !account) return false;

    try {
      return await contract.hasVotedInSpecificElection(account, electionId);
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  // Get election results
  const getElectionResults = async (electionId) => {
    if (!contract) return null;

    try {
      const results = await contract.getElectionResults(electionId);
      return {
        candidateIds: results.candidateIds.map(id => id.toString()),
        voteCounts: results.voteCounts.map(count => count.toString()),
      };
    } catch (error) {
      console.error('Error getting election results:', error);
      return null;
    }
  };

  // Check if election is active
  const isElectionActive = (election) => {
    if (!election) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const startTime = parseInt(election.startTime);
    const endTime = parseInt(election.endTime);
    
    return election.isActive && now >= startTime && now <= endTime;
  };

  // Load initial data
  useEffect(() => {
    if (contract) {
      loadStats();
    }
  }, [contract]);

  useEffect(() => {
    if (stats.totalElections > 0) {
      loadElections();
    }
  }, [stats.totalElections]);

  useEffect(() => {
    if (stats.currentElectionId > 0) {
      loadCurrentElection();
    }
  }, [stats.currentElectionId]);

  const value = {
    elections,
    candidates,
    currentElection,
    stats,
    isLoading,
    loadElections,
    loadElectionCandidates,
    loadCurrentElection,
    castVote,
    hasVotedInElection,
    getElectionResults,
    isElectionActive,
  };

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
};