---
title: XCM Multilocations
description: Learn everything there is to know about multilocations, their role in XCM, and how to format a multilocation to target a specific point in the ecosystem.
categories: XCM
---

# Multilocations

## Introduction {: #introduction }

A multilocation defines a specific point in the entire relay chain/parachain ecosystem relative to a given origin. It can be used to target a specific parachain, asset, account, or even a pallet inside a parachain.

Multilocations follow a hierarchical structure, in which some locations are encapsulated within others. For example, a relay chain encapsulates all of the parachains that are connected to it. Similarly, a parachain encapsulates all of the pallets, accounts, and assets that exist within it.

![Hierarchy of multilocations](/images/builders/interoperability/xcm/core-concepts/multilocations/multilocations-1.webp)

## Defining a Multilocation {: #defining-a-multilocation }

A multilocation contains two parameters:

- `parents` - refers to how many "hops" up into a parent blockchain you need to take from a given origin. From the perspective of a parachain within the relay chain ecosystem, there can only be one parent, so the value for `parents` can only ever be `0` to represent the parachain or `1` to represent the relay chain. When defining universal locations that consider other consensus systems like Ethereum, `parents` can have higher values
- `interior` - refers to how many fields you need to define the target point. From the relay chain, you can drill down to target a specific parachain, or account, asset, or pallet on that parachain. Since this downward movement can be more complex, [Junctions](#junctions) are used to represent the steps needed to reach the target location and are defined by `XN`, where `N` is the number of Junctions required. If no Junctions are required to define the target point, its value would be `Here` as opposed to `X1`

For example, if you are targeting the relay chain specifically, you'll use `Here` since you aren't defining an account on the relay chain, a parachain, or a specific point within a parachain.

On the flip side, if you're targeting an account on the relay chain, or a parachain, or a specific point within a parachain, you'll use one or more Junctions, as needed.

### Junctions {: #junctions }

A Junction can be any of the following:

- `Parachain` - describes a parachain using the parachain's ID

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/1.js'
    ```

- `AccountId32` - describes a 32-byte Substrate-style account. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/2.js'
    ```

- `AccountIndex64` - describes a 64-bit (8-byte) index for an account. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/3.js'
    ```

- `AccountKey20` - describes a 20-byte Ethereum-style account, as is used in Moonbeam. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/4.js'
    ```

- `PalletInstance` - describes the index of a pallet on the target chain

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/5.js'
    ```

- `GeneralIndex` - describes a nondescript index that can be used to target data stored in a key-value format

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/6.js'
    ```

- `GeneralKey` - describes a nondescript key that can be used to target more complex data structures. This requires you to specify the `data` and the `length` of the data

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/7.js'
    ```

- `OnlyChild` - describes the child of a location if there is only a one-to-one relation between the parent and child. This is currently not used except as a fallback when deriving context
- `Plurality` - describes multiple elements that meet specific conditions or share common characteristics. This requires you to specify the [Body ID](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L150-L176){target=\_blank} and the [Body Part](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L222-L251){target=\_blank} that the Junction represents

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/8.js'
    ```

When using Junctions, you'll use `XN`, where `N` is the number of Junctions required to reach the target location. For example, if you're targeting an account on Moonbeam from a parachain, `parents` needs to be set to `1`, and you'll need to define two Junctions, the `Parachain` and the `AccountKey20`, so you'll use `X2`, which is an array that will contain each Junction:

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/9.js'
```

## Example Multilocations {: #example-multilocations }

### Target Moonbeam from Another Parachain {: #target-moonbeam-from-parachain }

To target a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/10.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/11.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/12.js'
    ```

### Target an Account on Moonbeam from Another Parachain {: #target-account-moonbeam-from-parachain }

To target a specific account on a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/13.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/14.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/15.js'
    ```

### Target Moonbeam's Native Asset from Another Parachain {: #target-moonbeam-native-asset-from-parachain }

To target the native asset of a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/16.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/17.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/18.js'
    ```

### Target Moonbeam from the Relay Chain {: #target-moonbeam-from-relay }

To target a Moonbeam-based chain from the relay chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/19.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/20.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/21.js'
    ```

### Target the Relay Chain from Moonbeam {: #target-relay-from-moonbeam }

To target the relay chain from a Moonbeam-based chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/22.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/23.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/24.js'
    ```

### Target an Account on the Relay Chain from Moonbeam {: #target-account-relay-from-moonbeam }

To target a specific account on the relay chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/25.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/26.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/27.js'
    ```

### Target Another Parachain from Moonbeam {: #target-parachain-from-moonbeam }

To target another parachain (for example, a parachain that has an ID of 1234) from Moonbeam, you would use the following multilocation:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/28.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/29.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/30.js'
    ```

### Location to Account API {: #location-to-account-api }

The Location to Account API is an easy way to convert a multilocation into an `AccountID20` address. The Location to Account API can be accessed from the [Runtime Calls](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/runtime){target=\_blank} tab of the **Developer** section of Polkadot.js Apps. The `convertLocation` method of the Location to Account API takes a multilocation as a parameter and returns an `AccountID20` address.

```javascript
--8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/31.js'
```

You can view the complete script below.

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/location-to-account.js'
    ```

The method will return the `AccountID20` address corresponding to the provided multilocation as follows:

```bash
--8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/32.sh'
```
