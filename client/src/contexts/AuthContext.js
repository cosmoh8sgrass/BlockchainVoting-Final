import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { account, contract, isConnected } = useWeb3();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is registered and verified
  const checkUserStatus = async () => {
    if (!contract || !account) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      setIsLoading(true);
      const voterInfo = await contract.getVoterInfo(account);
      
      if (voterInfo.isRegistered) {
        setUser({
          address: account,
          voterId: voterInfo.voterId,
          name: voterInfo.name,
          email: voterInfo.email,
          isVerified: voterInfo.isVerified,
          hasVoted: voterInfo.hasVoted,
          weight: voterInfo.weight.toString(),
        });
        setIsAuthenticated(voterInfo.isVerified);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const registerUser = async (voterData) => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      setIsLoading(true);
      const tx = await contract.registerVoter(
        account,
        voterData.voterId,
        voterData.name,
        voterData.email
      );
      
      await tx.wait();
      toast.success('Registration successful! Please wait for verification.');
      
      // Refresh user status
      await checkUserStatus();
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login (just check if user is verified)
  const login = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return false;
    }

    await checkUserStatus();
    return isAuthenticated;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Check user status when account changes
  useEffect(() => {
    if (account && contract) {
      checkUserStatus();
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [account, contract]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    registerUser,
    login,
    logout,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};