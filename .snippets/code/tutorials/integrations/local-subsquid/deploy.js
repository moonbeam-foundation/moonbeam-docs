// scripts/deploy.js
const hre = require('hardhat');
require('@nomicfoundation/hardhat-ethers');

async function main() {
  // Get ERC-20 contract
  const MyTok = await hre.ethers.getContractFactory('MyTok');

  // Deploy the contract
  const myTok = await MyTok.deploy();

  // Wait for the deployment
  await myTok.waitForDeployment();

  console.log(`Contract deployed to ${myTok.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});