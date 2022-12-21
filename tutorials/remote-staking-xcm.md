---
title: Remote Staking via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
---

# Remote Staking via XCM

![Banner Image](/images/tutorials/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)
*December 14, 2022 | by Kevin Neilson*

## Introduction {: #introduction } 

In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase relay chain (equivalent to the Polkadot relay chain). This tutorial assumes a basic familiarity with [XCM](/builders/xcm/overview/){target=_blank} and [Remote Execution via XCM](/builders/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background. 

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a [remote EVM call](/builders/xcm/remote-evm-calls/){target=_blank} that calls the [staking precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachain staking pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachain staking pallet directly. 

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Checking Prerequisites {: #checking-prerequisites }

For development purposes this tutorial is written for Moonbase Alpha and Moonbase relay using TestNet funds. For prerequisites:

- A Moonbase Alpha relay chain account funded with some UNIT, the native token of the Moonbase relay chain. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank} 
- You'll need to [calculate the multilocation derivative account](#calculating-your-multilocation-derivative-account) of your Moonbase Alpha relay chain account and fund it with DEV tokens.
--8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation Derivative Account {: #calculating-your-multilocation-derivative-account }

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation derivative account. 

To generate the multilocation derivative account, first clone Alberto’s [xcmTools repo](https://github.com/albertov19/xcmTools){target=_blank}. Run `yarn` to install the necessary packages and then run:


    ts-node calculateMultilocationDerivative.ts \
     --w wss://wss.api.moonbase.moonbeam.network \
     --a YOUR-MOONBASE-RELAY-ACCOUNT-HERE \
     --n 0x57657374656e64

Let's review the parameters passed along with this command:

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
- The `-a` flag corresponds to your Moonbase relay chain address
- The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on

The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one. Feel free to look up your multilocation derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 1.1 DEV. As this is the amount that the faucet dispenses, you'll need to make a minimum of two faucet requests or you can always reach out to us on [Discord](https://discord.com/invite/amTRXQ9ZpW){target=_blank} for additional DEV tokens.

## Preparing to Stake on Moonbase Alpha {: #preparing-to-stake-on-moonbase-alpha }

First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank} shown below has `60` delegations at the time of writing. 

![Moonbeam Network Apps Dashboard](/images/tutorials/remote-staking-via-xcm/xcm-stake-1.png)

## Generating the Encoded Call Data via Polkadot.js Apps {: #generating-the-encoded-call-data-via-polkadot.js-apps }

If you prefer to fetch this information programmatically via the Polkadot API, you can skip to the [following section](#generating-the-encoded-call-data-via-the-polkadot-api) 

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

## Generating the Encoded Call Data via the Polkadot API {: #generating-the-encoded-call-data-via-the-polkadot-api }

You can also generate the encoded call data via the Polkadot API as shown below. Just like the steps above, we are not submitting a transaction but simplying preparing one to get the encoded call data. Remember to update the `candidateDelegationCount` value. Feel free to run the below code snippet locally or in the [Javascript console of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/js){target=_blank}.

```javascript
import { ApiPromise, WsProvider } from '@polkadot/api';
const provider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');

const candidate = '0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D'; //PS-31 Collator
const amount = '1000000000000000000';
const candidateDelegationCount = 60; //Update this value!
const delegatorDelegationCount = 37;
const main = async () => {
  const api = await ApiPromise.create({ provider: provider });
  // Create a transfer extrinsic
  let tx = api.tx.parachainStaking.delegate(candidate, amount, candidateDelegationCount, delegatorDelegationCount);
  // Get SCALE Encoded Call Data
  let encodedCall = tx.toHex();
  console.log(`Encoded Call Data: ${encodedCall}`);
};
main();
```

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
 