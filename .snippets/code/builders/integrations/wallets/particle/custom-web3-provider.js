import { ParticleNetwork } from '@particle-network/auth';
import { Moonbeam } from '@particle-network/chains';
import { ParticleProvider } from '@particle-network/provider';
import { SmartAccount, AAWrapProvider } from '@particle-network/aa';
import { Web3 } from 'web3';

// Project ID, Client Key, and App ID from https://dashboard.particle.network
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  clientKey: process.env.REACT_APP_CLIENT_KEY,
  appId: process.env.REACT_APP_APP_ID,
};

const particle = new ParticleNetwork({
  ...config,
  chainName: Moonbeam.name,
  chainId: Moonbeam.id,
  wallet: { displayWalletEntry: true },
});

// If using ERC-4337 AA
const provider = new ParticleProvider(particle.auth);
const smartAccount = new SmartAccount(provider, {
  ...config,
  aaOptions: {
    accountContracts: {
      SIMPLE: [
        {
          version: '1.0.0',
          chainIds: [Moonbeam.id],
        },
      ],
    },
  },
});

// Sets wallet UI to use AA mode
particle.setERC4337({
  name: 'SIMPLE',
  version: '1.0.0',
});

// Uses custom EIP-1193 AA provider
const wrapProvider = new AAWrapProvider(smartAccount);
const customProvider = new Web3(wrapProvider);
