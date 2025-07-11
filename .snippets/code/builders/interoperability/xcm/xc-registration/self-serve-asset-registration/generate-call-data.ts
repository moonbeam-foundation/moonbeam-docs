import '@moonbeam-network/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { blake2AsHex } from '@polkadot/util-crypto';

const moonbeam = await ApiPromise.create({
  provider: new WsProvider(MOONBEAM_WSS),
});

const tx = moonbeam.tx.evmForeignAssets.createForeignAsset(
  ASSET_ID,
  assetLocation,
  DECIMALS,
  SYMBOL,
  NAME
);

// SCALE-encoded call data (includes call index 0x3800)
const encodedCall = tx.method.toHex();
console.log('Encoded call data:', encodedCall);

// Optional: 32-byte call hash (blake2_256)
console.log('Call hash:', blake2AsHex(encodedCall));
