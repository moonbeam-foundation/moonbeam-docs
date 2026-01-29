import { encode } from '@polkadot/util-rlp';
import { keccakAsHex } from '@polkadot/util-crypto';
import { numberToHex } from '@polkadot/util';

// Define the raw signed transaction
const txData = {
  nonce: numberToHex(1),
  gasPrice: numberToHex(21000000000),
  gasLimit: numberToHex(21000),
  to: '0xc390cC49a32736a58733Cf46bE42f734dD4f53cb',
  value: numberToHex(1000000000000000000),
  data: '',
  v: '0507',
  r: '0x5ab2f48bdc6752191440ce62088b9e42f20215ee4305403579aa2e1eba615ce8',
  s: '0x3b172e53874422756d48b449438407e5478c985680d4aaa39d762fe0d1a11683',
};

// Extract the values to an array
var txDataArray = Object.keys(txData).map(function (key) {
  return txData[key];
});

// Calculate the RLP encoded transaction
var encoded_tx = encode(txDataArray);

// Hash the encoded transaction using keccak256
console.log(keccakAsHex(encoded_tx));
