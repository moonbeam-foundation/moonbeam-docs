______________________________________________________________________

"""
LITERAL BLOCK PRESERVATION (NON-NEGOTIABLE)

输入可能包含受保护的“字面块”，这些字面块由 HTML 注释分隔：

<!-- ROSE:BEGIN_LITERAL_BLOCK id=<id> preserve=verbatim -->

...

<!-- ROSE:END_LITERAL_BLOCK id=<id> -->

规则：

1. 您必须逐字复制 BEGIN_LITERAL_BLOCK 和 END_LITERAL_BLOCK 之间的全部内容，一个字符也不差。
1. 请勿在字面块内翻译、改写、换行、规范化空格、更改缩进、重新排序行或修改标点符号。
1. 请勿更改字面块内的 Markdown 语法（包括但不限于：MkDocs Material 选项卡标题，如 === “Label”、选项卡下的缩进、围栏代码块、表格、HTML 或模板占位符，如 {{ ... }}）。
1. 您必须完全按照提供的形式保留分隔符行本身。
1. 您可以自由地翻译/修改字面块之外的内容，但您不得移动字面块或更改它们的相对顺序。

如果字面块出现格式错误（例如，缺少 END 分隔符），请勿尝试“修复”它——完全按原样复制它并继续。

输出必须逐字保留字面块区域，并且仅将翻译/编辑应用于这些区域之外的文本。

METADATA (必须完全复制到 JSON 输出中):

- source_path: builders/ethereum/precompiles/ux/call-permit.md
- source_language: EN
- target_language: ZH
- checksum: 7f811033f563cb43657301babb356f34b12cc90fc2999eecb3f218fdfa316f99
- branch: origin/rose1
- commit: dd18343c719f9c17cec2c6833eb13c617f846ccc
- chunk_index: 1
- chunk_total: 17

OUTPUT FORMAT (至关重要):
对象必须具有以下确切字段：

{
"source_path": "...",
"source_language": "...",
"target_language": "...",
"checksum": "...",
"content": "...",
"translated_content": "...",
"branch": "...",
"commit": "...",
"chunk_index": 1,
"chunk_total": 10
}

规则：

- “已翻译内容”列不应包含英文。
- source_path、source_language、target_language、checksum、content、branch、commit、chunk_index、chunk_total 必须与上面的元数据完全一致。
- translated_content 必须是 content 的完整翻译版本，使用中文。
- 请勿包含 markdown 围栏（无 \`\`\`json）。
- 请勿包含对象之外的任何解释或文本。

## title: Call Permit Precompile Contract description: 了解如何在 Moonbeam 上使用 Call Permit Precompile 合约来签署任何 EVM 调用的许可，该调用可以由任何人或任何智能合约分派。 keywords: solidity, ethereum, call permit, permit, gasless transaction, moonbeam, precompiled, contracts categories: Precompiles, Ethereum Toolkit

# 与调用许可预编译交互

## 简介 {: #introduction }

Moonbeam 上的调用许可预编译允许用户为任何 EVM 调用签署许可，这是一个 [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=\_blank} 签名消息，可以由任何人或任何智能合约分派。它类似于 [ERC-20 许可 Solidity 接口](/builders/interoperability/xcm/xc20/interact/#the-erc20-permit-interface){target=\_blank}，只不过它适用于任何 EVM 调用，而不仅仅是批准。

当调用许可被分派时，它是代表签署许可的用户执行的，并且分派许可的用户或合约负责支付交易费用。因此，预编译可用于执行无 Gas 交易。

例如，Alice 签署了一个调用许可，Bob 分派它并代表 Alice 执行调用。Bob 支付交易费用，因此，Alice 不需要拥有任何原生货币来支付交易，除非调用包含转账。

调用许可预编译位于以下地址：

\===

````
```text
{{networks.moonbeam.precompiles.call_permit }}
```
````

\===

````
```text
{{networks.moonriver.precompiles.call_permit }}
```
````

\===

````
```text
{{networks.moonbase.precompiles.call_permit }}
```
````

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 调用许可 Solidity 接口 {: #the-call-permit-interface }

[`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank} 是一个 Solidity 接口，允许开发者与预编译的三个方法进行交互。

该接口包括以下函数：

??? function "**dispatch**(*address* from, *address* to, *uint256* value, *bytes* data, *uint64[]* gaslimit, *uint256* deadline, *uint8* v, *bytes32* r, *bytes32* s) - 代表另一个用户通过 EIP-712 许可调度调用。此函数可以由任何人或任何智能合约调用。如果许可无效，或者调度的调用回退或出错（例如，gas 不足），则交易将回退。如果成功，签名者的 nonce 将增加，以防止此许可被重放"

    === "参数"

        - `from` - 许可签名者的地址。调用将代表此地址进行调度
        - `to` - 进行调用的地址
        - `value` - 从 `from` 账户转账的 uint256 值
        - `data` - 包含调用数据或要执行的操作的字节
        - `gasLimit` - 调度的调用所需的 uint64[] gas 限制。为此参数提供参数可以防止调度程序操纵 gas 限制
        - `deadline` - UNIX 秒数的时间，超过此时间许可将不再有效。在 JavaScript 中，您可以通过在 JavaScript 脚本或浏览器控制台中运行 `console.log(Math.floor(Date.now() / 1000))` 来获取以 UNIX 秒为单位的当前时间
        - `v` - 签名的 uint8 恢复 ID。连接签名的最后一个字节
        - `r` - 连接签名的前 32 个字节的 bytes32
        - `s` - 连接签名的后 32 个字节的 bytes32

??? function "**nonces**(*address* owner) - 返回给定所有者的当前 nonce"

    === "参数"

        - `owner` - 要查询 nonce 的账户地址

??? function "**DOMAIN_SEPARATOR**() - 返回用于避免重放攻击的 EIP-712 域分隔符。它遵循 [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} 实现"

    === "参数"

        无。

--8<-- 'text/builders/ethereum/precompiles/ux/call-permit/domain-separator.md'

当调用 `dispatch` 时，需要先验证许可，然后才能调度调用。第一步是[计算域分隔符](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L138){target=\_blank}。[Moonbeam 的实现](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L112-L126){target=\_blank}中可以看到计算过程，或者您可以在 [OpenZeppelin 的 EIP712 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=\_blank}中查看实际示例。

从那里，会生成[签名和给定参数的哈希值](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L140-L151){target=\_blank}，以确保签名只能用于调用许可。它使用给定的 nonce 来确保签名不受重放攻击。它类似于 [OpenZeppelin 的 `ERC20Permit` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=\_blank}，但 `PERMIT_TYPEHASH` 用于调用许可，并且参数与 \[dispatch 函数\](#:~:text=The interface includes the following functions) 的参数加上 nonce 相匹配。

域分隔符和哈希结构可用于构建完全编码消息的[最终哈希值](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L153-L157){target=\_blank}。[OpenZeppelin 的 EIP712 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=\_blank}中显示了一个实际示例。

使用最终哈希值以及 v、r 和 s 值，可以[验证和恢复签名](https://github.com/moonbeam-foundation/moonbeam/blob/ae705bb2e9652204ace66c598a00dcd92445eb81/precompiles/call-permit/src/lib.rs#L211-L223){target=\_blank}。如果成功验证，nonce 将增加 1，并且将调度调用。

## 设置合约 {: #setup-the-example-contract }

在此示例中，您将学习如何签署一个调用许可，该许可更新一个简单示例合约 [`SetMessage.sol`](#example-contract) 中的消息。在生成调用许可签名之前，您需要部署合约并为调用许可定义 `dispatch` 函数参数。

设置好示例合约后，您可以设置调用许可预编译合约。

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备以下条件：

- [已安装MetaMask并连接到Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- 在Moonbase Alpha上创建或拥有两个帐户，以测试Call Permit Precompile中的不同功能
- 至少其中一个帐户需要使用`DEV`代币进行充值。

--8<-- 'text/_common/faucet/faucet-list-item.md'

### 示例合约 {: #example-contract }

`SetMessage.sol` 合约将用作使用调用许可的示例，但实际上，可以与任何合约进行交互。

solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract SetMessage {
string storedMessage;

```
function set(string calldata x) public {
    storedMessage = x;
}

function get() public view returns (string memory) {
    return storedMessage;
}
```

}

### Remix 设置 {: #remix-set-up }

您可以使用 [Remix](https://remix.ethereum.org){target=\_blank} 来编译示例合约并部署它。您需要 [`SetMessage.sol`](#example-contract){target=\_blank} 和 [`CallPermit.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=\_blank} 的副本。要将合约添加到 Remix，您可以采取以下步骤：

1. 点击 **文件浏览器** 标签
1. 将 `SetMessage.sol` 合约粘贴到名为 `SetMessage.sol` 的 Remix 文件中
1. 将 `CallPermit.sol` 合约粘贴到名为 `CallPermit.sol` 的 Remix 文件中

![将示例合约复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/ux/call-permit/call-1-new.webp)

### 编译和部署示例合约 {: #compile-deploy-example-contract }

首先，您需要编译示例合约：

1. 点击顶部的第二个 **Compile** 选项卡
1. 然后要编译接口，点击 **Compile SetMessage.sol**

![编译 SetMessage.sol](/images/builders/ethereum/precompiles/ux/call-permit/call-2.webp)

然后您可以部署它：

1. 点击 Remix 中 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡。注意：您没有在此处部署合约，而是访问已部署的预编译合约
1. 确保在 **ENVIRONMENT** 下拉菜单中选择了 **Injected Provider - Metamask**
1. 确保在 **CONTRACT** 下拉菜单中选择了 **SetMessage.sol**
1. 点击 **Deploy**
1. MetaMask 将会弹出，您需要 **Confirm** 交易

![提供地址](/images/builders/ethereum/precompiles/ux/call-permit/call-3.webp)

该合约将出现在左侧面板上的 **Deployed Contracts** 列表中。复制合约地址，因为您需要使用它在下一节中生成调用许可签名。

### 编译和访问调用许可预编译 {: #compile-access-call-permit }

首先，您需要编译调用许可预编译合约：

1. 点击从顶部数第二个 **Compile** 选项卡
1. 然后，要编译接口，点击 **Compile CallPermit.sol**

![Compiling SetMessage.sol](/images/builders/ethereum/precompiles/ux/call-permit/call-4.webp)

然后，您只需提供预编译的地址即可访问它，而无需部署合约：

1. 点击 Remix 中 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡。注意：这里您不是在部署合约，而是在访问一个已经部署的预编译合约
1. 确保在 **ENVIRONMENT** 下拉菜单中选择了 **Injected Provider - Metamask**
1. 确保在 **CONTRACT** 下拉菜单中选择了 **CallPermit.sol**。由于这是一个预编译合约，因此无需部署，而是需要在 **At Address** 字段中提供预编译的地址
1. 提供 Moonbase Alpha 的调用许可预编译的地址：`{{networks.moonbase.precompiles.call_permit}}` 并点击 **At Address**
1. 调用许可预编译将出现在 **Deployed Contracts** 列表中

![Provide the address](/images/builders/ethereum/precompiles/ux/call-permit/call-5.webp)

## 生成调用许可签名 {: #generate-call-permit-signature}

为了与调用许可预编译交互，您必须拥有或生成一个签名来分派调用许可。 您可以通过多种方式生成签名，本指南将向您展示两种不同的生成方式：在浏览器中使用 [MetaMask 扩展程序](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn){target=\_blank} 和 [JSFiddle](https://jsfiddle.net){target=\_blank}，以及使用 MetaMask 的 [`@metamask/eth-sig-util` npm 包](https://www.npmjs.com/package/@metamask/eth-sig-util){target=\_blank}。

无论您选择哪种方法生成签名，都将执行以下步骤：

1. 将创建 `message`，其中包含创建调用许可所需的一些数据。 它包括将传递到 `dispatch` 函数中的参数以及签名者的 nonce
1. 将为调用许可组装用户需要签署的数据的 JSON 结构，并包括 `dispatch` 参数和 nonce 的所有类型。 这将产生 `CallPermit` 类型，并将保存为 `primaryType`
1. 将使用 `"Call Permit Precompile"` 精确地为名称、您的 DApp 或平台的版本、要在其上使用签名的网络的链 ID 以及将验证签名的合约的地址创建域分隔符
1. 所有组装的数据，`types`、`domain`、`primaryType` 和 `message`，都将使用 MetaMask 进行签名（在浏览器中或通过 MetaMask 的 JavaScript 签名库）
1. 将返回签名，您可以使用 [Ethers.js](https://docs.ethers.org/v6){target=\_blank} [`Signature.from` method](https://docs.ethers.org/v6/api/crypto/#Signature_from){target=\_blank} 来返回签名的 `v`、`r` 和 `s` 值

### 调用许可参数 {: #call-permit-arguments }

如[调用许可接口](#the-call-permit-interface)部分所示，`dispatch` 函数接受以下参数：`from`、`to`、`value`、`data`、`gasLimit`、`deadline`、`v`、`r` 和 `s`。

为了获得签名参数（`v`、`r` 和 `s`），您需要签署一条消息，其中包含上述其余参数的参数以及签名者的随机数。

- `from` - 您要使用其签名调用许可的帐户地址
- `to` - `SetMessage.sol` 合约的合约地址
- `value` - 在此示例中可以为 `0`，因为您只需设置消息，而无需转移任何资金
- `data` – 您可以发送任何您想要的消息，你只需要使用 `SetMessage.sol` 合约设置的消息的十六进制表示形式。这将包含 `set` 函数的函数选择器和消息字符串。对于此示例，您可以发送 `hello world`。为此，您可以使用此十六进制表示形式：
    ```text
    0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000
    ```
- `gasLimit` - `100000` 足以发送已调度的调用
- `deadline` - 您可以通过在 JavaScript 脚本或浏览器控制台中运行 `console.log(Math.floor(Date.now() / 1000))` 来获取 UNIX 秒的当前时间。获得当前时间后，您可以添加额外的秒数来表示调用许可的到期时间

还需要签名者的随机数。如果这是您第一次签署调用许可，则随机数将为 `0`。您也可以在 Remix 中检查随机数：

1. 展开调用许可合约
1. 在 **nonces** 函数旁边，输入签名者的地址，然后单击 **nonces**
1. 结果将直接在函数下返回

![获取随机数](/images/builders/ethereum/precompiles/ux/call-permit/call-6.webp)

### 使用浏览器 {: #use-the-browser }

要开始，您可以在浏览器中打开 [JSFiddle](https://jsfiddle.net){target=\_blank} 或其他 JavaScript 游乐场。首先，您需要添加 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}，因为它将用于获取签名的 `v`、`r` 和 `s` 值：

1. 点击 **Resources**
1. 开始输入 `ethers`，下拉列表应填充匹配的库。选择 **ethers**
1. 点击 **+** 按钮

Ethers.js 的 CDN 将出现在 **Resources** 下的库列表中。

![将 Ethers 添加到 JSFiddle](/images/builders/ethereum/precompiles/ux/call-permit/call-7.webp)

在 **Javascript** 代码框中，复制并粘贴以下 JavaScript 代码段，确保替换 `to` 变量（以及您认为合适的任何其他变量）：

```js
--8<-- 'code/builders/ethereum/precompiles/ux/call-permit/browser-getSignature.js'
```

要运行代码，请单击页面顶部的 **Run**（或者您也可以使用 `control` 和 `s`）。MetaMask 应该会弹出并提示您连接一个帐户。确保选择要用来签署消息的帐户。然后继续签署消息。

![使用 MetaMask 签署消息](/images/builders/ethereum/precompiles/ux/call-permit/call-8.webp)

签署消息后，返回到 JSFiddle，如果控制台尚未打开，请打开它以查看签名值，其中包括 `v`、`r` 和 `s` 值。复制这些值，因为在以下各节中与 Call Permit Precompile 交互时需要它们。

![JSFiddle 控制台中的签名值](/images/builders/ethereum/precompiles/ux/call-permit/call-9.webp)

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

既然您已经生成了调用许可签名，您就可以测试调用调用许可预编译的`dispatch`函数了。

### 调度调用 {: #dispatch-a-call }

当您发送 `dispatch` 函数时，您需要与签署调用许可时相同的参数。首先，返回到 Remix 中的**部署和运行**选项卡，并在**已部署合约**部分展开调用许可合约。确保您已连接到您想要使用调用许可并支付交易费用的帐户。然后按照以下步骤操作：

1. 对于 **from** 字段，输入您用于签署调用许可的帐户地址

1. 复制并粘贴 `SetMessage.sol` 的合约地址

1. 在 **value** 字段中输入 `0`

1. 输入 `set` 函数的函数选择器的十六进制表示形式，以及您想要设置为 `SetMessage.sol` 合约消息的字符串。对于此示例，可以使用 `hello world`：
    text
    0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000

1. 在 **gasLimit** 字段中输入 `100000`

1. 输入您在签署调用许可时使用的 `deadline`

1. 复制您在生成调用许可签名时应该检索到的 `v` 值，并将其粘贴到 **v** 字段中

1. 复制您在生成调用许可签名时应该检索到的 `r` 值，并将其粘贴到 **r** 字段中

1. 复制您在生成调用许可签名时应该检索到的 `s` 值，并将其粘贴到 **s** 字段中

1. 单击 **transact** 以发送交易

1. MetaMask 应该会弹出，您可以确认交易

![调度调用许可](/images/builders/ethereum/precompiles/ux/call-permit/call-10.webp)

交易完成后，您可以验证消息是否已更新为 `hello world`。为此，您可以：

1. 展开 `SetMessage.sol` 合约
1. 单击 **get**
1. 结果将显示在函数下方，并且应该显示 `hello world`

![验证调度是否按预期执行](/images/builders/ethereum/precompiles/ux/call-permit/call-11.webp)

恭喜！您已成功生成调用许可签名，并使用它代表调用许可签名者调度调用。
