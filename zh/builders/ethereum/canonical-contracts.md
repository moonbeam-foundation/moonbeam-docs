---
title: Moonbeam 上的规范合约地址
description: 概述 Moonbeam、Moonriver 和 Moonbase Alpha 上可用的规范合约，包括通用合约和预编译合约。
keywords: canonical, ethereum, moonbeam, precompiled, contracts
categories: Reference, Precompiles, Ethereum Toolkit
---

# 规范合约

## 公共利益合约 {: #common-goods-contracts }

已建立以下合约地址：

=== "Moonbeam"

    |                                                         合约                                                         |                  地址                   |
    |:------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |      [WGLMR](https://moonbeam.moonscan.io/address/0xAcc15dC74880C9944775448304B263D191c6077F#code){target=\_blank}       | 0xAcc15dC74880C9944775448304B263D191c6077F |
    |    [Multicall](https://moonbeam.moonscan.io/address/0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B#code){target=\_blank}     | 0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B |
    |    [Multicall2](https://moonbeam.moonscan.io/address/0x6477204E12A7236b9619385ea453F370aD897bb2#code){target=\_blank}    | 0x6477204E12A7236b9619385ea453F370aD897bb2 |
    |    [Multicall3](https://moonbeam.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code){target=\_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonbeam.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=\_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                           [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=\_blank}                            | 0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24 |

=== "Moonriver"

    |                                                         合约                                                          |                  地址                   |
    |:-------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |       [WMOVR](https://moonriver.moonscan.io/token/0x98878b06940ae243284ca214f92bb71a2b032b8a#code){target=\_blank}        | 0x98878B06940aE243284CA214f92Bb71a2b032B8A |
    |    [Multicall](https://moonriver.moonscan.io/address/0x30f283Cc0284482e9c29dFB143bd483B5C19954b#code){target=\_blank}*    | 0x30f283Cc0284482e9c29dFB143bd483B5C19954b |
    |    [Multicall2](https://moonriver.moonscan.io/address/0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3#code){target=\_blank}    | 0xaef00a0cf402d9dedd54092d9ca179be6f9e5ce3 |
    |    [Multicall3](https://moonriver.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code){target=\_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonriver.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=\_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                            [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=\_blank}                            | 0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24 |

    _*由 SushiSwap 部署_

=== "Moonbase Alpha"

    |                                                         合约                                                         |                  地址                   |
    |:------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------:|
    |       [WDEV](https://moonbase.moonscan.io/address/0xD909178CC99d318e4D46e7E66a972955859670E1#code){target=\_blank}       | 0xD909178CC99d318e4D46e7E66a972955859670E1 |
    |    [Multicall](https://moonbase.moonscan.io/address/0x4E2cfca20580747AdBA58cd677A998f8B261Fc21#code){target=\_blank}*    | 0x4E2cfca20580747AdBA58cd677A998f8B261Fc21 |
    |    [Multicall2](https://moonbase.moonscan.io/address/0x37084d0158C68128d6Bc3E5db537Be996f7B6979#code){target=\_blank}    | 0x37084d0158C68128d6Bc3E5db537Be996f7B6979 |
    |    [Multicall3](https://moonbase.moonscan.io/address/0xca11bde05977b3631167028862be2a173976ca11#code){target=\_blank}    | 0xcA11bde05977b3631167028862bE2a173976CA11 |
    | [Multisig Factory](https://moonbase.moonscan.io/address/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2#code){target=\_blank} | 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 |
    |                           [EIP-1820](https://eips.ethereum.org/EIPS/eip-1820){target=\_blank}                            | 0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24 |

    _*部署在 [UniswapV2 Demo Repo](https://github.com/papermoonio/moonbeam-uniswap/tree/main/uniswap-contracts-moonbeam){target=\_blank} 中_

## 预编译合约 {: #precompiled-contracts }

Moonbeam、Moonriver 和 Moonbase Alpha 上包含一组预编译合约，这些合约按地址分类并基于原始网络。如果您要将预编译地址转换为十进制格式，并按数值将它们分为几类，则这些类别如下：

- **0-1023** - [以太坊主网预编译](#ethereum-mainnet-precompiles)
- **1024-2047** - [不在以太坊中且不是 Moonbeam 特定的](#non-moonbeam-specific-nor-ethereum-precomiles)预编译
- **2048-4095** - [Moonbeam 特定的预编译](#moonbeam-specific-precompiles)

--8<-- 'zh/text/builders/ethereum/canonical-contracts/eth-mainnet.md'

--8<-- 'zh/text/builders/ethereum/canonical-contracts/non-specific.md'

### Moonbeam特定预编译 {: #moonbeam-specific-precompiles }

=== "Moonbeam"
    |                                                                           合约                                                                            |                               地址                               |
    |:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
    |      [平行链质押](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank}      |              {{networks.moonbeam.precompiles.staking}}              |
    |             [ERC-20 接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank}              |               {{networks.moonbeam.precompiles.erc20}}               |
    |                                                                      民主 [已移除]                                                                      |             {{networks.moonbeam.precompiles.democracy}}             |
    |                    [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=\_blank}                    |              {{networks.moonbeam.precompiles.xtokens}}              |
    |            [中继编码器](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=\_blank}            |           {{networks.moonbeam.precompiles.relay_encoder}}           |
    |    [XCM 交易器 V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=\_blank}     |         {{networks.moonbeam.precompiles.xcm_transactor_v1}}         |
    |      [作者映射](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank}      |          {{networks.moonbeam.precompiles.author_mapping}}           |
    |                       [批量处理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=\_blank}                        |               {{networks.moonbeam.precompiles.batch}}               |
    |                [随机性](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank}                |            {{networks.moonbeam.precompiles.randomness}}             |
    |               [调用许可](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank}               |            {{networks.moonbeam.precompiles.call_permit}}            |
    |                       [代理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=\_blank}                        |               {{networks.moonbeam.precompiles.proxy}}               |
    |                [XCM 实用程序](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=\_blank}                |             {{networks.moonbeam.precompiles.xcm_utils}}             |
    |    [XCM 交易器 V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=\_blank}     |         {{networks.moonbeam.precompiles.xcm_transactor_v2}}         |
    |       [理事会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}       |        {{networks.moonbeam.precompiles.collective_council}}         |
    | [技术委员会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank} |     {{networks.moonbeam.precompiles.collective_tech_committee}}     |
    |       [财务委员会集体](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}        |        {{networks.moonbeam.precompiles.collective_treasury}}        |
    |                 [公民投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank}                  |             {{networks.moonbeam.precompiles.referenda}}             |
    |      [确信投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}      |         {{networks.moonbeam.precompiles.conviction_voting}}         |
    |                   [预映像](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank}                   |             {{networks.moonbeam.precompiles.preimage}}              |
    |          [OpenGov 技术委员会](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}          | {{networks.moonbeam.precompiles.collective_opengov_tech_committee}} |
    |   [预编译注册表](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}   |             {{networks.moonbeam.precompiles.registry}}              |
    |                          [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=\_blank}                           |                {{networks.moonbeam.precompiles.gmp}}                |
    |    [XCM 交易器 V3](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v3/XcmTransactorV3.sol){target=\_blank}     |         {{networks.moonbeam.precompiles.xcm_transactor_v3}}         |
    |                   [身份](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=\_blank}                   |             {{networks.moonbeam.precompiles.identity}}              |
    |                  [XCM 接口](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank}                  |           {{networks.moonbeam.precompiles.xcm_interface}}           |

=== "Moonriver"
    |                                                                           合约                                                                            |                               地址                                |
    |:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |      [平行链质押](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank}      |              {{networks.moonriver.precompiles.staking}}              |
    |             [ERC-20 接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank}              |               {{networks.moonriver.precompiles.erc20}}               |
    |                                                                      民主 [已移除]                                                                      |             {{networks.moonriver.precompiles.democracy}}             |
    |                    [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=\_blank}                    |              {{networks.moonriver.precompiles.xtokens}}              |
    |            [中继编码器](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=\_blank}            |           {{networks.moonriver.precompiles.relay_encoder}}           |
    |    [XCM 交易器 V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=\_blank}     |         {{networks.moonriver.precompiles.xcm_transactor_v1}}         |
    |      [作者映射](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank}      |          {{networks.moonriver.precompiles.author_mapping}}           |
    |                       [批量处理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=\_blank}                        |               {{networks.moonriver.precompiles.batch}}               |
    |                [随机性](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank}                |            {{networks.moonriver.precompiles.randomness}}             |
    |               [调用许可](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank}               |            {{networks.moonriver.precompiles.call_permit}}            |
    |                       [代理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=\_blank}                        |               {{networks.moonriver.precompiles.proxy}}               |
    |                [XCM 实用程序](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=\_blank}                |             {{networks.moonriver.precompiles.xcm_utils}}             |
    |    [XCM 交易器 V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=\_blank}     |         {{networks.moonriver.precompiles.xcm_transactor_v2}}         |
    |       [理事会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}       |        {{networks.moonriver.precompiles.collective_council}}         |
    | [技术委员会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank} |     {{networks.moonriver.precompiles.collective_tech_committee}}     |
    |       [财务委员会集体](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}        |        {{networks.moonriver.precompiles.collective_treasury}}        |
    |                 [公民投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank}                  |             {{networks.moonriver.precompiles.referenda}}             |
    |      [确信投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}      |         {{networks.moonriver.precompiles.conviction_voting}}         |
    |                   [预映像](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank}                   |             {{networks.moonriver.precompiles.preimage}}              |
    |          [OpenGov 技术委员会](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}          | {{networks.moonriver.precompiles.collective_opengov_tech_committee}} |
    |   [预编译注册表](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}   |             {{networks.moonriver.precompiles.registry}}              |
    |                          [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=\_blank}                           |                {{networks.moonriver.precompiles.gmp}}                |
    |    [XCM 交易器 V3](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v3/XcmTransactorV3.sol){target=\_blank}     |         {{networks.moonriver.precompiles.xcm_transactor_v3}}         |
    |                   [身份](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=\_blank}                   |             {{networks.moonriver.precompiles.identity}}              |
    |                  [XCM 接口](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank}                  |           {{networks.moonriver.precompiles.xcm_interface}}           |

=== "Moonbase Alpha"
    |                                                                           合约                                                                            |                               地址                               |
    |:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
    |      [平行链质押](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank}      |              {{networks.moonbase.precompiles.staking}}              |
    |             [ERC-20 接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank}              |               {{networks.moonbase.precompiles.erc20}}               |
    |                                                                      民主 [已移除]                                                                      |             {{networks.moonbase.precompiles.democracy}}             |
    |                    [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=\_blank}                    |              {{networks.moonbase.precompiles.xtokens}}              |
    |            [中继编码器](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=\_blank}            |           {{networks.moonbase.precompiles.relay_encoder}}           |
    |    [XCM 交易器 V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=\_blank}     |         {{networks.moonbase.precompiles.xcm_transactor_v1}}         |
    |      [作者映射](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank}      |          {{networks.moonbase.precompiles.author_mapping}}           |
    |                       [批量处理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=\_blank}                        |               {{networks.moonbase.precompiles.batch}}               |
    |                [随机性](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank}                |            {{networks.moonbase.precompiles.randomness}}             |
    |               [调用许可](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank}               |            {{networks.moonbase.precompiles.call_permit}}            |
    |                       [代理](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=\_blank}                        |               {{networks.moonbase.precompiles.proxy}}               |
    |                [XCM 实用程序](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=\_blank}                |             {{networks.moonbase.precompiles.xcm_utils}}             |
    |    [XCM 交易器 V2](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=\_blank}     |         {{networks.moonbase.precompiles.xcm_transactor_v2}}         |
    |       [理事会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}       |        {{networks.moonbase.precompiles.collective_council}}         |
    | [技术委员会集体 [已移除]](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank} |     {{networks.moonbase.precompiles.collective_tech_committee}}     |
    |       [财务委员会集体](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}        |        {{networks.moonbase.precompiles.collective_treasury}}        |
    |                 [公民投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank}                  |             {{networks.moonbase.precompiles.referenda}}             |
    |      [确信投票](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank}      |         {{networks.moonbase.precompiles.conviction_voting}}         |
    |                   [预映像](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank}                   |             {{networks.moonbase.precompiles.preimage}}              |
    |          [OpenGov 技术委员会](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank}          | {{networks.moonbase.precompiles.collective_opengov_tech_committee}} |
    |   [预编译注册表](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}   |             {{networks.moonbase.precompiles.registry}}              |
    |                          [GMP](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=\_blank}                           |                {{networks.moonbase.precompiles.gmp}}                |
    |    [XCM 交易器 V3](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v3/XcmTransactorV3.sol){target=\_blank}     |         {{networks.moonbase.precompiles.xcm_transactor_v3}}         |
    |                   [身份](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=\_blank}                   |             {{networks.moonbase.precompiles.identity}}              |
    |                  [XCM 接口](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=\_blank}                  |           {{networks.moonbase.precompiles.xcm_interface}}           |
