---
title: Open a Cross-Chain Channel
description: Learn how to establish a cross-chain integration with a Moonbeam-based network. Inclduding opening and accepting an HRMP channel, and registering assets.
---

# Establishing a XC Integration with Moonbeam

![XCM Overview Banner](/images/builders/interoperability/xcm/xc-integration/xc-integration-banner.png)

## Introduction {: #introduction }

While Cross-Chain Message Passing (XCMP) is being developed, a stop-gap protocol has been implemented called Horizontal Relay-routed Message Passing (HRMP). It has the same interface and functionality as XCMP but the messages are stored in and read from the relay chain. Whereas with XCMP, only the message's associated metadata is stored in the relay chain. Since all of the messages are passed via the relay chain with HRMP, it is much more demanding on resources. As such, HRMP will be phased out once XCMP is implemented.

All XCMP channel integrations with Moonbeam are unidirectional, meaning messages flow only in one direction. If chain A initiates a channel to chain B, chain A will only be allowed to send messages to B, and B will not be able to send messages back to A. As such, chain B will also need to initiate a channel to chain A to be able to send messages back and forth between the two chains.

Once the XCMP (or HRMP) channels have been opened, the corresponding assets from both chains will need to be registered on the opposing chain before being able to transfer them.

This guide will cover how to open and accept an HRMP channel between a parachain and a Moonbeam-based network. In addition, the guide provides the necessary data to register Moonbeam-based networks assets in your parachain, and the data required to register your asset in any of the Moonbeam-based networks.


## Moonbase Alpha XCM Integration Overview {: #moonbase-alpha-xcm }

The first step for a Moonriver/Moonbeam XCM integration, is to integrate with the Moonbase Alpha TestNet, through the Alphanet relay chain. Then a Moonriver integration must be completed before proceeding with Moonbeam (if applicable).  

The entire process to get started with Moonbase Alpha can be summarized as follows:

1. Sync a node with the Alphanet relay chain
2. Provide the WASM/Geneiss head hash and your parachain ID for onboarding
3. [Calculate your parachain sovereign account](#calculate-and-fund-the-parachain-sovereign-account){target=_blank} on the Alphanet relay chain (to be funded by the Moonbeam team)
4. Open an HRMP channel to Moonbase Alpha from your parachain (through sudo or via governance)
5. Provide the encoded call data to open an HRMP channel to your parachain, accept the incoming HRMP channel, and register the assets (if applicable). This will be executed through sudo
5. Accept the HRMP channel from Moonbase Alpha (through sudo or via governance)
6. Register Moonbase Alpha's DEV token on your parachain (optional)
7. For testing the XCM integration, please send some tokens to:

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

8. Test the XCM integration

Once all of these steps are completed and both teams have successfully tested asset transfers, your parachain token can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}. If deposit and withdrawals work as expected, an integration with Moonriver can begin.

### Sync a Node {: #sync-a-node }

To sync a node, you can use the [Alphanet relay chain specs](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank} (note: the relay chain is Westend based, and will probably take 1 day to sync). 

For reference, you can use [Moonbase Alpha’s spec file](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}. You'll need to adapt it to your chain.

To onboard your parachain, please provide the following:
- Genesis head/wasm hash
- Parachain ID. You can find the parachain IDs that have been already used in the [relay chain Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}

There are also some [snapshots for the Alphanet ecosystem relay chain](http://snapshots.moonbeam.network.s3-website.us-east-2.amazonaws.com/){target=_blank} you can use to quickly get started.


When getting started with the Moonbase Alpha relay chain, once you have your sovereign account’s address, please contact the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can fund it at a relay chain level. If not, you won’t be able to create the HRMP channel.]

### Calculate and Fund the Parachain Sovereign Account {: #calculate-and-fund-the-parachain-sovereign-account }

You can calculate the sovereign account information using [a script from the `xcm-tools` repository](https://github.com/PureStake/xcm-tools){target=_blank}. To run the script, you must provide the parachain ID and the name of the associated relay chain. The accepted values for the relay chain are `polkadot` (default), `kusama`, and `moonbase`.

For example, Moonbase Alpha's sovereign account for both the relay chain and other parachains can be obtained with:

```
yarn calculate-sovereign-account --p 1000 --r moonbase
```

Which should result in the following response:  

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

When getting started with the Moonbase Alpha relay chain, once you have your sovereign account’s address, please contact the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can fund it at a relay chain level. If not, you won’t be able to create the HRMP channel.

## Moonriver & Moonbeam XCM Integration Overview {: #moonriver-moonbeam }

From a technical perspective, the process to create a HRMP channel with Moonriver and Moonbeam is nearly the same. However, engagement with the Moonbeam community is crucial and required before a proposal will pass. The process is as follows:

1. Add details of the asset and project to [the forum](/tokens/governance/proposals/#submitting-your-idea-to-the-forum){target=_blank} in the the XCM category. Please check the HRMP channel guidelines that the community voted on for [Moonriver](https://moonriver.polkassembly.network/referenda/0){target=_blank} and [Moonbeam](https://moonbeam.polkassembly.network/proposal/21){target=_blank}
2. Open an HRMP channel from your chain to Moonriver/Moonbeam. Optionally, you can create a batched proposal to register MOVR/GLMR or register at a later date
3. Once the proposal in step 2 gets enacted, you will create a batched proposal on Moonbeam to:
    1. Propose the opening of an outgoing HRMP channel from Moonriver/Moonbeam
    2. Accept the incoming HRMP channel
    3. Register the asset as an [XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank} (if applicable)

      The normal enactment times are as follows:  

      - **Moonriver** - approximately a {{ networks.moonriver.democracy.vote_period.days }}-day voting period plus {{ networks.moonriver.democracy.enact_period.days }}-day enactment time
      - **Moonbeam** - approximately a {{ networks.moonbeam.democracy.vote_period.days }}-day voting period plus {{ networks.moonbeam.democracy.enact_period.days }}-day enactment time

4. Add details about the [connecting parachain on Polkassembly](http://localhost:8000/tokens/governance/proposals/#submitting-a-proposal){target=_blank} so that community members can be informed when voting on the proposal
5. Accept the HRMP channel from Moonriver/Moonbeam on the connecting parachain
6. Exchange $50 worth of tokens for testing the XCM integration. Please send the tokens to:

    ```
    AccoundId: 5DnP2NuCTxfW4E9rJvzbt895sEsYRD7HC9QEgcqmNt7VWkD4
    Hex:       0x4c0524ef80ae843b694b225880e50a7a62a6b86f7fb2af3cecd893deea80b926)
    ```

7. Provide an Ethereum-styled address for MOVR/GMLR
8. Test the XCM integration with the provided tokens

Once these steps are complete, marketing efforts can be coordinated and the new XC-20 on Moonriver/Moonbeam can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/){target=_blank}.

### Forum and Polkassembly Template {: #forum-and-polkassembly-template }

When starting an XCM integration on a Moonbeam MainNet, you must add a preliminary draft of the proposal on the [Moonbeam forums](https://forum.moonbeam.foundation/){target=_blank} in the XCM category so that the voting community has the chance to provide preliminary feedback. It is recommended that this is done 5 days before the actual proposal.  

Once a proposal is available for voting, you must also add a description to it in either the [Moonbeam Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} or [Moonriver Polkassembly](https://moonriver.polkassembly.network/){target=_blank}.

In both the Moonbeam preliminary forum post and in Polkassembly, add the following sections and information:  

- **Title** - YOUR_NETWORK_NAME Proposal to Open Channel & Register ASSET_NAME
- **Introduction** - one sentence summarizing the proposal
- **Network Information** - one sentence summarizing your Network, and relevant links to your website, Twitter, and other social channels
- **Summary** - brief description of the content of the proposal
- **On-Chain Proposal Reference (Forums Only)** - include if it is a Moonbeam or Moonriver proposal, the proposal number, and proposal hash
- **Technical Details** - provide technical information required for the community to understand the use cases and purpose of the Proposal
- **Additional Information** - any additional information you would like the community/readers to know

Additionally, there is key information to provide that is highlighted due to its importance in a voter's decision:  

- Is the blockchain network's code open source? If so, please provide the GitHub link. If not, provide an explanation on why not.  
- Is Sudo disabled on the network? If Sudo is disabled, is the Network controlled by a select group of addresses?  
- Has the integration of the network been tested completely on the Moonbase Alpha TestNet?  
- (For Moonbeam HRMP Proposals Only) Does your network have a Kusama deployment? If so, provide its network name and whether the Kusama deployment is integrated with Moonriver.
- Is the blockchain network's code audited? If so, please provide:
    - Auditor name(s)
    - Dates of audit reports
    - Links to audit reports

## Open an HRMP Channel {: #create-an-hrmp-channel }

Before any messages can be sent from your parachain to Moonbeam, an HRMP channel must be opened. To create an HRMP channel, you'll need to send an XCM message to the relay chain that will request a channel to be opened through the relay chain. The message will need to contain the following XCM instructions:  

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - takes funds out of the sovereign account (in the relay chain) of the origin parachain to a holding state
2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - buys execution time from the relay chain to execute the XCM message
3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - provides the relay chain call data to be executed. In this case, the call will be an HRMP extrinsic
4. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - (optional) refunds the leftover funds after the execution. If this is not provided, no refunds will be carried out

To send these XCM messages to the relay chain, the `PolkadotXcm` pallet is typically invoked. Moonbeam also has an XcmTransactor pallet that simplifies the process into a call that abstracts the XCM messaging constructor.  

You could potentially generate the calldata for an HRMP action by using Polkadot.js Apps, but the Moonbeam team has provided a series of scripts to simplify the process in the [xcm-tools GitHub repository](https://github.com/PureStake/xcm-tools){target=_blank}, which you should download and use for the rest of the process. They should work for any chain that includes the `PolkadotXcm` pallet.  

```
git clone https://github.com/PureStake/xcm-tools.git && \
cd xcm-tools && \
yarn
```

In your case, you will have to:  

1. Send an HRMP channel open request to Moonbeam
2. Batch an HRMP channel open request to your parachain into a governance proposal on Moonbeam

!!! note
    It is up to you how you execute the integration on your parachain, but when acting on a Moonbeam network, you should definitely [batch actions into a single proposal](#batch-actions-into-one-proposal). Read this section to understand how to get the XCM calldata, but skip to the batching section for executing the proposal on Moonbeam.

### Send an Open Channel Request to Moonbeam {: #send-an-open-channel-request-to-moonbeam }

The xcm-tools repository has a specific script for HRMP interactions, called [`hrmp-channel-manipulator.ts`](https://github.com/PureStake/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=_blank}. This command generates encoded calldata for a specific HRMP action, as long as it is given the correct details.  

Running the following command will provide the encoded calldata to send an open HRMP channel request from your parachain to a Moonbeam network. The HRMP channel request will have a max capacity of `1000` and a max message size of `102400`. Replace `YOUR_PARACHAIN_WSS` with the WebSocket endpoint for your parachain:  

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id 2004 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS \
    --relay-ws-provider wss://rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id 2023 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id 1000 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

An example output will look like this:  

```
Encoded Call Data for Tx is 0x2b000101000210000400000000070010a5d4e81300000000070010a5d4e8010700f2052a01060002286bee383300e8030000e8030000009001000d0100040001010070617261db070000000000000000000000000000000000000000000000000000
✨  Done in 4.13s.
```

The resultant encoded call data must be executed on your parachain, likely through sudo or governance.  

### Open an HRMP Channel from Moonbeam {: #open-an-hrmp-channel-from-moonbeam }

Once an HRMP channel has been sent to a Moonbeam network, the Moonbeam network must:  

1. Send an open HRMP channel request back (since HRMP channels are unidirectional)
2. Accept the incoming channel
3. Register any cross-chain assets that can be sent to it

These three actions can be batched together, but each action's calldata is needed. To get the calldata to open an HRMP channel from a Moonbeam network to your parachain, use the same script as before, but this time the target parachain is your parachain. Replace `YOUR_PARACHAIN_ID` with the ID of your parachain:  

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
    --parachain-ws-provider wss://wss.api.moonriver.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \ 
    --hrmp-action open 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

Copy the resultant call data for use when [batching transactions in a proposal](#batch-actions-into-one-proposal) on Moonbeam.  

### Additional Flags for the HRMP Manipulator {: #additional-flags-for-the-hrmp-manipulator }

This section is irrelevant to the steps of registering a new XC integration, and you can skip to [the next section](){}. This section will briefly lay out the additional options for the `hrmp-channel-manipulator.ts` script in case other projects wish to use it for their own HRMP integrations purposes.  

The `hrmp-channel-manipulator.ts` script is meant to be generic. It will first attempt to use the `hrmpManage` extrinsic of the XcmTransactor pallet, but if that pallet does not exist on the parachain that it is being used on, it will switch to using the PolkadotXcm pallet (which should be used more readily by parachains) to directly construct the XCM message that interacts with the HRMP pallet on the relay chain.  

The additional options that can be used with the script are as follows:  

**TODO: add a table with all of the additional flags**

## Accept an HRMP Channel on Moonbeam {: #accept-an-hrmp-channel-on-moonbeam }

When a parachain receives an HRMP channel open request from another parachain, it must signal to the relay chain that it accepts this channel before the channel can be used. This too requires an XCM message to the relay chain.  

In your case, you will have to:  

1. Batch an HRMP channel acceptance of your parachain into a governance proposal on Moonbeam
2. Accept Moonbeam's incoming open HRMP channel request after the proposal has finished

!!! note
    It is up to you how you execute the integration on your parachain, but when acting on a Moonbeam network, you should definitely [batch actions into a single proposal](#batch-actions-into-one-proposal). Read this section to understand how to get the XCM calldata, but skip to the batching section for executing the proposal on Moonbeam.

Fortunately, the xcm-tools GitHub repository's `hrmp-channel-manipulator.ts` script also includes the ability to accept an incoming HRMP channel request.  

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
    --parachain-ws-provider wss://wss.api.moonriver.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.network  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

Copy the resultant call data for use when [batching transactions in a proposal](#batch-actions-into-one-proposal) on Moonbeam.  

## Register a Foreign Asset {: #register-a-foreign-asset }

One of the main points of creating an XCM integration is to send cross-chain assets to and from Moonbeam. Registering an asset through Moonbeam is done via the [asset manager pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/asset-manager/src/lib.rs){target=_blank}. This guide will have you use the `xcm-asset-registrator.ts` script. Keep in mind that this script cannot be used on your parachain if you do not have this pallet.  

!!! note
    In the integration process, a new cross-chain asset might be registered on both the Moonbeam network and your parachain. It is up to you how you execute the integration on your parachain, but when acting on the Moonbase network, you should [batch actions into a single proposal](#batch-actions-into-one-proposal). Read this section to understand how to get the extrinsic calldata, but skip to the batching section for executing the proposal on Moonbeam.

Running the command below will provide the encoded calldata to register your cross-chain asset on a Moonbeam network. Replace the following values before running the command:  

- `YOUR_PARACHAIN_ID` with the ID of your parachain 
- `YOUR_ASSET_MULTILOCATION` with the [JSON-formatted multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank} of your asset from the Moonbeam network's perspective
- `YOUR_TOKEN_SYMBOL` with the symbol of the token you wish to register. Please add "xc" to the front of the symbol to indicate that the asset was bridged through XCM 
- `YOUR_TOKEN_DECIMALS` with the number of decimals your asset has, such as `18`
- `YOUR_TOKEN_NAME` with the name of the token to register 
- `YOUR_UNITS_PER_SECOND` with the units of tokens to charge per second of execution time during XCM transfers. There is a [guide to calculate units per second](#calculating-units-per-second) below  

=== "Moonbeam"
    ```
    yarn register-asset -w wss://moonbeam.public.blastapi.io  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonriver"
    ```
    yarn register-asset -w wss://moonriver.public.blastapi.io  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonbase Alpha"
    ```
    yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --symbol "YOUR_TOKEN_SYMBOL" \
    --decimals YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    --units-per-second YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

An example command and output would look like the following:  

```
yarn register-asset -w wss://wss.api.moonbase.moonbeam.network \
--asset '{ "parents": 1, "interior": { "X2": [{ "Parachain": 888 }, {"GeneralKey": "0x000000000000000000"}]}}' \
--symbol "xcEXTN" --decimals 18 \
--name "Example Token" \
--units-per-second 20070165297881393351 \ 
--ed 1 --sufficient true --revert-code true 

Encoded proposal for registerAsset is 0x1f0000010200e10d0624000000000000000000344578616d706c6520546f6b656e1878634558544e12000000000000000000000000000000000000
Encoded proposal for setAssetUnitsPerSecond is 0x1f0100010200e10d0624000000000000000000c7a8978b008d8716010000000000000026000000
Encoded Call Data for Tx is 0x0102081f0000010200e10d0624000000000000000000344578616d706c6520546f6b656e1878634558544e120000000000000000000000000000000000001f0100010200e10d0624000000000000000000c7a8978b008d8716010000000000000026000000
```

Be sure to copy the encoded calldata: the final hexadecimal encoded data printed from the output.  

You can do this process with multiple assets if you intend on registering multiple cross-chain assets to Moonbeam.  

### Calculating Units Per Second {: #calculating-units-per-second }

`UnitsPerSecond` is the number of tokens charged per second of execution of an XCM message. The target cost for an XCM transfer is `$0.02` at the time of registration. The `UnitsPerSecond` might get updated through governance as token price fluctuates.  

The easiest way to calculate an asset's `UnitsPerSecond` is through the [`calculateUnitsPerSeconds.ts` script](https://github.com/albertov19/xcmTools/blob/main/calculateUnitsPerSeconds.ts){target=_blank}. To run the script, you must provide the decimals of the asset, the current price of the asset in USD, and the estimated cost in weight per XCM operation on the Moonbeam chain that the asset will be sent to.  

The estimated weight per XCM operation on each Moonbeam chain is:  

=== "Moonbeam"
    ```
    1000000000
    ```

=== "Moonriver"
    ```
    200000000
    ```

=== "Moonbase Alpha"
    ```
    1000000000
    ```

For example, a token of 18 decimals currently priced at `$1.58` to be registered on the Moonbeam network:  

```
ts-node calculateUnitsPerSeconds.ts --d 18 --p 1.58 --xoc 1000000000 
```

Which should result in the following output:  

```
Token Price is $1.58
The UnitsPerSecond need to be set 3164556962025316455
```

## Batch Actions Into One Proposal {: #batch-actions-into-one-proposal }

The most efficient way to complete the XCM process on parachains that have governance enabled are through batch proposals. The xcm-tools repository provides a way to batch extrinsic calls into a single call and thus requiring only a single proposal. This can be helpful if your parachain would like to open an HRMP channel and register an asset at the same time. This **should be used** when proposing a channel registration on a Moonbeam network.

You will now use the encoded call data outputs of the three previous command calls and insert them into the following command to send the batch proposal to democracy. Replace the following values before running the command:  

- `OPEN_CHANNEL_CALL` is the hexadecimal encoded calldata for [opening an HRMP channel](#open-an-hrmp-channel-from-moonbeam) from Moonbeam to your parachain  
- `ACCEPT_INCOMING_CALL` is the hexadecimal encoded calldata for [accepting the channel request](#accept-an-hrmp-channel-on-moonbeam) from your parachain  
- `REGISTER_ASSET_CALL` is the hexadecimal encoded calldata for [registering a cross-chain asset](#register-a-foreign-asset). If you have more than one asset to be registered on Moonbeam, you can include additional registration hexadecimal encoded calldatas with additional `--call` flags  
- `YOUR_PRIVATE_KEY` is the private key of the funded Moonbeam account that is proposing (only necessary for MainNet)  

If you are registering on Moonbase Alpha, you will not to provide a private key or go through governance. Run the following command and provide the output to the Moonbeam team so that the asset and channel can be added quickly through sudo.  

=== "Moonbeam"
    ```
    yarn generic-call-propose -w wss://moonbeam.public.blastapi.io \
    --call "{ACCEPT_INCOMING_CALL}" \
    --call "{OPEN_CHANNEL_CALL}" \
    --call "{REGISTER_ASSET_CALL}" \
    --account-priv-key YOUR_PRIVATE_KEY \
    --send-preimage-hash true --send-proposal-as democracy
    ```

=== "Moonriver"
    ```
    yarn generic-call-propose -w wss://moonriver.public.blastapi.io \
    --call "{ACCEPT_INCOMING_CALL}" \
    --call "{OPEN_CHANNEL_CALL}" \
    --call "{REGISTER_ASSET_CALL}" \
    --account-priv-key YOUR_PRIVATE_KEY \
    --send-preimage-hash true --send-proposal-as democracy
    ```

=== "Moonbase Alpha"
    ```
    yarn generic-call-propose -w wss://wss.api.moonbase.moonbeam.network  \
    --call "ACCEPT_INCOMING_CALL" \
    --call "OPEN_CHANNEL_CALL" \
    --call "REGISTER_ASSET_CALL"
    --sudo true
    ```

If on MainNet, once the batch proposal is sent through democracy, it will need to be seconded by either the Moonbeam team or another network member to continue with [the governance process](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}. Please record the output and send it to the Moonbeam team. You will need to update details on the proposal [on Subscan](#forum-and-polkassembly-template).  

If on TestNet, simply record the output and send it to the Moonbeam team for sudo execution.  

## Accept the Incoming HRMP Request {: #accept-the-incoming-hrmp-request }

As previously mentioned, all XCMP/HRMP channel integrations with Moonbeam are unidirectional. As such, once Moonbeam's batched proposal is executed, you'll need to accept it. You should be able to use the same method as when constructing the HRMP channel acceptance on Moonbeam: with the `hrmp-channel-manipulator.ts` script.  

Running the following command will provide the encoded calldata to accept an open HRMP channel request on your parachain. Replace `YOUR_PARACHAIN_WSS` with a WSS endpoint of your parachain:  

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id 2004 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id 2023 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept 
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id 1000 \
    --parachain-ws-provider YOUR_PARACHAIN_WSS  \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

The resultant encoded call data must be executed on your parachain, likely through sudo or governance.  

## Register Moonbeam's Asset on your Parachain {: #register-moonbeams-asset-on-your-parachain }

To register any of the Moonbeam-based network tokens on your parachain, you can use the following details.

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

The asset metadata for each Moonbeam-based network is as follows:

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

The multilocation of each Moonbeam-based network asset is as follows:

=== "Moonbeam"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 2004,
            "PalletInstance": 10
          }
        ]
      }
    }
    ```

=== "Moonriver"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 2023,
            "PalletInstance": 10
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"
    ```
    {
      "parents": 1,
      "interior": {
        "X2": [
          { 
            "Parachain": 1000,
            "PalletInstance": 3
          }
        ]
      }
    }
    ```

## Testing Asset Registration on Moonbeam {: #testing-asset-registration-on-moonbeam }

After both channels are established and your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank} address.

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex, and prepending it with F’s until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank} section of the External XC-20 guide.

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
