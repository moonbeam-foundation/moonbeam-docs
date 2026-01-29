import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonbase: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONBASE_RPC_URL'),
      chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
      accounts: [configVariable('MOONBASE_PRIVATE_KEY')],
    },
  },
});
