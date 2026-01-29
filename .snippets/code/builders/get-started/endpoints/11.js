import { ethers } from 'ethers';

function getBalanceSlot(accountAddress) {
  // Convert address to bytes32 and normalize
  const addr = ethers.zeroPadValue(accountAddress, 32);

  // CAUTION! The storage slot used here is 5, which
  // is specific to Wormhole contracts
  // The storage slot index for other tokens may vary
  const packedData = ethers.concat([
    addr,
    ethers.zeroPadValue(ethers.toBeHex(5), 32),
  ]);

  // Calculate keccak256
  return ethers.keccak256(packedData);
}

// Example usage
const address = 'INSERT_ADDRESS';
console.log(getBalanceSlot(address));
