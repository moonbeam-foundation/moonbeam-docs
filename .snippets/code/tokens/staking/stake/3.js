// Simple script to verify your auto-compounding percentage for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you
// want to delegate and replace INSERT_DELEGATOR_ADDRESS with the address used to 
// delegate with
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const delegationAccount = 'INSERT_DELEGATOR_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
const delegation = autoCompoundingDelegations.find(
  (del) => del.delegator == delegationAccount
);

console.log(`${delegation.value}%`);
