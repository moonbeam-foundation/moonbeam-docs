import { numberToU8a, stringToU8a, u8aToHex } from '@polkadot/util';

// 1. Convert `gas_limit:` to bytes
const gasLimitString = 'gas_limit:';
const u8aGasLimit = stringToU8a(gasLimitString);

// 2. Convert the gas value to little-endian formatted bytes
const gasLimitValue = 300000;
const u8aGasLimitValue = numberToU8a(gasLimitValue);
const littleEndianValue = u8aGasLimitValue.reverse();

// 3. Combine and zero pad the gas limit string and the gas limit 
// value to 32 bytes
const u8aCombinedGasLimit = new Uint8Array(32);
u8aCombinedGasLimit.set(u8aGasLimit, 0);
u8aCombinedGasLimit.set(littleEndianValue, u8aGasLimit.length);

// 4. Convert the bytes to a hex string
const data = u8aToHex(u8aCombinedGasLimit);
console.log(`The GeneralKey data is: ${data}`);