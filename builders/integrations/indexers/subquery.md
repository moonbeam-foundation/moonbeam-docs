# Indexing Moonbeam with SubQuery

## Introduction

SubQuery, a leading data indexing solution in Polkadot, supports indexing Moonbeam’s and Moonriver’s Ethereum Virtual Machine (EVM) and Substrate data.  A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

## Getting Started

[Firstly, familiarize yourself with the documentation on how to connect to and index data from Moonbeam, Moonbase Alpha, and Moonriver using SubQuery](https://doc.subquery.network/create/moonbeam/).  The process to index Moonbeam data is only two steps:

### Step 1: Add the Moonbeam Custom Data Source

We have created a data processor specifically made to work with Moonbeam’s implementation of [Frontier](https://github.com/paritytech/frontier). It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events is from or the call is made to. [You can read more here](https://doc.subquery.network/create/moonbeam/#data-source-spec).

SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments. This allows developers to build a wide variety of projects that cater to their specific data needs.

### Step 2: Index Moonbeam Data

Just like a normal SubQuery project, you use a mapping function to transform off chain data to the GraphQL entities that you define, the difference is that instead of a `SubstrateEvent` or `SubstrateExtrinsic`, your mapping function will receive a `MoonbeamCall` or `MoonbeamEvent` which are based on Ether's [TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse) or [Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log) type. [You can read more about these here](https://doc.subquery.network/create/moonbeam/#moonbeamcall).

[Read the full documentation on this process here](https://doc.subquery.network/create/moonbeam/#moonbeamcall)

## Example Projects

There is a complete example project that indexes eth `transfer` events and `approve` smart contract calls. The code for this example project is [here on GitHub](https://github.com/subquery/tutorials-moonriver-evm-starter) or accessible via the [live SubQuery project on SubQuery Explorer here](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project).

The bulk of the changes happen in the Manifest file (`project.yaml`). You can see below that we have [extended call filters](https://doc.subquery.network/create/moonbeam/#call-filters) to support either [function signature strings](https://docs.ethers.io/v5/api/utils/abi/fragments/#FunctionFragment) or the function sighash to filter the function called on the contract. For [event filters](https://doc.subquery.network/create/moonbeam/#event-filters), you can use topics filtering that follows the [Ethereum JSON-PRC log filters standard found here](https://docs.ethers.io/v5/concepts/events/). Note that SubQuery introduces more advanced filters than other indexers for Moonbeam EVM and these improvements should significantly benefit developers.

![](https://miro.medium.com/max/700/1*4JRHItnILfCie4FT6sYLEA.png)

If you are familiar with how Substrate based SubQuery project are made, you’ll notice how similar the mapping functions are for the new Moonriver support. Each mapping function receives a `MoonbeamCall` or `MoonbeamEvent` and processes them just like any other SubQuery project.

![](https://miro.medium.com/max/700/1*k4_uJYYCsTnPRRJ7avq2WA.png)

If you have any questions about this make sure you [check our docs](https://doc.subquery.network/create/moonbeam) or reach out to us on our #technical-support channel in our [Discord community](https://discord.com/invite/subquery).

[Clone the example project on GitHub](https://github.com/subquery/tutorials-moonriver-evm-starter)

As you can see, creating a Moonriver or Moonbase Alpha project that indexes both Substrate and EVM data in a single project is extremely simple and largely similar. You can use SubQuery’s advanced scaffolding tools to speed up your dApp development and take advantage or richer indexing for you data to build more intuitive dApps. We can’t wait to see what you build!

### Moonbuilders Tutorial

SubQuery joined the [Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10) in December to show off live how to create a simple SubQuery project. [You can watch it here](https://www.crowdcast.io/e/moonbuilders-ws/10) or try out the [resulting sample project by yourself](https://github.com/stwiname/moonbuilders-demo).

## About SubQuery

SubQuery is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it to a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front-end, without needing to waste time on building a custom backend for data processing.

[Linktree](https://linktr.ee/subquerynetwork) | [Website](https://subquery.network/) | [Discord](https://discord.com/invite/78zg8aBSMG) | [Telegram](https://t.me/subquerynetwork) | [Twitter](https://twitter.com/subquerynetwork) | [Matrix](https://matrix.to/#/#subquery:matrix.org) | [LinkedIn](https://www.linkedin.com/company/subquery) | [Github](https://github.com/subquery/subql) | [YouTube](https://www.youtube.com/channel/UCi1a6NUUjegcLHDFLr7CqLw)
