---
title: Approve & Swap with the Batch Precompile
description: Learn how to use the Batch Precompile on Moonbeam to batch an approval and swap into a single call, so you can approve the exact amount of tokens for the swap.
---

# Use the Batch Precompile to Approve and Swap Tokens in a Single Transaction

_by Erin Shaben_

## Introduction {: #introduction }

Token approvals are critical for interacting with smart contracts securely, preventing smart contracts without permission from accessing a user's tokens. When a smart contract is given approval to access a user's tokens, the amount of tokens it has access to is often an unlimited amount, depending on the DApp.

One of the reasons why many DApps use an unlimited amount is so that users don't need to continue to sign approval transactions every time they want to move their tokens. This is in addition to the second transaction required to actually swap the tokens. For networks like Ethereum, this can be expensive. However, if the approved smart contract has a vulnerability, it could be exploited and the users' tokens could be transferred at any time without requiring further approval. In addition, if a user no longer wants the DApp's contract to have access to their tokens, they have to revoke the token approval, which requires another transaction to be sent.

As a DApp developer on Moonbeam, this process can be easily avoided, providing your users with more control over their assets. This can be done using the [batch precompile](/builders/ethereum/precompiles/ux/batch/){target=\_blank} to batch an approval and swap into a single transaction, instead of the typical two transaction process. This allows for the approval amount to be the exact swap amount instead of having unlimited access to your users' tokens.

In this tutorial, we'll dive into the process of batching an approval and swap into one transaction using the `batchAll` function of the batch precompile contract. We'll create and deploy an ERC-20 contract and a simple DEX contract for the swap on the [Moonbase Alpha TestNet](/builders/get-started/networks/moonbase/){target=\_blank} using [Hardhat](/builders/ethereum/dev-env/hardhat/){target=\_blank} and [Ethers](/builders/ethereum/libraries/ethersjs/){target=\_blank}.

## Checking Prerequisites {: #checking-prerequisites }

For this tutorial, you'll need the following:

- An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- An empty Hardhat project that is configured for the Moonbase Alpha TestNet. For step-by-step instructions, please refer to the [Creating a Hardhat Project](/builders/ethereum/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank} and the [Hardhat Configuration File](/builders/ethereum/dev-env/hardhat/#hardhat-configuration-file){target=\_blank} sections of our Hardhat documentation page
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

### Install Dependencies {: #install-dependencies }

Once you have your [Hardhat project](/builders/ethereum/dev-env/hardhat/){target=\_blank}, you can install the [Ethers plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=\_blank}. This provides a convenient way to use the [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} library to interact with the network.

You can also install the [OpenZeppelin contracts library](https://docs.openzeppelin.com/contracts){target=\_blank}, as we'll be importing the `ERC20.sol` contract and `IERC20.sol` interface in our contracts.

To install the necessary dependencies, run the following command:

```bash
npm install @nomicfoundation/hardhat-ethers ethers@6 @openzeppelin/contracts
```

## Contract Setup {: #contracts }

The following are the contracts that we'll be working with today:

- `Batch.sol` - one of the precompile contracts on Moonbeam that allows you to combine multiple EVM calls into one. For more information on the available methods, please refer to the [Batch Solidity Interface](/builders/ethereum/precompiles/ux/batch/#the-batch-interface){target=\_blank} documentation

- `DemoToken.sol` - an ERC-20 contract for the `DemoToken` (DTOK) token, which on deployment mints an initial supply and assigns them to the contract owner. It's a standard ERC-20 token, you can review the [IERC20 interface](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20){target=\_blank} for more information on the available methods

- `SimpleDex.sol` - a simple example of a DEX that on deployment deploys the `DemoToken` contract, which mints 1000 DTOKs, and allows you to swap DEV token for DTOKs and vice versa. **This contract is for demo purposes only**. The `SimpleDex` contract contains the following methods:
    - **token**() - a read-only method that returns the address of the `DemoToken` contract
    - **swapDevForDemoToken**() - a payable function that accepts DEV tokens in exchange for DTOK tokens. The function checks to make sure there are enough DTOK tokens held in the contract before making the transfer. After the transfer is made, a `Bought` event is emitted
    - **swapDemoTokenForDev**(*uint256* amount) - accepts the amount of DTOKs to swap for DEV tokens. The function checks to make sure the caller of the function has approved the contract to transfer their DTOKs before swapping the DTOKs back to DEV. After the transfer is made, a `Sold` event is emitted

If you don't already have a `contracts` directory in your Hardhat project, you can create a new directory:

```bash
mkdir contracts && cd contracts
```

Then, you can create a single file that we'll use to store the code for the `DemoToken` and `SimpleDex` contracts and another file for the batch precompile:

```bash
touch SimpleDex.sol Batch.sol
```

In the `SimpleDex.sol` file, you can paste in the following code for the `DemoToken` and `SimpleDex` contracts:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DemoToken", "DTOK") {
        // Assign 500 DTOK tokens to the SimpleDex contract
        _mint(msg.sender, initialSupply / 2);
        // Assign 500 DTOK tokens to the EOA that deployed the SimpleDex contract
        _mint(tx.origin, initialSupply / 2);
    }
}

contract SimpleDex {
    IERC20 public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    // Make constructor payable so that DEV liquidity exists for the contract
    constructor() payable {
        // Mint 1000 DTOK tokens. Half will be assigned to the SimpleDex contract 
        // and the other half will be assigned to the EOA that deployed the
        // SimpleDex contract
        token = new DemoToken(1000000000000000000000);
    }

    // Function to swap DEV for DTOK tokens
    function swapDevForDemoToken() payable public {
        // Verify the contract has enough tokens for the requested amount
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some DEV");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        // If enough, swap the DEV to DTOKs
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    // Function to swap DTOK for DEV tokens
    function swapDemoTokenForDev(uint256 amount) public {
        // Make sure the requested amount is greater than 0 and the caller
        // has approved the requested amount of tokens to be transferred
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        // Transfer the DTOKs to the contract
        token.transferFrom(msg.sender, address(this), amount);
        // Transfer the DEV tokens back to the caller
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }
}
```

In the `Batch.sol` file, you can paste in the Batch Precompile contract.

??? code "Batch.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/ux/batch/Batch.sol'
    ```


### Compile & Deploy Contracts {: #compile-deploy-contracts }

To compile the contracts, we'll go ahead and run the following Hardhat command:

```bash
npx hardhat compile
```

--8<-- 'code/tutorials/eth-api/batch-approve-swap/terminal/compile.md'

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to the `.gitignore` file.

Next, we can deploy the `SimpleDex` contract, which upon deployment will automatically deploy the `DemoToken` contract and mint 1000 DTOKs and assign half of them to the `SimpleDex` contract and the other half to the address that you're initiating the deployment from.

We'll also add some initial liquidity to the contract by passing in a `value` when calling `deploy`. Since the value needs to be in Wei, we can use `ethers.parseEther` to pass in a value such as `"0.5"` DEV and it will convert the value to Wei for us.

Before deploying the contract, we'll need to create the deployment script. We'll create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```bash
mkdir scripts && touch scripts/deploy.js
```

In the `deploy.js` script, you can paste in the following code, which will deploy the `SimpleDex` contract and print the address of the contract to the terminal upon successful deployment:

```js
async function main() {
  // Liquidity to add in DEV (i.e., '.5') to be converted to Wei
  const value = ethers.parseEther('INSERT_AMOUNT_OF_DEV');

  // Deploy the SimpleDex contract, which will also automatically deploy
  // the DemoToken contract and add liquidity to the contract
  const SimpleDex = await ethers.getContractFactory('SimpleDex',);
  const simpleDex = await SimpleDex.deploy({ value })
  
  // Wait for the deployment transaction to be included in a block
  await simpleDex.waitForDeployment();

   // Get and print the contract address
  const myContractDeployedAddress = await simpleDex.getAddress();
  console.log(`SimpleDex deployed to ${myContractDeployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Now we can deploy the `SimpleDex` contract using the `run` command and specifying `moonbase` as the network:

```bash
npx hardhat run --network moonbase scripts/deploy.js
```

!!! note
    If you want to run the script in a standalone fashion using `node <script>`, you'll need to require the Hardhat Runtime Environment explicitly using `const hre = require('hardhat');` in the `deploy.js` file.

--8<-- 'code/tutorials/eth-api/batch-approve-swap/terminal/deploy.md'

After a few seconds, the contract will be deployed, and you should see the address in the terminal. We'll need to use the address in the following sections to interact with the contract, so make sure you save it.

## Swap Tokens {: #swapping-tokens }

With the contract deployed, now we can create a script that will enable us to get started by swapping DEV tokens for DTOK tokens. Once we have the DTOKs, we can get into the approval and swap. We'll take a quick look at how the approval and swap work normally before diving into using the batch precompile to batch these transactions.

For simplicity, we'll create a single script to handle all of the logic needed to swap DEV to DTOKs and back, called `swap.js`. We'll add this file to the `scripts` directory:

```bash
touch scripts/swap.js
```

### Create Contract Instances {: #create-contract-instances }

We'll need to create contract instances for each of our contracts so that we can access each contract's functions. For this, we're going to use the `getContractAt` helper function of the Hardhat plugin.

For this step, we're going to need the contract address of the `SimpleDex` contract. Then we'll be able to use the `SimpleDex` contract instance to retrieve the `DemoToken` contract address through the `token` function.

We'll also need to add a contract instance for the batch precompile, which is located at `{{ networks.moonbase.precompiles.batch }}`.

You can add the following code to the `swap.js` file:

```js
const simpleDexAddress = 'INSERT_ADDRESS_OF_DEX';

async function main() {
  // Create instance of SimpleDex.sol
  const simpleDex = await ethers.getContractAt(
    'SimpleDex',
    simpleDexAddress
  );

  // Create instance of DemoToken.sol
  const demoTokenAddress = await simpleDex.token();
  const demoToken = await ethers.getContractAt(
    'DemoToken',
    demoTokenAddress
  );

  // Create instance of Batch.sol
  const batchAddress = '{{ networks.moonbase.precompiles.batch }}';
  const batch = await ethers.getContractAt('Batch', batchAddress);
}
main();
```

### Add Check Balances Helper Function {: #add-function-to-check-balances }

Next, we're going to create a helper function that will be used to check the balance of DTOK tokens the DEX and the signer account has. This will be particularly useful to see balance changes after the swaps are complete.

Since the `DemoToken` contract has an ERC-20 interface, you can check the balance of DTOKs an account has using the `balanceOf` function. So, we'll call the `balanceOf` function, passing in the address of the signer and the DEX, and then print the formatted results in DTOKs to the terminal:

```js
async function checkBalances(demoToken) {
  // Get the signer
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const signerAddress = signer.address;

  // Get the balance of the DEX and print it
  const dexBalance = ethers.formatEther(
    await demoToken.balanceOf(simpleDexAddress)
  );
  console.log(`Dex ${simpleDexAddress} has a balance of: ${dexBalance} DTOKs`);

  // Get the balance of the signer and print it
  const signerBalance = ethers.formatEther(
    await demoToken.balanceOf(signer)
  );
  console.log(
    `Account ${signerAddress} has a balance of: ${signerBalance} DTOKs`
  );
}
```

### Approve & Swap Tokens for DEV using the Batch Precompile {: #add-logic-to-swap-dtoks }

At this point, you should already have some DTOKs in your signing account, and the `SimpleDex` contract should have some DEV liquidity. If not, you can use the `simpleDex.swapDevForDemoToken` function to acquire some DTOKs and add liquidity to the DEX.

Now, we can approve the DEX to spend some DTOK tokens on our behalf so that we can swap the DTOKs for DEVs. On Ethereum, for example, we would need to send two transactions to be able to swap the DTOKs back to DEVs: an approval and a transfer. However, on Moonbeam, thanks to the batch precompile contract, you can batch these two transactions into a single one. This allows us to set the approval amount for the exact amount of the swap.

So instead of calling `demoToken.approve(spender, amount)` and then `simpleDex.swapDemoTokenForDev(amount)`, we'll get the encoded call data for each of these transactions and pass them into the batch precompile's `batchAll` function. To get the encoded call data, we'll use Ether's `interface.encodeFunctionData` function and pass in the necessary parameters. For example, we'll swap .2 DTOK for .2 DEV. In this case, for the approval, we can pass in the DEX address as the `spender` and set the `amount` to .2 DTOK. We'll also set the `amount` to swap as .2 DTOK. Again, we can use the `ethers.parseEther` function to convert the amount in DTOK to Wei for us.

Once we have the encoded call data, we can use it to call the `batchAll` function of the batch precompile. This function performs multiple calls atomically, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert. The following parameters are required by the `batchAll` function:

- ***address[]* to** - an array of addresses to direct subtransactions to, where each entry is a subtransaction
- ***uint256[]* value** - an array of native currency values to send in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. If this array is shorter than the *to* array, all the following subtransactions will default to a value of 0
- ***bytes[]* callData** - an array of call data to include in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. If this array is shorter than the *to* array, all of the following subtransactions will include no call data
- ***uint64[]* gasLimit** - an array of gas limits in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. Values of 0 are interpreted as unlimited and will have all remaining gas of the batch transaction forwarded. If this array is shorter than the *to* array, all of the following subtransactions will have all remaining gas forwarded

So, the first index of each array will correspond to the approval and the second will correspond to the swap.

After the swap, we'll check the balances using the `checkBalances` function to make sure the balances have changed as expected.

We'll update the `main` function to include the following logic:

```js
async function main() {
  // ...

  // Parse the value to swap to Wei
  const amountDtok = ethers.parseEther('INSERT_AMOUNT_OF_DTOK_TO_SWAP');

  // Get the encoded call data for the approval and swap
  const approvalCallData = demoToken.interface.encodeFunctionData('approve', [
    simpleDexAddress,
    amountDtok,
  ]);
  const swapCallData = simpleDex.interface.encodeFunctionData(
    'swapDemoTokenForDev',
    [amountDtok]
  );

  // Assemble and send the batch transaction
  const batchAll = await batch.batchAll(
    [demoTokenAddress, simpleDexAddress], // to address
    [], // value of the native token to send 
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap DTOK tokens for DEV tokens: ${batchAll.hash}`);

  // Check balances after the swap
  await checkBalances(demoToken);
}
```

So, if you set the amount to swap to be .2 DTOK, the DEX balance will increase by .2 DTOK, and the signing account's balance will decrease by .2 DTOK. The transaction hash for the swap will also be printed to the terminal, so you can use [Moonscan](https://moonbase.moonscan.io){target=\_blank} to view more information on the transaction.

??? code "View the complete script"

    ```js
    --8<-- 'code/tutorials/eth-api/batch-approve-swap/swap.js'
    ```

To run the script, you can use the following command:

```bash
npx hardhat run --network moonbase scripts/swap.js
```

In the terminal, you should see the following items:

- The transaction hash for the batch approval and swap
- The DEX's DTOK balance after the batch approval and swap
- Your account's DTOK balance after the batch approval and swap

--8<-- 'code/tutorials/eth-api/batch-approve-swap/terminal/swap.md'

And that's it! You've successfully used the batch precompile contract to batch an approval and swap into a single transaction, allowing for the approval amount to be the exact swap amount.

## Uniswap V2 Implementation {: #uniswap-v2-implementation }

If we had a Uniswap V2-style DEX, the typical process for a swap would involve the router, which provides methods to safely swap assets, including the `swapExactTokensForETH` function. This function can be compared to the `swapDemoTokenForDev` function of the SimpleDex contract in the example above, where it swaps tokens in exchange for the native asset.

Before using the `swapExactTokensForETH` function, we would first need to approve the router as the spender and specify the approved amount to spend. Then, we could use the swap function once the router has been authorized to move our assets.

Like our previous example, this two-transaction process can be modified to batch the approval and the `swapExactTokensForETH` function into a single transaction using the batch precompile.

This example will be based off the [Uniswap V2 deployment on Moonbase Alpha](https://github.com/papermoonio/moonbeam-uniswap){target=\_blank}. We'll approve the router to spend ERTH tokens and then swap ERTH for DEV tokens. Before diving into this example, make sure you swap some DEV for ERTH tokens on the [Moonbeam-swap DApp](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}, so that you have some ERTH to approve and swap back to DEV.

Again, we'll use the `batchAll` function of the batch precompile. So, we'll need to get the encoded call data for the approval and the swap. To get the encoded call data, we'll use Ether's `interface.encodeFunctionData` function and pass in the necessary parameters.

For the `approve(spender, amount)` function, we'll need to pass in the Uniswap V2 router contract as the `spender`, as well as the amount of ERTH tokens approved to spend for the `amount`.

For the `swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline)` function, we'll need to specify the amount of tokens to send, the minimum amount of output tokens that must be received so the transaction won't revert, the token addresses for the swap, the recipient of the native asset, and the deadline after which the transaction will revert. To swap ERTH to DEV, the path will be ERTH to WETH, so the path array will need to include the ERTH token address and the WETH token address: `[0x08B40414525687731C23F430CEBb424b332b3d35, 0xD909178CC99d318e4D46e7E66a972955859670E1]`.

In addition to the ERTH and WETH addresses, to create a contract instance of the router contract, you'll also need the [router address](https://github.com/papermoonio/moonbeam-uniswap/blob/f494f9a7a07bd3c5b94ac46484c9c7e6c781203f/uniswap-contracts-moonbeam/address.json#L14){target=\_blank}, which is `0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4`.

The code will resemble the following:

```js
// Define contract addresses
const erthTokenAddress = '0x08B40414525687731C23F430CEBb424b332b3d35';
const routerAddress = '0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4';
const wethTokenAddress = '0xD909178CC99d318e4D46e7E66a972955859670E1';

async function main() {
  // Create contract instances for the ERTH token, the Uniswap V2 router contract,
  // and the batch precompile
  // ...

  // Access the interface of the ERTH contract instance to get the encoded 
  // call data for the approval
  const amountErth = ethers.parseEther('INSERT_AMOUNT_OF_ERTH_TO_SWAP');
  const approvalCallData = earth.interface.encodeFunctionData('approve', [
    routerAddress,
    amountErth,
  ]);

  // Access the interface of the Uniswap V2 router contract instance to get
  // the encoded call data for the swap
  const swapCallData = router.interface.encodeFunctionData(
    'swapExactTokensForETH',
    [
      amountErth, // amountIn
      'INSERT_AMOUNT_OUT_MIN', // amountOutMin
     [
      erthTokenAddress, // ERTH token address
      wethTokenAddress // WETH token address
      ], // path 
     'INSERT_YOUR_ADDRESS', // to
     'INSERT_DEADLINE' // deadline
    ]
  );

  // Assemble and send the batch transaction
  const batchAll = await batch.batchAll(
    [erthTokenAddress, routerAddress], // to address
    [], // value of the native token to send 
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap ERTH tokens for DEV tokens: ${batchAll.hash}`);
}
main();
```

!!! note
    If you need the ABI to create a contract instance for any of the contracts in this example, all of the contracts are verified on [Moonscan](https://moonbase.moonscan.io){target=\_blank}. So, you can search for the contract addresses on Moonscan and head to the **Contract** tab to get the **Contract ABI**.

This will result in the approval and swap being batched into a single transaction and the transaction hash will be printed to the console. You can now adapt and apply this logic to your Uniswap V2-style application!

--8<-- 'text/_disclaimers/educational-tutorial.md'
--8<-- 'text/_disclaimers/third-party-content.md'
