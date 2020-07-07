const Web3 = require('web3');

// Variables definition
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551';
const web3 = new Web3('http://localhost:9933');

// Balance call
const balances = async () => {
   const balanceFrom = web3.utils.fromWei(
      await web3.eth.getBalance(addressFrom),
      'ether'
   );
   const balanceTo = await web3.utils.fromWei(
      await web3.eth.getBalance(addressTo),
      'ether'
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH.`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH.`);
};

balances();
