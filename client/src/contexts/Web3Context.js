import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState(null);

  // Contract ABI and address
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x...';
  const CONTRACT_ABI = [
    // This would be the actual ABI from the compiled contract
    // For now, we'll include the essential functions
    "function registerVoter(address _voterAddress, string memory _voterId, string memory _name, string memory _email) external",
    "function verifyVoter(address _voterAddress, bool _verified) external",
    "function addCandidate(string memory _name, string memory _party, string memory _description, string memory _imageHash) external",
    "function createElection(string memory _title, string memory _description, uint256 _startTime, uint256 _endTime, string memory _electionType, uint256[] memory _candidateIds) external",
    "function castVote(uint256 _electionId, uint256 _candidateId) external",
    "function getElectionResults(uint256 _electionId) external view returns (uint256[] memory candidateIds, uint256[] memory voteCounts)",
    "function getVoterInfo(address _voterAddress) external view returns (tuple(bool isRegistered, bool hasVoted, uint256 weight, address voterAddress, string voterId, string name, string email, bool isVerified))",
    "function getCandidateInfo(uint256 _candidateId) external view returns (tuple(uint256 id, string name, string party, string description, uint256 voteCount, bool isActive, string imageHash))",
    "function getElectionInfo(uint256 _electionId) external view returns (tuple(uint256 id, string title, string description, uint256 startTime, uint256 endTime, bool isActive, uint256 totalVoters, uint256 totalVotes, string electionType))",
    "function getElectionCandidates(uint256 _electionId) external view returns (uint256[] memory)",
    "function hasVotedInSpecificElection(address _voterAddress, uint256 _electionId) external view returns (bool)",
    "function getContractStats() external view returns (uint256 _totalVoters, uint256 _totalCandidates, uint256 _totalElections, uint256 _currentElectionId)"
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return false;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        toast.error('No accounts found');
        return false;
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Set state
      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setNetwork(network);
      setIsConnected(true);

      // Initialize contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);

      toast.success('Wallet connected successfully!');
      return true;

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setNetwork(null);
    setIsConnected(false);
    setContract(null);
    toast.success('Wallet disconnected');
  };

  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  };

  const addNetwork = async (networkConfig) => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
      return true;
    } catch (error) {
      console.error('Error adding network:', error);
      return false;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            setAccount(accounts[0]);
            setProvider(provider);
            setSigner(signer);
            setNetwork(network);
            setIsConnected(true);

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            setContract(contract);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const value = {
    account,
    provider,
    signer,
    network,
    isConnected,
    isConnecting,
    contract,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    addNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};