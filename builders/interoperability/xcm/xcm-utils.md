---
title:  XCM Utilities Precompile Contract
description:  Learn the various XCM related utility functions available to smart contract developers with Moonbeam's precompiled XCM Utilities contract.
keywords: solidity, ethereum, xcm, utils, moonbeam, precompiled, contracts
categories: XCM
---

# Interacting with the XCM Utilities Precompile

## Introduction {: #xcmutils-precompile}

The XCM Utilities Precompile contract gives developers XCM-related utility functions directly within the EVM. This allows for easier transactions and interactions with other XCM-related precompiles.

Similar to other [precompile contracts](/builders/ethereum/precompiles/){target=\_blank}, the XCM Utilities Precompile is located at the following addresses:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xcm_utils }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xcm_utils }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xcm_utils}}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The XCM Utilities Solidity Interface {: #xcmutils-solidity-interface }

[XcmUtils.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=\_blank} is an interface to interact with the precompile.

!!! note
    The precompile will be updated in the future to include additional features. Feel free to suggest additional utility functions in the [Discord](https://discord.com/invite/PfpUATX){target=\_blank}.

The interface includes the following functions:

 - **multilocationToAddress**(*Multilocation memory* multilocation) — read-only function that returns the Computed Origin account from a given multilocation
 - **weightMessage**(*bytes memory* message) — read-only function that returns the weight that an XCM message will consume on the chain. The message parameter must be a SCALE encoded XCM versioned XCM message
 - **getUnitsPerSecond**(*Multilocation memory* multilocation) — read-only function that gets the units per second for a given asset in the form of a `Multilocation`. The multilocation must describe an asset that can be supported as a fee payment, such as an [external XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}, or else this function will revert. 

    !!! note
        Note that this function still returns units per second data but units per second has been deprecated and replaced by the calculation of relative price. See [XC asset registration](/builders/interoperability/xcm/xc-registration/assets/#generate-encoded-calldata-for-asset-registration){target=\_blank} for more details.

 - **xcmExecute**(*bytes memory* message, *uint64* maxWeight) - **available on Moonbase Alpha only** -  executes a custom XCM message given the SCALE encoded versioned message to be executed and the maximum weight to be consumed. This function *cannot* be called from a smart contract due to the nature of the `Transact` instruction
 - **xcmSend**(*Multilocation memory* dest, *bytes memory* message) - **available on Moonbase Alpha only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded versioned message to be sent

The `Multilocation` struct in the XCM Utilities Precompile is built the same as the [XCM Transactor Precompile's](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/#building-the-precompile-multilocation){target=\_blank} `Multilocation`.

## Using the XCM Utilities Precompile {: #using-the-xcmutils-precompile }

The XCM Utilities precompile allows users to read data off of the Ethereum JSON-RPC instead of having to go through a Polkadot library. The functions are more for convenience, and less for smart contract use cases.

For `multilocationToAddress`, one example use case is being able to allow transactions that originate from other parachains by whitelisting their Computed Origin addresses. A user can whitelist a multilocation by calculating and storing an address. EVM transactions can originate from other parachains via [remote EVM calls](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=\_blank}.  

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

import "https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol";

contract MultilocationWhitelistExample {
    XcmUtils xcmutils = XcmUtils(0x000000000000000000000000000000000000080C);
    mapping(address => bool) public whitelistedAddresses;

    modifier onlyWhitelisted(address addr) {
        _;
        require(whitelistedAddresses[addr], "Address not whitelisted!");
        _;
    }

    function addWhitelistedMultilocation(
        XcmUtils.Multilocation calldata externalMultilocation
    ) external onlyWhitelisted(msg.sender) {
        address derivedAddress = xcmutils.multilocationToAddress(
            externalMultilocation
        );
        whitelistedAddresses[derivedAddress] = true;
    }

    ...
}
```

To check out an example of how to use the `xcmExecute` function to execute a custom XCM message locally, please refer to the [Create and Execute Custom XCM Messages](/builders/interoperability/xcm/send-execute-xcm/#execute-xcm-utils-precompile){target=\_blank} guide.
