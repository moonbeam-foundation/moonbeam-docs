---
title: SubQuery
description: Learn how to use SubQuery to index Substrate and EVM data for Moonbeam and Moonriver
---

# Indexing Moonbeam with SubQuery

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## Introduction

[SubQuery](https://subquery.network/){target=blank} is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it to a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front-end, without needing to waste time on building a custom backend for data processing.

SubQuery supports indexing Moonbeam’s and Moonriver’s Ethereum Virtual Machine (EVM) and Substrate data. A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

## Getting Started

To get started, you'll need to [create a SubQuery project](https://doc.subquery.network/create/introduction/){target=blank}. Once you have your project set up, you can familiarize yourself with [how to connect to and index data from Moonbeam, Moonriver, and Moonbase Alpha](https://doc.subquery.network/create/moonbeam/){target=blank}.

From within your SubQuery project, you can add the custom data source as a dependency by running the following [NPM](https://www.npmjs.com/){target=blank} or [Yarn](https://yarnpkg.com/){target=blank} command:

=== "NPM"
    ```
    npm install @subql/contract-processors
    ```

=== "Yarn"
    ```
    yarn add @subql/contract-processors
    ```

The process to index Moonbeam data is only two steps: [adding the Moonbeam custom data source](#adding-the-moonbeam-custom-data-source){target=blank} and then [indexing the Moonbeam data](#indexing-moonbeam-data){target=blank}.

### Adding the Moonbeam Custom Data Source

SubQuery has created a data processor specifically made to work with Moonbeam’s implementation of [Frontier](https://github.com/paritytech/frontier){target=blank}. It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events is from or the call is made to.

You can add the [custom data source](https://doc.subquery.network/create/moonbeam/#data-source-spec){target=blank} to your `project.yaml` manifest file:

```yaml
dataSources:
  - kind: substrate/Moonbeam
    processor:
      file: './node_modules/@subql/contract-processors/dist/moonbeam.js'
      options: {...}
    assets: {...}
```

SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments. This allows developers to build a wide variety of projects that cater to their specific data needs.

### Indexing Moonbeam Data

Next, you can add handlers for the custom data source to your code. Just like a normal SubQuery project, you use a mapping function to transform off chain data to the GraphQL entities that you define. The difference is that instead of a `SubstrateEvent` or `SubstrateExtrinsic`, your mapping function will receive a [`MoonbeamCall`](https://doc.subquery.network/create/moonbeam/#moonbeamcall){target=blank} or [`MoonbeamEvent`](https://doc.subquery.network/create/moonbeam/#moonbeamevent){target=blank} which are based on Ether's [TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=blank} or [Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=blank} type.

You can add the `MoonbeamEvent` and `MoonbeamCall` handlers to your `project.yaml` manifest file:

```yaml
    mapping:
      file: './dist/index.js'
      handlers:
        - handler: handleMoonriverEvent
          kind: substrate/MoonbeamEvent
          filter: {...}
        - handler: handleMoonriverCall
          kind: substrate/MoonbeamCall
          filter: {...}
```

## Example Projects

There is a complete example project that indexes eth `transfer` events and `approve` smart contract calls. The code for this [example project is on GitHub](https://github.com/subquery/tutorials-moonriver-evm-starter){target=blank} or accessible via the [live SubQuery project on SubQuery Explorer](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=blank}.

The bulk of the changes happen in the Manifest file (`project.yaml`). You can see below that there are [extended call filters](https://doc.subquery.network/create/moonbeam/#call-filters){target=blank} to support either [function signature strings](https://docs.ethers.io/v5/api/utils/abi/fragments/#FunctionFragment){target=blank} or the function sighash to filter the function called on the contract. For [event filters](https://doc.subquery.network/create/moonbeam/#event-filters){target=blank}, you can use topics filtering that follows the [Ethereum JSON-PRC log filters standard](https://docs.ethers.io/v5/concepts/events/){target=blank}. Note that SubQuery introduces more advanced filters than other indexers for Moonbeam EVM and these improvements should significantly benefit developers.

```yaml
## project.yaml
{...}
mapping:
  file: './dist/index.js'
  handlers:
    - handler: handleMoonriverEvent
      kind: substrate/MoonbeamEvent
      filter:
        ## Topics that follow Ethereum JSON-RPC log filters
        ## https://docs.ethers.io/v5/concepts/events/
        ## With a couple of added benefits:
        ##  - Values don't need to be 0 padded
        ##  - Event fragments can be provided and automatically converted to their id
        topics:
          ## Example valid values:
          # - '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          # - Transfer(address,address,u256)
          # - Transfer(address from,address to,uint256 value)

          ## Example of OR filter, will capture Transfer or Approval events
          # - - 'Transfer(address indexed from,address indexed to,uint256 value)'
          #   - 'Approval(address indexed owner, address indexed spender, uint256 value)'

          - Transfer(address indexed from,address indexed to,uint256 value)
          ## topics[1] to topics[3] are the indexed values
          - null
          - null
          - null
    - handler: handleMoonriverCall
      kind: substrate/MoonbeamCall
      filter:
        ## The function can either be the method fragment or signature
        # function: '0x095ea7b3'
        # function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
        # function: approve(address,uint256)
        function: approve(address to,uint256 value)

        ## The transaction sender
        # from: '0x6bd193ee6d2104f14f94e2ca6efefae561a4334b'
```

If you are familiar with how Substrate based SubQuery project are made, you’ll notice how similar the mapping functions are for the new Moonriver support. Each mapping function receives a `MoonbeamCall` or `MoonbeamEvent` and processes them just like any other SubQuery project.

```ts
// mappingHandlers.ts
import {Approval, Transaction} from "../types";
import { MoonbeamEvent, MoonbeamCall } from '@subql/contract-processors/dist/moonbeam';
import { BigNumber } from "ethers";

// Setup types from ABI
type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }

export async function handleMoonriverEvent(event: MoonbeamEvent<TransferEventArgs>): Promise<void> {
    const transaction = new Transaction(event.transactionHash);

    transaction.value = event.args.value.toBigInt();
    transaction.from = event.args.from;
    transaction.to = event.args.to;
    transaction.contractAddress = event.address;

    await transaction.save();
}

export async function handleMoonriverCall(event: MoonbeamCall<ApproveCallArgs>): Promise<void> {
    const approval = new Approval(event.hash);

    approval.owner = event.from;
    approval.value = event.args._value.toBigInt();
    approval.spender = event.args._spender;
    approval.contractAddress = event.to;

    await approval.save();
}
```

If you have any questions about this make sure you check out the [SubQuery docs](https://doc.subquery.network/create/moonbeam){target=blank} or reach out to the SubQuery team on the #technical-support channel in the [SubQuery Discord](https://discord.com/invite/subquery){target=blank}.

[Clone the example project on GitHub](https://github.com/subquery/tutorials-moonriver-evm-starter)

As you can see, creating a Moonriver or Moonbase Alpha project that indexes both Substrate and EVM data in a single project is extremely simple and largely similar. You can use SubQuery’s advanced scaffolding tools to speed up your dApp development and take advantage or richer indexing for you data to build more intuitive dApps.

### Moonbuilders Tutorial

SubQuery joined the [Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=blank} in December to show off live how to create a simple SubQuery project. You can try out the [resulting sample project](https://github.com/stwiname/moonbuilders-demo){target=blank} by yourself.
