---
title: XC-20s and Cross-Chain Assets
description:  Learn how to access and interact with an ERC-20 interface for cross-chain tokens on Moonbeam using the assets precompiled Solidity contract.
---

# Overview of XC-20s

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/xcm/xc20/overview/overview-banner.png)

## Introduction {: #introduction } 

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transfer messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems. 

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, making the developer experience unideal, especially for those from the Ethereum world. Consequently, to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} via a precompile contract (Ethereum API). Moreover, developers can integrate XC-20s with regular Ethereum development frameworks or dApps. 

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/xcm/overview/overview-4.png)

## Types of XC-20s {: #types-of-xc-20s }

There are two types of XC-20s: [external](/builders/xcm/xc20/xc20){target=_blank} and [mintable](/builders/xcm/xc20/mintable-xc20){target=_blank}. 

External XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonbeam. Consequently, the actual tokens reside in Moonbeam's sovereign account in each of these chains. External XC-20s will all have _xc_ prepended to their name to distinguish them as native cross-chain assets. 

Mintable XC-20s are also cross-chain assets, however, they are minted and burned directly on Moonbeam and can be transferred to other parachains. Since mintable XC-20s are created on Moonbeam and are not native to another parachain or relay chain, the name, symbol, and decimals for the asset are all completely configurable. As such, they will not neccessarily have _xc_ prepended to the asset name or symbol.

Both type of XC-20s are Substrate assets at their core and at a low-level are interacted with via the Substrate API. However, Moonbeam provides an ERC-20 interface to interact with these assets so that no knowledge of Substrate is required. From a user's perspective, both types of XC-20s are interacted with in the same way. The only difference here is that mintable XC-20s include an extension of the ERC-20 interface with some additional functionality for managing the assets, such as minting and burning.

Cross-chain transfer of XC-20s are done using the [X-Tokens pallet](/builders/xcm/xc20/xtokens/){target=_blank}. The instructions for transferring mintable and external XC-20s are slightly different depending on the multilocation of the given asset.

## XC-20s vs ERC-20 {: #xc-20-vs-erc-20 }

Although XC-20s and ERC-20s are very similar, some distinct differences are to be aware of. 

First and foremost, XC-20s are Substrate-based assets, and as such, they are also subject to be directly impacted by Substrate features such as governance. In addition, XC-20s transactions done via the Substrate API won't be visible from EVM-based block explorers such as [Moonscan](https://moonscan.io){target=_blank}. Only transactions done via the Ethereum API are visible through such explorers.

Nevertheless, XC-20s can be interacted with through an ERC-20 interface, so they have the additional benefit of being accessible from both the Substrate and Ethereum APIs. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs, lending platforms, among others.

## The ERC-20 Solidity Interface {: #the-erc20-interface }

The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=_blank} which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/erc20-interface/erc20-interface.md'

Mintable XC-20s also include additional functions that only the owner of the token contract or a designated account is allowed to call. Please check out the [Mintable XC-20](/builders/xcm/xc20/mintable-xc20){target=_blank} page for more details on the additional functions and the designated roles available.

## The ERC-20 Permit Solidity Interface {: #the-erc20-permit-interface }

The [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface on Moonbeam follows the [EIP-2612 standard](https://eips.ethereum.org/EIPS/eip-2612){target=_blank} which extends the ERC-20 interface with the `permit` function. Permits are signed messages that can be used to change an account's ERC-20 allowance.

The standard ERC-20 `approve` function is limited in it's design as the `allowance` can only be modified by the sender of the transaction, the `msg.sender`. This can be seen in [OpenZeppelin's implentation of the ERC-20 interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}, that sets the `owner` through the [`msgSender` function](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}, which ultimately sets it to the `msg.sender`.

Instead of signing the `approve` transaction, a user can sign a message and that signature can be used to call the `permit` function to modify the `allowance`.  As such, it allows for gas-less token transfers. In addition, users no longer need to send two transactions to approve and transfer tokens. To see an example of the `permit` function, you can check out [OpenZeppelin's implentation of the ERC-20 Permit extension](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}.

The [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface includes the following functions:

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - consumes an approval permit which can be called by anyone
- **nonces**(*address* owner) - returns the current nonce for the given owner
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} implementation

--8<-- 'text/permits/domain-separator.md'

The calculation of the domain separator can be seen in [Moonbeam's EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}.

Aside from the domain separator, the [`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank} guarantees that the signature can only be used for the `permit` function with the given function arguments. It uses a given nonce to ensure the signature is not subject to a replay attack. The calculation of the hash struct can be seen in [Moonbeam's EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}.

The domain separator and the hash struct can be used to build the [final hash](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank} of the fully encoded message. A practical example is shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank}.

With the final hash and the `v`, `r`, and `s` values, the signature can be [verified and recovered](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224){target=_blank}. If successfully verified, the nonce will increase by one and the allowance will be updated.

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

Regardless if the asset is external or minted, they can be interacted with in the same way. However, if you are the owner of a mintable token contract or a desginated account with specific capabilities, there are some additional functions that you can interact with. For more information on how to interact with mintable XC-20 specific functions, please check out the [Interact with Mintable XC-20 Specific Functions](/builders/xcm/xc20/mintable-xc20/#interact-with-the-precompile-using-remix){target=_blank} section of the Mintable XC-20 page.

### Checking Prerequisites {: #checking-prerequisites } 

To approve a spend or transfer XC-20s via the XC-20 precompile, you will need:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- Create or have two accounts on Moonbase Alpha
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'
- The precompile address of the XC-20 you want to interact with. The instructions for calculating the precompile address are slightly different depending on whether the XC-20 is external and imported in or minted directly on Moonbeam:
    - [Calculate External XC-20 Precompile Addresses](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
    - [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

This guide will cover how to interact with the [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface. You can adapt the following instructions and use the [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface.

### Add & Compile the Interface {: #add-the-interface-to-remix } 

You can interact with the XC-20 precompile using [Remix](https://remix.ethereum.org/){target=_blank}. First, you will need to add the ERC-20 interface to Remix:

1. Get a copy of [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} 
2. Paste the file contents into a Remix file named **IERC20.sol**

![Load the interface in Remix](/images/builders/xcm/xc20/overview/overview-1.png)

Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IERC20.sol** file

![Compiling IERC20.sol](/images/builders/xcm/xc20/overview/overview-2.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile {: #access-the-precompile } 

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20 precompile:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **IERC20 - IERC20.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the XC-20 precompile calculated in the [Calculate External XC-20 Precompile Addresses](/builders/xcm/xc20/xc20){target=_blank} or the [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20){target=_blank} instructions. For this example you can use `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`, and click **At Address**

![Access the address](/images/builders/xcm/xc20/overview/overview-3.png)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead. 

The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20. 

![Interact with the precompile functions](/images/builders/xcm/xc20/overview/overview-4.png)

To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](/builders/build/canonical-contracts/precompiles/erc20/){target=_blank} guide and modify it for interacting with the XC-20 precompile.