---
title: GMP 预编译
description: 了解 Moonbeam 上的 GMP 预编译，以及如何将其与 Wormhole 等桥提供的 Moonbeam 路由流动性程序一起使用。
keywords: solidity, ethereum, GMP, wormhole, moonbeam, bridge, connected, contracts, MRL
categories: Precompiles, Ethereum Toolkit
---

# 与 GMP 预编译交互

## 简介 {: #introduction }

Moonbeam 路由流动性 (MRL) 是指 Moonbeam 作为始发链的流动性进入其他 Polkadot 平行链的端口平行链的用例。这可以通过通用消息传递 (GMP) 实现，其中具有任意数据和代币的消息可以通过[链无关 GMP 协议](/builders/interoperability/protocols/){target=\_blank}跨非平行链区块链发送。这些 GMP 协议可以与 [Polkadot 的 XCM 消息传递系统](/builders/interoperability/xcm/overview/){target=\_blank} 结合使用，以实现无缝的流动性路由。

GMP 预编译充当 Moonbeam 路由流动性的接口，充当来自 GMP 协议的携带代币的消息与通过 [XCMP](/builders/interoperability/xcm/overview/#xcm-transport-protocols){target=\_blank} 连接到 Moonbeam 的平行链之间的中间人。目前，GMP 预编译仅支持通过 [Wormhole GMP 协议](/builders/interoperability/protocols/wormhole/){target=\_blank} 中继流动性。

GMP 预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.gmp}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.gmp}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.gmp}}
     ```

在实践中，开发人员不太可能直接与预编译交互。GMP 协议的中继器与预编译交互以完成跨链操作，因此跨链操作发起的始发链是开发人员有责任确保最终使用 GMP 预编译的地方。

## GMP Solidity 接口 {: #the-gmp-solidity-interface }

[`Gmp.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/gmp/Gmp.sol){target=\_blank} 是一个 Solidity 接口，允许开发人员与预编译进行交互。

??? code "Gmp.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/interoperability/gmp/gmp.sol'
    ```
    

GMP 预编译有一个方法：

- **wormholeTransferERC20**(*bytes memory* vaa) - 接收 Wormhole 桥接传输 [已验证操作批准 (VAA)](https://wormhole.com/docs/protocol/infrastructure/vaas/){target=\_blank}，通过 Wormhole 代币桥铸造代币，并将流动性转发到自定义负载的 [多位置](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank}。有效负载应为预编译特定的 SCALE 编码对象，如本指南的 [为 Wormhole 构建有效负载](#building-the-payload-for-wormhole) 部分中所述

VAA 是在原始链交易后生成的包含有效负载的包，由 Wormhole [守护者](https://wormhole.com/docs/protocol/infrastructure/guardians/){target=\_blank} 发现。

用户必须与预编译交互的最常见情况是在恢复期间，即中继器未完成 MRL 交易。例如，用户必须搜索其原始链交易随附的 VAA，并手动调用 `wormholeTransferERC20` 函数。

## 构建 Wormhole 的有效负载 {: #building-the-payload-for-wormhole }

目前，GMP 预编译仅支持通过 Wormhole、Moonbeam 并进入其他平行链来发送流动性。GMP 预编译不协助从平行链返回 Moonbeam，进而返回 Wormhole 连接链的路线。

要从像 Ethereum 这样的 Wormhole 连接的原始链发送流动性，用户必须在 [原始链的部署](https://wormhole.com/docs/protocol/infrastructure/core-contracts/#token-bridge){target=\_blank}上调用[ `transferTokensWithPayload` 方法](https://wormhole.com/docs/protocol/infrastructure/vaas/#token--message){target=\_blank}，该部署是 [WormholeTokenBridge 智能合约](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=\_blank}。此函数需要一个字节有效负载，该有效负载必须格式化为 SCALE 编码的多位置对象，并包装在 [另一个预编译特定的版本类型](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=\_blank}中。

如果您不熟悉 Polkadot 生态系统，您可能不熟悉 SCALE 编码和多位置。[SCALE 编码](https://docs.polkadot.com/polkadot-protocol/parachain-basics/data-encoding/){target=\_blank}是 Polkadot 使用的一种紧凑的编码形式。[ `MultiLocation` 类型](https://wiki.polkadot.com/learn/learn-xcvm/){target=\_blank}用于定义 Polkadot 中的相对点，例如特定平行链（Polkadot 区块链）上的特定帐户。

Moonbeam 的 GMP 协议需要一个多位置来表示流动性路由的目的地，这很可能意味着另一个平行链上的一个帐户。无论它是什么，此目的地都必须表示为相对于 Moonbeam。

!!! remember
    多位置的相对性很重要，因为平行链团队可能会错误地给您一个相对于他们自己链的多位置，这可能会有所不同。提供不正确的多位置可能会导致**资金损失**！

每个平行链都有其解释多位置的特定方法，并且应与项目确认您形成的多位置是否正确。但是，您很可能正在使用帐户形成多位置。

多种类型的帐户可以包含在多位置中，您在构建多位置时必须事先知道。最常见的两种是：

- **AccountKey20** — 长度为 20 字节的帐户 ID，包括与 Ethereum 兼容的帐户 ID，例如 Moonbeam 上的帐户 ID
- **AccountId32** — 长度为 32 字节的帐户 ID，Polkadot 及其平行链中的标准

以下多位置模板以 Moonbeam 作为相对原点，定位其他平行链上的帐户。要使用它们，请将 `INSERT_PARACHAIN_ID` 替换为您要将资金发送到的网络的平行链 ID，并将 `INSERT_ADDRESS` 替换为您要将资金发送到该平行链上的帐户地址。

=== "AccountId32"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/interoperability/gmp/1.js'
    ```

=== "AccountKey20"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/interoperability/gmp/2.js'
    ```

如果没有合适的工具，正确地 SCALE 编码整个有效负载可能具有挑战性，这主要是由于 [预编译所需的自定义类型](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/precompiles/gmp/src/types.rs#L25-L48){target=\_blank}。幸运的是，Polkadot.js API 可以帮助解决这个问题。

预编译所需的版本化用户操作接受两个版本：V1 和 V2。V1 接受 `XcmRoutingUserAction` 类型，该类型尝试将转移的资产路由到多位置定义的 Destination。V2 接受 `XcmRoutingUserActionWithFee` 类型，该类型也尝试将转移的资产路由到 Destination，并允许支付费用。Relayer 可以使用 V2 在 Moonbeam 上指定费用，以将交易转发到给定的 Destination。

以下脚本展示了如何创建一个 `Uint8Array`，该 `Uint8Array` 可用作 GMP 预编译的有效负载：

=== "V1 有效载荷"

    ```typescript
    --8<-- 'code/builders/ethereum/precompiles/interoperability/gmp/v1-payload.ts'
    ```

=== "V2 有效载荷"

    ```typescript
    --8<-- 'code/builders/ethereum/precompiles/interoperability/gmp/v2-payload.ts'
    ```

## 限制 {: #restrictions }

GMP 预编译目前还处于早期阶段。存在许多限制，并且它仅支持进入平行链的“快乐路径”。以下是您应该注意的一些限制：

- 目前没有费用机制。在 Moonbeam 上运行流动性转发到平行链的中继者将补贴交易。将来可能会改变
- 预编译不会检查以确保目标链支持要发送给它的代币。**不正确的多重位置可能导致资金损失**
- 构建多重位置时出错会导致回滚，这将困住代币并导致资金损失
- 目前没有从平行链到以太坊等其他链的推荐向后路径。在实现一键式方法之前，必须完成额外的协议级工作
  - 由于 ERC-20 XC 资产的限制，从平行链发送代币回 Moonbeam 的唯一方法是在原始平行链上拥有 xcGLMR，并在发送代币返回时将其用作费用资产
