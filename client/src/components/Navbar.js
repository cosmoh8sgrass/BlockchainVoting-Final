import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Vote, User, LogOut, Settings, BarChart3 } from 'lucide-react';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 800;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    box-shadow: ${props => props.theme.shadows.lg};
    border-radius: 0 0 1rem 1rem;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[700]};
  font-weight: ${props => props.active ? '600' : '500'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background: ${props => props.theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }
`;

const ConnectButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1001;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${props => props.theme.colors.gray[700]};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.theme.colors.gray[700]};

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, isConnecting } = useWeb3();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoIcon>
          <Vote size={24} />
        </LogoIcon>
        BlockVote
      </Logo>

      <NavLinks isOpen={isMenuOpen}>
        <NavLink to="/" active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/results" active={isActive('/results')}>
          Results
        </NavLink>
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/vote" active={isActive('/vote')}>
              Vote
            </NavLink>
          </>
        )}
        {user && user.name === 'admin' && (
          <NavLink to="/admin" active={isActive('/admin')}>
            Admin
          </NavLink>
        )}
      </NavLinks>

      <WalletSection>
        {!isConnected ? (
          <ConnectButton onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </ConnectButton>
        ) : (
          <UserMenu>
            <UserInfo onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <UserAvatar>
                {user ? user.name.charAt(0).toUpperCase() : 'U'}
              </UserAvatar>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  {user ? user.name : 'User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
                </div>
              </div>
            </UserInfo>

            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem to="/profile">
                <User size={16} />
                Profile
              </DropdownItem>
              <DropdownItem to="/dashboard">
                <BarChart3 size={16} />
                Dashboard
              </DropdownItem>
              <LogoutButton onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </LogoutButton>
            </DropdownMenu>
          </UserMenu>
        )}

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </WalletSection>
    </NavbarContainer>
  );
};

export default Navbar;