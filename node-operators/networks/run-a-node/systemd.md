---
title: Run a Node on Moonbeam Using Systemd
description: How to run a full parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Systemd.
categories: Node Operators and Collators
---

# Run a Node on Moonbeam Using Systemd

## Introduction {: #introduction }

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

In this guide, you'll learn how to spin up a Moonbeam node using [Systemd](https://systemd.io){target=\_blank} and how to maintain and purge your node.

If you're interested in compiling the binary yourself, which may take over 30 min and require 32GB of memory, you can check out the [Manually Compile the Moonbeam Binary](/node-operators/networks/run-a-node/compile-binary/){target=\_blank} guide.

## Checking Prerequisites {: #checking-prerequisites }

The following sections go through the process of using the binary and running a Moonbeam full node as a systemd service. To get started, you'll need to:

- Make sure you're running Ubuntu 18.04, 20.04, or 22.04. Moonbeam may work with other Linux flavors, but Ubuntu is currently the only tested version
- Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}. When connecting to Moonriver on Kusama or Moonbeam on Polkadot, it will take a few days to completely sync the embedded relay chain

## Download the Latest Release Binary {: #the-release-binary }

To download the latest [release binary](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank}, take the following steps:

1. Create a directory to store the binary and chain data (you might need `sudo`)

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/1.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/2.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/3.sh'
        ```

2. Use `wget` to grab the latest [release binary](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} and output it to the directory created in the previous step

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/4.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/5.sh'
        ``` 

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/6.sh'
        ```

3. To verify that you have downloaded the correct version, you can run the following command in your terminal

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/7.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/8.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/9.sh'
        ```

    You should receive the following output:

    === "Moonbeam"

        ```text
        {{ networks.moonbeam.parachain_sha256sum }}
        ```

    === "Moonriver"

        ```text
        {{ networks.moonriver.parachain_sha256sum }}
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.parachain_sha256sum }}
        ```

## Set Up the Service {: #set-up-the-service }

The following commands will set up everything regarding running the service:

1. Create a service account to run the service

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/10.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/11.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/12.sh'
        ```

2. Ensure that you properly configure the ownership and permissions for the local directory housing the chain data, and also remember to grant execute permission to the binary file

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/13.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/14.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/15.sh'
        ```

## Create the Configuration File {: #create-the-configuration-file }

Next, create the systemd service file. If you're configuring a collator node, use the [collator-specific](#collator) configuration snippets below.

First, you'll need to create a file named `/etc/systemd/system/moonbeam.service` to store the configurations.

Note that in the following start-up configurations, you have to:

- Replace `INSERT_YOUR_NODE_NAME` with your node name of choice. You'll have to do this in two places: one for the parachain and one for the relay chain
- Replace `INSERT_RAM_IN_MB` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
- Double-check that the binary is in the proper path as described below (_ExecStart_)
- Double-check the base path if you've used a different directory

For an overview of the flags used in the following start-up commands, plus additional commonly used flags, please refer to the [Flags](/node-operators/networks/run-a-node/flags/){target=\_blank} page of our documentation.

### Full Node {: #full-node }

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/16.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/17.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/18.sh'
    ```

--8<-- 'text/node-operators/networks/run-a-node/external-access.md'

??? code "Example start-up command for Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/19.sh'
    ```

--8<-- 'text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Example start-up command for Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/20.sh'
    ```

### Collator {: #collator }

Beginning with v0.39.0, new Moonbeam collator nodes will no longer generate session keys automatically on start-up. Nodes in existence prior to v0.39.0 do not need to make changes to how they handle session keys.

When setting up a new node, run the following command to generate and store on disk the session keys that will be referenced in the start-up command:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/21.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/22.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/23.sh'
    ```

!!! note
    This step can be bypassed using the `--unsafe-force-node-key-generation` parameter in the start-up command, although this is not the recommended practice.

Now you can create the systemd configuration file:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/24.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/25.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/26.sh'
    ```

## Run the Service {: #run-the-service }

--8<-- 'text/node-operators/networks/run-a-node/systemd/run-service.md'

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/status.md'

You can also check the logs by executing:

```bash
--8<-- 'code/node-operators/networks/run-a-node/systemd/27.sh'
```

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/logs.md'

During the syncing process, you will see logs from both the embedded relay chain ([Relaychain]) and the parachain ([🌗]). These logs display a target block (live network state) and a best block (local node synced state).

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}.

If you need to stop the service for any reason, you can run:

```bash
--8<-- 'code/node-operators/networks/run-a-node/systemd/28.sh'
```

## Maintain Your Node {: #maintain-your-node }

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.com/invite/PfpUATX){target=\_blank} when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

If you want to update your client, you can keep your existing chain data in tact, and only update the binary by following these steps:

1. Stop the systemd service

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/29.sh'
    ```

2. Remove the old binary file

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/30.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/31.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/32.sh'
        ```

3. Get the latest version of the [Moonbeam release binary on GitHub](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} and run the following command to update to that version

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/33.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/34.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/35.sh'
        ```

    !!! note
        If you [compiled the binary manually](/node-operators/networks/run-a-node/compile-binary/){target=\_blank}, you'll need to move the binary from `./target/release/{{ networks.moonbeam.binary_name }}` to the data directory.

4. Update permissions

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/36.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/37.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/systemd/38.sh'
        ```

5. Start your service

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/39.sh'
    ```

To check the status of the service and/or logs, you can refer to the [commands from before](#run-the-service).

## Purge Your Node {: #purge-your-node }

If you need a fresh instance of your Moonbeam node, you can purge your node by removing the associated data directory.

You'll first need to stop the systemd service:

```bash
--8<-- 'code/node-operators/networks/run-a-node/systemd/40.sh'
```

To purge your parachain and relay chain data, you can run the following command:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/41.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/42.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/43.sh'
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/44.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/45.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/46.sh'
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/47.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/48.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/systemd/49.sh'
    ```

--8<-- 'text/node-operators/networks/run-a-node/post-purge.md'
