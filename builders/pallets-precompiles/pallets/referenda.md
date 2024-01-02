---
title: Referenda Pallet
description: This guide covers the available functions for the Referenda Pallet on Moonbeam, of which are used to view and submit data related to on-chain referenda
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# The Referenda Pallet

## Introduction {: #introduction }

The Referenda Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/pallets-precompiles/pallets/preimage){target=_blank} and [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank}, the [Referenda Pallet](/builders/pallets-precompiles/pallets/referenda){target=_blank} and [Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda){target=_blank}, and the [Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting){target=_blank} and [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Referenda Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

## Referenda Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Referenda Pallet provides the following extrinsics (functions):

??? function "**cancel**(index) - cancels an ongoing referendum given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to either the Root Track or the Emergency Canceller Track"

    === "Parameters"

        - `index` - the index of the referendum to cancel

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/cancel.js'
        ```

??? function "**kill**(index) - cancels an ongoing referendum and slashes the deposits given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to either the Root Track or the Emergency Killer Track"

    === "Parameters"

        - `index` - the index of the referendum to kill

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/kill.js'
        ```

??? function "**placeDecisionDeposit**(index) - posts the Decision Deposit for a referendum, given the index of the referendum"

    === "Parameters"

        - `index` - the index of the referendum to place the Decision Deposit for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/place-decision-deposit.js'
        ```

??? function "**refundDecisionDeposit**(index) - refunds the Decision Deposit for a closed referendum back to the depositor, given the index of the referendum"

    === "Parameters"

        - `index` - the index of the referendum to refund the Decision Deposit for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/refund-decision-deposit.js'
        ```

??? function "**refundSubmissionDeposit**(index) - refunds the Submission Deposit for a closed referendum back to the depositor, given the index of the referendum"

    === "Parameters"

        - `index` - the index of the referendum to refund the Submission Deposit for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/refund-submission-deposit.js'
        ```

??? function "**submit**(proposalOrigin, proposal, enactmentMoment) - proposes a referendum on a privileged action given the Origin from which the proposal should be executed, the proposal, and the moment that the proposal should be enacted"

    === "Parameters"

        - `proposalOrigin` - the Origin and, by extension, the Track from which the proposal should be executed. Typically, this should be set to one of the following:
            - `system` - indicates the proposal should be executed by a system-level Origin. You can specify the name of the Origin or the index associated with the Origin:
                - `Root` or `0` - submits a proposal to the Root Track
            - `Origins` - indicates the proposal should be executed by one of the governance Origins. To submit a proposal to any of the Tracks aside from Root, you can specify the name of the Origin or the index associated with the Origin:
                - `WhitelistedCaller` or `0` - submits a proposal to the Whitelisted Track
                - `GeneralAdmin` or `1` - submits a proposal to the General Admin Track
                - `ReferendumCanceller` or `2` - submits a proposal to the Emergency Canceller Track
                - `ReferendumKiller` or `3` - submits a proposal to the Emergency Killer Track
        - `proposal` - the action being proposed. To define the proposal to submit, you can use the following method: 
            - `Lookup` - defines the preimage associated with the proposal using the following arguments:
                - `hash_` - the hash of the preimage
                - `len` - the length of the preimage
        - `enactmentMoment` - when the proposal will be executed, either at a specific block or after a specific number of blocks
            - `At` -  a specific block to enact the proposal at
            - `After` - the number of blocks to delay enactment after proposal approval

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/submit.js'
        ```

### Storage Methods {: #storage-methods }

The Referenda Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**decidingCount**(index) - returns the number of referenda being decided currently"

    === "Parameters"

        - `index` - the index of the Track to get the deciding count for. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track

    === "Returns"

        The number of referenda currently being decided on for the given Track.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        1
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/deciding-count.js'
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None.

    === "Returns"

        A number representing the current version of the pallet.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/pallet-version.js'
        ```

??? function "**referendumCount**() - returns the number of referenda started so far"

    === "Parameters"

        None.

    === "Returns"

        The number of referenda started so far.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        1
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/referendum-count.js'
        ```

??? function "**referendumInfoFor**(index) - returns information concerning any given referendum"

    === "Parameters"

        - `index` - the index of the referendum to get the information for

    === "Returns"

        The status of the referendum and additional information depending on the status. The status can be any of the following:

        === "Ongoing"

            The referendum has been submitted and is being voted on. The returned data includes information on the proposal, the deposits, the current state of the referendum, and more.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              ongoing: {
                track: 2,
                origin: { origins: 'GeneralAdmin' },
                proposal: { 
                  lookup: {
                    hash: '0xa5d90079f950888dabb2ef77e159096701784141dd2c8c95a67ced96ec0c1c21',
                    len: 15
                  } 
                },
                enactment: { after: 100 },
                submitted: 5724140,
                submissionDeposit: {
                  who: '0xD720165D294224A7d16F22ffc6320eb31f3006e1',
                  amount: '0x00000000000000008ac7230489e80000'
                },
                decisionDeposit: {
                  who: '0xD720165D294224A7d16F22ffc6320eb31f3006e1',
                  amount: '0x000000000000001b1ae4d6e2ef500000'
                },
                deciding: { since: 5724440, confirming: null },
                tally: { ayes: 0, nays: 0, support: 0 },
                inQueue: false,
                alarm: [ 5825240, [ 5825240, 0 ] ]
              }
            }               
            ```

        === "Approved"

            The referendum finished with approval. The returned data includes the block at which the proposal was approved and deposit information, including the account(s) that placed a deposit and the deposit amount for that account.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              approved: [
                3715966, // Block at which the proposal was approved
                { // Deposit information
                  who: '0xE6c5B9500035cb5557E8FDBAa758d78a15361A0E',
                  amount: '0x00000000000000056bc75e2d63100000'
                },
                null // Additional deposit information or null if there isn't any
              ]
            }
            ```
        
        === "Rejected"
            
            The referendum ended with a rejection. The returned data includes the block at which the proposal was approved and deposit information, including the account(s) that placed a deposit and the deposit amount for that account.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              rejected: [
                5213165, // Block at which the proposal was rejected
                { // Deposit information
                  who: '0xb926E36D439106090Be1151347CFB916E44AFE00',
                  amount: '0x00000000000000008ac7230489e80000'
                },
                null // Additional deposit information or null if there isn't any
              ]
            }
            ```

        === "Cancelled"

            The referendum ended with a cancellation. The returned data includes the block at which the proposal was approved and deposit information, including the account(s) that placed a deposit and the deposit amount for that account.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              cancelled: [
                3613947, // Block at which the proposal was cancelled
                { // Deposit information
                  who: '0xE6c5B9500035cb5557E8FDBAa758d78a15361A0E',
                  amount: '0x00000000000000056bc75e2d63100000'
                },
                null // Additional deposit information or null if there isn't any
              ]
            }
            ```

        === "Timed Out"

            The referendum ended and was never decided. The returned data includes the block at which the proposal was approved and deposit information, including the account(s) that placed a deposit and the deposit amount for that account.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              timedOut: [
                4585127, // Block at which the proposal timed out
                { // Deposit information
                  who: '0x657a901AFC4d85A28eEf0F6696E42ae2099219cd',
                  amount: '0x00000000000000008ac7230489e80000'
                },
                null // Additional deposit information or null if there isn't any
              ]
            }
            ```

        === "Killed"

            The referendum ended with a kill. The block at which the referendum was killed is returned.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            { killed: 1806494 } // The block at which the referendum was killed
            ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/referendum-info-for.js'
        ```

??? function "**trackQueue**(index) - returns the sorted list of referenda ready to be decided but not yet being decided on for a given Track. The referenda are sorted by Conviction-weighted approvals"

    === "Parameters"

        - `index` - the index of the Track to get the queue information for. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track

    === "Returns"

        The list of referenda queued for a given Track. This should return an empty array if the deciding count is less than the maximum number of referenda that can be decided on.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        [ 
          [ 
            5, // Referendum Index
            0  // Track Index
          ]
        ]
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/track-queue.js'
        ```

### Pallet Constants {: #constants }

The Referenda Pallet includes the following read-only functions to obtain pallet constants:

??? function "**maxQueued**() - returns the maximum size of the referendum queue for a single Track"

    === "Parameters"

        None.

    === "Returns"

        The maximum number of queued referenda for a single Track.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        100
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/max-queued.js'
        ```

??? function "**submissionDeposit**() - returns the minimum amount to be used as a deposit for a public referendum proposal"

    === "Parameters"

        None.

    === "Returns"

        The minimum amount required for the Submission Deposit.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        0x00000000000000008ac7230489e80000
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/submission-deposit.js'
        ```

??? function "**tracks**() - returns information concerning the different referendum Tracks"

    === "Parameters"

        None.

    === "Returns"

        Information on each Track. This includes [general](/learn/features/governance#general-parameters-by-track){target=_blank}, [period](/learn/features/governance#period-parameters-by-track){target=_blank}, and [Approval and Support](/learn/features/governance#support-and-approval-parameters-by-track){target=_blank} parameters.
        
        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        [
          [
            0, // Track Index
            {
              name: 'root',
              maxDeciding: 5,
              decisionDeposit: '0x000000000000152d02c7e14af6800000',
              preparePeriod: 7200,
              decisionPeriod: 100800,
              confirmPeriod: 7200,
              minEnactmentPeriod: 7200,
              minApproval: { 
                reciprocal: { factor: 999999999, xOffset: 999999999, yOffset: 0 } 
              },
              minSupport: {
                linearDecreasing: { length: 1000000000, floor: 5000000, ceil: 250000000 }
              }
            }
          ],
          [
            1,
            {
              name: 'whitelisted_caller',
              maxDeciding: 100,
              decisionDeposit: '0x000000000000021e19e0c9bab2400000',
              preparePeriod: 50,
              decisionPeriod: 100800,
              confirmPeriod: 50,
              minEnactmentPeriod: 150,
              minApproval: {
                reciprocal: { factor: 999999999, xOffset: 999999999, yOffset: 0 } 
              },
              minSupport: { 
                reciprocal: { factor: 60061, xOffset: 2994150, yOffset: -59882 } 
              }
            }
          ],
          [
            2,
            {
              name: 'general_admin',
              maxDeciding: 10,
              decisionDeposit: '0x000000000000001b1ae4d6e2ef500000',
              preparePeriod: 300,
              decisionPeriod: 100800,
              confirmPeriod: 7200,
              minEnactmentPeriod: 7200,
              minApproval: { 
                reciprocal: { factor: 999999999, xOffset: 999999999, yOffset: 0 } 
              },
              minSupport: { 
                reciprocal: { factor: 222222224, xOffset: 333333335, yOffset: -166666668 }
              }
            }
          ],
          [
            3,
            {
              name: 'referendum_canceller',
              maxDeciding: 20,
              decisionDeposit: '0x000000000000021e19e0c9bab2400000',
              preparePeriod: 300,
              decisionPeriod: 100800,
              confirmPeriod: 900,
              minEnactmentPeriod: 50,
              minApproval: { 
                reciprocal: { factor: 999999999, xOffset: 999999999, yOffset: 0 } 
              },
              minSupport: { 
                reciprocal: { factor: 787400, xOffset: 1572327, yOffset: -786164 }
              }
            }
          ],
          [
            4,
            {
              name: 'referendum_killer',
              maxDeciding: 100,
              decisionDeposit: '0x000000000000043c33c1937564800000',
              preparePeriod: 300,
              decisionPeriod: 100800,
              confirmPeriod: 900,
              minEnactmentPeriod: 50,
              minApproval: { 
                reciprocal: { factor: 999999999, xOffset: 999999999, yOffset: 0 }
              },
              minSupport: { 
                reciprocal: { factor: 869501, xOffset: 8620680, yOffset: -862069 }
              }
            }
          ]
        ]
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/tracks.js'
        ```

??? function "**undecidingTimeout**() - the number of blocks after submission that a referendum must begin being decided by. Once this passes, then anyone may cancel the referendum"

    === "Parameters"

        None.

    === "Returns"

        The number of blocks before a timeout occurs.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        151200
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/referenda/undeciding-timeout.js'
        ```
