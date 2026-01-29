---
title: 使用 0xGasless 进行无 Gas 交易
description: 了解如何在 Moonbeam 上使用 0xGasless 实现无 Gas 交易，使用户无需持有原生代币即可与智能合约交互。
categories: Tutorials
---

# 使用 0xGasless 启用无 Gas 交易

## 为什么需要无 Gas 交易？

区块链开发的主要挑战之一是要求用户持有原生代币（如ETH或GLMR）来支付交易费用。这种传统的基于 EOA 的模型会产生不必要的摩擦，尤其是在引导期望获得类似 Web2 体验的用户时。

无 Gas 交易可以通过账户抽象 ([ERC-4337](https://eips.ethereum.org/EIPS/eip-4337){target=\_blank}) 帮助解决这一问题，实现将用户操作与费用支付分离的元交易。这种架构允许 dApp 或第三方付费方代表用户支付 Gas 费用，而智能合约钱包处理交易执行。[0xGasless](https://0xgasless.com/index.html){target=\_blank} 在其 SDK 中利用了这些原则，使 Moonbeam 开发人员能够实现复杂的功能，如社交登录、交易批处理和自定义钱包控制——所有这些都抽象了最终用户的 Gas 管理复杂性。

在以下教程中，我们将完成在 0xGasless 上设置付费方并将无 Gas 交易分发到 Moonbeam 上的智能合约状态的端到端步骤。

## 创建并资助支付方

首先，您需要在 [0xGasless 上注册一个帐户](https://dashboard.0xgasless.com/auth/sign-in){target=\_blank}。然后，通过按 **创建支付方** 为 Moonbeam 网络 [创建一个支付方](https://dashboard.0xgasless.com/paymaster){target=\_blank}，然后执行以下步骤：

1. 输入您的支付方的名称
2. 选择 **Moonbeam** 作为链
3. 按 **创建**

![创建支付方](/images/tutorials/integrations/0xgasless/0xgasless-1.webp)

您的支付方需要资金来支付赞助交易的 gas 费用。要将 GLMR 存入您的支付方，请执行以下步骤：

1. 输入您要存入的金额
2. 按 **存款** 并在您的钱包中确认交易

![资助支付方](/images/tutorials/integrations/0xgasless/0xgasless-2.webp)

您存入的资金仍然灵活 - 使用它们来赞助无 gas 交易或随时提取它们。

## 调度无Gas交易

在以下部分中，我们将创建一个脚本来演示如何调度无Gas交易。

### 前提条件

在项目的根目录中创建一个包含以下内容的 `.env` 文件：

```bash
--8<-- 'zh/code/tutorials/integrations/0xgasless/5.sh'
```

为什么要在 `.env` 中指定私钥？虽然此交易是无 Gas 的，但您仍然需要一个私钥来签署交易。与此私钥关联的帐户：

- 不需要任何 GLMR 代币
- 不会支付 Gas 费用
- 仅用于交易签名

!!! note 

	永远不要提交您的 .env 文件或分享您的私钥。将 .env 添加到您的 .gitignore 文件中。

另外，请确保您已安装 0xGasless SDK 以及支持的 `ethers` 和 `dotenv` 包：

```bash
--8<-- 'zh/code/tutorials/integrations/0xgasless/4.sh'
```

首先，我们将按如下方式导入所需的包：

```js
--8<-- 'zh/code/tutorials/integrations/0xgasless/3.js'
```

接下来，我们将设置关键常量。我们必须定义 `CHAIN_ID`、`BUNDLER_URL` 和 `PAYMASTER_URL`。您可以从 [0xGasless 仪表板](https://dashboard.0xgasless.com/paymaster){target=\_blank}上的支付方获取唯一的支付方 URL。

我们在此处定义的合约地址是 Moonbeam 上的 [Incrementer 合约](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213) 的地址，我们将调用函数选择器指定的 increment 函数。这个简单的合约将使我们能够轻松地看到无 Gas 交易是否已成功分派。

```js
--8<-- 'zh/code/tutorials/integrations/0xgasless/2.js'
```

!!! warning

    Paymaster URL 格式最近已更改。请使用：

    ```
    https://paymaster.0xgasless.com/v1/1284/rpc/INSERT_API_KEY
    ```

    不要使用已弃用的格式：

    ```
    https://paymaster.0xgasless.com/api/v1/1284/rpc/INSERT_API_KEY
    ```

    区别在于 `/api` 已从路径中删除。请确保您的代码使用当前格式。

### 发送交易

要使用 0xGasless 智能账户发送无 Gas 交易，您可以调用 `smartWallet.sendTransaction()` 并传入两个参数：

 - 包含合约交互细节的 `transaction` 对象
 - 指定 `paymasterServiceData` 且使用 `SPONSORED` 模式的配置对象。这表示 0xGasless 的 paymaster 将使用 gas tank 来支付 gas

该函数会返回一个包含哈希的 UserOperation 响应。您可以使用 `waitForUserOpReceipt()` 辅助函数等待交易回执，该函数会以可配置的超时（默认为 60 秒）轮询交易完成情况。

```javascript
--8<-- 'zh/code/tutorials/integrations/0xgasless/1.js'
```

将这些内容整合在一起，并添加更多日志与错误处理以便调试，完整脚本如下：

??? code "发送无 Gas 交易"
    ```javascript
    --8<-- 'code/tutorials/integrations/0xgasless/dispatch.js'
    ```

### 验证完成

运行脚本后，您会看到如下输出：

--8<-- 'zh/code/tutorials/integrations/0xgasless/output.md'

由于我们发起的无 Gas 交易与 Moonbeam 上的 [Incrementer](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213#readContract){target=\_blank} 智能合约交互，因此很容易检查交易是否成功发起。您可以返回 [Moonscan 上的 Incrementer 合约的读取合约部分](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213#readContract) 并检查存储在合约中的数字。或者，您可以前往**内部交易**选项卡，然后将高级模式切换为**开启**，以查看合约调用递增合约。

有关将对无 Gas 交易的支持集成到您的 dApp 中的更多信息，请务必查看 [0xGasless 文档](https://gitbook.0xgasless.com/){target=\_blank}。

--8<-- 'zh/text/_disclaimers/educational-tutorial.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
