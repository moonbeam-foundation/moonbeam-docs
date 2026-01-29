---
title: 与 Proxy 预编译交互
description: 如何使用 Moonbeam proxy Solidity 预编译接口从 Substrate 的 Proxy Pallet 中添加和删除代理账户。
keywords: solidity, ethereum, proxy, moonbeam, precompiled, contracts, substrate
categories: Precompiles, Ethereum Toolkit
---

# 与代理预编译交互

## 简介 {: #introduction }

Moonbeam 上的代理预编译允许帐户设置代理帐户，该帐户可以代表他们执行特定的受限操作，例如治理、质押或余额转移。

如果用户想要向第二个用户提供代表他们执行有限数量操作的权限，传统上唯一的方法是将第一个帐户的私钥提供给第二个用户。但是，Moonbeam 在运行时包含原生代理功能，从而启用代理帐户。由于代理帐户提供了额外的安全层，因此应使用代理帐户，其中许多帐户可以为主帐户执行操作。例如，如果用户希望将其钱包安全地保存在冷存储中，但仍希望访问钱包的部分功能（如治理或质押），则最好这样做。

**代理预编译只能从外部拥有帐户 (EOA) 或通过 [批量预编译](/builders/ethereum/precompiles/ux/batch/){target=\_blank} 调用。**

要了解有关代理帐户的更多信息，以及如何在不使用代理预编译的情况下为自己的目的设置代理帐户，请查看[设置代理帐户](/tokens/manage/proxy-accounts/){target=\_blank} 页面。

代理预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.proxy}}
     ```
=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.proxy}}
     ```
=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.proxy}}
     ```

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## Proxy Solidity 接口 {: #the-proxy-solidity-interface }

[`Proxy.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=\_blank} 是一个接口，Solidity 合约可以通过它与 Proxy Pallet 交互。您无需熟悉 Substrate API，因为您可以使用您熟悉的 Ethereum 接口与之交互。

该接口包括以下函数：

??? function "**addProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) - 在指定的 `delay` 块数（通常为零）后，为发送者注册一个代理帐户。如果调用者的代理已存在，则会失败"

    === "参数"

        - `delegate` - 要注册为代理的帐户地址
        - `proxyType` - 指定要注册的代理类型的 ProxyType 枚举
        - `delay` - 代理注册生效前的 uint32 块数

??? function "**removeProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) - 删除发送者的已注册代理"

    === "参数"

        - `delegate` - 要删除的代理帐户地址
        - `proxyType` - 要删除的代理类型的 ProxyType 枚举
        - `delay` - 要删除的代理的 uint32 延迟值

??? function "**removeProxies**() - 删除所有委托给发送者的代理帐户"

    === "参数"

        无。

??? function "**isProxy**(*address* real, *address* delegate, *ProxyType* proxyType, *uint32* delay) - 返回一个布尔值，如果委托地址是地址 `real` 的 `proxyType` 类型的代理，且具有指定的 `delay`，则返回 `true`"

    === "参数"

        - `real` - 可能由代理代表的帐户地址
        - `delegate` - 潜在的代理帐户地址
        - `proxyType` - 要检查的代理类型的 ProxyType 枚举
        - `delay` - 要检查的 uint32 延迟值

`proxyType` 参数由以下 `ProxyType` 枚举定义，其中值从 `0` 开始，代表最宽松的代理类型，并表示为 `uint8` 值：

```solidity
--8<-- 'code/builders/ethereum/precompiles/account/proxy/1.sol'
```

## 代理类型 {: #proxy-types }

可以委派给账户的代理角色有多种类型，这些角色通过 `Proxy.sol` 中的 `ProxyType` 枚举来表示。以下列表包括所有可能的代理以及它们可以代表主账户进行的交易类型：

 - **Any** — any 代理允许代理账户进行 `Governance`、`Staking`、`Balances` 和 `AuthorMapping` 代理类型可以执行的任何类型的交易。请注意，余额转移仅允许给 EOA，不允许给合约或预编译合约
 - **NonTransfer** — non-transfer 代理允许代理账户通过 `Governance`、`Staking` 和 `AuthorMapping` 预编译合约进行任何类型的交易，其中 `msg.value` 必须为零
 - **Governance** - governance 代理允许代理账户进行任何类型的治理相关交易（包括民主或议会 pallet）
 - **Staking** - staking 代理允许代理账户通过 `Staking` 预编译合约进行与 staking 相关的交易，包括调用 `AuthorMapping` 预编译合约
 - **CancelProxy** - cancel 代理允许代理账户拒绝和删除延迟的代理声明（主账户的）。目前，Proxy 预编译合约不支持此操作
 - **Balances** - balances 代理允许代理账户仅进行余额转移到 EOA
 - **AuthorMapping** - 这种类型的代理账户被收集者用来将服务从一台服务器迁移到另一台服务器
 - **IdentityJudgement** - identity judgement 代理允许代理账户判断和证明与 Polkadot 账户相关的个人信息。目前，Proxy 预编译合约不支持此操作

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

以下部分将介绍如何从Remix与Proxy Precompile进行交互。请注意，**Proxy Precompile只能从EOA或[Batch Precompile](/builders/ethereum/precompiles/ux/batch/){target=\_blank}调用**。

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但类似的步骤也可用于 Moonbeam 和 Moonriver。您应该：

 - 安装 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 拥有一个包含一些 DEV 代币的帐户。
  --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
 - 拥有您控制的第二个帐户以用作代理帐户（资金可选）

### Remix 设置 {: #remix-set-up }

首先，获取 [`Proxy.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=\_blank} 的副本，并按照以下步骤操作：

1. 点击 **文件浏览器** 选项卡
2. 将文件内容复制并粘贴到名为 `Proxy.sol` 的 [Remix 文件](https://remix.ethereum.org){target=\_blank} 中

![将代理接口复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/account/proxy/proxy-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **Compile** 选项卡
2. 然后编译接口，点击 **Compile Proxy.sol**

![Compiling Proxy.sol](/images/builders/ethereum/precompiles/account/proxy/proxy-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击Remix中**Compile**选项卡正下方的**Deploy and Run**选项卡。注意：您不是在此处部署合约，而是访问已经部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中选择**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中选择**Proxy.sol**。由于这是一个预编译合约，因此无需部署，而是要在**At Address**字段中提供预编译的地址
4. 提供Moonbase Alpha的Proxy预编译地址：`{{networks.moonbase.precompiles.proxy}}`，然后点击**At Address**
5. Proxy预编译将出现在**Deployed Contracts**列表中

![提供地址](/images/builders/ethereum/precompiles/account/proxy/proxy-3.webp)

### 添加代理 {: #add-proxy }

如果您的帐户还没有代理，您可以通过代理预编译为您的帐户添加一个代理。在本例中，您将通过以下步骤向帐户添加一个 [余额](#:~:text=Balances) 代理：

1. 展开代理预编译合约以查看可用的函数
2. 找到 **addProxy** 函数，然后按下按钮展开该部分
3. 将您的第二个帐户地址作为 **delegate** 插入，`5` 作为 **proxyType**，`0` 作为 **delay**
4. 按下 **transact** 并在 MetaMask 中确认交易

!!! note
     在 Remix 中构造交易时，**proxyType** 表示为 `uint8`，而不是预期的枚举 `ProxyType`。在 Solidity 中，枚举被编译为 `uint8`，因此当您为 **proxyType** 传入 `5` 时，您表示 `ProxyType` 枚举中的第六个元素，即余额代理。

![调用 addProxy 函数](/images/builders/ethereum/precompiles/account/proxy/proxy-4.webp)

### 检查代理是否存在 {: #check-proxy }

您可以确定一个账户是否是主账户的代理账户。在本例中，您将插入[先前添加的代理](#add-proxy)的参数，以确定是否成功添加了代理账户：

1. 找到 **isProxy** 函数并按下按钮展开该部分
2. 将您的主账户地址作为 **real** 插入，将您的第二个账户地址作为 **delegate** 插入，将 `5` 作为 **proxyType** 插入，将 `0` 作为 **delay** 插入
3. 按下 **call**

如果一切正常，输出应为 `true`。

![调用 isProxy 函数](/images/builders/ethereum/precompiles/account/proxy/proxy-5.webp)

### 移除代理 {: #remove-proxy }

您可以通过代理预编译从您的帐户中移除代理。在此示例中，您将通过以下步骤移除[先前添加](#add-proxy)到委托帐户的余额代理：

1. 展开代理预编译合约以查看可用功能
2. 找到 **removeProxy** 函数，然后按按钮展开该部分
3. 插入您的第二个帐户地址作为 **delegate**，`5` 作为 **proxyType**，`0` 作为 **delay**
4. 按 **transact** 并在 MetaMask 中确认交易

交易确认后，如果您重复这些步骤来[检查代理是否存在](#check-proxy)，结果应为 `false`。

![调用 removeProxy 函数](/images/builders/ethereum/precompiles/account/proxy/proxy-6.webp)

就这样！您已完成代理预编译的介绍。有关设置代理的其他信息，请访问[设置代理帐户](/tokens/manage/proxy-accounts/){target=\_blank}页面和 Polkadot 文档中的[代理帐户](https://wiki.polkadot.com/learn/learn-proxies/){target=\_blank}页面。如果您对代理预编译的任何方面有任何疑问，请随时在 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 上联系我们。
