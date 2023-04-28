---
title: Open a Cross-Chain Channel
description: Learn how to establish a cross-chain integration with a Moonbeam-based network. Including opening and accepting an HRMP channel and registering assets.
---

# Establishing an XC Integration with Moonbeam

![XCM Overview Banner](/images/builders/interoperability/xcm/xc-integration/xc-integration-banner.png)

## Introduction {: #introduction }

While Cross-Chain Message Passing (XCMP) is being developed, a stop-gap protocol has been implemented called Horizontal Relay-routed Message Passing (HRMP). It has the same interface and functionality as XCMP, but the messages are stored in and read from the relay chain. Whereas with XCMP, only the message's associated metadata is stored in the relay chain. Since all messages are passed via the relay chain with HRMP, it is much more demanding on resources. As such, HRMP will be phased out once XCMP is implemented.

All XCMP channel integrations with Moonbeam are unidirectional, meaning messages flow only in one direction. If chain A initiates a channel to chain B, chain A will only be allowed to send messages to B, and B will not be able to send messages back to A. As such, chain B will also need to initiate a channel to chain A to send messages back and forth between the two chains.

Once the XCMP (or HRMP) channels have been opened, the corresponding assets from both chains will need to be registered on the opposing chain before being able to transfer them.

This guide will cover the process of opening and accepting an HRMP channel between a parachain and a Moonbeam-based network. In addition, the guide provides the necessary data to register Moonbeam-based network assets in your parachain, and the data required to register your asset in any Moonbeam-based network. 

All of the tutorials in this guide use a CLI tool developed to ease the entire process, which you can find in the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}.

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

## Moonbase Alpha XCM Integration Overview {: #moonbase-alpha-xcm }

The first step for a Moonriver/Moonbeam XCM integration is to integrate with the Moonbase Alpha TestNet, through the Alphanet relay chain. Then a Moonriver integration must be completed before proceeding with Moonbeam (if applicable).  

The entire process of getting started with Moonbase Alpha can be summarized as follows:

1. [Sync a node](#sync-a-node) with the Alphanet relay chain
2. Provide the WASM/Geneiss head hash and your parachain ID for onboarding
3. [Calculate your parachain sovereign account](#calculate-and-fund-the-parachain-sovereign-account) on the Alphanet relay chain (to be funded by the Moonbeam team)
4. Open an HRMP channel to Moonbase Alpha from your parachain (through sudo or via governance)
5. Provide the encoded call data to open an HRMP channel to your parachain, accept the incoming HRMP channel, and register the assets (if applicable). This will be executed through sudo
6. Accept the HRMP channel from Moonbase Alpha (through sudo or via governance)
7. Register Moonbase Alpha's DEV token on your parachain (optional)
8. For testing the XCM integration, please send some tokens to:

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

9. Test the XCM integration

Once all of these steps are completed, and both teams have successfully tested asset transfers, your parachain token can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}. If deposit and withdrawals work as expected, an integration with Moonriver can begin.

### Sync a Node {: #sync-a-node }

To sync a node, you can use the [Alphanet relay chain specs](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank} (note: the relay chain is Westend based, and will probably take 1 day to sync). 

For reference, you can use [Moonbase Alpha's spec file](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}. You'll need to adapt it to your chain.

To onboard your parachain, please provide the following:
- Genesis head/wasm hash
- Parachain ID. You can find the parachain IDs that have already been used in the [relay chain Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}

There are also some [snapshots for the Alphanet ecosystem relay chain](https://www.certhum.com/moonbase-databases){target=_blank} you can use to quickly get started, these are provided by the community.

When getting started with the Moonbase Alpha relay chain, once you have your node synced, please get in touch with the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can onboard your parachain to the relay chain.

### Calculate and Fund the Parachain Sovereign Account {: #calculate-and-fund-the-parachain-sovereign-account }

You can calculate the sovereign account information using [a script from the xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank}. To run the script, you must provide the parachain ID and the name of the associated relay chain. The accepted values for the relay chain are `polkadot` (default), `kusama`, and `moonbase`.

For example, Moonbase Alpha's sovereign account for both the relay chain and other parachains can be obtained with the following:

```
yarn calculate-sovereign-account --p 1000 --r moonbase
```

Which should result in the following response:  

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

When getting started with the Moonbase Alpha relay chain, once you have your sovereign account's address, please get in touch with the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can fund it at a relay chain level. If not, you won't be able to create the HRMP channel.

## Moonriver & Moonbeam XCM Integration Overview {: #moonriver-moonbeam }

From a technical perspective, the process of creating an HRMP channel with Moonriver and Moonbeam is nearly identical. However, engagement with the Moonbeam community is crucial and required before a proposal will pass.

Please check the HRMP channel guidelines that the community voted on for [Moonriver](https://moonriver.polkassembly.network/referenda/0){target=_blank} and [Moonbeam](https://moonbeam.polkassembly.network/proposal/21){target=_blank} before starting.


The process can be summarized in the following steps:

1. Open (or ensure there is) an HRMP channel from your chain to Moonriver/Moonbeam. Optionally, register MOVR/GLMR
2. Create [two Moonbeam Community forum posts](#forum-templates) with some key information for the XCM integration: 
    - An [XCM Disclosure post](#xcm-disclosures), where you'll provide some disclosures about the project, the code base, and social network channels
    - An [XCM Proposal post](#xcm-proposals), where you'll provide some technical information about the proposal itself
3. Create a batched proposal on Moonbeam/Moonriver to:
    1. Accept the incoming HRMP channel 
    2. Propose the opening of an outgoing HRMP channel from Moonriver/Moonbeam
    3. Register the asset as an [XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank} (if applicable)

      The normal enactment times are as follows:  

      - **Moonriver** - proposals should be done in the the General Admin Track from [OpenGov](/learn/features/governance/#opengov){target=_blank}, in which the Decision Period is approximately {{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}, and the enactment time is at least {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
      - **Moonbeam** - approximately a {{ networks.moonbeam.democracy.vote_period.days }}-day Voting Period plus {{ networks.moonbeam.democracy.enact_period.days }}-day enactment time

4. Accept the HRMP channel from Moonriver/Moonbeam on the connecting parachain
5. Exchange $50 worth of tokens for testing the XCM integration. Please send the tokens to:

    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    ```

6. Provide an Ethereum-styled address for MOVR/GLMR
7. Test the XCM integration with the provided tokens

Once these steps are completed succesfully, marketing efforts can be coordinated, and the new XC-20 on Moonriver/Moonbeam can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}.

## Forum Templates {: #forum-templates }

When starting an XCM integration on Moonriver or Moonbeam MainNet, there are two preliminary posts that must be made on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank} so that the voting community has the chance to provide feedback. This step is **not necessary** when connecting to Moonbase Alpha.  

It is recommended that this is done five days before the actual proposal is submitted on chain, to provide time for community feedback. 

### XCM Disclosures {: #xcm-disclosure }

The first post that should be made are the key disclosures within the [XCM Disclosures category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=_blank}, which highlights key information that are of importance in a voter's decision.

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam/Moonriver tag, depending on the network you are integrating with.

The required information is the following:

- Is the blockchain network's code open source? If so, please provide the GitHub link. If not, provide an explanation on why not
- Is SUDO disabled on the network? If SUDO is disabled, is the network controlled by a select group of addresses?  
- Has the integration of the network been tested completely on the Moonbase Alpha TestNet?  
- (For Moonbeam HRMP proposals only) Does your network have a Kusama deployment? If so, provide its network name and whether the Kusama deployment is integrated with Moonriver
- Is the blockchain network's code audited? If so, please provide:
    - Auditor name(s)
    - Dates of audit reports
    - Links to audit reports

### XCM Proposals {: #xcm-proposals }

The second post is a preliminary draft of the proposal in the [XCM Proposals category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=_blank}. Once a proposal is submitted on-chain and available for voting, you must also add a description to it in either the [Moonbeam Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} or [Moonriver Polkassembly](https://moonriver.polkassembly.network/){target=_blank}.

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam/Moonriver tag, depending on the network you are integrating with.

Note that all the necessary information can be obtained by using the tools presented in the following sections. In addition, you can always contact the team for support.

In both the Moonbeam XCM Proposals forum post and in Polkassembly, add the following sections and information:  

- **Title** — *YOUR_NETWORK_NAME* Proposal to Open Channel & Register *ASSET_NAME*
- **Introduction** — one sentence summarizing the proposal
- **Network Information** — one sentence summarizing your network, and relevant links to your website, Twitter, and other social channels
- **Summary** — brief description of the content of the proposal
- **On-Chain Proposal Reference (Forums Only)** — include if it is a Moonbeam or Moonriver proposal, the proposal number, and proposal hash
- **Technical Details** — provide technical information required for the community to understand the use cases and purpose of the proposal
- **Additional Information** — any additional information you would like the community/readers to know

## Register Moonbeam's Asset on your Parachain {: #register-moonbeams-asset-on-your-parachain }

In order to enable cross-chain transfers of Moonbeam native assets or ERC-20s between your chain and Moonbeam, you'll need to register the asset(s). To do so, you'll need the multilocation of each asset.

The WSS network endpoints for each Moonbeam-based network are as follows:

=== "Moonbeam"
    ```
    wss://wss.api.moonbeam.network
    ```

=== "Moonriver"
    ```
    wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.wss_url }}
    ```

### Register Moonbeam Native Tokens {: #moonbeam-native-tokens }

For Moonbeam native tokens, the metadata for each network is as follows:

=== "Moonbeam"

    ```
    Name: Glimmer
    Symbol: GLMR
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 GLMR)
    ```

=== "Moonriver"

    ```
    Name: Moonriver Token
    Symbol: MOVR
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 MOVR)
    ```

=== "Moonbase Alpha"

    ```
    Name: DEV
    Symbol: DEV
    Decimals: 18
    Existential Deposit: 1 (1 * 10^-18 DEV)
    ```

The multilocation of Moonbeam native assets include the parachain ID of the network and the pallet instance, which corresponds to the index of the `Balances` pallet. The multilocation for each network is as follows:

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
        'parents': 1,
        'interior': {
          'X2': [
            { 
              'Parachain': 2023
            },
            {
              'PalletInstance': 10
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
        'parents': 1,
        'interior': {
          'X2': [
            { 
              'Parachain': 1000
            },
            {
              'PalletInstance': 3
            }
          ]
        }
      }
    }
    ```

### Register Local XC-20s (ERC-20s) {: #register-erc20s }

In order to register a local XC-20 on another chain, you'll need the multilocation of the asset on Moonbeam. The multilocation will include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM. 

Currently, the support for local XC-20s is only on Moonbase Alpha. You can use the following multilocation to register a local XC-20:

=== "Moonbase Alpha"

    ```js
    {
      V3: {
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
                key: 'ERC20_ADDRESS_GOES_HERE'
              }
            }
          ]
        }
      }
    }
    ```

## Creating HRMP Channels {: #create-an-hrmp-channel }

Before any messages can be sent from your parachain to Moonbeam, an HRMP channel must be opened. To create an HRMP channel, you'll need to send an XCM message to the relay chain that will request a channel to be opened through the relay chain. The message will need to contain **at least** the following XCM instructions:  

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - takes funds out of the sovereign account (in the relay chain) of the origin parachain to a holding state
2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - buys execution time from the relay chain to execute the XCM message
3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - provides the relay chain call data to be executed. In this case, the call will be an HRMP extrinsic

!!! note
    You can add [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} to refund the leftover funds after the execution. If this is not provided, no refunds will be carried out. In addition, you could also add a [RefundSurplus](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank} after [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}, to get any leftover funds not used for the Transact. But you'll have to calculate if it is worth paying the execution cost of the extra XCM instructions.

To send these XCM messages to the relay chain, the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank} is typically invoked. Moonbeam also has an [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank} that simplifies the process into a call that abstracts the XCM messaging constructor.  

You could potentially generate the calldata for an HRMP action by using Polkadot.js Apps, but the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank} can build it for you, and it is the recommended tool for this process. They should work for any chain that includes the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank}, although it will try to do it via the [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank} first.  

```
git clone https://github.com/PureStake/xcm-tools && \
cd xcm-tools && \
yarn
```

The [xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank} has a specific script for HRMP interactions called [`hrmp-channel-manipulator.ts`](https://github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}. This command generates encoded calldata for a specific HRMP action, as long as it is given the correct details. The script builds the XCM message with the DepositAsset XCM instruction, but not with RefundSurplus.

The `hrmp-channel-manipulator.ts` script is meant to be generic. It will first attempt to use the `hrmpManage` extrinsic of the [XCM-Transactor Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/xcm-transactor){target=_blank}, but if that pallet does not exist on the parachain that it is being used on, it will switch to using the [Polkadot XCM Pallet](https://github.com/paritytech/polkadot/tree/master/xcm/pallet-xcm){target=_blank} (which should be used more readily by parachains) to directly construct the XCM message that interacts with the HRMP pallet on the relay chain. **Note that it expects the pallet name to be `polkadotXcm`, as the extrinsic will be built as `api.tx.polkadotXcm.send()`.**

The following sections go through the steps of creating/accepting open channel requests in a Moonbeam-based network, but it can also be adapted to your parachain.

### Accept an HRMP Channel on Moonbeam {: #accept-an-hrmp-channel-on-moonbeam }

When a parachain receives an HRMP channel open request from another parachain, it must signal to the relay chain that it accepts this channel before the channel can be used. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpAcceptOpenChannel` extrinsic.

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!  

Running the following command will provide the encoded calldata to accept an open HRMP channel request on a Moonbeam network. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:  

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

!!! note
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

### Opening HRMP Channels from Moonbeam  {: #open-an-hrmp-channel-from-moonbeam }

Parachains need bidirectional HRMP channels before sending XCM between each other. The first step to establishing an HRMP channel is to create an open channel request. This requires an XCM message to the relay chain with the Transact instruction calling the `hrmp` pallet and `hrmpInitOpenChannel` extrinsic.

Fortunately, the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} GitHub repository's `hrmp-channel-manipulator.ts` script can build the XCM for you!

Running the following command will provide the encoded calldata to create the HRMP channel request from a Moonbeam network. The maximum message size and capacity values can be obtained from the relay chain `configuration` pallet and `activeConfig` extrinsic. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:  

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

!!! note
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

## Register a Foreign Asset {: #register-a-foreign-asset }

One of the main points of creating an XCM integration is to send cross-chain assets to and from Moonbeam. Registering an asset through Moonbeam is done via the [Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}. Assets created on Moonbeam are called [XC-20s](/builders/interoperability/xcm/xc20/){target=_blank}, as they have an ERC-20 interface that smart contracts can interact with. 

This guide will have you use the `xcm-asset-registrator.ts` script. Keep in mind that this script cannot be used on your parachain if you do not have the [Asset Manager Pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}.  

Running the command below will provide the encoded calldata to register your cross-chain asset on a Moonbeam network. Replace the following values before running the command:  

- `YOUR_PARACHAIN_ID` with the ID of your parachain 
- `YOUR_ASSET_MULTILOCATION` with the [JSON-formatted multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank} of your asset from the Moonbeam network's perspective
- `YOUR_TOKEN_SYMBOL` with the symbol of the token you wish to register. **Please add "xc" to the front of the symbol to indicate that the asset is an XCM enabled asset**
- `YOUR_TOKEN_DECIMALS` with the number of decimals your asset has, such as `18`
- `YOUR_TOKEN_NAME` with the name of the token to register 
- `YOUR_UNITS_PER_SECOND` with the units of tokens to charge per second of execution time during XCM transfers. There is a [guide to calculate units per second](#calculating-units-per-second) below  

=== "Moonbeam"
    ```
    yarn register-asset -w wss://wss.api.moonbeam.network  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonriver"
    ```
    yarn register-asset -w wss://wss.api.moonriver.moonbeam.network  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true
    ```

=== "Moonbase Alpha"
    ```
    yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true
    ```


Existential deposit, `--ed`, is always set to 1. Sufficiency, `--sufficient`, is always set to `true`. This is so that the XC-20 assets on Moonbeam can act similar to an ERC-20 on Ethereum. The `--revert-code` flag refers to a simple EVM bytecode that is set in the [XC-20](/builders/interoperability/xcm/xc20/){target=_blank} storage element so that other smart contracts can easily interact with the XC-20 (**only needed for [Governance V1](/learn/features/governance#governance-v1){target=_blank} proposals**). You can ensure that these values are properly included by checking for them in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank} with the resultant encoded calldata.

!!! remember "Warning"
    For chains with [OpenGov](/learn/features/governance#opengov){target=_blank}, the `--revert-code true` flag was removed. This flag includes a `system.setStorage` call that the General Admin origin can't execute. The dummy EVM bytecode can be set later with a call to the Precompile Registry precompile.

For example, the following command would be for registering an asset from parachain 888, with an asset that has a general key of `1`:  

```
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000001"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true
```

Its output would look like the following:  

```
Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
Encoded calldata for tx is 0x0102081f0000010200e10d0624000000000000000001344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000001c7a8978b008d8716010000000000000026000000
```

If you plan to batch the transaction with other calls, copy the resultant calldata for later when using the [batching transactions](#batch-actions-into-one) script.

You can repeat this process with multiple assets if you intend on registering multiple cross-chain assets to Moonbeam.  

### Calculating Units Per Second {: #calculating-units-per-second }

`UnitsPerSecond` is the number of tokens charged per second of execution of an XCM message. The target cost for an XCM transfer is `$0.02` at the time of registration. The `UnitsPerSecond` might get updated through governance as the token price fluctuates.

The easiest way to calculate an asset's `UnitsPerSecond` is through the [`calculate-units-per-second.ts` script](https://github.com/PureStake/xcm-tools/blob/main/scripts/calculate-units-per-second.ts){target=_blank} of [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}. To run the script, you must provide the following:

- `--d` decimals of the tokens you are calculating the units per second for
- `--xwc` total weight cost of the execution of the entire XCM message
- `--t` (optional) target price for XCM execution, defaults to `$0.02`
- `--a` (optional) the token [Coingecko API id](https://www.coingecko.com/){target=_blank}
- `--p` (optional) if the Coingecko API does not support the token, you can specify the price manually

The estimated weight per XCM operation on each Moonbeam chain is:  

=== "Moonbeam"
    ```
    800000000
    ```

=== "Moonriver"
    ```
    800000000
    ```

=== "Moonbase Alpha"
    ```
    638978000
    ```

For example, to calculate the units per second of DOT (Polkadot token), which has 10 decimals, on Moonbeam:

```
yarn calculate-units-per-second --d 10 --a polkadot --xwc 800000000 
```

Which should result in the following output (at the time of writing):  

```
Token Price is $7.33
The UnitsPerSecond needs to be set 34106412005
```

## Batch Actions Into One {: #batch-actions-into-one }

The most efficient way to complete the XCM process on parachains is to batch all transactions together. The [xcm-tools repository](https://github.com/PureStake/xcm-tools){target=_blank} provides a script to batch extrinsic calls into a single call, thus requiring only a single transaction. This can be helpful if your parachain would like to open an HRMP channel and register an asset simultaneously. This **should be used** when proposing a channel registration on a Moonbeam network.    

You will now use the encoded calldata outputs of the three previous command calls and insert them into the following command to send the batch proposal to democracy. Add a `--call "YOUR_CALL"` for each call you want to batch. Replace the following values before running the command:  

- `OPEN_CHANNEL_CALL` is the SCALE encoded calldata for [opening an HRMP channel](#open-an-hrmp-channel-from-moonbeam) from Moonbeam to your parachain  
- `ACCEPT_INCOMING_CALL` is the SCALE encoded calldata for [accepting the channel request](#accept-an-hrmp-channel-on-moonbeam) from your parachain  
- `REGISTER_ASSET_CALL` is the SCALE encoded calldata for [registering a cross-chain asset](#register-a-foreign-asset). If you have more than one asset to be registered on Moonbeam, you can include additional registration SCALE encoded calldata with additional `--call` flags  

If you are registering on Moonbase Alpha, you will not to provide a private key or go through governance. Run the following command using `--sudo` and provide the output to the Moonbeam team so that the asset and channel can be added quickly through sudo.  

=== "Moonbeam"
    ```
    yarn generic-call-propose -w wss://wss.api.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonriver"
    ```
    yarn generic-call-propose -w wss://wss.api.moonriver.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonbase Alpha"
    ```
    yarn generic-call-propose -w wss://wss.api.moonbase.moonbeam.network  \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL"
    ```

!!! note
    You can readapt the script for your parachain by changing the `parachain-ws-provider`.

For Moonbeam and Moonriver, you should include `--account-priv-key YOUR_PRIVATE_KEY` and `-send-preimage-hash true --send-proposal-as democracy` if you want to send the governance proposal directly from the CLI tool. It is recommended to get familiar with the [governance process on Moonbeam-based networks](/learn/features/governance/){target=_blank}.

For Moonbase Alpha, you could add the `--sudo` flag and provide the SCALE encoded calldata to the team so that it is submitted via sudo.

Feel free to check the [additional flags](#additional-flags-xcm-tools) available for this script.

## Additional Flags for XCM-Tools {: #additional-flags-xcm-tools }

The [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank} and most of its functions can be called with some additional flags that create some wrappers around the actions being taken. For example, you might want to wrap the send of the XCM message in sudo, or via a democracy proposal.

The complete options that can be used with the script are as follows:  

|         Flag         |            Type            |                                                                         Description                                                                          |
|:--------------------:|:--------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   account-priv-key   |           string           |                        (Required for send-proposal-as, send-preimage-hash) The private key of the account to send a transaction with                         |
|         sudo         |          boolean           |     Whether to wrap the extrinsic calldata inside of a `sudo.sudo` extrinsic. If `account-priv-key` is present, it will attempt to send the transaciton      |
|  send-preimage-hash  |          boolean           |                                          Whether to submit the encoded calldata as a preimage and retrieve its hash                                          |
|   send-proposal-as   | democracy/council-external |                                      Whether to send the encoded calldata through democracy or Council (Governance v1)                                       |
| collective-threshold |           number           |                                     (Required for council-external) The threshold for the Council deciding the proposal                                      |
|       at-block       |           number           | Whether to wrap the extrinsic calldata inside of a `scheduler.schedule` extrinsic. The block in the future that the action should be scheduled to take place |
|     fee-currency     |   string (multilocation)   |                           (Required for non-Moonbeam chains that use XCM-Transactor) The multilocation of the relay chain's asset                            |

## Testing Asset Registration on Moonbeam {: #testing-asset-registration-on-moonbeam }

After both channels are established and your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank} address.

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex, and prepending it with F's until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank} section of the External XC-20 guide.

After the asset is successfully registered, you can try transferring tokens from your parachain to the Moonbeam-based network you are integrating with.

!!! note 
    Remember that Moonbeam-based networks use AccountKey20 (Ethereum-style addresses).

For testing, please also provide your parachain WSS endpoint so that the Moonbeam dApp can connect to it. Lastly, please fund the corresponding account:

=== "Moonbeam"
    ```
    AccountId: {{ networks.moonbeam.xcm.channel.account_id }}
    Hex:       {{ networks.moonbeam.xcm.channel.account_id_hex }}
    ```

=== "Moonriver"
    ```
    AccountId: {{ networks.moonriver.xcm.channel.account_id }}
    Hex:       {{ networks.moonriver.xcm.channel.account_id_hex }}
    ```

=== "Moonbase Alpha"
    ```
    AccountId: {{ networks.moonbase.xcm.channel.account_id }}
    Hex:       {{ networks.moonbase.xcm.channel.account_id_hex }}
    ```

!!! note
    For Moonbeam and Moonriver testing, please send $50 worth of tokens to the aforementioned account. In addition, provide an Ethereum-style account to send $50 worth of GLMR/MOVR for testing purposes.

[XC-20s](/builders/interoperability/xcm/xc20/){target=_blank} are Substrate based assets with an [ERC-20 interface](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}. This means they can be added to MetaMask, and can be composed with any EVM DApp that exists in the ecosystem. The team can connect you with any DApp you find relevant for an XC-20 integration.

If you need DEV tokens (the native token for Moonbase Alpha) to use your XC-20 asset, you can get some from the [Moonbase Alpha Faucet](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=_blank}, which dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours. If you need more, feel free to reach out to the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}.
