---
title: 标准以太坊 JSON-RPC 方法
description: 探索标准以太坊 JSON-RPC 方法的综合列表，这些方法可用于以编程方式与 Moonbeam 节点交互。
categories: JSON-RPC APIs, Reference, Ethereum Toolkit
---

# 支持的以太坊 RPC 方法

## 简介 {: #introduction }

Moonbeam 团队与 [Parity](https://www.parity.io){target=\_blank} 紧密合作，共同开发了 [Frontier](https://polkadot-evm.github.io/frontier/){target=\_blank}，这是一个用于基于 Substrate 链的以太坊兼容层。该层使开发人员能够在 Moonbeam 上无缝运行未经修改的以太坊 dApp。

尽管如此，并非所有以太坊 JSON-RPC 方法都受支持；其中一些受支持的方法会返回默认值（尤其是与以太坊 PoW 共识机制相关的方法）。本指南提供了 Moonbeam 上支持的以太坊 JSON-RPC 方法的完整列表。开发人员可以快速参考此列表，以了解可用于与 Moonbeam 的以太坊兼容区块链交互的功能。

## 标准以太坊 JSON-RPC 方法 {: #basic-rpc-methods }

Moonbeam 支持的以太坊 API 中的基本 JSON-RPC 方法包括：

- **[eth_protocolVersion](https://ethereum.org/developers/docs/apis/json-rpc/#eth_protocolversion){target=\_blank}** — 默认返回 `1`
- **[eth_syncing](https://ethereum.org/developers/docs/apis/json-rpc/#eth_syncing){target=\_blank}** — 返回一个包含同步状态数据的对象，或者 `false`
- **[eth_hashrate](https://ethereum.org/developers/docs/apis/json-rpc/#eth_hashrate){target=\_blank}** — 默认返回 `"0x0"`
- **[eth_coinbase](https://ethereum.org/developers/docs/apis/json-rpc/#eth_coinbase){target=\_blank}** — 返回最新的区块作者。不一定是最终确定的区块
- **[eth_mining](https://ethereum.org/developers/docs/apis/json-rpc/#eth_mining){target=\_blank}** — 默认返回 `false`
- **[eth_chainId](https://ethereum.org/developers/docs/apis/json-rpc/#eth_chainid){target=\_blank}** — 返回用于在当前区块进行签名的链 ID
- **[eth_gasPrice](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gasprice){target=\_blank}** — 返回每单位 gas 使用量的基本费用。目前是每个网络的最低 gas 价格
- **[eth_accounts](https://ethereum.org/developers/docs/apis/json-rpc/#eth_accounts){target=\_blank}** — 返回客户端拥有的地址列表
- **[eth_blockNumber](https://ethereum.org/developers/docs/apis/json-rpc/#eth_blocknumber){target=\_blank}** — 返回可用的最高区块号
- **[eth_getBalance](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getbalance){target=\_blank}** — 返回给定地址的余额。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_getStorageAt](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getstorageat){target=\_blank}** — 返回给定地址的存储内容。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_getBlockByHash](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getblockbyhash){target=\_blank}** — 返回给定哈希的区块信息，包括伦敦升级后的区块的 `baseFeePerGas`
- **[eth_getBlockByNumber](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getblockbynumber){target=\_blank}** — 返回由区块号指定的区块信息，包括伦敦升级后的区块的 `baseFeePerGas`。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为第一个参数
- **[eth_getBlockReceipts](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-get-block-receipts){target=\_blank}** — 返回给定区块的所有交易回执
- **[eth_getTransactionCount](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gettransactioncount){target=\_blank}** — 返回从给定地址发送的交易数量 (nonce)。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_getBlockTransactionCountByHash](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash){target=\_blank}** — 返回具有给定区块哈希的区块中的交易数量
- **[eth_getBlockTransactionCountByNumber](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber){target=\_blank}** — 返回具有给定区块号的区块中的交易数量
- **[eth_getUncleCountByBlockHash](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getunclecountbyblockhash){target=\_blank}** — 默认返回 `"0x0"`
- **[eth_getUncleCountByBlockNumber](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getunclecountbyblocknumber){target=\_blank}** — 默认返回 `"0x0"`
- **[eth_getCode](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getcode){target=\_blank}** — 返回给定区块号处给定地址的代码。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_sendTransaction](https://ethereum.org/developers/docs/apis/json-rpc/#eth_sendtransaction){target=\_blank}** — 创建一个新的消息调用交易或合约创建，如果数据字段包含代码。如果交易尚不可用，则返回交易哈希或零哈希
- **[eth_sendRawTransaction](https://ethereum.org/developers/docs/apis/json-rpc/#eth_sendrawtransaction){target=\_blank}** — 为已签名的交易创建新的消息调用交易或合约创建。如果交易尚不可用，则返回交易哈希或零哈希
- **[eth_call](https://ethereum.org/developers/docs/apis/json-rpc/#eth_call){target=\_blank}** — 立即执行新的消息调用，而不在区块链上创建交易，并返回已执行调用的值
    - Moonbeam 支持使用可选的 _状态覆盖集_ 对象。此地址到状态的映射对象允许用户指定一些状态，以便在执行 `eth_call` 调用之前以临时方式覆盖。状态覆盖集通常用于调试智能合约等任务。请访问 [go-ethereum](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth#:~:text=Object%20%2D%20State%20override%20set){target=\_blank} 文档以了解更多信息
    - 您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_estimateGas](https://ethereum.org/developers/docs/apis/json-rpc/#eth_estimategas){target=\_blank}** — 返回给定交易成功所需的估计 gas 量。您可以选择指定 `gasPrice` 或 `maxFeePerGas` 和 `maxPriorityFeePerGas`。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_maxPriorityFeePerGas](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-max-priority-fee-per-gas){target=\_blank}** - 返回一个估算值，即包含在一个区块中所需的优先费（以 Wei 为单位）
- **[eth_feeHistory](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-fee-history){target=\_blank}** — 返回指定范围内最多 1024 个区块的 `baseFeePerGas`、`gasUsedRatio`、`oldestBlock` 和 `reward`
- **[eth_getTransactionByHash](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gettransactionbyhash){target=\_blank}** — 返回有关具有给定哈希的交易的信息。EIP-1559 交易具有 `maxPriorityFeePerGas` 和 `maxFeePerGas` 字段
- **[eth_getTransactionByBlockHashAndIndex](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gettransactionbyblockhashandindex){target=\_blank}** — 返回有关在给定区块哈希和给定索引位置的交易的信息。EIP-1559 交易具有 `maxPriorityFeePerGas` 和 `maxFeePerGas` 字段
- **[eth_getTransactionByBlockNumberAndIndex](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gettransactionbyblocknumberandindex){target=\_blank}** — 返回有关在给定区块号和给定索引位置的交易的信息。EIP-1559 交易具有 `maxPriorityFeePerGas` 和 `maxFeePerGas` 字段。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_getTransactionReceipt](https://ethereum.org/developers/docs/apis/json-rpc/#eth_gettransactionreceipt){target=\_blank}** — 返回给定交易哈希的交易回执
- **[eth_getUncleByBlockHashAndIndex](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getunclebyblockhashandindex){target=\_blank}** — 默认返回 `null`
- **[eth_getUncleByBlockNumberAndIndex](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getunclebyblocknumberandindex){target=\_blank}** — 默认返回 `null`
- **[eth_getLogs](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getlogs){target=\_blank}** — 返回与给定筛选器对象匹配的所有日志的数组。您可以提供[默认区块参数](#default-block-parameters)来代替提供区块号作为参数
- **[eth_newFilter](https://ethereum.org/developers/docs/apis/json-rpc/#eth_newfilter){target=\_blank}** — 基于提供的输入创建一个筛选器对象。返回筛选器 ID
- **[eth_newBlockFilter](https://ethereum.org/developers/docs/apis/json-rpc/#eth_newblockfilter){target=\_blank}** — 在节点中创建一个筛选器，以便在新区块到达时发出通知。返回筛选器 ID
- **[eth_newPendingTransactionFilter](https://ethereum.org/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter){target=\_blank}** - 在节点中创建一个筛选器，以便在新挂起交易到达时发出通知。返回筛选器 ID
- **[eth_getFilterChanges](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getfilterchanges){target=\_blank}** — 筛选器的轮询方法（参见上述方法）。返回自上次轮询以来发生的日志数组
- **[eth_getFilterLogs](https://ethereum.org/developers/docs/apis/json-rpc/#eth_getfilterlogs){target=\_blank}** — 返回与具有给定 ID 的筛选器匹配的所有日志的数组
- **[eth_uninstallFilter](https://ethereum.org/developers/docs/apis/json-rpc/#eth_uninstallfilter){target=\_blank}** — 卸载具有给定 ID 的筛选器。当不再需要轮询时，应使用此方法。如果一段时间后未使用 `eth_getFilterChanges` 请求筛选器，则筛选器将超时

## 默认区块参数 {: #default-block-parameters }

Moonbeam支持多个默认区块参数，允许您在重要的区块高度查询JSON-RPC方法的一个子集。Moonbeam支持以下默认区块参数：

- `finalized` - 指的是Polkadot验证者已最终确定的最新区块
- `safe` - 在Moonbeam中与`finalized`同义。在以太坊中，`safe`指的是网络认为安全的最新区块，这意味着它不太可能被回滚，但尚未最终确定。凭借Moonbeam快速且确定性的最终性，`finalized`和`safe`指的是相同的区块。
- `earliest` - 指的是区块链的创世区块
- `pending` - 代表最新状态，包括尚未被挖掘到区块中的待处理交易。这是内存池的实时视图
- `latest` - 指的是区块链中最新确认的区块，该区块可能尚未最终确定

## 不支持的以太坊 JSON-RPC 方法 {: #unsupported-rpc-methods }

Moonbeam 不支持以下以太坊 API JSON-RPC 方法：

 - **[eth_getProof](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-get-proof){target=\_blank}** - 返回指定账户的账户和存储值，包括 Merkle 证明
 - **[eth_blobBaseFee](https://www.quicknode.com/docs/ethereum/eth_blobBaseFee){target=\_blank}** - 返回下一个区块中 blob 的预期基础费用
 - **[eth_createAccessList](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-create-access-list){target=\_blank}** - 基于给定的交易对象创建一个 EIP-2930 类型的 `accessList`
 - **[eth_sign](https://ethereum.org/developers/docs/apis/json-rpc/#eth_sign){target=\_blank}** - 允许用户签署一个任意哈希，以便稍后发送。存在[安全风险](https://support.metamask.io/privacy-and-security/what-is-eth_sign-and-why-is-it-a-risk/){target=\_blank}，因为任意哈希可能被欺诈性地应用于其他交易
 - **[eth_signTransaction](https://ethereum.org/developers/docs/apis/json-rpc/#eth_signtransaction){target=\_blank}** - 允许用户签署一个交易，以便稍后发送。由于相关的安全风险，它很少被使用
## 附加 RPC 方法 {: #additional-rpc-methods }

查看一些非标准的以太坊和 Moonbeam 特定的 RPC 方法：

- [调试和追踪](builders/ethereum/json-rpc/debug-trace/)
- [事件订阅](builders/ethereum/json-rpc/pubsub/)
- [自定义 Moonbeam](builders/ethereum/json-rpc/moonbeam-custom-api/)
