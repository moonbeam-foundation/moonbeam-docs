const candidate = '0x12E7BCCA9b1B15f33585b5fc898B967149BDb9a5';
const amount = '1000000000000000000';
const autoCompound = 100;

// Fetch your existing number of delegations
let delegatorDelegationCount;
// Use the account you're delegating with
const delegatorInfo = await api.query.parachainStaking.delegatorState(
  'INSERT_ACCOUNT'
);

if (delegatorInfo.toHuman()) {
  delegatorDelegationCount = delegatorInfo.toHuman()['delegations'].length;
} else {
  delegatorDelegationCount = 0;
}

// Fetch the collators existing delegations
const collatorInfo = await api.query.parachainStaking.candidateInfo(candidate);
const candidateDelegationCount = collatorInfo.toHuman()['delegationCount'];

// Fetch the collators number of existing auto-compounding delegations
const autoCompoundingDelegationsInfo =
  await api.query.parachainStaking.autoCompoundingDelegations(candidate);
const candidateAutoCompoundingDelegationCount =
  autoCompoundingDelegationsInfo.length;

// Craft extrinsic
const tx = api.tx.parachainStaking.delegateWithAutoCompound(
  candidate,
  amount,
  autoCompound,
  candidateDelegationCount,
  candidateAutoCompoundingDelegationCount,
  delegatorDelegationCount
);

// Get SCALE Encoded Call Data
const encodedCall = tx.method.toHex();
console.log(`Encoded Call Data: ${encodedCall}`);
