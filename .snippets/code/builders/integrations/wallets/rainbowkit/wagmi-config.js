import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  //add Moonbase Alpha to imported chain name list
  moonbaseAlpha,
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export const config = getDefaultConfig({
  appName: 'My RainbowKit Demo',
  projectId: 'process.env.NEXT_PUBLIC_PROJECT_ID',
  //add Moonbase Alpha to chain name list in config
  chains: [mainnet, polygon, optimism, arbitrum, base, moonbaseAlpha],
  ssr: true,
});
