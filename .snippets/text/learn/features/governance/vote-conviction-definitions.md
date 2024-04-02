 - **Voting** — a tool used by token holders to either approve ("Aye") or reject ("Nay") a proposal. The weight a vote has is defined by two factors: the number of tokens locked and lock duration (called Conviction)
    - **Conviction** — the time that token holders voluntarily lock their tokens when voting; the longer they are locked, the more weight their vote has
    - **Lock balance** — the number of tokens that a user commits to a vote (note, this is not the same as a user's total account balance)

    Moonbeam uses the concept of voluntary locking, which allows token holders to increase their voting power by locking tokens for a longer period of time. Specifying no Lock Period means a user's vote is valued at 10% of their lock balance. Specifying a greater Conviction increases voting power. For each increase in Conviction (vote multiplier), the Lock Periods double
