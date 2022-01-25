---
title: Requirements
description: Learn about the requirements for becoming a collator and maintaining a collator node on Moonbeam networks
---

# Collator Requirements

![Collator Requirements Banner](/images/node-operators/networks/collators/requirements-banner.png)

## Introduction {: #introduction } 

There are some requirements to keep in mind before diving into running a collator node. You need to have top of the line hardware, securely created and stored accounts, meet bonding requirements, and fill out a collator questionnaire.

It is recommended to go through all of the necessary requirements on the Moonbase Alpha TestNet before collating on a production network like Moonbeam or Moonriver.

This guide will help you to get started fulfilling the collator requirements so you can get your node up and running in no time.

## Hardware Requirements {: #hardware-requirements } 

Collators must have a full node running with the collation options. To do so, follow the [Run a Node](/node-operators/networks/run-a-node/overview/) tutorial and installation steps for [Using Systemd](/node-operators/networks/run-a-node/systemd/). Make sure you use the specific code snippets for collators.

!!! note
    Running a **collator** node has higher CPU requirements than the ones provided in the above tutorial. In order for your collator node to be able to keep up with a high transaction throughput a CPU with high clock speed and single-core performance is important, as the block production/import process is almost entirely single-threaded.
    Running your collator node in Docker is also not recommended, as it will have a significant impact in performance.

From a hardware perspective, it is important to have top of the line hardware to maximize block production and rewards. The following are some hardware recommendations that have performed well and provided the best results:

- **Recommended CPUs** - Intel Xeon E-2386/2388 or Ryzen 9 5950x/5900x
- **Recommended NVMe** - 1 TB NVMe
- **Recommended RAM** - 32 GB RAM

In addition, you should take into account the following considerations:

- As most cloud providers focus on multi-thread rather than single-thread performance, using a bare-metal provider is recommended
- You should have primary and backup bare metal servers in different data centers and countries. Hetzner is OK for one of these servers, but shouldn't be used for both
- Your Moonbeam server should be dedicated for Moonbeam only, please do not use the same server for other apps

## Account Requirements {: #account-requirements } 

Similar to Polkadot validators, you need to create an account. For Moonbeam, this is an H160 account or an Ethereum-style account from which you hold the private keys. There are many Ethereum wallets that can be used, but for production purposes it is recommended to generate keys as securely as possible. It is also recommended to generate backup keys.

You can actually generate keys using the Moonbeam binary through a tool called Moonkey. It can be used to generate both ethereum-style accounts and substrate-style accounts. 

To generate keys securely it is recommended to do so on an air-gapped machine. Once you generate your keys make sure you store them safely. To securely store your keys, here are some recommendations, from least to most secure:

- Write down and laminate your keys
- Engrave your keys into a metal plate
- Shard your keys using a tool like [Horcrux](https://gitlab.com/unit410/horcrux)

As always, it is recommended to do your own research and use tools that you vet as trustworthy.

### Getting Started with Moonkey {: #getting-started-with-moonkey } 

The first step is to fetch the moonkey binary file hosted on GitHub. To do so, you can download a binary file (tested on Linux/Ubuntu):

`https://github.com/PureStake/moonbeam/releases/download/v0.8.0/moonkey`

Once you’ve downloaded the tool, ensure you have the correct access permissions to execute the binary file. Next, check that you have the right version by checking the downloaded file hash.

For Linux-based systems such as Ubuntu, open the terminal and head to the folder where the moonkey binary file is located. Once there, you can use the sha256sum tool to calculate the SHA256 hash:

```
019c3de832ded3fccffae950835bb455482fca92714448cc0086a7c5f3d48d3e
```

After you’ve verified the hash, it is recommended to move the binary file to an air-gapped machine (no network interfaces). You can also check the hash of the file in the air-gapped device directly.

### Generating an Account with Moonkey {: #generating-an-account-with-moonkey } 

Using the moonkey binary file is very straightforward. Every time you execute the binary, the information related to a newly created account is displayed.

This information includes:

- Mnemonic seed: a 24-word mnemonic that represents your account in readable words. This gives direct access to your funds, so you need to store these words securely
- Private key: the private key associated with your account, used for signing. This is derived from the mnemonic seed. This gives direct access to your funds, so you need to store it securely
- Public address: your account’s address
- Derivation path which tells the Hierarchical Deterministic (HD) wallet how to derive the specific key

!!! note
    Please safely store the private key/mnemonic and do not share it with anyone. Private keys/mnemonics provide direct access to your funds.

It is recommended that you use the binary file in an air-gapped machine.

### Other Moonkey Features {: #other-moonkey-features } 

Moonkey provides some additional functionalities. The following flags can be provided:

- `-help` – prints help information
- `-version` – prints version of moonkey you are running
- `-w12` – generates a 12 words mnemonic seed (default is 24)

The following options are available:

- `-account-index` – provide as input the account index to use in the derivation path
- `-mnemonic` – provide as input the mnemonic

## Bonding Requirements {: #bonding-requirements } 

There are two bonds for you to be aware of: a bond to join the collator pool and a bond for key association.

### Minimum Collator Bond {: #minimum-collator-bond }

First, you will need a minimum amount of tokens staked (self-bonded) to be considered eligible and become a candidate. Only a certain number of the top collator candidates by total stake, including self-bonded and delegated stake (total bonded), will be in the active set of collators.

=== "Moonbeam"
    |         Variable          |                          Value                           |
    |:-------------------------:|:--------------------------------------------------------:|
    | Minimum self-bond amount  |     {{ networks.moonbeam.staking.min_can_stk }} GLMR     |
    | Minimum total bond amount |     {{ networks.moonbeam.staking.min_col_stk }} GLMR     |
    |      Active set size      | {{ networks.moonbeam.staking.max_candidates }} collators |

=== "Moonriver"
    |         Variable          |                           Value                           |
    |:-------------------------:|:---------------------------------------------------------:|
    | Minimum self-bond amount  |     {{ networks.moonriver.staking.min_can_stk }} MOVR     |
    | Minimum total bond amount |     {{ networks.moonriver.staking.min_col_stk }} MOVR     |
    |      Active set size      | {{ networks.moonriver.staking.max_candidates }} collators |

=== "Moonbase Alpha"
    |         Variable          |                          Value                           |
    |:-------------------------:|:--------------------------------------------------------:|
    | Minimum self-bond amount  |     {{ networks.moonbase.staking.min_can_stk }} DEV      |
    | Minimum total bond amount |     {{ networks.moonbase.staking.min_col_stk }} DEV      |
    |      Active set size      | {{ networks.moonbase.staking.max_candidates }} collators |


### Key Association Bond {: #key-association-bond }

Secondly, you will need a bond for key association. This bond is sent when [mapping your author ID](/node-operators/networks/collators/account-management) (session keys) with your account for block rewards, and is per author ID registered.

=== "Moonbeam"
    |   Variable   |                         Value                          |
    |:------------:|:------------------------------------------------------:|
    | Minimum bond | {{ networks.moonbeam.staking.collator_map_bond }} GLMR |

=== "Moonriver"
    |   Variable   |                          Value                          |
    |:------------:|:-------------------------------------------------------:|
    | Minimum bond | {{ networks.moonriver.staking.collator_map_bond }} MOVR |

=== "Moonbase Alpha"
    |   Variable   |                         Value                         |
    |:------------:|:-----------------------------------------------------:|
    | Minimum bond | {{ networks.moonbase.staking.collator_map_bond }} DEV |

## Collator Questionnaire {: #collator-questionnaire }

There is a [Collator Questionnaire](https://docs.google.com/forms/d/e/1FAIpQLSfjmcXdiOXWtquYlBhdgXBunCKWHadaQCgPuBtzih1fd0W3aA/viewform){target=blank}, that aims to assess the state of all collators on Moonbase Alpha. You should be running a collator node on Moonbase Alpha before filling out this form. You will be able to provide your contact information as well as some basic hardware specs. It provides a way to... "give us your contact info so we can contact you if we see your node isn't running well"