import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get total staked amount
    const totalStaked = await api.query.parachainStaking.total();

    console.log('Total Staked:');
    console.log('Amount:', totalStaked.toString(), 'Wei');
    console.log('Amount in DEV:', (BigInt(totalStaked) / BigInt(10 ** 18)).toString(), 'DEV');

    // Get some context information
    const selectedCandidates = await api.query.parachainStaking.selectedCandidates();
    console.log('\nNetwork Context:');
    console.log('Number of Selected Collators:', selectedCandidates.length);

    // Get total issuance for percentage calculation
    const totalIssuance = await api.query.balances.totalIssuance();
    const percentageStaked = (BigInt(totalStaked) * BigInt(100)) / BigInt(totalIssuance);
    console.log('\nStaking Metrics:');
    console.log('Total Issuance:', (BigInt(totalIssuance) / BigInt(10 ** 18)).toString(), 'DEV');
    console.log('Percentage of Total Supply Staked:', percentageStaked.toString() + '%');

    // Calculate average stake per collator
    const averageStakePerCollator = BigInt(totalStaked) / BigInt(selectedCandidates.length);
    console.log('Average Stake per Collator:', (averageStakePerCollator / BigInt(10 ** 18)).toString(), 'DEV');

    process.exit(0);
  } catch (error) {
    console.error('Error querying total staked:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});