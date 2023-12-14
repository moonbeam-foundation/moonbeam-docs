---
title: XCM Multilocations
description: Learn everything there is to know about multilocations, their role in XCM, and how to format a multilocation to target a specific point in the ecosystem.
---

# Multilocations

## Introduction {: #introduction }

A multilocation defines a specific point in the entire relay chain/parachain ecosystem relative to a given origin. It can be used to target a specific parachain, asset, account, or even a pallet inside a parachain.

Multilocations follow a hierarchical structure, in which some locations are encapsulated within others. For example, a relay chain encapsulates all of the parachains that are connected to it. Similarly, a parachain encapsulates all of the pallets, accounts, and assets that exist within it.

![Hierarchy of multilocations](/images/builders/interoperability/xcm/core-concepts/multilocations/multilocations-1.png)

## Defining a Multilocation {: #defining-a-multilocation }

A multilocation contains two parameters:

- `parents` - refers to how many "hops" up into a parent blockchain you need to take from a given origin. From the perspective of a parachain within the relay chain ecosystem, there can only be one parent, so the value for `parents` can only ever be `0` to represent the parachain or `1` to represent the relay chain. When defining universal locations that consider other consensus systems like Ethereum, `parents` can have higher values
- `interior` - refers to how many fields you need to define the target point. From the relay chain, you can drill down to target a specific parachain, or account, asset, or pallet on that parachain. Since this downward movement can be more complex, [Junctions](#junctions) are used to represent the steps needed to reach the target location and are defined by `XN`, where `N` is the number of Junctions required. If no Junctions are required to define the target point, its value would be `Here` as opposed to `X1`

For example,if you are targeting the relay chain specifically, you'll use `Here` since you aren't defining an account on the relay chain, a parachain, or a specific point within a parachain.

On the flip side, if you're targeting an account on the relay chain, or a parachain, or a specific point within a parachain, you'll use one or more Junctions, as needed.

### Junctions {: #junctions }

A Junction can be any of the following:

- `Parachain` - describes a parachain using the parachain's ID

    ```js
    { Parachain: INSERT_PARACHAIN_ID }
    ```

- `AccountId32` - describes a 32-byte Substrate-style account. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    { AccountId32: { id: INSERT_ADDRESS, network: INSERT_NETWORK } }
    ```

- `AccountIndex64` - describes a 64-bit (8-byte) index for an account. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    { AccountIndex64: { index: INSERT_ACCOUNT_INDEX, network: INSERT_NETWORK } }
    ```

- `AccountKey20` - describes a 20-byte Ethereum-style account, as is used in Moonbeam. Accepts an optional `network` parameter, which can be one of the following: `Any`, `Named`, `Polkadot`, or `Kusama`

    ```js
    { AccountKey20: { key: INSERT_ADDRESS, network: INSERT_NETWORK } }
    ```

- `PalletInstance` - describes the index of a pallet on the target chain

    ```js
    { PalletInstance: INSERT_PALLET_INSTANCE_INDEX }
    ```

- `GeneralIndex` - describes a nondescript index that can be used to target data stored in a key-value format

    ```js
    { GeneralIndex: INSERT_GENERAL_INDEX }
    ```

- `GeneralKey` - describes a nondescript key that can be used to target more complex data structures. This requires you to specify the `data` and the `length` of the data

    ```js
    { GeneralKey: { length: INSERT_LENGTH_OF_DATA, data: [INSERT_DATA] } }
    ```

- `OnlyChild` - describes the child of a location if there is only a one-to-one relation between the parent and child. This is currently not used except as a fallback when deriving context
- `Plurality` - describes multiple elements that meet specific conditions or share common characteristics. This requires you to specify the [Body ID](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L121-L147){target=_blank} and the [Body Part](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L192-L221){target=_blank} that the Junction represents

    ```js
    { Plurality: { id: INSERT_BODY_ID, part: INSERT_BODY_PART } }
    ```

When using Junctions, you'll use `XN`, where `N` is the number of Junctions required to reach the target location. For example, if you're targeting an account on Moonbeam from a parachain, `parents` needs to be set to `1`, and you'll need to define two Junctions, the `Parachain` and the `AccountKey20`, so you'll use `X2`, which is an array that will contain each Junction:

```js
{
  parents: 1,
  interior: {
    X2: [
      { Parachain: 2004 },
      { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
    ],
  },
};
```

## Example Multilocations {: #example-multilocations }

### Target Moonbeam from Another Parachain {: #target-moonbeam-from-parachain }

To target a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 2004 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 2023 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1000 }],
      },
    };
    ```

### Target an Account on Moonbeam from Another Parachain {: #target-account-moonbeam-from-parachain }

To target a specific account on a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2004 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2023 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 1000 },
          { AccountKey20: { key: 'INSERT_MOONBEAM_ADDRESS' } },
        ],
      },
    };
    ```

### Target Moonbeam's Native Asset from Another Parachain {: #target-moonbeam-native-asset-from-parachain }

To target the native asset of a Moonbeam-based chain from another parachain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2004 },
          { PalletInstance: 10 }, // Index of the Balances Pallet on Moonbeam
        ],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 2023 },
          { PalletInstance: 10 }, // Index of the Balances Pallet on Moonriver
        ],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 1000 },
          { PalletInstance: 3 }, // Index of the Balances Pallet on Moonbase Alpha
        ],
      },
    };
    ```

### Target Moonbeam from the Relay Chain {: #target-moonbeam-from-relay }

To target a Moonbeam-based chain from the relay chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 2004 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 2023 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 0,
      interior: {
        X1: [{ Parachain: 1000 }],
      },
    };
    ```

### Target the Relay Chain from Moonbeam {: #target-relay-from-moonbeam }

To target the relay chain from a Moonbeam-based chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: Here,
    };
    ```

### Target an Account on the Relay Chain from Moonbeam {: #target-account-relay-from-moonbeam }

To target a specific account on the relay chain, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: { X1: { AccountId32: { id: INSERT_RELAY_ADDRESS } } },
    };
    ```

### Target Another Parachain from Moonbeam {: #target-parachain-from-moonbeam }

To target another parachain (for example, a parachain that has an ID of 1234) from Moonbeam, you would use the following multilocation:

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X1: [{ Parachain: 1234 }],
      },
    };
    ```
