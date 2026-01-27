---
title: 统一账户
description: Moonbeam 以原生方式支持基于以太坊的 H160 账户和 ECDSA 密钥，取代了默认的 Substrate 账户系统。了解更多信息！
categories: Basics
---

# 统一账户

## 简介 {: #introduction }

由于 Moonbeam 被设计为 Polkadot 上与 Ethereum 兼容的平行链，因此底层账户系统将默认的 Substrate 样式账户和密钥替换为 Ethereum 样式的账户和密钥。因此，您可以使用 [MetaMask](tokens/connect/metamask/){target=\_blank} 和您可能已经熟悉的 Ethereum 工具（例如 [Remix](builders/ethereum/dev-env/remix/){target=\_blank} 和 [Hardhat](builders/ethereum/dev-env/hardhat/){target=\_blank}）与您的 Moonbeam 账户进行交互。

您还可以使用 Polkadot.js Apps 与您的 Moonbeam 账户进行交互，因为它原生支持 H160 地址和 ECDSA 密钥。有关此集成的更多信息，您可以查看 [使用 Polkadot.js Apps 与 Moonbeam 交互](tokens/connect/polkadotjs/){target=\_blank} 指南。

## Substrate EVM 兼容区块链 {: #substrate-evm-compatible-blockchain }

Polkadot 生态系统中的任何平行链都可以提供完整的 EVM 实现，从而可以在最小甚至无需更改的情况下执行基于 Solidity 的智能合约。Substrate 使这种集成成为可能 - 只需将 [EVM pallet](https://docs.rs/pallet-evm/2.0.1/pallet_evm){target=\_blank} 插入到您的运行时中以获得 EVM 支持，并将 [带有 Frontier 的以太坊 Pallet](https://github.com/polkadot-evm/frontier){target=\_blank} 用于获得以太坊 RPC 兼容性。Moonbeam 与 Parity 共同开发的这些开源模块的可用性已促使多个平行链在其链上提供以太坊兼容性。

但这里有一个重要的注意事项。使用上述配置，用户（例如 Alice）可以在基于 Substrate 的链中拥有一个以太坊样式的地址（H160 格式），该地址的长度为 40+2 个十六进制字符。此地址与一个私钥匹配，该私钥可用于在链的以太坊端签署交易。此外，该地址被映射到 Substrate Balance pallet 中的存储槽，对应于 Substrate 样式的地址（H256 格式）。

但是，Alice 只知道 H160 地址的私钥，而不知道映射版本的私钥。因此，她无法使用其 H256 地址发送交易，并且只能通过 Substrate 的 API 进行只读操作。因此，Alice 需要另一个与不同私钥匹配的 H256 地址，才能在 Substrate 链端进行操作，其中包括 staking、balances 和 governance。

下图说明了此配置。

![旧账户系统图](/images/learn/core-concepts/unified-accounts/unified-accounts-1.webp)

这可能会给 Alice 带来摩擦和糟糕的用户体验。首先，她必须将代币转移到她的 H160 映射的 H256 地址，才能通过 EVM 进行交易和部署合约。其次，她还需要在她的另一个 H256 地址（她拥有不同的私钥）中持有余额，才能使用基于 Substrate 的功能。简而言之，Alice 至少需要两个私钥才能获得两全其美。

## Moonbeam 统一账户 {: #moonbeam-unified-accounts }

Moonbeam 的重点是在 Polkadot 上创建一个完全兼容以太坊的环境，并提供最佳的用户体验。这超越了基本的以太坊功能集，还具有额外的功能，例如链上治理、质押和跨链集成。

使用统一账户，用户（例如 Bob）只需要一个 H160 地址及其相应的私钥，即可完成我们上面提到的所有操作，包括 EVM 和 Substrate 功能。

这种新配置的图表如下所示。

![新账户系统图](/images/learn/core-concepts/unified-accounts/unified-accounts-2.webp)

就是这样，Bob 只需要持有一个与一个地址匹配的私钥。他不需要在 2 个不同的账户之间转移余额，并且能够通过单个账户和私钥访问所有功能。我们已将此单个账户标准化为符合以太坊风格的 H160 地址和 ECDSA 密钥标准。
