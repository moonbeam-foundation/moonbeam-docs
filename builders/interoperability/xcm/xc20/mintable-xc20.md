---
title: Mintable XC-20s
description: Learn about cross-chain assets that can be minted and burned on a Moonbeam-based network, and transferred to other Substrate chains via XCM.
---

# Mintable XC-20s

## Introduction {: #introduction }

As covered in the [XC-20 Overview](/builders/interoperability/xcm/xc20/overview){target=_blank}, there are two [types of XC-20s](/builders/interoperability/xcm/xc20/overview#types-of-xc-20s){target=_blank}: [external](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank} and mintable. The key distinction between external and mintable XC-20s, is that mintable XC-20s represent assets that are minted/burned in Moonbeam directly, but have native XCM interoperability features. Also, mintable XC-20s can be transferred to any other parachain as long as it is registered as an XCM asset on that chain, as covered in the [XCM overview](/builders/interoperability/xcm/overview/){target=_blank} page. In contrast, external XC-20s represent assets that are locked in Moonbeam's Sovereign account in either the relay chain or other parachains, and are registered as such on Moonbeam. This guide will cover mintable XC-20s.

All XC-20s are Substrate assets at their core. Typically with Substrate assets, developers need to interact directly with the Substrate API. However, Moonbeam removes the need for Substrate knowledge and allows users and developers to interact with these assets through an ERC-20 interface via a precompile contract. Therefore, developers can use standard Ethereum developer tooling to interact with these assets. Mintable XC-20s include an extension of the ERC-20 interface with some additional functionality for managing the asset and setting the metadata, such as the name, symbol, and decimals for the asset. There are also some additional roles in place for asset registration and management.

Currently, mintable XC-20 assets need to be created through democracy proposals and be voted on via on-chain governance. Once a proposal has received majority votes and has been approved the asset can then be registered and minted on Moonbeam. In addition, there is a [deposit](#create-a-proposal) (bond) associated to the creation of a mintable XC-20 token.

## Mintable XC-20 Roles {: #mintable-xc-20-roles }

There are some roles that are important to take note of when registering and managing mintable XC-20s. These roles, with the exception of the creator, can all be designated to other accounts by the owner via the [`setTeam` extrinsic](#additional-functions). The roles are as follows:

- **Owner** - the account which owns the contract and has the ability to manage the asset
- **Creator** - the account responsible for creating the asset and paying the associated deposit
- **Issuer** - the designated account capable of issuing or minting tokens. Defaults to the owner
- **Admin** - the designated account capable of burning tokens and unfreezing accounts and assets. Defaults to the owner
- **Freezer** - the designated account capable of freezing accounts and assets. Defaults to the owner

The breakdown of responsibilities for each role is as follows:

|  Role   | Mint | Burn | Freeze | Thaw |
|:-------:|:----:|:----:|:------:|:----:|
|  Owner  |  ✓   |  ✓   |   ✓    |  ✓   |
| Creator |  X   |  X   |   X    |  X   |
| Issuer  |  ✓   |  X   |   X    |  X   |
|  Admin  |  X   |  ✓   |   X    |  ✓   |
| Freezer |  X   |  X   |   ✓    |  X   |

## The Mintable XC-20 Solidity Interface {: #the-mintable-xc20-interface }

The Solidity interface for Mintable XC-20 tokens is a combination of the following three interfaces:

 - [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} — as described in the [XC-20 overview page](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=_blank}
 - [Permit Interface (EIP-712 compliant)](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} — as described in the [XC-20 overview page](/builders/interoperability/xcm/xc20/overview/#the-erc20-permit-interface){target=_blank}
 - [Mintable interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/LocalAsset.sol){target=_blank} — as described in the [following section](#additional-functions)

## Mintable XC-20 Specific Functions {: #additional-functions }

Mintable XC-20s include additional functions that only the owner or the designated account is allowed to call. They are declared in the [LocalAsset.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/LocalAsset.sol){target=_blank} interface, and are as follows:

- **mint(*address* to, *uint256* value)** - mints a given amount of tokens to a specified address. Only the owner and the issuer are capable of calling this function

    !!! note
        The maximum `value` that can be minted is actually limited to *uint128*. A Mintable XC-20 will behave differently if the total supply is over 2^128 (without decimals), the mint will fail due to overflow checks. This is unlikely to happen for traditional tokens as they are not meant to reach such high numbers. For more information, please refer to the [Mintable XC-20s vs ERC-20s](/builders/get-started/eth-compare/security/#mintable-xc-20s-vs-erc-20s){target=_blank} section of the Security Considerations page.

- **burn(*address* from, *uint256* value)** - burns a given amount of tokens from a specified address. Only the owner and the admin are capable of calling this function

    !!! note
        The `burn` function in Substrate behaves differently than the [standard ERC-20 `burn` function](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20-_burn-address-uint256-){target=_blank} as it does not require the `from` account to have the amount of tokens specified by the `value`. For more information, please refer to the [Mintable XC-20s vs ERC-20s](/builders/get-started/eth-compare/security/#mintable-xc-20s-vs-erc-20s){target=_blank} section of the Security Considerations page.
    
- **freeze(*address* account)** - freezes a specified account so that the tokens for that account are locked and any further transactions are not allowed. Only the owner and the freezer are capable of calling this function
- **thaw(*address* account)** - unfreezes an account so now the specified account can interact with the tokens again. Only the owner and the admin are capable of calling this function
- **freezeAsset()** - freezes the entire asset operations and locks up the tokens. Only the owner and the freezer are capable of calling this function
- **thawAsset()** - unfreezes the entire asset operations and unlocks the tokens. Only the owner and the admin are capable of calling this function
- **transferOwnership(*address* owner)** transfers the ownership of an asset to a new specified account. Only the owner is capable of calling this function
- **setTeam(*address* issuer, *address* admin, *address* freezer)** - enables the owner to specify the issuer, admin, and freezer of the tokens. Please check out the [Mintable XC-20 Roles](#mintable-xc-20-roles) section for a description of each role. Only the owner is capable of calling this function
- **setMetadata(*string calldata* name, *string calldata* symbol, *uint8* decimals)** - sets the name, symbol, and decimal of the asset. The decimals are also configurable and not confined to the same amount of decimals as the native Moonbeam assets
- **clearMetadata()** - clears the existing name, symbol, and decimals of the asset

## Retrieve List of Mintable XC-20s {: #retrieve-list-of-mintable-xc-20s }

To fetch a list of the mintable XC-20s currently available on the Moonbase Alpha TestNet, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=_blank} and make sure you're connected to Moonbase Alpha. Unlike external XC-20s, mintable XC-20s will not show up under the **Assets** page on Polkadot.js Apps. To query the available mintable XC-20s, you have to navigate to the **Developer** tab and select **Chain State** from the dropdown, and take the following steps:

1. From the **selected state query** dropdown, choose **localAssets**
2. Select the **asset** extrinsic
3. Disable the **include option** slider
4. Send the query by clicking on the **+** button

![Fetch list of cross-chain assets](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-1.png)

The result will display the asset ID along with some additional information for all of the registered mintable XC-20s on Moonbase Alpha. The asset ID is automatically generated and is calculated by BLAKE2 hashing a nonce that represents the number of local assets created. The ID is then used to access the asset and calculate the precompile address.

## Retrieve Metadata for Mintable XC-20s {: #retrieve-metadata-for-mintable-xc-20s }

To quickly get more information about a specific mintable XC-20 such as the name, symbol and multi location of the asset, you can use the **metadata** extrinsic to return metadata. For this example, you can feel free to use asset ID `144992676743556815849525085098140609495`, and take the following steps:

1. From the **selected state query** dropdown, choose **localAssets**
2. Select the **metadata** extrinsic
3. Enable the **include option** slider
4. Enter in the asset ID that was returned from calling the **asset** extrinsic. Please note that if you copy and paste the asset ID with the commas, the commas will automatically be removed and the number might be cut off. Make sure it's the exact same number as the ID
5. Send the query by clicking on the **+** button 

![Get asset metadata](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-2.png)

With the results from the metadata, you can see that the asset ID corresponds to the TestLocalAsset mintable XC-20.

## Calculate Mintable XC-20 Precompile Addresses {: #calculate-xc20-address }

Now that you have retrieved a list of the available mintable XC-20s, before you can interact with them via the precompile, you need to derive the precompile address from the asset ID. The asset ID can be retrieved by following the instructions in the [Retrieve List of Mintable XC-20s](#retrieve-list-of-mintable-xc-20s) section.

The mintable XC-20 precompile address is calculated using the following:

```text
address = "0xFFFFFFFE..." + DecimalToHex(AssetId)
```

Given the above calculation, the first step is to take the u128 representation of the asset ID and convert it to a hex value. You can use your search engine of choice to look up a simple tool for converting decimals to hex values. For asset ID `144992676743556815849525085098140609495`, the hex value is `6D1492E39F1674F65A6F600B4589ABD7`.

Mintable XC-20 precompiles can only fall between `0xFFFFFFFE00000000000000000000000000000000` and `0xFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`. As such, the first 8 characters of the address will always be `FFFFFFFE`. Since Ethereum addresses are 40 characters long, you will need to prepend `0`s to the hex value until the address has 40 characters. 

The hex value that was already calculated is 32 characters long, so prepending the first 8 characters, `FFFFFFFE`, to the hex value will give you the 40 character address you need to interact with the XC-20 precompile. For this example, the full address is `0xFFFFFFFE6D1492E39F1674F65A6F600B4589ABD7`.

Now that you've calculated the mintable XC-20 precompile address, you can use the address to interact with the XC-20 like you would with any other ERC-20 in Remix.

## Register a Mintable XC-20 {: #register-a-mxc-20 }

This section of the guide will show you how to register an asset on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=_blank} and interact with the mintable XC-20 specific functions using [Remix](https://remix.ethereum.org/){target=_blank}. If you simply want to interact with a mintable XC-20 through the standard ERC-20 interface, please refer to the [Interact with the Precompile Using Remix](/builders/interoperability/xcm/xc20/overview/#interact-with-the-precompile-using-remix){target=_blank} section of the XC-20 precompile page.

### Checking Prerequisites {: #checking-prerequisites } 

To register a mintable XC-20 on Moonbase Alpha, you'll need to have the following:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- An account funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Create a Proposal {: #create-a-proposal }

The first step to get your mintable XC-20 registered on Moonbeam is to create a proposal. The creator-role of the asset will need to submit a deposit. The deposit for each network is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.mintable_xc20.asset_deposit }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.mintable_xc20.asset_deposit }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.mintable_xc20.asset_deposit }} DEV
    ```

To get started, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=_blank} and make sure you're connected to Moonbase Alpha. Then click on **Governance** at the top of the page and then select **Democracy** from the dropdown. Then you can select **+ Submit preimage** and take the following steps:

1. Select the account you want to create the proposal with
2. From the **propose** dropdown, choose **assetManager**
3. Then select the **registerLocalAsset** extrinsic
4. Enter the address of the creator
5. Enter the address of the owner
6. Set **isSufficient**. If set to `true`, it can be transferred to another account without a native token balance 
7. Set the **minBalance**
8. Copy the **preimage hash** as you'll need it in the following steps
9. Click on **+ Submit preimage**

![Create preimage to register the mintable XC-20](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-3.png)

Once the preimage has been created and submitted, then you'll need to actually submit the proposal. To do so, you can click on **+ Submit proposal** and take the following steps:

1. Select the account you want to create the proposal with
2. Paste in the **preimage hash**, which you should have copied beforehand. If you did not copy the hash, you can choose **Developer** from the top of the page, then **Chain State** from the dropdown, and then query the **preimages** extrinsic. Make sure that the **include option** slider is toggled off and submit the query 
3. Optionally, you can update the deposit as you see fit
4. Click on **+ Submit proposal**

![Create proposal to register the mintable XC-20](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-4.png)

You'll be prompted to submit and sign the proposal, and once you do so you'll see that the proposal appear under the **proposals** section of the **Democracy** page.

Your proposal will then be subject to democracy and on-chain governance, please check out the [Governance](/learn/features/governance){target=_blank} documentation page to find out more information on how governance works on Moonbeam.

### Set Asset Metadata {: #set-asset-metadata }

Once the proposal is approved and enacted, the account you specified as the owner can set the metadata for the asset. The metadata includes the asset name, symbol, and decimals. There is a deposit required to set the metadata, it is as follows for each of the networks:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.mintable_xc20.metadata_base_deposit }} GLMR base fee + ({{ networks.moonbeam.mintable_xc20.metadata_byte_deposit }} GLMR x number of bytes stored)
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.mintable_xc20.metadata_base_deposit }} MOVR base fee + ({{ networks.moonriver.mintable_xc20.metadata_byte_deposit }} MOVR x number of bytes stored)
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.mintable_xc20.metadata_base_deposit }} DEV base fee + ({{ networks.moonbase.mintable_xc20.metadata_byte_deposit }} DEV x number of bytes stored)
    ```

To set the asset metadata, you'll need to [retrieve the asset ID](#retrieve-list-of-mintable-xc-20s). Once you have it, click on **Developer** at the top of the page and then select **Extrinsics** from the dropdown. From there, you can take the following steps:

1. Select the owners account
2. From the **submit the following extrinsic** dropdown, choose **localAssets**
3. Then select the **setMetadata** extrinsic
4. Enter the asset ID
5. Enter the name for the asset
6. Set the symbol for the asset
7. Set the decimals for the asset. This doesn't have to be 18 decimals like the Moonbeam native assets, it's completely configurable
8. Click on **Submit Transaction**

![Set metadata for mintable XC-20](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-5.png)

You can use the **Extrinsics** page to perform other functions such as minting tokens, delegating a team, freeze and thaw assets or accounts, and more. 

### Interact with Mintable XC-20 Specific Functions Using Remix {: #interact-with-the-precompile-using-remix } 

As previously mentioned, this section of the guide will only cover interacting with the mintable XC-20 specific functions available for the token contract owner or the designated accounts with special [roles](#mintable-xc-20-roles). If you simply want to interact with a mintable XC-20 through the standard ERC-20 interface, please refer to the [Interact with the Precompile Using Remix](/builders/interoperability/xcm/xc20/overview/#interact-with-the-precompile-using-remix){target=_blank} section of the XC-20 precompile page.

First, you will need to add the `LocalAsset` interface to [Remix](https://remix.ethereum.org/){target=_blank}. Then you can take the following steps:

1. Get a copy of [LocalAsset.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/LocalAsset.sol){target=_blank}
2. Paste the file contents into a Remix file named **ILocalAsset.sol**

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-6.png)

Once you have the interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **ILocalAsset.sol** file

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-7.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

Instead of deploying the precompile, you will access the interface given the address of the XC-20 precompile:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **ILocalAsset - ILocalAsset.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the XC-20 precompile calculated in the [Calculate Precompile Address](#calculate-precompile-address) section, `0xFFFFFFFE6D1492E39F1674F65A6F600B4589ABD7`, and click **At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-8.png)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead. 

The precompile for the mintable XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the available functions.

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/mintable-xc20/mintable-xc20-9.png)
