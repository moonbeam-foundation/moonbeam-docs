const { ethers } = require('ethers');

const provider = new ethers.WebSocketProvider(
  'wss://wss.api.moonbase.moonbeam.network'
);

const tokenAddress = 'INSERT_CONTRACT_ADDRESS';
const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];
const contract = new ethers.Contract(tokenAddress, abi, provider);

// Listen for Transfer events where the "from" address matches either entry below
const fromAddresses = [
  '0x44236223aB4291b93EEd10E4B511B37a398DEE55',
  '0x8841701Dba3639B254D9CEe712E49D188A1e941e',
];

const filter = contract.filters.Transfer(fromAddresses, null);

const main = async () => {
  console.log('🕔 Subscription set up. Waiting for new logs');

  contract.on(filter, (from, to, value, event) => {
    console.log({
      from,
      to,
      value: value.toString(),
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
    });
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
