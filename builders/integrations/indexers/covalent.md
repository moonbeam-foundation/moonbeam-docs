---
title: GoldRush API
description: Querying blockchain data such as balances, transactions, transfers, token holders, and event logs on Moonbeam with the GoldRush (formerly Covalent) API.
categories: Indexers and Queries
---

# Getting Started with the GoldRush API

## Overview

GoldRush (powered by Covalent) offers the most comprehensive [Moonbeam](https://goldrush.dev/docs/chains/moonbeam) and [Moonriver](https://goldrush.dev/docs/chains/moonriver) Data API suite for developers, analysts, and enterprises. Whether you're
building a DeFi dashboard, a wallet, a trading bot, an AI agent or a compliance platform,
our Moonbeam ecosystem Data APIs provide fast, accurate, and developer-friendly access to the essential onchain data you need.

### Supported APIs

<Columns cols={2}>
  <Card title="Foundational API" icon="code" href="/goldrush-foundational-api" cta="Read docs">
    Access structured historical blockchain data across 100+ chains using REST APIs.
    Get token balances, transaction histories, decoded event logs, NFT assets, token holders and more.<br /><br />
    <b>Use cases: Wallets, portfolio trackers, crypto accounting & tax tools, and DeFi dashboards.</b>
  </Card>
</Columns>

## Networks

<Card>
  <div style={{width: '100%', margin: '-16px', padding: '0'}}>
    <table style={{width: '100%', margin: '0', borderCollapse: 'collapse'}}>
      <thead style={{width: '100%'}}>
        <tr>
          <th style={{textAlign: 'left', padding: '12px 16px'}}><strong>Property</strong></th>
          <th style={{textAlign: 'left', padding: '12px 16px'}}><strong>Moonbeam (Mainnet)</strong></th>
          <th style={{textAlign: 'left', padding: '12px 16px'}}><strong>Moonriver </strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{padding: '12px 16px'}}><strong>Chain Name</strong></td>
          <td style={{padding: '12px 16px'}}><code>moonbeam-mainnet</code></td>
          <td style={{padding: '12px 16px'}}><code>moonbeam-moonriver</code></td>
        </tr>
        <tr>
          <td style={{padding: '12px 16px'}}><strong>Chain ID</strong></td>
          <td style={{padding: '12px 16px'}}><code>1284</code></td>
          <td style={{padding: '12px 16px'}}><code>1285</code></td>
        </tr>
        <tr>
          <td style={{padding: '12px 16px'}}><strong>Block Explorer</strong></td>
          <td style={{padding: '12px 16px'}}><a href="https://moonscan.io/">Moonscan</a></td>
          <td style={{padding: '12px 16px'}}><a href="https://moonriver.moonscan.io/">Moonriver Explorer</a></td>
        </tr>
        <tr>
          <td style={{padding: '12px 16px'}}><strong>Official Website</strong></td>
          <td style={{padding: '12px 16px'}}><a href="https://moonbeam.network/">Moonbeam</a></td>
          <td style={{padding: '12px 16px'}}><a href="https://moonbeam.network/networks/moonriver/">Moonriver</a></td>
        </tr>
        <tr>
          <td style={{padding: '12px 16px'}}><strong>Native Gas Token</strong></td>
          <td style={{padding: '12px 16px'}}>GLMR</td>
          <td style={{padding: '12px 16px'}}>MOVR</td>
        </tr>
      </tbody>
    </table>
  </div>
</Card>

## API Usage

To use these blockchain networks in GoldRush API calls, use:

#### Chain Names

* `moonbeam-mainnet` (Moonbeam on Polkadot)
* `moonbeam-moonriver` (Moonriver on Kusama)

#### Example API Calls

```bash Moonbeam Mainnet theme={null}
  curl -X GET "https://api.covalenthq.com/v1/moonbeam-mainnet/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/balances_v2/?key=API_KEY"
```
```bash Moonriver theme={null}
  curl -X GET "https://api.covalenthq.com/v1/moonbeam-moonriver/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/balances_v2/?key=API_KEY"
```

#### SDK Usage

```typescript Moonbeam TypeScript SDK theme={null}
  import { GoldRushClient } from "@covalenthq/client-sdk";

  const client = new GoldRushClient("API_KEY");
  const resp = await client.BalanceService.getTokenBalancesForWalletAddress({
      chainName: "moonbeam-mainnet",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  });
```
```typescript Moonriver TypeScript SDK theme={null}
  import { GoldRushClient } from "@covalenthq/client-sdk";

  const client = new GoldRushClient("API_KEY");
  const resp = await client.BalanceService.getTokenBalancesForWalletAddress({
      chainName: "moonbeam-moonriver",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  });
```

## Foundational API Support

Both chains support **34** GoldRush Foundational APIs:

#### Wallet API

* **[Get token balances for address](/api-reference/foundational-api/balances/get-token-balances-for-address)**
* **[Get native token balance for address](/api-reference/foundational-api/balances/get-native-token-balance)**
* **[Get historical portfolio value over time](/api-reference/foundational-api/balances/get-historical-portfolio-value-over-time)**
* **[Get ERC20 token transfers for address](/api-reference/foundational-api/balances/get-erc20-token-transfers-for-address)**

#### Pricing API

* **[Get historical token prices](/api-reference/foundational-api/utility/get-historical-token-prices)**

#### Security API

* **[Get token approvals for address](/api-reference/foundational-api/security/get-token-approvals-for-address)**

#### Activity Feed API

* **[Get a transaction](/api-reference/foundational-api/transactions/get-a-transaction)**
* **[Get transaction summary for address](/api-reference/foundational-api/transactions/get-transaction-summary-for-address)**
* **[Get earliest transactions for address (v3) ](/api-reference/foundational-api/transactions/get-earliest-transactions-for-address-v3)**
* **[Get recent transactions for address (v3)](/api-reference/foundational-api/transactions/get-recent-transactions-for-address-v3)**
* **[Get paginated transactions for address (v3)](/api-reference/foundational-api/transactions/get-paginated-transactions-for-address-v3)**
* **[Get bulk time bucket transactions for address (v3)](/api-reference/foundational-api/transactions/get-time-bucket-transactions-for-address-v3)**
* **[Get all transactions in a block (v3)](/api-reference/foundational-api/transactions/get-all-transactions-in-a-block)**
* **[Get all transactions in a block by page (v3) ](/api-reference/foundational-api/transactions/get-all-transactions-in-a-block-by-page)**

#### Block Explorer API

* **[Get a block](/api-reference/foundational-api/utility/get-a-block)**
* **[Get all chain statuses](/api-reference/foundational-api/utility/get-all-chain-statuses)**
* **[Get all chains](/api-reference/foundational-api/utility/get-all-chains)**
* **[Get block heights](/api-reference/foundational-api/utility/get-block-heights)**
* **[Get gas prices](/api-reference/foundational-api/utility/get-gas-prices)**
* **[Get log events by contract address](/api-reference/foundational-api/utility/get-log-events-by-contract-address)**
* **[Get log events by topic hash(es)](/api-reference/foundational-api/utility/get-log-events-by-topic-hash)**
* **[Get logs](/api-reference/foundational-api/utility/get-logs)**

## Additional Resources

* [GoldRush API Documentation](https://goldrush.dev/docs/)
* [Supported Chains List](https://goldrush.dev/chains/)
* [API Reference](https://goldrush.dev/docs/api-reference/)
