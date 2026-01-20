---
title: Identity Precompile
description: 了解关于 Identity Precompile 您需要知道的一切，例如其地址、Solidity 接口以及如何使用流行的 Ethereum 库与之交互。
categories: Precompiles, Ethereum Toolkit
---

# Moonbeam 上的身份预编译

## 简介 {: #introduction }

身份预编译是一个 Solidity 接口，允许您创建、管理和检索链上身份信息。身份信息与帐户关联，包括个人信息，例如您的法定姓名、显示名称、网站、Twitter 账号、Riot（现在称为 Element）名称等。您还可以利用自定义字段来包含任何其他相关信息。

身份预编译直接与 Moonbeam 底层的 Substrate 身份运行时逻辑交互，以提供创建和管理身份所需的功能。此 pallet 用 Rust 编写，通常无法从 Moonbeam 的 Ethereum 端访问。但是，身份预编译允许您直接从 Solidity 接口访问此功能。

身份预编译位于以下地址：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.identity }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.identity }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.identity }}`

--8<-- 'text/builders/ethereum/precompiles/security.md'

## Identity Precompile Solidity接口 {: #the-solidity-interface }

[`Identity.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=_blank} 是一个Solidity接口，允许开发人员与预编译的方法进行交互。

??? code "Identity.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/account/identity/Identity.sol'
    ```

Identity Precompile包含一些可以由任何人调用的函数，以及一些只能由注册员调用的与判断相关的函数。可以由任何人调用的函数如下：

??? function "**identity**(*address* who) - 返回给定帐户的注册信息"

    === "Parameters"

        - `who` - 要查询身份信息的帐户地址

??? function "**superOf**(*address* who) - 检索子帐户的超级帐户。如果给定的帐户不是子帐户，则返回的地址是 `0x0000000000000000000000000000000000000000`"

    === "Parameters"

        - `who` - 要查询超级帐户的帐户地址

??? function "**subsOf**(*address* who) - 返回给定帐户的子帐户。如果给定的帐户没有任何子帐户，则返回一个空数组 (`[]`)"

    === "Parameters"

        - `who` - 要查询子帐户的帐户地址

??? function "**registrars**() - 返回注册员的列表"

    === "Parameters"

        无。

??? function "**setIdentity**(*IdentityInfo memory* info) - 为调用者设置身份"

    === "Parameters"

        - `info` - 包含要设置的身份信息的IdentityInfo memory结构体

??? function "**setSubs**(*SubAccount[] memory* subs) - 为调用者设置子帐户"

    === "Parameters"

        - `subs` - 包含要设置的子帐户的 SubAccount[] memory 数组

??? function "**clearIdentity**() - 清除调用者的身份"

    === "Parameters"

        无。

??? function "**requestJudgement**(*uint32* regIndex, *uint256* maxFee) - 从给定的注册员处请求判断，并提供调用者愿意支付的最高费用"

    === "Parameters"

        - `regIndex` - 要从中请求判断的注册员的uint32索引
        - `maxFee` - 调用者愿意为判断支付的uint256最高费用

??? function "**cancelRequest**(*uint32* regIndex) - 取消调用者从给定注册员处发出的判断请求"

    === "Parameters"

        - `regIndex` - 要从中取消判断请求的注册员的uint32索引

??? function "**addSub**(*address* sub, *Data memory* data) - 为调用者添加子身份帐户"

    === "Parameters"

        - `sub` - 要添加的子帐户地址
        - `data` - 包含子帐户信息的 Data memory结构体

??? function "**renameSub**(*address* sub, *Data memory* data) - 为调用者重命名子身份帐户"

    === "Parameters"

        - `sub` - 要重命名的子帐户地址
        - `data` - 包含新的子帐户信息的 Data memory结构体

??? function "**removeSub**(*address* sub) - 为调用者删除子身份帐户"

    === "Parameters"

        - `sub` - 要删除的子帐户地址

??? function "**quitSub**(*address* sub) - 删除作为子身份帐户的调用者"

    === "Parameters"

        - `sub` - 要退出的子帐户地址

必须由注册员调用的与判断相关的函数，并且调用者必须是与 `regIndex` 对应的注册员帐户，如下所示：

??? function "**setFee**(*uint32* regIndex, *uint256* fee) - 设置注册员的费用"

    === "Parameters"

        - `regIndex` - 设置费用的注册员的uint32索引
        - `fee` - 要为注册员设置的uint256新费用金额

??? function "**setAccountId**(*uint32* regIndex, *address* newAccount) - 为注册员设置一个新帐户"

    === "Parameters"

        - `regIndex` - 被更新的注册员的uint32索引
        - `newAccount` - 要为注册员设置的新帐户地址

??? function "**setFields**(*uint32* regIndex, *IdentityFields memory* fields) - 设置注册员的身份"

    === "Parameters"

        - `regIndex` - 设置其身份字段的注册员的uint32索引
        - `fields` - 包含要设置的身份字段的IdentityFields memory结构体

??? function "**provideJudgement**(*uint32* regIndex, *address* target, *Judgement memory* judgement, *bytes32* identity) - 提供关于帐户身份的判断"

    === "Parameters"

        - `regIndex` - 提供判断的注册员的uint32索引
        - `target` - 接收判断的帐户地址
        - `judgement` - 包含判断详细信息的 Judgement memory结构体
        - `identity` - 被判断的身份信息的bytes32哈希值

## 与Solidity接口交互 {: #interact-with-interface }

以下部分将介绍如何使用[以太坊库](/builders/ethereum/libraries/){target=_blank}（例如[Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank}和[Web3.py](/builders/ethereum/libraries/web3py/){target=_blank}）与身份预编译进行交互。

本指南中的示例将在Moonbase Alpha上进行。
--8<-- 'text/_common/endpoint-examples.md'

### 使用以太坊库 {: #use-ethereum-libraries }

要使用以太坊库与 Identity Precompile 的 Solidity 接口进行交互，您需要 Identity Precompile 的 ABI。

??? code "Identity Precompile ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/account/identity/abi.js'
    ```

获得 ABI 后，您可以使用您选择的以太坊库与预编译合约进行交互。一般来说，您需要执行以下步骤：

1. 创建一个 provider
2. 创建 Identity Precompile 的合约实例
3. 与 Identity Precompile 的函数进行交互

在下面的示例中，您将学习如何组装设置身份所需的数据，如何设置身份，以及如何在设置身份后检索身份信息。

!!! remember
    以下代码段仅用于演示目的。切勿将您的私钥存储在 JavaScript 或 Python 文件中。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/account/identity/ethers.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/ethereum/precompiles/account/identity/web3.py'
    ```