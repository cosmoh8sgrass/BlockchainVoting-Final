const VotingSystem = artifacts.require("VotingSystem");

module.exports = async function(callback) {
  try {
    const votingSystem = await VotingSystem.deployed();
    console.log("Contract Address:", votingSystem.address);
    callback();
  } catch (error) {
    console.error("Error getting contract address:", error);
    callback(error);
  }
};