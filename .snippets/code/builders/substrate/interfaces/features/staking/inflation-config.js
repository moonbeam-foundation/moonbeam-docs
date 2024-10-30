import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Query inflation configuration
    const inflationConfig = await api.query.parachainStaking.inflationConfig();
    
    // Get current round info for context
    const round = await api.query.parachainStaking.round();
    
    console.log('Current Round:', round.current.toString());
    
    console.log('\nInflation Configuration (Human Readable):');
    const config = inflationConfig.toHuman();
    console.log(JSON.stringify(config, null, 2));

    // Access the nested structure correctly
    const rawConfig = inflationConfig.toJSON();
    
    console.log('\nDetailed Configuration Breakdown:');
    
    // Expected rewards
    console.log('\nExpected Rewards:');
    console.log('Min:', rawConfig.expect.min);
    console.log('Ideal:', rawConfig.expect.ideal);
    console.log('Max:', rawConfig.expect.max);

    // Annual inflation rates (divide by 10^7 to get percentage)
    console.log('\nAnnual Inflation Rates:');
    console.log('Min:', (rawConfig.annual.min / 10_000_000).toFixed(2) + '%');
    console.log('Ideal:', (rawConfig.annual.ideal / 10_000_000).toFixed(2) + '%');
    console.log('Max:', (rawConfig.annual.max / 10_000_000).toFixed(2) + '%');

    // Round inflation rates
    console.log('\nRound Inflation Rates:');
    console.log('Min:', (rawConfig.round.min / 10_000_000).toFixed(4) + '%');
    console.log('Ideal:', (rawConfig.round.ideal / 10_000_000).toFixed(4) + '%');
    console.log('Max:', (rawConfig.round.max / 10_000_000).toFixed(4) + '%');

    // Example calculations for 100 DEV with annual rates
    const exampleStake = 100n * BigInt(10 ** 18); // 100 DEV
    console.log('\nExample Annual Returns for 100 DEV stake:');
    
    // Convert to BigInt for calculations
    const annualMin = BigInt(rawConfig.annual.min) * exampleStake / BigInt(10_000_000) / BigInt(10 ** 18);
    const annualIdeal = BigInt(rawConfig.annual.ideal) * exampleStake / BigInt(10_000_000) / BigInt(10 ** 18);
    const annualMax = BigInt(rawConfig.annual.max) * exampleStake / BigInt(10_000_000) / BigInt(10 ** 18);
    
    console.log('Min:', annualMin.toString(), 'DEV');
    console.log('Ideal:', annualIdeal.toString(), 'DEV');
    console.log('Max:', annualMax.toString(), 'DEV');

    process.exit(0);
  } catch (error) {
    console.error('Error querying inflation configuration:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});