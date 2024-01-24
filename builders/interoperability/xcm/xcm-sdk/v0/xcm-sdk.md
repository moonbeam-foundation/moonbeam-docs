---
title: XCM SDK v0
description: Use the Moonbeam XCM SDK to easily deposit and withdraw cross-chain assets to Moonbeam from Polkadot and other parachains in the ecosystem.
---

# Using the Moonbeam XCM SDK: v0

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers. To deposit or withdraw assets, you simply define the asset and origin chain you want to deposit from or withdraw back to, along with the sending account's signer, and the amount to send.

The XCM SDK offers simple helper functions like `deposit` and `withdraw`, that provide a very simple interface to execute XCM transfers between chains in the Polkadot/Kusama ecosystem. In addition, the XCM config package allows any parachain project to add their information in a standard way, so they can be immediately supported by the XCM SDK.

For an overview of the available methods and interfaces in the Moonbeam XCM SDK, please refer to the [Reference for v0](/builders/interoperability/xcm/xcm-sdk/v0/reference){target=_blank} page.

If you're using v1.x, please refer to the [SDK guides specific to v1](/builders/interoperability/xcm/xcm-sdk/v1/){target=_blank}.

The examples in this guide are shown on Moonbeam, but can be adapted to be used on Moonriver or Moonbase Alpha.

## Getting Started {: #getting-started }

To get started with the XCM SDK, you'll first need to install the corresponding NPM package. Next, you'll also need to create signers to be used to sign transactions to transfer assets between Moonbeam and another chain within the Polkadot ecosystem. Lastly, you'll need to initialize the API which will provide you with asset and chain information and the necessary functions to deposit, withdraw, and subscribe to balance information.

### Installation {: #installation }

For the purposes of this guide you'll need to install two packages: the XCM SDK package, and the XCM config package.

The XCM SDK package will enable you to easily deposit and withdraw assets, and subscribe to balance information for each of the supported assets.

The XCM config package will be used to obtain origin asset and chain information for each of the supported assets. The config package also includes native asset and chain information for each of the Moonbeam-based networks, as well as some underlying functions of the SDK.

To install the XCM SDK and XCM config packages, you can run the following command:

```bash
npm install @moonbeam-network/xcm-sdk @moonbeam-network/xcm-config
```

You need to have peer dependencies, like [Ethers.js](https://docs.ethers.org/){target=_blank} and the [Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank} installed.

You can install them by running the following command:

```bash
npm i @polkadot/api-augment @polkadot/types @polkadot/util @polkadot/util-crypto ethers
```

!!! note
    There is a [known issue](https://github.com/polkadot-js/api/issues/4315){target=_blank} when using the Moonbeam XCM packages alongside Polkadot.js with Node.js (JavaScript) that will cause package conflict warnings to appear in the console. Using TypeScript is recommended.

### Creating Signers {: creating-signers }

When interacting with the `deposit` and `withdraw` functions of the XCM SDK, you'll need to provide an [Ethers.js](https://docs.ethers.org/){target=_blank} and [Polkadot.js](https://polkadot.js.org/docs/api/){target=_blank} signer, which will be used to sign and send the transactions. The Ethers signer is used to sign transactions on Moonbeam, and the Polkadot signer will be used to sign transactions on the origin chain you're depositing assets from.

You can pass, for example, a [MetaMask signer into Ethers](https://docs.ethers.org/v6/getting-started/#starting-connecting){target=_blank} or another compatible wallet. Similarly with Polkadot, you can [pass a compatible wallet to the signer using the `@polkadot/extension-dapp` library](https://polkadot.js.org/docs/extension/){target=_blank}.

To create a signer for Ethers.js and Polkadot.js, you can refer to the following code snippets. In this example, you can use a Polkadot.js Keyring to sign transactions on the origin chain for deposits. Please note that this approach is not recommended for production applications. **Never store your private key or mnemonic in a JavaScript or TypeScript file.**

=== "Moonbeam"

    ```js
    import { ethers } from 'ethers';
    import { Keyring } from '@polkadot/api';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}',
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });
    const ethersSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);

    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri(mnemonic);
    ```

=== "Moonriver"

    ```js
    import { ethers } from 'ethers';
    import { Keyring } from '@polkadot/api';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}',
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
      chainId: providerRPC.moonriver.chainId,
      name: providerRPC.moonriver.name,
    });
    const ethersSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);

    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri('INSERT_MNEMONIC');
    ```

=== "Moonbase Alpha"

    ```js
    import { ethers } from 'ethers';
    import { Keyring } from '@polkadot/api';

    // Set up Ethers provider and signer
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
      chainId: providerRPC.moonbase.chainId,
      name: providerRPC.moonbase.name,
    });
    const ethersSigner = new ethers.Wallet('INSERT_PRIVATE_KEY', provider);

    // Set up Polkadot keyring
    const keyring = new Keyring({ type: 'sr25519' });
    const polkadotKeyring = keyring.addFromUri('INSERT_MNEMONIC');
    ```

### Initialization {: #initializing }

To be able to deposit, withdraw, and subscribe to balance information for all of the supported assets, you'll need to start off by importing the `init` function from the XCM SDK and call it:

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init();
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init();
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init();
    ```

If you intend to support a specific wallet, you can pass a signer into the `init` function right away. Otherwise, you'll be able to pass a signer directly when building the transfer data for a deposit or withdraw. To pass in a signer for [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank} and [Polkadot](/builders/build/substrate-api/polkadot-js-api){target=_blank}, you can use the following snippet:

=== "Moonbeam"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbeam } = init({
      ethersSigner: 'INSERT_ETHERS_SIGNER',
      polkadotSigner: 'INSERT_POLKADOT_SIGNER',
    });
    ```

=== "Moonriver"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonriver } = init({
      ethersSigner: 'INSERT_ETHERS_SIGNER',
      polkadotSigner: 'INSERT_POLKADOT_SIGNER',
    });
    ```

=== "Moonbase Alpha"

    ```js
    import { init } from '@moonbeam-network/xcm-sdk';
    const { moonbase } = init({
      ethersSigner: 'INSERT_ETHERS_SIGNER',
      polkadotSigner: 'INSERT_POLKADOT_SIGNER',
    });
    ```

## Using the SDK Interfaces {: #using-the-api }

The Moonbeam SDK provides an API which includes a series of [interfaces](/builders/interoperability/xcm/xcm-sdk/v0/reference/#core-sdk-interfaces){target=_blank} to get asset information for each of the supported assets, chain information for the initialized network, and functions to enable deposits, withdrawals, and subscription to balance information.

Make sure you have [initialized](#initializing) the Moonbeam network you want to interact with first.

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

### Moonbeam Native Asset Data {: #native-assets }

To get information about each of the Moonbeam network's native protocol asset, such as the [precompile contract address](/builders/pallets-precompiles/precompiles/erc20){target=_blank} and the origin symbol, you can access the `moonAsset` property:

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

### Moonbeam Native Chain Data {: #native-chain-data }

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

Here, the units per second refer to units of token (in this case Wei) that is charged per second of execution of the XCM message. You can find more information in the [XCM fees page](/builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=_blank}.

## Using the SDK Methods {: #using-the-sdk-methods }

The Moonbeam SDK provides an API that includes [functions](/builders/interoperability/xcm/xcm-sdk/v0/reference/#core-sdk-methods){target=_blank} which enable deposits, withdrawals, and subscription to balance information, in addition to a few utility functions.

Make sure you have [initialized](#initializing) the Moonbeam network you want to interact with first. You'll also need to make sure you've [created signers](#creating-signers) in order to sign and send deposit and withdraw transfer data.

### Deposit {: #deposit }

To deposit an asset to Moonbeam from another network, you'll have to first build the transfer data using information from the origin chain before you can send it. You'll need to use a series of deposit methods to build the transfer data.

The process for building and sending a deposit transfer data is as follows:

1. Call the `deposit` function and pass in the [asset symbol](#asset-symbols) or the [asset object](#assets) for the asset to be deposited. This will return a [`chains` array](#chains-deposit) containing the asset's origin network information and a `from` function which will be used to build the transfer data
2. Call the `from` function and pass in the chain key or the chain object of the origin network. You can get the chain object from the `chains` array returned from the `deposit` function. You can get the chain key one of two ways: by accessing the key property of the chain object (`chain.key`) or by directly importing `ChainKey` from the XCM config package (as seen in the example below)
3. Call `get` and pass in the address of the account on Moonbeam you want to deposit the funds to and a signer or Polkadot address depending on how your code is configured, please refer to the [Get](#get-deposit) section for more information. For the purposes of this guide, you'll need to pass in a Polkadot.js `Keyring` to sign the transaction as created in the [Creating Signers](#creating-signers) section. The `get` function returns a `send` function which already contains all the necessary info to perform the deposit, and it is used in the next step. In addition, other elements such as information about the origin chain asset and the `xc` representation of the asset on Moonbeam are returned and might be important for logging purposes
4. The `send` function is used to send the built deposit transfer data along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the deposit transfer data, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to deposit DOT from the Polkadot relay chain to xcDOT on Moonbeam is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function deposit() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { chains, from } = moonbeam.deposit(dot);

  console.log(
    `\nYou can deposit ${dot} from these chains: `,
    chains.map((chain) => chain.name)
  );

  const { asset, sourceBalance, source, min, send } = await from(polkadot).get(
    'INSERT_MOONBEAM_ADDRESS',
    polkadotKeyring // See the Get section for other accepted arguments
  );

  console.log(
    `Your ${asset.originSymbol} balance in ${source.name}: ${toDecimal(
      sourceBalance,
      asset.decimals
    ).toFixed()}. Minimum transferable amount is: ${toDecimal(
      min,
      asset.decimals
    ).toFixed()}`
  );

  await send('INSERT_AMOUNT', (event) => console.log(event));
}

deposit();
```

#### Chains {: #chains-deposit }

As previously mentioned, the `deposit` function returns a `chains` array and a [`from` function](#from). The `chains` array corresponds to the chains you can deposit the given asset from (for the asset that was initially passed into the `deposit` function). An example of the `chains` array is as follows:

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
from(polkadot);
```

#### Get {: #get-deposit }

The `get` function requires that you pass in the receiving account on Moonbeam and a [Polkadot signer](/builders/build/substrate-api/polkadot-js-api){target=_blank} or the sending account on Polkadot depending on how you set up your Polkadot signer, and it gets the data required for the deposit.

If you have a Polkadot compatible signer, you can pass the signer into the `init` function, then in the `get` function you can pass the Polkadot address for the second argument:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT_MOONBEAM_ADDRESS',
  'INSERT_POLKADOT_ADDRESS',
);
```

If you have a Polkadot compatible signer but haven't passed it into the `init` function, then in the `get` function you can pass in the Polkadot address for the second argument and the Polkadot signer for the third argument:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT_MOONBEAM_ADDRESS',
  'INSERT_POLKADOT_ADDRESS',
  { polkadotSigner },
);
```

If you have a Polkadot Keyring pair, as originally was set up in the [Initialization](#initializing) section, you'll pass in the `polkadotKeyring` as the second parameter:


```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { from } = moonbeam.deposit(dot);
const response = await from(polkadot).get(
  'INSERT_MOONBEAM_ADDRESS',
  polkadotKeyring,
);
```

An example of the response for calling `get` to send DOT from Polkadot to Moonbeam is as follows:

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
  moonChainFee: {
    amount: 33068783n,
    decimals: 10,
    symbol: 'DOT'
  },
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

Where the returned values are as follows:

|        Value         |                                                                                                                                                                       Description                                                                                                                                                                       |
|:--------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       `asset`        |                                                                                                                                                         the [asset](#assets) to be transferred                                                                                                                                                          |
| `existentialDeposit` | the [existential deposit](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#:~:text=On%20the%20Polkadot%20network%2C%20an,the%20Existential%20Deposit%20(ED).){target=_blank}, or the minimum amount an address must <br> hold to be considered active if one exists, otherwise `0n` is returned |
|        `min`         |                                                                                                                                                            the minimum transferrable amount                                                                                                                                                             |
|    `moonChainFee`    |                   the [asset](#assets) and amount that is needed to pay for Moonbeam's XCM fees. <br> If different from the `asset` to be transferred, the fee will be sent in this <br> asset in addition to the `asset` to be transferred (as of [v0.4.0](https://github.com/moonbeam-foundation/xcm-sdk/releases/tag/v0.4.0){target=_blank})                   |
|       `native`       |                                                                                                                                                     the native [asset](#assets) of the source chain                                                                                                                                                     |
|       `origin`       |                                                                                                                                  the chain information for where the asset being transferred natively originates from                                                                                                                                   |
|       `source`       |                                                                                                                                        the chain information for where the asset being transferred is sent from                                                                                                                                         |
|   `sourceBalance`    |                                                                                                                                             the balance of the asset being transferred on the source chain                                                                                                                                              |
|  `sourceFeeBalance`  |                                                                                                    the balance in the source chain's native asset to pay a fee for the asset <br> to be transferred if applicable, otherwise `undefined` is returned                                                                                                    |
|  `sourceMinBalance`  |                                                                                                                                         the minimum balance of the asset being transferred on the source chain                                                                                                                                          |
|       `getFee`       |                                                                                                                                  a function that [estimates the fees](#get-fee-deposit) for withdrawing a given amount                                                                                                                                  |
|        `send`        |                                                                                                                                            a function that [sends](#send-deposit) the deposit transfer data                                                                                                                                             |

#### Send {: #send-deposit }

When calling `send`, you will actually send the deposit transfer data that has been built using the `deposit`, `from`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` DOT from Polkadot to Moonbeam, as DOT has 10 decimals.

You can refer back to the example in the [Deposit](#deposit) section to see how the `send` function is used.

#### Get Fee {: #get-fee-deposit }

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `deposit` function. An example of getting the fee in Polkadot for transferring DOT to Moonbeam is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';
import { init } from '@moonbeam-network/xcm-sdk';
import { toDecimal } from '@moonbeam-network/xcm-utils';

// ...

async function getDepositFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { from } = moonbeam.deposit(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT_MOONBEAM_ADDRESS',
    polkadotKeyring // See the Get section for other accepted arguments
  );

  const fee = await getFee('INSERT_AMOUNT');
  console.log(
    `Fee to deposit is estimated to be: ${toDecimal(
      fee,
      asset.decimals
    ).toFixed()} ${dot}`
  );
}

getDepositFee();
```

### Withdraw {: #withdraw }

To withdraw an asset from Moonbeam to send back to the origin network, you'll have to first build the transfer data using information from the origin chain before you can send it. To do so, you'll take the following steps:

1. Call the `withdraw` function and pass in the [asset symbol](#asset-symbols) or the [asset object](#assets). This will return a [`chains` array](#chains-withdraw) containing the asset's origin network information and a `to` function which will be used to build the transfer data
2. Call the `to` function and pass in the chain key of the origin network. You can get the chain object from the `chains` array returned from the `withdraw` function. You can get the chain key one of two ways: by accessing the key property of the chain object (`chain.key`) or by directly importing `ChainKey` from the XCM config package (as seen in the example below)
3. Call `get` and pass in the address of the account on the origin network you want to withdraw the funds from and pass in the [Ethers signer](#creating-signers) if you haven't already done so during [intialization](#initializing). This will return information about the origin (destination) chain asset, the `xc` representation of the asset on Moonbeam. This will return a `send` function which already contains all the necessary info to perform the withdrawal, and it is used in the next step. In addition, other elements, such as information about the asset, are returned and might be important for logging purposes
4. The `send` function is used to send the built withdraw transfer data along with the amount to send. You can optionally provide a callback function to handle the extrinsic events

To obtain some of the data required to build the withdraw transfer data, such as the asset symbol and chain key of the origin network, you can import `AssetSymbol` and `ChainKey` from the `@moonbeam-network/xcm-config` package.

An example of the steps described above to withdraw xcDOT from Moonbeam to send back to DOT on Polkadot is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

async function withdraw() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { chains, to } = moonbeam.withdraw(dot);

  console.log(
    `\nYou can withdraw ${dot} to these chains: `,
    chains.map((chain) => chain.name)
  );

  const { asset, destination, destinationBalance, min, send } = await to(
    polkadot
  ).get('INSERT_POLKADOT_ADDRESS', {
    ethersSigner: signer, // Only required if you didn't pass the signer in on initialization
  });

  console.log(
    `Your ${asset.originSymbol} balance in ${destination.name}: ${toDecimal(
      destinationBalance,
      asset.decimals
    ).toFixed()}. Minimum transferable amount is: ${toDecimal(
      min,
      asset.decimals
    ).toFixed()}`
  );

  await send('INSERT_AMOUNT', (event) => console.log(event));
}

withdraw();
```

#### Chains {: #chains-withdraw }

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

to(polkadot);
```

#### Get {: #get-withdraw }

The `get` function requires that you pass in the receiving account on the destination chain and the [Ethers signer](#creating-signers) for the sending account on Moonbeam, and it gets the data required for the withdraw.

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';

...

const dot = AssetSymbol.DOT;
const polkadot = ChainKey.Polkadot;

const { to } = moonbeam.deposit(dot);
const response =  await to(
    polkadot,
  ).get('INSERT_POLKADOT_ADDRESS',
  { ethersSigner: signer } // Only required if you didn't pass the signer in on initialization
)
```

An example of the response for calling `get` to send xcDOT from Moonbeam back to DOT on Polkadot is as follows:

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
  minXcmFeeAsset: {
    amount: 0n,
    decimals: 10,
    symbol: "DOT",
  },
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
  originXcmFeeAssetBalance: undefined,
  getFee: [AsyncFunction: getFee],
  send: [AsyncFunction: send]
}
```

Where the returned values are as follows:

|           Value            |                                                                                                                                                                       Description                                                                                                                                                                       |
|:--------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|          `asset`           |                                                                                                                                                         the [asset](#assets) to be transferred                                                                                                                                                          |
|       `destination`        |                                                                                                                                            the chain information for where the asset is being transferred to                                                                                                                                            |
|    `destinationBalance`    |                                                                                                                                           the balance of the asset being transferred on the destination chain                                                                                                                                           |
|      `destinationFee`      |                                                                                                                                            the fee for the asset to be transferred on the destination chain                                                                                                                                             |
|    `existentialDeposit`    | the [existential deposit](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-#:~:text=On%20the%20Polkadot%20network%2C%20an,the%20Existential%20Deposit%20(ED).){target=_blank}, or the minimum amount an address must <br> hold to be considered active if one exists, otherwise `0n` is returned |
|           `min`            |                                                                                                                                             the minimum transferable amount of the asset being transferred                                                                                                                                              |
|      `minXcmFeeAsset`      |                                                                                                                              the minimum transferable amount of the asset that needs to be sent along to pay for the fees                                                                                                                               |
|          `native`          |                                                                                                                                                     the native [asset](#assets) of the source chain                                                                                                                                                     |
|          `origin`          |                                                                                                                                  the chain information for where the asset being transferred natively originates from                                                                                                                                   |
| `originXcmFeeAssetBalance` |                                                                                                                     the balance in the origin account of the asset that is sent along with the transfer to pay for the fees, if any                                                                                                                     |
|          `getFee`          |                                                                                                                                  a function that [estimates the fees](#get-fee-withdraw) for depositing a given amount                                                                                                                                  |
|           `send`           |                                                                                                                                           a function that [sends](#send-withdraw) the withdraw transfer data                                                                                                                                            |

#### Send {: #send-withdraw }

When calling `send`, you will actually send the withdraw transfer data that has been built using the `withdraw`, `to`, and `get` functions. You simply have to pass in a specified amount to send and an optional callback for handling the extrinsic event. For example, entering `10000000000n` will send `1` xcDOT on Moonbeam back to DOT on Polkadot.

You can refer back to the example in the [Withdraw](#withdraw) section to see how the `send` function is used.

#### Get Fee {: #get-fee-withdraw }

The `getFee` function estimates the fees for transferring a given amount of the asset specified in the `withdraw` function. An example of getting the fee in GLMR for transferring xcDOT from Moonbeam back to DOT on Polkadot is as follows:

```js
import { AssetSymbol, ChainKey } from '@moonbeam-network/xcm-config';
import { init } from '@moonbeam-network/xcm-sdk';
import { toDecimal } from '@moonbeam-network/xcm-utils';

// ...

async function getWithdrawFee() {
  const dot = AssetSymbol.DOT;
  const polkadot = ChainKey.Polkadot;

  const { to } = moonbeam.withdraw(dot);
  const { asset, getFee } = await from(polkadot).get(
    'INSERT_POLKADOT_ADDRESS',
    { ethersSigner } // Only required if you didn't pass the signer in on initialization
  );

  const fee = await getFee('INSERT_AMOUNT');
  console.log(
    `Fee to deposit is estimated to be: ${toDecimal(
      fee,
      moonbeam.moonChain.decimals
    ).toFixed()} ${moonbeam.moonAsset.originSymbol}`
  );
}

getWithdrawFee();
```

### Subscribe to Assets Balance Information {: #subscribe }

To subscribe to balance information and get a given account's latest balance for each of the supported assets, you can use the `subscribeToAssetsBalanceInfo` function and pass in the address you want to get the balance for and a callback function to handle the data:

=== "Moonbeam"

    ```js
    moonbeam.subscribeToAssetsBalanceInfo('INSERT_ADDRESS', cb);
    ```

=== "Moonriver"

    ```js
    moonriver.subscribeToAssetsBalanceInfo('INSERT_ADDRESS', cb);
    ```

=== "Moonbase Alpha"

    ```js
    moonbase.subscribeToAssetsBalanceInfo('INSERT_ADDRESS', cb);
    ```

The following example retrieves the balance information for a given account on Moonbeam and prints the balance for each of the supported assets to the console:

```js
const unsubscribe = await moonbeam.subscribeToAssetsBalanceInfo(
  'INSERT_MOONBEAM_ADDRESS',
  (balances) => {
    balances.forEach(({ asset, balance, origin }) => {
      console.log(
        `${balance.symbol}: ${toDecimal(
          balance.balance,
          balance.decimals
        ).toFixed()} (${origin.name} ${asset.originSymbol})`
      );
    });
  }
);

unsubscribe();
```

### Utility Functions {: #sdk-utils }

There are utility functions in both the XCM SDK and the XCM Utilities packages. The XCM SDK provides the following SDK-related utility functions:

- [`isXcmSdkDeposit`](#deposit-check)
- [`isXcmSdkWithdraw`](#withdraw-check)

And the XCM Utilities package provides the following generic utility functions:

- [`toDecimal`](#decimals)
- [`toBigInt`](#decimals)
- [`hasDecimalOverflow`](#decimals)

#### Check if Transfer Data is for a Deposit  {: #deposit-check }

To determine whether transfer data is for a deposit, you can pass in transfer data to the `isXcmSdkDeposit` function and a boolean will be returned. If `true` is returned the transfer data is for a deposit, and `false` is returned if it is not.

The following are some examples:

```js
import { init, isXcmSdkDeposit } from '@moonbeam-network/xcm-sdk';

...

const deposit = moonbeam.deposit(moonbeam.symbols[0]);
console.log(isXcmSdkDeposit(deposit)); // Returns true
```

```js
import { init, isXcmSdkDeposit } from '@moonbeam-network/xcm-sdk';

...

const withdraw = moonbeam.withdraw(moonbeam.symbols[0]);
console.log(isXcmSdkDeposit(withdraw)); // Returns false
```

#### Check if Transfer Data is for a Withdrawal {: #withdraw-check }

To determine whether transfer data is for a withdrawal, you can pass in transfer data to the `isXcmSdkWithdraw` function and a boolean will be returned. If `true` is returned the transfer data is for a withdrawal, and `false` is returned if it is not.

The following are some examples:

```js
import { init, isXcmSdkWithdraw } from '@moonbeam-network/xcm-sdk';

...

const withdraw = moonbeam.withdraw(moonbeam.symbols[0]);
console.log(isXcmSdkWithdraw(withdraw)); // Returns true
```

```js
import { init, isXcmSdkWithdraw } from '@moonbeam-network/xcm-sdk';

...

const deposit = moonbeam.deposit(moonbeam.symbols[0]);
console.log(isXcmSdkDeposit(deposit)); // Returns false
```

#### Convert Balance to Decimal or BigInt {: #decimals }

To convert a balance to decimal format, you can use the `toDecimal` function, which returns a given number in decimal format based on the number of decimals provided. You can optionally pass in a value for a third argument to dictate the maximum number of decimal places used; otherwise, the default is `6`; and a fourth argument that dictates the [rounding method](https://mikemcl.github.io/big.js/#rm){target=_blank} of the number.
The `toDecimal` function returns a Big number type that you can convert to a number or string using its methods `toNumber`, `toFixed`, `toPrecision`, and `toExponential`. We recommend using them as a string, since big numbers or numbers with a lot of decimals can lose precision when using number types.

To convert from decimal number back to BigInt, you can use the `toBigInt` function which returns a given number in BigInt format based on the number of decimals provided.

For example, to convert a balance on Moonbeam from Wei to Glimmer you can use the following code:

```js
import { toDecimal, toBigInt } from '@moonbeam-network/xcm-utils';

const balance = toDecimal(3999947500000000000n, 18).toFixed();
console.log(balance); // Returns '3.999947'

const big = toBigInt('3.999947', 18);
console.log(big); // Returns 3999947000000000000n
```

You can also use `hasDecimalOverflow` to make sure that a given number does not have more decimal places than allowed. This is helpful for form inputs.
