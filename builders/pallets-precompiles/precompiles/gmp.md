---
title: GMP Precompile
description: Learn about the GMP precompile on Moonbeam and how to use it with the Moonbeam Routed Liquidity program provided by bridges like Wormhole.
keywords: solidity, ethereum, GMP, wormhole, moonbeam, bridge, connected, contracts, MRL
---

# Interacting with the GMP Precompile

![GMP Precompile Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/gmp/gmp-banner.png)

## Introduction {: #introduction } 

Moonbeam Routed Liquidity refers to Moonbeam’s use case as the port parachain for liquidity into other Polkadot parachains through a combination of chain-agnostic cross-chain protocols and XCMP. 

The GMP precompile acts as an interface for Moonbeam Routed Liquidity, acting as a middleman between bridging protocols and parachains connected to Moonbeam via XCM. Currently the GMP precompile only supports the relaying of liquidity through Wormhole.

The GMP Precompile is located at the following address:  

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.gmp}}
     ```

## The GMP Solidity Interface {: #the-gmp-solidity-interface }

[`Gmp.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile’s methods:  

- **wormholeTransferERC20**(*bytes memory* vaa) - receives a wormhole bridge transfer VAA, mints tokens via the wormhole token bridge, and forwards the liquidity to the custom payload’s MultiLocation

In practice, it is unlikely that a developer will have to directly interact with the precompile. Relayers interact with the precompile to complete cross-chain actions, so the origin chain that the cross-chain action originates is where the developer has the most responsibility.

The most common instance that someone will have to interact with the precompile is in the case of a recovery, where a relayer doesn’t complete an MRL transaction. A user would have to find the VAA that comes with their origin chain transaction and then manually invoke the wormholeTransferERC20 function.

## Building the Payload for Wormhole

Currently the GMP precompile only supports sending liquidity through Wormhole.  

To send liquidity, on the origin chain, users must invoke the [`transferTokensWithPayload` method](https://book.wormhole.com/technical/evm/tokenLayer.html#contract-controlled-transfer){target=_blank} on the [WormholeTokenBridge smart contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=_blank}. It requires a bytes payload, which must be formatted as a SCALE encoded MultiLocation object wrapped within another versioned type.  

You may be unfamiliar with both SCALE encoding and MultiLocations if you are not familiar with the Polkadot ecosystem. [SCALE encoding](https://docs.substrate.io/reference/scale-codec/){target=_blank} is a compact form of encoding that Polkadot uses. The [MultiLocation type](https://wiki.polkadot.network/docs/learn-xcvm){target=_blank} is used to define a relative point in Polkadot, such as a specific account on a specific parachain (Polkadot blockchain).  

Moonbeam’s GMP protocol requires a MultiLocation to represent the destination for liquidity routing, which most likely means an account on some other parachain. Whatever it is, this destination must be expressed as relative to Moonbeam.  

!!! remember
    MultiLocations being relative is important, because a parachain team may erroneously give you a MultiLocation relative to their own chain, which can be different. Providing an incorrect MultiLocation can result in **loss of funds**!   

Each parachain will have their own methods of interpreting a Multilocation, and you will have to confirm with the project that the Multilocation that you form is correct. That being said, it is most likely that you will be forming a Multilocation with an account.

There are multiple types of accounts that can be included in a MultiLocation, which you must know beforehand when constructing your MultiLocation. The two most common are:

- **AccountKey20** — an account id that is 20-bytes in length, including Ethereum-compatible account ids such as those on Moonbeam
- **AccountId32** — an account id that is 32-bytes in length, standard in Polkadot and its parachains

In the following MultiLocation templates, replace `INSERT_PARACHAIN_ID` with the parachain ID of the network you wish to send funds to and replace `ADDRESS_HERE` with the address of the account you want to send funds to.  

=== "AccountId32"
    ```json
    {
        "parents": 1,
        "interior": {
            "X2": [
                { "Parachain": INSERT_PARACHAIN_ID },
                { 
                    "AccountId32": { 
                        "network": "Any", 
                        "id": "ADDRESS_HERE" 
                    } 
                }
            ]
        }
    }
    ```
=== "AccountKey20"
    ```json
    {
        "parents": 1,
        "interior": {
            "X2": [
                { "Parachain": INSERT_PARACHAIN_ID },
                { 
                    "AccountKey20": { 
                        "network": "Any", 
                        "key": "ADDRESS_HERE" 
                    } 
                }
            ]
        }
    }
    ```

It can be difficult to correctly SCALE encode the entire payload without the right tools. Fortunately, there are Polkadot JavaScript packages that can assist with this, such as `@polkadot/types`. The following script shows how to create a `Uint8Array` that can be used as a payload for the GMP precompile:  

```typescript
import { TypeRegistry, Enum, Struct } from '@polkadot/types';

const registry = new TypeRegistry();

class VersionedUserAction extends Enum {
 constructor(value) {
   super(registry, { V1: XcmRoutingUserAction }, value);
 }
}
class XcmRoutingUserAction extends Struct {
 constructor(value) {
   super(registry, { destination: 'MultiLocation' }, value);
 }
}

function createMRLPayload(parachainId, account, isEthereumStyle) {
 // Create a multilocation object
 let multilocation;
 if(isEthereumStyle) {
   multilocation = {
     parents: 1,
     interior: {
       X2: [
         { Parachain: parachainId },
         { AccountKey20: { network: 'Any', key: account }
       }]
     }
   };
 }
 else {
   multilocation = {
     parents: 1,
     interior: {
       X2: [
         { Parachain: parachainId },
         { AccountId32: { network: 'Any', id: account }
       }]
     }
   };
 }

 // Format objects as polkadotjs types
 multilocation = registry.createType('MultiLocation', multilocation);
 const userAction = new XcmRoutingUserAction({
   destination: multilocation,
 });
 const versionedUserAction = new VersionedUserAction({ V1: userAction });

 // SCALE encode
 return versionedUserAction.toU8a();
}
```

## Restrictions 

The GMP precompile is currently in its early stages. There are many restrictions, and it only supports a “happy path” into parachains. Here are some restrictions that you should be aware of:

- There is currently no fee mechanism. Relayers that run the forwarding of liquidity on Moonbeam to a parachain will be subsidizing transactions. This may change in the future.
- The precompile does not check to ensure that the destination chain supports the token that is being sent to it. **Incorrect MultiLocations may result in loss of funds.**
- Errors in constructing a Multilocation will result in reverts, which will trap tokens and a loss of funds.
- There is currently no recommended path backwards, from parachains to other chains like Ethereum. There is additional protocol level work that must be done before a one-click method can be realized.
    - Due to a restriction with the ERC-20 XC-assets, the only way to send tokens from a parachain back through Moonbeam is to have xcGLMR on the origin parachain and use it as a fee asset when sending tokens back.  
