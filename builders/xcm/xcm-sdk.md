---
title: XCM SDK
description: Learn how to...
---

# Using the Moonbeam XCM SDK

![XCM SDK Banner](/images/builders/xcm/xc-integration/xc-integration-banner.png)

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets, and which extrinsics are used on which networks to send XCM transfers.

## Installation {: #installation }

To install the XCM SDK and XCM config packages, you can run the following command:

```
npm install @moonbeam-network/xcm-sdk @moonbeam-network/xcm-config
```

## Creating Signers {: creating-signers }

When interacting with the `deposit` and `withdraw` functions of the XCM SDK, you'll need to provide an Ethers.js and Polkadot.js signer which will be used to sign and send the transactions. The Ethers.js signer is used to sign transactions on Moonbeam, and the Polkadot.js signer will be used to sign transactions on the origin chain you're depositing assets from.

To create a signer for Ethers.js and Polkadot.js, you can use the following snippets:

=== "Moonbeam"

    ```js
    import { ethers } from "ethers";
    import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
    import { init } from '@moonbeam-network/xcm-sdk';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}',
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbeam.rpc, 
      {
        chainId: providerRPC.moonbeam.chainId,
        name: providerRPC.moonbeam.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

    // Set up Polkadot provider and signer
    const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri(mnemonic);
    ```

=== "Moonriver"

    ```js
    import { ethers } from "ethers";
    import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}',
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonriver.rpc, 
      {
        chainId: providerRPC.moonriver.chainId,
        name: providerRPC.moonriver.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

    // Set up Polkadot provider and signer
    const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri('INSERT-MNEMONIC');
    ```

=== "Moonbase Alpha"

    ```js
    import { ethers } from "ethers";
    import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );
    const ethersSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

    // Set up Polkadot provider and signer
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri(mnemonic);
    ```

## Initializing {: #initializing }

You can optionally pass the signers into the `init` function of the XCM SDK, which will enable you to use the withdraw and deposit functions without the need for passing in a signer:

=== "Moonbeam"

    ```js
    const { moonbeam } = init({ ethersSigner, polkadotSigner })
    ```

=== "Moonriver"

    ```js
    const { moonriver } = init({ ethersSigner, polkadotSigner })
    ```

=== "Moonbase Alpha"

    ```js
    const { moonbase } = init({ ethersSigner, polkadotSigner })
    ```

## API {: #api }

### Symbols {: #symbols }

You can get a list of the supported symbols for each network by accessing the `symbols` property:

=== "Moonbeam"
    ```
    moonbeam.symbols
    ```

=== "Moonriver"
    ```
    moonriver.symbols
    ```

=== "Moonbase Alpha"
    ```
    moonbase.symbols
    ```

An example response is as follows:

```js
[ 'ACA', 'ASTR', 'AUSD', 'DOT', 'GLMR', 'IBTC', 'INTR', 'PARA', 'PHA']
```

### Assets {: #assets }

To get a list of the supported assets along with their asset ID, precompiled contract address, and their origin asset symbols, you can access the `assets` property:

=== "Moonbeam"
    ```
    moonbeam.assets
    ```

=== "Moonriver"
    ```
    moonriver.assets
    ```2

=== "Moonbase Alpha"
    ```
    moonbase.assets
    ```

An example response is as follows:

```js
assets: {
  ACA: {
    id: '224821240862170613278369189818311486111',
    erc20Id: '0xffffffffa922fef94566104a6e5a35a4fcddaa9f',
    originSymbol: 'ACA'
  },
  ASTR: {
    id: '224077081838586484055667086558292981199',
    erc20Id: '0xffffffffa893ad19e540e172c10d78d4d479b5cf',
    originSymbol: 'ASTR'
  },
  ...
}
```

### Native Assets {: #native-assets }

To get information about each of the Moonbeam network's native protocol asset, you can access the `moonAsset` property:

=== "Moonbeam"
    ```
    moonbeam.moonAsset
    ```

=== "Moonriver"
    ```
    moonriver.moonAsset
    ```

=== "Moonbase Alpha"
    ```
    moonbase.moonAsset
    ```

An example response is as follows:

```js
moonAsset: {
  id: '',
  erc20Id: '{{ networks.moonbeam.precompiles.erc20 }}',
  originSymbol: 'GLMR',
  isNative: true
}
```

### Native Chain Information {: #native-chain-information }

To get information about each of the Moonbeam network's chain information including the chain key, name, WSS endpoint, parachain ID, protocol asset symbols, chain ID, and units per second, you can access the `moonChain` property:

=== "Moonbeam"
    ```
    moonbeam.moonChain
    ```

=== "Moonriver"
    ```
    moonriver.moonChain
    ```

=== "Moonbase Alpha"
    ```
    moonbase.moonChain
    ```

An example response is as follows:

```js
moonChain: {
  key: 'Moonbeam',
  name: 'Moonbeam',
  ws: 'wss://wss.api.moonbeam.network',
  parachainId: 2004,
  decimals: 18,
  chainId: 1284,
  unitsPerSecond: 10000000000000000000n
}
```

### Subscribe to Assets Balance Information {: #subsscribe }

To subscribe to balance information, you can use the `subscribeToAssetsBalanceInfo` function and pass in the address you want to get the balance for and a callback function to handle the data:

=== "Moonbeam"
    ```
    moonbeam.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonriver"
    ```
    moonriver.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonbase Alpha"
    ```
    moonbase.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

The following example retrieves the balance information for a given account and prints the balance for each of the supported assets to the console:

```js
const unsubscribe = await moonbeam.subscribeToAssetsBalanceInfo(
  'INSERT-ADDRESS',
  (balances) => {
    balances.forEach(({ asset, balance, origin }) => {
      console.log(
        `${balance.symbol}: ${toDecimal(balance.balance, balance.decimals)} (${
          origin.name
        } ${asset.originSymbol})`,
      );
    });
  },
);

unsubscribe();
```

### Deposit {: #deposit }

To deposit an asset to Moonbeam from another network, you'll have to first build the request using information from the origin chain before you can send the request, to do so you'll take the following steps:

1. Call the `deposit` function and pass in the asset symbol for the asset to be deposited. This will return a `chains` array containing the asset's origin network information and a `from` function which will be used to continue to build the request
2. Call the `from` function and pass in the chain key of the origin network and then call `get` and pass in the address of the account on Moonbeam you want to deposit the funds to and pass in the [Polkadot signer](#creating-signers). This will return information about the origin chain asset, the `xc` representation of the asset on Moonbeam, a `send` function which will be used in the next step, and more
3. The `send` function is used to send the built deposit request along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the deposit request, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to deposit DOT from the Polkadot relay chain to xcDOT on Moonbeam is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function deposit() {
  const dot = AssetSymbol.UNIT;
  const polkadot = ChainKey.AlphanetRelay;

  const { chains, from } = moonbeam.deposit(dot);

  console.log(
    `\nYou can deposit ${dot} from these chains: `,
    chains.map((chain) => chain.name),
  );

  const { asset, sourceBalance, source, min, send } = await from(polkadot).get(
    'INSERT-MOONBEAM-ADDRESS',
    polkadotSigner,
  );

  console.log(
    `Your ${asset.originSymbol} balance in ${source.name}: ${toDecimal(
      sourceBalance,
      asset.decimals,
    )}. Minimum transferable amount is: ${toDecimal(min, asset.decimals)}`,
  );

  await send('INSERT-AMOUNT', (event) => console.log(event));
}
```

### Withdraw {: #withdraw }

To withdraw an asset from Moonbeam to send back to the origin network, you'll have to first build the request using information from the origin chain before you can send the request, to do so you'll take the following steps:

1. Call the `withdraw` function and pass in the asset symbol for the asset to be deposited. This will return a `chains` array containing the asset's origin network information and a `to` function which will be used to continue to build the request
2. Call the `to` function and pass in the chain key of the origin network and then call `get` and pass in the address of the account on the origin network you want to withdraw the funds to and pass in the [Ethers signer](#creating-signers) if you haven't already done so during [intialization](#initializing). This will return information about the origin (destination) chain asset, the `xc` representation of the asset on Moonbeam, a `send` function which will be used in the next step, and more
3. The `send` function is used to send the built deposit request along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the deposit request, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to withdraw xcDOT from Moonbeam to send back to DOT on Polkadot is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function withdraw() {
  const dot = AssetSymbol.UNIT;
  const polkadot = ChainKey.AlphanetRelay;

  const { chains, to } = moonbase.withdraw(dot);

  console.log(
    `\nYou can withdraw ${dot} to these chains: `,
    chains.map((chain) => chain.name),
  );

  const { asset, destination, destinationBalance, min, send } = await to(
    polkadot,
  ).get('INSERT-POLKADOT-ADDRESS', {
    ethersSigner: signer, // Only required if you didn't pass the signer in on initialization
  });

  console.log(
    `Your ${asset.originSymbol} balance in ${destination.name}: ${toDecimal(
      destinationBalance,
      asset.decimals,
    )}. Minimum transferable amount is: ${toDecimal(min, asset.decimals)}`,
  );

  await send('INSERT-AMOUNT', (event) => console.log(event));
}
```

## XCM SDK Utility Functions {: #sdk-utils }

The XCM SDK provides three utility functions: `isXcmSdkDeposit`, `isXcmSdkWithdraw`, and `toDecimal`.

### Deposit Check

- **isXcmSdkDeposit** - returns a boolean indicating whether the passed in XCM request is a deposit

```js
const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(withdraw)) // Returns false
```

### Withdraw Check

- **isXcmSdkWithdraw** - returns a boolean indicating whether the passed in XCM request is a withdrawal

```js
const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkWithdraw(withdraw)) // Returns true
```

### Convert Balances to Decimals 

- **toDecimal**(number: *bigint*, decimals: *number*, maxDecimal?: *number*) - returns the `number` value in decimal format based on the number of `decimals` provided. You can optionally pass in a value for `maxDecimal` to dictate the maximum number of decimal places used, otherwise the default is `6`

For example, to convert a balance on Moonbeam from Wei to Glimmer you can use the following code:

```js
const balance = toDecimal(3999947500000000000n, 18)
console.log(balance) // Returns 3.999947
```
