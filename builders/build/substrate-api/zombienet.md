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
    default_command = "PATH_TO_POLKADOT_RUNTIME"

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
        command = "PATH_TO_MOONBEAM_RUNTIME"
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
        "settings": {
            "timeout": 1000
        },
        "relaychain": {
            "chain": "westend-local",
            "default_command": "PATH_TO_POLKADOT_RUNTIME",
            "nodes": [
                {
                    "name": "alice",
                    "validator": true,
                    "extra_args": [
                    "-lparachain=debug"
                    ]
                },
                {
                    "name": "bob",
                    "validator": true,
                    "extra_args": [
                    "-lparachain=debug"
                    ]
                }
            ]
        },
        "parachains": [
            {
                "id": 1000,
                "chain": "moonbase-local",
                "cumulus_based": true,
                "add_to_genesis": true,
                "collator": {
                    "name": "alith",
                    "command": "PATH_TO_MOONBEAM_RUNTIME",
                    "rpc_port": 34101,
                    "args": [
                    "-lparachain=debug"
                    ]
                }
            }
        ],
        "types": {
            "Header": {
                "number": "u64",
                "parent_hash": "Hash",
                "post_state": "Hash"
            }
        }
    }
    ```

Let's break down the configuration file:

- **settings**: this section defines general settings for the test environment
    - **timeout**: sets the timeout for the test environment to, in this case, 1000 milliseconds
- **relaychain**: this section configures the relay chain, which is the main chain connecting all parachains
    - **chain**: sets the relay chain's name
    - **default_command**: specifies the location of the Polkadot binary that will be used to run the relay chain
    - **relaychain.nodes**: this section defines info on a relay chain node. In this case, two nodes are specified, which is why there are two "relaychain.node" sections
        - **name**: a unique identifying name of a node 
        - **validator**: gives the node a validator role 
        - **extra_args**: an array of extra arguments, in this case `-lparachain=debug` is used for setting the logging filter as "debug"  
- **parachains**: This section configures a parachain that will connect to the relay chain.

id = 1000: Assigns an ID of 1000 to the parachain.
chain = "moonbase-local": Sets the parachain to use the "moonbase-local" configuration.
cumulus_based = true: Indicates that the parachain is built on the Cumulus framework.
add_to_genesis = true: Specifies that the parachain should be registered in the genesis block.
[parachains.collator]: This section configures the collator for the parachain.

name = "alith": Sets the name of the collator to "alith".
command: Specifies the location of the Moonbeam binary that will be used to run the parachain.
rpc_port = 34101: Sets the RPC port to 34101.
args = ["-lparachain=debug"]: Adds the argument for enabling debug logging.
[types.Header]: This section defines the Header type for the parachain.

number = "u64": Sets the block number type to an unsigned 64-bit integer.
parent_hash = "Hash": Specifies that the parent block hash is of type "Hash".
post_state = "Hash": Specifies that the post-state root is of type "Hash".
In summary, this configuration file sets up a local test environment with a relay chain (Westend) and a parachain (Moonbeam). The relay chain has two validator nodes, Alice and Bob, and the parachain has a collator named Alith.

The full configuration options can be found in the [Zombienet documentation](https://paritytech.github.io/zombienet/network-definition-spec.html){target=_blank}.  

Some important things to note:  

- All nodes, regardless of whether or not they are in the same chain, must have different names
- The relay chain ought to have at least 2 validating nodes