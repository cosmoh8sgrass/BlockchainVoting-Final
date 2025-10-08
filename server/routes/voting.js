const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL || 'http://localhost:7545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract ABI (simplified for server use)
const CONTRACT_ABI = [
  "function getContractStats() external view returns (uint256 _totalVoters, uint256 _totalCandidates, uint256 _totalElections, uint256 _currentElectionId)",
  "function getElectionInfo(uint256 _electionId) external view returns (tuple(uint256 id, string title, string description, uint256 startTime, uint256 endTime, bool isActive, uint256 totalVoters, uint256 totalVotes, string electionType))",
  "function getCandidateInfo(uint256 _candidateId) external view returns (tuple(uint256 id, string name, string party, string description, uint256 voteCount, bool isActive, string imageHash))",
  "function getElectionCandidates(uint256 _electionId) external view returns (uint256[] memory)",
  "function getElectionResults(uint256 _electionId) external view returns (uint256[] memory candidateIds, uint256[] memory voteCounts)",
  "function hasVotedInSpecificElection(address _voterAddress, uint256 _electionId) external view returns (bool)"
];

// Initialize contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Get contract statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await contract.getContractStats();
    
    res.json({
      success: true,
      data: {
        totalVoters: stats._totalVoters.toString(),
        totalCandidates: stats._totalCandidates.toString(),
        totalElections: stats._totalElections.toString(),
        currentElectionId: stats._currentElectionId.toString()
      }
    });

  } catch (error) {
    console.error('Error fetching contract stats:', error);
    res.status(500).json({
      error: 'Failed to fetch contract statistics',
      message: error.message
    });
  }
});

// Get election information
router.get('/election/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const election = await contract.getElectionInfo(id);
    
    res.json({
      success: true,
      data: {
        id: election.id.toString(),
        title: election.title,
        description: election.description,
        startTime: election.startTime.toString(),
        endTime: election.endTime.toString(),
        isActive: election.isActive,
        totalVoters: election.totalVoters.toString(),
        totalVotes: election.totalVotes.toString(),
        electionType: election.electionType
      }
    });

  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({
      error: 'Failed to fetch election information',
      message: error.message
    });
  }
});

// Get all elections
router.get('/elections', async (req, res) => {
  try {
    const stats = await contract.getContractStats();
    const elections = [];
    
    for (let i = 1; i <= parseInt(stats._totalElections); i++) {
      try {
        const election = await contract.getElectionInfo(i);
        elections.push({
          id: election.id.toString(),
          title: election.title,
          description: election.description,
          startTime: election.startTime.toString(),
          endTime: election.endTime.toString(),
          isActive: election.isActive,
          totalVoters: election.totalVoters.toString(),
          totalVotes: election.totalVotes.toString(),
          electionType: election.electionType
        });
      } catch (error) {
        console.error(`Error fetching election ${i}:`, error);
      }
    }
    
    res.json({
      success: true,
      data: elections
    });

  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({
      error: 'Failed to fetch elections',
      message: error.message
    });
  }
});

// Get candidate information
router.get('/candidate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await contract.getCandidateInfo(id);
    
    res.json({
      success: true,
      data: {
        id: candidate.id.toString(),
        name: candidate.name,
        party: candidate.party,
        description: candidate.description,
        voteCount: candidate.voteCount.toString(),
        isActive: candidate.isActive,
        imageHash: candidate.imageHash
      }
    });

  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate information',
      message: error.message
    });
  }
});

// Get election candidates
router.get('/election/:id/candidates', async (req, res) => {
  try {
    const { id } = req.params;
    const candidateIds = await contract.getElectionCandidates(id);
    const candidates = [];
    
    for (const candidateId of candidateIds) {
      try {
        const candidate = await contract.getCandidateInfo(candidateId);
        candidates.push({
          id: candidate.id.toString(),
          name: candidate.name,
          party: candidate.party,
          description: candidate.description,
          voteCount: candidate.voteCount.toString(),
          isActive: candidate.isActive,
          imageHash: candidate.imageHash
        });
      } catch (error) {
        console.error(`Error fetching candidate ${candidateId}:`, error);
      }
    }
    
    res.json({
      success: true,
      data: candidates
    });

  } catch (error) {
    console.error('Error fetching election candidates:', error);
    res.status(500).json({
      error: 'Failed to fetch election candidates',
      message: error.message
    });
  }
});

// Get election results
router.get('/election/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await contract.getElectionResults(id);
    
    const candidates = [];
    for (let i = 0; i < results.candidateIds.length; i++) {
      try {
        const candidate = await contract.getCandidateInfo(results.candidateIds[i]);
        candidates.push({
          id: candidate.id.toString(),
          name: candidate.name,
          party: candidate.party,
          votes: results.voteCounts[i].toString(),
          percentage: 0 // Will be calculated on frontend
        });
      } catch (error) {
        console.error(`Error fetching candidate ${results.candidateIds[i]}:`, error);
      }
    }
    
    res.json({
      success: true,
      data: {
        candidateIds: results.candidateIds.map(id => id.toString()),
        voteCounts: results.voteCounts.map(count => count.toString()),
        candidates
      }
    });

  } catch (error) {
    console.error('Error fetching election results:', error);
    res.status(500).json({
      error: 'Failed to fetch election results',
      message: error.message
    });
  }
});

// Check if voter has voted in specific election
router.get('/election/:electionId/voter/:voterAddress/voted', async (req, res) => {
  try {
    const { electionId, voterAddress } = req.params;
    const hasVoted = await contract.hasVotedInSpecificElection(voterAddress, electionId);
    
    res.json({
      success: true,
      data: {
        hasVoted,
        voterAddress,
        electionId
      }
    });

  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({
      error: 'Failed to check vote status',
      message: error.message
    });
  }
});

// Get current election
router.get('/current-election', async (req, res) => {
  try {
    const stats = await contract.getContractStats();
    
    if (stats._currentElectionId === 0) {
      return res.json({
        success: true,
        data: null
      });
    }
    
    const election = await contract.getElectionInfo(stats._currentElectionId);
    
    res.json({
      success: true,
      data: {
        id: election.id.toString(),
        title: election.title,
        description: election.description,
        startTime: election.startTime.toString(),
        endTime: election.endTime.toString(),
        isActive: election.isActive,
        totalVoters: election.totalVoters.toString(),
        totalVotes: election.totalVotes.toString(),
        electionType: election.electionType
      }
    });

  } catch (error) {
    console.error('Error fetching current election:', error);
    res.status(500).json({
      error: 'Failed to fetch current election',
      message: error.message
    });
  }
});

module.exports = router;