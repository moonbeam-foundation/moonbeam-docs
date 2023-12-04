import { ParticleNetwork } from '@particle-network/auth';
import { Moonbeam } from '@particle-network/chains';

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
