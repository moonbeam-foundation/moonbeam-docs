---
title: Code Snippets
description: In order to make it easier to get started with Moonbeam, here are code snippets for each of the tutorials we’ve created.
---

# Code Snippets

## Setting up a Local Moonbeam Node

**Clone moonbeam-tutorials repo:**

```
git clone -b {{ networks.standalone.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

**Install substrate and its pre-requisites:**

```
--8<-- 'code/setting-up-local/substrate.md'
```

**Run initialization script:**

```
--8<-- 'code/setting-up-local/initscript.md'
```

**Add Rust to system path:**

```
--8<-- 'code/setting-up-local/cargoerror.md'
```

**Build the standalone node:**

```
--8<-- 'code/setting-up-local/build.md'
```

**Run node in dev mode:**

```
--8<-- 'code/setting-up-local/runnode.md'
```

**Purge chain, clean up any old data from running a ‘dev’ node in the past:**

```
./target/release/moonbase-standalone purge-chain --dev
```

**Run node in dev mode suppressing block information but prints errors in console:**

```
./target/release/moonbase-standalone --dev -lerror
```

## Genesis Account

--8<-- 'text/metamask-local/dev-account.md'

## Development Accounts

--8<-- 'text/setting-up-local/dev-accounts.md'

## MetaMask

**Moonbeam Standalone node details:**

--8<-- 'text/metamask-local/standalone-details.md'

**Moonbase Alpha TestNet:**

--8<-- 'text/testnet/testnet-details.md'
