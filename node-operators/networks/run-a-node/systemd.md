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
        mkdir {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mkdir {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mkdir {{ networks.moonbase.node_directory }}
        ```

2. Use `wget` to grab the latest [release binary](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} and output it to the directory created in the previous step

    === "Moonbeam"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonriver.node_directory }}/moonbeam
        ``` 

    === "Moonbase Alpha"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. To verify that you have downloaded the correct version, you can run the following command in your terminal

    === "Moonbeam"

        ```bash
        sha256sum {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        sha256sum {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        sha256sum {{ networks.moonbase.node_directory }}/moonbeam
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
        adduser moonbeam_service --system --no-create-home
        ```

    === "Moonriver"

        ```bash
        adduser moonriver_service --system --no-create-home
        ```

    === "Moonbase Alpha"

        ```bash
        adduser moonbase_service --system --no-create-home
        ```

2. Ensure that you properly configure the ownership and permissions for the local directory housing the chain data, and also remember to grant execute permission to the binary file

    === "Moonbeam"

        ```bash
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        sudo chmod +x {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        sudo chmod +x {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        sudo chmod +x {{ networks.moonbase.node_directory }}/moonbeam
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
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast

    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'text/node-operators/networks/run-a-node/external-access.md'

??? code "Example start-up command for Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --unsafe-rpc-external \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Example start-up command for Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --frontier-backend-type sql \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

### Collator {: #collator }

Beginning with v0.39.0, new Moonbeam collator nodes will no longer generate session keys automatically on start-up. Nodes in existence prior to v0.39.0 do not need to make changes to how they handle session keys.

When setting up a new node, run the following command to generate and store on disk the session keys that will be referenced in the start-up command:

=== "Moonbeam"

    ```bash

    /var/lib/moonbeam-data/moonbeam key generate-node-key --base-path /var/lib/moonbeam-data --chain moonbeam && sudo chown -R moonbeam_service /var/lib/moonbeam-data
    
    ```

=== "Moonriver"

    ```bash

    /var/lib/moonriver-data/moonbeam key generate-node-key --base-path /var/lib/moonriver-data --chain moonriver && sudo chown -R moonriver_service /var/lib/moonriver-data

    ```

=== "Moonbase Alpha"

    ```bash

    /var/lib/alphanet-data/moonbeam key generate-node-key --base-path /var/lib/alphanet-data --chain alphanet  && sudo chown -R moonbase_service  /var/lib/alphanet-data

    ```

!!! note
    This step can be bypassed using the `--unsafe-force-node-key-generation` parameter in the start-up command, although this is not the recommended practice.

Now you can create the systemd configuration file:

=== "Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast

    [Install]
    WantedBy=multi-user.target
    ```

## Run the Service {: #run-the-service }

--8<-- 'text/node-operators/networks/run-a-node/systemd/run-service.md'

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/status.md'

You can also check the logs by executing:

```bash
journalctl -f -u moonbeam.service
```

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/logs.md'

During the syncing process, you will see logs from both the embedded relay chain ([Relaychain]) and the parachain ([🌗]). These logs display a target block (live network state) and a best block (local node synced state).

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}.

If you need to stop the service for any reason, you can run:

```bash
systemctl stop moonbeam.service
```

## Maintain Your Node {: #maintain-your-node }

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.com/invite/PfpUATX){target=\_blank} when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

If you want to update your client, you can keep your existing chain data in tact, and only update the binary by following these steps:

1. Stop the systemd service

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. Remove the old binary file

    === "Moonbeam"

        ```bash
        rm {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        rm {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        rm {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. Get the latest version of the [Moonbeam release binary on GitHub](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} and run the following command to update to that version

    === "Moonbeam"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonbase.node_directory }}/moonbeam
        ```

    !!! note
        If you [compiled the binary manually](/node-operators/networks/run-a-node/compile-binary/){target=\_blank}, you'll need to move the binary from `./target/release/{{ networks.moonbeam.binary_name }}` to the data directory.

4. Update permissions

    === "Moonbeam"

        ```bash
        chmod +x {{ networks.moonbeam.node_directory }}/moonbeam
        chown moonbeam_service {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        chmod +x {{ networks.moonriver.node_directory }}/moonbeam
        chown moonriver_service {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        chmod +x {{ networks.moonbase.node_directory }}/moonbeam
        chown moonbase_service {{ networks.moonbase.node_directory }}/moonbeam
        ```

5. Start your service

    ```bash
    systemctl start moonbeam.service
    ```

To check the status of the service and/or logs, you can refer to the [commands from before](#run-the-service).

## Purge Your Node {: #purge-your-node }

If you need a fresh instance of your Moonbeam node, you can purge your node by removing the associated data directory.

You'll first need to stop the systemd service:

```bash
sudo systemctl stop moonbeam
```

To purge your parachain and relay chain data, you can run the following command:

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

## Purge Your Frontier Database {: #purge-frontier-database }

To purge only the Frontier database of your Moonbeam node, follow these steps:

1. Stop the systemd service:

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. Remove the Frontier database folder:

    === "Moonbeam"

        ```bash
        sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/moonbeam/frontier/*
        ```

    === "Moonriver"

        ```bash
        sudo rm -rf {{ networks.moonriver.node_directory }}/chains/moonriver/frontier/*
        ```

    === "Moonbase Alpha"

        ```bash
        sudo rm -rf {{ networks.moonbase.node_directory }}/chains/alphanet/frontier/*
        ```

3. Start the systemd service:

    ```bash
    sudo systemctl start moonbeam.service
    ```
