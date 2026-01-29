import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    dev: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('DEV_RPC_URL'),
      chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
      accounts: [configVariable('DEV_PRIVATE_KEY')],
    },
  },
});
