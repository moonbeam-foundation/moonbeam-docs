---
title: XCM Precompile
description: Learn about the XCM Precompile and how to use it to transfer assets from Moonbeam networks to other parachains.
---

# XCM Precompile

## Introduction {: #introduction }

As a Polkadot parachain, Moonbeam has the inherent ability to communicate and exchange data with other connected parachains. This native cross-chain communication allows safe and fast token transfers leveraging the Cross-Consensus Message format (XCM for short), facilitating communication between different consensus systems.

The communication protocol enabling token transfers is built on [Substrate](/builders/substrate/){target=\_blank} and runs on a lower level than the EVM, making it harder for EVM developers to access.

Nevertheless, Moonbeam networks have an XCM Precompile that fills the gap between execution layers. This precompile exposes a smart contract interface that abstracts away the underlying complexities, making the execution of cross-chain token transfers as easy as any other smart contract call. 

This guide will show you how to interact with the [XCM Interface](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank} precompile to execute cross-chain token transfers through the Ethereum API.

The XCM Precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xcm_interface }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xcm_interface }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xcm_interface }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The XCM Solidity Interface {: #the-xcm-solidity-interface }

The [`XCMInterface.sol`](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank} is a Solidity interface that allows developers to interact with the methods of `pallet-xcm`.

??? code "XCMInterface.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/eth-api/XcmInterface.sol'
    ```

The interface includes the necessary data structures along with the following functions:

???+ function "**transferAssetsToPara20**(_paraId, beneficiary, assets, feeAssetItem_) — sends assets via XCM to a 20 byte-like parachain using the underlying `transfer_assets()` transaction included in the XCM pallet module"
   
    === "Parameters"
        - `paraId` *uint32* - the para-id of the destination chain
        - `beneficiary` *address* - the ECDSA-type account in the destination chain that will receive the tokens
        - `assets` *AssetAddressInfo[] memory* - an array of assets to send in Address format
        - `feeAssetItem` *uint32* - the index of the asset that will be used to pay fees

    === "Example"
        - `paraId` - 888
        - `beneficiary` - 0x3f0Aef9Bd799F1291b80376aD57530D353ab0217
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsToPara32**(_paraId, beneficiary, assets, feeAssetItem_) — sends assets via XCM to a 32 byte-like parachain using the underlying `transfer_assets()` transaction included in the XCM pallet module"

    === "Parameters"
        - `paraId` *uint32* - the para-id of the destination chain
        - `beneficiary` *bytes32* - the actual account that will receive the tokens on paraId destination
        - `assets` *AssetAddressInfo[] memory* - an array of assets to send in Address format
        - `feeAssetItem` *uint32* - the index of the asset that will be used to pay fees

    === "Example"
        - `paraId` - 888
        - `beneficiary` - 0xf831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a06
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsToRelay**(_beneficiary, assets, feeAssetItem_) — sends assets via XCM to the relay chain using the underlying `transfer_assets()` transaction included in the XCM pallet module"

    === "Parameters"
        - `beneficiary` *bytes32* - the actual account that will receive the tokens on the relay chain
        - `assets` *AssetAddressInfo[] memory* - an array of assets to send in Address format
        - `feeAssetItem` *uint32* - the index of the asset that will be used to pay fees

    === "Example"
        - `beneficiary` - 0xf831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a06
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsLocation**(_dest, beneficiary, assets, feeAssetItem_) — sends assets using the underlying `transfer_assets()` transaction included in the XCM pallet module"

    === "Parameters"
        - `dest` *Location memory* - the destination chain
        - `beneficiary` *Location memory* - the account in the destination chain that will receive the tokens
        - `assets` *AssetLocationInfo[] memory* - an array of assets to send
        - `feeAssetItem` *uint32* - the index of the asset that will be used to pay fees

    === "Example"
        - `dest` - ["1",[]]
        - `beneficiary` - [0, ["0x01f831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a0600"]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000800"]], 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsUsingTypeAndThenLocation**(_dest, assets, assetsTransferType, remoteFeesIdIndex, feesTransferType, customXcmOnDest_) — sends assets through `transfer_assets_using_type_and_then()` pallet-xcm extrinsic. Important: RemoteReserve type (for either assets or fees) is prohibited. For sending assets and fees (in Location format) with a remote reserve, use the subsequent `transferAssetsUsingTypeAndThenLocation` which shares the same function name as this but takes a different set of parameters"

    === "Parameters"
        - `dest` *Location memory* - the destination chain
        - `assets` *AssetLocationInfo[] memory* - an array of assets to send in Location format
        - `assetsTransferType` *TransferType* - the TransferType corresponding to assets being sent (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `remoteFeesIdIndex` *uint8* - the index of the asset (inside assets array) to use as fees
        - `feesTransferType` *TransferType* - the TransferType corresponding to the asset used as fees (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `customXcmOnDest` *bytes memory* - the XCM message to execute on destination chain

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000802"]], 1000000000000000000]]
        - `assetsTransferType` - 0  
        - `remoteFeesIdIndex` - 0
        - `feesTransferType` - 1    
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45  

??? function "**transferAssetsUsingTypeAndThenLocation**(_dest, assets, remoteFeesIdIndex, customXcmOnDest, remoteReserve_) — sends assets through `transfer_assets_using_type_and_then()` pallet-xcm extrinsic. Important: The remote reserve must be shared between assets and fees"

    === "Parameters"
        - `dest` *Location memory* - the destination chain
        - `assets` *AssetLocationInfo[] memory* - an array of assets to send in Location format
        - `remoteFeesIdIndex` *uint8* - the index of the asset (inside assets array) to use as fees
        - `customXcmOnDest` *bytes memory* - the XCM message to execute on destination chain
        - `remoteReserve` *Location memory* - the remote reserve corresponding for assets and fees (must be shared)

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000800"]], 1000000000000000000]]
        - `remoteFeesIdIndex` - 0
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45  
        - `remoteReserve` - [1,[]]  

??? function "**transferAssetsUsingTypeAndThenAddress**(_dest, assets, assetsTransferType, remoteFeesIdIndex, feesTransferType, customXcmOnDest_) — sends assets through `transfer_assets_using_type_and_then()` pallet-xcm extrinsic. Important: RemoteReserve type (for either assets or fees) is not allowed. For sending assets and fees (in Address format) with a remote reserve, use the subsequent `transferAssetsUsingTypeAndThenAddress`, which shares the same name as this function but takes a different set of parameters"

    === "Parameters"
        - `dest` *Location memory* - the destination chain
        - `assets` *AssetAddressInfo[] memory* - an array of assets to send in Address format
        - `assetsTransferType` *TransferType* - the TransferType corresponding to assets being sent (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `remoteFeesIdIndex` *uint8* - the index of the asset (inside assets array) to use as fees
        - `feesTransferType` *TransferType* - the TransferType corresponding to the asset used as fees (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `customXcmOnDest` *bytes memory* - the XCM message to execute on destination chain

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `assetsTransferType` - 0  
        - `remoteFeesIdIndex` - 0
        - `feesTransferType` - 1   
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45 

??? function "**transferAssetsUsingTypeAndThenAddress**(_dest, assets, remoteFeesIdIndex, customXcmOnDest, remoteReserve_) — sends assets through `transfer_assets_using_type_and_then()` pallet-xcm extrinsic. Important: The remote reserve must be shared between assets and fees"

    === "Parameters"
        - `dest` *Location memory* - the destination chain
        - `assets` *AssetAddressInfo[] memory* - an array of assets to send in Address format
        - `remoteFeesIdIndex` *uint8* - the index of the asset (inside assets array) to use as fees
        - `customXcmOnDest` *bytes memory* - the XCM message to execute on destination chain
        - `remoteReserve` *Location memory* - the remote reserve corresponding for assets and fees (must be shared)

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `remoteFeesIdIndex` - 0
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45
        - `remoteReserve` - [1,[]] 

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites }

To follow this tutorial, you must have your preferred EVM wallet configured and an account funded with native tokens. You can add Moonbeam to MetaMask wallet following this guide: [Interacting with Moonbeam Using MetaMask](/tokens/connect/metamask/){target=\_blank}.

### Remix Set Up {: #remix-set-up }

You can interact with the XCM Precompile using [Remix](https://remix.ethereum.org){target=\_blank}. To add the precompile to Remix, you will need to:

1. Get a copy of [`XCMInterface.sol`](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank}
2. Paste the file contents into a Remix file named `XCMInterface.sol`

### Compile the Contract {: #compile-the-contract }

Next, you will need to compile the interface in Remix:

1. Click on the **Compile** tab, second from top
2. Compile the interface by clicking on **Compile XcmInterface.sol**

![Compiling XCMInterface.sol](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-1.webp)

When the compilation is completed, you will see a green checkmark next to the **Compile** tab.

### Access the Contract {: #access-the-contract }

Instead of deploying the precompile, you will access the interface given the address of the precompiled contract:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note that the precompiled contracts are already accessible at their respective addresses. Therefore, there is no deployment step
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Provider - Metamask**, you may be prompted by MetaMask to connect your account to Remix if it's not already connected
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **XCM - XcmInterface.sol** is selected in the **CONTRACT** dropdown. Given that it is a precompiled contract, there is no deployment step. Instead, you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the precompile: `{{networks.moonbeam.precompiles.xcm_interface}}` and click **At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-2.webp)

The **XCM Interface** precompile will appear in the list of **Deployed Contracts**.

### Send Tokens Over to Another EVM-Compatible Appchain {: #transfer-to-evm-chains }

To send tokens over to an account in another EVM-compatible appchain, please follow these steps:

1. Expand the **transferAssetsToPara20** function
2. Enter the appchain ID (paraId)
3. Enter the 20-byte (Ethereum-like) destination account (beneficiary)
4. Specify the tokens to be transferred. Note that this parameter is an array that contains at least one asset. Each asset is specified by its address and the total amount to transfer
5. Enter the index of the asset that will be used to pay the fees. This index is zero-based, so the first element is `0`, the second is `1`, and so on
6. Click **transact**
7. MetaMask will pop up, and you will be prompted to review the transaction details. Click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-3.webp)

After the transaction is confirmed, wait a few blocks for the transfer to reach the destination chain and reflect the new balance.

### Send Tokens Over to a Substrate Appchain {: #transfer-to-substrate-chains }

To send tokens over to an account in a Substrate appchain, please follow these steps:

1. Expand the **transferAssetsToPara32** function
2. Enter the appchain ID (`paraId`)
3. Enter the sr25519-type destination account (beneficiary)
4. Specify the tokens to be transferred. Note that this parameter is an array that contains at least one asset. Each asset is specified by its address and the total amount to transfer

   --8<-- 'text/builders/ethereum/precompiles/security.md'
moonbeam-mkdocs/moonbeam-docs/.snippets/text/builders/ethereum/precompiles/security.md
5. Enter the index of the asset that will be used to pay the fees. This index is zero-based, so the first element is `0`, the second is `1`, and so on
6. Click **transact**
7. MetaMask will pop up, and you will be prompted to review the transaction details. Click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-4.webp)

After the transaction is confirmed, wait a few blocks for the transfer to reach the destination chain and reflect the new balance.

### Send Tokens Over to the Relay Chain {: #transfer-to-relay-chain }

To send tokens over to an account in the relay chain, please follow these steps:

1. Expand the **transferAssetsToRelay** function
2. Enter the sr25519-type destination account (beneficiary)
3. Specify the tokens to be transferred. Note that this parameter is an array that contains at least one asset. Each asset is specified by its address and the total amount to transfer

   --8<-- 'text/builders/ethereum/precompiles/security.md'

4. Enter the index of the asset that will be used to pay the fees. This index is zero-based, so the first element is `0`, the second is `1`, and so on
5. Click **transact**
6. MetaMask will pop up, and you will be prompted to review the transaction details. Click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-5.webp)

After the transaction is confirmed, wait a few blocks for the transfer to reach the destination chain and reflect the new balance.

### Send Tokens Over Specific Locations {: #transfer-locations }

There are two methods that share names with closely related methods, `transferAssetsUsingTypeAndThenLocation` and `transferAssetsUsingTypeAndThenAddress`. However, these are not duplicates. For each function, there is one that accepts five parameters and another that accepts six. The function with five parameters can only be used when the remote reserve is shared between assets and fees. If the remote reserve is not shared between assets and fees, you can use the six parameter version of the method to specify the information needed.

The following example will demonstrate `transferAssetsUsingTypeAndThenAddress` when the remote reverse is shared between assets and fees. To follow along with the tutorial, take the following steps:

1. Expand the **transferAssetsUsingTypeAndThenAddress** function
2. Enter the multilocation that specifies the destination chain. Note that any chain can be specified, regardless of its configuration or type
3. Enter the combination array of assets to send in Address format
4. Enter the index of the asset that will be used to pay the fees. This index is zero-based, so the first element is `0`, the second is `1`, and so on
5. Enter the XCM message to be executed on destination chain. For more information about creating XCM call data see [Send and Execute XCM Messages](/builders/interoperability/xcm/send-execute-xcm/)  
6. Enter the remote reserve, e.g. `[1,[]]`
7. Click **transact**
8. MetaMask will pop up, and you will be prompted to review the transaction details. Click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-6.webp)

After the transaction is confirmed, wait a few blocks for the transfer to reach the destination chain and reflect the new balance.
