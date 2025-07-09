---
title: Uniswap V2 Swap on Moonbeam from Polkadot via XCM
description: In this guide, we'll use remote EVM execution via XCM to perform a Uniswap V2 swap to showcase how Moonbeam can be leveraged in a connected contracts approach.
template: main.html
---

# Uniswap V2 Swap from Polkadot via XCM

_by Alberto Viera_

## Introduction {: #introduction }

In this tutorial, we’ll perform a Uniswap V2-styled swap from a relay chain (what Polkadot is to Moonbeam) using Polkadot's interoperability general message passing protocol called [XCM](/builders/interoperability/xcm/overview/){target=\_blank}. To do so, we'll be using a particular combination of XCM instructions that allow you to [call Moonbeam's EVM through an XCM message](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=\_blank}. Consequently, any blockchain that is able to send an XCM message to Moonbeam can tap into its EVM and all the dApps built on top of it.

**The content of this tutorial is for educational purposes only!**

For this example, you'll be working on top of the Moonbase Alpha (Moonbeam TestNet), which has its own relay chain (similar to Polkadot). The relay chain token is called `UNIT`, while Moonbase Alpha's is called `DEV`. Doing this in TestNet is less fun than doing it in production, but **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

Throughout this tutorial, we will refer to the account performing the Uniswap V2 swap via XCM as Alice. The tutorial has a lot of moving parts, so let's summarize them in a list and a flow diagram:

1. Alice has an account on the relay chain, and she wants to swap `DEV` tokens for `MARS` tokens (ERC-20 on Moonbase Alpha) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=\_blank}, a demo Uniswap V2 clone on Moonbase Alpha. Alice needs to send an XCM message to Moonbase Alpha from her relay chain account
2. The XCM message will be received by Moonbase Alpha and its instructions executed. The instructions state Alice's intention to buy some block execution time in Moonbase Alpha and execute a call to Moonbase's EVM, specifically, the Uniswap V2 (Moonbeam-Swap) router contract. The EVM call is dispatched through a special account Alice controls on Moonbase Alpha via XCM messages. This account is known as the [Computed Origin account](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}. Even though this is a keyless account (private key is unknown), the public address can be [calculated in a deterministic way](/builders/interoperability/xcm/remote-execution/computed-origins/#calculate-computed-origin){target=\_blank}
3. The XCM execution will result in the swap being executed by the EVM, and Alice will receive her `MARS` tokens in her special account
4. The execution of the remote EVM call through XCM will result in some EVM logs that are picked up by explorers. There is an EVM transaction and receipt that anyone can query to verify

![Remote EVM Call Through XCM for Uniswap V2 Swap Diagram](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-1.webp)

With the steps outlined, some prerequisites need to be taken into account, let's jump right into it!

## Checking Prerequisites {: #checking-prerequisites }

Considering all the steps summarized in the [introduction](#introduction), the following prerequisites need to be accounted for:

- You need to have UNITs on the relay chain to pay for transaction fees when sending the XCM. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/accounts){target=\_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha){target=\_blank}
- Your [Computed Origin account](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} must hold `DEV` tokens to fund the Uniswap V2 swap, and also pay for the XCM execution (although this could be paid in UNIT tokens as `xcUNIT`). We will calculate the Computed Origin account address in the next section

--8<-- 'text/_common/faucet/faucet-list-item.md'

## Calculating your Computed Origin Account {: #calculating-your-computed-origin-account }

--8<-- 'text/builders/interoperability/xcm/calculate-computed-origin-account.md'

For our case, we will send the remote EVM call via XCM from Alice's account, which is `5GKh9gMK5dn9SJp6qfMNcJiMMnY7LReYmgug2Fr5fKE64imn`, so the command and response would look like the following image.

--8<-- 'code/tutorials/interoperability/uniswapv2-swap/terminal/calculate.md'

The values are all summarized in the following table:

|                    Name                     |                                                                           Value                                                                           |
|:-------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        Origin Chain Encoded Address         |                                                    `5GKh9gMK5dn9SJp6qfMNcJiMMnY7LReYmgug2Fr5fKE64imn`                                                     |
|        Origin Chain Decoded Address         |                                           `0xbc5f3c61709f218d983fc773a600958a07fb18047418df7eeb0501d0679e397a`                                            |
| Computed Origin Account (32 bytes) |                                           `0x61cd3e07fe7d7f6d4680e3e322986b7877f108ddb18ec02c2f17e82fe15f9016`                                            |
| Computed Origin Account (20 bytes) |                                                       `0x61cd3e07fe7d7f6d4680e3e322986b7877f108dd`                                                        |

The script will return 32-byte and 20-byte addresses. We’re interested in the Ethereum-style account - the 20-byte one, which is `0x61cd3e07fe7d7f6d4680e3e322986b7877f108dd`. Feel free to look up your Computed Origin account on [Moonscan](https://moonbase.moonscan.io){target=\_blank}. Next, you can fund this account with DEV tokens.

--8<-- 'text/_common/faucet/faucet-sentence.md'

## Getting the Uniswap V2 Swap Calldata {: #getting-uniswapv2-swap-calldata }

The following section will walk through the steps of getting the calldata for the Uniswap V2 swap, as we need to feed this calldata to the [remote EVM call](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=\_blank} that we will build via XCM.

The function being targeted here is one from the Uniswap V2 router, more specifically [swapExactETHForTokens](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L252){target=\_blank}. This function will swap an exact amount of protocol native tokens (in this case `DEV`) for another ERC-20 token. It has the following inputs:

 - Minimum amount of tokens that you expect out of the swap (accounting for slippage)
 - Path that the take will trade (if there is no direct pool, the swap might be routed through multiple pair pools)
 - Address of the recipient of the tokens swapped
 - The deadline (in Unix time) from which the trade is no longer valid

The easiest way to get the calldata is through the [Moonbeam Uniswap V2 Demo](https://moonbeam-swap.netlify.app){target=\_blank} page. Once you go in the website, take the following steps:

 1. Set the swap **from** value and token and also set the swap **to** token. For this example, we want to swap 1 `DEV` token for `MARS`
 2. Click on the **Swap** button. Metamask should pop up, **do not sign the transaction**
 3. In Metamask, click on the **hex** tab, and the encoded calldata should show up
 4. Click on the **Copy raw transaction data** button. This will copy the encoded calldata to the clipboard

![Calldata for Uniswap V2 swap](/images/tutorials/interoperability/uniswapv2-swap-xcm/uniswapv2-swap-xcm-2.webp)

!!! note
    Other wallets also offer the same capabilities of checking the encoded calldata before signing the transaction.

Once you have the encoded calldata, feel free to reject the transaction in your wallet. The swap calldata that we obtained is encoded as follows (all but the function selector are expressed in 32 bytes or 64 hexadecimal characters blobs):

 1. The function selector, which is 4 bytes long (8 hexadecimal characters) that represents the function you are calling
 2. The minimum amount out of the swap that we want accounting for slippage, in this case, `10b3e6f66568aaee` is `1.2035` `MARS` tokens
 3. The location (pointer) of the data part of the path parameter (which is of type dynamic). `80` in hex is `128` decimal, meaning that information about the path is presented after 128 bytes from the beginning (without counting on the function selector). Consequently, the next bit of information about the path is presented in element 6
 4. The address receiving the tokens after the swap, in this case, is the `msg.sender` of the call
 5. The deadline limit for the swap
 6. The length of the address array representing the path
 7. First token involved in the swap, which is wrapped `DEV`
 8. Second token involved in the swap, `MARS`, so it is the last

```text
1. 0x7ff36ab5
2. 00000000000000000000000000000000000000000000000010b3e6f66568aaee -> Min Amount Out
3. 0000000000000000000000000000000000000000000000000000000000000080
4. 000000000000000000000000d720165d294224a7d16f22ffc6320eb31f3006e1 -> Receiving Address
5. 0000000000000000000000000000000000000000000000000000000063dbcda5 -> Deadline
6. 0000000000000000000000000000000000000000000000000000000000000002
7. 000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
8. 0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

In the calldata, we need to change three fields to ensure our swap will go through:

 - The minimum amount out, to account for slippage as the pool may have a different `DEV/MARS` balance when you try this out
 - The receiving address to our Computed Origin account
 - The deadline to provide a bit more flexibility for our swap, so you don't have to submit this immediately

**This is OK because we are just testing things :), do not use this code in production!** Our encoded calldata should look like this (the line breaks were left for visibility):

```text
0x7ff36ab5
0000000000000000000000000000000000000000000000000de0b6b3a7640000 -> New Min Amount
0000000000000000000000000000000000000000000000000000000000000080
00000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd -> New Address
00000000000000000000000000000000000000000000000000000000A036B1B9 -> New Deadline
0000000000000000000000000000000000000000000000000000000000000002
000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

Which, as one line, is:

```text
0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000A036B1B90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

You can also get the calldata programmatically using the [Uniswap V2 SDK](https://docs.uniswap.org/sdk/v2/overview){target=\_blank}.

## Generating the Moonbeam Encoded Calldata {: #generating-the-moonbeam-encoded-call-data }

Now that we have the Uniswap V2 swap encoded calldata, we need to generate the bytes that the `Transact` XCM instruction from the XCM message will execute. Note that these bytes represent the action that will be executed in the remote chain. In this example, we want the XCM message execution to enter the EVM and perform the swap, from which we got the encoded calldata.

 To get the SCALE (encoding type) encoded calldata for the transaction parameters, we can leverage the following [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} script (note that it requires `@polkadot/api` and `ethers`).

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/generate-moonbeam-encoded-calldata.js'
```

!!! note
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank}.

Let's go through each of the main components of the snippet shown above:

 1. Provide the input data for the call. This includes:
     - Moonbase Alpha endpoint URL to create the providers
     - [Uniswap V2 router address](https://moonbase.moonscan.io/address/0x8a1932d6e26433f3037bd6c3a40c816222a6ccd4#code){target=\_blank} which is the one the call interacts with
     - Encoded calldata for the Uniswap V2 swap that we calculated before
 2. Create the necessary providers. One is a [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider, through which we can call [Moonbeam pallets](/builders/substrate/interfaces/){target=\_blank} directly. The other one is an Ethereum API provider through Ethers.js
 3. This step is mainly a best practice. Here, we are estimating the gas of the EVM call that will be executed via XCM, as this is needed later on. You can also hardcode the gas limit value, but it is not recommended
 4. [Build the remote EVM call](/builders/interoperability/xcm/remote-execution/remote-evm-calls/#build-remote-evm-call-xcm){target=\_blank}. We bumped the gas by `10000` units to provide a bit of room in case conditions change. The inputs are identical to those used for the gas estimation
 5. Create the Ethereum XCM pallet call to the `transact` method, providing the call parameters we previously built
 6. Get the SCALE calldata of the specific transaction parameter, which we need to provide to the `Transact` XCM instruction later on. Note that in this particular scenario, because we need only the calldata of the transaction parameters, we have to use `tx.method.toHex()`

Once you have the code set up, you can execute it with `node`, and you'll get the Moonbase Alpha remote EVM calldata:

--8<-- 'code/tutorials/interoperability/uniswapv2-swap/terminal/encoded.md'

The encoded calldata for this example is:

```text
0x2600019b40090000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f00
```

And that is it! You have everything you need to start crafting the XCM message itself! It has been a long journey, but we are almost there.

## Building the XCM Message from the Relay Chain {: #building-the-xcm-message-relay-chain }

We are almost in the last part of this tutorial! In this section, we'll craft the XCM message using the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank}. We'll also dissect the message instruction per instruction to understand what is happening every step of the way.

The XCM message we are about to build is composed of the following instructions:

 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} — takes funds from the account dispatching the XCM in the destination chain and puts them in holding, a special take where funds can be used for later actions
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} — buy a certain amount of block execution time
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} — use part of the block execution time bought with the previous instruction to execute some arbitrary bytes
 - [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=\_blank} — takes assets from holding and deposits them to a given account

To build the XCM message, which will initiate the remote EVM call through XCM, and get its SCALE encoded calldata, you can use the following snippet:

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/build-xcm-message.js'
```

!!! note
    You can also get the SCALE encoded calldata by manually building the extrinsic in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/extrinsics){target=\_blank}.

Let's go through each of the main components of the snippet shown above:

 1. Provide the input data for the call. This includes:
     - Moonbase Alpha relay chain endpoint URL to create the provider
     - Amount of tokens (in Wei) to withdraw from the Computed Origin account. For this example, `0.01` tokens are more than enough. To understand how to get this value, please refer to the [XCM fee page](/builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=\_blank}
     - The [multilocation of the `DEV` token](/builders/interoperability/xcm/xc-registration/assets/#register-moonbeam-native-assets){target=\_blank} as seen by Moonbase Alpha
     - The weight for the `transact` XCM instruction. This can be obtained by multiplying `25000` and the gas limit obtained before. It is recommended to add approximately 10% more of the estimated value. You can read more about this value in the [Remote EVM Calls through XCM](/builders/interoperability/xcm/remote-execution/remote-evm-calls/#build-xcm-remote-evm){target=\_blank} page
     - The Computed Origin account as it will be needed later for an XCM instruction
     - The bytes for the `transact` XCM instruction that we calculated in the previous section
 2. Define the destination multilocation for the XCM message. In this case, it is the Moonbase Alpha parachain
 3. First XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before
 4. Second XCM instruction, `BuyExecution`. Here, we are paying for Moonbase Alpha block execution time in `DEV` tokens by providing its multilocation and the amount we took out with the previous instruction. Next, we are buying all the execution we can (`Unlimited` weight) with `0.001 DEV` tokens which should be around 20 billion weight units, plenty for our example
 5. Third XCM instruction, `Transact`. The instruction will use a portion of the weight bought (defined as `requireWeightAtMost`) and execute the arbitrary bytes that are provided (`transactBytes`)
 6. Fourth XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only `DEV` tokens) is deposited to the Computed Origin account, set as the `beneficiary`.
 7. Build the XCM message by concatenating the instructions inside a `V2` array
 8. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 9. Craft the `xcmPallet.send` extrinsic with the destination and XCM message. This method will append the [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} XCM instruction to our XCM message, and it is the instruction that will provide the necessary information to calculate the Computed Origin account
 10. Get the SCALE encoded calldata. Note that in this particular scenario, because we need the full SCALE encoded calldata, we have to use `tx.toHex()`. This is because we will submit this transaction using the calldata

!!! challenge
    Try a more straightforward example and perform a balance transfer from the Computed Origin account to any other account you like. You'll have to build the SCALE encoded calldata for a `balance.Transfer` extrinsic or create the Ethereum call as a balance transfer transaction.

Once you have the code set up, you can execute it with `node`, and you'll get the relay chain XCM calldata:

--8<-- 'code/tutorials/interoperability/uniswapv2-swap/terminal/build-message.md'

The encoded calldata for this example is:

```text
0x450604630004000100a10f0410000400010403000f0000c16ff286231300010403000f0000c16ff286230006010700902f500982b92a00fd042600019b40090000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000d01000001030061cd3e07fe7d7f6d4680e3e322986b7877f108dd
```

Now that we have the SCALE encoded calldata, the last step is to submit the transaction, which will send our XCM message to Moonbase Alpha, and do the remote EVM call!

## Sending the XCM Message from the Relay Chain {: #send-xcm-message-relay-chain }

This section is where everything comes together and where the magic happens! Let's recap what we've done so far:

 - We've created a relay chain account that is funded with `UNIT` tokens (relay chain native tokens)
 - We determined its Computed Origin account on Moonbase Alpha and funded this new address with `DEV` tokens (Moonbase Alpha native token)
 - We obtained the Uniswap V2 swap calldata, in which we'll be swapping `0.01 DEV` token for `MARS`, an ERC-20 that exists in Moonbase Alpha. We had to modify a couple of fields to adapt it to this particular example
 - We built the SCALE encoded calldata in Moonbase Alpha to access its EVM via XCM
 - We crafted our transaction to send an XCM message to Moonbase Alpha, in which we will ask it to execute the SCALE encoded calldata that was previously built. This, in turn, will execute an EVM call which will perform the Uniswap V2 swap for the precious `MARS` tokens!

To send the XCM message that we built in the previous section, you can use the following code snippet:

```js
--8<-- 'code/tutorials/interoperability/uniswapv2-swap/send-xcm-message.js'
```

Once you have the code set up, you can execute it with `node`, and the XCM message will be sent to initiate your Uniswap V2 swap in Moonbase Alpha:

--8<-- 'code/tutorials/interoperability/uniswapv2-swap/terminal/send-xcm.md'

And that is it! You've sent an XCM message, which performed a remote EVM call via XCM and resulted in a Uniswap V2-styled swap in Moonbase Alpha. But let's go into more detail about what happened.

This action will emit different events. The first one is the only relevant [in the relay chain](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/explorer/query/0x85cad5f3cef5d578f6acc60c721ece14842be332fa333c9b9eafdfe078bc0290){target=\_blank}, and it is named `xcmPallet.Sent`, which is from the `xcmPallet.send` extrinsic. In [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0x1f60aeb1f2acbc2cf6e19b7ad969661f21f4847f7b40457c459e7d39f6bc0779){target=\_blank}, the following events emitted by the `parachainSystem.setValidationData` extrinsic (where all the inbound XCM messages are processed) are of interest:

 - `parachainSystem.DownwardMessagesReceived` — states that there was an XCM message received
 - `evm.Log` — internal events emitted by the different contract calls. The structure is the same: contract address, the topics, and relevant data
 - `ethereum.Executed` — contains information on the `from` address, the `to` address, and the transaction hash of an EVM call done
 - `polkadotXcm.AssetsTrapped` — flags that some assets were in holding and were not deposited to a given address. If the `Transact` XCM instruction does not exhaust the tokens allocated to it, it will execute a [`RefundSurplus`](/builders/interoperability/xcm/core-concepts/instructions/#refund-surplus){target=\_blank} after the XCM is processed. This instruction will take any leftover tokens from the execution bought and put them in holding. We could prevent this by adjusting the fee provided to the `Transact` instruction, or by adding the instruction right after the `Transact`
 - `dmpQueue.ExecutedDownward` — states the result of executing a message received from the relay chain (a DMP message). In this case, the `outcome` is marked as `Complete`

Our XCM was successfully executed! If you visit [Moonbase Alpha Moonscan](https://moonbase.moonscan.io){target=\_blank} and search for [the transaction hash](https://moonbase.moonscan.io/tx/0x3fd96c5c7a82cd0b54c654f64d41879814d94a3ad9b66820f2be2fe7fc2a18eb){target=\_blank}, you'll find the Uniswap V2 swap that was executed via the XCM message.

!!! challenge
    Do a Uniswap V2 swap of `MARS` for any other token you want. Note that in this case, you'll have to remotely execute an ERC-20 `approve` via XCM first to allow the Uniswap V2 Router to spend the tokens on your behalf. Once the approval is done, you can send the XCM message for the swap itself.

--8<-- 'text/_disclaimers/educational-tutorial.md'
