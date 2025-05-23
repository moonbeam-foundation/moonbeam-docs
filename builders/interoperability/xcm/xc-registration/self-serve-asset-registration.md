---
title: Self-Serve Asset Registration for Sibling Parachains
description: This guide shows sibling parachains how to register native tokens as foreign assets on Moonbeam via ForeignAssetOwnerOrigin to unlock ERC-20 UX on Moonbeam.
---

# Self-Serve Asset Registration for Sibling Parachains

## Introduction {: #introduction }

Registering your parachain’s native tokens on Moonbeam or Moonriver lets your community enjoy ERC‑20–style UX and deep EVM integrations while retaining full on‑chain provenance. This guide shows sibling Polkadot parachain teams how to self‑register a foreign asset using the new `ForeignAssetOwnerOrigin` introduced in Moonbeam Runtime 3600.

### Why a New Origin? {: #why-a-new-origin }

Moonbeam introduced a new dedicated origin called `ForeignAssetOwnerOrigin`, which only permits an XCM message whose origin contains the asset’s MultiLocation to execute calls in the `evm‑foreign‑assets` pallet. In practice, that means only the sovereign account of the parachain that owns the asset, or Moonbeam governance, can create, freeze, unfreeze, or relocate it. Alongside this, a configurable runtime constant called `ForeignAssetCreationDeposit` is reserved from the caller’s sovereign account at creation time. The deposit discourages spam registrations.

## Required Deposits {: #required-deposits }

To prevent spam, a `ForeignAssetCreationDeposit` is required and locked for the asset's lifetime. The deposit is funded from the sibling parachain's sovereign account on the Moonbeam network, which thus needs to be sufficiently funded to cover the asset deposit and the associated transaction fees. If the asset is destroyed through governance, the deposit is unreserved and returned to the original sovereign account.

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

* **`assetID`**: A deterministic `u128` derived from the token's `MultiLocation` (see below)
* **`decimals`**: How many decimal places the token uses (for example, `18`)
* **`symbol`**: A short ticker such as `xcTEST`
* **`name`**: A human-readable name such as `Test Token`

```typescript
const ASSET_ID = 42259045809535163221576417993425387648n;
const DECIMALS = 18n;
const SYMBOL   = "xcTEST";
const NAME     = "Test Token";
```

### How to Calculate Deterministic AssetID {: #calculate-asset-id }

1. You can build the token’s multilocation as follows: From Moonbeam’s perspective, go up to the Relay (`parents: 1`), then down into your parachain (`Parachain: <paraId>`), the asset-managing pallet, and the local asset index.

2. Next, SCALE-encode the `MultiLocation`.

   ```ts
   const loc   = api.createType('XcmVersionedMultiLocation', { V4: yourLocation });
   const bytes = loc.toU8a();          // Uint8Array
   ``` 
3. Finally, hash the encoded bytes with `blake2_256`, take the first 16 bytes of the resulting digest, and then reverse their order (Substrate stores `u128` values in little-endian).

   ```ts
   import { blake2AsU8a } from "@polkadot/util-crypto";

   const digest  = blake2AsU8a(bytes);              // 32-byte hash
   const idBytes = [...digest.slice(0, 16)].reverse();
   const assetId = BigInt('0x' + Buffer.from(idBytes).toString('hex'));
   ```

`assetID` is now ready to pass to `evmForeignAssets.createForeignAsset`.


### Derive the XC-20 address

Convert `assetID` to hex, left-pad it to 32 hex chars, and prepend eight `F`s as follows:

```
xc20Address = 0xFFFFFFFF + hex(assetId).padStart(32, '0')
```

The XC-20 address of xcDOT as an example can be calculated like so: 

=== "Formula"

    ```ts
    const xc20Address = `0xFFFFFFFF${hex(assetId).padStart(32, "0")}`;
    ```
=== "Example"

    ```bash
    0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080
    ```

## Construct the Asset MultiLocation {: #construct-the-asset-multilocation }

`assetLocation` is a SCALE‑encoded MultiLocation that pinpoints the existing token on your sibling parachain. There are various ways to define assets and your MultiLocation may including parachain ID, the pallet that manages assets there, and the local asset index. Because the extrinsic executes on Moonbeam, you describe the path from Moonbeam’s perspective: first hop up one level to the Relay ("parents": 1), then down into your parachain (Parachain: <paraId>), the pallet, and the asset index. Moonbeam uses this to verify that the caller actually "contains" the asset before allowing any registration or updates.

Once you've constructed your MultiLocation, keep it handy, as you'll need it in the next step. A typical asset MultiLocation looks like this:

```jsonc
{
  "parents": 1,          // up to Relay
  "interior": {
    "X3": [              // down to sibling para asset
      { "Parachain": 4 },
      { "PalletInstance": 12 },
      { "GeneralIndex": 15 }  // Arbitrary example values
    ]
  }
}
```

## Generate the Encoded Call Data {: #generate-the-encoded-call-data }

If you only need the SCALE‑encoded payload—for example, to embed inside an XCM `Transact` dispatched by your runtime—use the snippet below.

```typescript
import "@moonbeam-network/api-augment";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { blake2AsHex } from "@polkadot/util-crypto";

const moonbeam = await ApiPromise.create({ provider: new WsProvider(MOONBEAM_WSS) });

const tx = moonbeam.tx.evmForeignAssets.createForeignAsset(
  ASSET_ID,
  assetLocation,
  DECIMALS,
  SYMBOL,
  NAME
);

// SCALE‑encoded call data (includes call index 0x3800)
const encodedCall = tx.method.toHex();
console.log("Encoded call data:", encodedCall);

// Optional: 32‑byte call hash (blake2_256)
console.log("Call hash:", blake2AsHex(encodedCall));
```

!!! note
	You still need to wrap this encoded call inside an XCM Transact that is dispatched by your parachain's Root/Governance so it descends to Moonbeam as a sovereign‑account call. A regular user account will fail with `BadOrigin`.

On success, Moonbeam emits a `EvmForeignAssets.ForeignAssetCreated` with the respective assetID, MultiLocation, and creator (Parachain ID) parameters. 

## Managing an Existing Foreign Asset {: #managing-an-existing-foreign-asset }

After a foreign asset has been created, the following extrinsics can be used to update the foreign asset. Note that in the case of the sovereign account sending a call, the sovereign account and location must still be inside the origin. Otherwise, the only other authorized origin is `Root` from a Moonbeam governance action. 

| Extrinsic                                     | Who can call?                                    | Notes                                                 |
|-----------------------------------------------|--------------------------------------------------|-------------------------------------------------------|
| `changeXcmLocation`                           | Sibling Sovereign account or Moonbeam governance | Requires deposit already reserved.                    |
| `freezeForeignAsset` / `unfreezeForeignAsset` | Sibling Sovereign account or Moonbeam governance | `freeze` optionally destroys the asset’s metadata.    |

## FAQs {: #faqs }

### How do I reclaim the deposit?

Deposits remain reserved for the life of the asset. If the asset is destroyed through governance, the deposit is unreserved and returned to the original sovereign account.

### Can a normal EOA register an asset?

No. Calls from non‑sovereign, non‑governance accounts fail with `BadOrigin`.

### What happens if my XCM location is outside my origin?

The call is rejected with `LocationOutsideOfOrigin`. Double‑check the `Parachain`, `PalletInstance`, and `GeneralIndex` fields.

### Is there a limit to how many assets can be created? 

Yes, there is a limit of `256` foreign assets per network (e.g., Moonbeam, Moonriver). Attempts beyond this return `TooManyForeignAssets`. If this threshold is approached, a revision can be made in a future runtime upgrade to lift this limit.
