---
title: Register XC Assets
description: This guide includes everything you need to know to register local and external XC-20s so you can begin transferring assets cross-chain via XCM.
---

# How to Register Cross-Chain Assets

## Introduction {: #introduction }

For an asset to be transferred across chains via XCM, there needs to be an open channel between the two chains, and the asset needs to be registered on the destination chain. If a channel does not exist between the two chains, one will need to be opened. Please check out the [XC Channel Registration](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} guide for information on how to establish a channel between Moonbeam and another chain.

This guide will show you how to register [external XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank} on Moonbeam and provide the information you need to register Moonbeam assets, including Moonbeam native assets (GLMR, MOVR, and DEV) and [local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} (XCM-enabled ERC-20s), on another chain.

The examples in this guide use a CLI tool developed to ease the entire process, which you can find in the [xcm-tools GitHub repository](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}.

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## Register External XC-20s on Moonbeam {: #register-xc-20s }

Registering External XC-20s on Moonbeam is a multi-step process that, at a high level, involves proposing the asset registration on the [Moonbeam Community Forum](https://forum.moonbeam.network){target=\_blank} and creating an on-chain governance proposal.

If a channel between Moonbeam and the origin chain of the asset does not yet exist, one will need to be opened. You can batch the channel-related calls with the asset registration calls, so you only need to submit a single proposal. You must start by creating a couple of forum posts: an [XCM Disclosure](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-disclosures){target=\_blank} post and an [XCM Proposal](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-proposals){target=\_blank} post.

After you've collected feedback from community members, you can create a proposal to open a channel and register any assets. Please refer to the [Establishing an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} guide for more information on opening a channel.

![Asset registration if XC channel doesn't exist](/images/builders/interoperability/xcm/xc-registration/assets/assets-1.webp)

If a channel between the chains already exists, you'll need to create a forum post to register the asset, collect feedback, and then submit the proposal to register the asset.

![Asset registration if XC channel exists](/images/builders/interoperability/xcm/xc-registration/assets/assets-2.webp)

### Create a Forum Post {: #create-a-forum-post }

To create a forum post on the [Moonbeam Community Forum](https://forum.moonbeam.network){target=\_blank}, you'll need to make sure that you're adding the post to the correct category and adding relevant content. For general guidelines and a template to follow, please refer to the [Moonbeam Community Forum Templates for XCM Integrations](/builders/interoperability/xcm/xc-registration/forum-templates/#){target=\_blank} page.

### Create a Proposal to Register an Asset {: #create-a-proposal }

To register an asset native to another chain on Moonbeam, you'll need to submit a governance proposal that will call the `evmForeignAssets.createForeignAsset` extrinsic. Additionally, you'll need to register the asset's price (formerly known as units per second) through the `xcmWeightTrader.addAsset` extrinsic so that XCM fees can be properly calculated. An existing asset's price can be updated with `xcmWeightTrader.editAsset`. 

To get started, you'll need to collect some information about the asset:

- `assetId` - unique identifier of the asset. This can be any unique arbitrary integer, but it's recommended that you create this using the [`calculate-external-asset-info.ts`](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-external-asset-info.ts){target=\_blank} script. This provides a standardized way to generate a unique `assetId`
- `xcmLocation` - an [XCM multilocation](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank} of asset in its reserve chain relative to Moonbeam
- The asset name
- The asset symbol. You'll need to prepend "xc" to the asset symbol to indicate that the asset is an XCM-enabled asset
- The number of decimals the asset has

With this information in hand, you can prepare a governance proposal to register a foreign asset. Foreign asset registration proposals should be submitted through the `FastGeneralAdmin` track.

![Overview of the proposal process](/images/builders/interoperability/xcm/xc-registration/assets/assets-3.webp)

### Calculate Relative Price {: #calculate-relative-price }

An asset's `relativePrice` refers to a `u128` value that indicates how many units of said asset (in its smallest denomination) equate to one unit**—i.e., `1 × 10^18 wei`—of the native token (GLMR or MOVR). This helps determine how much of your asset to use for fees initially quoted in the native token, particularly in cross-chain messaging (XCM).

You can use the following script (also available as part of [XCM-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} ) to calculate the correct `relativePrice` value for your asset.

??? code "Calculate Relative Price"
    ```typescript
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/calculate-relative-price.ts'
    ```

If you're in a hurry, you can input the required values and continue. The following section will cover additional background information on relative price and how it's calculated. 

Only three parameters are required to calculate the relative price of an asset: 

- Asset Price (USD): A positive number representing how much 1 unit (in human-readable form) of your asset costs in USD
- Asset Decimals: The number of decimal places your asset uses. For example, if your token has 12 decimals, specify 12
- Network: Either GLMR (Moonbeam) or MOVR (Moonriver). This should correspond to the network that you're registering the asset on, and this determines which native token’s USD price the script will fetch from CoinGecko

First, ensure that you've installed the required dependencies by running:

```bash
yarn
```

Execute the script, making sure to provide the USD price of the asset you're registering, the number of decimals it has, and the network you're registering the asset on (either GLMR or MOVR):

```bash
yarn calculate-relative-price.ts <INSERT_ASSET_PRICE> <INSERT_DECIMALS> GLMR
```

For example, if the asset you're registering has a USD price of $0.25 and 12 decimals and you're registering the asset on the Moonbeam network, you would run: 

```bash
yarn calculate-relative-price.ts 0.25 12 GLMR
```

This instructs the script to calculate how many smallest units of an asset (priced at $0.25, with 12 decimals) correspond to 1 GLMR token.

--8<-- 'code/builders/interoperability/xcm/xc-registration/assets/terminal/calculate-relative-price.md'

Upon successful execution, the script prints the computed `relativePrice` as a `BigInt`. This value represents the scaled ratio between the asset’s USD price and the native token’s USD price, multiplied up to 18 decimals. You can then use this result in on-chain asset registration or fee calculation scenarios—especially where a `u128` 18-decimal format is required.

For additional info, usage details, or to see an example in action, you can invoke the help command by running: 

```bash
yarn calculate-relative-price.ts --help
```

### Generate the Encoded Calldata for the Asset Registration {: #generate-encoded-calldata-for-asset-registration }

Submitting a governance proposal on Moonbeam requires two steps: first, submit a preimage that defines the actions to be executed, then use that preimage to submit the proposal. For more details, see the [Governance on Moonbeam](/learn/features/governance/){target=\_blank} page. To submit a preimage for asset registration, you'll need the encoded calldata for both the `evmForeignAssets.createForeignAsset` and `xcmWeightTrader.addAsset` extrinsics.

Proposals must be submitted via the `FastGeneralAdmin` track. A channel must be established before an asset can be registered. To get the encoded calldata for the `evmForeignAssets.createForeignAsset` extrinsic, you will need to provide the following arguments:

- `assetId` - unique identifier of the asset, generated from the [`calculate-external-asset-info.ts`](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-external-asset-info.ts){target=\_blank} script
- `xcmLocation` - the multilocation of the asset relative to Moonbeam 
- `decimals` - the number of decimals of the asset
- `symbol`  - the symbol of the asset. Remember that "xc" should be prepended to the symbol to indicate the asset is an XCM-enabled asset
- `name` - The asset name

Using the above information, you can generate the encoded call data for the `createForeignAsset` call either via the Polkadot API or on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/extrinsics){target=\_blank}.

You can generate this required calldata using the [xcm-asset-registrator script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank} as follows:

```bash
yarn register-asset --w wss://wss.api.moonbeam.network  \
--asset 'INSERT_MULTILOCATION' \
--symbol "INSERT_ASSET_SYMBOL" \
--decimals INSERT_DECIMALS \
--name "INSERT_ASSET_NAME" \
--relative-price INSERT_RELATIVE_PRICE
```

Upon running the script with the relevant parameters, you'll see output like the following: 

--8<-- 'code/builders/interoperability/xcm/xc-registration/assets/terminal/register-asset.md'

The script will provide the encoded call data for each of the following calls:

- The `registerAsset` call
- The `setRelativePrice` call
- The `batch` call that combines each all of the above

Typically, you can submit the `batch` call as part of a single governance proposal to register the asset and set the relative price in one go under the `FastGeneralAdmin` track. However, a limitation currently requires the two calls to be submitted independently. The `registerAsset` call must be submitted under the `FastGeneralAdmin` track, and the `setRelativePrice` call must be submitted under the `GeneralAdmin` track. The latter is a temporary limitation, and in the future, it is expected to be able to submit both calls as a single `batch` call under the `FastGeneralAdmin` track.

### Construct the Add Asset Call

If you've already used the [xcm-asset-registrator script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank} shown above, you can skip this section. This section dives into more detail about how the `xcmWeightTrader.addAsset` call is constructed. To get the encoded calldata for the `xcmWeightTrader.addAsset` extrinsic, you will need to provide the following arguments:

- `xcmLocation` - the multilocation of the asset relative to Moonbeam 
- `relativePrice` - A numeric value (u128) representing the fraction of the native token’s price that your asset’s price constitutes, scaled to 18 decimals. This value calculates cross-chain fees by determining how many units of the non-native asset are required to cover XCM operation costs. 

Using the above information, you can generate the encoded call data for the `addAsset` call either via the Polkadot API or on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/extrinsics){target=\_blank}.

To create a batch transaction that combines both the `xcmWeightTrader.addAsset` and the `evmForeignAssets.createForeignAsset` calls together, you can use the [Polkadot API's Batch Method](/builders/substrate/libraries/polkadot-js-api/#batching-transactions){target=\_blank}. As mentioned previously, the [XCM Asset Registrator](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank} script can help you build and submit the required calls. 

### Submit the Preimage and Proposal for Asset Registration {: #submit-preimage-proposal }

Your next task is to submit the preimage of your batched call containing both the `xcmWeightTrader.addAsset` and the `evmForeignAssets.createForeignAsset` by following the guidelines in the [Submit a Democracy Proposal Guide](/tokens/governance/proposals/#submitting-a-preimage-of-the-proposal){target=\_blank}.

For Moonbase Alpha, you do not need to go through governance, as Moonbase Alpha has `sudo` access. Instead, you can provide the output of the batch call data to the Moonbeam team, and the Moonbeam Team can submit the call with `sudo`. This will be a faster and easier process than going through governance. However, you may still wish to go through governance on Moonbase Alpha to prepare for Moonbeam's governance process.

After submitting the preimage, you can submit the proposal by following the guidelines in the [Submitting a Proposal](/tokens/governance/proposals/#submitting-a-proposal-v2){target=\_blank} section.

If you prefer the script method and you're comfortable working with the scripts in the XCM tools repo, you can use the [Generic Call Proposer](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/generic-call-proposer.ts){target=\_blank} by passing in the requisite calls, including the acceptance and proposal of the XCM Channel, and the asset registration. 

### Test the Asset Registration on Moonbeam {: #test-asset-registration }

After your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=\_blank} address. Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex and prepending it with F's until you get a 40-hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=\_blank} section of the External XC-20 guide. After the asset is successfully registered, you can transfer tokens from your parachain to the Moonbeam-based network you are integrating with.

!!! note
    Remember that Moonbeam-based networks use AccountKey20 (Ethereum-style addresses).

For testing, please also provide your parachain WSS endpoint so that the [Moonbeam dApp](https://apps.moonbeam.network){target=\_blank} can connect to it. Lastly, please fund the corresponding account:

=== "Moonbeam"

    ```text
    AccountId: {{ networks.moonbeam.xcm.channel.account_id }}
    Hex:       {{ networks.moonbeam.xcm.channel.account_id_hex }}
    ```

=== "Moonriver"

    ```text
    AccountId: {{ networks.moonriver.xcm.channel.account_id }}
    Hex:       {{ networks.moonriver.xcm.channel.account_id_hex }}
    ```

=== "Moonbase Alpha"

    ```text
    AccountId: {{ networks.moonbase.xcm.channel.account_id }}
    Hex:       {{ networks.moonbase.xcm.channel.account_id_hex }}
    ```

!!! note
    For Moonbeam and Moonriver testing, please send $50 worth of tokens to the aforementioned account. In addition, provide an Ethereum-style account to send $50 worth of GLMR/MOVR for testing purposes.

[XC-20s](/builders/interoperability/xcm/xc20/){target=\_blank} are Substrate-based assets with an [ERC-20 interface](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=\_blank}. This means they can be added to MetaMask and composed with any EVM DApp that exists in the ecosystem. The team can connect you with any DApp you find relevant for an XC-20 integration.

If you need DEV tokens (the native token for Moonbase Alpha) to use your XC-20 asset, you can get some from the [Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=\_blank}, which dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours. If you need more, feel free to reach out to the team on [Telegram](https://t.me/Moonbeam_Official){target=\_blank} or [Discord](https://discord.com/invite/PfpUATX){target=\_blank}.

### Set XC-20 Precompile Bytecode {: #set-bytecode }

Once your XC-20 has been registered on Moonbeam, you can set the XC-20's precompile bytecode. This is necessary because precompiles are implemented inside the Moonbeam runtime and, by default, do not have bytecode. In Solidity, when a contract is called, there are checks that require the contract bytecode to be non-empty. So, setting the bytecode as a placeholder bypasses these checks and allows the precompile to be called.

You can use the [Precompile Registry](/builders/ethereum/precompiles/utility/registry/){target=\_blank}, which is a Solidity interface, to update the XC-20 precompile's bytecode to avoid any issues and ensure that the precompile is callable from Solidity. To do so, you'll use the Precompile Registry's [`updateAccountCode` function](/builders/ethereum/precompiles/utility/registry/#the-solidity-interface){target=\_blank}.

To get started, you'll need to [calculate your XC-20's precompile address](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=\_blank} and have the Precompile Registry's ABI.

??? code "Precompile Registry ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/abi.js'
    ```

Then, you can use the following scripts to set the dummy code for your XC-20's precompile.

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/web3.py'
    ```

After running the script to set the bytecode, you should see `The XC-20 precompile's bytecode is: 0x60006000fd` printed to your terminal.

## Register Moonbeam Assets on Another Chain {: #register-moonbeam-assets-on-another-chain }

To enable cross-chain transfers of Moonbeam assets, including Moonbeam native assets (GLMR, MOVR, DEV) and local XC-20s (XCM-enabled ERC-20s) deployed on Moonbeam, between Moonbeam and another chain, you'll need to register the assets on the other chain. Since each chain stores cross-chain assets differently, the exact steps to register Moonbeam assets on another chain will vary depending on the chain. At the very least, you'll need to know the metadata and the multilocation of the assets on Moonbeam.

There are additional steps aside from asset registration that will need to be taken to enable cross-chain integration with Moonbeam. For more information, please refer to the [Establishing an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} guide.

### Register Moonbeam Native Assets on Another Chain {: #register-moonbeam-native-assets }

The metadata for each network is as follows:

=== "Moonbeam"
    |      Variable       |        Value        |
    |:-------------------:|:-------------------:|
    |        Name         |       Glimmer       |
    |       Symbol        |        GLMR         |
    |      Decimals       |         18          |
    | Existential deposit | 1 (1 * 10^-18 GLMR) |

=== "Moonriver"
    |      Variable       |        Value        |
    |:-------------------:|:-------------------:|
    |        Name         |      Moonriver      |
    |       Symbol        |        MOVR         |
    |      Decimals       |         18          |
    | Existential deposit | 1 (1 * 10^-18 MOVR) |

=== "Moonbase Alpha"
    |      Variable       |       Value        |
    |:-------------------:|:------------------:|
    |        Name         |        DEV         |
    |       Symbol        |        DEV         |
    |      Decimals       |         18         |
    | Existential deposit | 1 (1 * 10^-18 DEV) |

The multilocation of Moonbeam native assets includes the parachain ID of the Moonbeam network and the pallet instance where Moonbeam assets live, which corresponds to the index of the Balances Pallet. The multilocation for each network is as follows:

=== "Moonbeam"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2004
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2023
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 1000
            },
            {
              PalletInstance: 3
            }
          ]
        }
      }
    }
    ```

### Register Local XC-20s on Another Chain {: #register-local-xc20 }

The multilocation for local XC-20s include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

**To be registered on other chains, local XC-20s must strictly comply with the standard ERC-20 interface as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=\_blank}. In particular, the [`transfer` function](https://eips.ethereum.org/EIPS/eip-20#transfer){target=\_blank} must be as described in EIP-20:**

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

If the function selector of the `transfer` function deviates from the standard, the cross-chain transfer will fail.

You can use the following multilocation to register a local XC-20:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 2004
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 2023
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          { 
            Parachain: 1000
          },
          {
            PalletInstance: 48
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

Since local XC-20s are ERC-20s on Moonbeam, there are no deposits required to create an ERC-20 on Moonbeam. However, deposits may be required to register the asset on another parachain. Please consult with the parachain team you wish to register the asset with for more information.

## Managing XC Assets 

After completing the [registration process](#introduction) for an XC asset, you may need to periodically update asset details, such as the XCM multilocation details or asset price. This section will cover these topics.

### Updating Foreign Asset XCM Location {: #updating-foreign-asset-xcm-location }

You can update the multilocation of an asset with the `evmForeignAssets.changeXcmLocation` call, which takes as parameters the `assetId` and the new multilocation. You'll need to raise a [governance proposal](/tokens/governance/proposals/) and submit the update under the `GeneralAdmin` track. If you're testing in Moonbase Alpha, you can ask the Moonbeam Team to submit the extrinsic using Sudo to speed up the process. You can also submit the requisite governance proposal on Moonbase Alpha. 

### Freezing a Foreign Asset {: #freezing-a--foreign-asset }

You can freeze a foreign asset by calling `evmForeignAssets.freezeForeignAsset`, which takes as parameters the `assetId` and an `allowXcmDeposit` boolean. If set to true, XCM deposits from remote chains will still be allowed and mint tokens. If set to false, XCM deposits from remote chains will fail as no minting will be permitted. 

### Paying XCM Fees with Foreign Assets {: #paying-xcm-fees-with-foreign-assets }

After you've registered the foreign asset via the `evmForeignAssets` and the `xcmWeightTrader` pallet, your asset will now be among the supported assets for paying XCM fees. To verify, you can query the `xcmWeightTrader` pallet and the `supportedAssets` chain state query. Toggle the **Include Option** slider off to see the complete list, or you can filter the list by the multilocation of your asset. 