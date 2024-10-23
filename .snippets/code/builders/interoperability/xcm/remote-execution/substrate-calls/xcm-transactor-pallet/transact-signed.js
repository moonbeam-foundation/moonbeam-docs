import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1
import { cryptoWaitReady } from '@polkadot/util-crypto';

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const privateKey = 'INSERT_PRIVATE_KEY';
const dest = {
  V4: {
    parents: 1,
    interior: { X1: [{ Parachain: 888 }] },
  },
};
const fee = {
  currency: {
    AsCurrencyId: { ForeignAsset: 35487752324713722007834302681851459189n },
  },
  feeAmount: 50000000000000000n,
};
const call = '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
const weightInfo = {
  transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 40000n },
  overallWeight: { Unlimited: null },
};
const refund = true;

const transactThroughSigned = async () => {
  // 2. Create Keyring instance
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'ethereum' });
  const alice = keyring.addFromUri(privateKey);
  
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.xcmTransactor.transactThroughSigned(
    dest,
    fee,
    call,
    weightInfo,
    refund
  );

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

transactThroughSigned();
