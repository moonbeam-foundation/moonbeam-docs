---
title: Remote Staking on Moonbeam from Polkadot via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
template: main.html
---

# Remote Staking via XCM

![Banner Image](/images/tutorials/interoperability/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)
_December 14, 2022 | by Kevin Neilson_


## Introduction {: #introduction } 

In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase relay chain (equivalent to the Polkadot relay chain). This tutorial assumes a basic familiarity with [XCM](/builders/interoperability/xcm/overview/){target=_blank} and [Remote Execution via XCM](/builders/interoperability/xcm/xcm-transactor/){target=_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background. 

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a [remote EVM call](/builders/interoperability/xcm/remote-evm-calls/){target=_blank} that calls the [staking precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, or we could use XCM to call the [parachain staking pallet](/builders/pallets-precompiles/pallets/staking/){target=_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachain staking pallet directly. 

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Checking Prerequisites {: #checking-prerequisites }

For development purposes this tutorial is written for Moonbase Alpha and Moonbase relay using TestNet funds. For prerequisites:

- A Moonbase Alpha relay chain account funded with some UNIT, the native token of the Moonbase relay chain. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=_blank} 
- You'll need to [calculate the multilocation derivative account](#calculating-your-multilocation-derivative-account) of your Moonbase Alpha relay chain account and fund it with DEV tokens.
--8<-- 'text/faucet/faucet-list-item.md'

## Calculating your Multilocation Derivative Account {: #calculating-your-multilocation-derivative-account }

Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation derivative account - and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation derivative account. 

To generate the multilocation derivative account, first clone the [xcm-tools repo](https://github.com/PureStake/xcm-tools){target=_blank}. Run `yarn` to install the necessary packages and then run:

```sh
yarn calculate-multilocation-derivative-account \
--w wss://wss.api.moonbase.moonbeam.network \
--a YOUR_MOONBASE_RELAY_ACCOUNT_HERE \
--p PARACHAIN_ID_IF_APPLIES \
--n 0x57657374656e64
```

Let's review the parameters passed along with this command:

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
- The `-a` flag corresponds to your Moonbase relay chain address
- The `-p` flag corresponds to the parachain ID of the origin chain (if applies), if you are sending the XCM from the relay chain, you don't need to provide this parameter
- The `-n` flag corresponds to the encoded form of “westend”, the name of the relay chain that Moonbase relay is based on

The script will return 32-byte and 20-byte addresses. We’re interested in the ethereum-style account - the 20-byte one. Feel free to look up your multilocation derivative account on [Moonscan](https://moonbase.moonscan.io/){target=_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 1.1 DEV. As this is the amount that the faucet dispenses, you'll need to make a minimum of two faucet requests or you can always reach out to us on [Discord](https://discord.com/invite/amTRXQ9ZpW){target=_blank} for additional DEV tokens.

## Preparing to Stake on Moonbase Alpha {: #preparing-to-stake-on-moonbase-alpha }

First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Next to your desired collator, press the **Copy** icon. You’ll also need to make a note of the number of delegations your collator has. The [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D){target=_blank} shown below has `60` delegations at the time of writing. 

![Moonbeam Network Apps Dashboard](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-1.png)

## Remote Staking via XCM with the Polkadot API {: #remote-staking-via-xcm-with-the-polkadot-api }

Here, we'll be relying on the Polkadot.js API for building the XCM call.

Start by generating the encoded call data via the Polkadot API as shown below. Here, we are not submitting a transaction but simplying preparing one to get the encoded call data. Remember to update `delegatorAccount` with your account. Feel free to run the below code snippet locally.

```typescript
import { ApiPromise, WsProvider } from "@polkadot/api";
const provider = new WsProvider("wss://wss.api.moonbase.moonbeam.network");

const candidate = "0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D";
const delegatorAccount = "YOUR-ACCOUNT-HERE";
const amount = "1000000000000000000";
const autoCompound = 100;

const main = async () => {
  const api = await ApiPromise.create({ provider: provider });

  // Fetch the your existing number of delegations and the collators existing delegations
  let delegatorInfo = await api.query.parachainStaking.delegatorState(
    delegatorAccount
  );

  let delegatorDelegationCount;
  if (delegatorInfo.toHuman()) {
    delegatorDelegationCount = delegatorInfo.toHuman()["delegations"].length;
  } else {
    delegatorDelegationCount = 0;
  }

  const collatorInfo = await api.query.parachainStaking.candidateInfo(
    candidate
  );
  const candidateDelegationCount = collatorInfo.toHuman()["delegationCount"];

  const autoCompoundingDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidate);
  const candidateAutoCompoundDelegationCount = autoCompoundingDelegations.toHuman().length;

  let tx = api.tx.parachainStaking.delegateWithAutoCompound(
    candidate,
    amount,
    autoCompound,
    candidateDelegationCount,
    candidateAutoCompoundDelegationCount,
    delegatorDelegationCount
  );

  // Get SCALE Encoded Call Data
  let encodedCall = tx.method.toHex();
  console.log(`Encoded Call Data: ${encodedCall}`);
};
main();
```

!!! note
    If running this as a TypeScript project, be sure to set the `strict` flag under `compilerOptions` to `false` in your `tsconfig.json`.

If you'd prefer not to set up a local environment you can run the below snippet in the [JavaScript console of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=_blank}.

```javascript
const candidate = '0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D';
const delegatorAccount = 'YOUR-ACCOUNT-HERE';
const amount = '1000000000000000000';
const autoCompound = 100;

// Fetch the your existing number of delegations and the collators existing delegations
let delegatorInfo = await api.query.parachainStaking.delegatorState(delegatorAccount);
let delegatorDelegationCount;
if (delegatorInfo.toHuman()) {
  delegatorDelegationCount = delegatorInfo.toHuman()['delegations'].length;
} else {
  delegatorDelegationCount = 0;
}
const collatorInfo = await api.query.parachainStaking.candidateInfo(candidate);
const candidateDelegationCount = collatorInfo.toHuman()['delegationCount'];
const autoCompoundingDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidate);
const candidateAutoCompoundDelegationCount = autoCompoundingDelegations.toHuman().length;
let tx = api.tx.parachainStaking.delegateWithAutoCompound(
  candidate,
  amount,
  autoCompound,
  candidateDelegationCount,
  candidateAutoCompoundDelegationCount,
  delegatorDelegationCount
);
// Get SCALE Encoded Call Data
let encodedCall = tx.method.toHex();
console.log(`Encoded Call Data: ${encodedCall}`);
```

### Sending the XCM Instructions via the Polkadot API {: #sending-the-xcm-instructions-via-the-polkadot-api }

In this section we'll be constructing and sending the XCM instructions via the Polkadot API. We'll be crafting an XCM message that will transport our remote execution instructions to the Moonbase Alpha parachain to ultimately stake our desired amount of DEV tokens to a chosen collator. After adding the seed phrase of your development account on Moonbase relay, you can construct and send the transaction via the Polkadot API as follows:

```javascript
// Import
import { ApiPromise, WsProvider } from "@polkadot/api";

// Construct API provider
const wsProvider = new WsProvider(
  "wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network"
);
const api = await ApiPromise.create({ provider: wsProvider });

// Import the keyring as required
import { Keyring } from "@polkadot/api";

// Initialize wallet key pairs
const keyring = new Keyring({ type: "sr25519" });
// For demo purposes only. Never store your private key or mnemonic in a JavaScript file
const otherPair = await keyring.addFromUri("YOUR-DEV-SEED-PHRASE-HERE");
console.log(`Derived Address from Private Key: ${otherPair.address}`);

// Create the destination multilocation (define where the message will be sent)
const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };

// Create the full XCM message which defines the action to take on the destination chain
const message = {
  V3: [
    {
      WithdrawAsset: [
        {
          id: {
            concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
      ],
    },
    {
      BuyExecution: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
        { unlimited: null },
      ],
    },
    {
      Transact: {
        originType: "SovereignAccount",
        requireWeightAtMost: 40000000000n,
        call: {
          encoded:
            "0x0c123a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d0000000000000000643f0000000400000001000000",
        },
      },
    },
  ],
};

// Define the transaction using the send method of the xcm pallet
let tx = api.tx.xcmPallet.send(dest, message);

// Retrieve the encoded calldata of the transaction
const encodedCallData = tx.toHex();
console.log("Encoded call data is" + encodedCallData);

// Sign and send the transaction
const txHash = await tx.signAndSend(otherPair);

// Show the transaction hash
console.log(`Submitted with hash ${txHash}`);
```

!!! note
    Remember that your multilocation derivative account must be funded with at least 1.1 DEV or more to ensure you have enough to cover the stake amount and transaction fees.

In the above snippet, besides submitting the remote staking via XCM transaction, we also print out the encoded call data and the transaction hash to assist with any debugging. 

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=_blank} to check your staking balance. Be advised that it may take a few minutes before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the parachain staking pallet (on the Substrate side) rather than through the staking precompile (on the EVM).

--8<-- 'text/disclaimers/educational-tutorial.md'
 