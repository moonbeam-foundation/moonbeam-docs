---
title: GoldRush API
description: Learn how to use the GoldRush (formerly Covalent) API on Moonbeam, Moonriver, and Moonbase Alpha for balances, transactions, logs, and related on-chain data.
categories: Indexers and Queries
---

# Getting Started with the GoldRush API

## Introduction {: #introduction }

[GoldRush](https://goldrush.dev/){target=\_blank}, formerly known as Covalent, provides structured blockchain data APIs for developers building wallets, dashboards, analytics, and automation tooling. Instead of stitching data from many RPC calls, you can query balances, transactions, token transfers, logs, and chain metadata through REST endpoints.

On Moonbeam networks, GoldRush can be used to read both historical and current on-chain data for [Moonbeam](https://goldrush.dev/docs/chains/moonbeam){target=\_blank}, [Moonriver](https://goldrush.dev/docs/chains/moonriver){target=\_blank}, and [Moonbase Alpha](https://goldrush.dev/docs/chains/moonbeam-moonbase-alpha){target=\_blank}. This page is a concise integration guide focused on the most common setup values and endpoint groups.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Quick Start {: #quick-start }

To begin using GoldRush, create an API key from the [GoldRush dashboard](https://goldrush.dev/platform/auth/register/){target=\_blank}. Requests use the base URL:

```text
https://api.covalenthq.com/v1/
```

Use the following network values in path parameters:

=== "Moonbeam"

    |  Parameter  |                 Value                  |
    |:-----------:|:--------------------------------------:|
    | `chainName` |          `moonbeam-mainnet`            |
    |  `chainID`  | `{{ networks.moonbeam.chain_id }}`     |
    |  Explorer   | [Moonscan](https://moonscan.io/){target=\_blank} |

=== "Moonriver"

    |  Parameter  |                  Value                   |
    |:-----------:|:----------------------------------------:|
    | `chainName` |          `moonbeam-moonriver`            |
    |  `chainID`  | `{{ networks.moonriver.chain_id }}`      |
    |  Explorer   | [Moonriver Moonscan](https://moonriver.moonscan.io/){target=\_blank} |

=== "Moonbase Alpha"

    |  Parameter  |                    Value                    |
    |:-----------:|:-------------------------------------------:|
    | `chainName` |           `moonbeam-moonbase-alpha`         |
    |  `chainID`  | `{{ networks.moonbase.chain_id }}`          |
    |  Explorer   | [Moonbase Moonscan](https://moonbase.moonscan.io/){target=\_blank} |

## API Usage {: #api-usage }

The following examples show typical request patterns for Moonbeam and Moonriver. Replace `API_KEY` with your GoldRush key and update the sample wallet address as needed for your use case.

### Example API Calls {: #example-api-calls }

Use these `curl` requests to quickly validate connectivity and response format before integrating in an application.

=== "Moonbeam Mainnet"

    ```bash
    curl -X GET "https://api.covalenthq.com/v1/moonbeam-mainnet/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/balances_v2/?key=API_KEY"
    ```

=== "Moonriver"

    ```bash
    curl -X GET "https://api.covalenthq.com/v1/moonbeam-moonriver/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/balances_v2/?key=API_KEY"
    ```

### SDK Usage {: #sdk-usage }

If you're building a service or frontend, the GoldRush SDK can simplify request construction and response handling.

=== "Moonbeam TypeScript SDK"

    ```typescript
    import { GoldRushClient } from "@covalenthq/client-sdk";

    const client = new GoldRushClient("API_KEY");
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress({
      chainName: "moonbeam-mainnet",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    });
    ```

=== "Moonriver TypeScript SDK"

    ```typescript
    import { GoldRushClient } from "@covalenthq/client-sdk";

    const client = new GoldRushClient("API_KEY");
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress({
      chainName: "moonbeam-moonriver",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    });
    ```

## Supported Foundational API Categories {: #supported-foundational-api-categories }

Moonbeam networks support a broad set of GoldRush Foundational API methods. Commonly used categories include:

### Wallet APIs

- [Get token balances for address](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-token-balances-for-address){target=\_blank}
- [Get native token balance for address](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-native-token-balance){target=\_blank}
- [Get historical portfolio value over time](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-historical-portfolio-value-over-time){target=\_blank}
- [Get ERC-20 token transfers for address](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-erc20-token-transfers-for-address){target=\_blank}

### Activity APIs

- [Get a transaction](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-a-transaction){target=\_blank}
- [Get transaction summary for address](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-transaction-summary-for-address){target=\_blank}
- [Get recent transactions for address (v3)](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-recent-transactions-for-address-v3){target=\_blank}

### Utility and Explorer APIs

- [Get a block](https://goldrush.dev/docs/api-reference/foundational-api/utility/get-a-block){target=\_blank}
- [Get gas prices](https://goldrush.dev/docs/api-reference/foundational-api/utility/get-gas-prices){target=\_blank}
- [Get log events by contract address](https://goldrush.dev/docs/api-reference/foundational-api/utility/get-log-events-by-contract-address){target=\_blank}

### Pricing and Security APIs

- [Get historical token prices](https://goldrush.dev/docs/api-reference/foundational-api/utility/get-historical-token-prices){target=\_blank}
- [Get token approvals for address](https://goldrush.dev/docs/api-reference/foundational-api/security/get-token-approvals-for-address){target=\_blank}

For the complete and most current endpoint list, refer to the [Foundational API overview](https://goldrush.dev/docs/goldrush-foundational-api/overview){target=\_blank} and [API reference](https://goldrush.dev/docs/api-reference/){target=\_blank}.

## Additional Resources {: #additional-resources }

- [GoldRush docs](https://goldrush.dev/docs/){target=\_blank}
- [GoldRush supported chains](https://goldrush.dev/chains/){target=\_blank}
- [Moonbeam chain page on GoldRush](https://goldrush.dev/docs/chains/moonbeam){target=\_blank}
- [Moonriver chain page on GoldRush](https://goldrush.dev/docs/chains/moonriver){target=\_blank}
- [Moonbase Alpha chain page on GoldRush](https://goldrush.dev/docs/chains/moonbeam-moonbase-alpha){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
