---
title:  调用许可预编译合约
description: 了解如何在 Moonbeam 上使用调用许可预编译合约，以便为任何 EVM 调用签署许可，该调用可以由任何人或任何智能合约分发。
keywords: solidity, ethereum, 调用许可, 许可, 无 Gas 交易, moonbeam, 预编译, 合约
categories: Precompiles, Ethereum Toolkit
---

# 与调用许可预编译交互

## 简介 {: #introduction }

Moonbeam 上的调用许可预编译允许用户为任何 EVM 调用签名许可，这是一个 [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank} 签名消息，并且可以由任何人或任何智能合约分派。它类似于 [ERC-20 许可 Solidity 接口](/builders/interoperability/xcm/xc20/interact/#the-erc20-permit-interface){target=_blank}，不同之处在于它适用于任何 EVM 调用，而不仅仅是批准。

当调用许可被分派时，它是代表签署许可的用户执行的，并且分派许可的用户或合约负责支付交易费用。因此，预编译可用于执行无 Gas 交易。

例如，Alice 签署了一个调用许可，Bob 分派它并代表 Alice 执行调用。Bob 支付交易费用，因此，Alice 不需要拥有任何本地货币来支付交易，除非调用包括转账。

调用许可预编译位于以下地址：

===

     text
     {{networks.moonbeam.precompiles.call_permit }}
     

===

     text
     {{networks.moonriver.precompiles.call_permit }}
     

===

     text
     {{networks.moonbase.precompiles.call_permit }}
     

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 调用许可 Solidity 接口 {: #the-call-permit-interface }

[`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank} 是一个 Solidity 接口，允许开发人员与预编译的三个方法进行交互。

该接口包括以下函数：

??? function "**dispatch**(*address* from, *address* to, *uint256* value, *bytes* data, *uint64[]* gaslimit, *uint256* deadline, *uint8* v, *bytes32* r, *bytes32* s) - 代表另一个用户使用 EIP-712 许可调度调用。此函数可以由任何人或任何智能合约调用。如果许可无效，或者调度的调用还原或出错（例如，gas 不足），则交易将还原。如果成功，签名者的 nonce 会增加，以防止此许可被重放"

    === "Parameters"

        - `from` - 许可签名者的地址。该调用将代表此地址进行调度
        - `to` - 进行调用的地址
        - `value` - 从 `from` 帐户转移的 uint256 值
        - `data` - 包含调用数据或要执行的操作的字节
        - `gasLimit` - uint64[] 调度的调用所需的 gas 限制。为此参数提供参数可防止调度程序操纵 gas 限制
        - `deadline` - UNIX 秒的时间，超过此时间许可将不再有效。在 JavaScript 中，您可以通过在 JavaScript 脚本或浏览器控制台中运行 `console.log(Math.floor(Date.now() / 1000))` 来获取当前时间的 UNIX 秒数
        - `v` - 签名的 uint8 恢复 ID。串联签名的最后一个字节
        - `r` - 串联签名的前 32 个字节的 bytes32
        - `s` - 串联签名的后 32 个字节的 bytes32

??? function "**nonces**(*address* owner) - 返回给定所有者的当前 nonce"

    === "Parameters"

        - `owner` - 要查询 nonce 的帐户地址

??? function "**DOMAIN_SEPARATOR**() - 返回 EIP-712 域分隔符，用于避免重放攻击。它遵循 [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} 实现"

    === "Parameters"

        无。

--8<-- 'text/builders/ethereum/precompiles/ux/call-permit/domain-separator.md'

当调用 `dispatch` 时，在调度调用之前需要验证许可。第一步是[计算域分隔符](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L138){target=_blank}。可以在 [Moonbeam 的实现](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L112-L126){target=_blank} 中看到计算过程，或者您可以在 [OpenZeppelin 的 EIP712 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank} 中查看一个实际示例。

从那里，生成签名和给定参数的 [哈希](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L140-L151){target=_blank}，这保证了签名只能用于调用许可。它使用给定的 nonce 来确保签名不受重放攻击。它类似于 [OpenZeppelin 的 `ERC20Permit` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}，不同之处在于 `PERMIT_TYPEHASH` 用于调用许可，并且参数与 [dispatch 函数](#:~:text=The interface includes the following functions) 的参数加上 nonce 相匹配。

域分隔符和哈希结构可用于构建完全编码消息的 [最终哈希](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L153-L157){target=_blank}。一个实际示例显示在 [OpenZeppelin 的 EIP712 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank} 中。

使用最终哈希以及 v、r 和 s 值，可以[验证和恢复](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L211-L223){target=_blank}签名。如果成功验证，nonce 将增加 1，并且将调度调用。

## 设置合约 {: #setup-the-example-contract }

在本示例中，您将学习如何签署一个调用许可，该许可更新一个简单示例合约 [`SetMessage.sol`](#example-contract) 中的消息。在生成调用许可签名之前，您需要部署合约并为调用许可定义 `dispatch` 函数参数。

设置好示例合约后，您可以设置调用许可预编译合约。

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备：

- [已安装 MetaMask 并连接到 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- 在 Moonbase Alpha 上创建或拥有两个帐户，以测试调用许可预编译中的不同功能
- 至少其中一个帐户需要有 `DEV` 代币。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### 示例合约 {: #example-contract }

`SetMessage.sol` 合约将用作使用调用许可的示例，但实际上，任何合约都可以进行交互。

solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract SetMessage {
    string storedMessage;

    function set(string calldata x) public {
        storedMessage = x;
    }

    function get() public view returns (string memory) {
        return storedMessage;
    }
}

### Remix 设置 {: #remix-set-up }

您可以使用 [Remix](https://remix.ethereum.org){target=\_blank} 来编译示例合约并进行部署。您需要 [`SetMessage.sol`](#example-contract){target=\_blank} 和 [`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank} 的副本。要将合约添加到 Remix，您可以按照以下步骤操作：

1. 点击**文件管理器**选项卡
2. 将 `SetMessage.sol` 合约粘贴到名为 `SetMessage.sol` 的 Remix 文件中
3. 将 `CallPermit.sol` 合约粘贴到名为 `CallPermit.sol` 的 Remix 文件中

![将示例合约复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/ux/call-permit/call-1-new.webp)

### 编译和部署示例合约 {: #compile-deploy-example-contract }

首先，您需要编译示例合约：

1. 单击顶部的第二个**Compile**选项卡
2. 然后要编译接口，请单击**Compile SetMessage.sol**

![编译 SetMessage.sol](/images/builders/ethereum/precompiles/ux/call-permit/call-2.webp)

然后您可以部署它：

1. 单击 Remix 中**Compile**选项卡正下方的**Deploy and Run**选项卡。注意：您不是在此处部署合约，而是访问已部署的预编译合约
2. 确保在 **ENVIRONMENT** 下拉列表中选择了 **Injected Provider - Metamask**
3. 确保在 **CONTRACT** 下拉列表中选择了 **SetMessage.sol**
4. 单击 **Deploy**
4. MetaMask 将会弹出，您需要**Confirm**交易

![提供地址](/images/builders/ethereum/precompiles/ux/call-permit/call-3.webp)

合约将出现在左侧面板的**Deployed Contracts**列表中。复制合约地址，因为您需要在下一节中使用它来生成调用许可签名。

### 编译和访问调用许可预编译 {: #compile-access-call-permit }

首先，您需要编译调用许可预编译合约：

1. 点击顶部的第二个 **Compile** 选项卡
2. 然后要编译接口，点击 **Compile CallPermit.sol**

![编译 SetMessage.sol](/images/builders/ethereum/precompiles/ux/call-permit/call-4.webp)

然后，您只需根据预编译的地址访问它，而不是部署合约：

1. 点击 Remix 中 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡。注意：您不是在此处部署合约，而是访问已经部署的预编译合约
2. 确保 **Injected Provider - Metamask** 在 **ENVIRONMENT** 下拉列表中被选中
3. 确保 **CallPermit.sol** 在 **CONTRACT** 下拉列表中被选中。由于这是一个预编译的合约，因此无需部署，而是需要在 **At Address** 字段中提供预编译的地址
4. 提供 Moonbase Alpha 的调用许可预编译的地址：`{{networks.moonbase.precompiles.call_permit}}`，然后点击 **At Address**
5. 调用许可预编译将出现在 **Deployed Contracts** 列表中

![提供地址](/images/builders/ethereum/precompiles/ux/call-permit/call-5.webp)

## 生成调用许可签名 {: #generate-call-permit-signature}

为了与调用许可预编译进行交互，您必须拥有或生成一个签名才能分派调用许可。您可以通过多种方式生成签名，本指南将向您展示两种不同的生成方法：在浏览器中使用 [MetaMask 扩展](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn){target=_blank} 和 [JSFiddle](https://jsfiddle.net){target=_blank}，以及使用 MetaMask 的 [`@metamask/eth-sig-util` npm 包](https://www.npmjs.com/package/@metamask/eth-sig-util){target=_blank}。

无论您选择哪种方法生成签名，都将执行以下步骤：

1.  将创建 `message`，其中包含创建调用许可所需的一些数据。它包括将传递到 `dispatch` 函数中的参数和签名者的 nonce
2.  将为调用许可组装用户需要签名的数据的 JSON 结构，并包括 `dispatch` 参数和 nonce 的所有类型。这将产生 `CallPermit` 类型，并将保存为 `primaryType`
3.  将使用 `"Call Permit Precompile"` 精确地为名称、DApp 或平台的版本、签名要使用的网络的链 ID 以及将验证签名的合约地址创建域分隔符
4.  所有组装的数据，`types`、`domain`、`primaryType` 和 `message`，将使用 MetaMask 进行签名（在浏览器中或通过 MetaMask 的 JavaScript 签名库）
5.  将返回签名，您可以使用 [Ethers.js](https://docs.ethers.org/v6){target=_blank} [`Signature.from` 方法](https://docs.ethers.org/v6/api/crypto/#Signature_from){target=_blank} 返回签名的 `v`、`r` 和 `s` 值

### 调用许可参数 {: #call-permit-arguments }

正如在[调用许可接口](#the-call-permit-interface)部分看到的，`dispatch`函数接受以下参数：`from`、`to`、`value`、`data`、`gasLimit`、`deadline`、`v`、`r` 和 `s`。

为了获得签名参数（`v`、`r` 和 `s`），您需要签署一条包含其余上述参数的参数的消息，以及签署者的 nonce。

- `from` - 您想要使用调用许可签署的帐户地址
- `to` - `SetMessage.sol` 合约的合约地址
- `value` - 在此示例中可以为 `0`，因为您只会设置一条消息，而不会转移任何资金
- `data` - 您可以发送任何您想要的消息，只需要使用 `SetMessage.sol` 合约设置的消息的十六进制表示形式。这将包含 `set` 函数的函数选择器和消息字符串。对于此示例，您可以发送 `hello world`。为此，您可以使用此十六进制表示形式：
     text
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     
- `gasLimit` - `100000` 足以发送分派的调用
- `deadline` - 您可以通过在 JavaScript 脚本或浏览器控制台中运行 `console.log(Math.floor(Date.now() / 1000))` 来获取当前时间的 UNIX 秒数。获得当前时间后，您可以添加额外的秒数来表示调用许可的到期时间

还需要签署者的 nonce。如果这是您第一次签署调用许可，则 nonce 将为 `0`。您也可以在 Remix 中检查 nonce：

1. 展开调用许可合约
2. 在 **nonces** 函数旁边，输入签署者的地址，然后单击 **nonces**
3. 结果将直接在函数下方返回

![获取 nonce](/images/builders/ethereum/precompiles/ux/call-permit/call-6.webp)

### 使用浏览器 {: #use-the-browser }

首先，您可以在浏览器中打开 [JSFiddle](https://jsfiddle.net){target=_blank} 或其他 JavaScript 游乐场。首先，您需要添加 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank}，因为它将用于获取签名的 `v`、`r` 和 `s` 值：

1. 点击 **Resources**
2. 开始输入 `ethers`，下拉列表应填充匹配的库。选择 **ethers**
3. 点击 **+** 按钮

Ethers.js 的 CDN 将出现在 **Resources** 下的库列表中。

![将 Ethers 添加到 JSFiddle](/images/builders/ethereum/precompiles/ux/call-permit/call-7.webp)

在 **Javascript** 代码框中，复制并粘贴以下 JavaScript 代码段，确保替换 `to` 变量（以及您认为合适的任何其他变量）：

js
--8<-- 'code/builders/ethereum/precompiles/ux/call-permit/browser-getSignature.js'

要运行代码，请点击页面顶部的 **Run**（或者您也可以使用 `control` 和 `s`）。MetaMask 应该会弹出并提示您连接一个帐户。确保选择您要用来签署消息的帐户。然后继续签署消息。

![使用 MetaMask 签署消息](/images/builders/ethereum/precompiles/ux/call-permit/call-8.webp)

签署消息后，返回 JSFiddle，如果控制台尚未打开，请打开它以查看签名值，其中包括 `v`、`r` 和 `s` 值。复制这些值，因为在以下部分与 Call Permit Precompile 交互时需要它们。

![JSFiddle 控制台中的签名值](/images/builders/ethereum/precompiles/ux/call-permit/call-9.webp)

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

既然您已经生成了调用许可签名，您就可以测试调用 Call Permit Precompile 的 `dispatch` 函数了。

### 调度调用 {: #dispatch-a-call }

当您发送 `dispatch` 函数时，您需要与签名调用许可时相同的参数。首先，返回到 Remix 中的 **Deploy and Run** 选项卡，并在 **Deployed Contracts** 部分下展开调用许可合约。确保您已连接到要使用调用许可并支付交易费用的帐户。然后执行以下步骤：

1. 对于 **from** 字段，输入您用于签名调用许可的帐户地址
2. 复制并粘贴 `SetMessage.sol` 的合约地址
3. 在 **value** 字段中输入 `0`
4. 输入 `set` 函数的函数选择器的十六进制表示形式，以及您想要设置为 `SetMessage.sol` 合约的消息的字符串。对于此示例，可以使用 `hello world`：
     text
     0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
     
5. 在 **gasLimit** 字段中输入 `100000`
6. 输入您在签名调用许可时使用的 `deadline`
7. 复制您在生成调用许可签名时应已检索到的 `v` 值，并将其粘贴到 **v** 字段中
8. 复制您在生成调用许可签名时应已检索到的 `r` 值，并将其粘贴到 **r** 字段中
9. 复制您在生成调用许可签名时应已检索到的 `s` 值，并将其粘贴到 **s** 字段中
10. 单击 **transact** 以发送交易
11. MetaMask 应该会弹出，您可以确认交易

![调度调用许可](/images/builders/ethereum/precompiles/ux/call-permit/call-10.webp)

交易完成后，您可以验证消息是否已更新为 `hello world`。为此，您可以：

1. 展开 `SetMessage.sol` 合约
2. 点击 **get**
3. 结果将显示在函数下方，并且应该显示 `hello world`

![验证调度是否按预期执行](/images/builders/ethereum/precompiles/ux/call-permit/call-11.webp)

恭喜！您已成功生成调用许可签名，并使用它代表调用许可签名者调度调用。
