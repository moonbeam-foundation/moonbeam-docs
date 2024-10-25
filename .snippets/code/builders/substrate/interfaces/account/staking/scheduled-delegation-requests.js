import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Example collator address
    const collatorAddress = '0x89c14eF3D6267032F94c4dEbFb9361D7E2d5C13d';

    // Get current round information for context
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();

    console.log('Query Parameters:');
    console.log('Collator address:', collatorAddress);
    console.log('Current round:', currentRound);

    // Get collator info for context
    const collatorInfo = await api.query.parachainStaking.candidateInfo(collatorAddress);
    if (collatorInfo.isSome) {
      const info = collatorInfo.unwrap();
      console.log('\nCollator Information:');
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Current Bond:', info.bond.toString(), 'Wei');
      console.log('Current Bond in DEV:', (BigInt(info.bond) / BigInt(10 ** 18)).toString(), 'DEV');
    }

    // Query scheduled delegation requests
    const requests = await api.query.parachainStaking.delegationScheduledRequests(collatorAddress);

    console.log('\nScheduled Delegation Requests:');
    if (requests.length > 0) {
        console.log('Total requests:', requests.length);
        
        // Process each request
        requests.forEach((request, index) => {
            console.log(`\nRequest #${index + 1}:`);
            const { delegator, whenExecutable, action } = request;
            console.log('Delegator:', delegator.toString());
            console.log('Executable at round:', whenExecutable.toString());
            console.log('Rounds until executable:', whenExecutable.toNumber() - currentRound);

            // Handle different types of actions
            if (action.isDecrease) {
                const amount = action.asDecrease;
                console.log('Action: Decrease');
                console.log('Amount:', amount.toString(), 'Wei');
                console.log('Amount in DEV:', (BigInt(amount) / BigInt(10 ** 18)).toString(), 'DEV');
            } else if (action.isRevoke) {
                const amount = action.asRevoke;
                console.log('Action: Revoke');
                console.log('Amount:', amount.toString(), 'Wei');
                console.log('Amount in DEV:', (BigInt(amount) / BigInt(10 ** 18)).toString(), 'DEV');
            }
        });

        // Calculate some statistics
        let totalDecreaseAmount = BigInt(0);
        let totalRevokeAmount = BigInt(0);
        let decreaseCount = 0;
        let revokeCount = 0;

        requests.forEach(request => {
            if (request.action.isDecrease) {
                totalDecreaseAmount += BigInt(request.action.asDecrease);
                decreaseCount++;
            } else if (request.action.isRevoke) {
                totalRevokeAmount += BigInt(request.action.asRevoke);
                revokeCount++;
            }
        });

        console.log('\nRequest Statistics:');
        console.log('Decrease requests:', decreaseCount);
        if (decreaseCount > 0) {
            console.log('Total decrease amount:', totalDecreaseAmount.toString(), 'Wei');
            console.log('Total decrease amount in DEV:', (totalDecreaseAmount / BigInt(10 ** 18)).toString(), 'DEV');
            console.log('Average decrease amount in DEV:', (totalDecreaseAmount / BigInt(decreaseCount) / BigInt(10 ** 18)).toString(), 'DEV');
        }
        
        console.log('Revoke requests:', revokeCount);
        if (revokeCount > 0) {
            console.log('Total revoke amount:', totalRevokeAmount.toString(), 'Wei');
            console.log('Total revoke amount in DEV:', (totalRevokeAmount / BigInt(10 ** 18)).toString(), 'DEV');
            console.log('Average revoke amount in DEV:', (totalRevokeAmount / BigInt(revokeCount) / BigInt(10 ** 18)).toString(), 'DEV');
        }

        // Show impact on collator's delegation
        const totalImpact = totalDecreaseAmount + totalRevokeAmount;
        console.log('\nTotal Impact:');
        console.log('Total amount to be removed:', totalImpact.toString(), 'Wei');
        console.log('Total amount to be removed in DEV:', (totalImpact / BigInt(10 ** 18)).toString(), 'DEV');
    } else {
        console.log('No scheduled delegation requests found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying delegation requests:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});