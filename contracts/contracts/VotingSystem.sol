// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title VotingSystem
 * @dev A secure, transparent, and tamper-proof voting system using blockchain technology
 * @author Blockchain Voting Team
 */
contract VotingSystem is Ownable, ReentrancyGuard, Pausable {
    
    // Structs
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 weight;
        address voterAddress;
        string voterId;
        string name;
        string email;
        bool isVerified;
    }
    
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string description;
        uint256 voteCount;
        bool isActive;
        string imageHash; // IPFS hash for candidate image
    }
    
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVoters;
        uint256 totalVotes;
        string electionType; // "presidential", "parliamentary", "local", etc.
    }
    
    // State Variables
    mapping(address => Voter) public voters;
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => Election) public elections;
    mapping(address => mapping(uint256 => bool)) public hasVotedInElection;
    mapping(uint256 => uint256[]) public electionCandidates;
    
    uint256 public totalVoters;
    uint256 public totalCandidates;
    uint256 public totalElections;
    uint256 public currentElectionId;
    
    // Events
    event VoterRegistered(address indexed voterAddress, string voterId, string name);
    event VoterVerified(address indexed voterAddress, bool verified);
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event VoteCast(address indexed voter, uint256 indexed electionId, uint256 indexed candidateId);
    event ElectionStatusChanged(uint256 indexed electionId, bool isActive);
    event ResultsComputed(uint256 indexed electionId, uint256 totalVotes);
    
    // Modifiers
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        _;
    }
    
    modifier onlyVerifiedVoter() {
        require(voters[msg.sender].isVerified, "Voter not verified");
        _;
    }
    
    modifier validElection(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= totalElections, "Invalid election ID");
        require(elections[_electionId].isActive, "Election not active");
        _;
    }
    
    modifier electionInProgress(uint256 _electionId) {
        require(
            block.timestamp >= elections[_electionId].startTime && 
            block.timestamp <= elections[_electionId].endTime,
            "Election not in progress"
        );
        _;
    }
    
    constructor() {
        totalVoters = 0;
        totalCandidates = 0;
        totalElections = 0;
        currentElectionId = 0;
    }
    
    /**
     * @dev Register a new voter
     * @param _voterAddress Address of the voter
     * @param _voterId Unique voter ID
     * @param _name Voter's name
     * @param _email Voter's email
     */
    function registerVoter(
        address _voterAddress,
        string memory _voterId,
        string memory _name,
        string memory _email
    ) external onlyOwner {
        require(!voters[_voterAddress].isRegistered, "Voter already registered");
        require(_voterAddress != address(0), "Invalid voter address");
        
        voters[_voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            weight: 1,
            voterAddress: _voterAddress,
            voterId: _voterId,
            name: _name,
            email: _email,
            isVerified: false
        });
        
        totalVoters++;
        emit VoterRegistered(_voterAddress, _voterId, _name);
    }
    
    /**
     * @dev Verify a voter (admin function)
     * @param _voterAddress Address of the voter to verify
     * @param _verified Verification status
     */
    function verifyVoter(address _voterAddress, bool _verified) external onlyOwner {
        require(voters[_voterAddress].isRegistered, "Voter not registered");
        voters[_voterAddress].isVerified = _verified;
        emit VoterVerified(_voterAddress, _verified);
    }
    
    /**
     * @dev Add a new candidate
     * @param _name Candidate's name
     * @param _party Candidate's party
     * @param _description Candidate's description
     * @param _imageHash IPFS hash for candidate image
     */
    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _description,
        string memory _imageHash
    ) external onlyOwner {
        totalCandidates++;
        candidates[totalCandidates] = Candidate({
            id: totalCandidates,
            name: _name,
            party: _party,
            description: _description,
            voteCount: 0,
            isActive: true,
            imageHash: _imageHash
        });
        
        emit CandidateAdded(totalCandidates, _name, _party);
    }
    
    /**
     * @dev Create a new election
     * @param _title Election title
     * @param _description Election description
     * @param _startTime Election start time
     * @param _endTime Election end time
     * @param _electionType Type of election
     * @param _candidateIds Array of candidate IDs for this election
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string memory _electionType,
        uint256[] memory _candidateIds
    ) external onlyOwner {
        require(_startTime < _endTime, "Invalid time range");
        require(_candidateIds.length > 0, "No candidates provided");
        
        totalElections++;
        elections[totalElections] = Election({
            id: totalElections,
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            isActive: true,
            totalVoters: totalVoters,
            totalVotes: 0,
            electionType: _electionType
        });
        
        // Add candidates to election
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            require(candidates[_candidateIds[i]].isActive, "Invalid candidate");
            electionCandidates[totalElections].push(_candidateIds[i]);
        }
        
        currentElectionId = totalElections;
        emit ElectionCreated(totalElections, _title, _startTime, _endTime);
    }
    
    /**
     * @dev Cast a vote
     * @param _electionId ID of the election
     * @param _candidateId ID of the candidate
     */
    function castVote(uint256 _electionId, uint256 _candidateId) 
        external 
        onlyRegisteredVoter 
        onlyVerifiedVoter 
        validElection(_electionId) 
        electionInProgress(_electionId) 
        nonReentrant 
    {
        require(!hasVotedInElection[msg.sender][_electionId], "Already voted in this election");
        require(candidates[_candidateId].isActive, "Invalid candidate");
        
        // Verify candidate is in this election
        bool candidateInElection = false;
        for (uint256 i = 0; i < electionCandidates[_electionId].length; i++) {
            if (electionCandidates[_electionId][i] == _candidateId) {
                candidateInElection = true;
                break;
            }
        }
        require(candidateInElection, "Candidate not in this election");
        
        // Cast vote
        candidates[_candidateId].voteCount += voters[msg.sender].weight;
        hasVotedInElection[msg.sender][_electionId] = true;
        elections[_electionId].totalVotes += voters[msg.sender].weight;
        voters[msg.sender].hasVoted = true;
        
        emit VoteCast(msg.sender, _electionId, _candidateId);
    }
    
    /**
     * @dev Get election results
     * @param _electionId ID of the election
     * @return candidateIds Array of candidate IDs
     * @return voteCounts Array of vote counts
     */
    function getElectionResults(uint256 _electionId) 
        external 
        view 
        validElection(_electionId) 
        returns (uint256[] memory candidateIds, uint256[] memory voteCounts) 
    {
        uint256[] memory candidateList = electionCandidates[_electionId];
        candidateIds = new uint256[](candidateList.length);
        voteCounts = new uint256[](candidateList.length);
        
        for (uint256 i = 0; i < candidateList.length; i++) {
            candidateIds[i] = candidateList[i];
            voteCounts[i] = candidates[candidateList[i]].voteCount;
        }
        
        return (candidateIds, voteCounts);
    }
    
    /**
     * @dev Get voter information
     * @param _voterAddress Address of the voter
     * @return Voter struct
     */
    function getVoterInfo(address _voterAddress) external view returns (Voter memory) {
        return voters[_voterAddress];
    }
    
    /**
     * @dev Get candidate information
     * @param _candidateId ID of the candidate
     * @return Candidate struct
     */
    function getCandidateInfo(uint256 _candidateId) external view returns (Candidate memory) {
        return candidates[_candidateId];
    }
    
    /**
     * @dev Get election information
     * @param _electionId ID of the election
     * @return Election struct
     */
    function getElectionInfo(uint256 _electionId) external view returns (Election memory) {
        return elections[_electionId];
    }
    
    /**
     * @dev Get all candidates for an election
     * @param _electionId ID of the election
     * @return Array of candidate IDs
     */
    function getElectionCandidates(uint256 _electionId) external view returns (uint256[] memory) {
        return electionCandidates[_electionId];
    }
    
    /**
     * @dev Check if voter has voted in specific election
     * @param _voterAddress Address of the voter
     * @param _electionId ID of the election
     * @return Boolean indicating if voted
     */
    function hasVotedInSpecificElection(address _voterAddress, uint256 _electionId) 
        external 
        view 
        returns (bool) 
    {
        return hasVotedInElection[_voterAddress][_electionId];
    }
    
    /**
     * @dev End an election (admin function)
     * @param _electionId ID of the election to end
     */
    function endElection(uint256 _electionId) external onlyOwner validElection(_electionId) {
        elections[_electionId].isActive = false;
        emit ElectionStatusChanged(_electionId, false);
        emit ResultsComputed(_electionId, elections[_electionId].totalVotes);
    }
    
    /**
     * @dev Pause the contract in case of emergency
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract statistics
     * @return _totalVoters Total number of registered voters
     * @return _totalCandidates Total number of candidates
     * @return _totalElections Total number of elections
     * @return _currentElectionId Current active election ID
     */
    function getContractStats() external view returns (
        uint256 _totalVoters,
        uint256 _totalCandidates,
        uint256 _totalElections,
        uint256 _currentElectionId
    ) {
        return (totalVoters, totalCandidates, totalElections, currentElectionId);
    }
}