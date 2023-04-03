---
title: How to use ZombieNet with Moonbeam
description: Learn the basics of how to use ZombieNet to easily spin up a local end-to-end configuration of a relay chain and a Moonbase network.
--- 

# How to Use ZombieNet with Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/chopsticks/chopsticks-banner.png)

## Introduction {: #introduction }

Parity's ZombieNet is a versatile and powerful testing framework designed for Substrate-based blockchains. It provides developers with the ability to create and simulate complex ephemeral blockchain environments, including relay chains, parachains, and standalone chains, for development and testing purposes. ZombieNet streamlines the process of setting up, configuring, and managing local testnets, making it an essential tool for blockchain developers.  

ZombieNet is considered a useful tool because it allows developers to configure and spin up network setups based on information in a TOML or JSON file instead of having to do it manually. Internally ZombieNet is a JavaScript library, designed to run on Node.js. It has different solutions to run the nodes required by each chain, such as Kubernetes, Podman, as well as a native solution.   

When developing on the Moonbeam Network, ZombieNet becomes especially useful when working with XCM, consensus mechanisms, or other Substrate level functionality. With ZombieNet, developers can create a local Moonbeam test environment, connect it to a relay chain, and thoroughly test blockchain connections under realistic network conditions.  

## Checking Prerequisites {: #checking-prerequisites }

ZombieNet works best on Linux systems. There are different requirements for each operating system to run nodes, so not every prerequisite here will be for your operating system. To use ZombieNet, you will need some of the following:  

- Put
- Stuff
- Here

## Installing ZombieNet

To run a ZombieNet, you need the CLI installed. 

## Getting Moonbeam Binaries for ZombieNet  



## Writing ZombieNet Configuration Files {: #writing-ZombieNet-configuration-files }

ZombieNet's CLI tool allows you to specify a configuration file as instructions on what how to spin up networks. This file allows you to define details about the relay chain, parachains, nodes, and more.  

To write these configurations, Parity has created its own ZombieNet domain-specific language for spinup configurations, which are stored in `.zndsl` files. However, most developers will be more familiar with a configuration file that's written in either TOML, JSON, or YAML: the format of which are significantly different from `.zndsl` files. These 3 general-purpose language configurations have have four main sections:  

- `settings` — general settings for the test environment, such as timeout values  
- `relaychain` — configuration for the ZombieNet's relay chain properties  
- `parachains` — an array of configurations for each parachain that's spun up with the ZombieNet  
- `hrmp` — an array of data defining hrmp channels between the parachains specified in the `parachains` section  
- `types` — definitions for custom types used in the parachains, such as block headers  

The full configuration options can be found in the [ZombieNet documentation](https://paritytech.github.io/ZombieNet/network-definition-spec.html){target=_blank}.  

### Basic Moonbeam Setup Example

The following example shows how a minimal Moonbeam parachain and Polkadot relay chain can be spun up together.  

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

This configuration file sets up a local test environment with a relay chain and a parachain. The relay chain has two validator nodes, Alice and Bob, whereas the parachain has a collator named Alith. Let's break down the configuration file:  

- **settings**: this section defines general settings for the test environment
    - **timeout**: sets the timeout for the test environment to, in this case, 1000 milliseconds
- **relaychain**: this section configures the relay chain, which is the main chain connecting all parachains
    - **chain**: sets the relay chain's name
    - **default_command**: specifies the location of the Polkadot binary that will be used to run the relay chain
    - **relaychain.nodes**: this section defines info on a relay chain node. In this case, two nodes are specified, which is why there are two "relaychain.node" sections
        - **name**: a unique identifying name of a node 
        - **validator**: gives the node a validator role 
        - **extra_args**: an array of extra arguments, in this case `-lparachain=debug` is used for setting the logging filter as "debug"  
- **parachains**: This section configures a parachain that will connect to the relay chain
    - **id**: assigns an ID of to the parachain, in this case `1000`
    - **chain**: sets the parachain's name
    - **cumulus_based**: indicates that the parachain should use Cumulus command generation
    - **add_to_genesis**: specifies that the parachain should be registered in the genesis block
    - **parachains.collator**: this section configures collators for the parachain
        - **name**: a unique identifying name of a node 
        - **command**: specifies the location of the Moonbeam binary that will be used to run the parachain
        - **rpc_port**: sets the RPC port of this node, in this example to `localhost:34101`
        - **args**: similar to the **extra_args** config, this is an array of extra arguments. In this case, `-lparachain=debug` is used for setting the logging filter as "debug"
- **types**: this section defines the types within the system's JavaScript API
    - **Header**: This section defines the Header type


Some important things to note:  

- All nodes, regardless of whether or not they are in the same chain, must have different names
- The relay chain ought to have at least 2 validating nodes

### ZombieNet Domain Specific Language 

i can't get any information on this

