---
title: Run a Node on Moonbeam Using Systemd
description: How to run a full parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Systemd.
---

# Run a Node on Moonbeam Using Systemd

## Introduction {: #introduction }

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

In this guide, you'll learn how to spin up a Moonbeam node using [Systemd](https://systemd.io/){target=_blank} and how to maintain and purge your node.

If you're interested in compiling the binary yourself, which may take over 30 min and require 32GB of memory, you can check out the [Manually Compile the Moonbeam Binary](/node-operators/networks/run-a-node/compile-binary){target=_blank} guide.

## Checking Prerequisites {: #checking-prerequisites }

The following sections go through the process of using the binary and running a Moonbeam full node as a systemd service. To get started, you'll need to:

- Make sure you're running Ubuntu 18.04, 20.04, or 22.04. Moonbeam may work with other Linux flavors, but Ubuntu is currently the only tested version
- Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview#requirements){target=_blank}. When connecting to Moonriver on Kusama or Moonbeam on Polkadot, it will take a few days to completely sync the embedded relay chain

## Download the Latest Release Binary {: #the-release-binary }

To get started, use `wget` to grab the latest [release binary](https://github.com/moonbeam-foundation/moonbeam/releases):

=== "Moonbeam"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 

=== "Moonbase Alpha"

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

To verify that you have downloaded the correct version, you can run `sha256sum moonbeam` in your terminal. You should receive the following output:

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

## Setup the Service {: #setup-the-service }

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

2. Create a directory to store the binary and data (you might need `sudo`)

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

3. Move the binary built in the last section to the created folder (you might need sudo)

    === "Moonbeam"

        ```bash
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

4. Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data:

    === "Moonbeam"

        ```bash
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        ```

## Create the Configuration File {: #create-the-configuration-file }

The next step is to create the systemd configuration file. If you are setting up a collator node, make sure to follow the code snippets for [collators](#collator).

First, you'll need to create a file named `/etc/systemd/system/moonbeam.service` to store the configurations.

Note that in the following start-up configurations, you have to:

- Replace `INSERT_YOUR_NODE_NAME` with your node name of choice. You'll have to do this in two places: one for the parachain and one for the relay chain
- Replace `INSERT_RAM_IN_MB` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
- Double-check that the binary is in the proper path as described below (_ExecStart_)
- Double-check the base path if you've used a different directory

For an overview of the flags used in the following start-up commands, plus additional commonly used flags, please refer to the [Flags](/node-operators/networks/run-a-node/flags){target=_blank} page of our documentation.

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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --unsafe-rpc-external \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
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
         --state-pruning=archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --frontier-backend-type sql \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

### Collator {: #collator }

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
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
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
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
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
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

## Run the Service {: #run-the-service }

--8<-- 'text/node-operators/networks/run-a-node/systemd/run-service.md'

![Service Status](/images/node-operators/networks/run-a-node/systemd/systemd-1.png)

You can also check the logs by executing:

```bash
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/run-a-node/systemd/systemd-2.png)

During the syncing process, you will see logs from both the embedded relay chain ([Relaychain]) and the parachain ([🌗]). These logs display a target block (live network state) and a best block (local node synced state).

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview#requirements){target=_blank}.

If you need to stop the service for any reason, you can run:

```bash
systemctl stop moonbeam.service
```

## Maintain Your Node {: #maintain-your-node }

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

If you want to update your client, you can keep your existing chain data in tact, and only update the binary by following these steps:

1. Stop the systemd service

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. Remove the old binary file

    === "Moonbeam"

        ```bash
        rm  {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        rm  {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        rm  {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. Get the latest version of Moonbeam from the [Moonbeam GitHub Release](https://github.com/moonbeam-foundation/moonbeam/releases/) page

4. Update the version

    ```bash
    wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam
    ```

5. Move the binary to the data directory

    === "Moonbeam"

        ```bash
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

    !!! note
        If you [compiled the binary manually](/node-operators/networks/run-a-node/compile-binary){target=_blank}, you'll need to move the binary from `./target/release/{{ networks.moonbeam.binary_name }}` to the data directory.

6. Update permissions

    === "Moonbeam"

        ```bash
        chmod +x moonbeam
        chown moonbeam_service moonbeam
        ```

    === "Moonriver"

        ```bash
        chmod +x moonbeam
        chown moonriver_service moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        chmod +x moonbeam
        chown moonbase_service moonbeam
        ```

7. Start your service

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

--8<-- 'text/node-operators/networks/run-a-node/post-purge.md'
