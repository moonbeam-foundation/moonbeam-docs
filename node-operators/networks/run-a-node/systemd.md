---
title: Using Systemd
description: How to run a full Parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Systemd
---

# Run a Node on Moonbeam Using Systemd

![Full Node Moonbeam Banner](/images/node-operators/networks/full-node/full-node-banner.png)

## Introduction {: #introduction } 

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will is a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

!!! note
    Moonbase Alpha is still considered an Alphanet, and as such _will not_ have 100% uptime. The parachain might be purged as needed. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. If a chain purge is required, it will be announced via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.

## Installation Instructions - Binary {: #installation-instructions-binary } 

This section goes through the process of using the release binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbeam may work with other Linux flavors, but Ubuntu is currently the only tested version.

To manually build the binaries yourself, check out the [Compile Moonbeam Binary](/node-operators/networks/compile-binary) guide.

### Use the Release Binary {: #use-the-release-binary } 

There are a couple ways to get started with the Moonbeam binary. You can compile the binary yourself, but the whole process can take around 30 minutes to install the dependencies and build the binary. If you're interested in going this route, check out the [Using the Binary](/node-operators/networks/compile-binary) page of our documentation.

Or you can use the [release binary](https://github.com/PureStake/moonbeam/releases) to get started right away.

Use `wget` to grab the latest release binary:


=== "Moonbase Alpha"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 

To verify that you have downloaded the correct version, you can run `sha256sum moonbeam` in your terminal, you should receive the following output:

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.parachain_sha256sum }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.parachain_sha256sum }}
    ```

Once you've retrieved the binary, you can use it to run the systemd service.

### Running the Systemd Service {: #running-the-systemd-service } 

The following commands will set up everything regarding running the service.

First, let's create a service account to run the service:

=== "Moonbase Alpha"
    ```
    adduser moonbase_service --system --no-create-home
    ```

=== "Moonriver"
    ```
    adduser moonriver_service --system --no-create-home
    ```

Next, create a directory to store the binary and data. Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data.:

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    chown moonbase_service {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    chown moonriver_service {{ networks.moonriver.node_directory }}
    ```

Now, copy the binary built in the last section to the created folder. If you [compiled the binary](/node-operators/networks/compile-binary/) yourself, you'll need to copy the binary in the target directory (`./target/release/{{ networks.moonbase.binary_name }}`). Otherwise, copy the Moonbeam binary in the root:

=== "Moonbase Alpha"
    ```
    cp ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    cp ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
    ```

The next step is to create the systemd configuration file. If you are setting up a collator node, make sure to follow the code snippets for "Collator". Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

#### Full Node {: #full-node } 

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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```
#### Collator {: #collator } 

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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
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
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.

Almost there! Register and start the service by running:

```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```

And lastly, verify the service is running:

```
systemctl status moonbeam.service
```

![Service Status](/images/node-operators/networks/full-node/full-node-binary-1.png)

You can also check the logs by executing:

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/node-operators/networks/full-node/full-node-binary-2.png)


## Updating the Client {: #updating-the-client } 

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

First, stop the systemd service:

```
sudo systemctl stop moonbeam
```

Then, install the new version by repeating the steps described before, making sure that you are using the latest tag available. After updating, you can start the service again.

### Purging the Chain {: #purging-the-chain } 

On an as-needed basis, Moonbase Alpha might be purged and reset. If a purge is required, node operators will be notified in advance (via our [Discord channel](https://discord.gg/PfpUATX)). You can also purge your node if your individual data directory becomes corrupted.

If you spun up your node following the [Using the Binary](/node-operators/networks/compile-binary/) guide, you can refer back to the [Purging Binary Data](/node-operators/networks/compile-binary/#purging-binary-data) section to check out the available `purge-chain` commands. 

You'll first need to stop the systemd service:

```
sudo systemctl stop moonbeam
```

To purge your parachain and relay chain data, you can run the following command:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

Now that your chain data has been purged, you can start a new node with a fresh data directory. You can install the newest version by repeating the steps described before, making sure you are using the latest tag available.