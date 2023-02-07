---
title: UniswapV2 Swap via XCM
description: In this guide, we'll be leveraging remote EVM execution to perform an UniswapV2 style swap via XCM.
template: main.html
---

# Uniswap V2 Swap from Polkadot via XCM

![Banner Image](/images/tutorials/uniswapv2-swap-xcm/uniswapv2-swap-xcm-banner.png)
_February 2, 2023 | by Alberto Viera_

## Introduction {: #introduction } 

In this tutorial, we’ll perform a Uniswap V2 styled swap from a relay chain (what Polkadot is to Moonbeam) using Polkadot's intra-operability general message passing protocol called [XCM](https://github.com/paritytech/xcm-format){target=_blank}. To do so, we'll be using a special combination of XCM instructions that allow you to [call Moonbeam's EVM through an XCM message](/builders/xcm/remote-evm-calls/){target=_blank}. Consequently, any blockchain that is able to send an XCM message to Moonbeam can tap into its EVM and all the dApps built on top of it.

For this example, you'll be working on top of the Moonbase Alpha TestNet, in which the Alphanet relay chain will act as Polkadot, and Moonbase Alpha as Moonbeam. The relay chain token is called UNIT, while Moonbase Alpha's token is called DEV. Doing this in TestNet is not as fun as doing it in production, but **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

Throughout this tutorial, we will refer to the account performing the Uniswap V2 swap via XCM as Alice. The tutorial has a lot of moving parts, so let's summarize them in a list and a flow diagram:

1. Alice has an account on the relay chain, and she wants to do a swap of DEV tokens for MARS tokens (ERC-20 on Moonbase Alpha) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha. Alice needs to send an XCM message to Moonbeam from her relay chain account
2. The XCM message will be received by Moonbase Alpha and its instructions executed. The instructions state Alice's intention of buying some block space in Moonbase Alpha and execute a call to Moonbase's EVM, more specifically, the Uniswap V2 (Moonbeam-Swap) router contract. The EVM call is dispatched through a special account that Alice controls on Moonbase Alpha via XCM messages. This account is known as [multilocation-derivative account](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}. Even though this is a keyless account (private key is unknown), the public address can be [calculated in a deterministic way](/builders/xcm/remote-evm-calls/#calculate-multilocation-derivative){target=_blank}
3. The XCM execution will result in the swap being executed by the EVM, and Alice will receive her MARS tokens in her special account
4. The execution of the remote EVM call through XCM will result in some EVM logs that are picked up by explorers. There is an EVM transaction and receipt that anyone can query to verify

XXX FLOW DIAGRAM

With the steps outlined, some prerequisites need to be taken into account, let's jump right into it!

## Checking Prerequisites {: #checking-prerequisites }

Considering all the steps summarized in the [#introduction](#introduction), the following prerequisites need to be accounted for:

1. Alice needs to have UNITs on the relay chain to pay for transaction fees when sending the XCM
2. Alice's [multilocation-derivative account](/builders/xcm/xcm-transactor/#general-xcm-definitions){target=_blank} must hold DEV tokens to fund the Uniswap V2 swap, and also pay for the XCM execution (although this could be paid in UNIT tokens as `xcUNIT`). We will calculate the multilocation-derivative account address in the next section

--8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation Derivative Account {: #calculating-your-multilocation-derivative-account }

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation derivative account. 

To generate the multilocation derivative account, first clone the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank}. Run `yarn` to install the necessary packages, and then run:


```sh
yarn calculate-multilocation-derivative-account \
--w wss://wss.api.moonbase.moonbeam.network \
--a YOUR-MOONBASE-RELAY-ACCOUNT-HERE \
--n 0x57657374656e64
```

Let's review the parameters passed along with this command:

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
- The `-a` flag corresponds to your Moonbase relay chain address
- The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on

For our case, we will be sending the remote EVM call via XCM from Alice's account which address is `5EnnmEp2R92wZ7T8J2fKMxpc1nPW5uP8r5K3YUQGiFrw8uG6`, so the command and response would look like the following image.

![Calculating the multilocation-derivative account](/images/tutorials/remote-uniswapv2-swap-xcm/remote-uniswapv2-swap-xcm-2.png)

The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one, which is `0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`. Feel free to look up your multilocation-derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}.

--8<-- 'text/faucet/faucet-sentence.md'

## Getting the Uniswap V2 Swap Calldata {: #getting-uniswapv2-swap-calldata }

The following section will walk through the steps of getting the calldata for the Uniswap V2 swap, as we need to feed this calldata to the [remote EVM call](/builders/interoperability/xcm/remote-evm-calls/) that we will build via XCM.

The function being targeted here is one from the Uniswap V2 router, more specifically [swapExactETHForTokens](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L252){target=_blank}. This function will swap an exact amount of protocol native tokens (in this case DEV) for another ERC-20 token. It has the following inputs:

 - Minimum amount of tokens that you expect out of the swap (accounting for slippage)
 - Path that the take will trade (if there is no direct pool, the swap might be routed through multiple pair-pools)
 - Address of the recipient of the tokens swapped
 - The deadline (in Unix time) from which the trade is no longer valid

The easiest way to get the calldata is through the [Moonbeam Uniswap V2 Demo](https://moonbeam-swap.netlify.app/) page. Once you go in the website, take the following steps:

 1. Set the swap **from** value and token and also set the swap **to** token. For this example, we want to swap 1 `DEV` token for `MARS`
 2. Click on the **Swap** button. Metamask should pop-up, **do not sign the transaction**
 3. In Metamask, click on the **hex** tab, the encoded calldata should show up
 4. Click on the **Copy raw transaction data** button, this will copy the encoded call data to the clipboard

![Calldata for UniswapV2 swap](/images/tutorials/remote-uniswapv2-swap-xcm/remote-uniswapv2-swap-xcm-3.png)

!!! note
    Other wallets also offer the same capabilities of checking the encoded calldata before signing the transaction.

Once you have the encoded calldata, feel free to reject the transaction in your wallet. The swap calldata that we obtained is encoded as follows (all but the function selector are expressed in 32 bytes or 64 hexadecimal characters blobs):

 1. The function selector, which are 4 bytes (8 hexadecimal characters) that represents the function you are calling
 2. The amount, in this case `56983806981` is one `DEV` tokens in Wei units
 3. The location of the data part of the path parameter (which is of type dynamic). `80` in hex is `128` decimal, meaning that information about the path is presented after 128 bytes from the begining (without counting on the function selector). Consequently, the next bit of information about the path is presented in the element 6
 4. The address receiving the tokens after the swap, in this case is the `msg.sender` of the call
 5. The deadline limit for the swap
 6. The length of the address array representing the path
 7. First token involved in the swap, which is wrapped `DEV`
 8. Second token involved in the swap, which is `MARS` so it is the last 
 

```
1. 0x7ff36ab5
2. 000000000000000000000000000000000000000000000006ac25438ffcc14f0e
3. 0000000000000000000000000000000000000000000000000000000000000080
4. 000000000000000000000000d720165d294224a7d16f22ffc6320eb31f3006e1 -> Receiving Address
5. 0000000000000000000000000000000000000000000000000000000063dbcda5 -> Deadline
6. 0000000000000000000000000000000000000000000000000000000000000002
7. 000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
8. 0000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f
```

In the calldata, we need to change two fields to ensure our swap will go through. First, we will switch the receiving address to our multilocation-derivative account. Next, we will change the deadline to provide a bit more flexibility for our swap, so you don't have to submit this immediatly. **This is OK because we are just testing things :), do not use this code in production!** Our encoded call data should look like this (the line breaks were left for visibility):

```
0x7ff36ab5
0000000000000000000000000000000000000000000000000000056983806981
0000000000000000000000000000000000000000000000000000000000000080
0000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def526 -> New Address
0000000000000000000000000000000000000000000000000000000064746425 -> New Deadline
0000000000000000000000000000000000000000000000000000000000000002
000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1
000000000000000000000000ffffffff1fcacbd218edc0eba20fc2308c778080
```

Which as a one liner is:

```
0x7ff36ab5000000000000000000000000000000000000000000000000000005698380698100000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e1000000000000000000000000ffffffff1fcacbd218edc0eba20fc2308c778080
```

## Generating the Moonbeam Encoded Callcata {: #generating-the-moonbeam-encoded-call-data }

Now that we have the UniswapV2 swap encoded calldata, we need to generate the bytes that the `transact` instruction from the XCM message will execute.





Then, head to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}. In order to see the **Extrinsics** menu here, you’ll need to have at least one account accessible in Polkadot.js Apps. If you don’t, create one now. Then, head to the **Developer** tab and press **Extrinsics**. 

![Moonbase Alpha Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-2.png)

In the following steps you will be preparing a transaction, but you’ll need to refrain from submitting the transaction here in order to complete this tutorial in its entirety. We’ll take the resulting encoded call data from preparing this staking operation, and send it via XCM from the relay chain in a later step. From the **Extrinsics** page, take the following steps:

1. Select the **parachainStaking** Pallet
2. Select the **delegate** function
3. Paste in your selected collator’s address. You can retrieve a list of collator candidates [via the Polkadot.js API with these instructions](/tokens/staking/stake/#retrieving-the-list-of-candidates){target=_blank}
4. Paste your desired stake amount in Wei. In the below example 1 DEV or `1000000000000000000` Wei is specified. You can find a unit converter here on [Moonscan](https://moonscan.io/unitconverter){target=_blank}
5. Enter the collator’s number of existing delegations (this can be found next to the collator’s name / address on the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} or [fetched from the Polkadot.js API](/tokens/staking/stake/#get-the-candidate-delegation-count){target=_blank}). Alternatively, you can enter the upper bound of `{{networks.moonbase.staking.max_del_per_can}}` because this estimation is only used to determine the weight of the call
6. Enter your number of existing delegations from your multilocation derivative account. This is most likely `0` but because this estimation is only used to determine the weight of the call, you can specify an upper bound here of `{{networks.moonbase.staking.max_del_per_del}}`. Or, if you'd prefer, you can use the Polkadot.js API to fetch your exact number of existing delegations according  to [these instructions](/tokens/staking/stake/#get-your-number-of-existing-delegations){target=_blank}
7. Finally, copy the encoded call data to a text file or another easily accessible place because you will need it later. Do not copy the encoded call hash, and do not submit the transaction

!!! note
    Astute readers may notice the selected account below is named “Academy.” It does not matter which account you have selected in Moonbase Alpha Polkadot.js Apps. This is because you're not submitting the prepared transaction, only copying the encoded call data, which does not contain a reference to the sending account. 

![Moonbase Alpha Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-3.png)

## Sending the XCM Instructions from the Moonbase relay chain {: #sending-the-xcm-instructions-from-the-moonbase-relay-chain }

In another tab, head to [Moonbase relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}. Click on the **Developer** tab and press **Extrinsics**. 

![Moonbase Relay Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-4.png)

### Building the Destination Multilocation {: #building-the-destination-multilocation }

Let’s get started crafting our XCM message that will transport our remote execution instructions to the Moonbase Alpha parachain to ultimately stake our desired amount of DEV tokens to a chosen collator. To get started, take the following steps: 

1. Unlike the prior steps where the selected account wasn’t relevant, the account selected here must be the account associated with your multilocation derivative account 
2. Choose the **xcmPallet** pallet
3. Choose the **send** method
4. Set the destination version to **V1**
5. To target Moonbase Alpha, set the destination to:

```
{
  "parents":0,
  "interior":
    {
    "x1":
      {
      "Parachain": 1000
    }
  }
}
```
6. Set the message version to **V2**

![Moonbase Relay Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-5.png)

In the next section, we’ll start assembling the XCM instructions. 

### Preparing the Structure of the XCM Message {: #preparing-the-structure-of-the-xcm-message }

1. Select **V2** for **XcmVersionedXcm**
2. Our XCM Message is going to have 3 distinct XCM instructions, so press the first **Add Item** button 3 times 
3. Below the first XCM Instruction of **WithdrawAsset**, we need to add the asset we’re going to withdraw here, so press the **Add Item** button below **WithdrawAsset** once 

![Preparing the structure of the XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-6.png)

### Assembling the Contents of the XCM Message {: #assembling-the-contents-of-the-xcm-message }

Now we’re ready for the fun part! You'll need to press **Add Item** beneath the **BuyExecution** and **Transact** XCM instructions respectively. Construct the XCM message that will remotely stake funds on the Moonbase Alpha parachain as follows:

```
{
  "WithdrawAsset":
    [
      {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
    ],
  "BuyExecution":
    {
      "fees": {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
      },
      "weightLimit": "Unlimited"
    },
  "Transact":
    {
      "originType": "SovereignAccount",
      "requiredWeightAtMost": "40000000000",
      "call": {
        "encoded": "0x0c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000"
      }

    }
}
```

!!! note
    Providing the above encoded call data will automatically stake to the PS-31 collator on Moonbase Alpha. You are welcome to delegate to any collator on Moonbase Alpha provided you have copied the appropriate encoded call data from [Moonbase Alpha Polkadot.js Apps]( #preparing-to-stake-on-moonbase-alpha). 

Verify that the structure of your XCM message resembles the below image, then press **Submit Transaction**. Note that your encoded call data will vary based on your chosen collator.

![Assembling the complete XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-7.png)

!!! note
    The encoded call data for the call configured above is `0x630001010100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010700902f5009b80c113a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d00000000000000002c01000025000000`.


And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few minutes before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachain staking pallet (on the substrate side) rather than through the staking precompile (on the EVM). 
 