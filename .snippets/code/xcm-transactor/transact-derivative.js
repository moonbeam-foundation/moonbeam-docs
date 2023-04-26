import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 9.13.6

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';

const dest = 'Relay';
const index = 42;
const fee = {
  currency: {
    AsCurrencyId: { ForeignAsset: 42259045809535163221576417993425387648n },
  },
  feeAmount: 13764626000000n,
};
const innerCall =
  '0x04000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8';
const weightInfo = {
  transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 0 },
  overallWeight: { refTime: 2000000000n, proofSize: 0 },
};

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(PRIVATE_KEY);

const transactThroughDerivative = async () => {
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.xcmTransactor.transactThroughDerivative(
    dest,
    index,
    fee,
    innerCall,
    weightInfo
  );

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

transactThroughDerivative();