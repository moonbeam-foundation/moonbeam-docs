// scripts/deploy.js
const hre = require('hardhat');
require('@nomicfoundation/hardhat-ethers');

async function main() {
  // Get ERC-20 Contract
  const MyTok = await hre.ethers.getContractFactory('MyTok');

  // Deploy the contract providing a gas price and gas limit
  const myTok = await MyTok.deploy();

  // Wait for the Deployment
  await myTok.waitForDeployment();

  console.log(`Contract deployed to ${myTok.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});