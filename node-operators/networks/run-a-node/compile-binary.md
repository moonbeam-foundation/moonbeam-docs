---
title: Compile the Binary to Run a Node
description: Learn how to manually compile the binary to run a full Moonbeam node. Compiling the binary can take around 30 minutes and requires at least 32GB of memory.
---

# Manually Compile the Binary to Run a Node on Moonbeam Using Systemd

## Introduction

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will be a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

To get started quickly without the hassle of compiling the binary yourself, you can use [The Release Binary](/node-operators/networks/run-a-node/systemd){target=_blank}.

## Compile the Binary {: #compile-the-binary }

Manually compiling the binary can take around 30 minutes and requires 32GB of memory.

The following commands will build the latest release of the Moonbeam parachain.

1. Clone the Moonbeam repo

    ```bash
    git clone https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

2. Check out to the latest release

    ```bash
    git checkout tags/$(git describe --tags)
    ```

3. If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=_blank}

    ```bash
    --8<-- 'code/setting-up-node/installrust.md'
    ```

4. Update your `PATH` environment variable

    ```bash
    --8<-- 'code/setting-up-node/updatepath.md'
    ```

5. Build the parachain binary

    !!! note
        If you are using Ubuntu 20.04 or 22.04, then you will need to install these additional dependencies before building the binary:

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev -y 
        ```

    ```bash
    cargo build --release
    ```

![Compiling Binary](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-1.png)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:

```bash
--8<-- 'code/setting-up-node/updatepath.md'
```

Now you can use the Moonbeam binary to run a systemd service.

## Setup the Service {: #setup-the-service }

The following commands will set up everything regarding running the service.

1. Create a service account to run the service:

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

2. Create a directory to store the binary and data (you might need `sudo`):

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

3. Move the binary in the target directory (`./target/release/`) to the folder you just created

    === "Moonbeam"

        ```bash
        mv ./target/release/{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./target/release/{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
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

First, you'll need to create a file named `/etc/systemd/system/moonbeam.service` to store the configurations in.

Note that in the following start-up configurations, you have to:

- Replace `INSERT_YOUR_NODE_NAME` with your node name of choice. You'll have to do this in two places: one for the parachain and one for the relay chain
- Replace `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
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
         --db-cache <50% RAM in MB> \
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
         --db-cache <50% RAM in MB> \
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
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'text/node-operators/networks/run-a-node/highlight-node-options.md'

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
         --db-cache <50% RAM in MB> \
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
         --db-cache <50% RAM in MB> \
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
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

## Run the Service {: #run-the-service }

--8<-- 'text/systemd/run-service.md'

![Service Status](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-2.png)

You can also check the logs by executing:

```bash
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-3.png)

During the syncing process, you will see logs from both the embedded relay chain ([Relaychain]) and the parachain ([🌗]). Th ese logs display a target block (live network state) and a best block (local node synced state).

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview#requirements){target=_blank}.

If you need to stop the service for any reason, you can run:

```bash
systemctl stop moonbeam.service
```

## Maintain Your Node {: #maintain-your-node }

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

If you want to update your client, you can keep your existing chain data in tact, and only update the binary by following these steps:

1. Stop the systemd service:

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. Remove the old binary file:

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

3. Compile the latest binary by following the steps in the [Compile the Binary](#compile-the-binary) section
4. Move the binary to the data directory:

    === "Moonbeam"

        ```bash
        mv ./target/release/{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv ./target/release/{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

5. Update permissions:

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

6. Start your service:

    ```bash
    systemctl start moonbeam.service
    ```

To check the status of the service and/or logs, you can refer to the [commands from before](#run-the-service).

## Purge Your Node {: #purge-your-node }

If you want to start a fresh instance of a node, there are a handful of `purge-chain` commands available to you which will remove your previous chain data as specified. The base command which will remove both the parachain and relay chain data is:

```bash
./target/release/moonbeam purge-chain
```

You can add the following flags to the above command if you want to specify what data should be purged:

- `--parachain` - only deletes the parachain database, keeping the relay chain data in tact
- `--relaychain` - only deletes the relay chain database, keeping the parachain data in tact

You can also specify a chain to be removed:

- `--chain` - specify the chain using either one of the predefined chains or a path to a file with the chainspec

To purge only your Moonbase Alpha parachain data, for example, you would run the following command:

```bash
./target/release/moonbeam purge-chain --parachain --chain alphanet
```

To specify a path to the chainspec for a development chain to be purged, you would run:

```bash
./target/release/moonbeam purge-chain --chain example-moonbeam-dev-service.json
```

For the complete list of available `purge-chain` commands, you can access the help menu by running:

```bash
./target/release/moonbeam purge-chain --help
```

--8<-- 'text/purge-chain/post-purge.md'
