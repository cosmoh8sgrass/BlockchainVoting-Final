# BlockVote - Blockchain-Based Voting System

A secure, transparent, and tamper-proof voting system built on Ethereum blockchain technology. This system ensures fair elections in institutions and public sectors with complete transparency and verifiability.

## 🌟 Features

- **Secure Voter Authentication**: Blockchain-based voter registration and verification
- **Immutable Vote Storage**: Votes are stored on the blockchain, making them tamper-proof
- **Real-time Results Dashboard**: Live election results with interactive charts
- **Transparent Process**: All voting activities are publicly verifiable
- **IPFS Integration**: Decentralized storage for candidate images and documents
- **Modern UI/UX**: Professional, responsive design for all devices
- **SDG 16 Alignment**: Promotes Peace, Justice and Strong Institutions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Web3.js & Ethers.js** - Blockchain interaction
- **React Router** - Client-side routing

### Backend
- **Node.js & Express** - Server framework
- **IPFS** - Decentralized file storage
- **Sharp** - Image processing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Blockchain
- **Solidity** - Smart contract language
- **Ethereum** - Blockchain platform
- **Truffle** - Development framework
- **OpenZeppelin** - Security libraries
- **Ganache** - Local blockchain

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet
- Ganache (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain-voting-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   cp contracts/.env.example contracts/.env
   
   # Edit the .env files with your configuration
   ```

4. **Start Ganache**
   - Open Ganache GUI
   - Create a new workspace
   - Note the RPC URL (usually http://localhost:7545)

5. **Deploy smart contracts**
   ```bash
   cd contracts
   npm run deploy
   # Note the deployed contract address
   ```

6. **Update contract address**
   - Copy the deployed contract address
   - Update `REACT_APP_CONTRACT_ADDRESS` in `client/.env`
   - Update `CONTRACT_ADDRESS` in `server/.env`

7. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
blockchain-voting-system/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── contracts/             # Smart contracts
│   ├── contracts/         # Solidity files
│   ├── migrations/        # Deployment scripts
│   └── test/              # Contract tests
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Client (.env)
```env
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_RPC_URL=http://localhost:7545
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
REACT_APP_API_URL=http://localhost:5000/api
```

#### Server (.env)
```env
RPC_URL=http://localhost:7545
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key
IPFS_HOST=ipfs.infura.io
IPFS_PROJECT_ID=your_project_id
IPFS_PROJECT_SECRET=your_project_secret
PORT=5000
NODE_ENV=development
```

#### Contracts (.env)
```env
MNEMONIC=your_mnemonic_phrase
INFURA_PROJECT_ID=your_infura_project_id
```

## 🎯 Usage Guide

### For Voters

1. **Connect Wallet**: Use MetaMask or compatible wallet
2. **Register**: Provide voter ID, name, and email
3. **Wait for Verification**: Admin must verify your account
4. **Vote**: Select candidate and cast your vote
5. **Verify**: Check that your vote was recorded correctly

### For Administrators

1. **Access Admin Panel**: Use admin account credentials
2. **Register Voters**: Add eligible voters to the system
3. **Verify Voters**: Approve voter registrations
4. **Add Candidates**: Create candidate profiles with images
5. **Create Elections**: Set up new voting periods
6. **Monitor Results**: Track real-time election progress

## 🔒 Security Features

- **Smart Contract Security**: OpenZeppelin libraries and best practices
- **Voter Authentication**: Blockchain-based identity verification
- **Vote Privacy**: Anonymous voting with public verification
- **Tamper Prevention**: Immutable blockchain storage
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation
- **Secure File Upload**: IPFS integration with image processing

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm test
```

### Frontend
```bash
cd client
npm test
```

### Backend
```bash
cd server
npm test
```

## 📊 Monitoring

### Health Check
- Backend: `GET /api/health`
- Returns server status and uptime

### Metrics
- Total voters registered
- Total candidates
- Total elections conducted
- Real-time vote counts

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

### Backend (Heroku/Railway)
1. Set up environment variables
2. Deploy the server folder
3. Configure IPFS and blockchain connections

### Smart Contracts (Mainnet)
1. Update network configuration
2. Deploy with Truffle: `truffle migrate --network mainnet`
3. Verify contracts on Etherscan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 SDG Alignment

This project aligns with **UN Sustainable Development Goal 16: Peace, Justice and Strong Institutions** by:

- Promoting transparent and accountable democratic processes
- Building trust in electoral systems through technology
- Ensuring equal participation in democratic processes
- Providing verifiable and tamper-proof voting mechanisms

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Biometric Verification**: Advanced voter authentication
- **Mobile App**: Native mobile application
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Detailed voting statistics
- **National Deployment**: Large-scale implementation
- **Integration APIs**: Third-party system integration

---

**Built with ❤️ for transparent democracy**