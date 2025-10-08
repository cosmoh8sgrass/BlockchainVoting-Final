import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { Vote, Shield, BarChart3, Users, CheckCircle, ArrowRight, Star, Globe, Lock } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const PrimaryButton = styled(Link)`
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background: white;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const StatCard = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #10b981;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const SDGSection = styled.section`
  padding: 4rem 2rem;
  background: white;
`;

const SDGContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SDGCard = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 25px rgba(16, 185, 129, 0.2);
`;

const SDGIcon = styled.div`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: #10b981;
`;

const SDGTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const SDGDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const Home = () => {
  const { isConnected } = useWeb3();
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <HeroSection>
        <HeroTitle>
          Secure, Transparent,<br />
          <span style={{ color: '#fbbf24' }}>Blockchain Voting</span>
        </HeroTitle>
        <HeroSubtitle>
          Revolutionizing democracy with tamper-proof, transparent, and verifiable voting technology. 
          Built on Ethereum blockchain for maximum security and trust.
        </HeroSubtitle>
        <CTAButtons>
          {isConnected && isAuthenticated ? (
            <PrimaryButton to="/vote">
              <Vote size={20} />
              Cast Your Vote
              <ArrowRight size={20} />
            </PrimaryButton>
          ) : (
            <PrimaryButton to="/register">
              <Vote size={20} />
              Get Started
              <ArrowRight size={20} />
            </PrimaryButton>
          )}
          <SecondaryButton to="/results">
            <BarChart3 size={20} />
            View Results
          </SecondaryButton>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose BlockVote?</SectionTitle>
          <SectionSubtitle>
            Our blockchain-based voting system ensures complete transparency, security, and verifiability
          </SectionSubtitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Shield size={30} />
              </FeatureIcon>
              <FeatureTitle>Tamper-Proof Security</FeatureTitle>
              <FeatureDescription>
                Votes are stored on the blockchain, making them immutable and impossible to alter or delete.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <BarChart3 size={30} />
              </FeatureIcon>
              <FeatureTitle>Real-Time Transparency</FeatureTitle>
              <FeatureDescription>
                View live election results and verify your vote was counted correctly in real-time.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Users size={30} />
              </FeatureIcon>
              <FeatureTitle>Voter Authentication</FeatureTitle>
              <FeatureDescription>
                Secure voter registration and verification system ensures only eligible voters can participate.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <CheckCircle size={30} />
              </FeatureIcon>
              <FeatureTitle>Verifiable Results</FeatureTitle>
              <FeatureDescription>
                Every vote can be independently verified while maintaining voter privacy and anonymity.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Globe size={30} />
              </FeatureIcon>
              <FeatureTitle>Global Accessibility</FeatureTitle>
              <FeatureDescription>
                Vote from anywhere in the world with just an internet connection and a compatible wallet.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <Lock size={30} />
              </FeatureIcon>
              <FeatureTitle>Privacy Protection</FeatureTitle>
              <FeatureDescription>
                Your vote is encrypted and anonymous while remaining verifiable on the public blockchain.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatsSection>
        <StatsContainer>
          <SectionTitle style={{ color: 'white' }}>Trusted by Millions</SectionTitle>
          <SectionSubtitle style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Join the future of democratic participation
          </SectionSubtitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>1M+</StatNumber>
              <StatLabel>Votes Cast</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>500K+</StatNumber>
              <StatLabel>Registered Voters</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>100+</StatNumber>
              <StatLabel>Elections Conducted</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </StatsSection>

      <SDGSection>
        <SDGContainer>
          <SDGCard>
            <SDGIcon>
              <Globe size={40} />
            </SDGIcon>
            <SDGTitle>Supporting UN SDG 16</SDGTitle>
            <SDGDescription>
              Our platform promotes Peace, Justice and Strong Institutions by ensuring transparent, 
              accountable, and inclusive democratic processes. We believe in building trust in 
              democratic systems through technology.
            </SDGDescription>
          </SDGCard>
        </SDGContainer>
      </SDGSection>
    </Container>
  );
};

export default Home;