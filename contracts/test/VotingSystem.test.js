const VotingSystem = artifacts.require("VotingSystem");
const { expect } = require("chai");

contract("VotingSystem", (accounts) => {
  let votingSystem;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const candidate1 = "Alice Johnson";
  const candidate2 = "Bob Smith";
  const party1 = "Progressive Party";
  const party2 = "Conservative Party";

  beforeEach(async () => {
    votingSystem = await VotingSystem.new({ from: owner });
  });

  describe("Voter Registration", () => {
    it("should register a new voter", async () => {
      const voterId = "V001";
      const name = "John Doe";
      const email = "john@example.com";

      await votingSystem.registerVoter(voter1, voterId, name, email, { from: owner });

      const voterInfo = await votingSystem.getVoterInfo(voter1);
      expect(voterInfo.isRegistered).to.be.true;
      expect(voterInfo.voterId).to.equal(voterId);
      expect(voterInfo.name).to.equal(name);
      expect(voterInfo.email).to.equal(email);
    });

    it("should not allow duplicate voter registration", async () => {
      const voterId = "V001";
      const name = "John Doe";
      const email = "john@example.com";

      await votingSystem.registerVoter(voter1, voterId, name, email, { from: owner });

      await expect(
        votingSystem.registerVoter(voter1, "V002", "Jane Doe", "jane@example.com", { from: owner })
      ).to.be.revertedWith("Voter already registered");
    });

    it("should only allow owner to register voters", async () => {
      const voterId = "V001";
      const name = "John Doe";
      const email = "john@example.com";

      await expect(
        votingSystem.registerVoter(voter1, voterId, name, email, { from: voter1 })
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Voter Verification", () => {
    beforeEach(async () => {
      await votingSystem.registerVoter(voter1, "V001", "John Doe", "john@example.com", { from: owner });
    });

    it("should verify a voter", async () => {
      await votingSystem.verifyVoter(voter1, true, { from: owner });

      const voterInfo = await votingSystem.getVoterInfo(voter1);
      expect(voterInfo.isVerified).to.be.true;
    });

    it("should unverify a voter", async () => {
      await votingSystem.verifyVoter(voter1, true, { from: owner });
      await votingSystem.verifyVoter(voter1, false, { from: owner });

      const voterInfo = await votingSystem.getVoterInfo(voter1);
      expect(voterInfo.isVerified).to.be.false;
    });
  });

  describe("Candidate Management", () => {
    it("should add a new candidate", async () => {
      const description = "Experienced leader";
      const imageHash = "QmHash123";

      await votingSystem.addCandidate(candidate1, party1, description, imageHash, { from: owner });

      const candidateInfo = await votingSystem.getCandidateInfo(1);
      expect(candidateInfo.name).to.equal(candidate1);
      expect(candidateInfo.party).to.equal(party1);
      expect(candidateInfo.description).to.equal(description);
      expect(candidateInfo.imageHash).to.equal(imageHash);
      expect(candidateInfo.isActive).to.be.true;
    });

    it("should increment candidate count", async () => {
      const initialCount = await votingSystem.totalCandidates();
      
      await votingSystem.addCandidate(candidate1, party1, "Description", "Hash", { from: owner });
      
      const newCount = await votingSystem.totalCandidates();
      expect(newCount.toNumber()).to.equal(initialCount.toNumber() + 1);
    });
  });

  describe("Election Management", () => {
    beforeEach(async () => {
      // Add candidates
      await votingSystem.addCandidate(candidate1, party1, "Description 1", "Hash1", { from: owner });
      await votingSystem.addCandidate(candidate2, party2, "Description 2", "Hash2", { from: owner });
    });

    it("should create a new election", async () => {
      const title = "Presidential Election 2024";
      const description = "Annual presidential election";
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const endTime = startTime + 86400; // 24 hours later
      const electionType = "presidential";
      const candidateIds = [1, 2];

      await votingSystem.createElection(
        title,
        description,
        startTime,
        endTime,
        electionType,
        candidateIds,
        { from: owner }
      );

      const electionInfo = await votingSystem.getElectionInfo(1);
      expect(electionInfo.title).to.equal(title);
      expect(electionInfo.description).to.equal(description);
      expect(electionInfo.electionType).to.equal(electionType);
      expect(electionInfo.isActive).to.be.true;
    });

    it("should not allow invalid time range", async () => {
      const title = "Invalid Election";
      const description = "Test election";
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const endTime = startTime - 1800; // End before start
      const electionType = "test";
      const candidateIds = [1];

      await expect(
        votingSystem.createElection(
          title,
          description,
          startTime,
          endTime,
          electionType,
          candidateIds,
          { from: owner }
        )
      ).to.be.revertedWith("Invalid time range");
    });
  });

  describe("Voting Process", () => {
    let electionId;

    beforeEach(async () => {
      // Register and verify voters
      await votingSystem.registerVoter(voter1, "V001", "John Doe", "john@example.com", { from: owner });
      await votingSystem.registerVoter(voter2, "V002", "Jane Smith", "jane@example.com", { from: owner });
      await votingSystem.verifyVoter(voter1, true, { from: owner });
      await votingSystem.verifyVoter(voter2, true, { from: owner });

      // Add candidates
      await votingSystem.addCandidate(candidate1, party1, "Description 1", "Hash1", { from: owner });
      await votingSystem.addCandidate(candidate2, party2, "Description 2", "Hash2", { from: owner });

      // Create election
      const startTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
      const endTime = startTime + 3600; // 1 hour later
      const candidateIds = [1, 2];

      await votingSystem.createElection(
        "Test Election",
        "Test election description",
        startTime,
        endTime,
        "test",
        candidateIds,
        { from: owner }
      );

      electionId = 1;
    });

    it("should allow verified voters to vote", async () => {
      // Wait for election to start
      await new Promise(resolve => setTimeout(resolve, 65000));

      await votingSystem.castVote(electionId, 1, { from: voter1 });

      const candidateInfo = await votingSystem.getCandidateInfo(1);
      expect(candidateInfo.voteCount.toNumber()).to.equal(1);

      const hasVoted = await votingSystem.hasVotedInSpecificElection(voter1, electionId);
      expect(hasVoted).to.be.true;
    });

    it("should not allow unverified voters to vote", async () => {
      // Create unverified voter
      await votingSystem.registerVoter(accounts[3], "V003", "Unverified", "unverified@example.com", { from: owner });

      await expect(
        votingSystem.castVote(electionId, 1, { from: accounts[3] })
      ).to.be.revertedWith("Voter not verified");
    });

    it("should not allow double voting", async () => {
      // Wait for election to start
      await new Promise(resolve => setTimeout(resolve, 65000));

      await votingSystem.castVote(electionId, 1, { from: voter1 });

      await expect(
        votingSystem.castVote(electionId, 2, { from: voter1 })
      ).to.be.revertedWith("Already voted in this election");
    });

    it("should not allow voting for invalid candidate", async () => {
      // Wait for election to start
      await new Promise(resolve => setTimeout(resolve, 65000));

      await expect(
        votingSystem.castVote(electionId, 999, { from: voter1 })
      ).to.be.revertedWith("Invalid candidate");
    });
  });

  describe("Results and Statistics", () => {
    it("should return correct contract statistics", async () => {
      const stats = await votingSystem.getContractStats();
      
      expect(stats._totalVoters.toNumber()).to.equal(0);
      expect(stats._totalCandidates.toNumber()).to.equal(0);
      expect(stats._totalElections.toNumber()).to.equal(0);
      expect(stats._currentElectionId.toNumber()).to.equal(0);
    });

    it("should return election results", async () => {
      // Setup election with votes
      await votingSystem.registerVoter(voter1, "V001", "John Doe", "john@example.com", { from: owner });
      await votingSystem.verifyVoter(voter1, true, { from: owner });
      await votingSystem.addCandidate(candidate1, party1, "Description 1", "Hash1", { from: owner });
      await votingSystem.addCandidate(candidate2, party2, "Description 2", "Hash2", { from: owner });

      const startTime = Math.floor(Date.now() / 1000) + 60;
      const endTime = startTime + 3600;
      const candidateIds = [1, 2];

      await votingSystem.createElection(
        "Test Election",
        "Test election description",
        startTime,
        endTime,
        "test",
        candidateIds,
        { from: owner }
      );

      // Wait and vote
      await new Promise(resolve => setTimeout(resolve, 65000));
      await votingSystem.castVote(1, 1, { from: voter1 });

      const results = await votingSystem.getElectionResults(1);
      expect(results.candidateIds.length).to.equal(2);
      expect(results.voteCounts[0].toNumber()).to.equal(1);
      expect(results.voteCounts[1].toNumber()).to.equal(0);
    });
  });
});