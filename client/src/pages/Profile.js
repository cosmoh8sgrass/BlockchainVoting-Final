import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  User, 
  Mail, 
  Hash, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Save,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ProfileContainer = styled.div`
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

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
`;

const AvatarEdit = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #667eea;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.verified ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.verified ? '#059669' : '#dc2626'};
  border: 1px solid ${props => props.verified ? '#bbf7d0' : '#fecaca'};
`;

const EditButton = styled.button`
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

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
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
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }
`;

const CancelButton = styled.button`
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

const InfoSection = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f9ff;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { account } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <ProfileContainer>
          <Header>
            <Title>Access Denied</Title>
            <Subtitle>Please connect your wallet and verify your account to view your profile.</Subtitle>
          </Header>
        </ProfileContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileContainer>
        <BackLink to="/dashboard">
          ← Back to Dashboard
        </BackLink>

        <Header>
          <Title>Your Profile</Title>
          <Subtitle>Manage your account information and voting history</Subtitle>
        </Header>

        <ProfileCard>
          <ProfileHeader>
            <Avatar>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              <AvatarEdit>
                <Edit3 size={16} />
              </AvatarEdit>
            </Avatar>
            
            <ProfileInfo>
              <ProfileName>{user?.name || 'User'}</ProfileName>
              <ProfileEmail>{user?.email || 'No email provided'}</ProfileEmail>
              <StatusBadge verified={user?.isVerified}>
                {user?.isVerified ? (
                  <>
                    <CheckCircle size={16} />
                    Verified Voter
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Pending Verification
                  </>
                )}
              </StatusBadge>
            </ProfileInfo>
            
            <EditButton onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </EditButton>
          </ProfileHeader>

          {isEditing ? (
            <Form>
              <FormGroup>
                <Label>
                  <User size={16} />
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Mail size={16} />
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </CancelButton>
                <SaveButton onClick={handleSave}>
                  <Save size={16} />
                  Save Changes
                </SaveButton>
              </ButtonGroup>
            </Form>
          ) : (
            <InfoSection>
              <SectionTitle>
                <User size={20} />
                Account Information
              </SectionTitle>
              
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Voter ID</InfoLabel>
                  <InfoValue>
                    {user?.voterId || 'Not assigned'}
                    <CopyButton onClick={() => copyToClipboard(user?.voterId || '')}>
                      <Copy size={14} />
                    </CopyButton>
                  </InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Wallet Address</InfoLabel>
                  <InfoValue>
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                    <CopyButton onClick={() => copyToClipboard(account || '')}>
                      <Copy size={14} />
                    </CopyButton>
                  </InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Account Status</InfoLabel>
                  <InfoValue>
                    {user?.isVerified ? 'Verified' : 'Pending Verification'}
                  </InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Voting Weight</InfoLabel>
                  <InfoValue>{user?.weight || '1'} vote</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
          )}
        </ProfileCard>

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <Hash size={24} />
            </StatIcon>
            <StatNumber>{user?.voterId || 'N/A'}</StatNumber>
            <StatLabel>Voter ID</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <Shield size={24} />
            </StatIcon>
            <StatNumber>{user?.isVerified ? 'Yes' : 'No'}</StatNumber>
            <StatLabel>Verified</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <User size={24} />
            </StatIcon>
            <StatNumber>{user?.weight || '1'}</StatNumber>
            <StatLabel>Vote Weight</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <CheckCircle size={24} />
            </StatIcon>
            <StatNumber>{user?.hasVoted ? 'Yes' : 'No'}</StatNumber>
            <StatLabel>Has Voted</StatLabel>
          </StatCard>
        </StatsGrid>
      </ProfileContainer>
    </Container>
  );
};

export default Profile;