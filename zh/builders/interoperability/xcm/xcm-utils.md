---
title: XCM 实用程序预编译合约
description: 了解 Moonbeam 的预编译 XCM 实用程序合约为智能合约开发人员提供的各种与 XCM 相关的实用程序函数。
keywords: solidity, ethereum, xcm, utils, moonbeam, precompiled, contracts
categories: XCM
---

# 与 XCM 实用程序预编译交互

## 简介 {: #xcmutils-precompile}

XCM Utilities Precompile 合约为开发者提供了直接在 EVM 中的 XCM 相关实用功能。这使得与其他 XCM 相关预编译合约的交易和互动更加容易。

与其他 [预编译合约](/builders/ethereum/precompiles/){target=_blank} 类似，XCM Utilities Precompile 位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xcm_utils }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xcm_utils }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xcm_utils}}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## XCM实用程序Solidity接口 {: #xcmutils-solidity-interface }

[XcmUtils.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank} 是与预编译交互的接口。

!!! note
    预编译将在未来更新，以包括其他功能。请随时在 [Discord](https://discord.com/invite/PfpUATX){target=_blank} 中建议其他实用功能。

该接口包括以下函数：

 - **multilocationToAddress**(*Multilocation memory* multilocation) — 只读函数，从给定的多位置返回计算出的原始帐户
 - **weightMessage**(*bytes memory* message) — 只读函数，返回XCM消息将在链上消耗的权重。message 参数必须是SCALE编码的XCM版本XCM消息
 - **getUnitsPerSecond**(*Multilocation memory* multilocation) — 只读函数，以`Multilocation`的形式获取给定资产的每秒单位数。多位置必须描述一个可以作为费用支付支持的资产，例如 [外部XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，否则此函数将恢复。

    !!! note
        请注意，此函数仍然返回每秒单位数据，但每秒单位已被弃用，并被相对价格的计算所取代。有关详细信息，请参阅 [XC 资产注册](/builders/interoperability/xcm/xc-registration/assets#generate-encoded-calldata-for-asset-registration){target=_blank}。

 - **xcmExecute**(*bytes memory* message, *uint64* maxWeight) - **仅在Moonbase Alpha上可用** - 给定要执行的SCALE编码版本消息和要消耗的最大权重，执行自定义XCM消息。由于`Transact`指令的性质，无法从智能合约调用此函数
 - **xcmSend**(*Multilocation memory* dest, *bytes memory* message) - **仅在Moonbase Alpha上可用** - 给定要将消息发送到的目标链的多位置和要发送的SCALE编码版本消息，发送自定义XCM消息

XCM实用程序预编译中的`Multilocation`结构与[XCM交易器预编译的](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/#building-the-precompile-multilocation){target=_blank} `Multilocation` 构建方式相同。

## 使用 XCM 实用程序预编译 {: #using-the-xcmutils-precompile }

XCM 实用程序预编译允许用户从 Ethereum JSON-RPC 读取数据，而无需通过 Polkadot 库。这些函数更多是为了方便起见，而不是为了智能合约用例。

对于 `multilocationToAddress`，一个用例是通过将其他平行链的计算来源地址列入白名单来允许源自其他平行链的交易。用户可以通过计算和存储地址来将多位置列入白名单。EVM 交易可以通过[远程 EVM 调用](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=_blank}源自其他平行链。

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

import "https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol";

contract MultilocationWhitelistExample {
    XcmUtils xcmutils = XcmUtils(0x000000000000000000000000000000000000080C);
    mapping(address => bool) public whitelistedAddresses;

    modifier onlyWhitelisted(address addr) {
        _;
        require(whitelistedAddresses[addr], "Address not whitelisted!");
        _;
    }

    function addWhitelistedMultilocation(
        XcmUtils.Multilocation calldata externalMultilocation
    ) external onlyWhitelisted(msg.sender) {
        address derivedAddress = xcmutils.multilocationToAddress(
            externalMultilocation
        );
        whitelistedAddresses[derivedAddress] = true;
    }

    ...
}
```

要查看如何使用 `xcmExecute` 函数在本地执行自定义 XCM 消息的示例，请参阅[创建和执行自定义 XCM 消息](/builders/interoperability/xcm/send-execute-xcm/#execute-xcm-utils-precompile){target=_blank}指南。
