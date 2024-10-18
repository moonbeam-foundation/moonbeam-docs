import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  const amountToSend = BigInt(1 * 10 ** 12); // Sending 1 token (assuming 12 decimal places)
  const assetMultiLocation = {
    parents: 0,
    interior: { X1: { PalletInstance: 3 } },
  }; // The asset's location (adjust PalletInstance as needed)
  const recipientAccount = '0x1234567890abcdef1234567890abcdef12345678'; // The recipient's account on the destination chain

  // 2. XCM Destination (e.g., Parachain ID 2000)
  const dest = { V3: { parents: 1, interior: { X1: { Parachain: 2000 } } } };

  // 3. XCM Instruction 1: Withdraw the asset from the sender
  const instr1 = {
    WithdrawAsset: [
      {
        id: { Concrete: assetMultiLocation },
        fun: { Fungible: amountToSend },
      },
    ],
  };

  // 4. XCM Instruction 2: Deposit the asset into the recipient's account on the destination chain
  const instr2 = {
    DepositAsset: {
      assets: { Wild: 'All' }, // Sending all withdrawn assets (in this case, 1 token)
      beneficiary: {
        parents: 0,
        interior: { X1: { AccountKey20: { key: recipientAccount } } },
      },
    },
  };

  // 5. Build the XCM Message
  const message = { V3: [instr1, instr2] };

  const theWeight = await api.call.xcmPaymentApi.queryXcmWeight(message);
  console.log(theWeight);

  // Disconnect the API
  await api.disconnect();
};

main();