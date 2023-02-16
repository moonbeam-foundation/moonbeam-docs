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

## Overview of the Integration Process {: #overview-of-integration }

The first step for a Moonriver/Moonbeam XCM integration, is to integrate with the Moonbase Alpha TestNet, through the Alphanet relay chain. Then a Moonriver integration must be completed before proceeding with Moonbeam (if applicable).  

### Moonbase Alpha {: #moonbase-alpha }

The entire process to get started with Moonbase Alpha can be summarized as follows:

1. Sync a node with the Alphanet relay chain
2. Provide the WASM/Geneiss head hash and your parachain ID for onboarding
3. Calculate your parachain sovereign account on the Alphanet relay chain (to be funded by the Moonbeam team)
4. Provide asset details of your parachain's asset so it can be registered on Moonbase Alpha
5. Open an HRMP channel to Moonbase Alpha from your parachain (through SUDO or via governance)
6. Accept the HRMP channel from Moonbase Alpha (through SUDO or via governance)
7. Register Moonbase Alpha's DEV token on your parachain (optional)
8. For testing the XCM integration, please send some tokens to:

    ```
    AccoundId: 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
    Hex:       0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
    ```

9. Test the XCM integration

Once all of these steps are completed and both teams have successfully tested asset transfers, your parachain token can be added to the Cross Chain Assets section of the [Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}. If deposit and withdrawals work as expected, an integration with Moonriver can begin.

### Moonriver & Moonbeam {: #moonriver-moonbeam }

From a technical perspective, the process to create a HRMP channel with Moonriver and Moonbeam is nearly the same. However, engagement with the Moonbeam community is crucial and required before a proposal will pass. The process is as follows:

1. Add details of the asset and project to [the forum](/tokens/governance/proposals/#submitting-your-idea-to-the-forum){target=_blank} in the the XCM category.
2. On the chain to connect, open an HRMP channel to Moonriver/Moonbeam. Optionally, you can create a batched proposal to register MOVR/GLMR or register at a later date
3. Once the proposal in step 2 gets enacted, you will create a batched proposal on Moonbeam to:
    1. Accept the incoming HRMP channel
    2. Propose an outgoing HRMP channel from Moonriver/Moonbeam
    3. Register the asset as an [XC-20 token](/builders/interoperability/xcm/xc20/overview){target=_blank}

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

## Forum and Polkassembly Template

When starting an XCM integration on a Moonbeam MainNet, you must add a preliminary draft of the proposal on the [Moonbeam forums](https://forum.moonbeam.foundation/){target=_blank} in the XCM category so that the voting community has the chance to provide preliminary feedback. It is recommended that this is done 5 days before the actual proposal.  

Once a proposal is available for voting, you must also add a description to it in [Polkassembly](){target=_blank}.

In both the Moonbeam preliminary forum post and in Polkassembly, add the following sections and information:  

- **Title** - YOUR_NETWORK_NAME Proposal to Open Channel & Register ASSET_NAME
- **Introduction** - one sentence summarizing the proposal
- **Network Information** - one sentence summarizing your Network, and relevant links to your website, Twitter, and other social channels
- **Summary** - brief description of the content of the proposal
- **On-Chain Proposal Reference (Forums Only)** - include if it is a Moonbeam or Moonriver proposal, the proposal number, and proposal hash
- **Technnical Details** - provide technical information required for the community to understand the use cases and purpose of the Proposal
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

## Re-anchoring Support {: #re-anchoring-support}

After the release of Polkadot version 0.9.16, the re-anchoring logic will suffer a [major breaking change](https://github.com/paritytech/polkadot/pull/4470){target=_blank}. This logic is used to compute how a parachain sees its own reserve tokens (from a multilocation point of view). 

Releases prior to version 0.9.16 do not compute this re-anchoring correctly, and therefore parachains will need to support both the wrong (pre-0.9.16) and correct (post 0.9.16) in their runtimes. An example on the wrong and correct re-anchoring logics for a parachain whose parachain ID is 1000 and wants to represent its own token can be seen below:

- Wrong re-anchoring (pre-0.9.16) - `MultiLocation { parents: 1, interior: Parachain(1000)}`
- Correct re-anchoring (post-09.16) - `MultiLocation { parents: 0, interior: Here }`

## Sync a Node {: #sync-a-node }

To sync a node, you can use the [Alphanet relay chain specs](https://drive.google.com/drive/folders/1JVyj518T8a77xKXOBgcBe77EEsjnSFFO){target=_blank} (note: the relay chain is Westend based, and will probably take 1 day to sync). 

For reference, you can use [Moonbase Alpha’s spec file](https://raw.githubusercontent.com/PureStake/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=_blank}. You'll need to adapt it to your chain.

To onboard your parachain, please provide the following:
- Genesis head/wasm hash
- Parachain ID. You can find the parachain IDs that have been already used in the [relay chain Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/parachains){target=_blank}

There are also some [snapshots for the Alphanet ecosystem relay chain](http://snapshots.moonbeam.network.s3-website.us-east-2.amazonaws.com/){target=_blank} you can use to quickly get started.

## Calculate and Fund the Parachain Sovereign Account {: #calculate-and-fund-the-parachain-sovereign-account }

To calculate your parachain’s sovereign account, you can use the [`calculateSovereignAddress.ts` script](https://github.com/albertov19/xcmTools/blob/main/calculateSovereignAddress.ts){target=_blank}. To run the script, you must provide the parachain ID and the name of the associated relay chain. The accepted values for the relay chain are `polkadot`, `kusama`, and `moonbase`.

For example, Moonbase Alpha’s sovereign account for both the relay chain and other parachains can be obtained with:

```
ts-node calculateSovereignAddress.ts --paraid 1000 --r moonbase
```

Which should result in the following response:

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

When getting started with the Moonbase Alpha relay chain, once you have your sovereign account’s address, please contact the team on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank}, so the team can fund it at a relay chain level. If not, you won’t be able to create the HRMP channel.

## Create an HRMP Channel To Moonbeam {: #create-an-hrmp-channel }

To create an HRMP channel, you'll need to send an XCM message to the relay chain that will request a channel to be opened through the relay chain. The message will need to contain the following XCM instructions:

 1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - takes funds out of the sovereign account (in the relay chain) of the origin parachain to a holding state
 2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - buys execution time from the relay chain to execute the XCM message
 3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} - provides the relay chain call data to be executed
 4. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - (optional) refunds the leftover funds after the execution. If this is not provided, no refunds will be carried out

### Get the Relay Chain Encoded Call Data {: #get-the-relay-chain-encoded-call-data }

To get the call data to be executed in step 3, you can head to Polkdot.js Apps and connect to the WSS endpoint for either the [Moonbase Alpha relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}, [Kusama](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}, or [Polkadot](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}. Navigate to the **Developer** tab, select **Extrinsics**, and take the following steps:

1. Select **hrmp** from the **submit the following extrinsic** dropdown
2. Select the **hrmpInitOpenChannel** extrinsic
3. Enter the Moonbeam parachain ID as the **recipient**

    === "Moonbeam"
        ```
        2004
        ```

    === "Moonriver"
        ```
        2023
        ```

    === "Moonbase Alpha"
        ```
        1000
        ```

 4. Enter the **proposedMaxCapacity**. This value is set to the respective relay chain's configuration (`configuration.activeConfig.hrmpChannelMaxCapacity`)

    === "Moonbeam"
        ```
        1000
        ```

    === "Moonriver"
        ```
        1000
        ```

    === "Moonbase Alpha"
        ```
        1000
        ```

 5. Enter the **proposedMaxMessageSize**. This value is set to the respective relay chain's configuration (`configuration.activeConfig.hrmpChannelMaxMessageSize`)

    === "Moonbeam"
        ```
        102400
        ```

    === "Moonriver"
        ```
        102400
        ```

    === "Moonbase Alpha"
        ```
        102400
        ```

  6. Copy the encoded call data, which will be required for the `Transact` XCM instruction as previously mentioned. For example, on Moonbase Alpha the encoded call data is `0x3300e8030000e803000000900100`

![Get open HRMP channel relay chain call data on Polkadot.js Apps](/images/builders/interoperability/xcm/xc-integration/xc-integration-1.png)

### Send an XCM Message to the Relay Chain {: #send-an-xcm-message-to-the-relay-chain-open }

Now that you have the relay chain encoded call data, you can assemble and send your XCM message to request a channel to be opened. This XCM message needs to be sent from the root account (either SUDO or via governance).

Before getting started, **please note that the values used are for reference only for the Moonbase Alpha relay chain; do not use these values in production**.

To get started, head to [Polkadot.js Apps](https://polkadot.js.org/apps/#/explorer){target=_blank} and connect to your parachain's WSS endpoint. From there, navigate to the **Developer** tab, select **Extrinsics**, and take the following steps:

1. Select **polakdotXcm** from the **submit the following extrinsic** dropdown
2. Select the **send** extrinsic
3. Set the following fields for **dest**

    | Parameter | Value |
    |:---------:|:-----:|
    |  Version  |  V1   |
    |  Parents  |   1   |
    | Interior  | Here  |

4. For the **message**, you can set the **version** to `V2` and add the following items
    1. Select the **WithdrawAsset** instruction and set the following values

        | Parameter |     Value     |
        |:---------:|:-------------:|
        |    Id     |   Concrete    |
        |  Parents  |       0       |
        | Interior  |     Here      |
        |    Fun    |   Fungible    |
        | Fungible  | 1000000000000 |

    2. Select the **BuyExecution** instruction and set the following values
    
        |  Parameter  |     Value     |
        |:-----------:|:-------------:|
        |     Id      |   Concrete    |
        |   Parents   |       0       |
        |  Interior   |     Here      |
        |     Fun     |   Fungible    |
        |  Fungible   | 1000000000000 |
        | WeightLimit |   Unlimited   |

    3. Select the **Transact** instruction and set the following values
    
        |      Parameter      |                                              Value                                               |
        |:-------------------:|:------------------------------------------------------------------------------------------------:|
        |     OriginType      |                                              Native                                              |
        | RequireWeightAtMost |                                            1000000000                                            |
        |       Encoded       | { paste the call data from the [previous section](#get-the-relay-chain-encoded-call-data) here } |

    4. Select the **RefundSurplus** instruction
    5. Select the **DepositAsset** instruction and set the following values

        | Parameter |                      Value                       |
        |:---------:|:------------------------------------------------:|
        |  Assets   |                       Wild                       |
        |   Wild    |                       All                        |
        | MaxAssets |                        1                         |
        |  Parents  |                        0                         |
        | Interior  |                        X1                        |
        |    X1     |                   AccountId32                    |
        |  Network  |                       Any                        |
        |    Id     | { enter the relay chain sovereign account here } |

        The sovereign account addresses are as follows:
                
        === "Polkadot"
            ```
            0x70617261d4070000000000000000000000000000000000000000000000000000
            ```

        === "Kusama"
            ```
            0x70617261e7070000000000000000000000000000000000000000000000000000
            ```
            
        === "Moonbase Alpha"
            ```
            0x70617261e8030000000000000000000000000000000000000000000000000000
            ```

 5. Click **Submit Transaction**

!!! note
    Using the above example values and the Moonbase Alpha relay chain sovereign account address, the encoded call data for the extrinsic is `0x1c000101000214000400000000070010a5d4e81300000000070010a5d4e800060002286bee383300e8030000e803000000900100140d0100040001010070617261e8030000000000000000000000000000000000000000000000000000`.

![Open HRMP channel XCM message on Polkadot.js Apps](/images/builders/interoperability/xcm/xc-integration/xc-integration-2.png)

Once the message has been sent, the relay chain should execute the content and the request to open the channel. Please contact us on [Telegram](https://t.me/Moonbeam_Official){target=_blank} or [Discord](https://discord.gg/PfpUATX){target=_blank} once you've requested opening the channel because the request needs to be accepted by Moonbeam.

## Register your Asset and Propose a New HRMP Channel {: #register-your-asset-and-propose-a-new-hrmp-channel }

An XCMP/HRMP channel from Moonbeam to your parachain must be registered to send assets from Moonbeam to the connecting chain. Additionally, the connecting parachain's asset(s) must be registered on Moonbeam for XCM transfers. On Moonbase Alpha, a channel and asset can be quickly registered with the help of the team, who use a sudo account. On Moonbeam and Moonriver, this must be done through governance. There are multiple ways that you can add these assets, but the [xcm-tools GitHub repo](https://github.com/PureStake/xcm-tools){target=_blank} is recommended.  

### Send a Batched Proposal via XCM-Tools {: #send-a-batched-proposal-via-xcm-tools }

When proposing an XCMP/HRMP channel registration on a Moonbeam network, you will wrap the channel and asset registrations into a single batched transaction so that during governance participants will have to vote on only one proposal. The xcm-tools GitHub repository should be cloned to aid with this process:  

```
git clone https://github.com/PureStake/xcm-tools.git
cd xcm-tools
```

Run the following command, which will output the encoded calldata to accept the incoming HRMP channel request [made in a previous step](#create-an-hrmp-channel). `YOUR_PARACHAIN_ID` is your parachain's ID.  

Be sure to copy the hexadecimal `PolkdotXcmSend` output of this command.  

=== "Moonbeam"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.network \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonbase Alpha"
    ```
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider {{ networks.moonbase.wss_url }} \
    --relay-ws-provider wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

Run this next command, which will output the encoded calldata to open an HRMP channel request to your parachain. `YOUR_PARACHAIN_ID` is your parachain's ID.  

Be sure to copy the hexadecimal `PolkdotXcmSend` output of this command.  

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

Run this third command, which will output the encoded calldata to register your asset on a Moonbeam network.  

`YOUR_PARACHAIN_ID` is your parachain's ID. `YOUR_ASSET_MULTILOCATION` is the [JSON-formatted multilocation](https://github.com/PureStake/xcm-tools#example){target=_blank} of the asset from the Moonbeam network's perspective. `YOUR_TOKEN_SYMBOL` is the symbol of the token you wish to register. It is recommended to add "xc" to the front of the symbol to indicate that the asset was bridged through XCM. `YOUR_TOKEN_DECIMALS` is the number of decimals your asset has, such as `18`. `YOUR_TOKEN_NAME` is the name of the token to register. `YOUR_UNITS_PER_SECOND` is the units of tokens to charge per second of execution time during XCM transfers. There is a [guide to calculate units per second](#calculating-units-per-second) below.   

Be sure to copy the hexadecimal `PolkdotXcmSend` output of this command. You can repeat this process multiple times if you plan to register multiple tokens.  

=== "Moonbeam"
    ```
    yarn register-asset -w wss://moonbeam.public.blastapi.io  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --sym "YOUR_TOKEN_SYMBOL" \
    -d YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    -u YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonriver"
    ```
    yarn register-asset -w wss://moonriver.public.blastapi.io  \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --sym "YOUR_TOKEN_SYMBOL" \
    -d YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    -u YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

=== "Moonbase Alpha"
    ```
    yarn register-asset -w wss://wss.api.moonbase.moonbeam.network   \
    --asset 'YOUR_ASSET_MULTILOCATION' \
    --sym "YOUR_TOKEN_SYMBOL" \
    -d YOUR_TOKEN_DECIMALS \
    --name "YOUR_TOKEN_NAME" \
    -u YOUR_UNITS_PER_SECOND \
    --ed 1 --sufficient true --revert-code true 
    ```

Finally, take the outputs of each command and insert them into the following command to send the batch proposal to democracy. `ACCEPT_INCOMING_CALL` is the hexadecimal encoded calldata found from the first command. `OPEN_CHANNEL_CALL` is the hexadecimal encoded calldata found from the second command. `REGISTER_ASSET_CALL` is the hexadecimal encoded calldata found from the third command. If you have more than one asset to be registered on Moonbeam, you can add its registration's hexadecimal encoded calldata with another `--call` flag. `YOUR_PRIVATE_KEY` is the private key of the funded Moonbeam account that is proposing.  

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

Once the batch proposal is sent through democracy, it will need to be seconded by either the Moonbeam team or another network member to continue with [the governance process](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}.  

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

## Accept the HRMP Channel {: #accept-the-hrmp-channel }

As previously mentioned, all XCMP/HRMP channel integrations with Moonbeam are unidirectional. As such, once your parachain is onboarded on a Moonbeam network, there needs to be a channel that Moonbeam will request to send tokens back to your parachain, and you'll need to accept it.

The process of accepting the channel is similar to the one of opening, meaning that you have to construct an encoded call data in the relay chain, and then get it executed via an XCM message from your parachain. 

### Get the Relay Chain Encoded Call Data {: #get-the-relay-chain-encoded-call-data }

To get the call data to be executed in step 3, you can head to Polkdot.js Apps and connect to the WSS endpoint for either the [Moonbase Alpha relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}, [Kusama](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}, or [Polkadot](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpolkadot.api.onfinality.io%2Fpublic-ws#/extrinsics){target=_blank}. Navigate to the **Developer** tab, select **Extrinsics**, and take the following steps:

1. Select **hrmp** from the **submit the following extrinsic** dropdown
2. Select the **hrmpAcceptOpenChannel** extrinsic
3. Enter the Moonbeam parachain ID as the **sender**

    === "Moonbeam"
        ```
        2004
        ```

    === "Moonriver"
        ```
        2023
        ```

    === "Moonbase Alpha"
        ```
        1000
        ```

4. Copy the encoded call data. It will be required for the `Transact` XCM instruction. For example, on Moonbase Alpha the call data is `0x3301e8030000`

![Get accept HRMP channel relay chain call data on Polkadot.js Apps](/images/builders/interoperability/xcm/xc-integration/xc-integration-3.png)

### Send an XCM Message to the Relay Chain {: #send-an-xcm-message-to-the-relay-chain-accept }

The steps to build and send an XCM message are the same as for opening a channel. The main difference is in the `Transact` instruction, where you need to provide the encoded call data calculated in the previous section for the `hrmpAcceptOpenChannel` extrinsic. This message needs to be sent from the root account (either SUDO or via governance).

Please refer back to the Create an HRMP Channel section and follow the steps to [Send an XCM Message to the Relay Chain](#send-an-xcm-message-to-the-relay-chain-open) and modify step 4c with the correct encoded call data.

![Accept HRMP channel XCM message on Polkadot.js Apps](/images/builders/interoperability/xcm/xc-integration/xc-integration-4.png)

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

Once the channel has been opened and accepted, your parachain's asset will need to be registered on Moonbeam. For that, the following information is needed:

After both channels are established and your asset is registered, the team will provide the asset ID and the [XC-20 precompile](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank} address.

Your XC-20 precompile address is calculated by converting the asset ID decimal number to hex, and prepending it with F’s until you get a 40 hex character (plus the “0x”) address. For more information on how it is calculated, please refer to the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/xc20/#calculate-xc20-address){target=_blank} section of the External XC-20 guide.

After the asset is successfully registered, you can try transferring tokens from your parachain to Moonbase Alpha.

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