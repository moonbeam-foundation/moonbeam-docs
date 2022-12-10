---
title: Remote Staking via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
---

# Remote Staking via XCM

![Banner Image](/images/tutorials/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)

## Introduction {: #introduction } 
In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase Relay Chain (equivalent to the Polkadot Relay Chain). This tutorial assumes a basic familiarity with [XCM](/builders/xcm/overview/){target=_blank} and [Remote Execution via XCM](builders/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background. 

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a remote EVM call that calls the [staking precompile](builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachainStaking pallet](builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachainStaking pallet directly. 

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Prerequisites
For development purposes we’ll be taking these steps on Moonbase Alpha and Moonbase Relay using testnet funds. As a prerequisite, you should have DEV tokens which you can acquire from the [Moonbase Alpha faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank} as well as some UNIT, the native token of the Moonbase Relay Chain. You can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} and then withdraw them to [your account on the Moonbase Relay Chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}. 

Copy the account of your existing or newly created account on the [Moonbase Relay Chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. We’re going to need it to calculate the corresponding derivative account. A derivative account is a special type of account that’s keyless (the private key is unknown). Transactions from a derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your derivative account - and if you lose access to your Moonbase Relay account, you’ll also lose access to your derivative account. 

To generate the derivative account, first clone Alberto’s [xcmTools repo](https://github.com/albertov19/xcmTools){target=_blank}. Run `yarn` to install the necessary packages and then run:

    ```
    ts-node calculateMultilocationDerivative.ts \
     --w wss://wss.api.moonbase.moonbeam.network \
     --a YOUR-MOONBASE-RELAY-ACCOUNT-HERE \
     --n 0x57657374656e64
    ```

The -w flag corresponds to the endpoint we’re using to fetch this information. The -n flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase Relay is based on. The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one. Feel free to look up your derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 2 DEV. 

## Preparing to Stake on Moonbase Alpha
First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The PS-31 collator shown below has `60` delegations at the time of writing. 

![Moonbeam Network Apps Dashboard](/images/tutorials/remote-staking-via-xcm/xcm-stake-1.png)

Then, head to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}. In order to see the correct menus here, you’ll need to have at least one account accessible in Polkadot.js Apps. If you don’t, create one now. Then, head to the **Developer** tab and Press **Extrinsics**. 

![Moonbase Alpha Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-2.png)

In the following steps you will be preparing a transaction, but you’ll need to refrain from submitting the transaction here in order to complete this tutorial in its entirety. We’ll take the resulting encoded call data from preparing this staking operation, and send it via XCM from the relay chain in a later step. From the **Extrinsics** page, take the following steps:

1. Select the `parachainStaking` Pallet
2. Select the `delegate` function
3. Paste in your selected collator’s address
4. Paste your desired stake amount in Wei. In this example we’re specifying 1 DEV or `1000000000000000000` Wei. You can find a unit converter here on [Moonscan](https://moonscan.io/unitconverter){target=_blank}.
5. Enter the collator’s number of existing delegations (this can be found next to the collator’s name / address on the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}). 
6. Enter your number of existing delegations from your derivative account. This is most likely 0 but because this estimation is only used to determine the weight of the call, we can specify an upper bound of `37` - the current number of collators in Moonbase Alpha.
7. Finally, we’re going to copy the encoded call data. Copy this to a text file or another easily accessible place because we will need it later. Do not copy the encoded call hash, and do not submit the transaction! 


!!! note
    Astute readers may notice the selected account below is named “Academy.” I mentioned that it does not matter which account you have selected in Moonbase Alpha Polkadot.js Apps. This is because we’re not submitting the transaction, only copying the encoded call data, which does not contain a reference to the sending account. 

![Moonbase Alpha Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-3.png)

## Sending the XCM Instructions from the Moonbase Relay chain

In another tab, head to [Moonbase Relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}. Click on the **Developer** tab and press **Extrinsics**. 

![Moonbase Relay Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-4.png)

### Building the Destination Multilocation 
Let’s get started crafting our XCM message that will transport our remote execution instructions to the Moonbase Alpha Parachain to ultimately stake our desired amount of DEV tokens to a chosen collator. To get started, take the following steps: 

1. Unlike the prior steps where the selected account wasn’t relevant, the account selected here must be the account associated with your derivative account 
2. Select the `xcmPallet`
3. Select the `send` function
4. Select version `v1`
5. Select a parents value of `0`. Recall we’re creating the multilocation to identify the destination of our XCM message. In this case, we’re sending the message from the relay chain to the Moonbase alpha parachain. As we’re already at the relay chain level, we don’t need to “hop up” any levels so we’ll enter a parents value of `0`.
6. We need one piece of information, namely, a parachain id to describe our destination of Moonbase Alpha, so enter `X1` here
7. Select `parachain ID`. 
8. Enter `1000`, the parachain ID of Moonbase Alpha. 

![Moonbase Relay Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-5.png)

In the next section, we’ll start assembling the XCM instructions. 

### Preparing the Structure of the XCM Message

1. Select `V2` for XcmVersionedXcm
2. Our XCM Message is going to have 3 distinct XCM instructions, so press the first **Add Item** button 3 times. 
3. Below the first XCM Instruction of `Withdraw Asset`, we need to add the asset we’re going to withdraw here, so press the **Add Item** button below `Withdraw Asset` once. 

![Preparing the structure of the XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-7.png)

### Assembling the Contents of the XCM Message

Now we’re ready for the fun part! To construct the XCM message that will remotely stake funds on the Moonbase Alpha parachain, take the following steps:

1. Double check that `V2` is selected as the XCM version
2. Ensure `WithdrawAsset` is selected as the first XCM instruction
3. Select `Concrete` as the XcmV1MultiAsset
4. Specify a parents value of `0`
5. Specify `X1` because we need one piece of information to identify the asset 
6. Select `PalletInstance`
7. Specify PalletInstance `3` - this is the `balances` pallet. In other words, we are identifying the native asset of the Moonbase parachain, which is the DEV token 
8. Specify fungibility as `fungible`. DEV, like GLMR and MOVR, is a fungible asset 
9. Specify `100000000000000000` Wei as the fungible amount. This is equivalent to `0.1` DEV and it is a safe overestimate of the fees that will actually need to be paid. In a production environment, we would consider including XCM instructions to refund unused fees, but for the sake of simplicity, that is not included in this tutorial
10. Now, we’ll begin with our second XCM instruction. Select `buyExecution` from the dropdown. We are buying execution with the same asset (DEV) that we withdrew in the prior steps, so the following steps will be familiar 
11. Select `Concrete` as the XcmV1MultiAsset
12. Specify a parents value of `0`
13. Specify `X1` because we need one piece of information to identify the asset
14. Select `PalletInstance`
15. Specify PalletInstance `3` - this is the balances pallet. In other words, we are identifying the native asset of the Moonbase parachain, which is the DEV token
16. Specify fungibility as `fungible`. DEV, like GLMR and MOVR, is a fungible asset  
17. Specify `100000000000000000` Wei as the fungible amount. This is equivalent to `0.1` DEV and it is a safe overestimate of the fees that will actually need to be paid. In a production environment, we would consider including XCM instructions to refund unused fees, but for the sake of simplicity, that is not included in this tutorial
18. Select `Unlimited` for the weightLimit
19. For our 3rd and most crucial XCM instruction, choose the `Transact` instruction.
20. Specify an origin of the `SovereignAccount`
21. For requireWeightAtMost, specify `40000000000`. This is likely more than strictly necessary, but it is fine to overestimate
22. Finally, paste the encoded call data of the staking operation that you prepared on Moonbase Alpha in Step 7 of the first section of this tutorial
23. Press **Submit** and enter your password in the resulting popup to confirm the transaction

![Assembling the complete XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-6.png)

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few moments before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachainStaking pallet (on the substrate side) rather than through the staking precompile (on the EVM). 
 