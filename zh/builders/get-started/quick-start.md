---
title: 快速入门
description: 您需要了解的所有信息，以便开始在 Moonbeam 上开发、部署智能合约并与之交互。
categories: 基础知识
---

# 在 Moonbeam 上开发的快速入门指南

## 快速概览 {: #overview }

Moonbeam 是一个在 Polkadot 上的完全兼容以太坊的智能合约平台。因此，您可以通过 [Ethereum API](/builders/ethereum/){target=_blank} 和 [Substrate API](/builders/substrate/){target=_blank} 与 Moonbeam 进行交互。

虽然 Moonbeam 是一个基于 Substrate 的平台，但它使用 [统一账户](/learn/core-concepts/unified-accounts/){target=_blank} 系统，该系统用以太坊样式的账户和密钥替换了 Substrate 样式的账户和密钥。因此，您可以通过简单地添加 Moonbeam 的网络配置，使用 [MetaMask](/tokens/connect/metamask/){target=_blank}、[Ledger](/tokens/connect/ledger/){target=_blank} 和其他兼容以太坊的钱包与您的 Moonbeam 帐户进行交互。同样，您可以使用以太坊 [库](/builders/ethereum/libraries/){target=_blank} 和 [开发环境](/builders/ethereum/dev-env/){target=_blank} 在 Moonbeam 上进行开发。

## Moonbeam 网络 {: #moonbeam-networks }

要开始在 Moonbeam 上进行开发，请务必了解 Moonbeam 生态系统中的各种网络。

|                                          网络                                          | 网络类型  |                                   中继链                                    | 原生资产符号 | 原生资产小数位数 |
|:-----------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------:|:-------------------:|:---------------------:|
|           [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}            |    主网    |                 [Polkadot](https://polkadot.com){target=_blank}                 |        GLMR         |          18           |
|          [Moonriver](/builders/get-started/networks/moonriver/){target=_blank}           |    主网    |                 [Kusama](https://kusama.network){target=_blank}                 |        MOVR         |          18           |
|        [Moonbase Alpha](/builders/get-started/networks/moonbase/){target=_blank}         |    测试网    |                           Alphanet 中继（基于 Westend）                         |         DEV         |          18           |
| [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank} | 本地测试网 |                                       无                                       |         DEV         |          18           |

!!! note
    Moonbeam 开发节点没有中继链，因为它的目的是您自己的个人开发环境，您可以在其中快速开始开发，而无需中继链的开销。

### 网络配置 {: #network-configurations }

当使用开发者工具时，根据工具的不同，您可能需要配置 Moonbeam 以与网络进行交互。为此，您可以使用以下信息：

===

    |    变量     |                                                 值                                                  |
    |:---------------:|:------------------------------------------------------------------------------------------------------:|
    |    链 ID     |                           <pre>```{{ networks.moonbeam.chain_id }}```</pre>                            |
    | 公共 RPC URL | <pre>```https://rpc.api.moonbeam.network```</pre>  <pre>```https://moonbeam.unitedbloc.com```</pre> |
    | 公共 WSS URL |                           <pre>```wss://wss.api.moonbeam.network```</pre>                           |

===

    |    变量     |                                                  值                                                   |
    |:---------------:|:--------------------------------------------------------------------------------------------------------:|
    |    链 ID     |                            <pre>```{{ networks.moonriver.chain_id }}```</pre>                            |
    | 公共 RPC URL | <pre>```https://rpc.api.moonriver.moonbeam.network```</pre>  <pre>```https://moonriver.unitedbloc.com```</pre> |
    | 公共 WSS URL |                           <pre>```wss://wss.api.moonriver.moonbeam.network```</pre>                            |

===

    |    变量     |                                                    值                                                    |
    |:---------------:|:-----------------------------------------------------------------------------------------------------------:|
    |    链 ID     |                              <pre>```{{ networks.moonbase.chain_id }}```</pre>                              |
    | 公共 RPC URL | <pre>```{{ networks.moonbase.rpc_url }}```</pre> |
    | 公共 WSS URL |  <pre>```{{ networks.moonbase.wss_url }}```</pre>  |

===

    |   变量    |                        值                         |
    |:-------------:|:----------------------------------------------------:|
    |   链 ID    | <pre>```{{ networks.development.chain_id }}```</pre> |
    | 本地 RPC URL | <pre>```{{ networks.development.rpc_url }}```</pre>  |
    | 本地 WSS URL | <pre>```{{ networks.development.wss_url }}```</pre>  |

!!! note
    您可以从[支持的 RPC 提供商](/builders/get-started/endpoints/#endpoint-providers){target=_blank}之一创建适合开发或生产的您自己的端点。

### 区块浏览器 {: #explorers }

Moonbeam 提供了两种不同的浏览器：一种用于查询以太坊 API，另一种专用于 Substrate API。所有基于 EVM 的交易都可以通过以太坊 API 访问，而 Substrate API 可以依赖于 Substrate 原生功能，例如治理、质押以及有关基于 EVM 的交易的一些信息。有关每个浏览器的更多信息，请查看[区块浏览器](/builders/get-started/explorers/){target=\_blank}页面。

--8<-- 'text/builders/get-started/explorers/explorers.md'

## 为测试网账户充值 {: #testnet-tokens }

要开始在其中一个测试网上进行开发，您需要使用 DEV 代币为您的账户充值才能发送交易。请注意，DEV 代币没有任何实际价值，仅用于测试目的。

|                                           测试网                                           |                                                                            从哪里获取代币                                                                            |
|:------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|         [Moonbase Alpha](/builders/get-started/networks/moonbase/){target=\_blank}          | [Moonbase Alpha 水龙头](https://faucet.moonbeam.network){target=\_blank} 网站。<br> 该水龙头每 24 小时分配 {{ networks.moonbase.website_faucet_amount }} |
|  [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}  | 任何[十个预先注资的账户](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=\_blank}，这些账户都随您的 <br> 开发节点一起提供 |

## 开发工具 {: #development-tools }

由于 Moonbeam 是一个基于 Substrate 的链，并且完全兼容以太坊，因此您可以使用基于 Substrate 的工具和基于以太坊的工具。

### JavaScript 工具 {: #javascript }

===

    |                                   工具                                    |      类型       |
    |:------------------------------------------------------------------------:|:---------------:|
    |   [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank}    |     库     |
    |      [Hardhat](/builders/ethereum/dev-env/hardhat/){target=_blank}      | 开发环境 |
    |        [Remix](/builders/ethereum/dev-env/remix/){target=_blank}        | 开发环境 |

===

    |                                       工具                                         |  类型   |
    |:---------------------------------------------------------------------------------:|:-------:|
    | [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} | 库 |

### Python工具 {: #python }

=== "Ethereum"

    |                              工具                               |	     类型       |
    |:---------------------------------------------------------------:|:---------------:|
    | [Web3.py](/builders/ethereum/libraries/web3py/){target=\_blank} |     库     |

=== "Substrate"

    |                                              工具                                               |  类型   |
    |:-----------------------------------------------------------------------------------------------:|:-------:|
    | [Py Substrate Interface](/builders/substrate/libraries/py-substrate-interface/){target=\_blank} | 库 |
