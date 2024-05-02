---
title: Remote Staking on Moonbeam from Polkadot via XCM
description: In this guide, we'll be leveraging remote execution to remotely stake GLMR on Moonbeam using a series of XCM instructions.
template: main.html
---

# Remote Staking via XCM

_by Kevin Neilson_

## Introduction {: #introduction }

In this tutorial, we’ll stake DEV tokens remotely by sending XCM instructions from an account on the Moonbase relay chain (equivalent to the Polkadot relay chain). This tutorial assumes a basic familiarity with [XCM](/builders/interoperability/xcm/overview/){target=\_blank} and [Remote Execution via XCM](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank}. You don’t have to be an expert on these topics but you may find it helpful to have some XCM knowledge as background.

There are actually two possible approaches for staking on Moonbeam remotely via XCM. We could send a [remote EVM call](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=\_blank} that calls the [staking precompile](/builders/pallets-precompiles/precompiles/staking/){target=\_blank}, or we could use XCM to call the [parachain staking pallet](/builders/pallets-precompiles/pallets/staking/){target=\_blank} directly without interacting with the EVM. For this tutorial, we’ll be taking the latter approach and interacting with the parachain staking pallet directly.

**Note that there are still limitations in what you can remotely execute through XCM messages.** In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Checking Prerequisites {: #checking-prerequisites }

For development purposes this tutorial is written for Moonbase Alpha and Moonbase relay using TestNet funds. For prerequisites:

- A Moonbase Alpha relay chain account funded with some UNIT, the native token of the Moonbase relay chain. If you have a Moonbase Alpha account funded with DEV tokens, you can swap some DEV for xcUNIT here on [Moonbeam Swap](https://moonbeam-swap.netlify.app/#/swap/){target=\_blank}. Then withdraw the xcUNIT from Moonbase Alpha to [your account on the Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network#/accounts/){target=\_blank} using [apps.moonbeam.network](https://apps.moonbeam.network/moonbase-alpha/){target=\_blank}
- You'll need to [calculate the Computed Origin account](#calculating-your-computed-origin-account) of your Moonbase Alpha relay chain account and fund it with DEV tokens.
--8<-- 'text/_common/faucet/faucet-list-item.md'

## Calculating your Computed Origin Account {: #calculating-your-computed-origin-account }

--8<-- 'text/builders/interoperability/xcm/calculate-multilocation-derivative-account.md'

Here, we have specified a parents value of `1` because the relay chain is the origin of the request (and the relay chain is considered a parent to the Moonbase alpha parachain). The relay chain does not have a parachain id so that field is omitted.

![Calculate Multi-Location Derivative Account](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-1.webp)

The script will return 32-byte and 20-byte addresses. We’re interested in the Ethereum-style account - the 20-byte one. Feel free to look up your Computed Origin account on [Moonscan](https://moonbase.moonscan.io/){target=\_blank}. You’ll note that this account is empty. You’ll now need to fund this account with at least 1.1 DEV which you can get from [the faucet](https://faucet.moonbeam.network/){target=\_blank}. And if you need more, you can always reach out to us on [Discord](https://discord.com/invite/amTRXQ9ZpW/){target=\_blank} for additional DEV tokens.

## Preparing to Stake on Moonbase Alpha {: #preparing-to-stake-on-moonbase-alpha }

First and foremost, you’ll need the address of the collator you want to delegate to. To locate it, head to the [Moonbase Alpha Staking dApp](https://apps.moonbeam.network/moonbase-alpha/staking/){target=\_blank} in a second window. Ensure you’re on the correct network, then press **Select a Collator**. Press the icon next to your desired collator to copy its address. You’ll also need to make a note of the number of delegations your collator has. The [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D/){target=\_blank} shown below has `64` delegations at the time of writing.

![Moonbeam Network Apps Dashboard](/images/tutorials/interoperability/remote-staking-via-xcm/xcm-stake-2.webp)

## Remote Staking via XCM with the Polkadot.js API {: #remote-staking-via-xcm-with-the-polkadot-api }

This tutorial will cover the two-step process to perform remote staking operations. The first step we'll take is to generate the encoded call data for delegating a collator. Secondly, we'll send the encoded call data via XCM from the relay chain to Moonbase Alpha, which will result in the execution of the delegation.

### Generate the Encoded Call Data {: #generate-encoded-call-data }

We'll be using the `delegateWithAutoCompound` function of the [Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking/){target=\_blank}, which accepts six parameters: `candidate`, `amount`, `autoCompound`, `candidateDelegationCount`, `candidateAutoCompoundingDelegationCount`, and `delegationCount`.

In order to generate the encoded call data, we'll need to assemble the arguments for each of the `delegateWithAutoCompound` parameters and use them to build a transaction which will call the `delegateWithAutoCompound` function. We are not submitting a transaction, but simply preparing one to get the encoded call data. We'll take the following steps to build our script:

1. Create a [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider
2. Assemble the arguments for each of the parameters of the `delegateWithAutoCompound` function:

    - `candidate`- for this example we'll use the [PS-31 collator](https://moonbase.subscan.io/account/0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D/){target=\_blank}: `0x3A7D3048F3CB0391bb44B518e5729f07bCc7A45D`. To retrieve the entire list of candidates, you can refer back to the [Preparing to Stake](#preparing-to-stake-on-moonbase-alpha) section
    - `amount` - we'll stake the minimum amount, which is 1 DEV or `1000000000000000000` Wei. You can find a [unit converter on Moonscan](https://moonscan.io/unitconverter/){target=\_blank}
    - `autoCompound` - we'll set this to `100` to auto-compound all rewards
    - `candidateDelegationCount` - we'll retrieve using the `candidateInfo` function of the Parachain Staking Pallet to get the exact count. Alternatively, you can enter the upper bound of `300` because this estimation is only used to determine the weight of the call
    - `candidateAutoCompoundingDelegationCount` - we'll retrieve using the `autoCompoundingDelegations` function of the Parachain Staking Pallet to get the exact count. Alternatively, you can enter the upper bound of `300` because this estimation is only used to determine the weight of the call
    - `delegationCount` - we'll retrieve using the `delegatorState` function of the Parachain Staking Pallet to get the exact count. Alternatively, you can specify an upper bound here of `100`

3. Craft the `parachainStaking.delegateWithAutoCompound` extrinsic with each of the required arguments
4. Use the transaction to get the encoded call data for the delegation

```js
--8<-- 'code/tutorials/interoperability/remote-staking/generate-encoded-call-data.js'
```

!!! note
    If running this as a TypeScript project, be sure to set the `strict` flag under `compilerOptions` to `false` in your `tsconfig.json`.

If you'd prefer not to set up a local environment, you can run a code snippet in the [JavaScript console of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js/){target=\_blank}.

??? code "Code to run in the Polkadot.js Apps JavaScript console"

    ```javascript
    --8<-- 'code/tutorials/interoperability/remote-staking/polkadotjs-apps-encoded-call-data.js'
    ```

### Assemble and Send XCM Instructions via the Polkadot.js API {: #sending-the-xcm-instructions-via-the-polkadot-api }

In this section, we'll be using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} to construct and send XCM instructions via the `send` extrinsic of the XCM Pallet on the Alphanet relay chain. The XCM message will transport our remote execution instructions to the Moonbase Alpha parachain to ultimately stake our desired amount of DEV tokens to a chosen collator.

The `send` function of the XCM Pallet accepts two parameters: `dest` and `message`. You can start assembling these parameters by taking the following steps:

1. Build the multilocation of the DEV token on Moonbase Alpha for the `dest`:

    ```js
    const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
    ```

2. Build the `WithdrawAsset` instruction, which will require you to define:
    - The multilocation of the DEV token on Moonbase Alpha
    - The amount of DEV tokens to withdraw

    ```js
    const instr1 = {
      WithdrawAsset: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
      ],
    },    
    ```

3. Build the `BuyExecution` instruction, which will require you to define:
    - The multilocation of the DEV token on Moonbase Alpha
    - The amount of DEV tokens to buy for execution
    - The weight limit

    ```js
    const instr2 = {
      BuyExecution: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
        { Unlimited: null },
      ],
    },    
    ```

4. Build the `Transact` instruction, which will require you to define:
    - The origin type, which will be `SovereignAccount`
    - The required weight for the transaction. You'll need to define a value for `refTime`, which is the amount of computational time that can be used for execution, and the `proofSize`, which is the amount of storage in bytes that can be used. It is recommended that the weight given to this instruction needs to be around 10% more of `25000` times the gas limit for the call you want to execute via XCM
    - The encoded call data for delegating a collator, which we generated in the [previous section](#generate-encoded-call-data)

    ```js
    const instr3 = {
      Transact: {
        originType: 'SovereignAccount',
        requireWeightAtMost: { refTime: 40000000000n, proofSize: 900000n },
        call: {
          encoded:
            '0x0c123a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d000000000000000064430000000600000000000000',
        },
      },
    },    
    ```

5. Combine the XCM instructions into a versioned XCM message:

    ```js
    const message = { V3: [instr1, instr2, instr3] };
    ```

Now that you have the values for each of the parameters, you can write the script to send the XCM message. You'll take the following steps:

 1. Provide the values for each of the parameters of the `send` function
 2. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider using the WSS endpoint of the Alphanet relay chain
 3. Create a Keyring instance using the mnemonic of your relay chain account, which will be used to send the transaction
 4. Craft the `xcmPallet.send` extrinsic with the `dest` and `message`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the third step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```javascript
--8<-- 'code/tutorials/interoperability/remote-staking/remote-staking.js'
```

!!! note
    Remember that your Computed Origin account must be funded with at least 1.1 DEV or more to ensure you have enough to cover the stake amount and transaction fees.

In the above snippet, besides submitting the remote staking via XCM transaction, we also print out the transaction hash to assist with any debugging.

And that’s it! To verify that your delegation was successful, you can visit [Subscan](https://moonbase.subscan.io/){target=\_blank} to check your staking balance. Be advised that it may take a few minutes before your staking balance is visible on Subscan. Additionally, be aware that you will not be able to see this staking operation on Moonscan, because we initiated the delegation action directly via the [Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking/){target=\_blank} (on the Substrate side) rather than through the [Staking Precompile](/builders/pallets-precompiles/precompiles/staking/){target=\_blank} (on the EVM).

--8<-- 'text/_disclaimers/educational-tutorial.md'
