---
title: Self-Serve Asset Registration
description: This guide shows sibling parachains how to register native tokens as foreign assets on Moonbeam via ForeignAssetOwnerOrigin to unlock ERC-20 UX on Moonbeam.
categories: XCM
---

# Self-Serve Asset Registration for Sibling Parachains

## Introduction {: #introduction }

Registering your parachain's native tokens on Moonbeam or Moonriver lets your community enjoy ERC‑20–style UX and deep EVM integrations while retaining full on‑chain provenance. This guide shows sibling Polkadot parachain teams how to self‑register a foreign asset using the new `ForeignAssetOwnerOrigin` introduced in Moonbeam Runtime 3600.

### Why a New Origin? {: #why-a-new-origin }

Moonbeam introduced a new dedicated origin called `ForeignAssetOwnerOrigin`, which only permits an XCM message whose origin contains the asset's multilocation to execute calls in the `evm‑foreign‑assets` pallet. In practice, that means only the sovereign account of the parachain that owns the asset, or Moonbeam governance, can create, freeze, unfreeze, or relocate it. Alongside this, a configurable runtime constant called `ForeignAssetCreationDeposit` is reserved from the caller's sovereign account at creation time. The deposit discourages spam registrations.

## Required Deposits {: #required-deposits }

To prevent spam, a `ForeignAssetCreationDeposit` is required and locked for the lifetime of the asset. The deposit is funded from the sibling parachain's sovereign account on the Moonbeam network, which thus needs to be sufficiently funded to cover the asset deposit and the associated transaction fees. If the asset is destroyed through governance, the deposit is unreserved and returned to the original sovereign account.

Deposits are network‑specific and can be adjusted by Moonbeam governance via the `parameters` pallet:

=== "Moonbeam"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonbeam.xcm.foreign_asset_deposit.display }} GLMR |
=== "Moonriver"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonriver.xcm.foreign_asset_deposit.display }} MOVR |
=== "Moonbase Alpha"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonbase.xcm.foreign_asset_deposit.display }} DEV |

## Prerequisites {: #prerequisites }

There are a few prerequisites to be aware of: 

- The sibling parachain's [sovereign account](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=\_blank} on Moonbeam must be sufficiently funded to cover the asset deposit and the transaction fees. It's recommended that you have an extra buffer of additional funds for any subsequent transactions. See this [guide to calculating a sovereign account](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=\_blank}
- Your parachain should support XCM V4
- Your parachain needs bidirectional XCM channels with Moonbeam. See this [guide for information on opening XCM channels with Moonbeam](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} 

## Assemble Your Asset Details {: #assemble-your-asset-details }

Before you register your sibling-parachain token on Moonbeam, you'll need to gather four pieces of information:

* **`AssetID`**: A deterministic `u128` derived from the token's `multilocation` (see below).
* **`Decimals`**: How many decimal places the token uses (for example, `18`).
* **`Symbol`**: A short ticker such as `xcTEST`. The ticker should be prepended with `xc`.
* **`Name`**: A human-readable name such as `Test Token`.

```typescript
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/1.ts'
```

### How to Calculate Asset ID {: #calculate-asset-id }

To generate a token's asset ID, you'll first need to know its multilocation. `assetLocation` is a SCALE‑encoded multilocation that pinpoints the existing token on your sibling parachain. There are various ways to define assets and your multilocation may including parachain ID, the pallet that manages assets there, and the local asset index. Because the extrinsic executes on Moonbeam, you describe the path from Moonbeam's perspective: first hop up one level to the Relay `("parents": 1)`, then down into your parachain `(Parachain: <paraId>)`, the pallet, and the asset index. Moonbeam uses this to verify that the caller actually "contains" the asset before allowing any registration or updates. 

Once you've constructed your multilocation, keep it handy, as you'll need it in the next step. A typical asset multilocation looks like this:

```jsonc
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/2.txt'
```

The XCM tools repo has a helpful [Calculate External Asset Info script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-external-asset-info.ts){target=\_blank} that you can use to generate the asset ID programmatically. The script takes two parameters, namely, the multilocation of your asset and the target network (Moonbeam or Moonriver). Call the `calculate-external-asset-info.ts` helper script with your asset's multilocation and target network, as shown below, to easily generate its asset ID.

```bash
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/3.sh'
```

The script will return the `assetID` you are now ready to pass to `evmForeignAssets.createForeignAsset`.

### Derive the XC-20 Address

Convert `assetID` to hex, left-pad it to 32 hex chars, and prepend eight `F`s as follows:

```text
xc20Address = 0xFFFFFFFF + hex(assetId).padStart(32, '0')
```

The XC-20 address of xcDOT as an example can be calculated like so: 

=== "Formula"

    ```ts
    --8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/4.ts'
    ```
=== "Example"

    ```bash
    --8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/5.sh'
    ```


## Generate the Encoded Call Data {: #generate-the-encoded-call-data }

The snippet below shows how to build the call that needs to be sent to Moonbeam that creates the foreign asset. Save the resulting hex string because you will embed it inside a subsequent XCM `Transact` call dispatched from your sibling parachain.

```ts
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/generate-call-data.ts'
```

### Dispatch the Call with XCM Transact {: #dispatch-the-call-with-xcm-transact }

To register your asset, wrap the SCALE‑encoded `createForeignAsset` bytes in a single `Transact` instruction executed from your parachain's sovereign account. The basic structure of the call is outlined below:

```text
Transact {
  originKind: SovereignAccount,
  requireWeightAtMost: <weight>,
  call: <encodedCall>
}
```

Send the transact instruction via `xcmPallet.send`, targeting parachain `2004` for Moonbeam (or `2023` for Moonriver). 

```rust
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/6.rs'
```

Finally, look for the following event emitted successfully on Moonbeam:

```text
EvmForeignAssets.ForeignAssetCreated(assetId, location, creator)
```

Its presence confirms the XC-20 asset is live.

## Managing an Existing Foreign Asset {: #managing-an-existing-foreign-asset }

After a foreign asset has been created, the following extrinsics can be used to update it. Note that in the case of the sovereign account sending a call, the sovereign account and location must still be inside the origin. Otherwise, the only other authorized origin is `Root` from a Moonbeam governance action. 

| Extrinsic                                     | Who can call?                                    | Notes                                                 |
|-----------------------------------------------|--------------------------------------------------|-------------------------------------------------------|
| `changeXcmLocation`                           | Sibling sovereign account or Moonbeam governance | Requires deposit already reserved.                    |
| `freezeForeignAsset` / `unfreezeForeignAsset` | Sibling sovereign account or Moonbeam governance | `freeze` optionally destroys the asset's metadata.    |

## FAQs {: #faqs }

### How do I reclaim the deposit?

Deposits remain reserved for the life of the asset. If the asset is destroyed through governance, the deposit is unreserved and returned to the original sovereign account.

### Can a normal EOA register an asset?

No. Calls from non‑sovereign, non‑governance accounts fail with `BadOrigin`.

### What happens if my XCM location is outside my origin?

The call is rejected with `LocationOutsideOfOrigin`. Double‑check the `Parachain`, `PalletInstance`, and `GeneralIndex` fields.

### Is there a limit to how many assets can be created? 

Yes, there is a limit of `256` foreign assets per network (e.g., Moonbeam, Moonriver). Attempts beyond this return `TooManyForeignAssets`. If this threshold is approached, a revision can be made in a future runtime upgrade to lift this limit.
