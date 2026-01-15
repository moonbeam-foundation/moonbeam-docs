---
title: 发送、执行和测试 XCM 消息
description: 构建自定义 XCM 消息，使用 XCM Dry Run API 验证其构造和完整性，然后在 Moonbeam 上本地执行它以观察结果。
categories: XCM
---

# 发送、执行和测试 XCM 消息

## 简介 {: #introduction }

XCM 消息由一系列[指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}组成，这些指令由跨共识虚拟机（XCVM）执行。这些指令的组合会产生预定的操作，例如跨链代币转移。您可以通过组合各种 XCM 指令来创建自己的自定义 XCM 消息。

诸如 [Polkadot XCM](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank} 和 [XCM Transactor](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=_blank} 之类的 Pallet 提供了具有预定义 XCM 指令集的功能，以发送 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} 或通过 XCM 在其他链上远程执行。但是，为了更好地了解组合不同 XCM 指令的结果，您可以在 Moonbeam 上本地构建和执行自定义 XCM 消息（仅在 Moonbase Alpha 上可用）。您还可以将自定义 XCM 消息发送到另一个链（该链将以 [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} 指令开头）。尽管如此，为了成功执行 XCM 消息，目标链需要能够理解这些指令。

要执行或发送自定义 XCM 消息，您可以直接使用 [Polkadot XCM Pallet](#polkadot-xcm-pallet-interface) 或通过以太坊 API 使用 [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=_blank}。在本指南中，您将学习如何使用这两种方法在 Moonbase Alpha 上本地执行和发送自定义构建的 XCM 消息。

本指南假定您熟悉一般的 XCM 概念，例如[通用 XCM 术语](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank}和 [XCM 指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}。有关更多信息，您可以查看 [XCM 概述](/builders/interoperability/xcm/overview/){target=_blank} 文档。

## Polkadot XCM Pallet 接口 {: #polkadot-xcm-pallet-interface }

### 外在函数 {: #extrinsics }

Polkadot XCM Pallet 包含以下相关的外在函数（函数）：

???+ function "**execute**(message, maxWeight) — **仅在 Moonbase Alpha 上支持** - 在源链上执行自定义 XCM 消息"

    === "参数"

        - `message` - 要执行的 SCALE 编码的版本化 XCM 消息
        - `maxWeight` - 允许消耗的最大权重，通过指定以下内容来定义：
            - `refTime` - 可用于执行的计算时间量
            - `proofSize` - 可以使用的存储量（以字节为单位）

    === "Polkadot.js API 示例"
        
        js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/execute.js'
        

???+ function "**send**(dest, message) — **仅在 Moonbase Alpha 上支持** - 将自定义 XCM 消息发送到目标链。为了成功执行 XCM 消息，目标链需要能够理解消息中的指令"

    === "参数"

        - `dest` - XCM 版本化的多位置，表示生态系统中 XCM 消息发送到的链（目标链）
        - `message` - 要执行的 SCALE 编码的版本化 XCM 消息

    === "Polkadot.js API 示例"
        
        js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/send.js'

### 存储方法 {: #storage-methods }

Polkadot XCM Pallet 包含以下相关的只读存储方法：

???+ function "**assetTraps**(hash) — 返回给定 asset 的哈希值，asset 被捕获的次数"

    === "参数"

        `hash` - (可选) [`Asset`](https://github.com/paritytech/xcm-format#6-universal-asset-identifiers){target=_blank} 的 Blake2-256 哈希值

    === "返回值"

        asset 被捕获的次数。如果省略了哈希值，则返回所有哈希值的数组以及每个 asset 被捕获的次数。

        js
        // 如果使用 Polkadot.js API 并在该值上调用 toJSON()
        // 如果提供了哈希值：
        10

        // 如果省略了哈希值：
        [
          [
            0xf7d4341888be30c6a842a77c52617423e8109aa249e88779019cf731ed772fb7
          ],
          10
        ],
        ...
        

    === "Polkadot.js API 示例"

        js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/assets-trapped.js'
        

??? function "**palletVersion**() — 从存储返回当前 pallet 版本"

    === "参数"

        无

    === "返回值"

        一个表示 pallet 当前版本的数字。

        js
        // 如果使用 Polkadot.js API 并在解包的值上调用 toJSON()
        0
        

    === "Polkadot.js API 示例"

        js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/pallet-version.js'

## 检查先决条件 {: #checking-prerequisites }

要继续学习本指南，您需要以下内容：

- 您的帐户必须有 DEV 代币。
  --8<-- 'text/_common/faucet/faucet-list-item.md'

## 在本地执行 XCM 消息 {: #execute-an-xcm-message-locally }

本指南的这一部分介绍了通过两种不同的方法构建要在本地（即在 Moonbeam 中）执行的自定义 XCM 消息的过程：Polkadot XCM Pallet 的 `execute` 函数和 [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=_blank} 的 `xcmExecute` 函数。此功能为您提供了一个试验场，可以试验不同的 XCM 指令，并亲身了解这些实验的结果。这还可以帮助您确定 Moonbeam 上给定 XCM 消息相关的[费用](/builders/interoperability/xcm/core-concepts/weights-fees/){target=_blank}。

在下面的示例中，您将把 DEV 代币从 Moonbase Alpha 上的一个帐户转移到另一个帐户。为此，您将构建一个包含以下 XCM 指令的 XCM 消息，这些指令在本地执行（在本例中，在 Moonbase Alpha 上）：

 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=_blank} - 移除资产并将其放入持有寄存器
 - [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank} - 从持有寄存器中移除资产并将等效资产存入受益人帐户

!!! note
    通常，当您将 XCM 消息跨链发送到目标链时，需要 [`BuyExecution` 指令](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} 来支付远程执行的费用。但是，对于本地执行，此指令不是必需的，因为您已经通过外部函数调用收费。

### 使用 Polkadot.js API 执行 XCM 消息 {: #execute-an-xcm-message-with-polkadotjs-api }

在此示例中，您将使用 Polkadot.js API 在 Moonbase Alpha 上本地执行自定义 XCM 消息，以直接与 Polkadot XCM Pallet 交互。

Polkadot XCM Pallet 的 `execute` 函数接受两个参数：`message` 和 `maxWeight`。您可以按照以下步骤开始组装这些参数：

1. 构建 `WithdrawAsset` 指令，这将要求您定义：
    - Moonbase Alpha 上 DEV 令牌的多重地址
    - 要转移的 DEV 令牌数量

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:7:14'
    ```

2. 构建 `DepositAsset` 指令，这将要求您定义：
    - DEV 令牌的资产标识符。您可以使用 [`WildAsset` 格式](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers){target=_blank}，它允许通配符匹配，以识别资产
    - Moonbase Alpha 上受益人账户的多重地址

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:15:35'
    ```

3. 将 XCM 指令合并到版本化的 XCM 消息中：

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:36:36'
    ```

4. 指定 `maxWeight`，其中包括您需要定义的 `refTime` 和 `proofSize` 的值。您可以通过将 XCM 消息作为参数提供给 [`xcmPaymentApi` 运行时调用](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/runtime){target=_blank}的 `queryXcmWeight` 方法来获取这两个值。

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:37:37'
    ```

现在您已经获得了每个参数的值，您可以编写执行脚本。您将执行以下步骤：

 1. 提供调用的输入数据。这包括：
     - 用于创建提供程序的 Moonbase Alpha 终端节点 URL
     - `execute` 函数的每个参数的值
 2. 创建一个 Keyring 实例，该实例将用于发送交易
 3. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 提供程序
 4. 使用 `message` 和 `maxWeight` 制作 `polkadotXcm.execute` 外部函数
 5. 使用 `signAndSend` 外部函数和您在第二步中创建的 Keyring 实例发送交易

!!! remember
    这仅用于演示目的。切勿将私钥存储在 JavaScript 文件中。

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js'
```

!!! note
    您可以在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1c030408000400010403001300008a5d784563010d010204000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e007803822b001ba2e0100){target=_blank} 上查看上述脚本的示例，该脚本将 1 DEV 发送到 Moonbase Alpha 上的 Bob 帐户，使用以下编码的 calldata：`0x1c030408000400010403001300008a5d784563010d010204000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e007803822b001ba2e0100`。

交易处理完毕后，应从 Alice 的帐户中扣除 0.1 DEV 令牌以及相关的 XCM 费用，并且目标帐户应已在其帐户中收到 0.1 DEV 令牌。将发出一个 `polkadotXcm.Attempted` 事件，其中包含结果。

## 使用 Dry Run API 测试 XCM 消息 {: #test-an-xcm-message-with-the-dry-run-api }

XCM Dry Run API 是一种简单方便的方式来测试 XCM 消息的完整性，而无需产生任何交易费用。XCM Dry Run API 可以从 Polkadot.js Apps 的 **Developer** 部分的 [Runtime Calls](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/runtime){target=_blank} 标签页进行访问。

### Dry Run Call API 方法 {: #dry-run-call-api-method }

此方法将 origin 和调用数据作为参数，并返回执行结果、实际权重和事件数据。

javascript
const testAccount = api.createType(
  'AccountId20',
  '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
);
const callData =
  '0x1c030408000400010403001300008a5d784563010d010204000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e007803822b001ba2e0100';
const callDataU8a = hexToU8a(callData);

const result = await api.call.dryRunApi.dryRunCall(
  { system: { Signed: testAccount } },
  callDataU8a
);

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/dry-run/dry-run-call.js'
    

调用 XCM Dry Run API 后，该方法将告诉您调用是否会成功，并返回如果实际在链上提交调用将会发出的事件数据。您可以在下面查看`dryRunCall`的初始输出。

??? code "查看完整输出"

    
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/dry-run/dry-run-call-return-data.json'

### Dry Run XCM API 方法 {: #dry-run-xcm-api-method }

XCM Dry Run API 的 `dryRunXCM` 方法将完整的 XCM 消息作为参数，而不是编码的调用，以及消息的来源。

`dryRunXCM` 将来源和 XCM 消息作为参数，并返回执行结果、实际权重和事件数据。

javascript
// 定义来源
const origin = { V4: { parents: 1, interior: 'Here' } };

const message = []; // 在此处插入 XCM 消息

// 执行 dry run XCM 调用
const result = await api.call.dryRunApi.dryRunXcm(origin, message);

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/dry-run/dry-run-xcm.js'
    

调用 XCM Dry Run API 后，该方法将告诉您调用是否成功，并返回如果 XCM 实际在链上提交将发出的事件数据。您可以在下面查看 `dryRunXCM` 的初始输出。

??? code "查看完整输出"

    
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/dry-run/dry-run-xcm-return-data.json'

## 使用 XCM Utilities Precompile 执行 XCM 消息 {: #execute-xcm-utils-precompile }

在本节中，您将使用[XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=_blank}的 `xcmExecute` 函数，该函数仅在 Moonbase Alpha 上受支持，以在本地执行 XCM 消息。XCM Utilities Precompile 位于以下地址：

```text
{{ networks.moonbase.precompiles.xcm_utils }}
```

在底层，XCM Utilities Precompile 的 `xcmExecute` 函数调用 Polkadot XCM Pallet 的 `execute` 函数，这是一个用 Rust 编写的 Substrate pallet。使用 XCM Utilities Precompile 调用 `xcmExecute` 的好处是，您可以通过 Ethereum API 进行调用，并使用 [Ethereum libraries](/builders/ethereum/libraries/){target=_blank}，例如 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank}。

`xcmExecute` 函数接受两个参数：要执行的 SCALE 编码的版本化 XCM 消息和要消耗的最大权重。

首先，您将学习如何生成编码后的 calldata，然后您将学习如何使用编码后的 calldata 与 XCM Utilities Precompile 交互。

### 生成 XCM 消息的编码 Calldata {: #generate-encoded-calldata }

要获取 XCM 消息的编码 calldata，您可以创建一个类似于您在 [使用 Polkadot.js API 执行 XCM 消息](#execute-an-xcm-message-with-polkadotjs-api) 部分中创建的脚本。 您将构建消息以获取编码的 calldata，而不是构建消息并发送交易。 您将采取以下步骤：

 1. 提供调用的输入数据。 这包括：
     - 用于创建提供者的 Moonbase Alpha 端点 URL
     - `execute` 函数的每个参数的值，如[使用 Polkadot.js API 执行 XCM 消息](#execute-an-xcm-message-with-polkadotjs-api) 部分中定义的那样
 2. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 提供程序
 3. 使用 `message` 和 `maxWeight` 制作 `polkadotXcm.execute` 外部函数
 4. 使用事务获取编码的 calldata

整个脚本如下：

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/generate-encoded-calldata.js'
```

### 执行 XCM 消息 {: #execute-xcm-message }

现在您已经有了 SCALE 编码的 XCM 消息，您可以使用以下代码片段以编程方式调用 XCM Utilities Precompile 的 `xcmExecute` 函数，使用您选择的 [以太坊库](/builders/ethereum/libraries/){target=_blank}。一般来说，您需要执行以下步骤：

1. 创建 provider 和签名者
2. 创建一个 XCM Utilities Precompile 实例以进行交互
3. 定义 `xcmExecute` 函数所需的参数，这将是 XCM 消息的编码 calldata 和用于执行消息的最大权重。您可以将 `maxWeight` 设置为 `400000000n`，这对应于 `refTime`。`proofSize` 将自动设置为默认值，即 64KB
4. 执行 XCM 消息

!!! remember
    以下代码段仅用于演示目的。切勿将您的私钥存储在 JavaScript 或 Python 文件中。

==="Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/ethers.js'
    ```

==="Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/web3.js'
    ```

==="Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/web3.py'
    ```

就这样！您已成功使用 Polkadot XCM Pallet 和 XCM Utilities Precompile 在 Moonbase Alpha 上本地执行自定义 XCM 消息！

## 跨链发送 XCM 消息 {: #send-xcm-message }

本指南的这一部分介绍了通过两种不同的方法跨链发送自定义 XCM 消息（即，从 Moonbeam 到目标链，如中继链）的过程：Polkadot XCM Pallet 的 `send` 函数和 [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=_blank} 的 `xcmSend` 函数。

要使 XCM 消息成功执行，目标链需要能够理解消息中的指令。如果不能，您将在目标链上看到 `Barrier` 过滤器。出于安全原因，XCM 消息以 [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} 指令开头，以防止代表原始链主权帐户执行 XCM。**本节中的示例由于上述原因将不起作用，仅用于演示目的**。

在下面的示例中，您将构建一个包含以下 XCM 指令的 XCM 消息，这些指令将在 Alphanet 中继链中执行：

 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=_blank} - 移除资产并将其放入持有寄存器
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} - 从持有寄存器中提取资产以支付执行费用。要支付的费用由目标链确定
 - [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank}- 从持有寄存器中移除资产并将等效资产存入受益人帐户

总而言之，这些指令的目的是将中继链的本地资产（Alphanet 中继链的 UNIT）从 Moonbase Alpha 转移到中继链上的一个帐户。此示例仅用于演示目的，向您展示如何跨链发送自定义 XCM 消息。请记住，目标链需要能够理解消息中的指令才能执行它们。

### 使用 Polkadot.js API 发送 XCM 消息 {: #send-xcm-message-with-polkadotjs-api }

在此示例中，您将使用 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 从 Moonbase Alpha 上的帐户向中继链发送自定义 XCM 消息，以直接与 Polkadot XCM Pallet 交互。

Polkadot XCM Pallet 的 `send` 函数接受两个参数：`dest` 和 `message`。您可以按照以下步骤开始组装这些参数：

1. 为 `dest` 构建中继链令牌 UNIT 的多重定位：

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:10:10'
    ```

2. 构建 `WithdrawAsset` 指令，这将需要您定义：
    - 中继链上 UNIT 令牌的多重定位
    - 要提取的 UNIT 令牌数量

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:11:18'
    ```

3. 构建 `BuyExecution` 指令，这将需要您定义：
    - 中继链上 UNIT 令牌的多重定位
    - 为执行购买的 UNIT 令牌数量
    - 权重限制

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:19:27'
    ```

4. 构建 `DepositAsset` 指令，这将需要您定义：
    - UNIT 令牌的资产标识符。您可以使用 [`WildAsset` 格式](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers){target=_blank}，它允许通配符匹配，以标识资产
    - 中继链上受益人帐户的多重定位

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:28:44'
    ```

5. 将 XCM 指令组合成一个版本化的 XCM 消息：

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:45:45'
    ```

现在您已经获得了每个参数的值，您可以编写脚本来发送 XCM 消息。您将采取以下步骤：

 1. 提供调用的输入数据。这包括：
     - 用于创建提供程序的 Moonbase Alpha 终结点 URL
     - `send` 函数的每个参数的值
 2. 创建将用于发送交易的 Keyring 实例
 3. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 提供程序
 4. 使用 `dest` 和 `message` 制作 `polkadotXcm.send` 外部函数
 5. 使用 `signAndSend` 外部函数和您在第二步中创建的 Keyring 实例发送交易

!!! remember
    这仅用于演示目的。切勿将您的私钥存储在 JavaScript 文件中。

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js'
```

!!! note
    您可以在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1c00040100040c0004010000070010a5d4e813010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67){target=_blank} 上查看上述脚本的示例，该脚本将 1 UNIT 发送到 Bob 的中继链帐户，使用以下编码的calldata：`0x1c00040100040c0004010000070010a5d4e813010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`。

交易处理完毕后，将发出一个 `polkadotXcm.sent` 事件，其中包含已发送 XCM 消息的详细信息。

### 使用 XCM Utilities 预编译发送 XCM 消息 {: #send-xcm-utils-precompile }

在本节中，您将使用 [XCM Utilities 预编译](/builders/interoperability/xcm/xcm-utils/){target=_blank} 的 `xcmSend` 函数，该函数仅在 Moonbase Alpha 上受支持，以跨链发送 XCM 消息。XCM Utilities 预编译位于以下地址：

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.xcm_utils }}
     ```

在底层，XCM Utilities 预编译的 `xcmSend` 函数调用 Polkadot XCM Pallet 的 `send` 函数，Polkadot XCM Pallet 是一个用 Rust 编写的 Substrate pallet。使用 XCM Utilities 预编译调用 `xcmSend` 的好处是，您可以通过 Ethereum API 并使用 Ethereum 库（如 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank}）来执行此操作。为了成功执行 XCM 消息，目标链需要能够理解消息中的指令。

`xcmSend` 函数接受两个参数：目标的 multilocation 和要发送的 SCALE 编码的版本化 XCM 消息。

首先，您将学习如何为 XCM 消息生成编码的 calldata，然后您将学习如何使用编码的 calldata 与 XCM Utilities 预编译交互。

#### 生成 XCM 消息的编码 Calldata {: #generate-encoded-calldata }

要获取 XCM 消息的编码 calldata，您可以创建一个类似于您在[使用 Polkadot.js API 发送 XCM 消息](#send-xcm-message-with-polkadotjs-api) 部分中创建的脚本。 您将构建消息以获取编码的 calldata，而不是构建消息并发送交易。 您将采取以下步骤：

 1. 提供调用的输入数据。 这包括：
     - 用于创建提供者的 Moonbase Alpha 端点 URL
     - `send` 函数的每个参数的值，如[使用 Polkadot.js API 发送 XCM 消息](#send-xcm-message-with-polkadotjs-api)部分中所定义
 2. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 提供程序
 3. 使用 `message` 和 `maxWeight` 制作 `polkadotXcm.execute` 外部函数
 4. 使用交易获取编码的 calldata

整个脚本如下：

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/generate-encoded-calldata.js'
```

#### 发送 XCM 消息 {: #send-xcm-message }

在您可以发送 XCM 消息之前，您还需要构建目标的多重位置。在本例中，您将以 Moonbase Alpha 作为原始链来定位中继链：

```js
const dest = [
  1, // Parents: 1
  [] // Interior: Here
];
```

现在您有了 SCALE 编码的 XCM 消息和目标多重位置，您可以使用以下代码片段以编程方式调用 XCM Utilities Precompile 的 `xcmSend` 函数，方法是使用您选择的 [Ethereum 库](/builders/ethereum/libraries/){target=_blank}。一般来说，您需要执行以下步骤：

1. 创建提供者和签名者
2. 创建 XCM Utilities Precompile 的实例以进行交互
3. 定义 `xcmSend` 函数所需的参数，这将是 XCM 消息的目标和编码的 calldata
4. 发送 XCM 消息

!!! remember
    以下代码段仅用于演示目的。切勿将您的私钥存储在 JavaScript 或 Python 文件中。

===

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/ethers.js'
    ```

===

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/web3.js'
    ```

===

    ```py
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/web3.py'
    ```

就是这样！您已成功使用 Polkadot XCM Pallet 和 XCM Utilities Precompile 将消息从 Moonbase Alpha 发送到另一个链！
