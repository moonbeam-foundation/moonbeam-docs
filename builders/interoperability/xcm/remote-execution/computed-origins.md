---
title: Computed Origin Accounts
description: Learn about Computed Origin accounts, which can be used to execute remote cross-chain calls through a simple transaction, and how to calculate these accounts.
---

# Computed Origin Accounts

## Introduction {: #introduction }

The Computed Origin, previously referred to as the multilocation-derivative account, is an account computed when executing remote calls via XCM.

Computed origins are keyless (the private key is unknown). Consequently, Computed Origins can only be accessed through XCM extrinsics from the origin account. In other words, the origin account is the only account that can initiate transactions on your Computed Origin account, and if you lose access to your origin account, you’ll also lose access to your Computed Origin account.

The Computed Origin is calculated using the information provided by the [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=_blank} XCM instruction: the multilocation of the account from which the XCM originated, which is typically the Sovereign account on the source chain.

Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}, that is, through a `blake2` hash of a data structure that depends on the origin of the XCM message. However, because Moonbeam uses Ethereum-styled accounts, Computed Origins are truncated to 20 bytes.

## The Origin Conversion {: #origin-conversion }

The [origin conversion](https://github.com/paritytech/polkadot-sdk/blob/polkadot-v1.1.0/polkadot/xcm/xcm-executor/src/lib.rs#L556){target=_blank} for a remote call happens when the `Transact` instruction gets executed. The new origin on the target chain is the one that pays for the fees for XCM execution on the target chain.

For example, from the relay chain, the [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=_blank} instruction is natively injected by the [XCM Pallet](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/pallet-xcm/src/lib.rs){target=_blank}. In the case of Moonbase Alpha's relay chain (based on Westend), it has the following format (a multilocation junction):

```js
{
  DescendOrigin: {
    X1: {
      AccountId32: {
        network: { westend: null },
        id: decodedAddress,
      },
    },
  },
}
```

Where the `decodedAddress` corresponds to the address of the account who signed the transaction on the relay chain (in a decoded 32-byte format). You can make sure that your address is properly decoded by using the following snippet, which will decode an address if needed and ignore it if not:

```js
import { decodeAddress } from '@polkadot/util-crypto';
const decodedAddress = decodeAddress('INSERT_ADDRESS');
```

When the XCM instruction gets executed in Moonbeam (Moonbase Alpha in this example), the origin will have mutated to the following multilocation:

```js
{
  DescendOrigin: {
    parents: 1,
    interior: {
      X1: {
        AccountId32: {
          network: { westend: null },
          id: decodedAddress,
        },
      },
    },
  },
}
```

## How to Calculate the Computed Origin {: #calculate-computed-origin }

You can easily calculate the Computed Origin account through the `calculate-multilocation-derivative-account` script in the [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} repository.

The script accepts the following inputs:

- `--ws-provider` or `-w` - corresponds to the endpoint to use to fetch the Computed Origin. This should be the endpoint for the target chain
- `--address` or `--a` - specifies the source chain address that is sending the XCM message
- `--para-id` or `--p` - (optional) specifies the parachain ID of the origin chain of the XCM message. It is optional, as the XCM message might come from the relay chain (no parachain ID). Or parachains can act as relay chains for other parachains
- `--parents` - (optional) corresponds to the parents value of the source chain in relation to the target chain. If you're calculating the Computed Origin account for an account on the relay chain, this value would be `1`. If left out, the parents value defaults to `0`

To use the script, you can take the following steps:

1. Clone the [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} repo
2. Run `yarn` to install the necessary packages
3. Run the script

    ```bash
    yarn calculate-multilocation-derivative-account \
    --ws-provider INSERT_RPC_ENDPOINT \
    --address INSERT_ORIGIN_ACCOUNT \
    --para-id INSERT_ORIGIN_PARACHAIN_ID_IF_APPLIES \
    --parents INSERT_PARENTS_VALUE_IF_APPLIES
    ```

You can also calculate the Computed Origin account using the `multilocationToAddress` function of the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=_blank}.

### Calculate the Computed Origin on a Moonbeam-based Network {: #calculate-the-computed-origin-on-moonbeam }

For example, to calculate the Computed Origin on Moonbase Alpha for Alice's relay chain account, which is `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`, you would use the following command to run the script:

```bash
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address 5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT \
--parents 1
```

!!! note
    For Moonbeam or Moonriver, you will need to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.

The returned output includes the following values:

|                    Name                     |                                                                           Value                                                                           |
|:-------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        Origin Chain Encoded Address         |                                                    `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`                                                     |
|        Origin Chain Decoded Address         |                                           `0x3ec5f48ad0567c752275d87787954fef72f557b8bfa5eefc88665fa0beb89a56`                                            |
| Multilocation Received in Destination Chain | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c"}}}}` |
| Computed Origin Account (32 bytes) |                                           `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c`                                            |
| Computed Origin Account (20 bytes) |                                                       `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`                                                        |

Consequently, for this example, Alice's Computed Origin account on Moonbase Alpha is `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`. Note that Alice is the only person who can access this account through a remote transact from the relay chain, as she is the owner of its private keys and the Computed Origin account is keyless.
