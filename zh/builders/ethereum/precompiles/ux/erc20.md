---
title: Native Token ERC-20 预编译
description: 了解如何通过预编译的 ERC-20 接口访问和与 Moonbeam 上原生代币的 ERC-20 表示进行交互。
keywords: solidity, ethereum, native, token, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---

#  原生代币 ERC-20 预编译

## 简介 {: #introduction }

Moonbeam 上的原生代币 ERC-20 预编译合约允许开发者通过 ERC-20 接口与原生协议代币进行交互。尽管 GLMR 和 MOVR 不是 ERC-20 代币，但现在您可以像与原生 ERC-20 代币交互一样与它们进行交互！

此预编译的主要优势之一是，它消除了将协议代币的包装表示作为 ERC-20 智能合约的必要性，例如以太坊上的 WETH。此外，它可以防止同一协议代币有多个包装表示。因此，需要通过 ERC-20 接口与协议代币交互的 DApp 无需单独的智能合约即可进行操作。

在底层，[ERC-20 预编译](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/src/lib.rs){target=\_blank} 执行与 Substrate 余额 pallet 相关的特定 Substrate 操作，该 pallet 以 Rust 编写。余额 pallet 提供处理 [Moonbeam 上的各种余额类型](/learn/core-concepts/balances/#moonbeam-account-balances){target=\_blank}、设置可用余额、转移余额等功能。

本指南将向您展示如何通过 ERC-20 预编译与 Moonbase Alpha 测试网的原生协议代币 DEV 代币进行交互。您还可以按照并改编本指南，以了解如何将 GLMR 或 MOVR 用作 ERC-20 代币。

预编译位于以下地址：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.erc20 }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.erc20 }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.erc20 }}`

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## ERC-20 Solidity 接口 {: #the-erc20-interface }

Moonbeam 上的 [`ERC20.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank} 接口遵循 [EIP-20 代币标准](https://eips.ethereum.org/EIPS/eip-20){target=\_blank}，该标准是智能合约中代币的标准 API 接口。该标准定义了代币合约必须实现的所需函数和事件，以实现与不同应用程序的互操作性。

该接口包括以下函数：

??? function "**name**() - 只读函数，返回代币的名称"

    === "参数"

        无。

??? function "**symbol**() - 只读函数，返回代币的符号"

    === "参数"

        无。

??? function "**decimals**() - 只读函数，返回代币的小数位数"

    === "参数"

        无。

??? function "**totalSupply**() - 只读函数，返回代币的总量"

    === "参数"

        无。

??? function "**balanceOf**(*address* who) - 只读函数，返回指定地址的余额"

    === "参数"

        - `who` - 要查询余额的帐户地址

??? function "**allowance**(*address* owner, *address* spender) - 只读函数，检查并返回 spender 代表 owner 可以花费的代币数量"

    === "参数"

        - `owner` - 拥有代币的帐户地址
        - `spender` - 允许花费代币的帐户地址

??? function "**transfer**(*address* to, *uint256* value) - 将给定数量的代币转移到指定的地址，如果转移成功，则返回 `true`"

    === "参数"

        - `to` - 接收者的地址
        - `value` - 要转移的 uint256 代币数量

??? function "**approve**(*address* spender, *uint256* value) - 批准提供的地址代表 `msg.sender` 花费指定数量的代币。如果成功，则返回 `true`"

    === "参数"

        - `spender` - 要批准花费代币的地址
        - `value` - 要批准花费的 uint256 代币数量

??? function "**transferFrom**(*address* from, *address* to, *uint256* value) - 将代币从一个给定的地址转移到另一个给定的地址，如果成功，则返回 `true`"

    === "参数"

        - `from` - 要从中转移代币的地址
        - `to` - 要转移代币到的地址
        - `value` - 要转移的 uint256 代币数量

!!! note
    ERC-20 标准未指定多次调用 `approve` 的含义。多次使用此函数更改津贴可能会导致攻击向量。为避免不正确或意外的事务排序，您可以先将 `spender` 津贴减少到 `0`，然后再设置所需的津贴。有关攻击向量的更多详细信息，您可以查看 [ERC-20 API：批准/转移方法上的攻击向量](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#){target=\_blank} 概述。

该接口还包括以下必需的事件：

- **Transfer**(*address indexed* from, *address indexed* to, *uint256* value) - 在执行转移时发出
- **Approval**(*address indexed* owner, *address indexed* spender, *uint256* value) - 在注册批准时发出

!!! note
    ERC-20 预编译不包括 `deposit` 和 `withdraw` 函数，以及从包装的代币合约（如 WETH）中期望的后续事件。

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备：

- [已安装 MetaMask 并连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- 在 Moonbase Alpha 上创建或拥有两个帐户，以测试 ERC-20 预编译中的不同功能
- 至少其中一个帐户需要有 `DEV` 代币。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### 将Token添加到MetaMask {: #add-token-to-metamask }

如果您想与Moonbase Alpha DEV token交互，就像在MetaMask中使用ERC-20一样，您可以使用预编译地址创建一个自定义token。

首先，打开MetaMask，并确保您已[连接到Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}，然后：

1. 切换到 **Assets** 选项卡
2. 点击 **Import tokens**

![从MetaMask的Assets选项卡导入Token](/images/builders/ethereum/precompiles/ux/erc20/erc20-1.webp)

现在，您可以创建一个自定义token：

1. 输入token合约地址的预编译地址- `{{networks.moonbase.precompiles.erc20 }}`。一旦您输入地址，**Token Symbol**和**Token Decimal**字段应自动填充。如果它们没有自动填充，您可以为符号输入`DEV`，为小数位数输入`18`
2. 点击 **Add Custom Token**

![添加自定义Token](/images/builders/ethereum/precompiles/ux/erc20/erc20-2.webp)

MetaMask将提示您导入token。您可以查看token详细信息，然后点击 **Import Tokens** 将DEV token导入您的钱包。

![确认并导入Token](/images/builders/ethereum/precompiles/ux/erc20/erc20-3.webp)

就这样！您已成功将DEV token作为Moonbase Alpha TestNet上的自定义ERC-20 token添加。

### Remix 设置 {: #remix-set-up }

您可以使用 [Remix](https://remix.ethereum.org){target=\_blank} 与 ERC-20 预编译进行交互。要将预编译添加到 Remix，您需要：

1. 获取 [`ERC20.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank} 的副本
2. 将文件内容粘贴到名为 `IERC20.sol` 的 Remix 文件中

### 编译合约 {: #compile-the-contract }

接下来，您需要在 Remix 中编译接口：

1. 点击从上往下数第二个**编译**标签
2. 通过点击**Compile IERC20.sol**编译接口

![Compiling IERC20.sol](/images/builders/ethereum/precompiles/ux/erc20/erc20-4.webp)

如果接口编译成功，您将在**Compile**标签旁边看到一个绿色复选标记。

### 访问合约 {: #access-the-contract }

您将访问预编译合约的接口，而不是部署 ERC-20 预编译合约，该接口提供了预编译合约的地址：

1. 点击 Remix 中**Compile**选项卡正下方的**Deploy and Run**选项卡。请注意，预编译合约已经部署
2. 确保在 **ENVIRONMENT** 下拉菜单中选择了 **Injected Web3**。选择 **Injected Web3** 后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保 **ACCOUNT** 下显示正确的帐户
4. 确保在 **CONTRACT** 下拉菜单中选择了 **IERC20 - IERC20.sol**。由于这是一个预编译合约，因此无需部署任何代码。而是要在 **At Address** 字段中提供预编译合约的地址
5. 提供 ERC-20 预编译合约的地址：`{{networks.moonbase.precompiles.erc20}}`，然后点击 **At Address**

![访问地址](/images/builders/ethereum/precompiles/ux/erc20/erc20-5.webp)

**IERC20** 预编译合约将出现在 **Deployed Contracts** 列表中。

### 获取基本代币信息 {: #get-basic-token-information }

ERC-20 接口允许您快速获取代币信息，包括代币的总供应量、名称、符号和小数位数。 您可以通过以下步骤获取此信息：

1. 展开 **Deployed Contracts** 下的 **IERC20** 合约
2. 点击 **decimals** 获取 Moonbase Alpha 原生协议代币的小数位数
3. 点击 **name** 获取代币的名称
4. 点击 **symbol** 获取代币的符号
5. 点击 **totalSupply** 获取 Moonbase Alpha 上存在的代币总供应量

![总供应量](/images/builders/ethereum/precompiles/ux/erc20/erc20-6.webp)

每次调用的响应将显示在相应的函数下。

### 获取账户余额 {: #get-account-balance }

您可以通过调用 `balanceOf` 函数并传入地址来检查 Moonbase Alpha 上任何地址的余额：

1. 展开 **balanceOf** 函数
2. 输入您想检查余额的地址，作为 **owner**
2. 点击 **call**

![获取账户余额](/images/builders/ethereum/precompiles/ux/erc20/erc20-7.webp)

您的余额将显示在 `balanceOf` 函数下方。

### 批准支出 {: #approve-a-spend }

要批准支出，您需要为支出者提供地址以及允许支出者支出的代币数量。支出者可以是外部拥有的帐户或智能合约。对于此示例，您可以批准支出者支出 1 个 DEV 代币。要开始，请按照以下步骤操作：

1. 展开 **approve** 函数
2. 输入支出者的地址。您应该在开始之前创建两个帐户，因此可以使用第二个帐户作为支出者
3. 输入支出者可以支出的代币数量作为 **value**。对于此示例，您可以允许支出者以 Wei 单位支出 1 个 DEV 代币 (`1000000000000000000`)
4. 点击 **transact**
5. MetaMask 将会弹出，并且您将被提示查看交易详情。点击 **View full transaction details** 以查看要发送的金额和支出者的地址
6. 如果一切正常，您可以点击 **Confirm** 来发送交易

![确认批准交易](/images/builders/ethereum/precompiles/ux/erc20/erc20-8.webp)

交易成功完成后，您会注意到您帐户的余额没有改变。这是因为您只批准了给定金额的支出，而支出者尚未支出资金。在下一节中，您将使用 `allowance` 函数来验证支出者是否能够代表您支出 1 个 DEV 代币。

### 获取消费者的授权额度 {: #get-allowance-of-spender }

要检查消费者是否收到了在 [批准支出](#approve-a-spend) 部分中批准的授权额度，您可以：

1. 展开 **allowance** 函数
2. 输入您的 **owner** 地址
3. 输入您在前一节中使用的 **spender** 地址
4. 点击 **call**

![获取消费者的授权额度](/images/builders/ethereum/precompiles/ux/erc20/erc20-9.webp)

调用完成后，将显示消费者的授权额度，该额度应等同于 1 DEV 代币 (`1000000000000000000`)。

### 发送转账 {: #send-transfer }

要执行标准转账并直接从您的帐户向另一个帐户发送代币，您可以按照以下步骤调用 `transfer` 函数：

1. 展开 **transfer** 函数
2. 输入要发送 DEV 代币的地址。您应该在开始之前创建两个帐户，因此您可以使用第二个帐户作为接收者
3. 输入要发送的 DEV 代币数量。对于此示例，您可以发送 1 个 DEV 代币 (`1000000000000000000`)
4. 点击 **transact**
5. MetaMask 将会弹出，您可以查看交易详情，如果一切正常，请点击 **Confirm**

![发送标准转账](/images/builders/ethereum/precompiles/ux/erc20/erc20-10.webp)

交易完成后，您可以使用 `balanceOf` 函数或查看 MetaMask [查看您的余额](#get-account-balance)，并注意到这次您的余额减少了 1 个 DEV 代币。您还可以使用 `balanceOf` 函数来确保接收者的余额如预期增加了 1 个 DEV 代币。

### 从特定账户发送转账 {: #send-transferfrom }

到目前为止，您应该已经批准了 1 个 DEV 代币的支出者额度，并通过标准 `transfer` 函数发送了 1 个 DEV 代币。`transferFrom` 函数与标准 `transfer` 函数的不同之处在于，它允许您定义要发送代币的地址。因此，您可以指定一个具有额度的地址或您的地址，只要您有资金即可。在此示例中，您将使用支出者的账户来启动从所有者到支出者的允许资金的转移。支出者可以将资金发送到任何账户，但在此示例中，您可以将资金从所有者发送到支出者。

首先，您需要在 MetaMask 中切换到支出者的账户。切换到支出者的账户后，您会注意到 Remix 中“账户”选项卡下选择的地址现在是支出者的地址。

![切换账户 Remix](/images/builders/ethereum/precompiles/ux/erc20/erc20-11.webp)

接下来，您可以启动并发送转账，为此：

1. 展开 **transferFrom** 函数
2. 在 **from** 字段中输入您的地址作为所有者
3. 在 **to** 字段中输入接收者地址，应该是支出者的地址
4. 输入要发送的 DEV 代币数量。同样，支出者目前只允许发送 1 个 DEV 代币，因此输入 `1000000000000000000`
5. 点击 **transact**

![发送标准转账](/images/builders/ethereum/precompiles/ux/erc20/erc20-12.webp)

交易完成后，您可以使用 `balanceOf` 函数[检查](#get-account-balance)所有者和支出者的余额。支出者的余额应该增加了 1 个 DEV 代币，他们的额度现在应该已用完。要验证支出者是否不再具有额度，您可以调用 `allowance` 函数，传入所有者和支出者的地址。您应该收到结果 0。

![零额度](/images/builders/ethereum/precompiles/ux/erc20/erc20-13.webp)

就这样！您已使用 MetaMask 和 Remix 成功与 ERC-20 预编译进行交互！
