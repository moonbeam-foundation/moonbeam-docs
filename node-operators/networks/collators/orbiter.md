---
title: Orbiter Program for Collators
description: Learn about the Moonbeam Orbiter Program for collators, including the eligibility criteria, bond requirements, rewards, performance metrics, and more.
categories: Node Operators and Collators
---

# Moonbeam Orbiter Program

## Introduction {: #introduction }

The Moonbeam Foundation is announcing a limited trial of the orbiter program. Similar to [Decentralized Nodes](https://nodes.web3.foundation/){target=\_blank}, this program allows collators to participate in the diversity and security of the network even if they do not have enough funds or backing to otherwise be in the active set. This program was developed with the input from the community.

The Moonbeam Foundation will maintain orbiter pools in the active set, and will assign authority to produce blocks to each of the members in the program, who are called orbiters. 

The active orbiter will rotate on a regular fixed basis to maintain a fair distribution of active rounds. The orbiters’ performance will be monitored and payouts for each round will be redirected to each orbiter based on their blocks produced that round. Rewards overall will be shared with all other orbiters assigned to each specific collator account. 

As long as an orbiter’s performance is within a range of their peers, they will maintain their position in the rotation. If they fall below this threshold, they will be removed from the pool and demoted to the back of the waiting list for Moonbase Alpha. A new orbiter from the waiting list will take their slot. 

## Duration {: #duration }

As the program progresses, the Moonbeam Foundation will assess the results and make adjustments. There is no specific end date, but the program may come to an end or materially change. Participants are both encouraged to give feedback throughout the program as well as be aware that it may change from the concept explained here.

## Eligibility {: #eligibility }

To participate in the orbiter program, you must meet the following eligibility criteria:

- Due to the nature of the program, each orbiter must pass an identity verification check, and cannot be a resident of certain jurisdictions
- Each orbiter must post a bond. This bond is posted to protect against bad behavior and will be subject to slashing
- Each entity (person or group) may only run one orbiter per network (i.e., one on Moonriver and one on Moonbeam)
- Orbiters cannot run another active collator on the same network as their orbiter. They can, however, run an active collator on Moonbeam and an orbiter on Moonriver, or vice versa, as long as they do not also have both on the same network

## Communication {: #communication }

A private discord group will be created for this program, and most communication will happen over this channel or through DM. Once you've filled out your application, you'll be added to the group.

## Orbiters and Orbiter Pool Configurations {: #configuration }

Orbiter pools are maintained by the Moonbeam Foundation, and will assign block production authority to each orbiter. The maximum number of orbiters per orbiter pool for each network is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.max_orbiters_per_collator }} orbiters per pool
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.max_orbiters_per_collator }} orbiters per pool
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.max_orbiters_per_collator }} orbiters per pool
    ```

For Moonbeam and Moonriver there is also a maximum number of orbiter pools that will be allowed in the active set. For Moonbase Alpha, there will be as many orbiter pools as needed. The maximum is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.max_collators }} orbiter pools
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.max_collators }} orbiter pools
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.max_collators }} orbiter pools
    ```

Each orbiter will be active for a certain number of rounds before the next orbiter will take over. The number of active rounds for each network is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.active.rounds }} round (~{{ networks.moonbeam.orbiter.active.hours }} hours)
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.active.rounds }} rounds (~{{ networks.moonriver.orbiter.active.hours }} hours)
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.active.rounds }} rounds (~{{ networks.moonbase.orbiter.active.hours }} hours)
    ```

## Application and Onboarding Process {: #application-and-onboarding-process }

To join the orbiter program, you'll need to start by filling out an application where you'll need to submit contact information, social media handles, and collator and node details. At the end of the form, you'll also need to follow the instructions to complete identity verification.

<div class="button-wrapper">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSewdSAFgs0ZbgvlflmZbHrSpe6uH9HdXdGIL7i07AB2pFgxVQ/viewform" target="_blank" class="md-button">Moonbeam Orbiter Program Application</a>
</div>

Once you've passed identity verification and have been accepted into the program, you'll be notified and then the onboarding process will begin. New orbiters must run a Moonbase Alpha node for two weeks to be eligible to run a Moonriver node. Orbiters then must run a Moonriver node for four weeks to be eligible to run a Moonbeam node. Once you are eligible, you are not required to run orbiters on any network. You can leave other networks at any time by [unregistering](#leaving-the-program) and you will receive your bond back. To join again on that network you will need to re-register and will be at the end of the queue.

An outline of the onboarding process is as follows:

- [Prepare your node by syncing it](/node-operators/networks/run-a-node/overview/){target=\_blank}
- Once fully synced, you can [generate your session keys](/node-operators/networks/collators/account-management/#session-keys){target=\_blank}
- [Register your session keys](/node-operators/networks/collators/account-management/#map-author-id-set-session-keys){target=\_blank} and post the associated [mapping bond](#mapping-bond)
- Once you are ready, register as an orbiter via the `moonbeamOrbiters.orbiterRegister()` extrinsic and post the associated [orbiter bond](#bond)
- Orbiters will be placed in a waiting list for each network until a slot is available
- Once a slot opens up, you'll begin producing blocks and receiving rewards on the respective network

## Bonds {: #bond }

### Mapping Bond {: #mapping-bond}

There is a bond that is sent when mapping your author ID with your account. This bond is per author ID registered. The bond set is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ``` 

### Orbiter Bond {: #orbiter-bond }

As previously mentioned, each orbiter must submit a bond to join the program. This bond differs from the one for the active set as it does not earn any delegation rewards while bonded. The current bonds are as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.bond }} DEV
    ```

## Rewards {: #rewards }

Rewards for orbiters will be split between the other orbiters assigned to the same orbiter pool. The maximum orbiters per orbiter pool is described in the [configuration section](#configuration). In the case of Moonriver it’s {{ networks.moonriver.orbiter.max_orbiters_per_collator }}, so the rewards will be approximately 1/{{ networks.moonriver.orbiter.max_orbiters_per_collator }} of a collator’s rewards. The blocks produced by each orbiter while active are tracked, and rewards are proportionally distributed.

## Performance Metrics {: #performance-metrics }

Each orbiter’s performance will be assessed over a period of time to determine they are active and producing blocks, and if their performance is within a range of all other orbiter pool collators. Orbiters are expected to run top tier hardware to stay within range. For more information on hardware requirements, please check out the [Collator Requirements page](/node-operators/networks/collators/requirements/){target=\_blank}. 

Metrics will be assessed over seven day periods. The performance metrics are as follows:

- Orbiter has produced a block within the last three rounds they were active 
- Orbiter’s block production is within two standard deviation of the seven day program mean
- Orbiter’s transactions per block is within two standard deviation of the seven day program mean 
- Orbiter’s block weight is within two standard deviation of the seven day program mean

!!! note
    These factors are subject to change as the program progresses.

## Leaving the Program {: #leaving-the-program }

An orbiter may leave the program and receive their bond back without any delay. The only limitation is that if the orbiter is currently active, they cannot leave. Once they are no longer active (i.e. once their assigned active round ends and block production authority rotates to another orbiter), they can leave at any time by following these steps: 

1. Execute the chain state call `moonbeamOrbiters.collatorsPool()` with no arguments, making sure to disable "include option" in [Polkadot.js](https://polkadot.js.org/apps/#/explorer){target=\_blank}. Make note of your collator pool address and the number of pools as you will need them in the following steps. 

![`moonbeamOrbiters.collatorsPool()` Chain State Call in Polkadot.js](/images/node-operators/networks/collators/orbiter/orbiter-1.webp)

2. Execute `moonbeamOrbiters.orbiterLeaveCollatorPool(collator)` extrinsic where the `collator` param is the address of the collator pool you are in.

![`moonbeamOrbiters.orbiterLeaveCollatorPool(collator)` Extrinsic Call in Polkadot.js](/images/node-operators/networks/collators/orbiter/orbiter-2.webp)

3. Execute `moonbeamOrbiters.orbiterUnregister(collatorsPoolCount)` where `collatorsPoolCount` is the number of pools.

![`moonbeamOrbiters.orbiterUnregister(collatorsPoolCount)` Extrinsic Call in Polkadot.js](/images/node-operators/networks/collators/orbiter/orbiter-3.webp)