// Simple script to get the number of auto-compounding delegations for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you want to delegate.
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
console.log(autoCompoundingDelegations.toHuman().length);
