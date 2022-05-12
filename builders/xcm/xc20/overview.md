---
title: XC-20s and Cross-Chain Assets
description:  Learn how to access and interact with an ERC-20 interface for cross-chain tokens on Moonbeam using the assets precompiled Solidity contract.
---

# Overview of XC-20s

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/xcm/xc20/overview/xc20-banner.png)

## Introduction {: #introduction } 

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transfer messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems. 

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, making the developer experience unideal, especially for those from the Ethereum world. Consequently, to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} via a precompile contract (Ethereum API). Moreover, developers can integrate XC-20s with regular Ethereum development frameworks or dApps. 

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/xcm/overview/overview-4.png)

There are two types of XC-20s: [deposited](/builders/xcm/xc20/deposited-xc20){target=_blank} and [mintable](/builders/xcm/xc20/mintable-xc20){target=_blank} Deposited XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonbeam. Mintable XC-20s are also cross-chain assets, however, they are minted and burned directly on Moonbeam and can be transferred to other parachains or the relay chain.

## XC-20 vs ERC-20 {: #xc-20-vs-erc-20 }

Although XC-20s and ERC-20s are very similar, some distinct differences are to be aware of. 

First and foremost, XC-20s are Substrate-based assets, and as such, they are also subject to be directly impacted by Substrate features such as governance. In addition, XC-20s transactions done via the Substrate API won't be visible from EVM-based block explorers such as [Moonscan](https://moonscan.io){target=_blank}. Only transactions done via the Ethereum API are visible through such explorers.

Nevertheless, XC-20s can be interacted with through an ERC-20 interface, so they have the additional benefit of being accessible from both the Substrate and Ethereum APIs. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs, lending platforms, among others.

## The ERC-20 Interface {: #the-erc20-interface }

The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=_blank} which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/erc20-interface/erc20-interface.md'

Mintable XC-20s also include additional functions that only the owner of the token contract or a designated account is allowed to call. Please check out the [Mintable XC-20](/builders/xcm/xc20/mintable-xc20){target=_blank} page for more details on the additional functions and the designated roles available.

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

Regardless if the asset is deposited or minted, they can be interacted with in the same way. However, if you are the owner of a mintable token contract or a desginated account with specific capabilities, there are some additional functions that you can interact with. For more information on how to interact with mintable XC-20 specific functions, please check out the [Interact with Mintable XC-20 Specific Functions](/builders/xcm/xc20/mintable-xc20/#interact-with-the-precompile-using-remix){target=_blank} section of the Mintable XC-20 page.

### Checking Prerequisites {: #checking-prerequisites } 

To approve a spend or transfer XC-20s via the XC-20 precompile, you will need:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- Create or have two accounts on Moonbase Alpha
- At least one of the accounts will need to be funded with `DEV` tokens. You can obtain tokens for testing purposes from [Mission Control](/builders/get-started/networks/moonbase/#get-tokens/){target=_blank}
- The precompile address of the XC-20 you want to interact with. The instructions for calculating the precompile address are slightly different depending on whether the XC-20 was deposited to or minted on Moonbeam:
    - [Calculate Deposited XC-20 Precompile Addresses](/builders/xcm/xc20/deposited-xc20/#calculate-xc20-address){target=_blank}
    - [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

### Add & Compile the Interface {: #add-the-interface-to-remix }

You can interact with the XC-20 precompile using [Remix](https://remix.ethereum.org/){target=_blank}. First, you will need to add the ERC-20 interface to Remix:

1. Get a copy of [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol) 
2. Paste the file contents into a Remix file named **IERC20.sol**

![Load the interface in Remix](/images/builders/xcm/xc20/overview/xc20-1.png)

Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IER20.sol** file

![Compiling IERC20.sol](/images/builders/xcm/xc20/overview/xc20-2.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile {: #access-the-precompile } 

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20 precompile:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **Environment** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **Account**
4. Ensure **IERC20 - IERC20.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead we are going to provide the address of the precompile in the **At Address** Field
5. Provide the address of the XC-20 precompile calculated in the [Calculate Deposited XC-20 Precompile Addresses](/builders/xcm/xc20/deposited-xc20){target=_blank} or the [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20){target=_blank} instructions. For this example you can use `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`, and click **At Address**

![Access the address](/images/builders/xcm/xc20/overview/xc20-3.png)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead. 

The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20. 

![Interact with the precompile functions](/images/builders/xcm/xc20/overview/xc20-4.png)

To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](/builders/build/canonical-contracts/precompiles/erc20/) guide and modify it for interacting with the XC-20 precompile.