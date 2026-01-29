require('@nomicfoundation/hardhat-verify');

module.exports = {
  networks: {
    moonbeam: { ... },
    moonriver: { ... },
    moonbaseAlpha: { ... }
  },
  etherscan: {
    apiKey: {
      moonbeam: 'INSERT_ETHERSCAN_API_KEY',
      moonriver: 'INSERT_ETHERSCAN_API_KEY',
      moonbaseAlpha: 'INSERT_ETHERSCAN_API_KEY', 
    },
  },
};
