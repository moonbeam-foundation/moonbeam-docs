"use client";

import React from "react";
import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { moonbeam } from "@particle-network/connectkit/chains";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";
import { aa } from "@particle-network/connectkit/aa";

const config = createConfig({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,

  walletConnectors: [authWalletConnectors({})],

  plugins: [
    wallet({
      entryPosition: EntryPosition.BR, // Positions the modal button at the bottom right on login
      visible: true, // Determines if the wallet modal is displayed
    }),
    aa({
      name: "SIMPLE",
      version: "2.0.0",
    }),
  ],
  chains: [moonbeam],
});

export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
