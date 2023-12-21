---
title: Run a Moonbeam Development Node
description: Follow this tutorial to learn how to spin up your first Moonbeam development node, how to configure it for development purposes, and connect to it.
---

# Getting Started with a Local Moonbeam Development Node

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction }

A Moonbeam development node is your own personal development environment for building and testing applications on Moonbeam. For Ethereum developers, it is comparable to Hardhat Network or Ganache. It enables you to get started quickly and easily without the overhead of a relay chain. You can spin up your node with the `--sealing` option to author blocks instantly, manually, or at a custom interval after transactions are received. By default, a block will be created when a transaction is received, which is similar to the default behavior of Hardhat Network's instamine feature.

If you follow this guide to the end, you will have a Moonbeam development node running in your local environment with 10 pre-funded [accounts](#pre-funded-development-accounts).

!!! note
    This tutorial was created using the {{ networks.development.build_tag }} tag of [Moonbase Alpha](https://github.com/moonbeam-foundation/moonbeam/releases/tag/{{ networks.development.build_tag }}){target=_blank}. The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier){target=_blank} components it relies on for Substrate-based Ethereum compatibility are still under very active development.
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## Spin up a Moonbeam Development Node {: #spin-up-a-node }

There are two ways to get started running a Moonbeam node: you can use [Docker to run a pre-built binary](#getting-started-with-docker). or you can [compile the binary locally](#getting-started-with-the-binary-file) and set up a development node yourself. Using Docker is a quick and convenient way to get started, as you won't have to install Substrate and all the dependencies, and you can skip the node-building process as well. It does require you to [install Docker](https://docs.docker.com/get-docker/){target=_blank}. On the other hand, if you decide you want to go through the process of building your development node, it could take roughly 30 minutes or longer to complete, depending on your hardware.

### Spin up a Node with Docker {: #getting-started-with-docker }

Using Docker enables you to spin up a node in a matter of seconds. Once you have Docker installed, you can take the following steps to spin up your node:

1. Execute the following command to download the latest Moonbeam image:

    ```bash
    docker pull moonbeamfoundation/moonbeam:{{ networks.development.build_tag }}
    ```

    The tail end of the console log should look like this:

    ![Docker - imaged pulled](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-1.png)

2. Spin up a Moonbeam development node by running the following Docker command, which will launch the node in instant seal mode for local testing so that blocks are authored instantly as transactions are received:

    === "Ubuntu"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} --network host \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "MacOS"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "Windows"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} ^
        --dev --rpc-external
        ```

!!! note
    On MacOS with silicon chips, Docker images may perform poorly. To improve performance, try [spinning up a Node with a Binary File](#getting-started-with-the-binary-file).

If successful, you should see an output showing an idle state waiting for blocks to be authored:

![Docker - output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-2.png)

For more information on some of the flags and options used in the example, check out [Flags](#node-flags) and [Options](#node-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```bash
docker run --rm --name {{ networks.development.container_name }} \
moonbeamfoundation/moonbeam \
--help
```

To continue with the tutorial, the next section is not necessary as you've already spun up a node with Docker. You can skip ahead to [Configure your Moonbeam Development Node](#configure-moonbeam-dev-node) section.

### Spin up a Node with a Binary File {: #getting-started-with-the-binary-file }

As an alternative to using Docker, you can spin up a node using the Moonbeam binary. This method is more time-consuming. Depending on your hardware, the process could take around 30 minutes to complete.

!!! note
    If you know what you are doing, you can directly download the precompiled binaries attached to each release on the [Moonbeam release page](https://github.com/moonbeam-foundation/moonbeam/releases){target=_blank}. These will not work in all systems. For example, the binaries only work with x86-64 Linux with specific versions of dependencies. The safest way to ensure compatibility is to compile the binary on the system where it will be run.

To build the binary file, you can take the following steps:

1. Clone a specific tag of the Moonbeam repo, which you can find on the [Moonbeam GitHub repository](https://github.com/moonbeam-foundation/moonbeam/){target=_blank}:

    ```bash
    git clone -b {{ networks.development.build_tag }} https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

    !!! note
        Spaces in the installation file path will cause a compilation error.

2. If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=_blank} by executing:

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

3. Update your PATH environment variable by running:

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

4. Build the development node by running:

    !!! note
        If you are using Ubuntu 20.04 or 22.04, then you will need to make sure these additional dependencies have been installed before building the binary:

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev pkg-config libssl-dev -y 
        ```

        For MacOS users, these dependencies can be installed via Homebrew:

        ```bash
        brew install llvm
        brew install protobuf
        brew install pkg-config
        ```

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/build.md'
    ```

    Here is what the tail end of the build output should look like:

    ![End of build output](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-3.png)

!!! note
    The initial build will take a while. Depending on your hardware, you should expect approximately 30 minutes for the build process to finish.

Then, you will want to run the node in development mode using the following command:

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

!!! note
    For people not familiar with Substrate, the `--dev` flag is a way to run a Substrate-based node in a single-node developer configuration for testing purposes. When you run your node with the `--dev` flag, your node is started in a fresh state, and its state is not persisted.

You should see an output that looks like the following, showing an idle state waiting for blocks to be produced:

![Output shows blocks being produced](/images/builders/get-started/networks/moonbeam-dev/moonbeam-dev-4.png)

For more information on some of the flags and options used in the example, check out the [Flags](#node-flags) and [Options](#node-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```bash
./target/release/moonbeam --help
```

## Configure your Moonbeam Development Node {: #configure-moonbeam-dev-node }

Now that you know how to get a standard Moonbeam development node up and running, you may be wondering how you can configure it. The following sections will cover some common configurations you can use when you spin up your node.

### Common Flags to Configure your Node {: #node-flags }

Flags do not take an argument. To use a flag, add it to the end of a command. For example:

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

- **`--dev`** - specifies the development chain
- **`--tmp`** - runs a temporary node in which all of the configuration will be deleted at the end of the process
- **`--rpc-external`** - listen to all RPC and WebSocket interfaces

### Common Options to Configure your Node {: #node-options }

Options accept an argument to the right of the option. For example:

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnodewithsealinginterval.md'
```

- **`-l <log pattern>` or `--log <log pattern>`** - sets a custom logging filter. The syntax for the log pattern is `<target>=<level>`. For example, to print all of the JSON-RPC logs, the command would look like this: `-l json=trace`
- **`--sealing <interval>`** - when blocks should be sealed in the dev service. Accepted arguments for interval: `instant`, `manual`, or a number representing the timer interval in milliseconds (for example, `6000` will have the node produce blocks every 6 seconds). The default is `instant``. Please refer to the [Configure Block Production](#configure-block-production) section below for more information
- **`--rpc-port <port>`** - sets the unified port for HTTP and WS connections. Accepts a port as the argument. Default is {{ networks.parachain.rpc }}
- **`--ws-port <port>`** - *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=_blank}, use `--rpc-port` for HTTP and WS connections instead* sets the WebSockets RPC server TCP port. As of [client v0.30.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.30.0){target=_blank}, sets the unified port for both HTTP and WS connections. Accepts a port as the argument
- **`--rpc-max-connections <connections>`** - specifies the combined HTTP and WS connection limit. The default is 100 connections
- **`--ws-max-connections <connections>`** - *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=_blank}, use `--rpc-max-connections` to limit the HTTP and WS connections instead* - this flag adjusts the combined HTTP and WS connection limit. The default is 100 connections
- **`--rpc-cors <origins>`** - specifies the browser origins allowed to access the HTTP and WS RPC servers. The origins can be a comma-separated list of the origins to allow access or you can also specify `null`. When running a development node, the default is to allow all origins

For a complete list of flags and options, spin up your Moonbeam development node with `--help` added to the end of the command.

### Configure Block Production {: #configure-block-production }

By default, your Moonbeam development node is spun up in instant seal mode, which instantly authors blocks as transactions are received. However, you can specify when blocks should be authored, or sealed, by using the `--sealing` option.

The `--sealing` flag accepts any of the following arguments:

- `instant` - as we already covered, this is the default option in which blocks are authored as soon as a transaction is received
- `manual` - allows you to produce blocks manually. If a transaction is received, a block will not be produced until you manually create one
- an interval in milliseconds - authors a block on a specific time interval. For example, if you set it to `6000`, you will have the node produce blocks every 6 seconds

The flag should be appended to the start-up command in the following format:

```text
--sealing <interval>
```

If you choose `manual`, you'll need to manually create the blocks yourself, which can be done with the `engine_createBlock` JSON-RPC method:

```text
engine_createBlock(createEmpty: *bool*, finalize: *bool*, parentHash?: *BlockHash*)
```

For example, you can use the following snippet to manually create a block using [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}, an Ethereum library that makes it easy to interact with JSON-RPC methods:

```js
import { ethers } from 'ethers';

const produceBlock = async () => {
  // Connect to the Ethereum node (if applicable, replace the URL with your node's address)
  const provider = new ethers.JsonRpcProvider(
    '{{ networks.development.rpc_url }}'
  );

  // Set the custom JSON-RPC method and parameters
  const method = 'engine_createBlock';
  const params = [true, true, null];

  try {
    // Send the custom JSON-RPC call
    const result = await provider.send(method, params);
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error:', error.message);
  }
};

produceBlock();
```

!!! note
    If you're unfamiliar with Ethers, please refer to the [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank} documentation page to learn more.

## Prefunded Development Accounts {: #pre-funded-development-accounts }

Moonbeam has a [unified accounts](/learn/features/unified-accounts){target=_blank} system, which enables users to have an Ethereum-styled H160 account that can interact with the Substrate API and the Ethereum API. As a result, you can interact with your account through [Polkadot.js Apps](#connecting-polkadot-js-apps-to-a-local-moonbeam-node) or [MetaMask](/tokens/connect/metamask){target=_blank} (or any other [EVM wallet](/tokens/connect/){target=_blank}). In addition, you can also use other [development tools](/builders/build/eth-api/dev-env/){target=_blank}, such as [Remix](/builders/build/eth-api/dev-env/remix/){target=_blank} and [Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank}.

Your Moonbeam development node comes with ten pre-funded Ethereum-styled accounts for development. The addresses are derived from Substrate's canonical development mnemonic:

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

??? note "Development account addresses and private keys"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

Also included with the development node is an additional pre-funded account used for testing purposes:

--8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

You can connect any of these accounts to [MetaMask](/tokens/connect/metamask/){target=_blank}, [Talisman](/tokens/connect/talisman/){target=_blank}, [Polkadot.js Apps](/tokens/connect/polkadotjs/){target=_blank}, etc., using their private keys.

## Development Node Endpoints {: #access-your-development-node }

You can access your Moonbeam development node using the following RPC and WSS endpoints:

=== "HTTP"

    ```text
    {{ networks.development.rpc_url }}
    ```

=== "WSS"

    ```text
    {{ networks.development.wss_url }}
    ```

## Block Explorers {: #block-explorers }

For a Moonbeam development node, you can use any of the following block explorers:

 - **Substrate API** — [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer){target=_blank} on WS port `{{ networks.parachain.ws }}`
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode){target=_blank} on HTTP port `{{ networks.parachain.ws }}`

## Debug, Trace, and TxPool APIs {: #debug-trace-txpool-apis }

You can also gain access to some non-standard RPC methods by running a tracing node, which allows developers to inspect and debug transactions during runtime. Tracing nodes use a different Docker image than a standard Moonbeam development node.

To learn how to run a Moonbeam development tracing node, check out the [Run a Tracing Node](/node-operators/networks/tracing-node){target=_blank} guide, and be sure to switch to the **Moonbeam Development Node** tab throughout the instructions. Then, to access the non-standard RPC methods with your tracing node, check out the [Debug & Trace](/builders/build/eth-api/debug-trace){target=_blank} guide.

## Purge a Development Node {: #purging-your-node }

If you want to remove data associated with your node, you can purge it. The instructions for purging a node are different depending on how you initially spun up your node.

### Purge a Node Spun up with Docker {: #purge-docker-node }

If you spun up your node using Docker along with the `-v` flag to specify a mounted directory for your container, you will need to purge that directory. To do so, you can run the following command:

```bash
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

If you followed the instructions in this guide and did not use the `-v` flag, you can stop and remove the Docker container. The associated data will be removed along with it. To do so, you can run the following command:

```bash
sudo docker stop `CONTAINER_ID` && docker rm `CONTAINER_ID`
```

### Purge a Node Spun up with a Binary File {: #purge-binary-node }

When running a node via the binary file, data is stored in a local directory, typically located in `~/.local/shared/moonbeam/chains/development/db`. If you want to start a fresh instance of the node, you can either delete the content of the folder or run the following command inside the `moonbeam` folder:

```bash
./target/release/moonbeam purge-chain --dev -y
```

This will remove the data folder. Note that all chain data is now lost. To learn more about all of the available `purge-chain` commands, you can check out the [Purging Binary Data](/node-operators/networks/run-a-node/systemd/#purging-compiled-binary){target=_blank} section of our documentation.
