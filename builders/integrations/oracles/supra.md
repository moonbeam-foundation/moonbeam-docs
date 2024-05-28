---
title: Supra Oracles
description: Supra's Pull Oracle provides low-latency, on-demand price feed updates for a variety of use cases. Learn how to integrate Supra's oracle on Moonbeam.
---

# Supra Oracles

## Introduction {: #introduction }

[Supra](https://supra.com){target=\_blank} is a novel, high-throughput oracle and intralayer: a vertically integrated toolkit of cross-chain solutions (data oracles, asset bridge, automation network, and more) that interlink all blockchains, public (L1s and L2s) or private (enterprises), including Moonbeam.

Supra provides decentralized oracle price feeds that can be used for on-chain and off-chain use cases such as spot and perpetual DEXes, lending protocols, and payment protocols.

This page provides everything you need to know to get started with Supra on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## How to use Supra's Price Feeds {: #price-feeds }

Supra uses a pull model as a customized approach that publishes price data upon request. It combines Web2 and Web3 methods to achieve low latency when sending data from Supra to destination chains. The process involves the following steps:

1. Web2 methods are used to retrieve price data from Supra
2. Smart contracts are utilized for cryptographically verifying and writing the latest price data on-chain, where it lives on immutable ledgers, using [Supra's Pull Oracle V1](https://supra.com/docs/data-feeds/pull-model){target=\_blank}
3. Once the data has been written on-chain, the most recently published price feed data will be available in Supra's Storage contract

The addresses for Supra's contracts on Moonbeam are as follows:

=== "Moonbeam"

    |  Contract   |                                                               Address                                                               |
    |:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbeam.supra.pull_oracle }}](https://moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=\_blank} |
    |   Storage   |     [{{ networks.moonbeam.supra.storage }}](https://moonscan.io/address/{{ networks.moonbeam.supra.storage }}){target=\_blank}     |

=== "Moonbase Alpha"

    |  Contract   |                                                                   Address                                                                    |
    |:-----------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbase.supra.pull_oracle }}](https://moonbase.moonscan.io/address/{{ networks.moonbase.supra.pull_oracle }}){target=\_blank} |
    |   Storage   |     [{{ networks.moonbase.supra.storage }}](https://moonbase.moonscan.io/address/{{ networks.moonbase.supra.storage }}){target=\_blank}     |

!!! note
    Moonriver is not supported at this time.

### List of Available Price Feeds {: #list-of-available-price-feeds }

To view a complete list of the available data pairs provided by Supra, please check out their [data feeds catalog](https://supra.com/docs/data-feeds/data-feeds-index) on their documentation site.

To interact with any of these data pairs, you'll need to take note of the pair's **Pair ID**.

### Try It Out {: #try-it-out }

Try out a basic example of how to fetch price data using Supra's pull model with step-by-step instructions in the [Fetching Price Data with Supra Oracles](/tutorials/integrations/supra/){target=\_blank} tutorial. You'll learn how to tackle each of the three steps mentioned in the [previous section](#price-feeds).

## Connect with Supra {: #connect-with-supra }

Still looking for answers? Supra's got them! Check out all the ways you can reach the Supra team:

- Visit [Supra's websites at supraoracles.com](https://supra.com){target=\_blank}
- Read their [docs](https://supra.com/docs/overview){target=\_blank}
- Chat with them on [Telegram](https://t.me/SupraOracles){target=\_blank}
- Follow them on [Twitter](https://twitter.com/SupraOracles){target=\_blank}
- Join their [Discord](https://discord.com/invite/supraoracles){target=\_blank}
- Check out their [Youtube](https://www.youtube.com/SupraOfficial){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
