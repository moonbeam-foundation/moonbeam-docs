---
title: Get Started with Moonbeam
description: Learn how to connect to Moonbeam via RPC and WSS endpoints, how to connect MetaMask to Moonbeam, and about the available Moonbeam block explorers.
---

# Get Started with Moonbeam

--8<-- 'text/builders/get-started/networks/moonbeam/connect.md'

## Block Explorers {: #block-explorers }

For Moonbeam, you can use any of the following block explorers:

 - **Ethereum API (Etherscan Equivalent)** — [Moonscan](https://moonbeam.moonscan.io){target=\_blank}
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonbeam){target=\_blank}
 - **Substrate API** — [Subscan](https://moonbeam.subscan.io){target=\_blank} or [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/explorer){target=\_blank}

For more information on each of the available block explorers, please head to the [Block Explorers](/builders/get-started/explorers/){target=\_blank} section of the documentation.

## Connect MetaMask {: #connect-metamask }

If you already have MetaMask installed, you can easily connect MetaMask to Moonbeam:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbeam as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbeam.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/){target=\_blank} guide.

## Configuration {: #configuration }

Please note the following gas and staking configuration parameters. These values are subject to change in future runtime upgrades.

=== "General"
    |       Variable        |                   Value                    |
    |:---------------------:|:------------------------------------------:|
    |   Minimum gas price   | {{ networks.moonbeam.min_gas_price }} Gwei |
    |   Target block time   | {{ networks.moonbeam.block_time }} seconds |
    |    Block gas limit    |     {{ networks.moonbeam.gas_block }}      |
    | Transaction gas limit |       {{ networks.moonbeam.gas_tx }}       |

=== "Staking"
    |             Variable              |                                                  Value                                                  |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------:|
    |     Minimum delegation stake      |                           {{ networks.moonbeam.staking.min_del_stake }} GLMR                            |
    | Maximum delegators per candidates |                             {{ networks.moonbeam.staking.max_del_per_can }}                             |
    |  Maximum delegations per account  |                             {{ networks.moonbeam.staking.max_del_per_del }}                             |
    |               Round               | {{ networks.moonbeam.staking.round_blocks }} blocks ({{ networks.moonbeam.staking.round_hours }} hours) |
    |           Bond duration           |               delegation takes effect in the next round (funds are withdrawn immediately)               |
    |          Unbond duration          |                  {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} rounds                  |
