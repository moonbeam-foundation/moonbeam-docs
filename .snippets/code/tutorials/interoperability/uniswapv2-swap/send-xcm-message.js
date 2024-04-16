import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import Keyring from '@polkadot/keyring'; // Version 10.3.1

// 1. Input Data
const providerWsURL = 'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network';
const MNEMONIC = 'INSERT_MNEMONIC'; // Not safe, only for testing
const txCall =
  '0x4d0604630003000100a10f031000040000010403000f0000c16ff28623130000010403000f0000c16ff286230006010700902f500982b92a00fd04260001eeed020000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d01000001030061cd3e07fe7d7f6d4680e3e322986b7877f108dd';

// 2. Create Keyring Instance
const keyring = new Keyring({ type: 'sr25519' });

const sendXCM = async () => {
  // 3. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Create Account from Mnemonic
  const alice = keyring.addFromUri(MNEMONIC);

  // 5. Create the Extrinsic
  const tx = await api.tx(txCall).signAndSend(alice, (result) => {
    // 6. Check Transaction Status
    if (result.status.isInBlock) {
      console.log(`Transaction included in blockHash ${result.status.asInBlock}`);
    }
  });

  api.disconnect();
};

sendXCM();