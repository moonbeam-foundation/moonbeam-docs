The interface includes the following functions:

- **name()** — read-only function that returns the name of the token
- **symbol()** — read-only function that returns the symbol of the token
- **decimals()** — read-only function that returns the decimals of the token
- **totalSupply()** — read-only function that returns the total number of tokens in existence
- **balanceOf**(*address* who) — read-only function that returns the balance of the specified address
- **allowance**(*address* owner, *address* spender) —  read-only function that checks and returns the amount of tokens that a spender is allowed to spend on behalf of the owner
- **transfer**(*address* to, *uint256* value) — transfers a given amount of tokens to a specified address and returns `true` if the transfer was successful
- **approve**(*address* spender, *uint256* value) — approves the provided address to spend a specified amount of tokens on behalf of `msg.sender`. Returns `true` if successful
- **transferFrom**(*address* from, *address* to, *uint256* value) — transfers tokens from one given address to another given address and returns `true` if successful

!!! note
    The ERC-20 standard does not specify the implications of multiple calls to `approve`. Changing an allowance with this function numerous times enables a possible attack vector. To avoid incorrect or unintended transaction ordering, you can first reduce the `spender` allowance to `0` and then set the desired allowance afterward. For more details on the attack vector, you can check out the [ERC-20 API: An Attack Vector on Approve/TransferFrom Methods](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#/){target=\_blank} overview.

The interface also includes the following required events:

- **Transfer**(*address indexed* from, *address indexed* to, *uint256* value) - emitted when a transfer has been performed
- **Approval**(*address indexed* owner, *address indexed* spender, *uint256* value) - emitted when an approval has been registered