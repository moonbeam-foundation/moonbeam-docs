const { ethers } = require('ethers');

const provider = new ethers.WebSocketProvider(
  'wss://wss.api.moonbase.moonbeam.network'
);

const tokenAddress = 'INSERT_CONTRACT_ADDRESS';
const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];
const iface = new ethers.Interface(abi);
const transferTopic = ethers.id('Transfer(address,address,uint256)');

const filter = {
  address: tokenAddress,
  topics: [transferTopic],
};

const main = async () => {
  console.log('🕔 Subscription set up. Waiting for new logs');

  provider.on(filter, (log) => {
    const parsed = iface.parseLog(log);

    console.log({
      from: parsed.args.from,
      to: parsed.args.to,
      value: parsed.args.value.toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    });
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
