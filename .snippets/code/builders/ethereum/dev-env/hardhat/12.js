import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonriver: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONRIVER_RPC_URL'),
      chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
      accounts: [configVariable('MOONRIVER_PRIVATE_KEY')],
    },
  },
});
