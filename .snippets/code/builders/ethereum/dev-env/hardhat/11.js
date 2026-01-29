import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonbeam: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONBEAM_RPC_URL'),
      chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
      accounts: [configVariable('MOONBEAM_PRIVATE_KEY')],
    },
  },
});
