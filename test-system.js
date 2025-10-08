#!/usr/bin/env node

/**
 * BlockVote System Integration Test
 * This script tests the complete blockchain voting system
 */

const { ethers } = require('ethers');
const axios = require('axios');

// Configuration
const RPC_URL = 'http://localhost:7545';
const API_URL = 'http://localhost:5000/api';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x...';

// Test data
const testVoter = {
  address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  voterId: 'V001',
  name: 'Test Voter',
  email: 'test@example.com'
};

const testCandidate = {
  name: 'Test Candidate',
  party: 'Test Party',
  description: 'A test candidate for testing purposes',
  imageHash: 'QmTestHash123'
};

const testElection = {
  title: 'Test Election 2024',
  description: 'A test election for system validation',
  startTime: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
  endTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  electionType: 'test'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, details = '') {
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  const statusSymbol = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '⚠';
  
  log(`${statusSymbol} ${testName}`, statusColor);
  if (details) {
    log(`  ${details}`, 'blue');
  }
}

async function testServerHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.status === 200 && response.data.status === 'OK') {
      logTest('Server Health Check', 'PASS', `Uptime: ${response.data.uptime}s`);
      return true;
    } else {
      logTest('Server Health Check', 'FAIL', 'Server not responding correctly');
      return false;
    }
  } catch (error) {
    logTest('Server Health Check', 'FAIL', error.message);
    return false;
  }
}

async function testIPFSConnection() {
  try {
    const response = await axios.get(`${API_URL}/ipfs/node-info`);
    if (response.status === 200 && response.data.success) {
      logTest('IPFS Connection', 'PASS', `Node ID: ${response.data.node.id.substring(0, 10)}...`);
      return true;
    } else {
      logTest('IPFS Connection', 'FAIL', 'IPFS not responding');
      return false;
    }
  } catch (error) {
    logTest('IPFS Connection', 'FAIL', error.message);
    return false;
  }
}

async function testBlockchainConnection() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    logTest('Blockchain Connection', 'PASS', `Network: ${network.name}, Block: ${blockNumber}`);
    return true;
  } catch (error) {
    logTest('Blockchain Connection', 'FAIL', error.message);
    return false;
  }
}

async function testContractDeployment() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    
    if (code && code !== '0x') {
      logTest('Contract Deployment', 'PASS', `Contract deployed at ${CONTRACT_ADDRESS}`);
      return true;
    } else {
      logTest('Contract Deployment', 'FAIL', 'Contract not found at address');
      return false;
    }
  } catch (error) {
    logTest('Contract Deployment', 'FAIL', error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  const endpoints = [
    { path: '/voting/stats', name: 'Voting Stats' },
    { path: '/voting/current-election', name: 'Current Election' },
    { path: '/voting/elections', name: 'All Elections' }
  ];
  
  let passed = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${API_URL}${endpoint.path}`);
      if (response.status === 200 && response.data.success !== false) {
        logTest(`API ${endpoint.name}`, 'PASS');
        passed++;
      } else {
        logTest(`API ${endpoint.name}`, 'FAIL', 'Invalid response');
      }
    } catch (error) {
      logTest(`API ${endpoint.name}`, 'FAIL', error.message);
    }
  }
  
  return passed === endpoints.length;
}

async function testFrontendAccess() {
  try {
    const response = await axios.get('http://localhost:3000');
    if (response.status === 200) {
      logTest('Frontend Access', 'PASS', 'React app is running');
      return true;
    } else {
      logTest('Frontend Access', 'FAIL', 'Frontend not accessible');
      return false;
    }
  } catch (error) {
    logTest('Frontend Access', 'FAIL', error.message);
    return false;
  }
}

async function runAllTests() {
  log('\n🧪 BlockVote System Integration Tests', 'bright');
  log('=====================================\n', 'bright');
  
  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'IPFS Connection', fn: testIPFSConnection },
    { name: 'Blockchain Connection', fn: testBlockchainConnection },
    { name: 'Contract Deployment', fn: testContractDeployment },
    { name: 'API Endpoints', fn: testAPIEndpoints },
    { name: 'Frontend Access', fn: testFrontendAccess }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) passed++;
  }
  
  log('\n📊 Test Results', 'bright');
  log('===============', 'bright');
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! The system is ready to use.', 'green');
    log('\n📋 System Status:', 'bright');
    log('• Frontend: http://localhost:3000', 'cyan');
    log('• Backend API: http://localhost:5000/api', 'cyan');
    log('• Blockchain: http://localhost:7545', 'cyan');
    log('• IPFS Gateway: http://localhost:8080', 'cyan');
  } else {
    log('\n❌ Some tests failed. Please check the configuration.', 'red');
    log('\n🔧 Troubleshooting:', 'bright');
    log('1. Make sure all services are running', 'yellow');
    log('2. Check environment variables', 'yellow');
    log('3. Verify contract deployment', 'yellow');
    log('4. Check network connectivity', 'yellow');
  }
  
  return passed === total;
}

// Main execution
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`\n💥 Test execution failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testServerHealth,
  testIPFSConnection,
  testBlockchainConnection,
  testContractDeployment,
  testAPIEndpoints,
  testFrontendAccess
};