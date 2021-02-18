---
title: Vote on a Proposal
description: How to vote on a proposal so that it is enacted or rejected on Moonbeam via governance features
---

# Proposals

![Governance Moonbeam Banner](/images/governance/governance-voting-banner.png)

## Introduction

Once a proposal reaches public referenda, token holders can vote on it using their own tokens. Two factors are defined by the weight a vote has: the number of tokens locked and lock duration (called conviction). This is to ensure that there is an economic buy-in to the result to prevent vote-selling. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced.

Referenda are simple, inclusive, and stake-based voting schemes. Each referendum has a proposal associated with it that suggests an action to take place. They have a fixed duration, after which votes are tallied, and the action is enacted if the vote is approved.

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum address! 

With the release of [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0), users of the network can now submit proposals for public referenda and vote on them. This guide outlines how to vote on a proposal that has reached a public referendum. You can find a guide on how to submit a proposal [here](/governance/proposals/).

More information related [Governance]() and [Participate in Democracy](https://wiki.polkadot.network/docs/en/maintain-guides-democracy) can be found in Polkadot's Wiki pages.

!!! note
    This guide was done with a customized version of Moonbeam with short Launch/Enactment periods for demonstration purposes only.

## Definitions

Some of the key parameters for this guide are the following:

 - **Voting period** — the time token holders have to vote for a referendum (duration of a referendum)
 - **Vote** — a tool used by token holders to either approve or reject a proposal. The weight a vote has is defined by two factors: the number of tokens locked, and lock duration (called conviction)
 - **Turnout**  — the total number of voting tokens
 - **Electorate**  — the total number of tokens issued in the network
 - **Maximum number of votes** — the maximum number of votes per account
 - **Enactment period** — the time between a proposal being approved and enacted (make law). It is also the minimum locking period when voting
 - **Lock period** — the time (after the proposal's enactment) that tokens of the winning voters are locked. Users can still use these tokens for staking or voting
 - **Delegation** — the act of transferring your voting power to another account for up to a certain conviction

Currently, for Moonbase Alpha:

|      Variable     |   |                 Value                           |
|:-----------------:|:-:|:-----------------------------------------------:|
|    Vote Period  |   | {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}} days) |
|    Enact Period  |   | {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}} days) |
|  Maximum Number of Votes  |   |{{ networks.moonbase.democracy.max_votes}}  |

## Roadmap of a Proposal

--8<-- 'governance/roadmap.md'

## Voting on a Referendum

This section goes over the process of voting on a referendum. The guide assumes that there is one already taking place, in this case, the one created in [this guide](/governance/proposals/).

To vote on a proposal in the network, you need to use the PolkadotJS Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do by following [this guide](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account). For this example, three accounts were imported and named with super original names: Alice, Bob, and Charley.

![Accounts in PolkadotJS](/images/governance/governance-proposal-1.png)

The proposal being voted on will set Bob's balance to `1500` via governance!

### How to Vote

Voting on Moonbeam is pretty straightforward. Everything related to governance lives under the "Democracy" tab, where (in the image) you can note that there is a `1`, indicating there is one referendum taking place. Once there, click on the "Vote" button.

![Vote Button](/images/governance/governance-vote-1.png)

Here, you need to provide the following information:

 1. Select the account with which you want to vote
 2. Enter the number of tokens that you want to vote with. These will be locked for the amount of time specified in the next step
 3. Set the vote conviction, which determines its weight (`vote_weight = tokens * conviction_multiplier`). The conviction multiplier is related to the number of enactment periods the tokens will be locked for. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced
    
    |  Lock Periods |   | Conviction Multiplier |
    |:-------------:|:-:|:---------------------:|
    | 0             |   | 0.1                   |
    | 1             |   | 1                     |
    | 2             |   | 2                     |
    | 4             |   | 3                     |
    | 8             |   | 4                     |
    | 16            |   | 5                     |
    | 32            |   | 6                     |

 4. Click the "Vote Aye" to approve the proposal or the "Vote Nay" not to approve the proposal, and then sign the transaction

![Vote Submission](/images/governance/governance-vote-2.png)

!!! note
    The lockup periods shown in the previous image are not to be taken as reference. This guide was done with a customized version of Moonbeam with short Launch/Enactment periods for demonstration purposes only.

In this case, Alice has decided to "Vote Aye" on the proposal with a conviction of `6x`. For this example, Charley has decided to "Vote Nay" on the proposal but chose not to lock any tokens, so his conviction was `0.1x`. With such vote distributions, the partial results can be seen in the main "Democracy" tab.

![Vote Information](/images/governance/governance-vote-3.png)

From the previous image, there are some key takeaways:

 - Alice's weighted vote is 10800 units. That is, her 1800 locked tokens multiplied her conviction by x6
 - Charley's weighted vote is 80 units. That is, his 800 tokens with no locking period made his conviction factor x0.1
 - Both the remaining voting period and time before the proposal is enacted (if passed) are shown on the screen
 - The overall turnout (in percentage) is just 0.21%. This is calculated as the total number of voting tokens (2600) divided by the total amount of tokens in the network (1.22M in this case)
 - Even though the turnout is quite low, the proposal is tentatively approved because of the super-majority approval. This will be explained in the following section

After the voting period has expired, the proposal will be visible under the "Dispatch" tab if approved. In here, you can also see the time remaining until the proposal is enacted.

![Proposal Enactment](/images/governance/governance-vote-4.png)

Remember that, for this example, the `setBalance` function was used to set Bob's balance to 1500 tokens. Once the enactment period has passed, you can go back to the "Accounts" tab to verify that the proposal was made law.

![Proposal Enactment](/images/governance/governance-vote-5.png)

### Delegate Voting

_Coming soon_

## Positive Turnout Bias

Public referenda use a positive turnout bias metric, that is, a super-majority approval formula. The equation is the following: 

![Positive Turnout Bias](/images/governance/governance-vote-bias.png)

Where: 

 - **Approve** — number of "Aye" votes (incudes the conviction multiplier)
 - **Against** — number of "Nay" votes (incudes the conviction multiplier)
 - **Turnout** — the total number of voting tokens (without including the conviction multiplier)
 - **Electorate** — the total number of tokens issued in the network

In the previous example, these numbers were:

|  Variable     |   | Value                 |
|:-------------:|:-:|:---------------------:|
| Approve       |   | 10800 (1800 x 6)      |
| Against       |   | 80 (800 x 0.1)        |
| Turnout       |   | 2600 (1800 + 800)     |
| Electorate    |   | 1.22M                 |
| **Result**    |   | 1.5 < 9.8 (Aye wins!) |

In short, a heavy super-majority of aye votes is required to approve a proposal at low turnouts, but as turnout increases, it becomes a simple majority.

## We Want to Hear From You

If you have any feedback regarding voting a proposal on Moonbase Alpha or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).
