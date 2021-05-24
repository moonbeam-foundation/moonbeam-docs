---
title: Moonshadow
description: An overview of the current configuration of the Moonshadow TestNet and information on how to start building on it using Solidity.
---

# Moonshadow - Moonbeam on Westend

_Updated April TODO, 2021_

## Goal

Moonshadow is the Moonbeam deployment to the [Westend TestNet](https://polkadot.network/westend-introducing-a-new-testnet-for-polkadot-and-kusama/). It will serve as a testing environment for Moonriver/Moonbeam. Compared to Moonbase Alpha, where we have control over the relay chain, Moonshadow replicates the production environment of Kusama/Polkadot, where the relay chain is an independent blockchain.

## Initial Configuration

Moonshadow has the following configuration:

 - Moonshadow runs as a parachain connected to the Westend relay chain
 - The parachain has four collators (hosted by PureStake) that are collating blocks
 - There are two RPC endpoints (hosted by PureStake). People can run full nodes to access their own private RPC endpoints

![Moonshadow Diagram](/images/moonshadow/moonshadow-diagram-v1.png)

## Features

Moonshadow will have the same set of features as Moonbase Alpha. To see the full list you can visit the [Moonbase Alpha page](/networks/moonbase/#features).

## Get Started

--8<-- 'text/moonshadow/connect.md'


## Tokens

The token that will be used in the Moonshadow deployment is called Moonshadow, with the symbol MSHD. The Moonshadow token does not hold any value. 

The minimum gas price is 1 GMSHD (similar to GWei on Ethereum).

More information about how to freely acquire MSHD will follow soon.

## Proof of Authority

At launch, the Moonshadow parachain will run as a Proof-of-Authority network, as all four collators will be run by PureStake.

As the network progresses, we expected to move to a similar system as the Moonbase Alpha TestNet

## Limitations

As Moonshadow shares the same set of features as Moonbase Alpha, they also share limitations. You can check all current limitations in the [Moonbase Alpha page](/networks/moonbase/#limitations).

## Chain Purge

As Moonshadow will be a parachain in the Westend TestNet, purges are not expected.

