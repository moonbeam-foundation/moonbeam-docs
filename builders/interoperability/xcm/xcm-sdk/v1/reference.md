---
title: XCM SDK Reference for v1
description: A reference for the interfaces and methods in the Moonbeam XCM SDK, which can be used to send XCM transfers between Moonbeam and other chains in the ecosystem.
---

# Moonbeam XCM SDK Reference: v1

![XCM SDK Banner](/images/builders/interoperability/xcm/sdk/reference-banner.png)

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers.

The SDK provides an API which includes a series of interfaces to get asset information for each of the supported assets, chain information for the initialized network, utility methods, and methods to enable deposits, withdrawals, and subscription to balance information.

This page includes a list of the interfaces and methods available in the XCM SDK for v1. For information on how to use the XCM SDK interfaces and methods, please refer to the [Using the XCM SDK](/builders/interoperability/xcm/xcm-sdk/v1/xcm-sdk){target=_blank} guide.

## Core Types and Interfaces {: #asset-chain-types }

The XCM SDK is based on the premise of defining an asset to transfer and then defining the source chain to send the asset from and the destination chain to send the asset to, which combined builds the transfer data. The following sections cover the types and interfaces you'll interact with when interacting with assets, chains, and transfer data.

### Assets {: #assets }

- `Asset` - defines an asset's key and symbol used on the asset's origin chain

    |      Name      |   Type   |                     Description                     |
    |:--------------:|:--------:|:---------------------------------------------------:|
    |     `key`      | *string* |                 Identifies an asset                 |
    | `originSymbol` | *string* | The symbol of the asset on the asset's origin chain |

- `AssetAmount` - defines properties related to an asset, including `Asset` properties, the decimals and symbol of the asset, and the amount an associated source or destination address has of the asset

    |      Name      |   Type   |                                Description                                 |
    |:--------------:|:--------:|:--------------------------------------------------------------------------:|
    |    `amount`    | *bigint* | Identifies a particular amount of the asset (i.e., balance, minimum, maximum, etc.) |
    |   `decimals`   | *number* |                    The number of decimals the asset has                    |
    |    `symbol`    | *string* |                          The symbol of the asset                           |
    |     `key`      | *string* |                            Identifies an asset                             |
    | `originSymbol` | *string* |            The symbol of the asset on the asset's origin chain             |

    !!! note
        There are a few utility methods that are available for working with `AssetAmount` class that convert the amount to various formats. Please refer to the [Methods for Asset Conversions](#utility-functions) section.

### Chains {: #chains }

- `Chain` - defines properties related to a chain, used to define the source and destination chains. If a chain is an EVM parachain, there are a couple additional properties

    |     Name      |              Type              |                                           Description                                            |
    |:-------------:|:------------------------------:|:------------------------------------------------------------------------------------------------:|
    |  `ecosystem`  |          *Ecosystem*           |     Identifies the ecosystem the chain belongs to: `polkadot`, `kusama`, or `alphanet-relay`     |
    | `isTestChain` |           *boolean*            |                                  Whether the chain is a TestNet                                  |
    |     `key`     |            *string*            |                                        Identifies a chain                                        |
    |    `name`     |            *string*            |                                      The name of the chain                                       |
    |    `type`     |          *ChainType*           |                      The type of the chain: `parachain` or `evm-parachain`                       |
    | `assetsData`  | *Map<string, ChainAssetsData>* |                           A list of the assets that the chain supports                           |
    | `genesisHash` |            *string*            |                                  The hash of the genesis block                                   |
    | `parachainId` |            *number*            |                                     The ID of the parachain                                      |
    | `ss58Format`  |            *number*            | The [ss58 format](https://polkadot.js.org/docs/keyring/start/ss58/){target=_blank} for the chain |
    |     `ws`      |            *string*            |                               The WebSocket endpoint for the chain                               |
    |     `id`      |            *number*            |                            **For EVM parachains only** - The chain ID                            |
    |     `rpc`     |            *string*            |                **For EVM parachains only** - The HTTP RPC endpoint for the chain                 |

- `ChainAssetsData` - defines information needed to target the asset on the chain

    |       Name       |      Type      |                       Description                       |
    |:----------------:|:--------------:|:-------------------------------------------------------:|
    |     `asset`      |    *Asset*     |            The asset's key and origin symbol            |
    |   `balanceId`    | *ChainAssetId* |  The balance ID of the asset. Defaults to the asset ID  |
    |    `decimals`    |    *number*    |          The number of decimals the asset has           |
    |       `id`       | *ChainAssetId* |                      The asset ID                       |
    |   `metadataId`   | *ChainAssetId* |              The metadata ID of the asset               |
    |     `minId`      | *ChainAssetId* |               The minimum ID of the asset               |
    | `palletInstance` |    *number*    | The number of the pallet instance the asset belongs to  |
    |      `min`       |    *number*    | The minimum amount of the asset that can be transferred |

    `ChainAssetId` is a generic type used to specify the location of the asset on the chain, which is different on every chain, and is defined as:

    ```ts
    type ChainAssetId =
      | string
      | number
      | bigint
      | { [key: string]: ChainAssetId };
    ```

### Transfer Data {: #transfer-data }

- `DestinationChainTransferData` - defines the destination chain data for the transfer

    |         Name         |     Type      |                                   Description                                    |
    |:--------------------:|:-------------:|:--------------------------------------------------------------------------------:|
    |      `balance`       | *AssetAmount* |      The balance of the asset being transferred on the destination address       |
    |       `chain`        |  *AnyChain*   |                        The destination chain information                         |
    | `existentialDeposit` | *AssetAmount* | The existential deposit for the asset being transferred on the destination chain |
    |        `fee`         | *AssetAmount* |   The amount of fees for the asset being transferred on the destination chain    |
    |        `min`         | *AssetAmount* |             The minimum amount of the asset that can be transferred              |


- `SourceChainTransferData`

    |         Name         |     Type      |                                 Description                                 |
    |:--------------------:|:-------------:|:---------------------------------------------------------------------------:|
    |      `balance`       | *AssetAmount* |      The balance of the asset being transferred for the source address      |
    |       `chain`        |  *AnyChain*   |                        The source chain information                         |
    | `existentialDeposit` | *AssetAmount* | The existential deposit for the asset being transferred on the source chain |
    |        `fee`         | *AssetAmount* |   The amount of fees for the asset being transferred on the source chain    |
    |     `feeBalance`     | *AssetAmount* |       The balance of the asset being transferred on the source chain        |
    |        `min`         | *AssetAmount* |           The minimum amount of the asset that can be transferred           |
    |        `max`         | *AssetAmount* |           The maximum amount of the asset that can be transferred           |

## Core Methods {: #core-sdk-methods }

The SDK provides the following core methods:

- `Sdk()` - exposes the methods of the XCM SDK. **Must be called first to access other SDK methods**

    ??? code "Parameters"
        |    Name    |     Type     |                         Description                         |
        |:----------:|:------------:|:-----------------------------------------------------------:|
        | `options?` | *SdkOptions* | Allows you to specify an `ethersSigner` or `polkadotSigner` |

    ??? code "Returns"
        |       Name        |   Type   |                                                        Description                                                         |
        |:-----------------:|:--------:|:--------------------------------------------------------------------------------------------------------------------------:|
        |     `assets`      | function | Provides an entry point to building the data necessary to transfer an asset between a source chain and a destination chain |
        | `getTransferData` | function |               Builds the data necessary to transfer an asset between a source chain and a destination chain                |

- `getTransferData()` - builds the data necessary to transfer an asset between a source chain and a destination chain

    ??? code "Parameters"
        |          Name           |               Type               |                                      Description                                       |
        |:-----------------------:|:--------------------------------:|:--------------------------------------------------------------------------------------:|
        |  `destinationAddress`   |             *string*             |             The address of the receiving account on the destination chain              |
        | `destinationKeyorChain` |       *string \| AnyChain*       |                   The key or `Chain` data for the destination chain                    |
        |     `ethersSigner?`     |          *EthersSigner*          | The Ethers signer for Ethereum-compatible chains that use H160 Ethereum-style accounts |
        |      `keyOrAsset`       |        *string \| Asset*         |                The key or `Asset` data for the asset being transferred                 |
        |    `polkadotSigner?`    | *PolkadotSigner \| IKeyringPair* |                          The Polkadot signer or Keyring pair                           |
        |     `sourceAddress`     |             *string*             |                 The address of the sending account on the source chain                 |
        |   `sourceKeyOrChain`    |       *string \| AnyChain*       |                      The key or `Chain` data for the source chain                      |

    ??? code "Returns"
        |       Name       |              Type              |                                       Description                                       |
        |:----------------:|:------------------------------:|:---------------------------------------------------------------------------------------:|
        |  `destination`   | *DestinationChainTransferData* |                 The assembled destination chain and address information                 |
        |  `getEstimate`   |            function            | Gets the estimated amount of the asset that will be received by the destination address |
        | `isSwapPossible` |           *boolean*            |                       Returns whether or not the swap is possible                       |
        |      `max`       |         *AssetAmount*          |                 The maximum amount of the asset that can be transferred                 |
        |      `min`       |         *AssetAmount*          |                 The minimum amount of the asset that can be transferred                 |
        |     `source`     |   *SourceChainTransferData*    |                   The assembled source chain and address information                    |
        |      `swap`      |            function            |    Swaps the destination and the source chains and returns the swapped transfer data    |
        |    `transfer`    |            function            |  Transfers a given amount of the asset from the source chain to the destination chain   |

- `assets()` - provides an entry point to building the data necessary to transfer an asset between a source chain and a destination chain

    ??? code "Parameters"
        |     Name     |    Type     |                                     Description                                      |
        |:------------:|:-----------:|:------------------------------------------------------------------------------------:|
        | `ecosystem?` | *Ecosystem* | Specify the ecosystem for a set of assets: `polkadot`, `kusama`, or `alphanet-relay` |


    ??? code "Returns"
        |   Name   |   Type    |           Description            |
        |:--------:|:---------:|:--------------------------------:|
        | `assets` | *Asset[]* |  A list of the supported assets  |
        | `asset`  | function  | Sets the asset to be transferred |

        Refer to the following section on how to continue to build the transfer data using the `asset` function.

## Methods for Building Transfer Data Starting with Assets {: #transfer-data-builder-methods }

When building transfer data with the `Sdk().assets()` function, you'll use multiple methods to build the underlying XCM message and send it.

- `asset()` - sets the asset to be transferred. **Must call `assets()` first**

    ??? code "Parameters"
        |     Name     |       Type        |                       Description                       |
        |:------------:|:-----------------:|:-------------------------------------------------------:|
        | `keyOrAsset` | *string \| Asset* | The key or `Asset` data for the asset being transferred |

    ??? code "Returns"
        |      Name      |     Type     |                          Description                          |
        |:--------------:|:------------:|:-------------------------------------------------------------:|
        | `sourceChains` | *AnyChain[]* | A list of the supported source chains for the specified asset |
        |    `source`    |   function   |       Sets the source chain to transfer the asset from        |

- `source()` - sets the source chain to transfer the asset from. **Must call `asset()` first**

    ??? code "Parameters"
        |     Name     |         Type         |                 Description                  |
        |:------------:|:--------------------:|:--------------------------------------------:|
        | `keyOrChain` | *string \| AnyChain* | The key or `Chain` data for the source chain |

    ??? code "Returns"
        |        Name         |     Type     |                                     Description                                     |
        |:-------------------:|:------------:|:-----------------------------------------------------------------------------------:|
        | `destinationChains` | *AnyChain[]* | A list of the supported destination chains for the specified asset and source chain |
        |    `destination`    |   function   |                Sets the destination chain to transfer the asset from                |

- `destination()` - sets the destination chain to transfer the asset to. **Must call `source()` first**

    ??? code "Parameters"
        |     Name     |         Type         |                    Description                    |
        |:------------:|:--------------------:|:-------------------------------------------------:|
        | `keyOrChain` | *string \| AnyChain* | The key or `Chain` data for the destination chain |

    ??? code "Returns"
        |    Name    |   Type   |                                          Description                                          |
        |:----------:|:--------:|:---------------------------------------------------------------------------------------------:|
        | `accounts` | function | Sets the source address, the destination address, and the signer(s) required for the transfer |

- `accounts()` - sets the source address, the destination address, and the signer(s) required for the transfer. **Must call `destionation()` first**

    ??? code "Parameters"
        |         Name         |        Type        |                          Description                          |
        |:--------------------:|:------------------:|:-------------------------------------------------------------:|
        |   `sourceAddress`    |      *string*      |    The address of the sending account on the source chain     |
        | `destinationAddress` |      *string*      | The address of the receiving account on the destination chain |
        |      `signers?`      | *Partial(signers)* | The Ethers or Polkadot signers required to sign transactions  |

    ??? code "Returns"
        Please refer to the returns section of the [`getTransferData()` method](#:~:text=getTransferData()) for information on the returned transfer data.

## Methods for Consuming Transfer Data {: #transfer-data-consumer-methods }

- `swap()` - returns the transfer data necessary to swap the asset from the destination chain back to the source chain

    ??? code "Parameters"
        None

    ??? code "Returns"
        Please refer to the returns section of the [`getTransferData()` method](#:~:text=getTransferData()) for information on the returned transfer data. Keep in mind that with the `swap` function, the `source` and `destination` in the original transfer data has been swapped.

- `transfer()` - transfers a given amount of the asset from the source chain to the destination chain

    ??? code "Parameters"
        |   Name   |             Type             |                                  Description                                  |
        |:--------:|:----------------------------:|:-----------------------------------------------------------------------------:|
        | `amount` | *bigint \| number \| string* | The amount of the asset to transfer between the source and destination chains |
  
    ??? code "Returns"
        | Name |       Type        |                        Description                        |
        |:----:|:-----------------:|:---------------------------------------------------------:|
        |  -   | *Promise(string)* | The transaction hash for the transfer on the source chain |

- `getEstimate()` - returns an estimated amount of the asset that will be received on the destination chain, less any destination fees

    ??? code "Parameters"
        |   Name   |        Type        |                                  Description                                  |
        |:--------:|:------------------:|:-----------------------------------------------------------------------------:|
        | `amount` | *number \| string* | The amount of the asset to transfer between the source and destination chains |

    ??? code "Returns"
        | Name |     Type      |                                    Description                                    |
        |:----:|:-------------:|:---------------------------------------------------------------------------------:|
        |  -   | *AssetAmount* | An estimated amount of the asset that will be received by the destination address |

## Methods for Asset Conversions {: #utility-functions }

- `toDecimal()` - converts an `AssetAmount` to a decimal. The number to convert to decimal format and the number of decimals the asset uses are pulled automatically from the `AssetAmount`

    ??? code "Parameters"
        |     Name      |      Type      |                                                                    Description                                                                    |
        |:-------------:|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|
        | `maxDecimal?` |    *number*    |                                          The maximum number of decimal places to use. The default is `6`                                          |
        | `roundType?`  | *RoundingMode* | Accepts an index that dictates the [rounding method](https://mikemcl.github.io/big.js/#rm){target=_blank} to use based on the `RoundingMode` enum |

        Where the `RoundingMode` enum is defined as:

        ```js
        enum RoundingMode {
          RoundDown = 0,
          RoundHalfUp = 1,
          RoundHalfEven = 2,
          RoundUp = 3
        }
        ```

    ??? code "Returns"
        | Name |   Type   |            Description             |
        |:----:|:--------:|:----------------------------------:|
        |  -   | *string* | The given amount in decimal format |

- `toBig()` - converts an `AssetAmount` to a big number

    ??? code "Parameters"
        None

    ??? code "Returns"
        | Name | Type  |              Description              |
        |:----:|:-----:|:-------------------------------------:|
        |  -   | *Big* | The given amount in big number format |

- `toBigDecimal()` - converts an `AssetAmount` to a decimal and then to a big number. The number to convert to decimal format and the number of decimals the asset uses are pulled automatically from the `AssetAmount`

    ??? code "Parameters"
        |     Name      |      Type      |                                                                    Description                                                                    |
        |:-------------:|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|
        | `maxDecimal?` |    *number*    |                                          The maximum number of decimal places to use. The default is `6`                                          |
        | `roundType?`  | *RoundingMode* | Accepts an index that dictates the [rounding method](https://mikemcl.github.io/big.js/#rm){target=_blank} to use based on the `RoundingMode` enum |

        Where the `RoundingMode` enum is defined as:

        ```js
        enum RoundingMode {
          RoundDown = 0,
          RoundHalfUp = 1,
          RoundHalfEven = 2,
          RoundUp = 3
        }
        ```

    ??? code "Returns"
        | Name | Type  |                  Description                  |
        |:----:|:-----:|:---------------------------------------------:|
        |  -   | *Big* | The given amount in big number decimal format |
