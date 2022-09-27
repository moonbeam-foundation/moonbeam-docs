---
title: XCM SDK
description: Use the Moonbeam XCM SDK to easily deposit and withdraw cross chain assets to Moonbeam from Polkadot and other parachains in the ecosystem.
---

# Using the Moonbeam XCM SDK

![XCM SDK Banner](/images/builders/xcm/sdk/xcm-sdk-banner.png)

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers. To deposit or withdraw assets, you simply define the asset and origin chain you want to deposit from or withdraw back to, along with the sending account's signer, and the amount to send.

The XCM SDK offers simple helper functions like `deposit` and `withdraw`, that provide a very simple interface to execute XCM transfers between chains in the Polkadot/Kusama ecosystem. In addition, the XCM config package allows any parachain project to add their information in a standard way, so they can be immediately supported by the XCM SDK.

The examples in this guide are shown on Moonbeam, but can be adapted to be used on Moonriver or Moonbase Alpha.

## Getting Started {: #getting-started }

To get started with the XCM SDK, you'll first need to install the corresponding NPM package. Next, you'll also need to create signers to be used to sign transactions to transfer assets between Moonbeam and another chain within the Polkadot ecosystem. Lastly, you'll need to initialize the API which will provide you with asset and chain information and the necessary functions to deposit, withdraw, and subscribe to balance information.

### Installation {: #installation }

For the purposes of this guide you'll need to install two packages: the XCM SDK package, and the XCM config package. 

The XCM SDK package will enable you to easily deposit and withdraw assets, and subscribe to balance information for each of the supported assets. 

The XCM config package will be used to obtain origin asset and chain information for each of the supported assets. The config package also includes native asset and chain information for each of the Moonbeam-based networks, as well as some underlying functions of the SDK.

To install the XCM SDK and XCM config packages, you can run the following command:

```
npm install @moonbeam-network/xcm-sdk @moonbeam-network/xcm-config
```

Both packages will install all the dependencies needed, like [Ethers.js](https://docs.ethers.io/v5/){target=_blank} and the [Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank}.

!!! note
    There is a [known issue](https://github.com/polkadot-js/api/issues/4315){target=_blank} when using the Moonbeam XCM packages alongside Polkadot.s with Node.js (JavaScript) that will cause package conflict warnings to appear in the console. Using TypeScript is recommended.

### Creating Signers {: creating-signers }

When interacting with the `deposit` and `withdraw` functions of the XCM SDK, you'll need to provide an [Ethers.js](https://docs.ethers.io/){target=_blank} and [Polkadot.js](https://polkadot.js.org/docs/api/){target=_blank} signer, which will be used to sign and send the transactions. The Ethers signer is used to sign transactions on Moonbeam, and the Polkadot signer will be used to sign transactions on the origin chain you're depositing assets from.

You can pass, for example, a [MetaMask signer into Ethers](https://docs.ethers.io/v5/getting-started/#getting-started--connecting){target=_blank} or another compatible wallet. Similarly with Polkadot, you can [pass a compatible wallet to the signer using the `@polkadot/extension-dapp` library](https://polkadot.js.org/docs/extension/){target=_blank}.

To create a signer for Ethers.js and Polkadot.js, you can refer to the following code snippets. Please note that this approach is not recommended for production applications. **Never store your private key or mnemonic in a JavaScript or TypeScript file.**

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

    // Set up Polkadot signer
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri(mnemonic);
    ```

=== "Moonriver"

    ```js
    import { ethers } from "ethers";
    import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
    import { init } from '@moonbeam-network/xcm-sdk';

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

    // Set up Polkadot signer
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri('INSERT-MNEMONIC');
    ```

=== "Moonbase Alpha"

    ```js
    import { ethers } from "ethers";
    import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
    import { init } from '@moonbeam-network/xcm-sdk';

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

    // Set up Polkadot signer
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotSigner = keyring.addFromUri(mnemonic);
    ```

### Initialization {: #initializing }

To be able to deposit, withdraw, and subscribe to balance information for all of the supported assets, you'll need to start off by calling the `init` function:

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init()
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init()
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init()
    ```
    
If you intend to support a specific wallet, you can pass a signer into the `init` function right away. Otherwise, you'll be able to pass a signer directly when building a deposit or withdraw request. To pass in a signer for Ethers and Polkadot, you can use the following snippe (using Moonbeam as an example):

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init({
      ethersSigner: 'INSERT-ETHERS-SIGNER',
      polkadotSigner: 'INSERT-POLKADOT-SIGNER'
    })
    ```

## API {: #api }

The Moonbeam SDK provides an API which includes a series of interfaces to get asset information for each of the supported assets, chain information for the initialized network, and functions to enable deposits, withdrawals, and subscription to balance information.

Make sure you have [intialized](#initialization) the Moonbeam network you want to interact with first.

### Asset Symbols {: #symbols }

An asset symbol refers to the symbol of the asset on the origin chain. For example, `GLMR` is the native asset on Moonbeam.

To get a list of the supported asset symbols for each network, you can access the `symbols` property:

=== "Moonbeam"

    ```js
    moonbeam.symbols
    ```

=== "Moonriver"

    ```js
    moonriver.symbols
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.symbols
    ```

An example of the data contained in the `symbols` property is as follows:

```js
[ 'ACA', 'ASTR', 'AUSD', 'DOT', 'GLMR', 'IBTC', 'INTR', 'PARA', 'PHA']
```

### Assets {: #assets }

To get a list of the supported assets along with their asset ID, precompiled contract address on Moonbeam, and their origin asset symbols, you can access the `assets` property:

=== "Moonbeam"

    ```js
    moonbeam.assets
    ```

=== "Moonriver"

    ```js
    moonriver.assets
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.assets
    ```

An example of the data contained in the `assets` property is as follows:

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

Where the `id` refers to the asset ID, the `erc20id` refers to the asset's precompiled contract address, and the `originSymbol` refers to the asset's symbol on the origin chain.

### Moonbeam Native Assets {: #native-assets }

To get information about each of the Moonbeam network's native protocol asset, such as the precompile contract address and the origin symbol, you can access the `moonAsset` property:

=== "Moonbeam"

    ```js
    moonbeam.moonAsset
    ```

=== "Moonriver"

    ```js
    moonriver.moonAsset
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.moonAsset
    ```

An example of the data contained in the `moonAsset` property is as follows:

```js
moonAsset: {
  id: '',
  erc20Id: '{{ networks.moonbeam.precompiles.erc20 }}',
  originSymbol: 'GLMR',
  isNative: true
}
```

Where the `erc20Id` refers to the precompile contract address on Moonbeam, the `originSymbol` is the symbol for the native asset, and `isNative` is a boolean indicating whether the asset is a native asset.

### Native Chain Information {: #native-chain-information }

To get information about each of the Moonbeam network's chain information including the chain key, name, WSS endpoint, parachain ID, protocol asset symbols, chain ID, and units per second, you can access the `moonChain` property:

=== "Moonbeam"

    ```js
    moonbeam.moonChain
    ```

=== "Moonriver"

    ```js
    moonriver.moonChain
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.moonChain
    ```

An example of the data contained in the `moonChain` property is as follows:

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

Here, the units per second refer to units of token (in this case Wei) that is charged per second of execution of the XCM message. You can find more information in the [XCM fees page](/builders/xcm/fees/#moonbeam-reserve-assets){target=_blank}.

### Subscribe to Assets Balance Information {: #subsscribe }

To subscribe to balance information, you can use the `subscribeToAssetsBalanceInfo` function and pass in the address you want to get the balance for and a callback function to handle the data:

=== "Moonbeam"

    ```js
    moonbeam.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonriver"

    ```js
    moonriver.subscribeToAssetsBalanceInfo('INSERT-ADDRESS', cb)
    ```

=== "Moonbase Alpha"

    ```js
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

To deposit an asset to Moonbeam from another network, you'll have to first build the request using information from the origin chain before you can send the request. To do so, you'll take the following steps:

1. Call the `deposit` function and pass in the asset symbol for the asset to be deposited. This will return a `chains` array containing the asset's origin network information and a `from` function which will be used to build the request
2. Call the `from` function and pass in the chain key of the origin network. Then, call `get` and pass in the address of the account on Moonbeam you want to deposit the funds to and pass in the [Polkadot signer](#creating-signers). This will return a `send` function which already contains all the necessary info to perform the deposit, and it is used in the next step. In addition, other elements such as information about the origin chain asset, the `xc` representation of the asset on Moonbeam, are returned and might be important for logging purposes
3. The `send` function is used to send the built deposit request along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the deposit request, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to deposit DOT from the Polkadot relay chain to xcDOT on Moonbeam is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function deposit() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

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

deposit();
```

As previously mentioned, the `deposit` function returns a `chains` array and a `from` function. The `chains` array corresponds to the chains you can deposit the given asset from (for the asset that was initially passed into the `deposit` function). An example of the `chains` array is as follows:

```js
chains: [
  {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  }
]
```

#### From {: #from }

The `from` function requires a chain key to be passed into it for the origin chain in which the assets are sent from and returns a `get` function. 

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);

await from(polkadot);
```

#### Get {: #get-deposit } 

The `get` function requires that you pass in the receiving account on Moonbeam and the Polkadot signer for the sending account on Polkadot, and it gets the data required for the deposit. An example of the response for calling `get` to send DOT from Polkadot to Moonbeam is as follows:

```js
{
  asset: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  existentialDeposit: 10000000000n,
  min: 33068783n,
  moonChainFee: undefined,
  native: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  origin: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  source: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  sourceBalance: 0n,
  sourceFeeBalance: undefined,
  sourceMinBalance: 0n,
  getFee: [AsyncFunction: getFee],
  send: [AsyncFunction: send]
}
```

There are two functions returned: `send` and `getFee`.

#### Send {: #send-deposit }

When calling `send`, you will actually send the deposit request that has been built using the `deposit`, `from`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` DOT from Polkadot to Moonbeam, as DOT has 10 decimals.

You can refer back to the example in the [Deposit](#deposit) section to see how the `send` function is used.

#### Get Fee {: #get-fee-deposit }

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `deposit` function. An example of getting the fee in Polkadot for transferring DOT to Moonbeam is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function getDepositFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { from } = moonbeam.deposit(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT-MOONBEAM-ADDRESS',
    polkadotSigner,
  );

  const fee = await getFee('INSERT-AMOUNT'));
  console.log(`Fee to deposit is estimated to be: ${toDecimal(fee, asset.decimals)} ${dot}`);
}

getDepositFee();
```

### Withdraw {: #withdraw }

To withdraw an asset from Moonbeam to send back to the origin network, you'll have to first build the request using information from the origin chain before you can send the request, to do so you'll take the following steps:

1. Call the `withdraw` function and pass in the asset symbol for the asset to be deposited. This will return a `chains` array containing the asset's origin network information and a `to` function which will be used to build the request
2. Call the `to` function and pass in the chain key of the origin network. Then, call `get` and pass in the address of the account on the origin network you want to withdraw the funds from and pass in the [Ethers signer](#creating-signers) if you haven't already done so during [intialization](#initializing). This will return information about the origin (destination) chain asset, the `xc` representation of the asset on Moonbeam. This will return a `send` function which already contains all the necessary info to perform the withdrawal, and it is used in the next step. In addition, other elements, such as information about the asset, are returned and might be important for logging purposes
3. The `send` function is used to send the built withdraw request along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the withdraw request, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to withdraw xcDOT from Moonbeam to send back to DOT on Polkadot is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function withdraw() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { chains, to } = moonbeam.withdraw(dot);

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

withdraw();
```

As previously mentioned, the `withdraw` function returns a `chains` array and a `to` function. The `chains` array corresponds to the chains you can withdraw the given asset from (for the asset that was initially passed into the `withdraw` function). An example of the `chains` array is as follows:

```js
chains: [
  {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  }
]
```

#### To {: #to }

The `to` function requires a chain key to be passed into it for the origin chain in which the assets are being withdrawn back to and returns a `get` function. 

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { to } = moonbeam.withdraw(dot);

await to(polkadot);
```

#### Get {: #get-deposit } 

The `get` function requires that you pass in the receiving account on the destination chain and the Ethers signer for the sending account on Moonbeam, and it gets the data required for the deposit. An example of the response for calling `get` to send xcDOT from Moonbeam back to DOT on Polkadot is as follows:

```js
{
  asset: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  destination: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  destinationBalance: 0n,
  destinationFee: 520000000n,
  existentialDeposit: 10000000000n,
  min: 10520000000n,
  native: {
    id: '42259045809535163221576417993425387648',
    erc20Id: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    originSymbol: 'DOT',
    decimals: 10
  },
  origin: {
    key: 'Polkadot',
    name: 'Polkadot',
    ws: 'wss://rpc.polkadot.io',
    weight: 1000000000,
    parachainId: 0
  },
  getFee: [AsyncFunction: getFee],
  send: [AsyncFunction: send]
}
```

There are two functions returned: `send` and `getFee`.

#### Send {: #send }

When calling `send`, you will actually send the withdraw request that has been built using the `withdraw`, `to`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` xcDOT on Moonbeam back to DOT on Polkadot.

You can refer back to the example in the [Withdraw](#withdraw) section to see how the `send` function is used.

#### Get Fee {: #get-fee }

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `withdraw` function. An example of getting the fee in GLMR for transferring xcDOT from Moonbeam back to DOT on Polkadot is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function getWithdrawFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { to } = moonbeam.withdraw(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT-POLKADOT-ADDRESS',
    { ethersSigner },
  );

  const fee = await getFee('INSERT-AMOUNT'));
  console.log(`Fee to deposit is estimated to be: ${toDecimal(fee, moonbeam.moonChain.decimals)} ${moonbeam.moonAsset.originSymbol}`););
}

getWithdrawFee();
```

## Utility Functions {: #sdk-utils }

The XCM SDK provides three utility functions: `isXcmSdkDeposit`, `isXcmSdkWithdraw`, and `toDecimal`.

### Check if Request is a Deposit  {: #deposit-check }

To determine whether a request is a deposit, you can pass in a request to the `isXcmSdkWithdraw` function and a boolean will be returned. If `true` is returned the request is a deposit, and `false` is returned if it is not.

The following are some examples:

```js
const deposit = moonbeam.deposit(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(deposit)) // Returns true
```

```js
const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(withdraw)) // Returns false
```

### Check if Request is a Withdrawal {: #withdraw-check }

To determine whether a request is a withdrawal, you can pass in a request to the `isXcmSdkWithdraw()` function and a boolean will be returned. If `true` is returned the request is a withdrawal, and `false` is returned if it is not.

The following are some examples:


```js
const withdraw = moonbeam.withdraw(moonbeam.symbols[0])
console.log(isXcmSdkWithdraw(withdraw)) // Returns true
```

```js
const deposit = moonbeam.deposit(moonbeam.symbols[0])
console.log(isXcmSdkDeposit(deposit)) // Returns false
```

### Convert Balances to Decimals {: #decimals }

To convert a balance to decimal format, you can use the `toDecimal` function which returns a given number in decimal format based on the number of decimals provided. You can optionally pass in a value a third argument to dictate the maximum number of decimal places used, otherwise the default is `6`.

For example, to convert a balance on Moonbeam from Wei to Glimmer you can use the following code:

```js
const balance = toDecimal(3999947500000000000n, 18)
console.log(balance) // Returns 3.999947
```
