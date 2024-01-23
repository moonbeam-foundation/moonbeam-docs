---
title:  Call Permit Precompile Contract
description: Learn how to use the Call Permit Precompile contract on Moonbeam to sign a permit for any EVM call that can be dispatched by anyone or any smart contract.
keywords: solidity, ethereum, call permit, permit, gasless transaction, moonbeam, precompiled, contracts
---

# Interacting with the Call Permit Precompile

## Introduction {: #introduction }

The Call Permit Precompile on Moonbeam allows a user to sign a permit, an [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=\_blank} signed message, for any EVM call and it can be dispatched by anyone or any smart contract. It is similar to the [ERC-20 Permit Solidity Interface](/builders/interoperability/xcm/xc20/interact/#the-erc20-permit-interface){target=\_blank}, except it applies to any EVM call instead of approvals only.

When the call permit is dispatched, it is done so on behalf of the user who signed the permit and the user or contract that dispatches the permit is responsible for paying transaction fees. As such, the precompile can be used to perform gas-less transactions.

For example, Alice signs a call permit and Bob dispatches it and performs the call on behalf of Alice. Bob pays for the transaction fees and as such, Alice doesn't need to have any of the native currency to pay for the transaction, unless the call includes a transfer.

The Call Permit Precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.call_permit }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.call_permit }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.call_permit }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The Call Permit Solidity Interface {: #the-call-permit-interface }

[`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's three methods.

The interface includes the following functions:

- **dispatch**(*address* from, *address* to, *uint256* value, *bytes* data, *uint64[]* gaslimit, *uint256* deadline, *uint8* v, *bytes32* r, *bytes32* s) — dispatches a call on the behalf of another user with a EIP-712 permit. This function can be called by anyone or any smart contract. The transaction will revert if the permit is not valid or if the dispatched call reverts or errors (such as out of gas). If successful, the nonce of the signer is increased to prevent this permit to be replayed. An overview of the parameters is as follows:
     - `from` - the signer of the permit. The call will be dispatched on behalf of this address
     - `to` - the address the call is made to
     - `value` - the value being transferred from the `from` account
     - `data` - the call data, or action to be executed
     - `gasLimit` - the gas limit the dispatched call requires. Providing an argument for this parameter prevents the dispatcher from manipulating the gas limit
     - `deadline` - the time in UNIX seconds after which the permit will no longer be valid. In JavaScript, you can get the current time in UNIX seconds by running `console.log(Date.now())` in a JavaScript script or a browser console
     - `v` - the recovery ID of the signature. The last one byte of the concatenated signature
     - `r` - the first 32 bytes of the concatenated signature
     - `s` - the second 32 bytes of the concatenated signature

- **nonces**(*address* owner) - returns the current nonce for given owner
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=\_blank} implementation

--8<-- 'text/builders/pallets-precompiles/precompiles/call-permit/domain-separator.md'

When `dispatch` is called, the permit needs to be verified before the call is dispatched. The first step is to [compute the domain separator](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L138){target=\_blank}. The calculation can be seen in [Moonbeam's implementation](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L112-L126){target=\_blank} or you can check out a practical example in [OpenZeppelin's EIP712 contract](ttps://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=\_blank}.

From there, a [hash of the signature and the given arguments](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L140-L151){target=\_blank} is generated which guarantees that the signature can only be used for the call permit. It uses a given nonce to ensure the signature is not subject to a replay attack. It is similar to [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=\_blank}, except the `PERMIT_TYPEHASH` is for a call permit, and the arguments match that of the [dispatch function](#:~:text=The interface includes the following functions) plus the nonce.

The domain separator and the hash struct can be used to build the [final hash](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L153-L157){target=\_blank} of the fully encoded message. A practical example is shown in [OpenZeppelin's EIP712 contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=\_blank}.

With the final hash and the v, r, and s values, the signature can be [verified and recovered](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L211-L223){target=\_blank}. If successfully verified, the nonce will increase by one and the call will be dispatched.

## Setup the Contracts {: #setup-the-example-contract }

For this example, you'll learn how to sign a call permit that updates a message in a simple example contract, [`SetMessage.sol`](#example-contract). Before you can generate the call permit signature, you'll need to deploy the contract and define the `dispatch` function arguments for the call permit.

Once you've setup the example contract, then you can setup the Call Permit Precompile contract.

### Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- Create or have two accounts on Moonbase Alpha to test out the different features in the Call Permit Precompile
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Example Contract {: #example-contract }

The `SetMessage.sol` contract will be used as an example of using a call permit, but in practice, any contract can be interacted with.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract SetMessage {
    string storedMessage;

    function set(string calldata x) public {
        storedMessage = x;
    }

    function get() public view returns (string memory) {
        return storedMessage;
    }
}
```

### Remix Set Up {: #remix-set-up }

You can use [Remix](https://remix.ethereum.org/){target=\_blank} to compile the example contract and deploy it. You'll need a copy of [`SetMessage.sol`](#example-contract){target=\_blank} and [`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank}. To add the contracts to Remix, you can take the following steps:

1. Click on the **File explorer** tab
2. Paste the `SetMessage.sol` contract into a Remix file named `SetMessage.sol`
3. Paste the `CallPermit.sol` contract into a Remix file named `CallPermit.sol`

![Copying and pasting the example contract into Remix](/images/builders/pallets-precompiles/precompiles/call-permit/call-1-new.png)

### Compile & Deploy the Example Contract {: #compile-deploy-example-contract }

First you'll need to compile the example contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile SetMessage.sol**

![Compiling SetMessage.sol](/images/builders/pallets-precompiles/precompiles/call-permit/call-2.png)

Then you can deploy it:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **SetMessage.sol** is selected in the **CONTRACT** dropdown
4. Click **Deploy**
4. MetaMask will pop up and you'll need to **Confirm** the transaction

![Provide the address](/images/builders/pallets-precompiles/precompiles/call-permit/call-3.png)

The contract will appear under the list of **Deployed Contracts** on the left side panel. Copy the contract address as you will need to use it to generate the call permit signature in the next section.

### Compile & Access the Call Permit Precompile {: #compile-access-call-permit }

First you'll need to compile the Call Permit Precompile contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile CallPermit.sol**

![Compiling SetMessage.sol](/images/builders/pallets-precompiles/precompiles/call-permit/call-4.png)

Then instead of deploying the contract, you'll just need to access it given the address of the precompile:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **CallPermit.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the Call Permit Precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.call_permit}}` and click **At Address**
5. The Call Permit Precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/pallets-precompiles/precompiles/call-permit/call-5.png)

## Generate Call Permit Signature {: #generate-call-permit-signature}

In order to interact with the Call Permit Precompile, you have to have or generate a signature to dispatch the call permit with. There are several ways you can generate the signature, this guide will show you two different ways to generate it: in the browser using the [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn){target=\_blank} and [JSFiddle](https://jsfiddle.net/){target=\_blank} and using MetaMask's [`@metamask/eth-sig-util` npm package](https://www.npmjs.com/package/@metamask/eth-sig-util){target=\_blank}.

Regardless of which method you choose to generate the signature, the following steps will be taken:

1. The `message` will be created and includes some of the data that is needed to create the call permit. It includes the arguments that will be passed into the `dispatch` function and the nonce of the signer
2. A JSON structure of the data the user needs to sign will be assembled for the call permit and include all of the types for the `dispatch` arguments and the nonce. This will result in the `CallPermit` type and will be saved as the `primaryType`
3. The domain separator will be created using `"Call Permit Precompile"` exactly for the name, the version of your DApp or platform, the chain ID of the network the signature is to be used on, and the address of the contract that will verify the signature
4. All of the assembled data, the `types`, `domain`, `primaryType` and `message`, will be signed using MetaMask (either in the browser or through the MetaMask's JavaScript signing library)
5. The signature will be returned and you can use [Ethers.js](https://docs.ethers.org/){target=\_blank} [`Signature.from` method](https://docs.ethers.org/v6/api/crypto/#Signature_from){target=\_blank} to return the `v`, `r`, and `s` values of the signature

### The Call Permit Arguments {: #call-permit-arguments }

As seen in the [Call Permit Interface](#the-call-permit-interface) section, the `dispatch` function takes the following parameters: `from`, `to`, `value`, `data`, `gasLimit`, `deadline`, `v`, `r`, and `s`.

In order to get the signature arguments (`v`, `r`, and `s`), you'll need to sign a message containing the arguments for the remainder of the aforementioned parameters, plus the nonce of the signer.

- `from` - the address of the account you want to sign the call permit with
- `to` - the contract address for the `SetMessage.sol` contract
- `value` - can be `0` for this example as you'll just be setting a message instead of transferring any funds
- `data` - you can send any message you would like, you'll just need the hex representation of the message you want to set using the `SetMessage.sol` contract. This will contain the function selector of the `set` function and the string of the message. For this example, you can send `hello world`. To do so, you can use this hex representation:
     ```text
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     ```
- `gasLimit` - `100000` will be enough to send the dispatched call
- `deadline` - you can get the current time in UNIX seconds by running `console.log(Date.now())` in a JavaScript script or a browser console. Once you have the current time, you can add additional time in seconds to represent when the call permit will expire

The nonce of the signer will also be needed. If this is your first time signing a call permit the nonce will be `0`. You can also check the nonce in Remix:

1. Expand the call permit contract
2. Next to the **nonces** function, enter the address of the signer and click on **nonces**
3. The result will be returned directly under the function

![Get the nonce](/images/builders/pallets-precompiles/precompiles/call-permit/call-6.png)

### Use the Browser {: #use-the-browser }

To get started, you can open [JSFiddle](https://jsfiddle.net/){target=\_blank} or another JavaScript playground in the browser. First, you'll need to add [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=\_blank} as it will be used to get the `v`, `r`, and `s` values of the signature:

1. Click on **Resources**
2. Start to type in `ethers` and the dropdown should populate matching libraries. Choose **ethers**
3. Click on the **+** button

The CDN for Ethers.js will appear in the list of libraries under **Resources**.

![Add Ethers to JSFiddle](/images/builders/pallets-precompiles/precompiles/call-permit/call-7.png)

In the **Javascript** code box, copy and paste the following JavaScript snippet, making sure to replace the `to` variables (and any other variables as you see fit):

```js
--8<-- 'code/builders/pallets-precompiles/precompiles/call-permit/browser-getSignature.js'
```

To run the code, click **Run** at the top of the page (or you can also use `control` and `s`). MetaMask should pop up and prompt you to connect an account. Make sure to choose the account you want to sign the message with. Then go ahead and sign the message.

![Sign the message with MetaMask](/images/builders/pallets-precompiles/precompiles/call-permit/call-8.png)

Once you've signed the message, go back to JSFiddle and if the console isn't already open, go ahead and open it to see the signature values include the `v`, `r`, and `s`, values. Copy these values as you'll need them when interacting with the Call Permit Precompile in the following sections.

![Signature values in the JSFiddle console](/images/builders/pallets-precompiles/precompiles/call-permit/call-9.png)

### Use MetaMask's JS Signing Library {: #use-metamasks-signing-library }

To generate the call permit signature using JavaScript and MetaMask's [`@metamask/eth-sig-util` npm package](https://www.npmjs.com/package/@metamask/eth-sig-util){target=\_blank}, you'll first need to create a project locally. You can do so with the following commands:

```bash
mkdir call-permit-example && cd call-permit-example && touch getSignature.js
npm init -y
```

You should now have a file where you can create the script to get the signature along with a `package.json` file. Open the `package.json` file, and below the `"dependencies"` section, add:

```json
"type": "module"
```

Next, you can install the MetaMask signing library and [Ethers.js](https://docs.ethers.org/){target=\_blank}:

```bash
npm i @metamask/eth-sig-util ethers
```

!!! note
    Never reveal your private keys as they give direct access to your funds. The following steps are for demonstration purposes only.

In the `getSignature.js` file, you can copy the following code snippet:

```js
--8<-- 'code/builders/pallets-precompiles/precompiles/call-permit/getSignature.js'
```

To run the script, use the following command:

```bash
node getSignature.js
```

In the console, you should see the concatenated signature along with the values for the signature including the `v`, `r`, and `s` values. Copy these values as you'll need them when interacting with the Call Permit Precompile in the following sections.

![Signature values in the console](/images/builders/pallets-precompiles/precompiles/call-permit/call-10.png)

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

Now that you have generated the call permit signature you will be able to test out calling the `dispatch` function of the Call Permit Precompile.

### Dispatch a Call {: #dispatch-a-call }

When you send the `dispatch` function, you'll need the same arguments as you used to sign the call permit. To get started, go back to the **Deploy and Run** tab in Remix and under the **Deployed Contracts** section expand the call permit contract. Make sure that you're connected to the account that you want to consume the call permit and pay the transaction fees with. Then take the following steps:

1. For the **from** field, enter the account address you used to sign the call permit with
2. Copy and paste the contract address of `SetMessage.sol`
3. Enter `0` for the **value** field
4. Enter the hex representation of the function selector for the `set` function and the string you want to set as the message for the `SetMessage.sol` contract. For this example, `hello world` can be used:
     ```text
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     ```
5. Enter `100000` for the **gasLimit** field
6. Enter the `deadline` you used when signing the call permit
7. Copy the `v` value you should have retrieved while generating the call permit signature and paste it into the **v** field
8. Copy the `r` value you should have retrieved while generating the call permit signature and paste it into the **r** field
9. Copy the `s` value you should have retrieved while generating the call permit signature and paste it into the **s** field
10. Click **transact** to send the transaction
11. MetaMask should pop-up and you can confirm the transaction

![Dispatch the call permit](/images/builders/pallets-precompiles/precompiles/call-permit/call-11.png)

Once the transaction goes through, you can verify that the message was updated to `hello world`. To do so, you can:

1. Expand the `SetMessage.sol` contract
2. Click on **get**
3. The result will appear below the function, and it should show `hello world`

![Verify the dispatch was executed as intended](/images/builders/pallets-precompiles/precompiles/call-permit/call-12.png)

Congratulations! You've successfully generated a call permit signature and used it to dispatch a call on behalf of the call permit signer.
