---
title: Remote Staking via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
---

# Remote Staking via XCM

![Banner Image](/images/tutorials/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)

## Introduction {: #introduction } 

In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase relay chain (equivalent to the Polkadot relay chain). This tutorial assumes a basic familiarity with [XCM](/builders/xcm/overview/){target=_blank} and [Remote Execution via XCM](/builders/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background. 

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a [remote EVM call](/builders/xcm/remote-evm-calls/){target=_blank} that calls the [staking precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachainStaking pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachainStaking pallet directly. 

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Checking Prerequisites {: #checking-prerequisites }

For development purposes this tutorial is written for Moonbase Alpha and Moonbase relay using TestNet funds. For prerequisites:

* You should have DEV tokens which you can acquire from the [Moonbase Alpha faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank} 
* You should also have some UNIT, the native token of the Moonbase relay chain. You can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} 
* Lastly, you'll need to withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank}. 

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation derivative account. 

To generate the multilocation derivative account, first clone Alberto’s [xcmTools repo](https://github.com/albertov19/xcmTools){target=_blank}. Run `yarn` to install the necessary packages and then run:


    ts-node calculateMultilocationDerivative.ts \
     --w wss://wss.api.moonbase.moonbeam.network \
     --a YOUR-MOONBASE-RELAY-ACCOUNT-HERE \
     --n 0x57657374656e64

Let's review the parameters passed along with this command:

* The `-w` flag corresponds to the endpoint we’re using to fetch this information
* The `-a` flag corresponds to your Moonbase relay chain address
* The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on

The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one. Feel free to look up your multilocation derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 1.1 DEV. As this is the amount that the faucet dispenses, you'll need to make a minimum of two faucet requests or you can always reach out to us on [Discord](https://discord.com/invite/amTRXQ9ZpW){target=_blank} for additional DEV tokens.

## Preparing to Stake on Moonbase Alpha {: #preparing-to-stake-on-moonbase-alpha }

The following section will walk through fetching collator information via the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} and the Polkadot.js Apps UI. If you'd prefer to fetch this information programmatically via the Polkadot.js API, you can visit the [following section.](#retrieving-the-list-of-candidates)

First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank} shown below has `60` delegations at the time of writing. 

![Moonbeam Network Apps Dashboard](/images/tutorials/remote-staking-via-xcm/xcm-stake-1.png)

You can also programmatically fetch all of the required staking information. Feel free to skip to the [next section](#generating-the-encoded-call-data) if you'd like.

### Retrieve the List of Candidates {: #retrieve-the-list-of-candidates } 

Prior to staking tokens, you’ll need the address of the collator you want to delegate to. To retrieve the list of collator candidates available in the network, head to the **Developer** tab, click on **Chain State**, and take the following steps:

 1. Choose the pallet to interact with. In this case, it is the **parachainStaking** pallet
 2. Choose the state to query. In this case, it is the **selectedCandidates** or **candidatePool** state
 3. Send the state query by clicking on the **+** button

Each extrinsic provides a different response:

 - **selectedCandidates** — returns the current active set of collators, that is, the top collator candidates by total tokens staked (including delegations). For example, on Moonbase Alpha it is the top {{ networks.moonbase.staking.max_candidates }} candidates
 - **candidatePool** — returns the current list of all the candidates, including those that are not in the active set

![Staking Account](/images/tutorials/remote-staking-via-xcm/xcm-stake-4.png)

### Get the Candidate Delegation Count {: #get-the-candidate-delegation-count } 

First, you need to get the `candidateInfo`, which will contain the delegator count, as you'll need to submit this parameter in a later transaction. To retrieve the parameter, make sure you're still on the **Chain State** tab of the **Developer** page, and then take the following steps:

 1. Choose the **parachainStaking** pallet to interact with
 2. Choose the **candidateInfo** state to query
 3. Make sure the **include option** slider is enabled
 4. Enter the collator candidate's address
 5. Send the state query by clicking on the **+** button
 6. Copy the result as you'll need it when initiating a delegation

![Get candidate delegation count](/images/tutorials/remote-staking-via-xcm/xcm-stake-5.png)

Optionally, you can receive this information via the Polkadot.js API by running the following JavaScript code snippet in [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}:

```js
// Simple script to get the collator's number of existing delegations.
// Remember to replace YOUR-ADDRESS-HERE with your collator address.
const collatorAddress = 'COLLATOR-ADDRESS-HERE'; 
const collatorInfo = await api.query.parachainStaking.candidateInfo(collatorAddress);
console.log(collatorInfo.toHuman()["delegationCount"]);
```

![Get candidate delegation count](/images/tutorials/remote-staking-via-xcm/xcm-stake-6.png)

### Get your Number of Existing Delegations {: #get-your-number-of-existing-delegations }

If you've never made a delegation from your address you can skip this section. However, if you're unsure how many existing delegations you have, you'll want to run the following JavaScript code snippet to get `delegationCount` from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}:

```js
// Simple script to get your number of existing delegations.
// Remember to replace YOUR-ADDRESS-HERE with your delegator address.
const yourDelegatorAccount = 'YOUR-ADDRESS-HERE'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(yourDelegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(delegatorInfo.toHuman()["delegations"].length);
} else {
  console.log(0)
}
```

Head to the **Developer** tab and click on **JavaScript**. Then take the following steps:

 1. Copy the code from the previous snippet and paste it inside the code editor box 
 2. (Optional) Click the save icon and set a name for the code snippet, for example, **Get delegation count**. This will save the code snippet locally
 3. To execute the code, click on the run button
 4. Copy the result as you'll need it when initiating a delegation

![Get existing delegation count](/images/tutorials/remote-staking-via-xcm/xcm-stake-7.png)

## Generating the Encoded Call Data {: #generating-the-encoded-call-data }

Then, head to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts){target=_blank}. In order to see the **Extrinsics** menu here, you’ll need to have at least one account accessible in Polkadot.js Apps. If you don’t, create one now. Then, head to the **Developer** tab and Press **Extrinsics**. 

![Moonbase Alpha Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-2.png)

In the following steps you will be preparing a transaction, but you’ll need to refrain from submitting the transaction here in order to complete this tutorial in its entirety. We’ll take the resulting encoded call data from preparing this staking operation, and send it via XCM from the relay chain in a later step. From the **Extrinsics** page, take the following steps:

1. Select the **parachainStaking** Pallet
2. Select the **delegate** function
3. Paste in your selected collator’s address
4. Paste your desired stake amount in Wei. In the below example 1 DEV or `1000000000000000000` Wei is specified. You can find a unit converter here on [Moonscan](https://moonscan.io/unitconverter){target=_blank}
5. Enter the collator’s number of existing delegations (this can be found next to the collator’s name / address on the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank}) 
6. Enter your number of existing delegations from your multilocation derivative account. This is most likely `0` but because this estimation is only used to determine the weight of the call, you can specify an upper bound of `37` - the current number of collators in Moonbase Alpha.
7. Finally, copy the encoded call data to a text file or another easily accessible place because you will need it later. Do not copy the encoded call hash, and do not submit the transaction

!!! note
    Astute readers may notice the selected account below is named “Academy.” It does not matter which account you have selected in Moonbase Alpha Polkadot.js Apps. This is because you're not submitting the prepared transaction, only copying the encoded call data, which does not contain a reference to the sending account. 

![Moonbase Alpha Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-3.png)

## Sending the XCM Instructions from the Moonbase relay chain {: #sending-the-xcm-instructions-from-the-moonbase-relay-chain }

In another tab, head to [Moonbase relay Polkadot.Js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank}. Click on the **Developer** tab and press **Extrinsics**. 

![Moonbase Relay Polkadot JS Apps Home](/images/tutorials/remote-staking-via-xcm/xcm-stake-8.png)

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

![Moonbase Relay Polkadot JS Apps Extrinsics Page](/images/tutorials/remote-staking-via-xcm/xcm-stake-9.png)

In the next section, we’ll start assembling the XCM instructions. 

### Preparing the Structure of the XCM Message {: #preparing-the-structure-of-the-xcm-message }

1. Select **V2** for **XcmVersionedXcm**
2. Our XCM Message is going to have 3 distinct XCM instructions, so press the first **Add Item** button 3 times. 
3. Below the first XCM Instruction of **WithdrawAsset**, we need to add the asset we’re going to withdraw here, so press the **Add Item** button below **WithdrawAsset** once. 

![Preparing the structure of the XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-10.png)

### Assembling the Contents of the XCM Message {: #assembling-the-contents-of-the-xcm-message }

Now we’re ready for the fun part! Construct the XCM message that will remotely stake funds on the Moonbase Alpha parachain as follows:

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

![Assembling the complete XCM message](/images/tutorials/remote-staking-via-xcm/xcm-stake-11.png)

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few moments before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachain Staking pallet (on the substrate side) rather than through the staking precompile (on the EVM). 
 