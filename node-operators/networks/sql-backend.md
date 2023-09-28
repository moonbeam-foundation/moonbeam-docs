---
title: SQL Backend for Nodes
description: This guide will show you how to launch a Moonbeam node that uses a more performant SQL database for resource-intensive requests such as fetching Ethereum logs.
---

# SQL Backend for Nodes

## Introduction {: #introduction }

The default [Frontier](/learn/features/eth-compatibility/#frontier){target=_blank} database, which comes standard with Moonbeam nodes and contains all of the Ethereum-related elements, such as transactions, blocks, and logs, can be modified to use a SQL backend. Since, `eth_getLogs` is a very resource-intensive method, the SQL backend aims to provide a more performant alternative for indexing and querying Ethereum logs in comparison to the default RocksDB database.

This guide will show you how to spin up a node that uses a SQL backend for Frontier. Once you have completely synced your node, you'll be able to communicate with it like normal, using JSON-RPC methods.

## Run a Node with a Frontier SQL Backend {: #spin-up-node }

Before getting started, please note that you must sync your node from genesis in order to utilize the SQL backend.

To spin up a node with a Frontier SQL backend, you'll need to add the `--frontier-backend-type sql` flag to your start-up command.

### Using Systemd {: #using-systemd }

For example, if you're [using Systemd to run a node](/node-operators/networks/run-a-node/systemd){target=_blank}, you can edit your Systemd configuration file, `/etc/systemd/system/moonbeam.service`, to use a Frontier SQL backend:

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
        --frontier-backend-type sql
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
         --frontier-backend-type sql
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
         --frontier-backend-type sql
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

!!! note
    Don't forget to replace `INSERT_YOUR_NODE_NAME` in two different places and `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs.

### Using Docker {: #using-docker }

If you're [using Docker to run a node](/node-operators/networks/run-a-node/docker){target=_blank}, you can edit the start-up command to be:

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache <50% RAM in MB> \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain moonbeam \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonriver"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain moonriver \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

    === "Moonbase Alpha"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --frontier-backend-type sql
        --base-path=/data \
        --chain alphanet \
        --name="INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        -- \
        --name="INSERT_YOUR_NODE_NAME (Embedded Relay)"
        ```

!!! note
    Don't forget to replace `INSERT_YOUR_NODE_NAME` in two different places and `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs.

### Flags for Configuring a SQL Backend {: #flags-for-sql-backend }

- **`--frontier-backend-type <BACKEND_TYPE>`** - sets the Frontier backend type to one of the following options:
    - **`key-value`** - uses either RocksDB or ParityDB as per interited from the global backend settings. This is the default option and RocksDB is the default backend
    - **`sql`** - uses a SQL database with custom log indexing
- **`frontier-sql-backend-pool-size <POOL_SIZE>`** - sets the Frontier SQL backend's maximum number of database connections that a connection pool can simultaneously handle. The default is `100`
- **`frontier-sql-backend-num-ops-timeout <NUM_OPS_TIMEOUT>`** - sets the Frontier SQL backend's query timeout in number of VM operations. The default is `10000000`
- **`frontier-sql-backend-thread-count`** - sets the Frontier SQL backend's auxiliary thread limit. The default is `4`
- **`frontier-sql-backend-cache-size`** - sets the Frontier SQL backend's cache size in bytes. The default value is 200MB, which is `209715200` bytes
