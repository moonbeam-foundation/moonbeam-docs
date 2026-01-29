// Simple script to get your number of existing delegations.
// Remember to replace INSERT_YOUR_ADDRESS with your delegator address.
const yourDelegatorAccount = 'INSERT_YOUR_ADDRESS'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(yourDelegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(delegatorInfo.toHuman()['delegations'].length);
} else {
  console.log(0);
}
