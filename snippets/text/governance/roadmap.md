Before a proposal is enacted, it must go through various steps. The general flow of a proposal is the following (some simplifications were made):

 - Token holders must create a preimage of the proposal, which defines the action to be carried out. The submitter pays a fee-per-byte stored: the larger the preimage, the higher the fee. Once submitted, it returns a preimage hash
 - Token holders can submit the proposal using the preimage hash, locking tokens in the process. Once the submission transaction is accepted, the proposal is listed publicly
 - Once the proposal is listed, token holders can second the proposal (vouch for it) by locking the same amount of tokens the original proposal submitter locked
 - The most seconded proposal moves to public referendum
 - Once in referendum, token holders vote "Aye" or "Nay" on the proposal by locking tokens. Two factors account the vote weight: amount locked and locking period
 - If the proposal passes, it is enacted after a certain amount of time

![Proposal Roadmap](/images/governance/governance-proposal-roadmap.png)
