const testAccount = api.createType(
  'AccountId20',
  '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
);
const callData =
  '0x1c030408000400010403001300008a5d784563010d010204000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e007803822b001ba2e0100';
const callDataU8a = hexToU8a(callData);

const result = await api.call.dryRunApi.dryRunCall(
  { system: { Signed: testAccount } },
  callDataU8a
);
