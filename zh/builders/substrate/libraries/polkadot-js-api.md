---
title: 如何使用 Polkadot.js API
description: 了解如何使用 Polkadot.js API 与 Moonbeam 节点交互，以获取链数据并通过 Moonbeam 的 Substrate 端发送交易（外部调用）。
categories: Substrate Toolkit, Libraries and SDKs
---

# Polkadot.js API 库

## 简介 {: #introduction }

[Polkadot.js](https://wiki.polkadot.com/general/polkadotjs/){target=_blank} 是一系列工具，可让您与 Polkadot 及其平行链（如 Moonbeam）进行交互。[Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank} 是 Polkadot.js 的一个组件，是一个库，允许应用程序开发人员查询 Moonbeam 节点，并使用 JavaScript 与节点的 Substrate 接口进行交互，从而使您可以读取数据和将数据写入网络。

您可以使用 Polkadot.js API 查询链上数据，并从 Moonbeam 的 Substrate 端发送外部因素。您可以查询 Moonbeam 的运行时常量、链状态、事件、交易（外部）数据等。

在这里，您将找到可用功能的概述和一些常用代码示例，以帮助您开始使用 Polkadot.js API 库与 Moonbeam 网络进行交互。

## 检查先决条件 {: #checking-prerequisites }

安装和使用 Polkadot.js API 库需要安装 Node.js。

--8<-- 'text/_common/install-nodejs.md'

--8<-- 'text/_common/endpoint-examples.md'

### 安装 Polkadot.js API {: #installing-polkadot.js-api-library }

首先，您需要通过诸如 `yarn` 之类的包管理器为您的项目安装 Polkadot.js API 库。使用以下命令将其安装在您的项目目录中：

===

    bash
    npm i @polkadot/api
    

===

    bash
    yarn add @polkadot/api
    

该库还包括其他核心组件，如用于帐户管理的 Keyring，或本指南中使用的某些实用程序。

## 创建 API 提供程序实例 {: #creating-an-API-provider-instance }

类似于[以太坊 API 库](/builders/ethereum/libraries/){target=_blank}，您必须首先实例化 Polkadot.js API 的 API 实例。使用您希望与之交互的 Moonbeam 网络的 WebSocket 端点创建 `WsProvider`。

--8<-- 'text/_common/endpoint-examples.md'

===

    javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    

===

    javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    

===

    javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    

===

    javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();

### 元数据和动态 API 装饰 {: #metadata-and-dynamic-api-decoration }

在深入了解如何通过 Polkadot.js API 库执行不同任务的细节之前，了解该库的一些基本工作原理非常有用。

当 Polkadot.js API 连接到节点时，它首先要做的事情之一是检索元数据，并根据元数据信息装饰 API。元数据有效地以以下形式提供数据：

text
api.<类型>.<模块>.<部分>

其中 `<类型>` 可以是：

- `query` - 用于读取所有状态查询的端点
- `tx` - 用于与交易相关的端点
- `rpc` - 用于特定于 RPC 调用的端点
- `consts` - 用于特定于运行时常量的端点

因此，`api.{query, tx, rpc, consts}.<module>.<method>` 端点中包含的任何信息都没有在 API 中进行硬编码。这允许像 Moonbeam 这样的平行链通过其 pallet 拥有自定义端点，这些端点可以直接通过 Polkadot.js API 库访问。

## 查询 Moonbeam 上的链上数据 {: #querying-for-information }

在本节中，您将学习如何使用 Polkadot.js API 库查询链上信息。

### Moonbeam 链状态查询 {: #state-queries }

这类查询检索与链的当前状态相关的信息。这些端点通常采用 `api.query.<module>.<method>` 的形式，其中模块和方法装饰通过元数据生成。您可以通过检查 `api.query` 对象来查看所有可用端点的列表，例如通过：

javascript
console.log(api.query);

假设您已[初始化 API](#creating-an-API-provider-instance)，这是一个检索给定地址的基本帐户信息的代码示例：

javascript
// Define wallet address
const addr = 'INSERT_ADDRESS';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

console.log(
  `${now}: balance of ${balance.free} and a current nonce of ${nonce}`
);

??? code "View the complete script"

    js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/state-queries.js'

### Moonbeam RPC 查询 {: #rpc-queries }

RPC 调用为节点之间的数据传输提供了主干。这意味着所有 API 端点（如 `api.query`、`api.tx` 或 `api.derive`）都只是对 RPC 调用的包装，以节点期望的编码格式提供信息。您可以通过检查 `api.rpc` 对象来查看所有可用端点的列表，例如通过：

javascript
console.log(api.rpc);

`api.rpc` 接口遵循与 `api.query` 类似的格式，例如：

javascript
// 检索链名称
const chain = await api.rpc.system.chain();

// 检索最新的标头
const lastHeader = await api.rpc.chain.getHeader();

// 记录信息
console.log(
  `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
);

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/rpc-queries.js'

### 查询订阅 {: #query-subscriptions }

`rpc` API 也为订阅提供了端点。您可以调整前面的示例，开始使用订阅来侦听新区块。请注意，使用订阅时需要删除 API 断开连接，以避免 WSS 连接的正常关闭。

javascript
// 检索链名称
const chain = await api.rpc.system.chain();

// 订阅新区块头
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(
    `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
  );
});
// 删除 await api.disconnect()!

`api.rpc.subscribe*` 函数的通用模式是将回调传递到订阅函数中，这将会在每次导入新条目时触发。

`api.query.*` 下的其他调用可以以类似的方式进行修改以使用订阅，包括具有参数的调用。以下是如何订阅帐户中的余额更改的示例：

javascript
// 定义钱包地址
const addr = 'INSERT_ADDRESS';

// 订阅指定帐户的余额更改
await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(
    `Free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
  );
});

// 删除 await api.disconnect()!

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/query-subscriptions.js'

## 为 Moonbeam 账户创建一个密钥环 {: #keyrings }

密钥环对象用于维护密钥对以及任何数据的签名，无论是转账、消息还是合约交互。

### 创建密钥环实例 {: #creating-a-keyring-instance }

您可以通过仅创建 Keyring 类的实例，并指定所使用的默认钱包地址类型来创建实例。对于 Moonbeam 网络，默认钱包类型应为 `ethereum`。

javascript
// 根据需要导入密钥环
import Keyring from '@polkadot/keyring';

// 创建密钥环实例
const keyring = new Keyring({ type: 'ethereum' });

### 向密钥环添加帐户 {: #adding-accounts }

有多种方法可以将帐户添加到密钥环实例，包括从助记词和简短格式的私钥。

===

    javascript
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/adding-accounts-mnemonic.js'
    

===

    javascript
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/adding-accounts-private-key.js'

## Dry Run API {: #dry-run-api }

Dry Run API 是一种简便的方法，用于测试调用的完整性，而不会产生任何交易费用。可以从 Polkadot.js Apps 的**开发者**部分的[运行时调用](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/runtime){target=_blank}选项卡访问 Dry Run API。虽然 Dry Run API 主要用于[测试 XCM 消息](/builders/interoperability/xcm/send-execute-xcm/#test-an-xcm-message-with-the-dry-run-api){target=_blank}，但它也可用于测试任何任意调用。

此方法将 origin 和调用数据作为参数，并返回执行结果和其他事件数据。

```javascript
const testAccount = api.createType(
  'AccountId20',
  '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
);
const callData =
  '0x030088bce0b038effa09e58fe6d24fde4b5af21aa79813000064a7b3b6e00d';
const callDataU8a = hexToU8a(callData);

const result = await api.call.dryRunApi.dryRunCall(
  { system: { Signed: testAccount } },
  callDataU8a
);
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/dry-run.js'
    ```

调用 Dry Run API 后，此方法会告诉您调用是否会成功，并返回如果实际在链上提交调用将发出的事件数据。您可以在下面查看 `dryRunCall` 的初始输出。

??? code "查看完整的输出"

{
  "source_path": "builders/substrate/libraries/polkadot-js-api.md",
  "source_language": "EN",
  "target_language": "ZH",
  "checksum": "850323592f4d56f92a6e4ce65731f34a6cf6f773744d22a3ea1996b2dda1de7f",
  "content": "## Send Transactions on Moonbeam  {: #transactions }\n\nTransaction endpoints are exposed on endpoints generally of the form `api.tx.<module>.<method>`, where the module and method decorations are generated through metadata. These allow you to submit transactions for inclusion in blocks, be it transfers, interacting with pallets, or anything else Moonbeam supports. You can see a list of all available endpoints by examining the `api.tx` object, for example via:\n\n```javascript
console.log(api.tx);

### 发送交易 {: #sending-basic-transactions }

Polkadot.js API 库可用于将交易发送到网络。例如，假设您已[初始化 API](#creating-an-API-provider-instance) 和 [密钥环实例](#creating-a-keyring-instance)，则可以使用以下代码段发送基本交易（此代码示例还将检索交易的编码调用数据，以及提交后的交易哈希）：

```javascript
// 初始化钱包密钥对
const alice = keyring.addFromUri('INSERT_ALICES_PRIVATE_KEY');
const bob = 'INSERT_BOBS_ADDRESS';

// 形成交易
const tx = await api.tx.balances.transferAllowDeath(bob, 12345n);

// 检索交易的编码调用数据
const encodedCalldata = tx.method.toHex();
console.log(`Encoded calldata: ${encodedCallData}`);

// 签名并发送交易
const txHash = await tx
  .signAndSend(alice);

// 显示交易哈希
console.log(`Submitted with hash ${txHash}`);
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/basic-transactions.js'
    ```

!!! note
    在客户端 v0.35.0 之前，用于执行简单余额转移的外部函数是 `balances.transfer` 外部函数。此后，它已被弃用，并替换为 `balances.transferAllowDeath` 外部函数。

请注意，`signAndSend` 函数还可以接受可选参数，例如 `nonce`。例如，`signAndSend(alice, { nonce: aliceNonce })`。您可以使用 [状态查询](/builders/substrate/libraries/polkadot-js-api/#state-queries){target=_blank} 部分中的[示例代码]来检索正确的 nonce，包括内存池中的交易。

{
  "source_path": "builders/substrate/libraries/polkadot-js-api.md",
  "source_language": "EN",
  "target_language": "ZH",
  "checksum": "850323592f4d56f92a6e4ce65731f34a6cf6f773744d22a3ea1996b2dda1de7f",
  "content": "### Fee Information {: #fees }\n\nThe transaction endpoint also offers a method to obtain weight information for a given `api.tx.<module>.<method>`. To do so, you'll need to use the `paymentInfo` function after having built the entire transaction with the specific `module` and `method`.\n\nThe `paymentInfo` function returns weight information in terms of `refTime` and `proofSize`, which can be used to determine the transaction fee. This is extremely helpful when crafting [remote execution calls via XCM](/builders/interoperability/xcm/remote-execution/){target=\_blank}.\n\nFor example, assuming you've [initialized the API](#creating-an-API-provider-instance), the following snippet shows how you can get the weight information for a simple balance transfer between two accounts:\n\n```javascript
// Transaction to get weight information
const tx = api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345));

// Get weight info
const { partialFee, weight } = await tx.paymentInfo('INSERT_SENDERS_ADDRESS');

console.log(`Transaction weight: ${weight}`);
console.log(`Transaction fee: ${partialFee.toHuman()}`);

### 交易事件 {: #transaction-events }

任何交易都会发出事件，至少对于特定交易，始终会发出 `system.ExtrinsicSuccess` 或 `system.ExtrinsicFailed` 事件。这些事件提供了交易的整体执行结果，即执行成功或失败。

根据发送的交易，可能会发出其他事件，例如，对于余额转移事件，可能包括一个或多个 `balance.Transfer` 事件。

Transfer API 页面包含一个[示例代码段](/learn/core-concepts/transfers-api/#monitor-all-balance-transfers-with-the-substrate-api){target=\_blank}，用于订阅新的已完成区块头并检索所有 `balance.Transfer` 事件。

### 批量交易 {: #batching-transactions }

Polkadot.js API 允许通过 `api.tx.utility.batch` 方法批量处理交易。批量交易会从单个发送者依次处理。交易费用可以使用 `paymentInfo` 辅助方法进行估算。

例如，假设您已[初始化 API](#creating-an-API-provider-instance)、一个 [密钥环实例](#creating-a-keyring-instance) 并[添加了一个帐户](#adding-accounts)，以下示例进行了几个转账，并且还使用了 `api.tx.parachainStaking` 模块来安排一个请求，以减少特定 collator 候选者的绑定：

javascript
// Construct a list of transactions to batch
const collator = 'INSERT_COLLATORS_ADDRESS';
const txs = [
  api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345)),
  api.tx.balances.transferAllowDeath('INSERT_CHARLEYS_ADDRESS', BigInt(12345)),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, BigInt(12345)),
];

// Estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair)
const info = await api.tx.utility.batch(txs).paymentInfo(alice);

console.log(`Estimated fees: ${info}`);

// Construct the batch and send the transactions
api.tx.utility.batch(txs).signAndSend(alice, ({ status }) => {
  if (status.isInBlock) {
    console.log(`included in ${status.asInBlock}`);

    // Disconnect API here!
  }
});

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/batch-transactions.js'
    

!!! note
    您可以通过将 `console.log(api.tx.parachainStaking);` 添加到您的代码中来查看 `parachainStaking` 模块的所有可用函数。

## Substrate 和自定义 JSON-RPC 端点 {: #substrate-and-custom-json-rpc-endpoints }

RPC 作为特定模块上的方法公开。这意味着一旦可用，您就可以通过 `api.rpc.<module>.<method>(...params[])` 调用任何 RPC。这也适用于使用 Polkadot.js API 访问以太坊 RPC，格式为 `polkadotApi.rpc.eth.*`。

通过 Polkadot.js API 接口提供的一些方法也可以在 Moonbeam 节点上作为 JSON-RPC 端点使用。本节将提供一些示例；您可以通过调用 `api.rpc.rpc.methods()` 或下面列出的 `rpc_methods` 端点来检查公开的 RPC 端点列表。

- **[`methods()`](https://polkadot.js.org/docs/substrate/rpc/#methods-rpcmethods){target=_blank}**
    - **接口** - `api.rpc.rpc.methods`
    - **JSON-RPC** - `rpc_methods`
    - **返回值** - 节点公开的 RPC 方法列表

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"rpc_methods",
        "params": []
      }'
    ```

- **[`getBlock(hash?: BlockHash)`](https://polkadot.js.org/docs/substrate/rpc/#getblockhash-blockhash-signedblock){target=_blank}**
    - **接口** - `api.rpc.chain.getBlock`
    - **JSON-RPC** - `chain_getBlock`
    - **返回值** - 由块哈希参数指定的块的头部和主体

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getBlock",
        "params": ["0x870ad0935a27ed8684048860ffb341d469e091abc2518ea109b4d26b8c88dd96"]
      }'
    ```

- **[`getFinalizedHead()`](https://polkadot.js.org/docs/substrate/rpc/#getfinalizedhead-blockhash){target=_blank}**
    - **接口** `api.rpc.chain.getFinalizedHead`
    - **JSON-RPC** `chain_getFinalizedHead`
    - **返回值** 规范链中最后一个最终确定块的块哈希值

    ```bash
      curl --location --request POST '{{ networks.moonbase.rpc_url }}' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getHeader",
        "params": []
      }'
    ```

[共识和最终性页面](/learn/core-concepts/consensus-finality/){target=_blank} 包含用于使用公开的自定义和 Substrate RPC 调用来检查给定交易的最终性的示例代码。

## Polkadot.js API 实用程序函数 {: #utilities }

Polkadot.js API 还包括许多实用程序库，用于计算常用的加密原语和哈希函数。

以下示例通过首先计算其 RLP（[递归长度前缀](https://ethereum.org/developers/docs/data-structures-and-encoding/rlp/){target=_blank}）编码，然后使用 keccak256 对结果进行哈希，来计算原始以太坊旧版交易的确定性交易哈希。

```javascript
import { encode } from '@polkadot/util-rlp';
import { keccakAsHex } from '@polkadot/util-crypto';
import { numberToHex } from '@polkadot/util';

// Define the raw signed transaction
const txData = {
  nonce: numberToHex(1),
  gasPrice: numberToHex(21000000000),
  gasLimit: numberToHex(21000),
  to: '0xc390cC49a32736a58733Cf46bE42f734dD4f53cb',
  value: numberToHex(1000000000000000000),
  data: '',
  v: '0507',
  r: '0x5ab2f48bdc6752191440ce62088b9e42f20215ee4305403579aa2e1eba615ce8',
  s: '0x3b172e53874422756d48b449438407e5478c985680d4aaa39d762fe0d1a11683',
};

// Extract the values to an array
var txDataArray = Object.keys(txData).map(function (key) {
  return txData[key];
});

// Calculate the RLP encoded transaction
var encoded_tx = encode(txDataArray);

// Hash the encoded transaction using keccak256
console.log(keccakAsHex(encoded_tx));
```

您可以查看相应的 [NPM 存储库页面](https://www.npmjs.com/package/@polkadot/util-crypto/v/0.32.19){target=_blank}，以获取 `@polkadot/util-crypto` 库中可用方法及其描述的列表。

--8<-- 'text/_disclaimers/third-party-content.md'
