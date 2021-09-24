---
title: Canonical Contracts
description: A brief overview of the canonical contracts available on Moonriver.
---

# Canonical Contracts

![Staking Moonbeam Banner](/images/canonical-contracts/canonical-contracts-banner.png)

## Canonical Contract Addresses on Moonriver

The following canonical contract addresses have been established:

|                                                                Contract                                                                |                   Address                  |
|:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|         [WMOVR](https://blockscout.moonriver.moonbeam.network/address/0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d/transactions)         | 0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d |
| [Multicall (SushiSwap)](https://blockscout.moonriver.moonbeam.network/address/0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5/transactions) | 0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5 |
|  [Gnosis Safe Factory](https://blockscout.moonriver.moonbeam.network/address/0x4e59b44847b379578588920cA78FbF26c0B4956C/transactions)  | 0x4e59b44847b379578588920cA78FbF26c0B4956C |

There are also a set of precompiles included on Moonriver. Precompiles with addresses that, if converted to decimal format, fall within the range of 0-1023 are [Ethereum Mainnet precompiles](#ethereum-mainnet-precompiles). Those that fall within the range of 1024-2047 are precompiles that are [not in Ethereum and not Moonbeam specific](#non-moonbeam-specific-nor-ethereum-precomiles). Lastly, those that fall within the range of 2048-4095 are [Moonbeam specific precompiles](#moonbeam-specific-precompiles).

### Ethereum Mainnet Precompiles

|                                                                Contract                                                                |                   Address                  |
|:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|                               [ECRECOVER](/builders/tools/precompiles/#verify-signatures-with-ecrecover/)                              | 0x0000000000000000000000000000000000000001 |
|                                       [SHA256](/builders/tools/precompiles/#hashing-with-sha256/)                                      | 0x0000000000000000000000000000000000000002 |
|                                   [RIPEMD160](/builders/tools/precompiles/#hashing-with-ripemd-160/)                                   | 0x0000000000000000000000000000000000000003 |
|                                     [Identity](/builders/tools/precompiles/#the-identity-function/)                                    | 0x0000000000000000000000000000000000000004 |
|                             [Modular Exponentiation](/builders/tools/precompiles/#modular-exponentiation/)                             | 0x0000000000000000000000000000000000000005 |
|               [Bn128Add](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Add.html)              | 0x0000000000000000000000000000000000000006 |
|               [Bn128Mul](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Mul.html)              | 0x0000000000000000000000000000000000000007 |
|           [Bn128Pairing](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Pairing.html)          | 0x0000000000000000000000000000000000000008 |

### Non-Moonbeam Specific nor Ethereum Precompiles

|                                                                Contract                                                                |                   Address                  |
|:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|          [Sha3FIPS256](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html)          | 0x0000000000000000000000000000000000000400 |
|             [Dispatch](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html)             | 0x0000000000000000000000000000000000000401 |
|    [ECRecoverPublicKey](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/struct.ECRecoverPublicKey.html)    | 0x0000000000000000000000000000000000000402 |

### Moonbeam-Specific Precompiles

|                                                                Contract                                                                |                   Address                  |
|:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|        [Parachain Staking](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)       | 0x0000000000000000000000000000000000000800 |
|       [Crowdloan Rewards](https://github.com/PureStake/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol)      | 0x0000000000000000000000000000000000000801 |
