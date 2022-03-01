// 1. Add the Ethers provider logic here:
// {...}

// 2. Create address variables
const addressFrom = 'ADDRESS-FROM-HERE';
const addressTo = 'ADDRESS-TO-HERE';

// 3. Create balances function
const balances = async () => {
  // 4. Fetch balances
  const balanceFrom = ethers.utils.formatEther(await provider.getBalance(addressFrom));
  const balanceTo = ethers.utils.formatEther(await provider.getBalance(addressTo));

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

// 5. Call the balances function
balances();
