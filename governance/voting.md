---
title: Vote on a Proposal
description: How to vote on a proposal so that it is enacted or rejected on Moonbeam via governance features
---

# Proposals

![Governance Moonbeam Banner](/images/governance/governance-voting-banner.png)

## Introduction

Once a proposal reaches public referenda, token holders can vote on it using their own tokens. Two factors defined the weight a vote has: the number of tokens locked and lock duration (called conviction). This is to ensure that there is an economic buy-in to the result to prevent vote-selling. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced.

Referenda are simple, inclusive, and stake-based voting schemes. Each referendum has a proposal associated with it that suggests an action to take place. They have a fixed duration, after which votes are tallied, and the action is enacted if the vote is approved.

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

With the release of [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0), users of the network can now submit proposals for public referenda and vote on them. This guide outlines how to vote on a proposal that has reached a public referendum. You can find a guide on how to submit a proposal [here](/governance/proposals/).

More information related to [Governance](https://wiki.polkadot.network/docs/en/learn-governance) and [Participate in Democracy](https://wiki.polkadot.network/docs/en/maintain-guides-democracy) can be found in Polkadot's Wiki pages.

!!! note
    This guide was done with a customized version of Moonbeam with short Launch/Enactment periods for demonstration purposes only.

## Definitions

Some of the key parameters for this guide are the following:

 - **Voting period** — the time token holders have to vote for a referendum (duration of a referendum)
 - **Vote** — a tool used by token holders to either approve or reject a proposal. The weight a vote has is defined by two factors: the number of tokens locked, and lock duration (called conviction)
 - **Turnout** — the total number of voting tokens
 - **Electorate** — the total number of tokens issued in the network
 - **Maximum number of votes** — the maximum number of votes per account
 - **Enactment period** — the time between a proposal being approved and enacted (make law). It is also the minimum locking period when voting
 - **Lock period** — the time (after the proposal's enactment) that tokens of the winning voters are locked. Users can still use these tokens for staking or voting
 - **Delegation** — the act of transferring your voting power to another account for up to a certain conviction

Currently, for Moonbase Alpha:

|        Variable         |     |                                                         Value                                                         |
| :---------------------: | :-: | :-------------------------------------------------------------------------------------------------------------------: |
|       Vote Period       |     |  {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}} days)  |
|      Enact Period       |     | {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}} days) |
| Maximum Number of Votes |     |                                      {{ networks.moonbase.democracy.max_votes}}                                       |

## Roadmap of a Proposal

--8<-- 'text/governance/roadmap.md'

## Voting on a Referendum

This section goes over the process of voting on a referendum. The guide assumes that there is one already taking place, in this case, the one created in [this guide](/governance/proposals/).

To vote on a proposal in the network, you need to use the PolkadotJS Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do by following [this guide](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account). For this example, three accounts were imported and named with super original names: Alice, Bob, and Charley.

![Accounts in PolkadotJS](/images/governance/governance-proposal-1.png)

The proposal being voted on will set Bob's balance to `1500` via governance!

### How to Vote

Voting on Moonbeam is pretty straightforward. Everything related to governance lives under the "Democracy" tab, where (in the image) you can note that there is a `1`, indicating there is one democracy item pending (either proposals or referenda). Once there, you can view the details of the referendum you want to vote by clicking on the arrow next to the description. The number next to the action and description it is called the referendum index (in this case, it is 0). When ready, click on the "Vote" button.

![Vote Button](/images/governance/governance-vote-1.png)

Here, you need to provide the following information:

 1. Select the account with which you want to vote
 2. Enter the number of tokens that you want to vote with. These will be locked for the amount of time specified in the next step
 3. Set the vote conviction, which determines its weight (`vote_weight = tokens * conviction_multiplier`). The conviction multiplier is related to the number of enactment periods the tokens will be locked for. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced (tokens are still locked during the duration of the referendum)

   | Lock Periods |     | Conviction Multiplier |
   | :----------: | :-: | :-------------------: |
   |      0       |     |          0.1          |
   |      1       |     |           1           |
   |      2       |     |           2           |
   |      4       |     |           3           |
   |      8       |     |           4           |
   |      16      |     |           5           |
   |      32      |     |           6           |

 4. Click on "Vote Aye" to approve the proposal or "Vote Nay" to disapprove the proposal, and then sign the transaction

![Vote Submission](/images/governance/governance-vote-2.png)

!!! note
    The lockup periods shown in the previous image are not to be taken as reference. This guide was done with a customized version of Moonbeam with short Launch/Enactment periods for demonstration purposes only.

In this case, Alice has decided to "Vote Aye" on the proposal with a conviction of `6x`. On the other hand, Charley has decided to "Vote Nay" on the proposal but chose not to lock any tokens (his tokens are only locked during the duration of the referendum), so his conviction was `0.1x`. With such vote distributions, the partial results can be seen in the main "Democracy" tab.

![Vote Information](/images/governance/governance-vote-3.png)

From voting, there are some key takeaways:

 - Alice's weighted vote is 10800 units. That is, her 1800 locked tokens multiplied her conviction by x6
 - Charley's weighted vote is 80 units. That is, his 800 tokens with no locking period (only during referendum) made his conviction factor x0.1
 - Both the remaining voting period and time before the proposal is enacted (if passed) are shown on the screen
 - The overall turnout (in percentage) is just 0.21%. This is calculated as the total number of voting tokens (2600) divided by the total amount of tokens in the network (1.22M in this case)
 - Even though the turnout is quite low, the proposal is tentatively approved because of the super-majority approval. More information can be found in [this section](/governance/voting/#positive-turnout-bias)
 - It is important to write down the referendum index, as this is needed to unlock the tokens later when the locking period expires. Currently there is no way to retrieve the referendum index once it has been enacted

After the voting period has expired, the proposal will be visible under the "Dispatch" tab if approved. In here, you can also see the time remaining until the proposal is enacted.

![Proposal Enactment](/images/governance/governance-vote-4.png)

Remember that, for this example, the `setBalance` function was used to set Bob's balance to 1500 tokens. Once the enactment period has passed, you can go back to the "Accounts" tab to verify that the proposal was made law.

![Proposal Result](/images/governance/governance-vote-5.png)

### Delegate Voting

Token holders have the option to delegate their vote to another account whose opinion they trust. The account being delegated does not need to make any particular action. When they vote, the vote weight (that is, tokens times the conviction multiplier chose by the delegator) is added to its vote.

To delegate your vote, first, navigate to the "Extrinsics" menu under the "Developers" tab.

![Extrinsics Menu](/images/governance/governance-vote-6.png)

Here, you need to provide the following information:

 1. Select the account from which you want to delegate your vote
 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `delegate` extrinsic
 4. Select the account to which you want to delegate your vote
 5. Set the vote conviction, which determines its weight (`vote_weight = tokens * conviction_multiplier`). The conviction multiplier is related to the number of enactment periods the tokens will be locked for. Consequently, the longer you are willing to lock your tokens, the stronger your vote will be weighted. You also have the option of not locking tokens at all, but vote weight is drastically reduced
 6. Set the number of tokens you want to delegate to the account provided before
 7. Click the "Submit Transaction" button and sign the transaction

![Extrinsics Transaction for Delegation](/images/governance/governance-vote-7.png)

In this example, Alice delegated a total weight of 1000 (1000 tokens with an x1 conviction factor) to Charley.

!!! note
    Another way to delegate votes is under the "Accounts" tab. Click on the three dots of the account from which you want to delegate your vote and fill in the information as before.

Once the account you have delegated your vote to votes, the total vote weight delegated will be allocated to the option that the account selected. For this example, Charley has decided to vote in favor of a proposal that is in public referendum. He voted with a total weight of 800 (800 tokens with an x1 conviction factor). But because Alice delegated 1000 vote weight to him, "Aye" votes total 1800 units.

![Total Votes with Delegation](/images/governance/governance-vote-8.png)

To remove delegation, repeat the process described before, but select the `undelegate` extrinsic in step 3.

From vote delegation, there are some key takeaways:

 - If a token holder were to remove the vote delegation during a public referendum where the delegated votes were used, these would be removed from the tally
 - A token holder that delegated votes still has an economic buy-in. This means that if the option the delegator selected were to win, the tokens delegated are locked for the number of lock periods
 - The tokens delegated for voting are no longer part of the token holder's free balance. To read more about the types of balances, you can visit [this site](https://wiki.polkadot.network/docs/en/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)
 - A token holder that delegated tokens can't participate in public referendum. First, the token holder must undelegate his vote
 - A token holder that delegated tokens needs to manually unlock his locked tokens after the locking period has expired. For this, it is necessary to know the referendum index

### Unlocking Locked Tokens

When token holders vote, the tokens used are locked and cannot be transferred. You can verify if you have any locked tokens in the "Accounts" tab, expanding the address's account details to query. There, you will see different types of balances (you can read more information about each type [here](https://wiki.polkadot.network/docs/en/build-protocol-info#free-vs-reserved-vs-locked-vs-vesting-balance)). If you hover over the icon next to "democracy," an information panel will show telling you the current status of your lock. Different lock status includes:

 - Locked because of an ongoing referendum, meaning that you've used your tokens and have to wait until the referendum finishes, even if you've voted with a no-lock conviction factor
 - Locked because of the conviction multiplier selected, displaying the number of blocks and time left
 - Lock expired, meaning that you can now get your tokens back

![Account Lock Status](/images/governance/governance-vote-9.png)

Once the lock is expired, you can request your tokens back. To do so, navigate to the "Extrinsics" menu under the "Developers" tab.

![Extrinsics Menu](/images/governance/governance-vote-10.png)

Here, two different extrinsics need to be sent. First, you need to provide the following information:

 1. Select the account from which you want to recover your tokens
 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `removeVote` extrinsic. This step is necessary to unlock the tokens. This extrinsic can be used as well to remove your vote from a referendum
 4. Enter the referendum index. This is the number that appeared on the left-hand side in the "Democracy" tab. In this case, it is 0
 5. Click the "Submit Transaction" button and sign the transaction

![Remove Vote Extrinsics](/images/governance/governance-vote-11.png)

For the next extrinsic, you need to provide the following information:

 1. Select the account from which you want to recover your tokens
 2. Choose the pallet you want to interact with. In this case, it is the `democracy` pallet
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is `unlock` extrinsic
 4. Enter the target account that will receive the unlocked tokens. In this case, the tokens will be returned to Alice
 5. Click the "Submit Transaction" button and sign the transaction

![Unlock Extrinsics](/images/governance/governance-vote-12.png)

Once the transaction goes through, the locked tokens should be unlocked. To double-check, you can go back to the "Accounts" tab and see that, for this example, Alice has her full balance as "transferable."

![Check Balance](/images/governance/governance-vote-13.png)

## Positive Turnout Bias

Public referenda use a positive turnout bias metric, that is, a super-majority approval formula. The equation is the following:

![Positive Turnout Bias](/images/governance/governance-vote-bias.png)

Where:

 - **Approve** — number of "Aye" votes (includes the conviction multiplier)
 - **Against** — number of "Nay" votes (includes the conviction multiplier)
 - **Turnout** — the total number of voting tokens (without including the conviction multiplier)
 - **Electorate** — the total number of tokens issued in the network

In the previous example, these numbers were:

|  Variable  |     |         Value         |
| :--------: | :-: | :-------------------: |
|  Approve   |     |   10800 (1800 x 6)    |
|  Against   |     |    80 (800 x 0.1)     |
|  Turnout   |     |   2600 (1800 + 800)   |
| Electorate |     |         1.22M         |
| **Result** |     | 1.5 < 9.8 (Aye wins!) |

In short, a heavy super-majority of aye votes is required to approve a proposal at low turnouts, but as turnout increases, it becomes a simple majority.

## We Want to Hear From You

If you have any feedback regarding voting a proposal on Moonbase Alpha or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).
