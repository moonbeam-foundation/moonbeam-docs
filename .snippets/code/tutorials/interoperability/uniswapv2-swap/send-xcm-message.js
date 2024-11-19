import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1
import { cryptoWaitReady } from '@polkadot/util-crypto';

// 1. Input Data
const providerWsURL =
  'wss://relay.api.moonbase.moonbeam.network';
const MNEMONIC = 'INSERT_MNEMONIC'; // Not safe, only for testing
const txCall =
  '0x450604630004000100a10f0410000400010403000f0000c16ff286231300010403000f0000c16ff286230006010700902f500982b92a00fd042600019b40090000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d01000001030061cd3e07fe7d7f6d4680e3e322986b7877f108dd';

const sendXCM = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Create Keyring Instance
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri(MNEMONIC);

  // 4. Create the Extrinsic
  const tx = await api.tx(txCall).signAndSend(alice, (result) => {
    // 5. Check Transaction Status
    if (result.status.isInBlock) {
      console.log(
        `Transaction included in blockHash ${result.status.asInBlock}`
      );
    }
  });

  api.disconnect();
};

sendXCM();
