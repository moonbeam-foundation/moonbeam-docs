---
title: Block Explorers
description: An overview of the currently available block explorers that may be used to navigate the Substrate and Ethereum layers of the Moonbeam TestNet.
---
# Block Explorers

![Explorer Banner](/images/explorers/explorers-banner.png)

## Introduction 

The Moonbeam team is currently working on onboarding a specialized block explorer solution that would allow to navigate the EVM as well as the Substrate layer of the blockchain.

Currently, we offer two block explorers: one for the Ethereum API based on the [Expedition explorer](https://github.com/etclabscore/expedition), and one for the Substrate API using [Polkadot JS apps](/integrations/polkadotjs/). You can use both for either a standalone Moonbeam node, or the Moonbase Alpha TestNet.

## Expedition Explorer (Ethereum)

### Local Node

To connect the explorer to a standalone Moonbeam node, you can use [this URL](https://expedition.dev/?rpcUrl=http://127.0.0.1:9933). This uses the RPC endpoint located at port `9933` by default. If you have defined a different port, you can changed it in the URL bar.

![Explorer Standalone](/images/explorers/explorers-images-1.png)

!!! note
    Expedition only works if running the standalone Moonbeam node with the repository tag `tutorial-v3`. It will not work if using master.

### Moonbase Alpha

To access the current state of the Moonbase Alpha TestNet, navigate to [https://moonbeam-explorer.netlify.app/](https://moonbeam-explorer.netlify.app/). 

The explorer is also available in Spanish, Chinese, Russian and Korean.

![Explorer TestNet](/images/explorers/explorers-images-2.png)

You can find the repository for the explorer in [this URL](https://github.com/PureStake/moonbeam-explorer-expedition).

## Polkadot.JS Apps (Substrate)

### Local Node

Polkadot JS Apps uses the WebSocket endpoint to interact with the Network. To connect it to a standalone Moonbeam node, you can follow the steps in [this tutorial](/getting-started/local-node/setting-up-a-node/#connecting-polkadot-js-apps-to-a-local-moonbeam-node). The default port for this is `9944`.

![Local Node](/images/setting-up-a-node/setting-up-node-6b.png)

### Moonbase Alpha

To view and interact with the Substrate layer of Moonbase Alpha, go to [this URL](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer). This is the Polkadot JS Apps pointing to the TestNet, you can find more information on [this page](/integrations/polkadotjs/).

![Connect to Moonbase Alpha](/images/testnet/polkadotjs-app2.png)

## We Want to Hear From You

If you have any feedback regarding block explorers, or any other Moonbeam related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).
