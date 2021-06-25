---
title: Troubleshooting
description: How to view logs and troubleshoot your Moonbeam node.
---

# Troubleshooting and Logs

## Introduction

You will see logs from both the relay chain as well as the parachain. The relay chain will be prefixed by `[Relaychain]`, while the parachain has no prefix.

### P2P Ports Not Open

If you don't see an `Imported` message (without the `[Relaychain]` tag), you need to check the P2P port configuration. P2P port must be open to incoming traffic.

### In Sync

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.

### Genesis Mismatching

The Moonbase Alpha TestNet is often upgraded. Consequently, you may see the following message:

```
DATE [Relaychain] Bootnode with peer id `ID` is on a different
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
```

This typically means that you are running an older version and will need to upgrade.

We announce the upgrades (and corresponding chain purge) via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.
