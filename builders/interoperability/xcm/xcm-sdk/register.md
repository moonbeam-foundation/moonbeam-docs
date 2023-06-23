---
title: XCM SDK
description: Use the Moonbeam XCM SDK to easily deposit and withdraw cross chain assets to Moonbeam from Polkadot and other parachains in the ecosystem.
---

# Add a Parachain or Asset to the XCM SDK

![XCM SDK Banner](/images/builders/interoperability/xcm/sdk/xcm-sdk-banner.png)

## Introduction {: #introduction }

## Get Started {: #get-started }

First, you can start off by creating a [fork of the `xcm-sdk` repo](https://github.com/PureStake/xcm-sdk/fork){target=_blank}.

Then you'll need to clone the repo locally so you can start making the necessary changes to add your asset. You can use the following command, but be sure to replace `YOUR_USERNAME` with your GitHub username that you used to fork the repo:

```
git clone https://github.com/YOUR_USERNAME/xcm-sdk.git
```

Then you'll need to install the dependencies:

```
cd xcm-sdk
npm i
```

`npm run dev`???

## Add a New Asset to the XCM SDK {: #add-new-asset }

You'll need to add your asset to the `packages/config/src/asset.ts` file, which contains a list of assets that live within the `@moonbeam-network/xcm-config` package and are consumed by the `@moonbeam-network/xcm-sdk` package.

When adding your asset, you'll need to provide the symbol of the asset as it is on the origin chain. You'll also need to provide a key, which should be the same as the symbol, except in all lowercase letters. You can view the other assets listed in the [`assets.ts` file](https://github.com/PureStake/xcm-sdk/blob/main/packages/config/src/assets.ts){target=_blank} as reference. The assets in this file are listed in alphabetical order, so make sure you add your asset in the correct order.

The entry should resemble the following:

```js
export const glmr = new Asset({
  key: 'glmr',
  originSymbol: 'GLMR',
});
```

Towards the bottom of the `assets.ts` file, you'll also need to add asset to the `assetsList` array. Again, this list follows alphabetical order, so make sure you add your asset in the correct order.

### Add a New Chain to the XCM SDK {: #add-new-chain }

Now that you've added an asset, you can use the asset to add a new chain. You'll need to modify the `packages/config/src/chains.ts` file, which is a file that contains the configurations for all of the supported chains. Similarly to the assets, the supported chains live within the `@moonbeam-network/xcm-config` package and are consumed by the `@moonbeam-network/xcm-sdk` package.

You'll start off by add your the newly created asset to the list of imports from the `./assets` file in the `packages/config/src/chains.ts` file.

Next, you'll need to add the chain configurations. You can create a `Parachain` or an `EvmParachain` if your chain is EVM compatible. When creating a new chain, you'll need to specify the following:

=== "Parachain"

    ```ts
    new Parachain({
      assetsData?:  Map<string, ChainAssetsData> | ChainAssetsData[],
      ecosystem?: Ecosystem | undefined,
      isTestChain?: boolean | undefined,
      key: string,
      name: string,
      genesisHash: string,
      parachainId: number,
      ss58Format: number,
      weight?: number | undefined,
      ws: string
    });
    ```

=== "EvmParachain"

    ```ts
    new Parachain({
      assetsData?:  Map<string, ChainAssetsData> | ChainAssetsData[],
      ecosystem?: Ecosystem | undefined,
      isTestChain?: boolean | undefined,
      key: string,
      name: string,
      genesisHash: string,
      parachainId: number,
      ss58Format: number,
      weight?: number | undefined,
      ws: string,
      id: number,
      rpc: string
    });
    ```

!!! note
    The difference between the two types is that when creating an `EvmParachain`, you'll also specify the chain ID and RPC URL.

You'll need to provide asset data for all of the supported assets on this chain, which can include the native assets and the assets that can be received on this chain. 


 by using the asset you imported and how you identify the asset 



You can view the other chains listed in the [`chains.ts` file](https://github.com/PureStake/xcm-sdk/blob/main/packages/config/src/chains.ts){target=_blank} as reference. The chains in this file are listed in alphabetical order, so make sure you add your chain in the correct order.



If the chain you're adding has a deployment on Polkadot and Kusama and uses the same name, you can differentiate the two by using `chainNamePolkadot` and `chainNameKusama` as the variable name, and `chain-name-polkadot` and `chain-name-kusama` for the `key`. 