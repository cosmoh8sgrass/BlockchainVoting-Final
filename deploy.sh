#!/bin/bash

# BlockVote Deployment Script
# This script deploys the complete blockchain voting system

set -e

echo "🚀 Starting BlockVote Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v truffle &> /dev/null; then
        print_warning "Truffle is not installed globally. Installing locally..."
    fi
    
    print_success "Dependencies check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    # Install contract dependencies
    cd contracts
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Created .env file. Please update with your configuration."
    fi
    
    if [ ! -f client/.env ]; then
        cp client/.env.example client/.env
        print_warning "Created client/.env file. Please update with your configuration."
    fi
    
    if [ ! -f server/.env ]; then
        cp server/.env.example server/.env
        print_warning "Created server/.env file. Please update with your configuration."
    fi
    
    if [ ! -f contracts/.env ]; then
        cp contracts/.env.example contracts/.env
        print_warning "Created contracts/.env file. Please update with your configuration."
    fi
    
    print_success "Environment files created"
}

# Deploy smart contracts
deploy_contracts() {
    print_status "Deploying smart contracts..."
    
    cd contracts
    
    # Compile contracts
    print_status "Compiling contracts..."
    npx truffle compile
    
    # Deploy contracts
    print_status "Deploying contracts..."
    npx truffle migrate --reset
    
    # Get contract address
    CONTRACT_ADDRESS=$(npx truffle exec --network development scripts/get-contract-address.js | grep "Contract Address:" | cut -d' ' -f3)
    
    if [ -z "$CONTRACT_ADDRESS" ]; then
        print_error "Failed to get contract address"
        exit 1
    fi
    
    print_success "Contracts deployed at: $CONTRACT_ADDRESS"
    
    # Update environment files with contract address
    cd ..
    sed -i "s/REACT_APP_CONTRACT_ADDRESS=.*/REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" client/.env
    sed -i "s/CONTRACT_ADDRESS=.*/CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" server/.env
    
    print_success "Contract address updated in environment files"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Test contracts
    cd contracts
    npx truffle test
    cd ..
    
    print_success "All tests passed"
}

# Build applications
build_applications() {
    print_status "Building applications..."
    
    # Build client
    cd client
    npm run build
    cd ..
    
    print_success "Applications built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start server in background
    cd server
    npm start &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 5
    
    # Start client
    cd client
    npm start &
    CLIENT_PID=$!
    cd ..
    
    print_success "Services started"
    print_status "Server PID: $SERVER_PID"
    print_status "Client PID: $CLIENT_PID"
    print_status "Server: http://localhost:5000"
    print_status "Client: http://localhost:3000"
}

# Main deployment function
main() {
    echo "🎯 BlockVote - Blockchain Voting System Deployment"
    echo "=================================================="
    
    check_dependencies
    install_dependencies
    setup_environment
    
    # Ask user if they want to continue with deployment
    read -p "Do you want to continue with contract deployment? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_contracts
        run_tests
        build_applications
        
        # Ask user if they want to start services
        read -p "Do you want to start the services now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_services
        fi
    fi
    
    print_success "Deployment completed!"
    echo
    echo "📋 Next Steps:"
    echo "1. Update environment files with your configuration"
    echo "2. Start Ganache for local blockchain development"
    echo "3. Run 'npm run dev' to start all services"
    echo "4. Access the application at http://localhost:3000"
    echo
    echo "📚 Documentation: README.md"
    echo "🐛 Issues: Create an issue in the repository"
}

# Run main function
main "$@"