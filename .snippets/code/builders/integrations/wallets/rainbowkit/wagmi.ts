import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { moonbeam, moonriver, moonbaseAlpha } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export const config = getDefaultConfig({
  appName: 'My Moonbeam App',
  projectId: 'process.env.NEXT_PUBLIC_PROJECT_ID',
  chains: [moonbeam, moonriver, moonbaseAlpha],
  ssr: true,
});
