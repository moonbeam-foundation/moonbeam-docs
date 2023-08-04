---
title: Register XC Assets
description: This guide includes everything you need to know to register local and external XC-20s so you can begin transferring assets cross-chain via XCM.
---

# How to Register Cross-Chain Assets

![Forum Templates Banner](/images/builders/interoperability/xcm/xc-registration/assets/assets-banner.png)

## Introduction {: #introduction }

For an asset to be transferred across chains via XCM, there needs to be an open channel between the two chains, and the asset needs to be registered on the destination chain. If a channel doesn't exist between the two chains, one will need to be opened. Please check out the [XC Channel Registration](/builders/interoperability/xcm/xc-registration/xc-integration){target=_blank} guide for information on how to establish a channel between Moonbeam and another chain.

This guide will show you how to register [external XC-20s](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank} on Moonbeam and provide the information you need to register Moonbeam assets, including Moonbeam native assets (GLMR, MOVR, and DEV) and [local XC-20s](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank} (XCM-enabled ERC-20s), on another chain.

The examples in this guide use a CLI tool developed to ease the entire process, which you can find in the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}.

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## Register External XC-20s on Moonbeam {: #register-xc-20s }

Registering External XC-20s on Moonbeam is a multi-step process that, at a high level, involves proposing the asset registration on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank} and creating an on-chain governance proposal.

If a channel between Moonbeam and the origin chain of the asset does not yet exist, one will need to be opened. You can batch the channel-related calls with the asset registration calls, so you only need to submit a single proposal. You'll need to start by creating a couple of forum posts: an [XCM Disclosure](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-disclosures){target=_blank} post and an [XCM Proposal](/builders/interoperability/xcm/xc-registration/forum-templates#xcm-proposals){target=_blank} post.

After you've collected feedback from community members, you can create a proposal to open a channel and register any assets. Please refer to the [Establishing an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-integration/){target=_blank} guide for more information on opening a channel.

![Asset registration if XC channel doesn't exist](/images/builders/interoperability/xcm/xc-registration/assets/assets-1.png)

If a channel between the chains already exists, you'll need to create a forum post to register the asset, collect feedback, and then submit the proposal to register the asset.

![Asset registration if XC channel exists](/images/builders/interoperability/xcm/xc-registration/assets/assets-2.png)

### Create a Forum Post {: #create-a-forum-post }

To create a forum post on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}, you'll need to make sure that you're adding the post to the correct category and adding relevant content. For general guidelines and a template to follow, please refer to the [Moonbeam Community Forum Templates for XCM Integrations](/builders/interoperability/xcm/xc-registration/forum-templates#){target=_blank} page.

### Create a Proposal to Register an Asset {: #create-a-proposal }

To register an asset native to another chain on Moonbeam, you'll need to submit a governance proposal that will call the `assetManager.registerForeignAsset` extrinsic. Additionally, you'll need to set the asset's units per second value through the `assetManager.setAssetUnitsPerSecond` extrinsic. The units per second value is the units of tokens to charge per second of execution time during XCM transfers. How to calculate the units per second will be covered in the following section.

To get started, you'll need to collect some information about the asset:

- The ID of the parachain the asset lives on
- The metadata of the asset. This includes:
  - The asset name
  - The asset symbol. You'll need to prepend "xc" to the asset symbol to indicate that the asset is an XCM-enabled asset
  - The number of decimals the asset has
  - The units per second
- The multilocation of the asset as seen from Moonbeam

With this information in hand, you can get the encoded calldata for both calls and batch the calldata into a single transaction. From there, you can start the governance process, which includes using the calldata to submit a preimage and then using the preimage to create a proposal. If you're also opening a channel at the same time, you can add the channel-related calldata to the batch asset registration calldata and open a single proposal for everything. Asset and channel registration proposals on Moonbeam should be assigned to the General Admin Track.

![Overview of the proposal process](/images/builders/interoperability/xcm/xc-registration/assets/assets-3.png)

### Calculate the Asset's Units Per Second {: #calculate-units-per-second }

Units per second is the number of tokens charged per second of execution of an XCM message. The target cost for an XCM transfer is $0.02 at the time of registration. The units per second might get updated through governance as the token price fluctuates.

The easiest way to calculate an asset's units per second is through the [`calculate-units-per-second.ts` script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-units-per-second.ts){target=_blank} in the [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} repository. The script accepts the following arguments:

- `--decimals` or `--d` - decimals of the tokens you are calculating the units per second for
- `--xcm-weight-cost` or `--xwc` - total weight cost of the execution of the entire XCM message. The estimated weight per XCM operation on each Moonbeam chain is:  

    === "Moonbeam"

        ```text
        800000000
        ```

    === "Moonriver"

        ```text
        800000000
        ```

    === "Moonbase Alpha"

        ```text
        638978000
        ```

- `--target` or `--t` - (optional) target price for XCM execution, defaults to `$0.02`
- `--asset` or `--a` - (optional) the token [Coingecko API ID](https://www.coingecko.com/){target=_blank}
- `--price` or `--p` - (optional) if the Coingecko API does not support the token, you can specify the price manually

For example, to calculate the units per second of DOT (Polkadot token), which has 10 decimals, on Moonbeam, you can run:

```bash
yarn calculate-units-per-second --d 10 --a polkadot --xwc 800000000 
```

Which should result in the following output (at the time of writing):  

```text
Token Price is $7.33
The UnitsPerSecond needs to be set 34106412005
```

### Generate the Encoded Calldata for the Asset Registration {: #generate-encoded-calldata-for-asset-registration }

If you're not familiar with the governance system on Moonbeam, you can find out more information on the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. With any governance proposal on Moonbeam, you'll need to submit a preimage, which defines the actions to be executed, and then use the preimage to submit a proposal.

To submit a preimage, you'll need to get the encoded calldata for each extrinsic that you want to execute. As previously mentioned, you'll use the `assetManager.registerForeignAsset`, and optionally, the `assetManager.setAssetUnitsPerSecond`, and `system.setStorage` extrinsics.

You can use the [`xcm-asset-registrator.ts` script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=_blank} to calculate the encoded calldata and even submit the preimage and proposal if you desire. Proposals must be submitted via the General Admin Track. If you're registering an asset and opening a channel, you'll want to wait to submit the preimage and proposal until you have the calldata for the channel-related calls.

To get the encoded calldata for the `assetManager.registerForeignAsset` extrinsic, you can use the following arguments:

- `--ws-provider` or `--w` - the WebSocket provider to be used for the requests. The WSS network endpoints for each Moonbeam-based network are as follows:

    === "Moonbeam"

        ```text
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"

        ```text
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.wss_url }}
        ```

- `--asset` or `--a` - the multilocation of the asset
- `--name` or `--n` - the name of the asset
- `--symbol` or `--sym` - the symbol of the asset. **Remember that "xc" should be prepended to the symbol to indicate the asset is an XCM-enabled asset**
- `--decimals` or `--d` - the number of decimals of the asset
- `--existential-deposit` or `--ed` - (optional) - the existential deposit of the registered asset. This should always be set to `1`
- `--sufficient` or `--suf` - (optional) - the sufficiency, which dictates whether an asset can be sent to an account without a native token balance. This should always be set to `true`

To create a batch transaction that also sets the units per second or revert code of the asset's precompile in addition to the asset registration, you can choose to add these arguments:

- `--units-per-second` or `--u` - (optional) - the units per second, which specifies the amount to charge per second of execution in the registered asset. You should have calculated this value in the [previous section](#calculate-units-per-second). If this is provided, the script will create a batch transaction for the governance proposal that, at a minimum, will register the asset and set the units per second on-chain
- `--revert-code` or `--revert` - (optional) - registers the revert code for the asset's precompile in the EVM. If this is provided, the script will create a batch transaction for the governance proposal that, at a minimum, will register the asset and set the revert code.

    !!! note
        **This flag is not necessary for proposals on Moonbeam** as it includes a `system.setStorage` call that the [OpenGov](/learn/features/governance#opengov) General Admin Origin can't execute. The dummy EVM bytecode can be set later with a call to the [Precompile Registry precompile](/builders/pallets-precompiles/precompiles/registry){target=_blank}, which means that you don't need to worry about going through governance to set the revert code!

As a practical example, the following command would generate the encoded calldata to register an asset from parachain 888 that has a general key of `1`:

```bash
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000001"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true
```

Its output would look like the following:

```text
Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
Encoded calldata for tx is 0x0102081f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
```

### Programatically Submit the Preimage and Proposal for Asset Registration {: #submit-preimage-proposal }

The script provides the option to programmatically submit a preimage and democracy proposal for the asset registration if you pass in the following optional arguments:

- `--account-priv-key` or `--account` - (optional) - the private key of the account that will submit the preimage and proposal
- `--sudo` or `--x` - (optional) - wraps the transaction with `sudo.sudo`. This can be used for Moonbase Alpha, if you want to provide the SCALE encoded calldata to the team so that it is submitted via SUDO
- `--send-preimage-hash` or `--h` - (optional) - submits the preimage
- `--send-proposal-as` or `--s` - (optional) - specifies how the proposal should be sent. The following options are accepted:
    - `democracy` - sends the proposal through regular democracy using Governance v1
    - `council-external` - sends the proposal as an external proposal that will be voted on by the council using Governance v1
    - `v2` - sends the proposal through OpenGov (Governance v2). This option should be used for Moonbeam. If you choose this option, you'll also need to use the `--track` argument to specify which [Track](/learn/features/governance#general-definitions--general-definitions-gov2){target=_blank} the proposal will go through and the `--delay` argument to specify the delay period (in blocks) after the proposal has passed and before the proposal is executed
- `--collectiveThreshold` or `--c` - (optional) - the number of council votes that are needed to approve the proposal. Defaults to `1`
- `--at-block` - (optional) - the block number at which the call should get executed
- `--track` - (optional) - the Track the proposal should go through for OpenGov proposals. For Moonbeam, the General Admin Origin should be used
- `--delay` - (optional) - the delay period (in blocks) after a proposal has passed and before it can be executed. Defaults to `100` blocks

Altogether, you can use the following command to submit a preimage and proposal using OpenGov, which batches the asset registration and sets the asset's units per second.

=== "Moonbeam"

    ```bash
    yarn register-asset -w wss://wss.api.moonbeam.network  \
    --asset 'INSERT_ASSET_MULTILOCATION' \
    --symbol "INSERT_TOKEN_SYMBOL" \
    --decimals INSERT_TOKEN_DECIMALS \
    --name "INSERT_TOKEN_NAME" \
    --units-per-second INSERT_UNITS_PER_SECOND \
    --existential-deposit 1 \
    --sufficient true \
    --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" \
    --send-preimage-hash true \
    --send-proposal-as v2
    --track '{ "Origins": "GeneralAdmin" }'
    ```

=== "Moonriver"

    ```bash
    yarn register-asset -w wss://wss.api.moonriver.moonbeam.network  \
    --asset 'INSERT_ASSET_MULTILOCATION' \
    --symbol "INSERT_TOKEN_SYMBOL" \
    --decimals INSERT_TOKEN_DECIMALS \
    --name "INSERT_TOKEN_NAME" \
    --units-per-second INSERT_UNITS_PER_SECOND \
    --existential-deposit 1 \
    --sufficient true \
    --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" \
    --send-preimage-hash true \
    --send-proposal-as v2
    --track '{ "Origins": "GeneralAdmin" }'
    ```

For Moonbase Alpha, you will not need to go through governance. Instead, you can use the `--sudo` flag and provide the output to the Moonbeam team so that the asset and channel can be added quickly through sudo.

You can see additional [examples in the `README.md` of the xcm-tools repository](https://github.com/Moonsong-Labs/xcm-tools#example-to-note-pre-image-and-propose-through-opengov2-with-custom-track){target=_blank}.

### Test the Asset Registration on Moonbeam {: #test-asset-registration }

After your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank} address.

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex and prepending it with F's until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank} section of the External XC-20 guide.

After the asset is successfully registered, you can try transferring tokens from your parachain to the Moonbeam-based network you are integrating with.

!!! note
    Remember that Moonbeam-based networks use AccountKey20 (Ethereum-style addresses).

For testing, please also provide your parachain WSS endpoint so that the [Moonbeam dApp](https://apps.moonbeam.network/){target=_blank} can connect to it. Lastly, please fund the corresponding account:

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

[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank} are Substrate-based assets with an [ERC-20 interface](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}. This means they can be added to MetaMask and composed with any EVM DApp that exists in the ecosystem. The team can connect you with any DApp you find relevant for an XC-20 integration.

If you need DEV tokens (the native token for Moonbase Alpha) to use your XC-20 asset, you can get some from the [Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank}, which dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours. If you need more, feel free to reach out to the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}.

## Register Moonbeam Assets on Another Chain {: #register-moonbeam-assets-on-another-chain }

In order to enable cross-chain transfers of Moonbeam assets, including Moonbeam native assets (GLMR, MOVR, DEV) and local XC-20s (XCM-enabled ERC-20s) deployed on Moonbeam, between Moonbeam and another chain, you'll need to register the assets on the other chain. Since each chain stores cross-chain assets differently, the exact steps to register Moonbeam assets on another chain will vary depending on the chain. At the very least, you'll need to know the metadata and the multilocation of the assets on Moonbeam.

There are additional steps aside from asset registration that will need to be taken to enable cross-chain integration with Moonbeam. For more information, please refer to the [Establishing an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-integration){target=_blank} guide.

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
      V3: {
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
      V3: {
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
      V3: {
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

**To be registered on other chains, local XC-20s must strictly comply with the standard ERC-20 interface as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}. In particular, the [`transfer` function](https://eips.ethereum.org/EIPS/eip-20#transfer){target=_blank} must be as described in EIP-20:**

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
