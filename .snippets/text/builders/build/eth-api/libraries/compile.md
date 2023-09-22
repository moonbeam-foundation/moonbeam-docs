In this section, you'll create a script that uses the Solidity compiler to output the bytecode and interface (ABI) for the `Incrementer.sol` contract. To get started, you can create a `compile.js` file by running:

```bash
touch compile.js
```

Next, you will create the script for this file and complete the following steps:

1. Import the `fs` and `solc` packages
2. Using the `fs.readFileSync` function, you'll read and save the file contents of `Incrementer.sol` to `source`
3. Build the `input` object for the Solidity compiler by specifying the `language`, `sources`, and `settings` to be used
4. Using the `input` object, you can compile the contract using `solc.compile`
5. Extract the compiled contract file and export it to be used in the deployment script

```js
--8<-- 'code/builders/build/eth-api/libraries/web3-js/compile.js'
```