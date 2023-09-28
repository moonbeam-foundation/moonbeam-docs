---
title: GMP Precompile
description: Learn about the GMP precompile on Moonbeam and how to use it with the Moonbeam Routed Liquidity program provided by bridges like Wormhole.
keywords: solidity, ethereum, GMP, wormhole, moonbeam, bridge, connected, contracts, MRL
---

# Interacting with the GMP Precompile

## Introduction {: #introduction }

Moonbeam Routed Liquidity (MRL) refers to Moonbeam’s use case as the port parachain for liquidity from origin chains into other Polkadot parachains. This is possible because of general message passing (GMP), where messages with arbitrary data and tokens can be sent across non-parachain blockchains through [chain-agnostic GMP protocols](/builders/interoperability/protocols){target=_blank}. These GMP protocols can combine with [Polkadot's XCM messaging system](/builders/interoperability/xcm/overview){target=_blank} to allow for seamless liquidity routing.  

The GMP precompile acts as an interface for Moonbeam Routed Liquidity, acting as a middleman between token-bearing messages from GMP protocols and parachains connected to Moonbeam via [XCMP](/builders/interoperability/xcm/overview/#xcm-transport-protocols){target=_blank}. Currently the GMP Precompile only supports the relaying of liquidity through the [Wormhole GMP protocol](/builders/interoperability/protocols/wormhole){target=_blank}.  

The GMP Precompile is located at the following address:  

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.gmp}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.gmp}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.gmp}}
     ```

In practice, it is unlikely that a developer will have to directly interact with the precompile. GMP protocols' relayers interact with the precompile to complete cross-chain actions, so the origin chain that the cross-chain action originates is where the developer has the responsibility to ensure that the GMP precompile is used *eventually*.  

## The GMP Solidity Interface {: #the-gmp-solidity-interface }

[`Gmp.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile:  

- **wormholeTransferERC20**(*bytes memory* vaa) - receives a Wormhole bridge transfer [verified action approval (VAA)](https://book.wormhole.com/wormhole/4_vaa.html){target=_blank}, mints tokens via the Wormhole token bridge, and forwards the liquidity to the custom payload’s [multilocation](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank}. The payload is expected to be a precompile-specific SCALE encoded object, as explained in this guide's [Building the Payload for Wormhole](#building-the-payload-for-wormhole) section

VAAs are payload-containing packages generated after origin-chain transactions and are discovered by Wormhole [Guardian Network spies](https://book.wormhole.com/wormhole/6_relayers.html?search=#specialized-relayers){target=_blank}.

The most common instance that a user will have to interact with the precompile is in the case of a recovery, where a relayer doesn’t complete an MRL transaction. For example, a user would have to search for the VAA that comes with their origin chain transaction and then manually invoke the `wormholeTransferERC20` function.

## Building the Payload for Wormhole {: #building-the-payload-for-wormhole }

Currently the GMP precompile only supports sending liquidity with Wormhole, through Moonbeam, and into other parachains. The GMP precompile does not assist with a route from parachains back to Moonbeam and subsequently Wormhole connected chains.  

To send liquidity from a Wormhole-connected origin chain like Ethereum, users must invoke the [`transferTokensWithPayload` method](https://book.wormhole.com/technical/evm/tokenLayer.html#contract-controlled-transfer){target=_blank} on the [origin-chain's deployment](https://book.wormhole.com/reference/contracts.html#token-bridge){target=_blank} of the [WormholeTokenBridge smart contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=_blank}. This function requires a bytes payload, which must be formatted as a SCALE encoded multilocation object wrapped within [another precompile-specific versioned type](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=_blank}.

You may be unfamiliar with both SCALE encoding and multilocations if you are not familiar with the Polkadot ecosystem. [SCALE encoding](https://docs.substrate.io/reference/scale-codec/){target=_blank} is a compact form of encoding that Polkadot uses. The [`MultiLocation` type](https://wiki.polkadot.network/docs/learn-xcvm){target=_blank} is used to define a relative point in Polkadot, such as a specific account on a specific parachain (Polkadot blockchain).  

Moonbeam’s GMP protocol requires a multilocation to represent the destination for liquidity routing, which most likely means an account on some other parachain. Whatever it is, this destination must be expressed as relative to Moonbeam.  

!!! remember
    Multilocations being relative is important, because a parachain team may erroneously give you a multilocation relative to their own chain, which can be different. Providing an incorrect multilocation can result in **loss of funds**!

Each parachain will have their own methods of interpreting a multilocation, and should confirm with the project that the multilocation that you form is correct. That being said, it is most likely that you will be forming a multilocation with an account.

There are multiple types of accounts that can be included in a multilocation, which you must know beforehand when constructing your multilocation. The two most common are:

- **AccountKey20** — an account ID that is 20-bytes in length, including Ethereum-compatible account IDs such as those on Moonbeam
- **AccountId32** — an account ID that is 32-bytes in length, standard in Polkadot and its parachains

The following multilocation templates target accounts on other parachains with Moonbeam as the relative origin. To use them, replace `INSERT_PARACHAIN_ID` with the parachain ID of the network you wish to send funds to and replace `INSERT_ADDRESS` with the address of the account you want to send funds to on that parachain.  

=== "AccountId32"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 'INSERT_PARACHAIN_ID' },
          {
            AccountId32: {
              id: 'INSERT_ADDRESS',
            },
          },
        ],
      },
    }
    ```

=== "AccountKey20"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 'INSERT_PARACHAIN_ID' },
          {
            AccountKey20: {
              key: 'INSERT_ADDRESS',
            },
          },
        ],
      },
    }
    ```

It can be difficult to correctly SCALE encode the entire payload without the right tools, especially due to the [custom types expected by the precompile](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=_blank}. Fortunately, the Polkadot.js API can assist with this.

The versioned user action expected by the precompile accepts two versions: V1 and V2. V1 accepts the `XcmRoutingUserAction` type, which attempts to route the transferred assets to the destination defined by the multilocation. V2 accepts the `XcmRoutingUserActionWithFee` type, which also attempts to route the transferred assets to the destination but also allows a fee to be paid. Relayers can use V2 to specify a fee to charge on Moonbeam to relay the transaction to the given destination.

The following script shows how to create a `Uint8Array` that can be used as a payload for the GMP precompile:  

=== "V1"

    ```typescript
    --8<-- 'code/builders/pallets-precompiles/precompiles/gmp/v1-payload.ts'
    ```

=== "V2"

    ```typescript
    --8<-- 'code/builders/pallets-precompiles/precompiles/gmp/v2-payload.ts'
    ```

## Restrictions {: #restrictions }

The GMP precompile is currently in its early stages. There are many restrictions, and it only supports a “happy path” into parachains. Here are some restrictions that you should be aware of:

- There is currently no fee mechanism. Relayers that run the forwarding of liquidity on Moonbeam to a parachain will be subsidizing transactions. This may change in the future
- The precompile does not check to ensure that the destination chain supports the token that is being sent to it. **Incorrect multilocations may result in loss of funds**
- Errors in constructing a multilocation will result in reverts, which will trap tokens and result in a loss of funds
- There is currently no recommended path backwards, from parachains to other chains like Ethereum. There is additional protocol level work that must be done before a one-click method can be realized
  - Due to a restriction with the ERC-20 XC-assets, the only way to send tokens from a parachain back through Moonbeam is to have xcGLMR on the origin parachain and use it as a fee asset when sending tokens back  
