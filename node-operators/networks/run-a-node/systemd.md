---
title: Run a Node on Moonbeam Using Systemd
description: How to run a full Parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Systemd
---

# Run a Node on Moonbeam Using Systemd

![Full Node Moonbeam Banner](/images/node-operators/networks/run-a-node/systemd/systemd-banner.png)

## Introduction {: #introduction } 

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will be a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

!!! note
    Moonbase Alpha is still considered an Alphanet, and as such _will not_ have 100% uptime. The parachain might be purged as needed. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. If a chain purge is required, it will be announced via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.

## Getting Started {: #getting-started } 

The following sections go through the process of using the binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbeam may work with other Linux flavors, but Ubuntu is currently the only tested version.

To get started quickly without the hassle of compiling the binary yourself, you can use [The Release Binary](#the-release-binary). Or if you prefer to manually build the binaries yourself, which could take around 30 minutes to install the dependencies and compile, you can check out the [Compile the Binary](#compile-the-binary) section.

## The Release Binary {: #the-release-binary } 

To get started use `wget` to grab the latest [release binary](https://github.com/PureStake/moonbeam/releases):

=== "Moonbeam"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 
   
=== "Moonbase Alpha"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

To verify that you have downloaded the correct version, you can run `sha256sum moonbeam` in your terminal, you should receive the following output:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.parachain_sha256sum }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.parachain_sha256sum }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.parachain_sha256sum }}
    ```

Once you've retrieved the binary, you can skip ahead to the [Running the Systemd Service](#running-the-systemd-service) section to get started running your node.

## Compile the Binary {: #compile-the-binary } 

Manually compiling the binary can take around 30 minutes and requires 32GB of memory.

The following commands will build the latest release of the Moonbeam parachain.

1. Clone the Moonbeam repo

    ```
    git clone https://github.com/PureStake/moonbeam
    cd moonbeam
    ```

2. Check out to the latest release:

    ```
    git checkout tags/$(git describe --tags)
    ```

3. If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=_blank} by executing:

    ```
    --8<-- 'code/setting-up-node/installrust.md'
    ```

4. Update your `PATH` environment variable by running:

    ```
    --8<-- 'code/setting-up-node/updatepath.md'
    ```

5. Build the parachain binary:

    ```
    cargo build --release
    ```

![Compiling Binary](/images/node-operators/networks/run-a-node/systemd/full-node-binary-1.png)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:

```
--8<-- 'code/setting-up-node/updatepath.md'
```

Now you can use the Moonbeam binary to run a systemd service.

## Setup the Service {: #setup-the-service }

The following commands will set up everything regarding running the service.

1. Create a service account to run the service:

    === "Moonbeam"
        ```
        adduser moonbeam_service --system --no-create-home
        ```

    === "Moonriver"
        ```
        adduser moonriver_service --system --no-create-home
        ```

    === "Moonbase Alpha"
        ```
        adduser moonbase_service --system --no-create-home
        ```

2. Create a directory to store the binary and data (you might need `sudo`):

    === "Moonbeam"
        ```
        mkdir {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        mkdir {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        mkdir {{ networks.moonbase.node_directory }}
        ```

3. Move the binary built in the last section to the created folder. If you [compiled the binary](#compile-the-binary) yourself, you'll need to move the binary in the target directory (`./target/release/`). Otherwise, move the Moonbeam binary in the root (you might need sudo):

    === "Moonbeam"
        ```
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

4. Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data:

    === "Moonbeam"
        ```
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        ```

## Create the Configuration File {: #create-the-configuration-file }

The next step is to create the systemd configuration file. If you are setting up a collator node, make sure to follow the code snippets for [Collator](#collator--collator). Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Replace `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

!!! note
    For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`.

### Full Node {: #full-node } 

=== "Moonbeam"
    ```
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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"
    ```
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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"
    ```
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
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    If you want to run an RPC endpoint, to connect Polkadot.js Apps, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports. More details are available by running `moonbeam --help`. This is **not** recommended for Collators. For an overview of the available flags, please refer to the [Flags](/node-operators/networks/run-a-node/flags){target=_blank} page of our documentation.

### Collator {: #collator } 

=== "Moonbeam"
    ```
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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```
    
=== "Moonriver"
    ```
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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"
    ```
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
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --execution wasm \
         --wasm-execution compiled \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.

## Run the Service {: #run-the-service }

--8<-- 'text/systemd/run-service.md'

![Service Status](/images/node-operators/networks/run-a-node/systemd/full-node-binary-2.png)

You can also check the logs by executing:

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/run-a-node/systemd/full-node-binary-3.png)

If you need to stop the service for any reason, you can run:

```
systemctl stop moonbeam.service
```

## Update the Client {: #update-the-client } 

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

If you want to update your client, you can keep your existing chain data in tact, and only update the binary by following these steps:

1. Stop the systemd service:

    ```
    sudo systemctl stop moonbeam.service
    ```

2. Remove the old binary file:
    
    === "Moonbeam"
        ```
        rm  {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"
        ```
        rm  {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"
        ```
        rm  {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. Get the latest version of Moonbeam from the [Moonbeam GitHub Release](https://github.com/PureStake/moonbeam/releases/) page

4. If you're using the release binary, update the version and run:

    ```
    wget https://github.com/PureStake/moonbeam/releases/download/<NEW VERSION TAG HERE>/moonbeam
    ```

    If you want to compile the binary, please refer back to the [Compile the Binary](#compile-the-binary) instructions, making sure you `git checkout` to the latest version.

5. Move the binary to the data directory:

    === "Moonbeam"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}

        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonbeam.binary_name }} {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}

        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        # If you used the release binary:
        mv ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}

        # Or if you compiled the binary:
        mv ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
        ```

6. Update permissions:

    === "Moonbeam"
        ```
        chmod +x moonbeam
        chown moonbeam_service moonbeam
        ```

    === "Moonriver"
        ```
        chmod +x moonbeam
        chown moonriver_service moonbeam
        ```

    === "Moonbase Alpha"
        ```
        chmod +x moonbeam
        chown moonbase_service moonbeam
        ```

7. Start your service:
    ```
    systemctl start moonbeam.service
    ```

To check the status of the service and/or logs, you can refer to the commands from before.

## Purge Your Node {: #purge-your-node } 

If you need a fresh instance of your Moonbeam node, you can purge your node by removing the associated data directory.

Depending on whether you used the release binary or compiled the binary yourself, the instructions for purging your chain data will slightly vary. If you compiled the binary yourself, you can skip ahead to the [Purge Compiled Binary](#purge-compiled-binary) section.

### Purge Release Binary {: #purge-release-binary } 

You'll first need to stop the systemd service:

```
sudo systemctl stop moonbeam
```

To purge your parachain and relay chain data, you can run the following command:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

--8<-- 'text/purge-chain/post-purge.md'

### Purge Compiled Binary {: #purge-compiled-binary } 

If you want to start a fresh instance of a node, there are a handful of `purge-chain` commands available to you which will remove your previous chain data as specified. The base command which will remove both the parachain and relay chain data is:

```
./target/release/moonbeam purge-chain
```

You can add the following flags to the above command if you want to specify what data should be purged:

- `--parachain` - only deletes the parachain database, keeping the relay chain data in tact
- `--relaychain` - only deletes the relay chain database, keeping the parachain data in tact

You can also specify a chain to be removed:

- `--chain` - specify the chain using either one of the predefined chains or a path to a file with the chainspec

To purge only your Moonbase Alpha parachain data, for example, you would run the following command:

```
./target/release/moonbeam purge-chain --parachain --chain alphanet
```

To specify a path to the chainspec for a development chain to be purged, you would run:

```
./target/release/moonbeam purge-chain --chain example-moonbeam-dev-service.json
```

For the complete list of available `purge-chain` commands, you can access the help menu by running:

```
./target/release/moonbeam purge-chain --help
```

--8<-- 'text/purge-chain/post-purge.md'