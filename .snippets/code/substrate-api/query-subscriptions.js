import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve the chain name
  const chain = await api.rpc.system.chain();

  // Subscribe to the new headers
  await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    console.log(
      `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
    );
  });

  // Define wallet address
  const addr = 'INSERT_ADDRESS';

  // Subscribe to balance changes for a specified account
  await api.query.system.account(addr, ({ nonce, data: balance }) => {
    console.log(
      `free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
    );

    // Handle API disconnect here if needed
  });
};

main();
