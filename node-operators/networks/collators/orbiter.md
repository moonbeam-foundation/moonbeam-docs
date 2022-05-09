---
title: Orbiter Program for Collators
description: Learn about the ...
---

# Moonbeam Orbiter Program

The Moonbeam Foundation is announcing a limited trial of the Orbiter Program. Similar to the [Kusama 1000 validators program](https://thousand-validators.kusama.network/){target=_blank}, this program allows collators to participate in the diversity and security of the network even if they do not have enough funds or backing to otherwise be in the active set. This program was developed with the input from the community.

The Moonbeam Foundation will maintain Orbiter Program Collators in the active set, and will assign authority to produce blocks to each of the members in the program, who are called Orbiters. 

The active Orbiter will rotate on a regular fixed basis to maintain a fair distribution of active rounds. The Orbiters’ performance will be monitored and payouts for each round will be redirected to each Orbiter based on their blocks produced that round. Rewards overall will be shared with all other Orbiters assigned to each specific collator account. 

As long as an Orbiter’s performance is within a range of their peers, they will maintain their position in the rotation. If they fall below this threshold, they will be removed from the pool and demoted to the back of the waiting list for Moonbase Alpha. A new Orbiter from the waiting list will take their slot. 

## Duration {: #duration }

This program is currently in a trial period while the Moonbeam Foundation assesses the results and makes adjustments. There is no specific end date, but the trial may come to an end or materially change throughout the trial period. Participants are both encouraged to give feedback throughout the program as well as be aware that it may change from the concept explained here.

## Eligibility {: #eligibility }

To participate in the Orbiter program, you must meet the following eligibility criteria:

- Due to the nature of the program, each Orbiter must pass a KYC check, and cannot be a resident of certain jurisdictions
- Each Orbiter must post a bond.  This bond is posted to protect against bad behavior and will be subject to slashing
- Each entity (person or group) may only run one Orbiter per network (i.e., one on Moonriver and one on Moonbeam)
- Orbiters cannot run another collator on the same network as their Orbiter. They can, however, run a collator on Moonbeam and an Orbiter on Moonriver, or vice versa, as long as they do not also have both on the same network

## Communication {: #communication }

A private discord group will be created for this program, and most communication will happen over this channel or through DM. Once you've filled out your application, you'll be added to the group.

## Application and Onboarding Process {: #application-and-onboarding-process }

To join the Orbiter program, you'll need to start by filling out an application where you'll need to submit contact information, social media handles, and collator and node details. At the end of the form, you'll also need to follow the instructions to complete KYC.

<div class="button-wrapper">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSewdSAFgs0ZbgvlflmZbHrSpe6uH9HdXdGIL7i07AB2pFgxVQ/viewform" target="_blank" class="md-button">Moonbeam Orbiter Program Application</a>
</div>

Once you've passed KYC and have been accepted into the program, you'll be notified and then the onboarding process will begin. An outline of the onboarding process is as follows:

1. Once notified, run an Orbiter on Moonbase Alpha
2. After completing the Moonbase Alpha trial period, you will be notified of Moonriver eligibility 
3. Prepare your Moonriver Orbiter
4. When ready, post the bond to signal you are ready to collate
5. Orbiters will be placed in a waiting list for Moonriver
6. Orbiters are added to Program Collators when a slot is available
7. Orbiters begin producing blocks and receiving rewards on Moonriver
8. Overall Orbiter program performance will be assessed, possibly changed and extended to Moonbeam

## Bond {: #bond }

As previously mentioned, each Orbiter must submit a bond to join the program. This bond differs from the one for the active set as it does not earn any delegation rewards while bonded. The current bonds are as follows:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.bond }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.bond }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.bond }} DEV
    ```


## Orbiters and Program Collators Configuration {: #configuration }

Program collators are maintained by the Moonbeam Foundation, and will assign authority to each of the Orbiters to produce blocks. The maximum number of Orbiters per Program Collator for each network is as follows:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.max_orbiters_per_collator }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.max_orbiters_per_collator }} Orbiters/Program Collator
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.max_orbiters_per_collator }} Orbiters/Program Collator
    ```

For Moonbeam and Moonriver there is also a maximum number of Program Collators that will allowed to be in the active set. For Moonbase Alpha, there will be as many Program Collators as needed. The maximum is as follows:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.max_collators }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.max_collators }} Program Collators
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.max_collators }} Program Collators
    ```

Each Orbiter will be active for a certain number of rounds before the next Orbiter will take over. The number of active rounds for each network is as follows:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.orbiter.active.rounds }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.orbiter.active.rounds }} rounds (~{{ networks.moonriver.orbiter.active.hours }} hours)
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.orbiter.active.rounds }} rounds (~{{ networks.moonbase.orbiter.active.hours }} hours)
    ```


## Rewards {: #rewards }

Rewards for Orbiters will be split between the other Orbiters assigned to the same Program Collator. The maximum Orbiters per Program Collator is described in the [configuration section](#configuration). In the case of Moonriver it’s {{ networks.moonriver.orbiter.max_orbiters_per_collator }}, so the rewards will be approximately 1/{{ networks.moonriver.orbiter.max_orbiters_per_collator }} of a collator’s rewards. The blocks produced by each Orbiter while active are tracked, and rewards are proportionally distributed.

## Performance Metrics {: #performance-metrics }

Each Orbiter’s performance will be assessed over a period of time to determine they are active and producing blocks, and if their performance is within a range of all other program collators. Orbiters are expected to run top tier hardware to stay within range. For more information on hardware requirements, please check out the [Collator Requirements page](https://docs.moonbeam.network/node-operators/networks/collators/requirements/){target=_blank}. 

Metrics will be assessed over 7 day periods. The performance metrics are as follows:

- Orbiter has produced a block within the last 3 rounds they were active 
- Orbiter’s block production is within 2 standard deviation of the 7 day program mean
- Orbiter’s transactions per block is within 2 standard deviation of the 7 day program mean 
- Orbiter’s block weight is within 2 standard deviation of the 7 day program mean

!!! note
    These factors are subject to change during this trial period.

## Leaving the Program {: #leaving-the-program }

An Orbiter may leave the program and receive their bond back without any delay. The only limitation on this is if the Orbiter is currently active they cannot leave; once they are no longer active they can leave at any time by issuing an extrinsic.
