import { ethers } from 'ethers';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';

const from = 'INSERT_FROM_ADDRESS';
const to = 'INSERT_TO_ADDRESS';
const value = 0;
const data =
  '0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000';
const gaslimit = 100000;
const nonce = 'INSERT_SIGNERS_NONCE';
const deadline = 'INSERT_DEADLINE';

const createPermitMessageData = () => {
  const message = {
    from: from,
    to: to,
    value: value,
    data: data,
    gaslimit: gaslimit,
    nonce: nonce,
    deadline: deadline,
  };

  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      CallPermit: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gaslimit', type: 'uint64' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'CallPermit',
    domain: {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: 1287,
      verifyingContract: '0x000000000000000000000000000000000000080a',
    },
    message: message,
  };

  return {
    typedData,
    message,
  };
};

const messageData = createPermitMessageData();

// For demo purposes only. Never store your private key in a JavaScript/TypeScript file
const signature = signTypedData({
  privateKey: Buffer.from('INSERT_FROM_ACCOUNT_PRIVATE_KEY', 'hex'),
  data: messageData.typedData,
  version: SignTypedDataVersion.V4,
});

console.log(`Transaction successful with hash: ${signature}`);

const ethersSignature = ethers.Signature.from(signature);
const formattedSignature = {
  r: ethersSignature.r,
  s: ethersSignature.s,
  v: ethersSignature.v,
};
console.log(formattedSignature);
