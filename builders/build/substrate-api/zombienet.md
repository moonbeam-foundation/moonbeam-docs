---
title: How to use Zombienet with Moonbeam
description: Learn the basics of how to use Zombienet to easily spin up a local end-to-end configuration of a relay chain and a Moonbase network.
--- 

# How to Use Zombienet with Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/chopsticks/chopsticks-banner.png)

## Introduction {: #introduction }

Zombienet is a testing framework for Substrate based blockchains, allowing developers to spawn and test ephemeral Substrate environments more  thoroughly than other tools may provide. They can be used for testing blockchains' on-chain storage, metrics, and logs.  

Zombienet is considered a useful tool because it allows developers to configure and spin up network setups based on information in a TOML or JSON file instead of having to do it manually. Internally Zombienet is a JavaScript library, designed to run on Node.js. It has different solutions to run the nodes required by each chain, such as Kubernetes, Podman, as well as a native solution.   

## Checking Prerequisites {: #checking-prerequisites }

Zombienet works best on Linux systems. There are different requirements for each operating system to run nodes, so not every prerequisite here will be for your operating system. To use Zombienet, you will need some of the following:  

- Put
- Stuff
- Here

## Writing Zombienet Configuration Files {: #writing-zombienet-configuration-files }

Zombienet's CLI tool allows you to specify a configuration file as instructions on what how to spin up networks. This file allows you to define details about the relay chain, parachains, nodes, and more. The file can be written in either TOML or JSON. The following example shows how a minimal Moonbeam parachain and Polkadot relay chain can be spun up together.  

=== "TOML"
    ```toml
    [settings]
    timeout = 1000

    [relaychain]
    chain = "westend-local"
    default_command = "/Users/jb/Desktop/moonbeam-eng/zombienet/polkadot/target/release/polkadot"

        [[relaychain.nodes]]
        name = "alice"
        validator = true
        extra_args = [ "-lparachain=debug" ]

        [[relaychain.nodes]]
        name = "bob"
        validator = true
        extra_args = [ "-lparachain=debug" ]


    [[parachains]]
    id = 1000
    chain = "moonbase-local"
    cumulus_based = true
    add_to_genesis = true

        [parachains.collator]
        name = "alith"
        command = "/Users/jb/Desktop/moonbeam-eng/zombienet/moonbeam/target/release/moonbeam"
        rpc_port = 34101  
        args = ["-lparachain=debug"]

    [types.Header]
    number = "u64"
    parent_hash = "Hash"
    post_state = "Hash"
    ```

=== "JSON"
    ```json
    {
        "json": "hey"
    }
    ```

The full configuration options can be found in the [Zombienet documentation](https://paritytech.github.io/zombienet/network-definition-spec.html){target=_blank}.  

Some things to note:  

- All nodes, regardless of whether or not they are in the same chain, must have different names
- The relay chain ought to have at least 2 nodes