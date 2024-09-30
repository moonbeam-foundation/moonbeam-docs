---
title: Manage XC Assets
description: This guide includes everything you need to know about updating XC asset details, such as XCM multilocation details and asset price for fee data.
---

# Managing XC Assets

## Introduction {: #introduction }

After completing the [registration process](/builders/interoperability/xcm/xc-registration/assets/) for an XC asset, you may need to periodically update asset details, such as the XCM multilocation details or asset price. This guide will cover these topics and more. 

## Updating Foreign Asset XCM Location {: #updating-foreign-asset-xcm-location }

You can update the multilocation of an asset with the `evmForeignAssets.changeXcmLocation` call, which takes as parameters, the `assetId` and the new multilocation. You'll need to raise a [governance proposal](/tokens/governance/proposals/) and submit the update under the `FastGeneralAdmin` track. If you're testing in Moonbase Alpha, you can optionally ask the Moonbeam Team to submit the extrinsic using Sudo to speed up the process. You can also submit the requisite governance proposal on Moonbase Alpha. 

## Freezing a Foreign Asset {: #freezing-a--foreign-asset }

You can freeze a foreign asset by calling `evmForeignAssets.freezeForeignAsset`, which takes as parameters the `assetId` and an `allowXcmDeposit` boolean. If set to true, XCM deposits from remote chains will still be allowed and mint tokens. If set to false, XCM deposits from remote chains will fail as no minting will be permitted. 