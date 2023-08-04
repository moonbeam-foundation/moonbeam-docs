---
title: Quickly Get Started
description: Everything you need to know to get started developing, deploying, and interacting with smart contracts on Moonbeam.
---

# Quick Start Guide for Developing on Moonbeam

![Get started banner](/images/builders/get-started/quick-start-banner.png)

## Quick Overview {: #overview }

Moonbeam is a fully Ethereum-compatible smart contract platform on Polkadot. As such, you can interact with Moonbeam via the [Ethereum API](/builders/build/eth-api/){target=_blank} and [Substrate API](/builders/build/substrate-api/){target=_blank}.

Although Moonbeam is a Substrate-based platform, Moonbeam uses a [unified accounts](/learn/features/unified-accounts){target=_blank} system, which replaces Substrate-style accounts and keys with Ethereum-style accounts and keys. As a result, you can interact with your Moonbeam account with [MetaMask](/tokens/connect/metamask){target=_blank}, [Ledger](/tokens/connect/ledger/){target=_blank}, and other Ethereum-compatible wallets by simply adding Moonbeam's network configurations. Similarly, you can develop on Moonbeam using Ethereum [libraries](/builders/build/eth-api/libraries/){target=_blank} and [development environments](/builders/build/eth-api/dev-env/){target=_blank}.

## Moonbeam Networks {: #moonbeam-networks }

To get started developing on Moonbeam, it's important to be aware of the various networks within the Moonbeam ecosystem.

|                                         Network                                         | Network Type  |                                  Relay Chain                                   | Native Asset Symbol | Native Asset Decimals |
|:---------------------------------------------------------------------------------------:|:-------------:|:------------------------------------------------------------------------------:|:-------------------:|:---------------------:|
|           [Moonbeam](/builders/get-started/networks/moonbeam){target=_blank}            |    MainNet    |              [Polkadot](https://polkadot.network/){target=_blank}              |        GLMR         |          18           |
|          [Moonriver](/builders/get-started/networks/moonriver){target=_blank}           |    MainNet    |                [Kusama](https://kusama.network/){target=_blank}                |        MOVR         |          18           |
|        [Moonbase Alpha](/builders/get-started/networks/moonbase){target=_blank}         |    TestNet    | [Alphanet relay](/learn/platform/networks/moonbase#relay-chain){target=_blank} |         DEV         |          18           |
| [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=_blank} | Local TestNet |                                      None                                      |         DEV         |          18           |

!!! note
    A Moonbeam development node doesn't have a relay chain as its purpose is to be your own personal development environment where you can get started developing quickly without the overhead of a relay chain.

### Network Configurations {: #network-configurations }

When working with developer tools, depending on the tool, you might need to configure Moonbeam to interact with the network. To do so, you can use the following information:

=== "Moonbeam"

    |    Variable     |                                                                                                                                              Value                                                                                                                                              |
    |:---------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                                          <pre style="padding-right: 2em">```{{ networks.moonbeam.chain_id }}```</pre>                                                                                                           |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonbeam.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonbeam.api.onfinality.io/public```</pre>  <pre style="padding-right: 2em">```https://moonbeam-mainnet.gateway.pokt.network/v1/lb/629a2b5650ec8c0039bb30f0```</pre> |
    | Public WSS URLs |                                                              <pre style="padding-right: 2em">```wss://moonbeam.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonbeam.api.onfinality.io/public-ws```</pre>                                                               |

=== "Moonriver"

    |    Variable     |                                                                                                                                               Value                                                                                                                                                |
    |:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                                           <pre style="padding-right: 2em">```{{ networks.moonriver.chain_id }}```</pre>                                                                                                            |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonriver.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonriver.api.onfinality.io/public```</pre>  <pre style="padding-right: 2em">```https://moonriver-mainnet.gateway.pokt.network/v1/lb/62a74fdb123e6f003963642f```</pre> |
    | Public WSS URLs |                                                               <pre style="padding-right: 2em">```wss://moonriver.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonriver.api.onfinality.io/public-ws```</pre>                                                               |

=== "Moonbase Alpha"

    |    Variable     |                                                                                                                             Value                                                                                                                             |
    |:---------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                         <pre style="padding-right: 2em">```{{ networks.moonbase.chain_id }}```</pre>                                                                                          |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonbase-alpha.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonbeam-alpha.api.onfinality.io/public```</pre> <pre style="padding-right: 2em">```{{ networks.moonbase.rpc_url }}```</pre> |
    | Public WSS URLs | <pre style="padding-right: 2em">```wss://moonbase-alpha.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonbeam-alpha.api.onfinality.io/public-ws```</pre> <pre style="padding-right: 2em">```{{ networks.moonbase.wss_url }}```</pre>  |

=== "Moonbeam Dev Node"

    |   Variable    |                                      Value                                      |
    |:-------------:|:-------------------------------------------------------------------------------:|
    |   Chain ID    | <pre style="padding-right: 2em">```{{ networks.development.chain_id }}```</pre> |
    | Local RPC URL | <pre style="padding-right: 2em">```{{ networks.development.rpc_url }}```</pre>  |
    | Local WSS URL | <pre style="padding-right: 2em">```{{ networks.development.wss_url }}```</pre>  |

!!! note
    You can create your own endpoint suitable for development or production from one of the [supported RPC providers](/builders/get-started/endpoints/#endpoint-providers){target=_blank}.

### Block Explorers {: #explorers }

Moonbeam provides two different kind of explorers: ones to query the Ethereum API, and others dedicated to the Substrate API. All EVM-based transactions are accessible via the Ethereum API wheras the Substrate API can be relied upon for Substrate-native functions such as governance, staking, and some information about EVM-based transactions. For more information on each explorer, please check out the [Block Explorers](/builders/get-started/explorers){target=_blank} page.

--8<-- 'text/explorers/explorers.md'

## Funding TestNet Accounts {: #testnet-tokens }

To get started developing on one of the TestNets, you'll need to fund your account with DEV tokens to send transactions. Please note that DEV tokens have no real value and are for testing purposes only.

|                                         TestNet                                         |                                                                           Where To Get Tokens From                                                                           |
|:---------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        [Moonbase Alpha](/builders/get-started/networks/moonbase){target=_blank}         | The [Moonbase Alpha Faucet](https://faucet.moonbeam.network/){target=_blank} website. <br> The faucet dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours |
| [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=_blank} | Any of the [ten pre-funded accounts](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=_blank} that come with your <br> development node  |

## Development Tools {: #development-tools }

As Moonbeam is a Substrate-based chain that is fully Ethereum-compatible, you can use Substrate-based tools and Ethereum-based tools.

### JavaScript Tools {: #javascript }

=== "Ethereum"
    |                                     Tool                                     |      Type       |
    |:----------------------------------------------------------------------------:|:---------------:|
    |    [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}    |     Library     |
    |      [Web3.js](/builders/build/eth-api/libraries/web3js){target=_blank}      |     Library     |
    |      [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}       | Dev Environment |
    | [OpenZeppelin](/builders/build/eth-api/dev-env/openzeppelin/){target=_blank} | Dev Environment |
    |        [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}         | Dev Environment |
    | [Scaffold-Eth](/builders/build/eth-api/dev-env/scaffold-eth){target=_blank}  | Dev Environment |
    |     [thirdweb](/builders/build/eth-api/dev-env/thirdweb){target=_blank}      | Dev Environment |
    |      [Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}       | Dev Environment |
    | [Waffle & Mars](/builders/build/eth-api/dev-env/waffle-mars){target=_blank}  | Dev Environment |

=== "Substrate"
    |                                      Tool                                       |  Type   |
    |:-------------------------------------------------------------------------------:|:-------:|
    | [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank} | Library |

### Python Tools {: #python }

=== "Ethereum"
    |                                Tool                                |      Type       |
    |:------------------------------------------------------------------:|:---------------:|
    | [Web3.py](/builders/build/eth-api/libraries/web3py){target=_blank} |     Library     |
    | [Brownie](/builders/build/eth-api/dev-env/brownie){target=_blank}  | Dev Environment |
    |   [thirdweb](https://portal.thirdweb.com/python){target=_blank}    | Dev Environment |

=== "Substrate"
    |                                             Tool                                              |  Type   |
    |:---------------------------------------------------------------------------------------------:|:-------:|
    | [Py Substrate Interface](/builders/build/substrate-api/py-substrate-interface){target=_blank} | Library |
