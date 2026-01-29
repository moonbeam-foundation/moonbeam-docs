const testAccount = api.createType(
  'AccountId20',
  '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
);
const callData =
  '0x030088bce0b038effa09e58fe6d24fde4b5af21aa79813000064a7b3b6e00d';
const callDataU8a = hexToU8a(callData);

const result = await api.call.dryRunApi.dryRunCall(
  { system: { Signed: testAccount } },
  callDataU8a
);
