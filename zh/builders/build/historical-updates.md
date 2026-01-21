---
title: 历史更新
description: Moonbeam 和 Moonriver 中的历史更新概述，例如应用于 Moonbeam 源代码的迁移和错误修复。
categories: Reference
---

# 历史更新

## 简介 {: #introduction }

本页面概述了 Moonbeam 和 Moonriver 上的历史更新，例如 Moonbeam 源代码的错误修复和应用的数据迁移。

本页面旨在提供与需要强制数据迁移的更新相关的意外行为或数据不一致的信息。

## Bugs {: #bugs }

#### 存储的无效交易 {: #invalid-transactions-stored }

对于交易成本无法支付的无效交易，EVM pallet 将交易元数据插入到存储中，而不是丢弃它，因为没有交易成本验证。因此，运行时存储不必要地因无效交易数据而膨胀。

此错误仅影响 Moonriver 和 Moonbase Alpha，并且存在于以下运行时和区块范围内：

|    网络     | 引入 | 修复 | 受影响的区块范围 |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT600 |      0 - 455106      |
| Moonbase Alpha |    RT40    | RT600 |      0 - 675175      |

有关更多信息，您可以查看 [GitHub 上的相关 Frontier PR](https://github.com/polkadot-evm/frontier/pull/465){target=\_blank}。

---

#### 以太坊费用未发送至国库 {: #ethereum-fees-to-treasury }

在 Runtime 3401 之前和[MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=\_blank} 通过之前，Moonbeam 交易费用模型规定将 20% 的费用分配给链上国库，80% 作为通货紧缩力量销毁。但是，在 runtime 800 之前，以太坊交易未正确地将 20% 的交易费用分配给链上国库。

此错误仅影响 Moonriver 和 Moonbase Alpha，并存在于以下运行时和区块范围中：

|    网络     | 引入 | 修复 | 受影响的区块范围 |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT800 |      0 - 684728      |
| Moonbase Alpha |    RT40    | RT800 |      0 - 915684      |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/732){target=_blank}。

---

#### 缺少退款 {: #missing-refunds }

Moonbeam 配置为将存在性存款设置为 0，这意味着帐户不需要最低余额即可被视为有效。对于具有此配置的基于 Substrate 的链，由于帐户被解释为不存在，因此某些清除帐户的退款丢失了。

此错误存在于以下运行时和区块范围：

|    网络     | 引入 | 修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1001 |       0 - 5164       |
|   Moonriver    |    RT49    | RT1001 |     0 - 1052241      |
| Moonbase Alpha |    RT40    | RT1001 |     0 - 1285915      |

有关更多信息，您可以查看[相关的 Frontier PR](https://github.com/polkadot-evm/frontier/pull/509){target=\_blank}和 GitHub 上的[相关 Substrate PR](https://github.com/paritytech/substrate/issues/10117){target=_blank}。

---

#### 不正确的整理人选择 {: #incorrect-collator-selection }

当通过 `delegatorBondMore` extrinsic 增加委托时，整理人候选人的总委托未正确更新。这导致增加的委托金额未包含在候选人的总绑定金额中，而总绑定金额用于确定哪些候选人在整理人的活动集中。因此，一些候选人可能未被选择进入活动集中，尽管他们本应被选中，这影响了他们自己及其委托人的奖励。

此错误存在于以下运行时和区块范围中：

|    网络     | 引入 | 修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1300 |      0 - 524762      |
|   Moonriver    |    RT49    | RT1300 |     0 - 1541735      |
| Moonbase Alpha |    RT40    | RT1300 |     0 - 1761128      |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=\_blank}。

---

#### 新账户事件错误 {: #new-account-event }

当创建新账户时，会发出 `System.NewAccount` 事件。但是，一个错误阻止了在创建时为某些账户发出此事件。应用了一个热修复程序，该程序修补了受影响的帐户，并在稍后发出了 `System.NewAccount`。

该热修复程序应用于以下区块范围：

|    网络     |                                                              区块范围                                                              |
|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    | [1041355 - 1041358 和 1100752](https://moonbeam.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=\_blank} |
|   Moonriver    |      [1835760 - 1835769](https://moonriver.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=\_blank}       |
| Moonbase Alpha |  [2097782 - 2097974](https://moonbase.subscan.io/extrinsic?address=&module=evm&call=hotfix_inc_account_sufficients){target=\_blank}   |

此错误存在于以下运行时和区块范围期间：

|    网络     | 引入 | 修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1401 |      0 - 915320      |
|   Moonriver    |    RT49    | RT1401 |     0 - 1705939      |
| Moonbase Alpha |    RT40    | RT1400 |     0 - 1962557      |

有关更多信息，您可以查看 [GitHub 上的相关 Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/46/files){target=\_blank}。

---

#### 不正确的时间戳单位 {: #incorrect-timestamp-units }

EIP-2612 和以太坊区块处理的时间戳以秒为单位；但是，Moonbeam 实现的 Substrate 时间戳 pallet 使用的是毫秒。这只影响了 EIP-2612 的实现，而没有影响 `block.timestamp` 值。

以下运行时和区块范围存在此错误：

|    网络     | 引入 | 已修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1606 |     0 - 1326697      |
|   Moonriver    |    RT49    | RT1605 |     0 - 2077598      |
| Moonbase Alpha |    RT40    | RT1603 |     0 - 2285346      |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1451){target=\_blank}。

---

#### Substrate 小费缺失 Treasury 分配 {: #substrate-tips }

基于 Substrate 的交易的小费没有得到正确的处理。因为小费没有在运行时代码中处理，导致整个小费部分都被销毁了。我们应用了一个修复方案，将 20% 的小费支付给 Treasury，80% 的小费被销毁，这与当时所有其他的费用行为一致。

请注意，RT3401 引入了一个参数 pallet 费用配置，允许治理调整费用在 Treasury 和销毁之间的分配方式。在该运行时升级与 [MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=\_blank} 通过后，Moonbeam 和 Moonriver 上的所有交易费用现在 100% 都会被销毁。

此错误存在于以下运行时和区块范围中：

|    网络     | 引入版本 | 修复版本  | 影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT2403 |     0 - 4163078      |
|   Moonriver    |    RT49    | RT2401 |     0 - 4668844      |
| Moonbase Alpha |    RT40    | RT2401 |     0 - 4591616      |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2291){target=\_blank}。

---

#### 错误的委托奖励计算 {: #incorrect-delegation-reward-calculation }

每当有待处理的请求时，所有委托和整理者的奖励支出都被低估了。委托奖励是根据每个委托者绑定的代币数量与给定整理者的总股权相关的。通过计算待处理请求的委托数量，整理者及其委托的奖励低于应有的水平。

此错误存在于以下运行时和区块范围内：

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1001   | RT1802 |    5165 - 1919457    |
|   Moonriver    |   RT1001   | RT1801 |  1052242 - 2572555   |
| Moonbase Alpha |   RT1001   | RT1800 |  1285916 - 2748785   |

您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1719){target=\_blank} 以获取更多信息。

---

#### 区块父哈希计算不正确 {: #block-parent-hash-calculated-incorrectly }

在引入 EIP-1559 支持（包括过渡到新的以太坊交易类型）后，区块头的父哈希被错误地计算为 `H256::default`。

此错误仅影响 Moonbase Alpha，并且仅影响以下区块：

|    网络     | 引入 | 修复  | 受影响的区块 |
|:--------------:|:----------:|:------:|:--------------:|
| Moonbase Alpha |   RT1200   | RT1201 |    1648995     |

虽然根本问题已在 RT1201 中修复，但错误的哈希已在 RT2601 中更正。

有关根本修复的更多信息，您可以查看[GitHub 上的相关 Frontier PR](https://github.com/polkadot-evm/frontier/pull/570/){target=\_blank}。要查看父哈希的更正，请查看相应的 [GitHub 上的 Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/2524){target=\_blank}。

---

#### EIP-1559 Gas 费的错误处理 {: #incorrect-gas-fees-eip1559 }

随着 EIP-1559 支持的引入，处理 `maxFeePerGas` 和 `maxPriorityFeePerGas` 的逻辑实现不正确。因此，即使总金额超过 `maxFeePerGas`，`maxPriorityFeePerGas` 也会被添加到 `baseFee` 中。

此错误存在于以下运行时和区块范围中：

|    网络     | 引入 | 修复 | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1401 |   415946 - 915320    |
|   Moonriver    |   RT1201   | RT1401 |  1471037 - 1705939   |
| Moonbase Alpha |   RT1200   | RT1400 |  1648994 - 1962557   |

有关更多信息，您可以查看[相关的 Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/45){target=\_blank}。

---

#### 支付给收集人的交易费用 {: #transaction-fees-paid-to-collators }

对于包含应用了优先级费用的 EIP-1559 交易的区块，交易费用的计算不正确，并分配给了区块的收集人。Moonbeam 上交易和智能合约执行的费用模型之前是这样处理的：20% 的费用进入链上财政库，80% 被销毁以作为通货紧缩的力量。由于此错误，受影响交易的交易费用未按预期销毁。

请注意，RT3401 引入了一个参数 pallet 费用配置，允许治理调整费用在财政库和销毁之间如何分配。在此运行时升级与 [MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=_blank} 的通过相结合后，Moonbeam 和 Moonriver 上的所有交易费用现在 100% 都会被销毁。

此错误存在于以下运行时和区块范围内：

|    网络     | 引入 | 已修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1504 |   415946 - 1117309   |
|   Moonriver    |   RT1201   | RT1504 |  1471037 - 1910639   |
| Moonbase Alpha |   RT1200   | RT1504 |  1648994 - 2221772   |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1528){target=\_blank}。

---

#### 错误的 State Root Hash {: #incorrect-state-root-hash }

由于未考虑交易类型字节，因此非旧式交易的 State Root Hash 计算错误。在支持 [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=\_blank} 和 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank} 的情况下，引入的交易类型分别为 `0x01` (1) 和 `0x02` (2)。这些交易类型在 State Root Hash 的计算中被省略。

此错误存在于以下运行时和区块范围中：

|    网络     | 引入时间 | 修复时间  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1701 |   415946 - 1581456   |
|   Moonriver    |   RT1201   | RT1701 |  1471037 - 2281722   |
| Moonbase Alpha |   RT1200   | RT1700 |  1648994 - 2529735   |

如需更多信息，您可以查看 [相关的 Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/86){target=\_blank} 和 [GitHub 上的 Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/1678/files){target=\_blank}。

---

#### Ethereum 交易在儲存中重複 {: #ethereum-transactions-duplicated-in-storage }

以太坊 Pallet 的 Frontier 中引入了一個上游錯誤，導致在運行時升級期間存在的待處理交易在兩個不同的區塊中儲存中重複。這僅影響到引入此錯誤的運行時升級之後的前兩個區塊。

只有 Moonriver 和 Moonbase Alpha 受到了影響。此錯誤在以下運行時中引入，並影響了以下區塊：

|    網路     | 引入 |   受影響的區塊   |
|:--------------:|:----------:|:-------------------:|
|   Moonriver    |   RT1605   | 2077599 和 2077600 |
| Moonbase Alpha |   RT1603   | 2285347 和 2285348 |

以下交易被重複：

=== "Moonriver"

    ```js
    '0x2cceda1436e32ae3b3a2194a8cb5bc4188259600c714789bae1fedc0bbc5125f',
    '0x3043660e35e89cafd7b0e0dce9636f5fcc218fce2a57d1104cf21aabbff9a1c0',
    '0x514411fb5c08f7c5aa6c61c38f33edfa74ff7e160831f6140e8dd3783648dbca',
    '0xf1647c357d8e1b05c522d11cff1f5090a4df114595d0f4b9e4ac5bb746473eea',
    '0x4be94803fe7839d5ef13ddd2633a293b4a7dddbe526839c15c1646c72e7b0b23',
    '0x15fceb009bd49692b598859f9146303ed4d8204b38e35c147fcdb18956679dbe',
    '0xa7460d23d5c633feec3d8e8f4382240d9b71a0d770f7541c3c32504b5403b70c',
    '0x1c838b4c4e7796a9db5edfd0377aee6e0d89b623bf1d7803f766f4cf71daefb9',
    '0xfb233a893e62d717ed627585f14b1ee8b3e300ac4e2c3016eb63e546a60820f0',
    '0xfaf8908838683ad51894eb3c68196afb99ba2e2bb698a40108960ee55417b56a',
    '0xa53973acbeac9fe948015dcfad6e0cb28d91b93c8115347c178333e73fd332d3',
    '0x9df769c96c5fdd505c67fee27eaff3714bf8f3d45a2afc02dd2984884b3cecac',
    '0x8f912ae91b408f082026992a87060ed245dac6e382a84288bd38fc08dbac30fe',
    '0xb22af459d24cb25bc53785bdd0ae6a573e24f226c94fd8d2e4663b87d3b07a88',
    '0x8ab9cd2bde7d679f798528b0c75325787f5fc7997e00589445b35b3954a815aa',
    '0xd08a1f82f4d3dc553b4b559925f997ef8bb85cb24cb4d0b893f017129fb33b78',
    '0xa1d40bce7cc607c19ca4b37152b6d8d3a408e3de6b9789c5977fcdef7ef14d97',
    '0xe442227634db10f5d0e8c1da09f8721c2a57267edbf97c4325c4f8432fd48ade',
    '0x0b4f5d8338a7c2b1604c1c42e96b12dc2a9d5ab264eb74ff730354e9765de13f',
    '0x0b00fc907701003aad75560d8b1a33cbf4b75f76c81d776b8b92d20e1d2e9d31',
    '0x9c18bd783f28427d873970ff9deaf1549db2f9a76e3edd6bdeae11358e447ef4',
    '0x8b2523f163989969dd0ebcac85d14805756bc0075b89da1274fd2c53ccaa396a',
    '0x47e80a0c533265974a55ea62131814e31b10f42895709f7e531e3e7b69f1387c'
    ```

=== "Moonbase Alpha"

    ```js
    '0x006a6843eb35ad35a9ea9a99affa8d81f1ed500253c98cc9c080d84171a0afb3',
    '0x64c102f664eb435206ad4fcb49b526722176bcf74801c79473c3b5b2c281a243',
    '0xf546335453b6e35ce7e236ee873c96ba3a22602b3acc4f45f5d68b33a76d79ca',
    '0x4ed713ccd474fc33d2022a802f064cc012e3e37cd22891d4a89c7ba3d776f2db',
    '0xa5355f86844bb23fe666b10b509543fa377a9e324513eb221e0a2c926a64cae4',
    '0xc14791a3a392018fc3438f39cac1d572e8baadd4ed350e0355d1ca874a169e6a'
    ```

重複的交易屬於第一個區塊。 因此，在 Moonriver 上，交易屬於區塊 2077599，而在 Moonbase Alpha 上，受影響的交易屬於區塊 2285347。

如需更多資訊，您可以查看 [GitHub 上的相關 Frontier PR](https://github.com/polkadot-evm/frontier/pull/638){target=\_blank}。

---

#### 非事务性调用的 Gas Limit 过高 {: #gas-limit-too-high-for-non-transactional-calls }

当发出非事务性调用（例如 `eth_call` 或 `eth_estimateGas`）时，如果没有为过去的区块指定 gas limit，客户端将默认使用 gas limit 乘数 (10x)，这会导致 gas limit 验证失败，因为它正在根据区块 gas limit 的上限进行验证。因此，如果给定调用的 gas limit 大于区块 gas limit，则会返回 gas limit 过高的错误。

此错误存在于以下运行时和区块范围内：

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1701   | RT1802 |  1581457 - 1919457   |
|   Moonriver    |   RT1701   | RT1802 |  2281723 - 2616189   |
| Moonbase Alpha |   RT1700   | RT1802 |  2529736 - 2879402   |

您可以查看 [GitHub 上的相关 Frontier PR](https://github.com/polkadot-evm/frontier/pull/935){target=\_blank} 以了解更多信息。

---

#### 远程 EVM 调用返回相同的交易哈希 {: #remote-evm-calls-return-identical-tx-hashes }

当从具有相同交易负载和 nonce 的不同账户发送多个远程 EVM 调用时，每次调用都返回相同的交易哈希。这是因为远程 EVM 调用是从无密钥账户执行的，因此如果发送者都具有相同的 nonce 并且发送的是相同的交易对象，则在计算交易哈希时没有差异。通过向 Ethereum XCM Pallet 添加全局 nonce 解决了这个问题，该 pallet 使远程 EVM 调用成为可能。

此错误仅在以下运行时和区块范围内的 Moonbase Alpha 上存在：

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1700   | RT1900 |  2529736 - 3069634   |

您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1790){target=\_blank} 以获取更多信息。

---

#### Gas 估计差异 {: #gas-estimation-discrepancy }

在使用非交易调用（如 `eth_call`）估算交易的 Gas 与在链上执行交易之间存在差异。造成这种差异的原因是非交易调用没有正确计算 `maxFeePerGas` 和 `maxPriorityFeePerGas`，因此，Ethereum 交易消耗的（[有效性证明](https://wiki.polkadot.com/general/glossary/#proof-of-validity){target=\_blank}）的计算方式不同。通过在估算链上交易规模时正确计算这些字段，此问题已得到修复。

此错误存在于以下运行时和区块范围内：

|    网络     | 引入 | 修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT2501 |   415946 - 4543267   |
|   Moonriver    |   RT1201   | RT2500 |  1471037 - 5175574   |
| Moonbase Alpha |   RT1200   | RT2500 |  1648994 - 5053547   |

您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1790/){target=\_blank} 以获取更多信息。

---

#### 交易回执中不正确的有效 Gas 价格 {: #incorrect-effective-gas-price }

由于基本费计算不正确，`eth_getTransactionReceipt` 返回的 `effectiveGasPrice` 值与链上值不同。具体来说，交易回执的值是使用交易所在的区块中的 `NextFeeMultiplier` 计算的，而不是前一个区块，前一个区块是计算基本费的正确来源。

此错误存在于以下运行时和区块范围内：

|    网络     | 引入 | 修复  | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT2801 |   415946 - 5899847   |
|   Moonriver    |   RT1201   | RT2801 |  1471037 - 6411588   |
| Moonbase Alpha |   RT1200   | RT2801 |  1648994 - 6209638   |

您可以查看 [相关的 Frontier PR](https://github.com/polkadot-evm/frontier/pull/1280){target=\_blank} 和 [GitHub 上的 Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/2610){target=\_blank} 以获取更多信息。

---

#### 跳过的以太坊交易追踪 {: #skipped-ethereum-transaction-traces }

启用了 `evm-tracing` 功能的运行时引入了额外的 `ref_time` 开销，这是由于追踪以太坊交易的特殊逻辑（为每个组件发出事件：gasometer、runtime、EVM），用于填充 RPC 调用（如 `debug_traceTransaction` 和 `trace_filter`）的信息。

由于生产运行时中的实际 `ref_time` 较小，这可能导致在 EVM 追踪运行时中重放区块时达到区块权重限制，从而导致跳过交易追踪。这在 Moonbeam 区块 [9770044](https://moonbeam.subscan.io/block/9770044){target=\_blank} 中观察到。

修复方法是在追踪每个以太坊交易之前重置先前消耗的权重。重要的是要注意，此问题仅影响 `evm-tracing` 下的代码，该代码未包含在任何生产运行时中。

此错误已在以下运行时中修复：

|    网络     | 已修复  | 受影响的区块 |
|:--------------:|:------:|:--------------:|
|    Moonbeam    | RT3501 |    9770044     |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/3210){target=\_blank}。

---

#### 长时间不活跃的整理人通知失败问题 {: #notify-inactive-collator-fails }

`notifyInactiveCollator` 外部函数旨在将最近两轮没有生成任何区块的整理人从池中移除，但对于已长时间不活跃的整理人，该函数执行失败。该交易仅在新一轮的前几个区块中才会成功。

以下运行时和区块范围内存在此错误：

|    网络     | 引入时间 | 修复时间 | 受影响的区块范围 |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT2601   | RT3500 |  5474345 – 10750816  |
|   Moonriver    |   RT2602   | RT3501 |  5638536 – 10665393  |
|    Moonbeam    |   RT2602   | RT3501 |  4977160 – 10056989  |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/3128){target=\_blank}。
---

## 迁移 {: #migrations }

当存储项目更改或添加并且需要填充数据时，迁移是必需的。下面列出的迁移已按受影响的 pallet(s) 组织。

### 作者映射 Pallet {: #author-mapping }

#### 更新映射存储项 {: #update-mapping-storage-item }

此迁移更新了作者映射 pallet 中现已弃用的 `Mapping` 存储项，以使用更安全的哈希类型。哈希类型已更新为 [Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=\_blank} 而不是 [Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=\_blank}。

此迁移仅应用于 Moonriver 和 Moonbase Alpha，并在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT800       |    684728     |
| Moonbase Alpha |      RT800       |    915684     |

如需更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/679){target=\_blank}。

---

#### 添加对 VRF 密钥的支持 {: #add-support-for-vrf-keys }

当引入 VRF 密钥支持时，作者映射 pallet 的 `MappingWithDeposit` 存储项已更新，以包含 `keys` 字段，从而支持可以通过 Nimbus ID 查找的 VRF 密钥。应用了一项迁移，以使用此新字段更新现有存储项。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1407){target=\_blank}。

---

#### 每个账户 ID 对应一个 Nimbus ID {: #one-nimbus-id-per-account-id }

已应用迁移，以确保一个账户 ID 只能拥有一个 Nimbus ID。此迁移接受了给定账户拥有的第一个 Nimbus ID，并清除了与该账户关联的任何其他 Nimbus ID。对于任何已清除的关联，都会退还该关联的保证金。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1606      |    1326697    |
|   Moonriver    |      RT1605      |    2077599    |
| Moonbase Alpha |      RT1603      |    2285347    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1525){target=\_blank}。

---

### 基本费用 Pallet {: #base-fee }

#### 设置弹性存储项值 {: #set-elasticity }

此迁移将基本费用 pallet 的 `Elasticity` 存储项设置为零，从而产生恒定的 `BaseFeePerGas`。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1744){target=\_blank}。

---

### Democracy Pallet {: #democracy }

#### Preimage 存储已移至新的 Preimage Pallet

已应用迁移，该迁移将存储在 democracy pallet 中的 preimage 移动到新的 preimage pallet。由于 [Polkadot 的上游更改](https://github.com/paritytech/substrate/pull/11649/){target=\_blank}，因此需要在 Moonbeam 上进行此迁移。

Moonbeam 中有一个 preimage 受到了影响，该 preimage 从调度队列中删除且从未执行：`0x14262a42aa6ccb3cae0a169b939ca5b185bc317bb7c449ca1741a0600008d306`。此 preimage 已由最初提交该 preimage 的帐户[手动删除](https://moonbeam.subscan.io/extrinsic/2693398-8){target=_blank}。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2000      |    3310369    |
|   Moonriver    |      RT2000      |    3202604    |
| Moonbase Alpha |      RT2000      |    2673234    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1962){target=\_blank}。

---

#### 移除 Governance V1 集體 {: #remove-gov-v1-collectives }

已應用遷移來移除 governance V1 集體，其中包括理事會和技術委員會。 governance V1 集體已替換為 OpenGov (governance V2) 技術委員會。

此遷移在以下運行時和區塊中執行：

|    網路     | 執行的運行時 | 應用的區塊 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

如需更多資訊，您可以查看 [GitHub 上的相關 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2643){target=\_blank}。

需要進行後續遷移，以正確清除與 governance V1 集體關聯的存儲條目，該遷移在以下運行時和區塊中執行：

|    網路     | 執行的運行時 | 應用的區塊 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2901      |    6197065    |
|   Moonriver    |      RT2901      |    6699589    |
| Moonbase Alpha |      RT2901      |    6710531    |

如需更多資訊，您可以查看 [GitHub 上的相關 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2711){target=\_blank}。

---

#### 移除 Governance V1 Democracy Pallet {: #remove-gov-v1-collectives }

已应用迁移来删除与 governance V1 中使用的 Democracy Pallet 关联的存储。Democracy Pallet 已被 Preimage、Referenda 和 Collective Voting OpenGov (governance V2) 托盘取代。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2901      |    6197065    |
|   Moonriver    |      RT2901      |    6699589    |
| Moonbase Alpha |      RT2901      |    6710531    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2685){target=\_blank}。

---

### EVM Pallet {: evm-pallet }

#### EVM 合约元数据
引入了一项迁移，以自动执行为两年前部署的合约设置 EVM 合约元数据的手动过程，这些合约在引入元数据存储项后未进行交互。此迁移取代了在这些合约上手动调用 `createContractMetadata(address)` 以使其与当前运行时兼容的需求。

此迁移在以下运行时和区块执行：

|  Network  | Executed Runtime | Block Applied |
|:---------:|:----------------:|:-------------:|
| Moonbeam  |      RT3200      |    7985204    |
| Moonriver |      RT3200      |    8519187    |

---

### Moonbeam Orbiter Pallet {: #moonbeam-orbiter }

#### 移除 Orbiter Collator 的最低保证金要求 {: #remove-orbiter-minimum-bond }

已将一个迁移应用到 Moonbeam Orbiter Pallet，该迁移将现有 orbiter collator 的保证金设置为零。此更改使未来的 orbiter 计划扩展能够实现均匀的支出。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2602      |    4977160    |
|   Moonriver    |      RT2602      |    5638536    |
| Moonbase Alpha |      RT2601      |    5474345    |

如需了解更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2526){target=\_blank}。

---

### Parachain Staking Pallet {: #parachain-staking }

#### 更新整理人状态存储项目 {: #update-collator-state-storage-item }

已应用一项迁移，该迁移将平行链质押 pallet 的 `Collator` 存储项目更新为新的 `Collator2` 存储项目。此更改更新了整理人状态，以包括以下项目：

- `nominators` 集是所有提名人（委托人）帐户 ID 的列表，不包括其各自的绑定余额
- 新的 `top_nominators` 存储项目，返回所有顶级提名人的列表，按最大绑定金额到最小排序
- 新的 `bottom_nominators` 存储项目，返回所有底部提名人的列表，按最小绑定金额到最大排序
- `total` 存储项目已替换为 `total_counted` 和 `total_backing`。`total_counted` 项目返回顶级提名和整理人自绑定之和，而 `total_backing` 项目返回所有提名和整理人自绑定之和

此迁移仅应用于 Moonriver 和 Moonbase Alpha，并在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/505){target=\_blank}。

---

#### 修复总质押金额 {: #patch-total-staked-amount }

由于一个潜在的错误可能导致金额不正确，因此对平行链 Staking Pallet 中 `CollatorState` 存储项的 `total` 质押金额应用了一项迁移。

此迁移仅应用于 Moonriver 和 Moonbase Alpha，并在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/502){target=\_blank}。

---

#### 支持延迟提名人 (Delegator) 退出 {: #support-delayed-nominator-exits }

用于处理候选人退出的退出队列已更新，包括支持延迟提名人（委托人）退出和撤销，这需要迁移以将 `ExitQueue` 平行链质押 pallet 存储项更新为 `ExitQueue2`。`NominatorState` 存储项也已迁移到 `NominatorState2`，以防止提名人在已经安排退出时执行更多提名。

这些迁移仅应用于 Moonriver 和 Moonbase Alpha，并在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT200       |    259002     |
| Moonbase Alpha |      RT200       |    457614     |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/610){target=\_blank}。

---

#### 清除 Staking 存储膨胀 {: #purge-staking-storage-bloat }

已应用迁移来清除平行链 Staking 托盘的 `Points` 和 `AtStake` 存储项中超过两轮的 Staking 存储膨胀。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/970){target=\_blank}。

---

#### 支持手动退出和 DPoS 术语 {: #support-manual-exits-dpos-terminology }

Parachain 质押 pallet 已更新，包含手动退出。如果候选人或委托人想要减少或撤销他们的保证金或者离开候选人或委托人池，他们需要先安排一个请求，等待一段延迟期过去，然后手动执行请求。因此，应用了一个迁移来替换自动退出队列，包括 `ExitQueue2` 存储项，并使用手动退出 API。

此外，还进行了一项更改，将提名权益证明 (NPoS) 切换为委托权益证明 (DPoS) 术语；这标志着从“提名”到“委托”的全面更改。这需要迁移以下 parachain 质押 pallet 存储项：

- `CollatorState2` 迁移到 `CandidateState`
- `NominatorState2` 迁移到 `DelegatorState`

这些迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/810){target=\_blank}。

---

#### 增加每个候选人的最大委托数 {: #increase-max-delegations-per-candidate }

已应用迁移来增加平行链质押 pallet 中每个候选人的最大委托数。它将 Moonbase Alpha 和 Moonriver 上的委托数从 100 增加到 500，并将 Moonbeam 上的委托数从 100 增加到 1000。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1101      |    171061     |
|   Moonriver    |      RT1101      |    1188000    |
| Moonbase Alpha |      RT1100      |    1426319    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1096){target=\_blank}。

---

#### 将候选人委托拆分为顶部和底部 {: #split-candidate-delegations-top-bottom }

此迁移将平行链质押 pallet 中已弃用的 `CandidateState` 存储项拆分为以下三个新的存储项，以避免不必要的存储读取：

- `CandidateInfo`
- `TopDelegations`
- `BottomDelegations`

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1117){target=\_blank}。

---

#### 修复不正确的总委托数 {: #patch-incorrect-total-delegations }

已应用迁移来修复[不正确的排序器选择](#incorrect-collator-selection)错误并修复所有候选人的委托总数。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=\_blank}。

---

#### 将委托人状态拆分为委托计划请求 {: #split-delegator-state }

已应用一项迁移，该迁移将待处理的委托人请求从平行链质押 pallet 的 `DelegatorState` 存储项移动到新的 `DelegationScheduledRequests` 存储项中。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1408){target=\_blank}。

---

#### 使用锁仓替换质押预留 {: #replace-staking-reserves }

已应用一项迁移，将用户的质押预留余额更改为锁仓余额。锁仓余额与 democracy 锁定的资金类型相同，允许用户使用其质押的资金参与 democracy。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1701      |    1581457    |
|   Moonriver    |      RT1701      |    2281723    |
| Moonbase Alpha |      RT1700      |    2529736    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1604){target=\_blank}。

---

#### 自动复利支持 {: #auto-compounding-support }

为了支持自动复利，对平行链质押 pallet 中的 `AtStake` 存储项目应用了两个迁移：

- `RemovePaidRoundsFromAtStake` - 用于删除与未产生任何区块的候选轮次已支付的轮次相关的任何陈旧的 `AtStake` 条目。此迁移是 `MigrateAtStakeAutoCompound` 迁移的先决条件
- `MigrateAtStakeAutoCompound` - 迁移 `AtStake` 条目的未支付轮次的快照

这些迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1901      |    2317683    |
|   Moonriver    |      RT1901      |    2911863    |
| Moonbase Alpha |      RT1900      |    3069635    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1878){target=_blank}。

---

#### 切换到基于区块的抵押轮次 {: #block-based-staking-rounds }

已应用迁移，以从基于时间的抵押轮次切换到固定的基于区块的轮次。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2690){target=\_blank}。

---

#### 重命名平行链 Bond 储备事件 {: #renaming-of-parachain-bond-reserve-events }

在 Runtime 3300 之前，每个回合都会发出一次 `ReservedForParachainBond` 事件，以指示通过通货膨胀为平行链 Bond 储备金提供资金。在 Runtime 3300 中，此同一事件已重命名为 `InflationDistributed`。

此更改在以下运行时和区块中生效：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT3300      |    8381443    |
|   Moonriver    |      RT3300      |    8894417    |
| Moonbase Alpha |      RT3300      |    9062316    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2976){target=\_blank}。

#### ParachainStaking：货币 → 同质化代币迁移 {: #parachainstaking-currency-to-fungible }

已应用迁移，将 `ParachainStaking` pallet 从已弃用的 Currency 特征迁移到现代 Fungible 特征。在操作上，staking“锁”已替换为余额“冻结”：先前使用标识符 [`stkngcol`, `stkngdel`]读取 `Balances.Locks` 的查询现在必须使用冻结原因 [`StakingCollator`, `StakingDelegator`]读取 `Balances.Freezes`。`System.Account` 中显示的冻结余额在此迁移中未更改。

此迁移在以下运行时和区块上执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT4000      |       -       |
|   Moonriver    |      RT4000      |       -       |
| Moonbase Alpha |      RT4000      |    14191989    |

---

### Referenda Pallet {: #referenda-pallet }

#### 提交保证金退款 {: #refunds-for-submission-deposits }

引入了一项迁移，以支持对已关闭的全民投票的提交保证金进行退款，该全民投票更新了 `ReferendumInfo` 类型。`ReferendumInfo` 的以下不变性已更改，以便第二个参数 `Deposit<AccountId, Balance>` 现在是可选的 `Option<Deposit<AccountId, Balance>>`：`Approved`、`Rejected`、`Cancelled` 和 `TimedOut`。

这源于对 [Substrate](https://github.com/paritytech/substrate/pull/12788){target=\_blank} 存储库的上游更改。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2134){target=\_blank}。

---

#### 恢复损坏的 Referenda 保证金 {: restore-corrupted-referenda-deposits }

引入了一项迁移，以支持恢复受损坏存储值影响的 referenda 保证金。当由于 pallet 版本错误而导致迁移应用两次时，就会出现此问题，从而导致无效值和不可退还的提交保证金。由于要更正的值的数量是有限且较小的，因此此迁移创建了一个列表以手动更新它们。

此迁移仅应用于 Moonbeam，并在以下运行时和区块中执行：

| 网络     | 执行的运行时 | 应用的区块 |
| :--------: | :----------------: | :-------------: |
| Moonbeam | RT3100 | 7303601 |

### XCM 相关 Pallets {: #xcm-related-pallets }

#### 更新交易信息存储项 {: #update-transaction-info }

XCM 交易器 Pallet 的 `TransactInfo` 存储项已应用迁移，更改了以下项目：

- 添加了 `max_weight`，以防止交易人在目标链中阻塞队列
- 删除了 `fee_per_byte`、`metadata_size` 和 `base_weight`，因为这些项目对于 XCM 交易不是必需的
- `fee_per_second` 替换了 `fee_per_weight`，以更好地反映 `fee_per_weight` 单位低于 1 的情况（如 Kusama）

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1114){target=\_blank}。

---

#### 添加对 Kusama Asset Hub (Statemine) 前缀重大更改的支持 {: #add-support-statemine-prefix }

资产管理器 pallet 中添加了以下三个迁移，以避免 Kusama Asset Hub（之前称为 Statemine）[对其资产表示方式的重大更改](https://github.com/paritytech/cumulus/pull/831){target=_blank} 以及未来可能发生的重大更改导致的问题：

- `UnitsWithAssetType` - 将 `AssetTypeUnitsPerSecond` 存储项目更新为 `AssetType` 到 `units_per_second` 的映射，而不是 `AssetId` 到 `units_per_second` 的映射。这样做是为了避免在发生重大更改时进行额外的迁移
- `PopulateAssetTypeIdStorage` - 创建一个新的 `AssetTypeId` 存储项目，该项目保存 `AssetType` 到 `AssetId` 的映射，从而可以将 `assetIds` 和 `AssetTypes` 解耦
- `ChangeStateminePrefixes` - 将已注册的 Kusama Asset Hub (Statemine) 资产更新为其新形式

这些迁移在以下运行时和区块中执行：

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1159){target=\_blank}。

---

#### 添加新支持的费用支付资产存储项目 {: #add-supported-fee-payment-assets }

已将迁移应用到资产管理器 pallet，通过从 `AssetTypeUnitsPerSecond` 存储项目中读取支持的资产数据来创建新的 `SupportedFeePaymentAssets` 存储项目。此存储项目将保存我们接受的所有用于 XCM 费用支付的资产。当收到传入的 XCM 消息时，将读取该存储项目，如果资产不在存储中，则不会处理该消息。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/1118){target=_blank}。

---

#### 将 XCM 交易器存储从 V2 更新到 V3 {: #update-xcm-transactor }

在 XCM V3 的支持下，应用了一个迁移来更新 XCM 交易器 pallet 的存储，从 XCM V2 更新到 V3。`transactInfoWithWeightLimit` 和 `destinationAssetFeePerSecond` 存储项已更新，以支持 XCM V3 多重定位。

此迁移在以下运行时和区块中执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2145){target=\_blank}。

---

#### 删除可铸造的 XC-20 {: #remove-local-assets }

可铸造的 XC-20 已被弃用，转而支持启用 XCM 的 ERC-20；因此，应用了一个迁移来删除本地资产 pallet 并清除存储中的资产。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

有关更多信息，您可以查看 [GitHub 上的相关 PR](https://github.com/moonbeam-foundation/moonbeam/pull/2634){target=\_blank}。

---

#### 通过智能合约管理外部资产 {: #foreign-assets-migration }

已应用迁移，将现有外部资产转换为新设计，该设计通过 EVM 智能合约在 Moonbeam 上管理 XCM 衍生资产，而不是之前使用资产和资产管理器 Pallet 的实现。迁移过程涉及 Moonbeam Lazy Migration Pallet 中的几个 extrinsic：

- **`approve_assets_to_migrate`** - 设置批准迁移的资产 ID 列表
- **`start_foreign_asset_migration`** - 通过冻结原始资产并创建新的 EVM 智能合约来启动特定外部资产的迁移
- **`migrate_foreign_asset_balances`** - 将资产余额分批从旧资产 Pallet 迁移到新系统
- **`migrate_foreign_asset_approvals`** - 在取消预留旧批准系统的存款时，分批迁移资产批准
- **`finish_foreign_asset_migration`** - 在迁移所有余额和批准后完成迁移，并执行最终清理

此迁移通过使用与之前相同的 AssetID 整数识别每个外部资产，从而保持与现有外部资产的兼容性。此迁移在以下运行时和区块中执行：

|    网络     | 执行运行时 | 应用区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT3501      |    10056989   |
|   Moonriver    |      RT3501      |    10665393   |
| Moonbase Alpha |      RT3500      |    10750816   |

有关更多信息，您可以在 GitHub 上查看相关的 PR：[2869](https://github.com/moonbeam-foundation/moonbeam/pull/2869){target=\_blank} 和 [3020](https://github.com/moonbeam-foundation/moonbeam/pull/3020){target=\_blank}。

---

### Nimbus 作者过滤器托盘 {: #nimbus }

#### 将合格率替换为合格计数 {: #replace-eligible-ratio }

Nimbus 存储库应用了一项重大更改，弃用了 `EligibleRatio`，转而使用 `EligibleCount` 配置。因此，在 Moonbeam 存储库上应用了迁移，如果存在 `EligibleRatio` 值，则将新的 `EligibleCount` 值填充为在该区块高度定义的潜在作者的百分比。否则，该值将设置为默认值 `50`。

此迁移在以下运行时和区块执行：

|    网络     | 执行的运行时 | 应用的区块 |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

有关更多信息，您可以查看[相关的 Nimbus PR](https://github.com/moonbeam-foundation/nimbus/pull/45){target=\_blank} 和 [GitHub 上的 Moonbeam PR](https://github.com/moonbeam-foundation/moonbeam/pull/1400){target=\_blank}。
