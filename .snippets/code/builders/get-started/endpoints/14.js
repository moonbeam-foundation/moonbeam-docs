import { ethers } from 'ethers';

function getBalanceSlot(accountAddress) {
  // Convert address to bytes32 and normalize
  const addr = ethers.zeroPadValue(accountAddress, 32);

  // Caution! The storage slot index used here is 1
  // The storage slot index for other tokens may vary
  const packedData = ethers.concat([
    addr,
    ethers.zeroPadValue(ethers.toBeHex(1), 32),
  ]);

  // Calculate keccak256
  return ethers.keccak256(packedData);
}

// Example usage
const address = 'INSERT_ADDRESS';
console.log(getBalanceSlot(address));
