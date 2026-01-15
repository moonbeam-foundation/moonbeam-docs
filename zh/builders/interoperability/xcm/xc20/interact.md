---
title: 与 XC-20 交互
description: 查看 XC-20 Solidity 接口，包括 ERC-20 和 ERC-20 Permit 接口，以及如何使用这些接口与外部 XC-20 交互。
categories: XC-20
---

# 在Moonbeam上与XC-20互动

## 简介 {: #introduction }

正如[XC-20s 概述](/builders/interoperability/xcm/xc20/overview/){target=_blank}页面中所述，XC-20s 是 Moonbeam 上一种独特的资产类别。虽然它们是 Substrate 原生资产，但它们也具有 ERC-20 接口，并且可以像任何其他 ERC-20 一样进行交互。此外，ERC-20 许可接口适用于所有外部 XC-20。

本指南涵盖了 XC-20 Solidity 接口，包括标准 ERC-20 接口和 ERC-20 许可接口，以及如何使用这些接口与外部 XC-20 进行交互。

## XC-20s Solidity 接口 {: #xc20s-solidity-interface }

两种类型的 XC-20s 都具有标准的 ERC-20 接口。此外，所有外部 XC-20s 还具有 ERC-20 Permit 接口。以下两个部分分别描述了每个接口。

### ERC-20 Solidity 接口 {: #the-erc20-interface }

如前所述，您可以通过 ERC-20 接口与 XC-20 交互。Moonbeam 上的 [ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank} 接口遵循 [EIP-20 代币标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，这是智能合约中代币的标准 API 接口。该标准定义了代币合约必须实现的必要函数和事件，以与不同的应用程序互操作。

该接口包括以下函数：

- **name()** — 只读函数，返回代币的名称
- **symbol()** — 只读函数，返回代币的符号
- **decimals()** — 只读函数，返回代币的小数位数
- **totalSupply()** — 只读函数，返回现有代币的总数
- **balanceOf**(*address* who) — 只读函数，返回指定地址的余额
- **allowance**(*address* owner, *address* spender) — 只读函数，检查并返回允许消费方代表所有者消费的代币数量
- **transfer**(*address* to, *uint256* value) — 将给定数量的代币转移到指定地址，如果转移成功，则返回 `true`
- **approve**(*address* spender, *uint256* value) — 批准提供的地址代表 `msg.sender` 消费指定数量的代币。如果成功，则返回 `true`
- **transferFrom**(*address* from, *address* to, *uint256* value) — 将代币从一个给定地址转移到另一个给定地址，如果成功，则返回 `true`

!!! note
    ERC-20 标准未指定多次调用 `approve` 的影响。使用此函数多次更改津贴会启用可能的攻击媒介。为了避免不正确或意外的交易排序，您可以先将 `spender` 津贴减少到 `0`，然后再设置所需的津贴。有关攻击媒介的更多详细信息，您可以查看 [ERC-20 API：批准/转移方法的攻击媒介](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#){target=_blank} 概述。

该接口还包括以下必需的事件：

- **Transfer**(*address indexed* from, *address indexed* to, *uint256* value) - 当执行转移时发出
- **Approval**(*address indexed* owner, *address indexed* spender, *uint256* value) - 当注册批准时发出

### ERC-20 Permit Solidity 接口 {: #the-erc20-permit-interface }

外部 XC-20 也具有 ERC-20 Permit 接口。 Moonbeam 上的 [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/Permit.sol){target=_blank} 接口遵循 [EIP-2612 标准](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}，该标准使用 `permit` 函数扩展了 ERC-20 接口。Permit 是已签名的消息，可用于更改帐户的 ERC-20 额度。 请注意，本地 XC-20 也可以具有 Permit 接口，但这不是它们满足 XCM 就绪的必要条件。

标准 ERC-20 `approve` 函数的设计受到限制，因为 `allowance` 只能由交易的发送者 `msg.sender` 修改。这可以在 [OpenZeppelin 的 ERC-20 接口实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank} 中看到，它通过 [`msgSender` 函数](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank} 设置 `owner`，最终将其设置为 `msg.sender`。

用户可以不签署 `approve` 交易，而是签署消息，并且该签名可用于调用 `permit` 函数以修改 `allowance`。 因此，它允许无 gas 的代币转移。 此外，用户不再需要发送两个交易来批准和转移代币。 要查看 `permit` 函数的示例，您可以查看 [OpenZeppelin 的 ERC-20 Permit 扩展实现](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}。

[Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/Permit.sol){target=_blank} 接口包括以下函数：

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - 使用批准许可，任何人都可以调用
- **nonces**(*address* owner) - 返回给定所有者的当前随机数
- **DOMAIN_SEPARATOR**() - 返回 EIP-712 域分隔符，用于避免重放攻击。它遵循 [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} 实现

**DOMAIN_SEPARATOR()** 在 [EIP-712 标准](https://eips.ethereum.org/EIPS/eip-712){target=_blank} 中定义，计算方法如下：

```text
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

hash 的参数可以分解如下：

- **PERMIT_DOMAIN** - 是指 `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)` 的 `keccak256`
- **name** - 是代币名称，但需要考虑以下事项：
    - 如果代币定义了名称，则域的 **name** 是 `XC20: <name>`，其中 `<name>` 是代币名称
    - 如果代币未定义名称，则域的 **name** 是 `XC20: No name`
- **version** - 是签名域的版本。 对于这种情况，**version** 设置为 `1`
- **chainId** - 是网络的链 ID
- **verifyingContract** - 是 XC-20 地址

!!! note
    在运行时升级 1600 之前，**name** 字段不遵循标准 [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} 实现。

域分隔符的计算可以在 [Moonbeam 的 EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank} 实现中看到，[OpenZeppelin 的 `EIP712` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank} 中显示了一个实际示例。

除了域分隔符之外，[`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank} 保证签名只能用于具有给定函数参数的 `permit` 函数。 它使用给定的随机数来确保签名不会受到重放攻击。 哈希结构的计算可以在 [Moonbeam 的 EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank} 实现中看到，[OpenZeppelin 的 `ERC20Permit` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank} 中显示了一个实际示例。

域分隔符和哈希结构可用于构建完全编码消息的[最终哈希](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank}。 [OpenZeppelin 的 `EIP712` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank} 中显示了一个实际示例。

使用最终哈希和 `v`、`r` 和 `s` 值，可以[验证和恢复](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224){target=_blank}签名。 如果成功验证，随机数将增加 1，并且额度将会更新。

## 使用 ERC-20 接口与外部 XC-20 进行交互 {: #interact-with-the-precompile-using-remix }

本指南的这一部分将向您展示如何使用 [Remix](/builders/ethereum/dev-env/remix/){target=_blank} 通过 ERC-20 接口与 XC-20 进行交互。由于本地 XC-20 是常规 ERC-20 的表示，本节重点介绍外部 XC-20。

要与外部 XC-20 进行交互，您需要首先计算要交互的 XC-20 资产的预编译地址。然后，您可以像使用任何其他 ERC-20 一样与 ERC-20 接口进行交互。

您可以调整本节中的说明，以便与 [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/Permit.sol){target=_blank} 接口一起使用。

### 检查先决条件 {: #checking-prerequisites }

要通过 ERC-20 接口批准支出或转移外部 XC-20，您将需要：

- [已安装 MetaMask 并连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank} TestNet
- 在 Moonbase Alpha 上创建或拥有两个帐户
- 至少一个帐户需要用 `DEV` 代币进行充值。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### 计算外部 XC-20 预编译地址 {: #calculate-xc20-address }

在您可以通过 ERC-20 接口与外部 XC-20 交互之前，您需要从资产 ID 派生外部 XC-20 的预编译地址。

外部 XC-20 预编译地址的计算方式如下：

text
address = '0xFFFFFFFF...' + DecimalToHex(AssetId)

根据上述计算，第一步是获取资产 ID 的 *u128* 表示形式并将其转换为十六进制值。您可以使用您选择的搜索引擎来查找将十进制转换为十六进制值的简单工具。对于资产 ID `42259045809535163221576417993425387648`，十六进制值为 `1FCACBD218EDC0EBA20FC2308C778080`。

外部 XC-20 预编译只能介于 `0xFFFFFFFF00000000000000000000000000000000` 和 `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF` 之间。

由于以太坊地址的长度为 40 个字符，因此您需要从最初的八个 `F` 开始，然后将 `0` 预置到十六进制值，直到地址具有 40 个字符。

已经计算出的十六进制值为 32 个字符长，因此将八个 `F` 预置到十六进制值将为您提供与 XC-20 预编译交互所需的 40 个字符地址。对于此示例，完整地址为 `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`。

现在您已经计算出外部 XC-20 预编译地址，您可以像使用 Remix 中的任何其他 ERC-20 一样，使用该地址与 XC-20 进行交互。

### 添加和编译接口 {: #add-the-interface-to-remix }

您可以使用 [Remix](https://remix.ethereum.org){target=_blank} 与 ERC-20 接口进行交互。首先，您需要将接口添加到 Remix 中：

1. 获取 [ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank} 的副本
2. 将文件内容粘贴到名为 **IERC20.sol** 的 Remix 文件中

![在 Remix 中加载接口](/images/builders/interoperability/xcm/xc20/interact/interact-1.webp)

在 Remix 中加载 ERC-20 接口后，您需要对其进行编译：

1. 点击从顶部数第二个 **Compile** 标签
2. 编译 **IERC20.sol** 文件

![编译 IERC20.sol](/images/builders/interoperability/xcm/xc20/interact/interact-2.webp)

如果接口编译成功，您将在 **Compile** 标签旁边看到一个绿色对勾。

### 访问预编译 {: #access-the-precompile }

您将访问给定 XC-20 地址的接口，而不是部署 ERC-20 预编译：

1. 点击 Remix 中 **Compile（编译）** 选项卡正下方的 **Deploy and Run（部署和运行）** 选项卡。请注意，预编译合约已经部署
2. 确保在 **ENVIRONMENT（环境）** 下拉列表中选择了 **Injected Web3（注入 Web3）**。选择 **Injected Web3（注入 Web3）** 后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保在 **ACCOUNT（帐户）** 下显示了正确的帐户
4. 确保在 **CONTRACT（合约）** 下拉列表中选择了 **IERC20 - IERC20.sol**。由于这是一个预编译合约，因此无需部署任何代码。相反，您需要在 **At Address（在地址处）** 字段中提供预编译的地址
5. 提供 XC-20 的地址。对于本地 XC-20，您应该已经在 [计算外部 XC-20 预编译地址](#calculate-xc20-address){target=_blank} 部分中计算过。对于此示例，您可以使用 `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080` 并点击 **At Address（在地址处）**

![访问地址](/images/builders/interoperability/xcm/xc20/interact/interact-3.webp)

!!! note
    或者，您可以通过访问您选择的搜索引擎并搜索用于校验地址的工具来校验 XC-20 预编译地址。地址经过校验后，您可以在 **At Address（在地址处）** 字段中使用它。

XC-20 的 **IERC20** 预编译将出现在 **Deployed Contracts（已部署合约）** 列表中。现在您可以随意调用任何标准 ERC-20 函数来获取有关 XC-20 的信息或转移 XC-20。

![与预编译函数交互](/images/builders/interoperability/xcm/xc20/interact/interact-4.webp)

要了解如何与每个函数进行交互，您可以查看 [ERC-20 预编译](/builders/ethereum/precompiles/ux/erc20/){target=_blank} 指南并对其进行修改以与 XC-20 预编译进行交互。
