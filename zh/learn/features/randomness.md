---
title: 随机性
description: 了解 Moonbeam 上 VRF 随机性的来源、请求和履行过程，以及使用链上随机性时的一些安全注意事项。
categories: 基础知识
---

# Moonbeam 上的随机数

## 简介 {: #introduction }

随机性对于各种区块链应用来说是必要的，它可以创造公正、不可预测和独特的结果。然而，获得可靠的随机性来源是一个挑战。计算机是确定性的，这意味着给定相同的输入，总是会产生相同的输出。因此，计算机生成的随机值被称为伪随机值，因为它们在统计上看起来是随机的，但是给定相同的输入，输出很容易被重复。

Moonbeam 利用可验证随机函数（VRF）来生成可以在链上验证的随机性。VRF 是一种密码学函数，它接受一些输入并产生随机值，以及证明它们是由提交者生成的真实性证明。任何人都可以验证该证明，以确保随机值已正确生成。

目前有两种可用的随机性来源，它们基于区块生产者的 VRF 密钥和过去的随机性结果来提供随机输入：[local VRF](#local-vrf) 和 [BABE epoch randomness](#babe-epoch-randomness)。Local VRF 直接在 Moonbeam 中确定，使用区块校验者的 VRF 密钥和上一个区块的 VRF 输出。另一方面，[BABE](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#block-production-babe){target=\_blank} epoch 随机性基于中继链验证者在完整 [epoch](https://wiki.polkadot.com/general/glossary/#epoch){target=\_blank} 期间产生的所有 VRF。

您可以使用随机性预编译合约与链上随机性进行交互和请求，这是一个 Solidity 接口，使智能合约开发者能够通过 Ethereum API 访问随机性功能。有关更多信息，请查看[与随机性预编译交互](/builders/ethereum/precompiles/features/randomness/){target=\_blank} 指南。

## 常规定义 {: #general-definitions }

- **Epoch（纪元）** - BABE协议中的一个时间段，被分成更小的时间槽。时间槽是离散的时间单位，长度为六秒。在Polkadot上，一个纪元大约持续2,400个时间槽或4小时。在Kusama上，一个纪元大约持续600个时间槽或1小时。
- **Deposit（押金）** - 请求随机数所需的资金数额。每个请求都需要一笔押金。一旦请求完成，押金将退还给请求随机数的账户。
- **Block expiration delay（区块过期延迟）** - 在本地VRF请求过期并可以清除之前必须经过的区块数量
- **Epoch expiration delay（纪元过期延迟）** - 在BABE请求过期并可以清除之前必须经过的纪元数量
- **Minimum block delay（最小区块延迟）** - 在可以满足本地VRF请求之前，必须经过的最小区块数
- **Maximum block delay（最大区块延迟）** - 在可以满足本地VRF请求之前，必须经过的最大区块数
- **Maximum random words（最大随机词数）** - 正在请求的最大随机词数
- **Epoch fulfillment delay（纪元完成延迟）** - 在可以满足BABE请求之前的纪元延迟

## 快速参考 {: #quick-reference }

=== "Moonbeam"
    |        变量         |                                             值                                             |
    |:-----------------------:|:---------------------------------------------------------------------------------------------:|
    |         存款         |                {{ networks.moonbeam.randomness.req_deposit_amount.glmr }} GLMR                 |
    | 区块过期延迟  |                  {{ networks.moonbeam.randomness.block_expiration }} 区块                   |
    | Epoch 过期延迟  |                  {{ networks.moonbeam.randomness.epoch_expiration }} epoch                   |
    |   最小区块延迟   |                {{ networks.moonbeam.randomness.min_vrf_blocks_delay }} 区块                 |
    |   最大区块延迟   |                {{ networks.moonbeam.randomness.max_vrf_blocks_delay }} 区块                 |
    |  最大随机词数   |                   {{ networks.moonbeam.randomness.max_random_words }} 词                   |
    | Epoch 完成延迟 | {{ networks.moonbeam.randomness.epoch_fulfillment_delay }} epoch (在当前 epoch 之后) |

=== "Moonriver"
    |        变量         |                                             值                                              |
    |:-----------------------:|:----------------------------------------------------------------------------------------------:|
    |         存款         |                {{ networks.moonriver.randomness.req_deposit_amount.movr }} MOVR                 |
    | 区块过期延迟  |                  {{ networks.moonriver.randomness.block_expiration }} 区块                   |
    | Epoch 过期延迟  |                  {{ networks.moonriver.randomness.epoch_expiration }} epoch                   |
    |   最小区块延迟   |                {{ networks.moonriver.randomness.min_vrf_blocks_delay }} 区块                 |
    |   最大区块延迟   |                {{ networks.moonriver.randomness.max_vrf_blocks_delay }} 区块                 |
    |  最大随机词数   |                   {{ networks.moonriver.randomness.max_random_words }} 词                   |
    | Epoch 完成延迟 | {{ networks.moonriver.randomness.epoch_fulfillment_delay }} epoch (在当前 epoch 之后) |

=== "Moonbase Alpha"
    |        变量         |                                             值                                             |
    |:-----------------------:|:---------------------------------------------------------------------------------------------:|
    |         存款         |                 {{ networks.moonbase.randomness.req_deposit_amount.dev }} DEV                 |
    | 区块过期延迟  |                  {{ networks.moonbase.randomness.block_expiration }} 区块                   |
    | Epoch 过期延迟  |                  {{ networks.moonbase.randomness.epoch_expiration }} epoch                   |
    |   最小区块延迟   |                {{ networks.moonbase.randomness.min_vrf_blocks_delay }} 区块                 |
    |   最大区块延迟   |                {{ networks.moonbase.randomness.max_vrf_blocks_delay }} 区块                 |
    |  最大随机词数   |                   {{ networks.moonbase.randomness.max_random_words }} 词                   |
    | Epoch 完成延迟 | {{ networks.moonbase.randomness.epoch_fulfillment_delay }} epoch (在当前 epoch 之后) |

## 本地 VRF {: #local-vrf }

本地 VRF 随机数是在每个区块的开头，以区块为单位生成的，它使用前一个区块的 VRF 输出以及当前区块作者的 VRF 密钥的公钥。生成的随机数结果将被存储，并用于满足当前区块的所有随机数请求。

您可以使用 [Randomness Precompile](/builders/ethereum/precompiles/features/randomness/){target=\_blank}的 [`requestLocalVRFRandomWords` 方法](/builders/ethereum/precompiles/features/randomness/#:~:text=requestLocalVRFRandomWords){target=\_blank} 请求本地 VRF 随机数。

如果您的合约可能有并发请求打开，您可以使用从 `requestLocalVRFRandomWords` 方法返回的 `requestId` 来跟踪哪个响应与哪个随机数请求相关联。

## BABE Epoch 随机数 {: #babe-epoch-randomness }

BABE epoch 随机数基于倒数第二个中继链 epoch 中产生的区块的 VRF 值的哈希。在 Polkadot 上，一个 [epoch 大约持续 4 个小时](https://wiki.polkadot.com/learn/learn-cryptography/#vrf){target=\_blank}，而在 Kusama 上，一个 [epoch 大约持续 1 个小时](https://wiki.polkadot.com/kusama/kusama-getting-started/#periods-of-common-actions-and-attributes){target=\_blank}。哈希处理在中继链上完成，因此，除非 Moonbeam 上的整理人也是中继链上的验证人，并且负责生成 epoch 中包含的最后一个输出，否则他们无法影响随机数值。

随机数在一个 epoch 期间保持不变。如果整理人跳过区块生产，则下一个符合条件的整理人可以使用相同的随机值来满足请求。

您可以使用 [随机数预编译](/builders/ethereum/precompiles/features/randomness/){target=\_blank}的 [`requestRelayBabeEpochRandomWords` 方法](/builders/ethereum/precompiles/features/randomness/#:~:text=requestRelayBabeEpochRandomWords){target=\_blank} 来请求 BABE epoch 随机数。为了生成唯一的随机数，必须为 `requestRelayBabeEpochRandomWords` 函数提供不同的 salt。

在每个中继链 epoch 更改开始时，将从一个 epoch 前的随机数从中继链状态证明中读取，并用于满足当前区块中所有应有的随机数请求。

## 请求和完成过程 {: #request-and-fulfill-process }

通常，随机性的请求和完成过程如下：

1. 支付请求随机词所需的存款
2. 使用本地 VRF 或 BABE 纪元随机性源请求随机性。当请求随机性时，您需要指定以下几项内容：

    - 退款地址，任何多余的费用将发送到该地址
    - 将预留用于支付完成费用的金额。如果指定的金额不足，您可以随时增加请求费用，或者如果金额过多，完成之后，多余的费用将退还到指定的地址
    - 将用于生成不同随机词的唯一盐值
    - 您想要请求的随机词的数量
    - 对于本地 VRF，以区块为单位的延迟周期，用于增加不可预测性。它必须介于上面列出的[最小和最大区块数](#quick-reference)之间。对于 BABE 纪元随机性，您无需指定延迟，但可以在[纪元延迟](#quick-reference)过去后完成请求

3. 等待延迟期过去
4. 完成随机性请求，这将触发使用当前区块的随机性结果和给定的盐值来计算随机词。这可以由任何人使用最初为请求预留的费用手动完成
5. 对于已完成的请求，将返回随机词，执行成本将从请求费用中退还到启动完成的地址。然后，任何多余的费用和请求存款将转移到指定的退款地址

如果请求过期，则可以由任何人清除它。发生这种情况时，请求费用将支付给启动清除的地址，存款将退还给原始请求者。

随机性请求的正常流程如以下示意图所示：

![随机性请求的愉快路径图](/images/learn/features/randomness/randomness-1.webp)

## 安全注意事项 {: #security-considerations }

能够直接调用您的 `fulfillRandomness` 方法的方法可能会使用任何随机值来欺骗 VRF 响应，因此至关重要的是，它只能由 `RandomnessConsumer.sol` 合约的 `rawFulfillRandomness` 方法直接调用。

为了让您的用户相信您合约的随机行为不受恶意干扰，最好的方法是编写它，以便 VRF 响应所暗示的所有行为都在您的 `fulfillRandomness` 方法*期间*执行。如果您的合约必须存储响应（或从中派生的任何内容）并在以后使用它，您必须确保任何依赖于该存储值的对用户有意义的行为都不会受到后续 VRF 请求的操纵。

同样，收集者对 VRF 响应在区块链上出现的顺序有一定的影响，因此如果您的合约可能同时有多个 VRF 请求在进行中，您必须确保 VRF 响应到达的顺序不会被用来操纵您的合约中对用户有意义的行为。

由于为 `requestLocalVRFRandomWords` 生成的随机词的输出取决于在完成时生成区块的收集者，因此收集者可以跳过其区块，强制由不同的收集者执行完成，从而生成不同的 VRF。但是，这种攻击会导致收集者失去区块奖励的成本。如果请求和完成之间的延迟太短，收集者也可能能够预测 VRF 的某些可能结果。因此，您可以选择提供更高的延迟。

由于为 `requestRelayBabeEpochRandomWords` 生成的随机词的输出取决于在 epoch 期间生成区块的中继链验证者，因此 epoch 的最后一个验证者可以通过跳过区块的生成来选择两个可能的 VRF 输出。但是，这种攻击会导致验证者失去区块奖励的成本。只要有一个诚实的收集者，平行链收集者就不可能预测或影响中继链 VRF 的输出，也不能审查完成。
