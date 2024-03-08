---
title: Runtime 2800 Release Notes
description: This page offers a brief overview of the Moonbeam runtime 2800 release, shedding light on the latest features and updates in the Moonbeam code base.
---

# Runtime 2800 Release Notes

## Asynchronous Backing Enabled on Moonbase Alpha {: #async-backing }

With the implementation of asynchronous backing on the Moonbase Alpha TestNet, block intervals have undergone a significant reduction from 12 seconds to just 6 seconds. This optimization, enabled through parallel execution of transaction validation and block production, has effectively doubled the throughput capacity on Moonbase Alpha. Please note that async backing has only been enabled on Moonbase Alpha.

You can learn more about [Asynchronous Backing on Polkadot's Wiki](https://wiki.polkadot.network/docs/learn-async-backing){target=\_blank}.

## Removal of Governance V1 Collectives {: #remove-gov-v1-collective }

Moonbeam networks have transitioned to Governance V2, an upgrade completed across all networks as of the runtime 2400 release. This update introduced the OpenGov Technical Committee as a new collective within the governance structure. Consequently, as part of the Governance v1 removal, the Governance v1 Council and Technical Committee collectives have been dissolved and no longer exist. The removal of the Governance v1 collectives results in the following notable changes:

- The Council Collective Precompile and the Technical Committee Precompile have been removed and will revert if called
- The maintenance mode privileges have been transferred to the OpenGov Technical Committee
- Fast-tracking a proposal is no longer possible
- Some origins have been updated, which are outlined in the [Remove Gov V1 collectives PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2643){target=\_blank}

## Addition of the Relay Data Verifier Precompile {: #add-relay-data-verifier-precompile }

A new precompile was released, enabling relay chain data to be verified using the Ethereum API. The precompile is located at the following address:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.precompiles.relay_data_verifier }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.precompiles.relay_data_verifier }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.precompiles.relay_data_verifier }}
    ```

## Addition of the Fast Admin Track on Moonbase Alpha {: #add-a-fast-admin-track }

The Fast General Admin Track is a new OpenGov track similar to the preexisting General Admin Track but with relaxed support requirements. At this time, the Track can only be used to manage HRMP channels and is only enabled on Moonbase Alpha.

Please refer to the [Governance on Moonbeam](/learn/features/governance){target=\_blank} documentation for more information on the Fast General Admin Track.
