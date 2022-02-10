---
title: Canonical Contracts
description: A brief overview of the canonical contracts available on Moonbeam, Moonriver, and Moonbase Alpha. It includes some common-goods contract as well as some precompiles.
---

# Canonical Contracts

![Canonical contracts banner](/images/builders/interact/canonical-contracts/canonical-contracts-banner.png)

## Common-goods Contracts

The following contracts addresses have been established:

=== "Moonbeam"
    |                                               Contract                                                |                  Address                   |
    |:-----------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |   [WGLMR](https://blockscout.moonbeam.network/address/0xAcc15dC74880C9944775448304B263D191c6077F/)    | 0xAcc15dC74880C9944775448304B263D191c6077F |
    | [Multicall](https://blockscout.moonbeam.network/address/0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B/)  | 0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B |
    | [Multicall2](https://blockscout.moonbeam.network/address/0x6477204E12A7236b9619385ea453F370aD897bb2/) | 0x6477204E12A7236b9619385ea453F370aD897bb2 |
    |                          [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                          | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

=== "Moonriver"
    |                                               Contract                                                |                  Address                   |
    |:-----------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |      [WMOVR](https://moonriver.moonscan.io/address/0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d/)       | 0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d |
    |    [Multicall](https://moonriver.moonscan.io/address/0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5/)*    | 0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5 |
    |    [Multicall2](https://moonriver.moonscan.io/address/0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3/)    | 0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3 |
    | [Multisig Factory](https://moonriver.moonscan.io/address/0x4e59b44847b379578588920cA78FbF26c0B4956C/) | 0x4e59b44847b379578588920cA78FbF26c0B4956C |
    |                          [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                          | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

    _*Deployed by SushiSwap_

=== "Moonbase Alpha"
    |                                                           Contract                                                           |                  Address                   |
    |:----------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |       [WDEV](https://moonbase-blockscout.testnet.moonbeam.network/address/0xD909178CC99d318e4D46e7E66a972955859670E1/)       | 0xD909178CC99d318e4D46e7E66a972955859670E1 |
    |    [Multicall](https://moonbase-blockscout.testnet.moonbeam.network/address/0x4E2cfca20580747AdBA58cd677A998f8B261Fc21/)*    | 0x4E2cfca20580747AdBA58cd677A998f8B261Fc21 |
    | [Multisig Factory](https://moonbase-blockscout.testnet.moonbeam.network/address/0x4e59b44847b379578588920cA78FbF26c0B4956C/) | 0x4e59b44847b379578588920cA78FbF26c0B4956C |
    |                                     [EIP 1820](https://eips.ethereum.org/EIPS/eip-1820)                                      | 0x1820a4b7618bde71dce8cdc73aab6c95905fad24 |

    _*Deployed in the [UniswapV2 Demo Repo](https://github.com/PureStake/moonbeam-uniswap/tree/main/uniswap-contracts-moonbeam)_

## Precompiled Contracts

There are a set of precompiled contracts included on Moonbeam, Moonriver, and Moonbase Alpha that are categorized by address and based on the origin network. If you were to convert the precompiled addresses to decimal format, and break them into categories by numeric value, the categories are as follows:

- **0-1023** - [Ethereum MainNet precompiles](#ethereum-mainnet-precompiles)
- **1024-2047** - precompiles that are [not in Ethereum and not Moonbeam specific](#non-moonbeam-specific-nor-ethereum-precomiles)
- **2048-4095** - [Moonbeam specific precompiles](#moonbeam-specific-precompiles)

### Ethereum MainNet Precompiles

|                                                      Contract                                                       |                  Address                   |
|:-------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|               [ECRECOVER](/builders/tools/precompiles/eth-mainnet/#verify-signatures-with-ecrecover/)               | 0x0000000000000000000000000000000000000001 |
|                       [SHA256](/builders/tools/precompiles/eth-mainnet/#hashing-with-sha256/)                       | 0x0000000000000000000000000000000000000002 |
|                   [RIPEMD160](/builders/tools/precompiles/eth-mainnet/#hashing-with-ripemd-160/)                    | 0x0000000000000000000000000000000000000003 |
|                     [Identity](/builders/tools/precompiles/eth-mainnet/#the-identity-function/)                     | 0x0000000000000000000000000000000000000004 |
|             [Modular Exponentiation](/builders/tools/precompiles/eth-mainnet/#modular-exponentiation/)              | 0x0000000000000000000000000000000000000005 |
|     [Bn128Add](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Add.html)     | 0x0000000000000000000000000000000000000006 |
|     [Bn128Mul](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Mul.html)     | 0x0000000000000000000000000000000000000007 |
| [Bn128Pairing](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/struct.Bn128Pairing.html) | 0x0000000000000000000000000000000000000008 |

### Non-Moonbeam Specific nor Ethereum Precompiles

|                                                             Contract                                                             |                  Address                   |
|:--------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
|       [Sha3FIPS256](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html)       | 0x0000000000000000000000000000000000000400 |
|          [Dispatch](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html)          | 0x0000000000000000000000000000000000000401 |
| [ECRecoverPublicKey](https://paritytech.github.io/frontier/rustdocs/pallet_evm_precompile_simple/struct.ECRecoverPublicKey.html) | 0x0000000000000000000000000000000000000402 |

### Moonbeam-Specific Precompiles

|                                                          Contract                                                           |                   Address                    |
|:---------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------:|
|  [Parachain Staking](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)  |  {{networks.moonbase.precompiles.staking}}   |
| [Crowdloan Rewards](https://github.com/PureStake/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol) | {{networks.moonbase.precompiles.crowdloan }} |
|         [ERC-20 Interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol)          |   {{networks.moonbase.precompiles.erc20 }}   |

!!! note
    The ERC-20 Interface is currently only available on Moonriver and Moonbase Alpha.

--8<-- 'text/disclaimers/third-party-content.md'