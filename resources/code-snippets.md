---
title: Code Snippets
description: In order to make it easier to get started with Moonbeam, here are code snippets for each of the tutorials we’ve created.
---

# Code Snippets

## Setting up a Local Moonbeam Node {: #setting-up-a-local-moonbeam-node } 

**Clone moonbeam-tutorials repo:**

```
git clone -b {{ networks.development.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

**Install substrate and its pre-requisites:**

```
--8<-- 'code/setting-up-node/substrate.md'
```

**Add Rust to system path:**

```
--8<-- 'code/setting-up-node/cargoerror.md'
```

**Build the development node:**

```
--8<-- 'code/setting-up-node/build.md'
```

**Run node in dev mode:**

```
--8<-- 'code/setting-up-node/runnode.md'
```

**Purge chain, clean up any old data from running a ‘dev’ node in the past:**

```
./target/release/moonbeam purge-chain --dev
```

**Run node in dev mode suppressing block information but prints errors in console:**

```
./target/release/moonbeam --dev -lerror
```

## Genesis Account {: #genesis-account } 

--8<-- 'text/metamask-local/dev-account.md'

## Development Accounts {: #development-accounts } 

--8<-- 'code/setting-up-node/dev-accounts.md'

--8<-- 'code/setting-up-node/dev-testing-account.md'

## MetaMask {: #metamask } 

=== "Moonbeam Development Node"

    - Network Name: `Moonbeam Dev`
    - RPC URL: `{{ networks.development.rpc_url }}`
    - ChainID: `{{ networks.development.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.development.block_explorer }}`

=== "Moonbase Alpha"

    - Network Name: `Moonbase Alpha`
    - RPC URL: `{{ networks.moonbase.rpc_url }}`
    - ChainID: `{{ networks.moonbase.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.moonbase.block_explorer }}`

=== "Moonriver"

    - Network Name: `Moonriver`
    - RPC URL: `{{ networks.moonriver.rpc_url }}`
    - ChainID: `{{ networks.moonriver.chain_id }}`
    - Symbol (Optional): `MOVR`
    - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`