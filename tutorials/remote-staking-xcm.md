---
title: Remote Staking via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
---

# Remote Staking via XCM

![Banner Image](/images/tutorials/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)

## Introduction {: #introduction } 
In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase Relay Chain (equivalent to the Polkadot Relay Chain). This tutorial assumes a basic familiarity with [XCM](/builders/xcm/overview/){target=_blank} and [Remote Execution via XCM](builders/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics just yet but you may find it helpful with some XCM knowledge as background. 

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a remote EVM call that calls the [staking precompile](builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachainStaking pallet](builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachainStaking pallet directly. 

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

The -w flag corresponds to the endpoint we’re using to fetch this information. The -n flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase Relay is based on. The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-Style account - the 20-byte one. Feel free to look up your derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 2 DEV. 

## Preparing to Stake on Moonbase Alpha
First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The PS-31 collator shown below has 60 delegations at the time of writing. 

![Moonbeam Network Apps Dashboard](/images/tutorials/remote-staking-via-xcm/xcm-stake-1.png)

Then, head to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}. In order to see the correct menus here, you’ll need to have at least one account accessible in Polkadot.js Apps. If you don’t, create one now. Then, head to the **Developer** tab and Press **Extrinsics**. 
