---
title: 随机性预编译
description: 了解 Moonbeam 上 VRF 随机性的来源，以及如何使用随机性预编译和消费者接口来生成链上随机性。
keywords: solidity, ethereum, randomness, VRF, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---

# 与随机性预编译交互

## 简介 {: #introduction }

Moonbeam 利用可验证随机函数 (VRF) 生成可在链上验证的随机性。VRF 是一种加密函数，它接受一些输入并生成随机值，以及证明这些随机值是由提交者生成的真实性证明。任何人都可以验证该证明，以确保正确计算了生成的随机值。

目前有两种可用的随机性来源，它们根据区块生产者的 VRF 密钥和过去的随机性结果提供随机输入：[本地 VRF](learn/features/randomness/#local-vrf) 和 [BABE 纪元随机性](learn/features/randomness/#babe-epoch-randomness)。本地 VRF 直接在 Moonbeam 中确定，使用区块整理人的 VRF 密钥和上一个区块的 VRF 输出。另一方面，[BABE](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#block-production-babe){target=_blank} 纪元随机性基于中继链验证人在完整[纪元](https://wiki.polkadot.com/general/glossary/#epoch){target=_blank}期间生成的所有 VRF。

有关随机性的两种来源、请求和履行过程如何运作以及安全注意事项的更多信息，请参阅 [Moonbeam 上的随机性](learn/features/randomness/){target=_blank} 页面。

Moonbeam 提供了一个随机性预编译合约，它是一个 Solidity 接口，使智能合约开发者能够使用 Ethereum API 通过本地 VRF 或 BABE 纪元随机性生成随机性。Moonbeam 还提供了一个随机性消费者 Solidity 合约，您的合约必须继承该合约才能使用已履行的随机性请求。

本指南将向您展示如何使用随机性预编译合约和随机性消费者合约创建一个抽奖活动，其中获奖者将被随机选择。您还将学习如何直接与随机性预编译合约交互，以执行诸如清除过期的随机性请求之类的操作。

随机性预编译合约位于以下地址：

=== "Moonbeam"
    ```text
    `{{ networks.moonbeam.precompiles.randomness }}`
    ```text

=== "Moonriver"
    ```text
    `{{ networks.moonriver.precompiles.randomness }}`
    ```

=== "Moonbase Alpha"
    ```text
    `{{ networks.moonbase.precompiles.randomness }}`
    ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 随机数Solidity接口 {: #the-randomness-interface }

[Randomness.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank} 是一个Solidity接口，允许开发者与预编译的方法进行交互。

??? code "Randomness.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/features/randomness/Randomness.sol'
    ```

该接口包括函数、常量、事件和枚举，详见以下章节。

### 函数 {: #functions }

该接口包括以下函数：

??? function "**relayEpochIndex**() - 返回当前的中继纪元索引，其中一个纪元代表实际时间，而不是区块号"

    === "参数"

        None。

    === "返回值"

        - `uint256` 当前中继纪元索引

??? function "**requiredDeposit**() - 返回执行随机数请求所需的押金"

    === "参数"

        None。

    === "返回值"

        - `uint256` 所需的押金金额

??? function "**getRequestStatus**(*uint256* requestId) - 返回给定随机数请求的请求状态"

    === "参数"

        - `requestId` - 随机数请求的 uint256 ID

    === "返回值"

        - `uint8` 请求的状态代码

??? function "**getRequest**(*uint256* requestId) - 返回给定随机数请求的请求详情"

    === "参数"

        - `requestId` - 随机数请求的 uint256 ID

    === "返回值"

        - `bool` 请求是否准备就绪
        - `bool` 请求是否已过期
        - `uint256` 押金金额
        - `uint256` 手续费金额

??? function "**requestLocalVRFRandomWords**(*address* refundAddress, *uint256* fee, *uint64* gasLimit, *bytes32* salt, *uint8* numWords, *uint64* delay) - 请求从平行链 VRF 生成的随机词"

    === "参数"

        - `refundAddress` - 接收完成后的剩余费用的地址
        - `fee` - uint256 金额，用于预留支付完成费用
        - `gasLimit` - 用于完成的 uint64 gas 限制
        - `salt` - 与随机种子混合以获得不同随机词的 bytes32 字符串
        - `numWords` - 请求的随机词数量的 uint8，最多为最大随机词数量
        - `delay` - 请求可以完成之前必须经过的区块数的 uint64。此值需要在本地 VRF 请求可以完成之前的最小和最大区块数之间

    === "返回值"

        - `uint256` 创建的请求的 ID

??? function "**requestRelayBabeEpochRandomWords**(*address* refundAddress, *uint256* fee, *uint64* gasLimit, *bytes32* salt, *uint8* numWords) - 请求从中继链 BABE 共识生成的随机词"

    === "参数"

        - `refundAddress` - 接收完成后的剩余费用的地址
        - `fee` - uint256 金额，用于预留支付完成费用
        - `gasLimit` - 用于完成的 uint64 gas 限制
        - `salt` - 与随机种子混合以获得不同随机词的 bytes32 字符串
        - `numWords` - 请求的随机词数量的 uint8，最多为最大随机词数量

    === "返回值"

        - `uint256` 创建的请求的 ID

??? function "**fulfillRequest**(*uint256* requestId) - 完成请求，这将调用消费者合约方法 [`fulfillRandomWords`](#:~:text=rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords))。如果请求可以完成，则调用者的费用将被退还"

    === "参数"

        - `requestId` - 随机数请求的 uint256 ID

    === "返回值"

        None。

??? function "**increaseRequestFee**(*uint256* requestId, *uint256* feeIncrease) - 增加与给定随机数请求关联的费用。如果在请求完成之前，gas 价格显著上涨，则需要这样做"

    === "参数"

        - `requestId` - 随机数请求的 uint256 ID
        - `feeIncrease` - 费用增加的 uint256 金额

    === "返回值"

        None。

??? function "**purgeExpiredRequest**(*uint256* requestId) - 从存储中删除给定的过期请求，并将请求费用转移给调用者，并将押金返还给原始请求者"

    === "参数"

        - `requestId` - 随机数请求的 uint256 ID

    === "返回值"

        None。

### 常量 {: #constants }

该接口包含以下常量：

- **maxRandomWords** - 请求的最大随机字数
- **minBlockDelay** - 本地 VRF 请求可以满足的最小区块数
- **maxBlockDelay** - 本地 VRF 请求可以满足的最大区块数
- **deposit** - 请求随机字所需的存款金额。 每个请求都有一笔存款

=== "Moonbeam"
    |        Variable        |                              Value                              |
    |:----------------------:|:---------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |    {{ networks.moonbeam.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonbeam.randomness.min_vrf_blocks_delay }} blocks  |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonbeam.randomness.max_vrf_blocks_delay }} blocks  |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonbeam.randomness.req_deposit_amount.glmr }} GLMR |

=== "Moonriver"
    |        Variable        |                              Value                               |
    |:----------------------:|:----------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |    {{ networks.moonriver.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonriver.randomness.min_vrf_blocks_delay }} blocks  |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonriver.randomness.max_vrf_blocks_delay }} blocks  |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonriver.randomness.req_deposit_amount.movr }} MOVR |

=== "Moonbase Alpha"
    |        Variable        |                             Value                              |
    |:----------------------:|:--------------------------------------------------------------:|
    |    MAX_RANDOM_WORDS    |   {{ networks.moonbase.randomness.max_random_words }} words    |
    |  MIN_VRF_BLOCKS_DELAY  | {{ networks.moonbase.randomness.min_vrf_blocks_delay }} blocks |
    |  MAX_VRF_BLOCKS_DELAY  | {{ networks.moonbase.randomness.max_vrf_blocks_delay }} blocks |
    | REQUEST_DEPOSIT_AMOUNT | {{ networks.moonbase.randomness.req_deposit_amount.dev }} DEV  |

### 事件 {: #events }

该接口包括以下事件：

- **FulfillmentSucceeded**() - 请求已成功执行时发出
- **FulfillmentFailed**() - 请求未能执行 fulfillment 时发出

### 枚举 {: #enums }

该接口包括以下枚举：

- **RequestStatus** - 请求的状态，可以是 `DoesNotExist` (0)、`Pending` (1)、`Ready` (2) 或 `Expired` (3)
- **RandomnessSource** - 随机源的类型，可以是 `LocalVRF` (0) 或 `RelayBabeEpoch` (1)

## 随机数消费者Solidity接口 {: #randomness-consumer-solidity-interface }

[`RandomnessConsumer.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/4e2a5785424be6faa01cd14e90155d9d2ec734ee/precompiles/randomness/RandomnessConsumer.sol){target=\_blank} Solidity接口使智能合约可以轻松地与随机数预编译进行交互。使用随机数消费者可确保实现来自随机数预编译。

??? code "RandomnessConsumer.sol"

    solidity
    --8<-- 'code/builders/ethereum/precompiles/features/randomness/Randomness.sol'
    

消费者接口包括以下函数：

- **fulfillRandomWords**(*uint256* requestId, *uint256[] memory* randomWords) - 处理给定请求的VRF响应。此方法由对 `rawFulfillRandomWords` 的调用触发
- **rawFulfillRandomWords**(*uint256* requestId, *uint256[] memory* randomWords) - 在调用随机数预编译的 [`fulfillRequest` 函数](#:~:text=fulfillRequest(uint256 requestId)) 时执行。验证调用的来源，确保随机数预编译是来源，然后调用 `fulfillRandomWords` 方法

## 请求与完成过程 {: #request-and-fulfill-process }

要使用随机性，您必须拥有一个执行以下操作的合约：

  - 导入 `Randomness.sol` 预编译合约和 `RandomnessConsumer.sol` 接口
  - 继承自 `RandomnessConsumer.sol` 接口
  - 根据您要使用的随机性来源，通过预编译合约的 [`requestLocalVRFRandomWords` 方法](#:~:text=requestLocalVRFRandomWords) 或 [`requestRelayBabeEpochRandomWords` 方法](#:~:text=requestRelayBabeEpochRandomWords) 请求随机性
  - 通过预编译合约的 [`fulfillRequest` 方法](#:~:text=fulfillRequest) 请求完成
  - 通过具有与 `RandomnessConsumer.sol` 合约的 [`fulfillRandomWords` 方法](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)) 相同[签名的 `fulfillRandomWords` 方法](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)) 使用随机性

通过预编译合约的 `requestLocalVRFRandomWords` 或 `requestRelayBabeEpochRandomWords` 方法请求随机性时，会预留一笔费用来支付请求的完成费用。使用本地 VRF 时，为了提高不可预测性，必须经过指定的延迟期（以区块为单位），然后才能完成请求。至少，延迟期必须大于一个区块。对于 BABE epoch 随机性，您无需指定延迟，但可以在当前 epoch 之后的第二个 epoch 开始时完成请求。

延迟后，任何人都可以通过 `fulfillRequest` 方法手动执行请求的完成，费用是最初为请求预留的费用。

通过预编译合约的 `fulfillRequest` 方法完成随机性请求时，将调用 `RandomnessConsumer.sol` 合约中的 [`rawFulfillRandomWords`](#:~:text=rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords)) 函数，该函数将验证发送者是否为随机性预编译合约。然后，调用 [`fulfillRandomWords`](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords))，并使用当前区块的随机性结果和给定的 salt 计算请求的随机词数并返回。如果完成成功，将发出 [`FulfillmentSucceeded` 事件](#:~:text=FulfillmentSucceeded)；否则，将发出 [`FulfillmentFailed` 事件](#:~:text=FulfillmentFailed)。

对于已完成的请求，执行成本将从请求费用中退还给 `fulfillRequest` 的调用者。然后，任何多余的费用和请求保证金将转入指定的退款地址。

您的合约的 `fulfillRandomWords` 回调负责处理完成。例如，在彩票合约中，回调将使用随机词来选择获胜者并支付奖金。

如果请求过期，可以通过预编译合约的 [`purgeExpiredRequest` 函数](builders/ethereum/precompiles/features/randomness/#:~:text=purgeExpiredRequest){target=\_blank} 清除它。调用此函数时，请求费用将支付给调用者，保证金将退还给原始请求者。

以下图表显示了随机性请求的理想路径：

![随机性请求的理想路径图](/images/learn/features/randomness/randomness-1.webp)

## 使用随机性预编译生成随机数 {: #interact-with-the-solidity-interfaces }

在本教程的以下部分中，您将学习如何创建使用随机性预编译和随机性消费者生成随机数的智能合约。如果您只想了解随机性预编译的一些功能，您可以跳到[使用 Remix 直接与随机性预编译交互](#interact-directly)部分。

### 检查先决条件 {: #checking-prerequisites }

在本指南中，您需要具备以下条件：

- [已安装MetaMask并连接到Moonbase Alpha](tokens/connect/metamask/){target=\_blank}
- 一个有DEV代币的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### 创建随机数生成器合约 {: #create-random-generator-contract }

本节将要创建的合约包含您请求随机性以及使用满足随机性请求的结果所需的最低限度的函数。

**此合约仅用于教育目的，不适用于生产用途。**

此合约将包含以下函数：

- 接受请求随机性所需的存款的构造函数
- 提交随机性请求的函数。在此示例中，随机性来源将是本地 VRF，但您可以轻松修改合约以使用 BABE 时间片随机性
- 通过调用 Randomness Precompile 的 `fulfillRequest` 函数来满足请求的函数。此函数将是 `payable`，因为履行费用需要在请求随机性时提交
- 使用履行结果的函数。此函数的签名必须与 [Randomness Consumer 合约的 `fulfillRandomWords` 方法的签名](#:~:text=fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)) 匹配

事不宜迟，合约如下：

```solidity
--8<-- 'code/builders/ethereum/precompiles/features/randomness/RandomNumber.sol'
```

如您所见，合约中还有一些常量可以根据您的需要进行编辑，尤其是 `SALT_PREFIX`，它可以用于生成唯一的结果。

在以下各节中，您将使用 Remix 来部署合约并与之交互。

### Remix设置 {: #remix-set-up}

若要将合约添加到Remix并遵循本教程的这一部分，您需要在Remix中创建一个名为 `RandomnessNumber.sol` 的新文件，并将 `RandomNumber` 合约粘贴到该文件中。

![将随机数生成器合约添加到Remix。](/images/builders/ethereum/precompiles/features/randomness/randomness-2.webp)

### 编译和部署随机数生成器合约 {: #compile-deploy-random-number }

要在 Remix 中编译 `RandomNumber.sol` 合约，您需要执行以下步骤：

1. 点击从顶部数第二个的 **Compile（编译）** 选项卡
2. 点击 **Compile RandomNumber.sol（编译 RandomNumber.sol）** 按钮

如果合约编译成功，您将在 **Compile（编译）** 选项卡旁边看到一个绿色复选标记。

![在 Remix 中编译随机数生成器合约。](/images/builders/ethereum/precompiles/features/randomness/randomness-3.webp)

现在，您可以按照以下步骤继续部署合约：

1. 点击 **Compile（编译）** 选项卡正下方的 **Deploy and Run（部署和运行）** 选项卡
2. 确保在 **ENVIRONMENT（环境）** 下拉菜单中选择了 **Injected Provider - Metamask（注入提供程序 - Metamask）**。选择 **Injected Provider - Metamask（注入提供程序 - Metamask）** 后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保在 **ACCOUNT（帐户）** 下显示了正确的帐户
4. 在 **VALUE（值）** 字段中输入存款金额，即 `{{ networks.moonbase.randomness.req_deposit_amount.wei }}` Wei（`{{ networks.moonbase.randomness.req_deposit_amount.dev }}` 以太币）
5. 确保在 **CONTRACT（合约）** 下拉菜单中选择了 **RandomNumber - RandomNumber.sol**
6. 点击 **Deploy（部署）**
7. 点击 **Confirm（确认）** 以确认出现的 MetaMask 交易

![在 Remix 中部署随机数生成器合约。](/images/builders/ethereum/precompiles/features/randomness/randomness-4.webp)

**RANDOMNUMBER** 合约将出现在 **Deployed Contracts（已部署的合约）** 列表中。

### 提交生成随机数的请求 {: #request-randomness }

要请求随机数，您需要使用合约的 `requestRandomness` 函数，这将要求您提交由随机数预编译定义的押金。您可以通过以下步骤提交随机数请求并支付押金：

1. 在 **VALUE** 字段中输入履行费的金额，它必须等于或大于 `RandomNumber` 合约中指定的最低费用，即 `15000000` Gwei。
2. 展开 **RANDOMNUMBER** 合约
3. 单击 **requestRandomness** 按钮
4. 在 MetaMask 中确认交易

![使用 Remix 中的随机数生成器合约请求随机数。](/images/builders/ethereum/precompiles/features/randomness/randomness-5.webp)

提交交易后，`requestId` 将使用请求的 ID 进行更新。您可以使用随机数合约的 `requestId` 调用来获取请求 ID，并使用随机数预编译的 `getRequestStatus` 函数来检查此请求 ID 的状态。

### 履行请求并保存随机数 {: #fulfill-request-save-number }

提交随机性请求后，您需要等待延迟时间才能履行请求。对于 `RandomNumber.sol` 合约，延迟设置为随机性预编译中定义的最小区块延迟，即 {{ networks.moonbase.randomness.min_vrf_blocks_delay }} 个区块。您还必须在为时过晚之前履行请求。对于本地 VRF，请求在 {{ networks.moonbase.randomness.block_expiration }} 个区块后过期，对于 BABE epoch 随机性，请求在 {{ networks.moonbase.randomness.epoch_expiration }} 个 epoch 后过期。

假设您已等待了最小区块数（如果您使用的是 BABE epoch 随机性，则为 epoch 数）并且请求尚未过期，您可以按照以下步骤履行请求：

1. 点击 **fulfillRequest** 按钮
2. 在 MetaMask 中确认交易

![使用 Remix 中随机数生成器合约履行随机性请求。](/images/builders/ethereum/precompiles/features/randomness/randomness-6.webp)

一旦请求被履行，您可以检查生成的随机数：

1. 展开 **random** 函数
2. 由于合约只请求了一个随机词，您可以通过访问 `random` 数组的 `0` 索引来获取随机数
3. 点击 **call**
4. 随机数将出现在 **call** 按钮下方

![检索由 Remix 中随机数合约生成的随机数。](/images/builders/ethereum/precompiles/features/randomness/randomness-7.webp)

成功履行后，多余的费用和存款将发送到指定的退款地址。

如果请求在可以履行之前过期，您可以直接与 Randomness Precompile 交互以清除请求并解锁存款和费用。请参阅以下部分，了解如何执行此操作的说明。

## 使用 Remix 直接与随机数预编译合约交互 {: #interact-directly }

除了通过智能合约与随机数预编译合约交互之外，您还可以在 Remix 中直接与它交互，以执行诸如创建随机数请求、检查请求状态和清除过期请求等操作。请记住，您需要有一个继承自消费者合约的合约才能满足请求，因此，如果您使用预编译合约直接满足请求，将无法使用结果。

### Remix 设置 {: #remix-set-up }

要将接口添加到 Remix 并按照本教程的这一部分进行操作，您需要：

1. 获取 [`Randomness.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=\_blank} 的副本
2. 将文件内容粘贴到名为 **Randomness.sol** 的 Remix 文件中

![将预编译添加到 Remix](/images/builders/ethereum/precompiles/features/randomness/randomness-8.webp)

### 编译与访问随机数预编译 {: #compile-randomness }

接下来，您需要在 Remix 中编译 `Randomness.sol` 文件。首先，请确保您已打开 **Randomness.sol** 文件，并按照以下步骤操作：

1. 点击从上往下的第二个 **Compile** 选项卡
2. 要编译合约，请点击 **Compile Randomness.sol**

如果合约编译成功，您将在 **Compile** 选项卡旁边看到一个绿色对勾。

您将通过预编译合约的地址访问接口，而不是部署随机数预编译：

1. 点击 Remix 中 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡。请注意，预编译合约已经部署
2. 确保在 **ENVIRONMENT** 下拉菜单中选中 **Injected Provider - Metamask**。选择后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保在 **ACCOUNT** 下显示正确的帐户
4. 确保在 **CONTRACT** 下拉菜单中选中 **Randomness - Randomness.sol**。由于这是一个预编译合约，因此无需部署任何代码。相反，我们将在 **At Address** 字段中提供预编译的地址
5. 提供批量预编译的地址：`{{ networks.moonbase.precompiles.randomness }}`，然后点击 **At Address**

![访问地址](/images/builders/ethereum/precompiles/features/randomness/randomness-9.webp)

**RANDOMNESS** 预编译将显示在 **Deployed Contracts** 列表中。您将使用它来满足本教程后面从彩票合约发出的随机性请求。

### 获取请求状态和清除过期请求 {: #get-request-status-and-purge }

任何人都可以清除过期的请求。您不需要是请求随机数的人就可以清除它。当您清除过期的请求时，请求费用将转移给您，并且请求的存款将退还给原始请求者。

要清除请求，首先必须确保请求已过期。为此，您可以使用预编译的 `getRequestStatus` 函数来验证请求的状态。从该调用返回的数字对应于 [`RequestStatus`](#enums) 枚举中值的索引。因此，您需要验证返回的数字是否为 `3`，表示 `Expired`（已过期）。

验证请求已过期后，您可以调用 `purgeExpiredRequest` 函数来清除该请求。

要验证和清除请求，您可以采取以下步骤：

1. 展开 **RANDOMNESS** 合约
2. 输入您要验证是否过期的请求的请求 ID，然后单击 **getRequestStatus**
3. 响应将显示在函数正下方。验证您是否收到 `3`
4. 展开 **purgeExpiredRequest** 函数并输入请求 ID
5. 点击 **transact**
6. MetaMask 将弹出，您可以确认交易

![清除已过期的请求](/images/builders/ethereum/precompiles/features/randomness/randomness-10.webp)

交易完成后，您可以通过使用相同的请求 ID 再次调用 **getRequestStatus** 函数来验证请求是否已被清除。您应该收到状态 `0`，即 `DoesNotExist`（不存在）。您还可以期望请求费用的金额转移到您的帐户。
