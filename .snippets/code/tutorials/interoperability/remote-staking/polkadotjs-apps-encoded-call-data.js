const candidate = '0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D';
const amount = '1000000000000000000';
  
// Fetch the your existing number of delegations and the collators existing delegations
let delegatorDelegationCount;
const delegatorInfo = await api.query.parachainStaking.delegatorState('YOUR-ACCOUNT-HERE');

if (delegatorInfo.toHuman()) {
  delegatorDelegationCount = delegatorInfo.toHuman()['delegations'].length;
} else {
  delegatorDelegationCount = 0;
}

const collatorInfo = await api.query.parachainStaking.candidateInfo(candidate);
const candidateDelegationCount = collatorInfo.toHuman()['delegationCount'];
const tx = api.tx.parachainStaking.delegate(candidate, amount, candidateDelegationCount, delegatorDelegationCount);
  
// Get SCALE Encoded Call Data
const encodedCall = tx.method.toHex();
console.log(`Encoded Call Data: ${encodedCall}`);