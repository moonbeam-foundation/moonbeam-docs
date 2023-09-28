The contract you'll be compiling and deploying in the next couple of sections is a simple incrementer contract, arbitrarily named `Incrementer.sol`. You can get started by creating a file for the contract:

```bash
touch Incrementer.sol
```

Next, you can add the Solidity code to the file:

```solidity
--8<-- 'code/builders/build/eth-api/libraries/web3-js/Incrementer.sol'
```

The `constructor` function, which runs when the contract is deployed, sets the initial value of the number variable stored on-chain (the default is `0`). The `increment` function adds the `_value` provided to the current number, but a transaction needs to be sent, which modifies the stored data. Lastly, the `reset` function resets the stored value to zero.

!!! note
    This contract is a simple example for illustration purposes only and does not handle values wrapping around.
