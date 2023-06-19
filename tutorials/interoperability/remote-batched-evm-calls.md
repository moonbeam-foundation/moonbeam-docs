---
title: Remote Batched EVM Calls via XCM
description: In this guide, we'll use remote EVM execution via XCM coupled with the batch precompile to execute multiple contract calls in Moonbeam's EVM remotely via XCM.
template: main.html
---

# Remote Batched EVM Calls via XCM

![Banner Image](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-banner.png)
_June 8, 2023 | by Kevin Neilson_

## Introduction {: #introduction } 

In this tutorial, we’ll be making a series of remote batched EVM calls from a relay chain (what Polkadot is to Moonbeam) using Polkadot's general message passing protocol called [XCM](/builders/interoperability/xcm/overview/){target=_blank}. To do so, we'll be using a particular combination of XCM instructions that allow you to [call Moonbeam's EVM through an XCM message](/builders/interoperability/xcm/remote-evm-calls/){target=_blank}. The unique twist to this tutorial is that rather than making a single remote EVM contract call, we'll be using Moonbeam's [Batch precompile](/builders/pallets-precompiles/precompiles/batch/){target=_blank} to combine multiple EVM calls into a single transaction. 

To get the most out of this tutorial, you may wish to first familiarize yourself with [Remote EVM Calls Through XCM](/builders/interoperability/xcm/remote-evm-calls/){target=_blank} as well as Moonbeam's [Batch Precompile](/builders/pallets-precompiles/precompiles/batch/){target=_blank}.

**The content of this tutorial is for educational purposes only!**

For this example, you'll be working on top of Moonbase Alpha (Moonbeam TestNet), which has its own relay chain called [Moonbase Relay](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} (akin to the Polkadot Relay Chain). The relay chain token is called `UNIT`, while Moonbase Alpha's is called `DEV`. Importantly, you **must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

The goal of this tutorial is to show you how the [Batch Precompile](/builders/pallets-precompiles/precompiles/batch/){target=_blank} can work in conjunction with [Polkadot's XCM](https://docs.moonbeam.network/builders/interoperability/xcm/overview/){target=_blank} to allow you to trigger batched remote EVM calls on Moonbeam. To avoid adding complexity to this tutorial, the actual batched EVM calls we'll be making will be quite simple. We'll be initiating multiple mints of [planet ERC-20 test tokens on Moonbase Alpha](https://moonbase-minterc20.netlify.app/){target=_blank}. Although we've chosen simple contract calls for demonstration purposes, there are lots more real-life defi examples that you may wish to emulate, such as token approvals & swaps, claiming rewards from multiple pools, or swapping & depositing into LP pools. 

Throughout this tutorial, we will refer to the account executing the batched EVM calls via XCM as Alice. Let's preview the flow of this tutorial:

1. Alice has an account on the relay chain, and she wants to mint `Mars` and `Neptune` tokens (ERC-20s on Moonbase Alpha) using [Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=_blank}. Alice needs to send an XCM message to Moonbase Alpha from her relay chain account
2. The XCM message will be received by Moonbase Alpha and its instructions executed. The instructions state Alice's intention to buy some block execution time in Moonbase Alpha and execute a call to Moonbase's Batch Precompile, composed of two distinct mint calls. The batched EVM call is dispatched through a special account Alice controls on Moonbase Alpha via XCM messages. This account is known as the [multilocation-derivative account](/builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}. Even though this is a keyless account (private key is unknown), the public address can be [calculated in a deterministic way](/builders/interoperability/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}
3. The successful XCM execution will result in the mint commands being executed by the EVM, and Alice will receive her `Mars` and `Neptune` tokens in her special account
4. The execution of the remote EVM call through XCM will result in some EVM logs that are picked up by explorers. There is an EVM transaction and receipt that anyone can query to verify

With the steps outlined, some prerequisites need to be taken into account, let's jump right into it!

## Checking Prerequisites {: #checking-prerequisites }

Considering all the steps summarized in the [introduction](#introduction), the following prerequisites need to be accounted for:

- You need to have UNITs on the relay chain to pay for transaction fees when sending the XCM. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}
- Your [multilocation-derivative account](/builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions){target=_blank} must hold `DEV` tokens to fund the call to the Batch precompile, and also pay for the XCM execution (although this could be paid in UNIT tokens as `xcUNIT`). We will calculate the multilocation-derivative account address in the next section

--8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation-Derivative Account {: #calculating-your-multilocation-derivative-account }

--8<-- 'text/xcm/calculate-multilocation-derivative-account.md'

For our case, we will send the remote EVM call via XCM from Alice's account, which is `5GQtq2cSDLeN77T2Bs4jxV7yUQh841tWy6wtJoSUrFZAm5qS`, so the command and response should resemble the following image. A parachain ID is omitted from the command since we are sending the XCM instruction from the Relay Chain.

![Calculating the multilocation-derivative account](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-1.png)

The values are all summarized in the following table:

|                    Name                     |                                                                           Value                                                                           |
|:-------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        Origin Chain Encoded Address         |                                                    `5Djun1QqjtT1rrGnQNPJqWm5qzQ8Dc5e5k2UCV7B2q9UNzvU`                                                     |
|        Origin Chain Decoded Address         |                                           `0x4a22ede741fef61905903369efb5027271042cc04bbbcaa4354a450552bb4473`                                            |
|          Origin Chain Account Name          |                                                                         `Westend`                                                                         |
| Multilocation Received in Destination Chain | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0x4a22ede741fef61905903369efb5027271042cc04bbbcaa4354a450552bb4473"}}}}` |
| Multilocation-Derivative Account (32 bytes) |                                           `0x0d1587fae4f265b31ea9ba0cfdb1ade1208ed657bebbc67dc4c8148add780b00`                                            |
| Multilocation-Derivative Account (20 bytes) |                                                       `0x0d1587fae4f265b31ea9ba0cfdb1ade1208ed657`                                                        |

The script will return 32-byte and 20-byte addresses. We’re interested in the Ethereum-style account - the 20-byte one, which is `0x0d1587fae4f265b31ea9ba0cfdb1ade1208ed657`. Feel free to look up your multilocation-derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. Next, you can fund this account with DEV tokens. 

--8<-- 'text/faucet/faucet-sentence.md'

## Preparing the Mint EVM Calldata {: #preparing-the-mint-evm-calldata }

First, we'll generate the necessary call data for minting the `Mars` and `Neptune` tokens. We'll then reference the Batch Precompile to batch the calls into a single one. 

The function being targeted here is the `mint` function of [Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=_blank}. It takes no parameters and the function call data is the same for each planet. However, each planet has a different contract address. 

The easiest way to get the calldata is through the [Moonbase Minter](https://moonbase-minterc20.netlify.app/){target=_blank} page. Once you land on the website, take the following steps:

 1. Press **Connect MetaMask** and unlock your wallet
 2. Click on any of the **Mint** buttons since they all have the same calldata
 3. Metamask should pop up but **do not sign the transaction**. In Metamask, click on the **hex** tab, and the encoded calldata should show up
 4. Click on the **Copy raw transaction data** button. This will copy the encoded calldata to the clipboard, which should match: `0x2004ffd9`

![Calldata for Minting action](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-2.png)

!!! note
    Other wallets also offer the same capabilities of checking the encoded calldata before signing the transaction.

## Preparing the Batched Calldata {: #preparing-the-batched-calldata }
Now that we have the call data for the mint actions, we can work with the Batch Precompile to combine multiple calls into a single one. 

For demonstration purposes, we'll be using remix to visualize and construct our call data. Go ahead and copy [Batch.sol](https://raw.githubusercontent.com/PureStake/moonbeam/master/precompiles/batch/Batch.sol){target=_blank} and compile it. As it is a precompile, we won't be deploying anything but rather will access the Batch precompile at its respective address of `0x0000000000000000000000000000000000000808`. The Batch Precompile offers several ways to batch your transactions with varying tolerances for subcall failures. For more information about how each method of the Batch Precompile works, be sure to check out the full [Batch Precompile tutorial](builders/pallets-precompiles/precompiles/batch/){target=_blank}.

Specify your environment in Remix as **Injected Web3** and make sure your wallet is on the Moonbase Alpha network. After inputting the address and pressing **At Address** on the **Deploy** tab of Remix, take the following steps to prepare the batched calls: 

1. Expand the **batchAll** or another desired method of the batch precompile.
2. In the **To** field, place the addresses of the `Mars` and `Neptune` contracts enclosed in quotes and separated by a comma. The entire line should be wrapped in brackets as follows: `["0x1FC56B105c4F0A1a8038c2b429932B122f6B631f","0xed13B028697febd70f34cf9a9E280a8f1E98FD29"]`
3. Provide an empty `[]` open and close brackets in the value field. We don't want to send any tokens to the contracts as they are not payable contracts.
4. In the `callData` field, provide the following: `["0x2004ffd9","0x2004ffd9"]`. Note that you need to provide the call data for each call, even if the call data is identical like it is with both `mint` calls.
5. Optionally, you could specify a gas limit but there is no need here, so simply provide an empty `[]` open and close brackets.
6. To validate that you have correctly configured the calls, you can press **Transact** but don't confirm the transaction in your wallet. If you get an error, double check that you have correctly formatted each parameter.
7. MetaMask should pop up, **do not sign the transaction**. In MetaMask, click on the **hex** tab, and the encoded calldata should show up.
8. Click on the **Copy raw transaction data** button. This will copy the encoded calldata of the batched call to the clipboard. 

![Generate batched calls using Batch Precompile](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-3.png)

## Generating the Moonbeam Encoded Callcata {: #generating-the-moonbeam-encoded-call-data }

Now that we have the batched EVM calldata that contains the two mint commands, we need to generate the bytes that the `Transact` XCM instruction from the XCM message will execute. Note that these bytes represent the action that will be executed in the remote chain. In this example, we want the XCM message execution to enter the EVM and issue the two mint commands, from which we got the encoded calldata.

To get the SCALE (encoding type) encoded calldata for the transaction parameters, we can leverage the following [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} script (note that it requires `@polkadot/api` and `ethers`).


```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/generate-moonbeam-encoded-calldata.js'
```

!!! note
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}.

Let's go through each of the main components of the snippet shown above:

 1. Provide the input data for the request. This includes: 
     - Moonbase Alpha endpoint URL to create the providers
     - Address of the Batch Precompile
     - Encoded calldata for the batched call that contains both mint commands.
 2. Create the necessary providers. One is a [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider, through which we can call [Moonbeam pallets](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/){target=_blank} directly. The other one is an Ethereum API provider through Ethers.js
 3. Here, we are hardcoding the gas limit for simplicity and to avoid gas estimation issues as a result of the Batch precompile.
 4. [Build the remote EVM call containing the batched call](/builders/interoperability/xcm/remote-evm-calls/#build-remove-evm-call-xcm){target=_blank}.
 5. Create the Ethereum XCM pallet call to the `transact` method, providing the call parameters specified above.
 6. Get the SCALE calldata of the specific transaction parameter, which we need to provide to the `Transact` XCM instruction later on. Note that in this particular scenario, because we need only the calldata of the transaction parameters, we have to use `tx.method.toHex()`

Once you have the code set up, you can execute it with `node`, and you'll get the Moonbase Alpha remote EVM calldata:

![Getting the Moonbeam call data for the remote evm call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-4.png)

The encoded calldata for this example is:

```
0x260001f0490200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000000110896e292b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000000000000000000000000ed13b028697febd70f34cf9a9e280a8f1e98fd29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000042004ffd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042004ffd900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

And that is it! You have everything you need to start crafting the XCM message itself! It has been a long journey, but we are almost there.

## Building the XCM Message from the Relay Chain {: #building-the-xcm-message-relay-chain }

We are almost in the last part of this tutorial! In this section, we'll craft the XCM message using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. We'll also break down the message instruction by instruction to understand what is happening each step of the way.

The XCM message we are about to build is composed of the following instructions:

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} — takes funds from the account dispatching the XCM in the destination chain and puts them in holding where funds can be used for later actions
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — buy a certain amount of block execution time
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} — use part of the block execution time bought with the previous instruction to execute some arbitrary bytes
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — takes assets from holding and deposits them to a given account

To build the XCM message, which will initiate the remote EVM call through XCM, and get its SCALE encoded calldata, you can use the following snippet:

```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/build-xcm-message.js'
```

!!! note
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}.

Let's go through each of the main components of the snippet shown above:

 1. Provide the input data for the call. This includes:
     - [Moonbase Relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} endpoint URL to create the provider
     - Amount of tokens (in Wei) to withdraw from the multilocation-derivative account. For this example, `0.01` tokens are more than enough. To understand how to get this value, please refer to the [XCM fee page](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank}
     - The [multilocation of the `DEV` token](/builders/interoperability/xcm/xc-integration/#register-moonbeams-asset-on-your-parachain){target=_blank} as seen by Moonbase Alpha
     - The weight for the `transact` XCM instruction. This can be obtained by multiplying `25000` and the gas limit obtained before. It is recommended to add approximately 10% more of the estimated value. You can read more about this value in the [Remote EVM Calls through XCM](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank} page
     - The multilocation-derivative account as it will be needed later for an XCM instruction
     - The bytes for the `transact` XCM instruction that we calculated in the previous section
 2. Define the destination multilocation for the XCM message. In this case, it is the Moonbase Alpha parachain
 3. First XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before
 4. Second XCM instruction, `BuyExecution`. Here, we are paying for Moonbase Alpha block execution time in `DEV` tokens by providing its multilocation and the amount we took out with the previous instruction. Next, we are buying all the execution we can (`Unlimited` weight) with `0.001 DEV` tokens which should be around 20 billion weight units, plenty for our example
 5. Third XCM instruction, `Transact`. The instruction will use a portion of the weight bought (defined as `requireWeightAtMost`) and execute the arbitrary bytes that are provided (`transactBytes`)
 6. Fourth XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only `DEV` tokens) is deposited to the multilocation-derivative account, set as the `beneficiary`.
 7. Build the XCM message by concatenating the instructions inside a `V3` array
 8. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 9. Craft the `xcmPallet.send` extrinsic with the destination and XCM message. This method will append the [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction to our XCM message, and it is the instruction that will provide the necessary information to calculate the multilocation-derivative account
 10. Get the SCALE encoded calldata. Note that in this particular scenario, because we need the full SCALE encoded calldata, we have to use `tx.toHex()`. This is because we will submit this transaction using the calldata

!!! challenge
    Try a more straightforward example and perform a balance transfer from the multilocation-derivative account to any other account you like. You'll have to build the SCALE encoded calldata for a `balance.Transfer` extrinsic or create the Ethereum call as a balance transfer transaction.

Once you have the code set up, you can execute it with `node`, and you'll get the relay chain XCM calldata:

![Getting the Relay Chain XCM calldata for the Remote Batched call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-5.png)

The encoded calldata for this example is:

```
0xc10a04630003000100a10f031000040000010403000f0000c16ff28623130000010403000f0000c16ff28623000601070053cd200a007d09260001f0490200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000000110896e292b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000000000000000000000000ed13b028697febd70f34cf9a9e280a8f1e98fd29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000042004ffd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042004ffd9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d0100000103000d1587fae4f265b31ea9ba0cfdb1ade1208ed657
```

Now that we have the SCALE encoded calldata, the last step is to submit the transaction, which will send our XCM message to Moonbase Alpha, and do the remote batched EVM call!

## Sending the XCM Message from the Relay Chain {: #send-xcm-message-relay-chain }

Congratulations on making it here, you're almost done! Let's recap what we've done so far:

 - We've created a relay chain account that is funded with `UNIT` tokens (relay chain native tokens)
 - We determined its multilocation-derivative account on Moonbase Alpha and funded this new address with `DEV` tokens
 - We obtained the Batch precompile calldata which combines two mint calls for `Mars` and `Neptune` ERC-20 tokens.
 - We built the SCALE encoded calldata in Moonbase Alpha to access its EVM via XCM
 - We crafted our transaction to send an XCM message to Moonbase Alpha, in which we will ask it to execute the SCALE encoded calldata that was previously built. This, in turn, will execute the call to the batch precompile which includes the mint calls for both the `Mars` and `Neptune` ERC-20 tokens!

To send the XCM message that we built in the previous section, you can use the following code snippet:

```js
--8<-- 'code/tutorials/interoperability/remote-batched-evm-calls/send-xcm-message.js'
```

Once you have the code set up, you can execute it with `node`, and the XCM message will be sent to initiate your call to the batch precompile for the mints of `Mars` and `Neptune` ERC-20 tokens in Moonbase Alpha. Don't worry if you see an `Abnormal Closure` error. Rest assured the XCM message was sent successfully. 

![Sending the XCM message from the Relay Chain to Moonbase Alpha for the batched EVM call](/images/tutorials/interoperability/remote-batched-evm-calls/remote-batched-evm-calls-6.png)

And that is it! You've sent an XCM message, which performed a remote EVM call to the batch precompile via XCM and resulted in mints of `Mars` and `Neptune` ERC-20 tokens. But let's go into more detail about what happened.

This action will emit different events. The first one is the only relevant [in the relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x85cad5f3cef5d578f6acc60c721ece14842be332fa333c9b9eafdfe078bc0290){target=_blank}, and it is named `xcmPallet.Sent`, which is from the `xcmPallet.send` extrinsic. In [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0x1f60aeb1f2acbc2cf6e19b7ad969661f21f4847f7b40457c459e7d39f6bc0779){target=_blank}, the following events emitted by the `parachainSystem.setValidationData` extrinsic (where all the inbound XCM messages are processed) are of interest:

 - `parachainSystem.DownwardMessagesReceived` — states that there was an XCM message received
 - `evm.Log` — internal events emitted by the different contract calls. The structure is the same: contract address, the topics, and relevant data
 - `ethereum.Executed` — contains information on the `from` address, the `to` address, and the transaction hash of an EVM call done
 - `polkadotXcm.AssetsTrapped` — flags that some assets were in holding and were not deposited to a given address. If the `Transact` XCM instruction does not exhaust the tokens allocated to it, it will execute a [`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=_blank} after the XCM is processed. This instruction will take any leftover tokens from the execution bought and put them in holding. We could prevent this by adjusting the fee provided to the `Transact` instruction, or by adding the instruction right after the `Transact`
 - `dmpQueue.ExecutedDownward` — states the result of executing a message received from the relay chain (a DMP message). In this case, the `outcome` is marked as `Complete`

Our XCM was successfully executed! If you visit [Moonbase Alpha Moonscan](https://moonbase.moonscan.io/){target=_blank} and search for [the transaction hash](https://moonbase.moonscan.io/tx/0x797f9a75257cf1b6aa0cf7a3b59758402b6bb603a27de86450e2177877aaa889){target=_blank}, you'll find the call to the Batch precompile that was executed via the XCM message. Note that you can only call the `mint` commands once per hour per planet. If you wish to experiment further and make additional mint calls, simply change the destination contract address to a different planet when configuring the batched call.

!!! challenge
    Use the batch precompile to combine an approval and a Uniswap V2 swap of `MARS` for any other token you want. As a thought experiment, consider carefully which method of the batch precompile is best suited to combine an approval and a swap transaction.

--8<-- 'text/disclaimers/educational-tutorial.md'
