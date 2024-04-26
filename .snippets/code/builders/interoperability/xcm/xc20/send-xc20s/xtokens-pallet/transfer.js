import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1
import { cryptoWaitReady } from '@polkadot/util-crypto';

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const privateKey = 'INSERT_PRIVATE_KEY';
const relayAccount =
  '0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063'; // Alice's relay account address
const currencyId = {
  ForeignAsset: {
    ForeignAsset: 42259045809535163221576417993425387648n,
  },
};
const amount = 1000000000000n;
const dest = {
  V4: {
    parents: 1,
    interior: { X1: [{ AccountId32: { id: relayAccount } }] },
  },
};
const destWeightLimit = { Unlimited: null };

const sendXc20 = async () => {
  // 2. Create Keyring instance
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'ethereum' });
  const alice = keyring.addFromUri(privateKey);
  
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.xTokens.transfer(currencyId, amount, dest, destWeightLimit);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

sendXc20();
