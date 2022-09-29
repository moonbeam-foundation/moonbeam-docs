---
title: Quickly Get Started
description: Everything you need to know to get started developing, deploying, and interacting with smart contracts on Moonbeam.
---

# Quick Start Guide for Developing on Moonbeam

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## Quick Overview {: #overview }

Moonbeam is a fully Ethereum-compatible smart contract platform on Polkadot. As such, you can interact with Moonbeam via the [Ethereum API](/builders/build/eth-api/){target=_blank} and [Substrate API](/builders/build/substrate-api/){target=_blank}.

Although Moonbeam is a Substrate-based platform, Moonbeam uses a [unified accounts](/learn/features/unified-accounts){target=_blank} system, which replaces Substrate-style accounts and keys with Ethereum-style accounts and keys. As a result, you can interact with your Moonbeam account using [MetaMask](/tokens/connect/metamask){target=_blank}, [Ledger](/tokens/connect/ledger/){target=_blank}, and Ethereum [libraries](/builders/build/eth-api/libraries/){target=_blank} and [development environments](/builders/build/eth-api/dev-env/){target=_blank}.

## Moonbeam Networks {: #moonbeam-networks }

To get started developing on Moonbeam, it's important to be aware of the various networks within the Moonbeam ecosystem.

|                                             Network                                             | Network Type  |                                      Relay Chain                                       | Native Asset Symbol | Native Asset Decimals |
|:-----------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------:|:-------------------:|:---------------------:|
|           [Moonbeam](<br>/builders/get-started/networks/moonbeam<br>){target=_blank}            |    MainNet    |              [Polkadot](<br>https://polkadot.network/<br>){target=_blank}              |        GLMR         |          18           |
|          [Moonriver](<br>/builders/get-started/networks/moonriver<br>){target=_blank}           |    MainNet    |                [Kusama](<br>https://kusama.network/<br>){target=_blank}                |        MOVR         |          18           |
|        [Moonbase Alpha](<br>/builders/get-started/networks/moonbase<br>){target=_blank}         |    TestNet    | [Alphanet relay](<br>/learn/platform/networks/moonbase#relay-chain<br>){target=_blank} |         DEV         |          18           |
| [Moonbeam Development Node](<br>/builders/get-started/networks/moonbeam-dev<br>){target=_blank} | Local TestNet |                                          None                                          |         DEV         |          18           |

!!! note
    A Moonbeam development node doesn't have a relay chain as its purpose is to be your own personal development environment where you can get started developing quickly without the overhead of a relay chain.

### Network Configurations {: #network-configurations }

When working with developer tools, depending on the tool, you might need to configure Moonbeam to interact with the network. To do so, you can use the following information:

=== "Moonbeam"

    |    Variable     |                                                                                                                                                                                    Value                                                                                                                                                                                     |
    |:---------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                                                                                 <pre style="padding-right: 2em">```{{ networks.moonbeam.chain_id }}```</pre>                                                                                                                                                 |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonbeam.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonbeam.api.onfinality.io/public```</pre>  <pre style="padding-right: 2em">```https://moonbeam-mainnet.gateway.pokt.network/v1/lb/629a2b5650ec8c0039bb30f0```</pre> <pre style="padding-right: 2em">```https://moonbeam-rpc.dwellir.com```</pre> |
    | Public WSS URLs |                                                               <pre style="padding-right: 2em">```wss://moonbeam.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonbeam.api.onfinality.io/public-ws```</pre> <pre style="padding-right: 2em">```wss://moonbeam-rpc.dwellir.com```</pre>                                                                |

=== "Moonriver"

    |    Variable     |                                                                                                                                                                                      Value                                                                                                                                                                                       |
    |:---------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                                                                                  <pre style="padding-right: 2em">```{{ networks.moonriver.chain_id }}```</pre>                                                                                                                                                   |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonriver.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonriver.api.onfinality.io/public```</pre>  <pre style="padding-right: 2em">```https://moonriver-mainnet.gateway.pokt.network/v1/lb/62a74fdb123e6f003963642f```</pre> <pre style="padding-right: 2em">```https://moonriver-rpc.dwellir.com```</pre> |
    | Public WSS URLs |                                                                <pre style="padding-right: 2em">```wss://moonriver.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonriver.api.onfinality.io/public-ws```</pre> <pre style="padding-right: 2em">```wss://moonriver-rpc.dwellir.com```</pre>                                                                |

=== "Moonbase Alpha"

    |    Variable     |                                                                                                                                  Value                                                                                                                                  |
    |:---------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Chain ID     |                                                                                              <pre style="padding-right: 2em">```{{ networks.moonbase.chain_id }}```</pre>                                                                                               |
    | Public RPC URLs | <pre style="padding-right: 2em">```https://moonbase-alpha.public.blastapi.io```</pre> <pre style="padding-right: 2em">```https://moonbeam-alpha.api.onfinality.io/public```</pre> <pre style="padding-right: 2em">```https://rpc.api.moonbase.moonbeam.network```</pre> |
    | Public WSS URLs |  <pre style="padding-right: 2em">```wss://moonbase-alpha.public.blastapi.io```</pre> <pre style="padding-right: 2em">```wss://moonbeam-alpha.api.onfinality.io/public-ws```</pre> <pre style="padding-right: 2em">```wss://wss.api.moonbase.moonbeam.network```</pre>   |

!!! note
    You can create your own endpoint suitable for development or production from one of the [supported RPC providers](/builders/get-started/endpoints/#endpoint-providers){target=_blank}.

### Block Explorers {: #explorers }

Moonbeam provides two different kind of explorers: ones to query the Ethereum API, and others dedicated to the Substrate API. All EVM-based transactions are accessible via the Ethereum API wheras the Substrate API can be relied upon for Substrate-native functions such as governance, staking, and some information about EVM-based transactions. For more information on each explorer, please check out the [Block Explorers](/builders/get-started/explorers){target=_blank} page.

=== "Moonbeam"
    |                                                        Block Explorer                                                        |   Type    |                           URL                           |
    |:----------------------------------------------------------------------------------------------------------------------------:|:---------:|:-------------------------------------------------------:|
    |                                   [Moonscan](https://moonbeam.moonscan.io/){target=_blank}                                   |    EVM    |              https://moonbeam.moonscan.io/              |
    |                              [Blockscout](https://blockscout.moonbeam.network/){target=_blank}                               |    EVM    |          https://blockscout.moonbeam.network/           |
    |                     [Expedition](https://moonbeam-explorer.netlify.app/?network=Moonbeam){target=_blank}                     |    EVM    | https://moonbeam-explorer.netlify.app/?network=Moonbeam |
    |                                    [Subscan](https://moonbeam.subscan.io/){target=_blank}                                    | Substrate |              https://moonbeam.subscan.io/               |
    | [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/explorer){target=_blank} | Substrate |         https://polkadot.js.org/apps/#/explorer         |


=== "Moonriver"
    |                                                        Block Explorer                                                         |   Type    |                           URL                            |
    |:-----------------------------------------------------------------------------------------------------------------------------:|:---------:|:--------------------------------------------------------:|
    |                                   [Moonscan](https://moonriver.moonscan.io/){target=_blank}                                   |    EVM    |              https://moonriver.moonscan.io/              |
    |                          [Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank}                          |    EVM    |      https://blockscout.moonriver.moonbeam.network/      |
    |                     [Expedition](https://moonbeam-explorer.netlify.app/?network=Moonriver){target=_blank}                     |    EVM    | https://moonbeam-explorer.netlify.app/?network=Moonriver |
    |                                    [Subscan](https://moonriver.subscan.io/){target=_blank}                                    | Substrate |              https://moonriver.subscan.io/               |
    | [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/explorer){target=_blank} | Substrate |         https://polkadot.js.org/apps/#/explorer          |

=== "Moonbase Alpha"
    |                                                     Block Explorer                                                      |   Type    |                             URL                              |
    |:-----------------------------------------------------------------------------------------------------------------------:|:---------:|:------------------------------------------------------------:|
    |                                [Moonscan](https://moonbase.moonscan.io/){target=_blank}                                 |    EVM    |                https://moonbase.moonscan.io/                 |
    |                   [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank}                    |    EVM    |    https://moonbase-blockscout.testnet.moonbeam.network/     |
    |                [Expedition](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=_blank}                |    EVM    | https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha |
    |                                 [Subscan](https://moonbase.subscan.io/){target=_blank}                                  | Substrate |                 https://moonbase.subscan.io/                 |
    | [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank} | Substrate |           https://polkadot.js.org/apps/#/explorer            |


## Moonbeam Accounts {: #moonbeam-accounts }

Since Moonbeam accounts are H160 Ethereum-style accounts, you can use your Ethereum account or create an account using any of the supported [wallets](/tokens/connect/){target=_blank}. You'll simply need to add the Moonbeam network configurations to your wallet and switch to the Moonbeam network to see your account balance.

You can also create an account using Ethereum libraries such as [Ethers.js](https://docs.ethers.io/v5/api/signer/#Wallet){target=_blank}, [Web3.js](https://web3js.readthedocs.io/en/v1.8.0/web3-eth-accounts.html#eth-accounts){target=_blank}, or [Web3.py](https://web3py.readthedocs.io/en/latest/web3.eth.account.html#eth-account){target=_blank}.

### Funding TestNet Accounts {: #testnet-tokens }

To get started developing on one of the TestNets, you'll need to fund your account with DEV tokens to send transactions. Please note that DEV tokens have no real value and are for testing purposes only.

|                                             TestNet                                             |                                                                                     Where To Get Tokens From                                                                                     |
|:-----------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        [Moonbase Alpha](<br>/builders/get-started/networks/moonbase<br>){target=_blank}         | The [Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank} website. <br> The faucet dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours |
| [Moonbeam Development Node](<br>/builders/get-started/networks/moonbeam-dev<br>){target=_blank} |           Any of the [ten pre-funded accounts](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=_blank} that come with your <br> development node            |

## Development Tools

As Moonbeam is a Substrate-based chain that is fully Ethereum-compatible, you can use Substrate-based tools and Ethereum-based tools.

### JavaScript Tools {: #javascript }

=== "Ethereum"
    |                                     Tool                                     |      Type       |
    |:----------------------------------------------------------------------------:|:---------------:|
    |    [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}    |     Library     |
    |      [Web3.js](/builders/build/eth-api/libraries/web3js){target=_blank}      |     Library     |
    | [OpenZeppelin](/builders/build/eth-api/dev-env/openzeppelin/){target=_blank} | Dev Environment |
    |        [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}         | Dev Environment |
    |      [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}       | Dev Environment |
    |      [Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}       | Dev Environment |
    | [Waffle & Mars](/builders/build/eth-api/dev-env/waffle-mars){target=_blank}  | Dev Environment |
    | [Scaffold-Eth](/builders/build/eth-api/dev-env/scaffold-eth){target=_blank}  | Dev Environment |
    
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

=== "Substrate"
    |                                             Tool                                              |  Type   |
    |:---------------------------------------------------------------------------------------------:|:-------:|
    | [Py Substrate Interface](/builders/build/substrate-api/py-substrate-interface){target=_blank} | Library |

