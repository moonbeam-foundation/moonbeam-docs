import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { moonbeam, moonriver, moonbaseAlpha } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [moonbeam, moonriver, moonbaseAlpha],
  ssr: true,
});
