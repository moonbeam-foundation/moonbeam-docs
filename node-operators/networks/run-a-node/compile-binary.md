---
title: Compile the Binary to Run a Node
description: Learn how to manually compile the binary to run a full Moonbeam node. Compiling the binary can take around 30 minutes and requires at least 32GB of memory.
---

# Manually Compile the Moonbeam Binary

## Introduction

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a boot node, obtain local access to RPC endpoints, author blocks on the parachain, and more.

This guide is meant for people with experience compiling [Substrate](https://docs.substrate.io){target=\_blank}-based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will be a bigger build because it contains code to run the parachain itself as well as code to sync the relay chain and facilitate communication between the two. As such, this build is quite large, and may take over 30 minutes, and requires 32GB of memory.

To get started quickly without the hassle of compiling the binary yourself, you can use [The Release Binary](/node-operators/networks/run-a-node/systemd/){target=\_blank}.

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

3. If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=\_blank}

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

4. Update your `PATH` environment variable

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

5. Build the parachain binary

    !!! note
        If you are using Ubuntu 20.04 or 22.04, then you will need to install these additional dependencies before building the binary:

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev pkg-config libssl-dev -y 
        ```

    ```bash
    cargo build --release
    ```

![Compiling Binary](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-1.webp)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
```

Now you can use the Moonbeam binary to run a Systemd service. To set up the service and run it, please refer to the [Run a Node on Moonbeam Using Systemd](/node-operators/networks/run-a-node/systemd/){target=\_blank} guide.
