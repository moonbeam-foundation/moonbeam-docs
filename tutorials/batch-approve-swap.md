---
title: Approve & Swap with the Batch Precompile
description: Learn how to use the batch precompile on Moonbeam to batch an approval and swap into a single call, so you can approve the exact amount of tokens for the swap.
---

# Use the Batch Precompile to Approve and Swap Tokens

![Banner Image](/images/tutorials/batch-approve-swap/batch-approve-swap-banner.png)

_December 21, 2022 | by Erin Shaben_

## Introduction {: #introduction } 

Token approvals are critical for interacting with smart contracts securely, preventing smart contracts without permission from accessing a user's tokens. When a smart contract is given approval to access a user's tokens, the amount of tokens it has access to is often an unlimited amount, depending on the DApp.

One of the reasons why many DApps use an unlimited amount is so that users don't need to continue to sign approval transactions every time they want to move their tokens. However, for users, this comes with the risk of the DApp transferring their tokens at any time, without requiring further approval. In addition, if a user no longer wants the DApp to have access to their tokens, they have to revoke the token approval.

As a DApp developer on Moonbeam, this process can be easily avoided, providing your users with more control over their assets. This can be done using the [batch precompile](/builders/pallets-precompiles/precompiles/batch){target=_blank} to batch an approval and swap into a single transaction, which allows for the approval amount to be the exact swap amount instead of having unlimited access to your users' tokens. 

In this tutorial, we'll dive into the process of batching an approval and swap into one transaction using the `batchAll` function of the batch precompile contract. We'll create and deploy an ERC-20 contract and a simple DEX contract for the swap on the Moonbase Alpha TestNet using [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank} and [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank}. 

## Checking Prerequisites {: #checking-prerequisites }

For this tutorial, you'll need the following:

- An account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
- An empty Hardhat project that is configured for the Moonbase Alpha TestNet. For step-by-step instructions, please refer to the [Creating a Hardhat Project](https://docs.moonbeam.network/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank} and the [Hardhat Configuration File](https://docs.moonbeam.network/builders/build/eth-api/dev-env/hardhat/#hardhat-configuration-file){target=_blank} sections of our Hardhat documentation page
- 
--8<-- 'text/common/endpoint-examples.md'

### Install Dependencies {: #install-dependencies }

Once you have your Hardhat project, you can install the [Ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}. This provides a convenient way to use the [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank} library to interact with the network.

You can also install the [OpenZeppelin contracts library](https://docs.openzeppelin.com/contracts/){target=_blank}, as we'll be importing the `ERC20.sol` contract and `IERC20.sol` interface in our contracts.

To install the necessary dependencies, run the following command:

```
npm install @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
```

## Contract Setup {: #contracts }

The following are the contracts that we'll be working with today:

- `Batch.sol` - one of the precompile contracts on Moonbeam that allows you to combine multiple EVM calls into one. For more information on the available methods, please refer to [The Batch Solidity Interface](/builders/pallets-precompiles/precompiles/batch/#the-batch-interface){target=_blank} documentation

- `DemoToken.sol` - an ERC-20 contract for the `DemoToken` (DTOK) token, which on deployment mints an initial supply and assigns them to the contract owner. It's a standard ERC-20 token, you can review the [IERC20 interface](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20){target=_blank} for more information on the available methods

- `SimpleDex.sol` - a simple example of a DEX that on deployment deploys the `DemoToken` contract, which mints 1000 DTOKs, and allows you to swap DEV token for DTOKs and vice versa. The `SimpleDex` contract contains the following methods:
    - **token**() - a read-only method that returns the address of the `DemoToken` contract
    - **swapDevForDemoToken**() - a payable function that accepts DEV tokens in exchange for DTOK tokens. The function checks to make sure there are enough DTOK tokens held in the contract before making the transfer. After the transfer is made, a `Bought` event is emitted
    - **swapDemoTokenForDev**(*uint256* amount) - accepts the amount of DTOKs to swap for DEV tokens. The function checks to make sure the caller of the function has approved the contract to transfer their DTOKs before swapping the DTOKs back to DEV. After the transfer is made, a `Sold` event is emitted

If you don't already have a `contracts` directory in your Hardhat project, you can create a new directory:

```
mkdir contracts && cd contracts
```

Then, you can create a single file that we'll use to store the code for the `DemoToken` and `SimpleDex` contract:

```
touch SimpleDex.sol
```

In the `SimpleDex.sol` file, you can paste in the following code for the `DemoToken` and `SimpleDex` contracts:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DemoToken", "DTOK") {
        _mint(msg.sender, initialSupply);
    }
}

contract SimpleDex {
    IERC20 public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor() {
        // Mint 1000 DTOK tokens
        token = new DemoToken(1000000000000000000000);
    }

    function swapDevForDemoToken() payable public {
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some DEV");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function swapDemoTokenForDev(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }
}
```

### Compile & Deploy Contracts {: #compile-deploy-contracts }

To compile the contracts, we'll go ahead and run the following Hardhat command:

```
npx hardhat compile
```

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to the `.gitignore` file.

Next, we can deploy the `SimpleDex` contract, which upon deployment will automatically deploy the `DemoToken` contract and mint 1000 DTOKs and assign them to the `SimpleDex` contract. Before you can deploy the contract, we'll need to create the deployment script. We'll create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```
mkdir scripts && touch scripts/deploy.js
```

In the `deploy.js` script, you can paste in the following code, which will deploy the `SimpleDex` contract and print the address of the contract to the terminal upon successful deployment:

```js
async function main() {
  const SimpleDex = await ethers.getContractFactory("SimpleDex",);
  const simpleDex = await SimpleDex.deploy()
  await simpleDex.deployed();

  console.log(`SimpleDex deployed to ${simpleDex.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Now we can deploy the `SimpleDex` contract using the `run` command and specifying `moonbase` as the network:

```
npx hardhat run --network moonbase scripts/deploy.js
```

!!! note
    If you want to run the script in a standalone fashion using `node <script>`, you'll need to require the Hardhat Runtime Environment explicitly using `const hre = require("hardhat");` in the `deploy.js` file.

After a few seconds, the contract will be deployed, and you should see the address in the terminal. We'll need to use the address in the following sections to interact with the contract, so make sure you save it.

## Swap Tokens {: #swapping-tokens }

With the contract deployed, now we can create a script that will enable us to get started by swapping DEV tokens for DTOK tokens. Once we have the DTOKs, we can get into the approval and swap. We'll take a quick look at how the approval and swap work normally before diving into using the batch precompile to batch these transactions. 

For simplicity, we'll create a single script to handle all of the logic needed to swap DEV to DTOKs and back, called `swap.js`. We'll add this file to the `scripts` directory:

```
touch swap.js
```

### Create Contract Instances {: #create-contract-instances }

We'll need to create contract instances for each of our contracts so that we can access each contract's functions. For this, we're going to use the `getContractAt()` helper function of the Hardhat plugin.

For this step, we're going to need the contract address of the `SimpleDex` contract. Then we'll be able to use the `SimpleDex` contract instance to retrieve the `DemoToken` contract address through the `token()` function.

We'll also need to add a contract instance for the batch precompile, which is located at `{{ networks.moonbase.precompiles.batch }}`.

You can add the following code to the `swap.js` file:

```js
const simpleDexAddress = "INSERT-ADDRESS-OF-DEX";

async function main() {
  // Create instance of SimpleDex.sol
  const simpleDex = await ethers.getContractAt(
    "SimpleDex",
    simpleDexAddress
  );

  // Create instance of DemoToken.sol
  const demoTokenAddress = await simpleDex.token();
  const demoToken = await ethers.getContractAt(
    "DemoToken",
    demoTokenAddress
  );

  // Create instance of Batch.sol
  const batchAddress = "{{ networks.moonbase.precompiles.batch }}";
  const batch = await ethers.getContractAt("Batch", batchAddress);
}
main();
```

### Add Check Balances Helper Function {: #add-function-to-check-balances }

Next, we're going to create a helper function that will be used to check the balance of DTOK tokens the DEX and the signer account has. This will be particularly useful to see balance changes after the swaps are complete.

In this function, you'll call the `balanceOf()` function of the `DemoToken` contract, passing in the address of the signer and the DEX, and then print the formatted results in DTOKs to the terminal:

```js
async function checkBalances(demoToken) {
  // Get the signer
  const signer = (await ethers.getSigner()).address;

  // Get the balance of the DEX and print it
  const dexBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(simpleDexAddress)
  );
  console.log(`Dex ${simpleDexAddress} has a balance of: ${dexBalance} DTOKs`);

  // Get the balance of the signer and print it
  const signerBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(signer)
  );
  console.log(
    `Account ${signer} has a balance of: ${signerBalance} DTOKs`
  );
}
```

### Swap DEV for DTOKs {: #add-logic-to-swap-dev }

Now we're going to create the logic to swap DEV tokens for DTOKs, so that in the following section we'll have DTOKs that we can approve the DEX to spend on our behalf.

We'll use the `swapDevForDemoToken()` function of the `SimpleDex` contract and pass in the amount to swap in Wei. For convenience, you can use the `ethers.utils.parseEther()` function, which allows you to pass in an amount in DEV and have it converted to Wei for you. For example, you can replace `"INSERT-AMOUNT-OF-DEV-TO-SWAP"` with `.5` to swap .5 DEV in exchange for .5 DTOK.

After the swap, we'll use the `checkBalances()` helper function to verify that the balances for the DEX and the signing account have changed as expected.

Let's add the following snippet to our `main()` function:

```js
async function main() {
  // ...

  // Swap DEV for DTOKs and print the transaction hash
  const amountDev = ethers.utils.parseEther( "INSERT-AMOUNT-OF-DEV-TO-SWAP")
  const swapDevForDemoToken = await simpleDex.swapDevForDemoToken({
    amountDev
  });
  await swapDevForDemoToken.wait();
  console.log(`Swapped dev for demo tokens: ${swapDevForDemoToken.hash}`);

  // Check balances after the swap
  await checkBalances(demoToken);
}
```

So, if you set the amount to swap to be .5 DEV, the DEX balance will decrease by .5 DTOK to 999.5 DTOK (if this is the first swap made) and the signing account's balance will increase by .5 DTOK. The transaction hash for the swap will also be printed to the terminal, so you can use [Moonscan](https://moonbase.moonscan.io){target=_blank} to view more information on the transaction.

### Approve & Swap DTOKs for DEV using the Batch Precompile {: #add-logic-to-swap-dtoks }

Now that you have some DTOKs in your signing account, we can approve the DEX to spend these tokens on our behalf so that we can swap the DTOKs back to DEVs. On Ethereum, for example, we would need to send two transactions to be able to swap the DTOKs back to DEVs: an approval and a transfer. However, on Moonbeam, thanks to the batch precompile contract, you can batch these two transactions into a single one. This allows us to set the approval amount for the exact amount of the swap.

So instead of calling `demoToken.approve(spender, amount)` and then `simpleDex.swapDemoTokenForDev(amount)`, we'll get the encoded call data for each of these transactions and pass them into the batch precompile's `batchAll()` function. To get the encoded call data, we'll use Ether's `interface.encodeFunctionData()` function and pass in the necessary parameters. For example, we'll swap .2 DTOK back to .2 DEV. In this case, for the approval, we can pass in the DEX address as the spender and set the amount to .2 DTOK. We'll also set the amount to swap as .2 DTOK. Again, you can use the `ethers.utils.parseEther()` function to convert the amount in DTOK to Wei.

Once we have the encoded call data, we can use it to call the `batchAll()` function of the batch precompile. This function performs multiple calls atomically, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert. The following parameters are required by the `batchAll()` function:

--8<-- 'text/batch/batch-parameters.md'

So, the first index of each array will correspond to the approval and the second will correspond to the swap.

After the swap, we'll check the balances again using the `checkBalances()` function to make sure the balances have changed as expected.

We'll update the `main()` function to include the following logic:

```js
async function main() {
  // ...

  // Parse the value to swap to Wei
  const amountDtok = ethers.utils.parseEther( "INSERT-AMOUNT-OF-DEV-TO-SWAP")

  // Get the encoded call data for the approval and swap
  const approvalCallData = demoToken.interface.encodeFunctionData("approve", [
    simpleDexAddress,
    amountDtok,
  ]);
  const swapCallData = simpleDex.interface.encodeFunctionData(
    "swapDemoTokenForDev",
    [amountDtok]
  );

  const batchAll = await batch.batchAll(
    [demoTokenAddress, simpleDexAddress], // to address
    [], // value of the native token to send 
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap demo tokens for dev tokens: ${batchAll.hash}`);

  // Check balances after the swap
  await checkBalances(demoToken);
}
```

So, if you set the amount to swap to be .2 DTOK, the DEX balance will increase by .2 DTOK, and the signing account's balance will decrease by .2 DTOK. The transaction hash for the swap will also be printed to the terminal, so you can use [Moonscan](https://moonbase.moonscan.io){target=_blank} to view more information on the transaction.

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/tutorials/batch-approve-swap/swap.js){target=_blank}.

And that's it! You've successfully used the batch precompile contract to batch an approval and swap into a single transaction, allowing for the approval amount to be the exact swap amount.