---
title: 安全注意事项
description: 本文介绍了以太坊开发者在 Moonbeam 上进行开发时，需要在安全注意事项方面理解的主要差异。
categories: 基础知识
---

# 安全注意事项

## 简介 {: #introduction }

在 Moonbeam 上开发智能合约时，需要注意一些安全问题，这些问题在以太坊上开发时并不适用。Moonbeam 有几个[预编译合约](/builders/ethereum/precompiles/){target=_blank}，它们是 Solidity 接口，使开发人员能够通过 Ethereum API 访问基于 Substrate 的功能，但绕过了 EVM。尽管预编译合约旨在改善开发人员的体验，但可能会有一些意想不到的后果需要考虑。

本指南将概述并提供一些在 Moonbeam 上开发时需要注意的安全问题的示例。

## 任意代码执行 {: #arbitrary-code-execution }

在Solidity中，任意代码执行是指使用任意数量的任何类型的参数来执行代码和调用其他合约的函数的能力。

当智能合约允许用户影响其自身的 `call()` 并传入任意调用数据和/或 `call()` 的目标时，它就允许对另一个合约进行任意执行。[`call()` 函数](https://solidity-by-example.org/call){target=_blank} 通过 [Solidity 中的地址数据类型](https://docs.soliditylang.org/en/latest/types.html#address){target=_blank} 提供。当 `call()` 函数被调用时，目标合约将使用任意的调用数据被调用。

当 **合约 A** 允许用户影响其对 **合约 B** 的调用时，任意代码执行遵循下图中的模式。

![任意代码执行](/images/learn/core-concepts/security/security-1.webp)

如前所述，在Moonbeam上任意执行代码的一个主要问题是，Moonbeam具有可以调用的预编译合约，这可以用来绕过通常在以太坊上可用的一些保护措施。为了在Moonbeam上安全地使用任意代码执行，您应该考虑以下几点，这些**仅适用于允许任意代码执行的合约**：

- Moonbeam [预编译合约](/builders/ethereum/precompiles/){target=_blank}，如Native ERC-20预编译、XC-20预编译和XCM相关预编译，允许用户管理和转移资产，而无需访问EVM。相反，这些操作是使用原生Substrate代码完成的。因此，如果您的合约持有原生代币或XC-20，并允许任意代码执行，则这些预编译可用于耗尽合约的余额，绕过通常由EVM强制执行的任何安全检查
- 当使用 `call()` 函数时，将交易对象的 value 属性设置为固定金额（例如，`call{value: 0}(...)`）可以通过调用原生资产预编译并在编码的调用数据中指定要转移的金额来绕过
- 允许使用您合约的用户传入任意调用数据，这将在目标合约上执行任何函数，特别是当目标合约是预编译时，这是**不**安全的。为了安全起见，您可以硬编码您想要允许执行的安全函数的功能选择器
- 在执行任意调用数据的函数中，将目标合约（包括预编译）列入黑名单**不**被认为是安全的，因为将来可能会添加其他预编译。在执行任意调用数据的函数中提供白名单目标合约被认为是安全的，前提是被调用的合约不是预编译，或者在它们是预编译的情况下，进行调用的合约不持有原生代币或任何XC-20

在以下章节中，您将通过示例了解每个安全注意事项。

### 预编译可以覆盖设置的值 {: #setting-a-value }

在以太坊上，允许任意代码执行的智能合约可以强制将调用的值设置为特定金额 (例如，`{value: 0}`），从而保证只有该金额的原生货币会随交易一起发送。而在 Moonbeam 上，[原生 ERC-20 预编译合约](/builders/ethereum/precompiles/ux/erc20/){target=_blank} 允许您通过 Substrate API 与 Moonbeam 上的原生货币进行交互，就像 ERC-20 代币一样。因此，您可以通过设置调用的 `value` 以及通过原生 ERC-20 预编译从智能合约转移 Moonbeam 原生资产。如果您设置了任意调用的 `value`，可以通过定位 [原生 ERC-20 预编译合约](/builders/ethereum/precompiles/ux/erc20/){target=_blank} 并传入调用数据来转移原生资产来覆盖它。由于 ERC-20 和 XC-20 不是原生资产，因此设置 value 属性不能为以太坊或 Moonbeam 上的这些类型的资产提供任何保护。

例如，如果您有一个允许任意代码执行的合约，并且您传递给它编码的调用数据，该数据将合约的余额转移到另一个地址，那么您基本上可以耗尽给定合约的余额。

要获取编码的调用数据，您可以使用 [Solidity 文档中概述的任何 ABI 编码函数](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#abi-encoding-and-decoding-functions){target=_blank}，包括 `abi.encodeWithSelector`，如下面的函数所示：

```solidity
function getBytes(address _erc20Contract, address _arbitraryCallContract, address _to) public view returns (bytes memory) {
    // Load ERC-20 interface of contract
    IERC20 erc20 = IERC20(_erc20Contract);
    // Get amount to transfer
    uint256 amount = erc20.balanceOf(_arbitraryCallContract);
    // Build the encoded call data
    return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
}
```

获得编码的调用数据后，您可以对 [原生 ERC-20 预编译合约](/builders/ethereum/precompiles/ux/erc20/){target=_blank} 进行任意调用，将调用的值设置为 `0`，并以字节形式传入调用数据：

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Value: 0 does not protect against native ERC-20 precompile calls or XCM precompiles
    (bool success,) = _target.call{value: 0}(_bytes);
    require(success);
}
```

`0` 的值将被编码调用数据中指定的要转移的金额覆盖，在本示例中，该金额是合约的余额。

### 白名单安全函数选择器 {: #whitelisting-function-selectors }

通过将特定的函数选择器加入白名单，您可以控制可以执行哪些函数，并确保只允许调用被认为是安全的且不调用预编译的函数。

要获取要加入白名单的函数选择器，您可以 [keccack256 哈希](https://emn178.github.io/online-tools/keccak_256.html){target=_blank} 函数的签名。

一旦您有了白名单中的函数选择器，您可以使用内联汇编从编码的调用数据中获取函数选择器，并使用 [require 函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank} 比较这两个选择器。如果来自编码的调用数据的函数选择器与白名单中的函数选择器匹配，则您可以进行调用。否则，将抛出异常。

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Get the function selector from the encoded call data
    bytes4 selector;
    assembly {
        selector := calldataload(_bytes.offset)
    }

    // Ensure the call data calls an approved and safe function
    require(selector == INSERT_WHITELISTED_FUNCTION_SELECTOR);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

## 预编译可以绕过发送者与源检查 {: #bypass-sender-origin-checks }

交易源或 `tx.origin` 是交易发起自的外部拥有账户 (EOA) 的地址。而 `msg.sender` 是启动当前调用的地址。`msg.sender` 可以是 EOA 或合约。如果一个合约调用另一个合约，而不是直接从 EOA 调用合约，则这两个值可能不同。在这种情况下，`msg.sender` 将是调用合约，而 `tx.origin` 将是最初调用调用合约的 EOA。

例如，如果 Alice 调用合约 A 中的一个函数，然后该函数调用合约 B 中的一个函数，那么在查看对合约 B 的调用时，`tx.origin` 是 Alice，而 `msg.sender` 是合约 A。

!!! note
    作为[最佳实践](https://consensysdiligence.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/tx-origin/){target=_blank}，`tx.origin` 不应用于授权。相反，您应该使用 `msg.sender`。

您可以使用 [require 函数](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank} 来比较 `tx.origin` 和 `msg.sender`。如果它们是相同的地址，那么您就可以确保只有 EOA 才能调用该函数。如果 `msg.sender` 是一个合约地址，则会抛出一个异常。

```solidity
function transferFunds(address payable _target) payable public {
    require(tx.origin == msg.sender);
    _target.call{value: msg.value};
}
```

在以太坊上，您可以使用此检查来确保给定的合约函数只能被 EOA 调用一次。这是因为在以太坊上，EOA 每次交易只能与合约交互一次。但是，Moonbeam **并非如此**，因为 EOA 可以通过使用预编译合约（例如 [批量](/builders/ethereum/precompiles/ux/batch/){target=_blank} 和 [调用许可](/builders/ethereum/precompiles/ux/call-permit/){target=_blank} 预编译）一次与合约交互多次。

使用批量预编译，用户可以原子地对合约执行多个调用。批量函数的调用者将是 `msg.sender` 和 `tx.origin`，从而可以一次进行多个合约交互。

使用调用许可预编译，如果用户想要在一个交易中与合约交互多次，他们可以通过为每个合约交互签名一个许可并在单个函数调用中调度所有许可来实现。只有当调度者与许可签名者是同一个账户时，这才会绕过 `tx.origin == msg.sender` 检查。否则，`msg.sender` 将是许可签名者，而 `tx.origin` 将是调度者，从而导致抛出异常。
