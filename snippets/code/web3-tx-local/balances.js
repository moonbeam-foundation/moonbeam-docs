// 1. Add the Web3 provider logic here:
// {...}

// 2. Create address variables
const addressFrom = 'ADDRESS-FROM-HERE';
const addressTo = 'ADDRESS-TO-HERE';

// 3. Create balances function
const balances = async () => {
  // 4. Fetch balance info
  const balanceFrom = web3.utils.fromWei(await web3.eth.getBalance(addressFrom), 'ether');
  const balanceTo = web3.utils.fromWei(await web3.eth.getBalance(addressTo), 'ether');

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

// 5. Call balances function
balances();
