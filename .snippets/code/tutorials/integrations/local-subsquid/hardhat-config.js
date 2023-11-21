// Import the Ethers plugin required to interact with the contract
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Specify the Solidity version
  solidity: '0.8.20',
  networks: {
    dev: {
      url: 'http://127.0.0.1:9944',
      chainId: 1281, // (hex: 0x501),
      accounts: [
        '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
      ], // Alith's private key
    },
  },
};
