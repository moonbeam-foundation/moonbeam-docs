const ethers = require('ethers');

// Variables definition
const addressFrom = 'ADDRESSFROM';
const addressTo = 'ADDRESSTO';
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);

// Balance call
const balances = async () => {
   const balanceFrom = ethers.utils.formatEther(
      await provider.getBalance(addressFrom)
   );

   const balanceTo = ethers.utils.formatEther(
      await provider.getBalance(addressTo)
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();
