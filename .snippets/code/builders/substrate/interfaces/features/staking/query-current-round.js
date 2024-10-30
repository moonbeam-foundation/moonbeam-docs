import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Query round information
    const roundInfo = await api.query.parachainStaking.round();
    
    console.log('Round Information:');
    console.log('Current Round:', roundInfo.current.toString());
    console.log('First Block of Round:', roundInfo.first.toString());
    console.log('Round Length:', roundInfo.length.toString());

    // Calculate some additional useful information
    const currentBlock = await api.rpc.chain.getBlock();
    const currentBlockNumber = currentBlock.block.header.number.toNumber();
    
    // Calculate blocks remaining in current round
    const blocksIntoRound = currentBlockNumber - roundInfo.first.toNumber();
    const blocksRemaining = roundInfo.length.toNumber() - blocksIntoRound;
    
    console.log('\nAdditional Information:');
    console.log('Current Block:', currentBlockNumber);
    console.log('Blocks Into Current Round:', blocksIntoRound);
    console.log('Blocks Remaining in Round:', blocksRemaining);

    process.exit(0);
  } catch (error) {
    console.error('Error querying round information:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});