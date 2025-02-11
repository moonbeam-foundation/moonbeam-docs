---
title: Sovereign Accounts and Reserve-Backed Transfers
description: Discover how sovereign accounts work on Moonbeam, how to calculate them, and their role in cross-chain asset transfers.
---

# Overview of Sovereign Accounts

## Introduction {: #introduction }

In Polkadot-based ecosystems, a sovereign account is a unique, keyless account controlled by a blockchain’s runtime through XCM rather than an individual or organization. These accounts are used to store assets when transferring tokens cross-chain. For example, if you send a reserve tokens transfer from a parachain to Moonbeam, the originating parachain locks those tokens in Moonbeam’s sovereign account on the source chain, while a wrapped representation of those tokens is minted on Moonbeam.

Sovereign accounts play a central role in [reserve-backed transfers](https://wiki.polkadot.network/docs/learn/xcm/journey/transfers-reserve){target=\_blank}, where one chain (the “reserve”) holds the real assets and other chains hold derivative tokens. When tokens move across chains, the reserve (or origin) chain locks or unlocks the underlying asset, and derivative tokens are minted or burned on the destination chain.

## Calculating a Parachain Sovereign Account {: #calculating-sovereign }

You can calculate a parachain’s sovereign account on a given relay chain using the [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} repository. This is especially useful when you need to verify where underlying tokens are locked or to fund a parachain’s sovereign account directly.

1. Clone or navigate to the [xcm-tools repository](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}
2. Use the `calculate-sovereign-account` script, specifying the **Parachain ID** with the `--p` flag and the relay chain with the `--r` flag (default is `polkadot`; other accepted values are `kusama` or `moonbase`)

The parachain ID you need can be found on the respective relay chain’s [Polkadot.js Apps Parachains page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frelay.api.moonbase.moonbeam.network#/parachains){target=\_blank}. The Parachains page can be accessed under the **Network** dropdown.

For example, to calculate the sovereign account address for parachain `1000` on the Moonbase Alpha testnet:

```bash
yarn calculate-sovereign-account --p 1000 --r moonbase
```

Running the script will generate output like the following:

--8<-- 'code/builders/interoperability/xcm/core-concepts/sovereign-accounts/terminal/calculate.md'

The relay address is how the Polkadot or Kusama relay chain references the sovereign account. Generic parachain address is typically used for referencing this parachain’s sovereign account from other parachains. The Moonbase Alpha address is the corresponding sovereign account in the H160 EVM address format used by Moonbase Alpha.

## Learn More {: #learn-more }

Sovereign accounts form the backbone of reserve-backed transfers, enabling safe custody of assets for minting wrapped tokens across Polkadot’s ecosystem. By combining sovereign accounts with the XCM framework, parachains can interoperate seamlessly—locking and unlocking assets in a transparent, trust-minimized way. For more information about how sovereign accounts facilitate cross-chain transfers with XCM, be sure to check out the [Send XC-20s section](/builders/interoperability/xcm/xc20/send-xc20s/overview/){target=\_blank}.