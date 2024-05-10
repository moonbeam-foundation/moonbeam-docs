---
title: Deploy Smart Contracts with Waffle & Mars
description: Learn how to use Waffle and Mars to write, compile, test, and deploy Ethereum smart contracts on Moonbeam.
---

# Using Waffle & Mars to Deploy to Moonbeam

## Introduction {: #introduction }

[Waffle](https://getwaffle.io){target=\_blank} is a library for compiling and testing smart contracts, and [Mars](https://github.com/EthWorks/Mars){target=\_blank} is a deployment manager. Together, Waffle and Mars can be used to write, compile, test, and deploy Ethereum smart contracts. Since Moonbeam is Ethereum compatible, Waffle and Mars can be used to deploy smart contracts to a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} or the [Moonbase Alpha TestNet](/builders/get-started/networks/moonbase/){target=\_blank}.

Waffle uses minimal dependencies, has syntax that is easy to learn and extend, and provides fast execution times when compiling and testing smart contracts. Furthermore, it is [TypeScript](https://www.typescriptlang.org){target=\_blank} compatible and uses [Chai matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html){target=\_blank} to make tests easy to read and write.

Mars provides a simple, TypeScript compatible framework for creating advanced deployment scripts and staying in sync with state changes. Mars focuses on infrastructure-as-code, allowing developers to specify how their smart contracts should be deployed and then using those specifications to automatically handle state changes and deployments.

In this guide, you'll be creating a TypeScript project to write, compile, and test a smart contract using Waffle, then deploy it on to the Moonbase Alpha TestNet using Mars.

## Checking Prerequisites {: #checking-prerequisites }

You will need to have the following:

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'

Once you've created an account you'll need to export the private key to be used in this guide.

## Create a TypeScript Project with Waffle & Mars {: #create-a-typescript-project-with-waffle-mars }

To get started, you'll create a TypeScript project and install and configure a few dependencies.

1. Create the project directory and change to it:

    ```bash
    mkdir waffle-mars && cd waffle-mars
    ```

2. Initialize the project. Which will create a `package.json` in the directory:

    ```bash
    npm init -y
    ```

3. Install the following dependencies:

    ```bash
    npm install ethereum-waffle ethereum-mars ethers \
    @openzeppelin/contracts typescript ts-node chai \
    @types/chai mocha @types/mocha
    ```

    - [Waffle](https://github.com/EthWorks/Waffle) - for writing, compiling, and testing smart contracts
    - [Mars](https://github.com/EthWorks/Mars) - for deploying smart contracts to Moonbeam
    - [Ethers](https://github.com/ethers-io/ethers.js) - for interacting with Moonbeam's Ethereum API
    - [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) - the contract you'll be creating will use OpenZeppelin's ERC-20 base implementation
    - [TypeScript](https://github.com/microsoft/TypeScript) - the project will be a TypeScript project
    - [TS Node](https://github.com/TypeStrong/ts-node) - for executing the deployment script you'll create later in this guide
    - [Chai](https://github.com/chaijs/chai) - an assertion library used alongside Waffle for writing tests
    - [@types/chai](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/chai) - contains the type definitions for chai
    - [Mocha](https://github.com/mochajs/mocha) - a testing framework for writing tests alongside Waffle
    - [@types/mocha](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/mocha) - contains the type definitions for mocha

4. Create a [TypeScript configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file:

    ```bash
    touch tsconfig.json
    ```

5. Add a basic TypeScript configuration:

    ```json
    {
        "compilerOptions": {
            "strict": true,
            "target": "ES2019",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "esModuleInterop": true,
            "module": "CommonJS",
            "composite": true,
            "sourceMap": true,
            "declaration": true,
            "noEmit": true
        }
    }
    ```

Now, you should have a basic TypeScript project with the necessary dependencies to get started building with Waffle and Mars.

## Add a Contract {: #add-a-contract }

For this guide, you will create an ERC-20 contract that mints a specified amount of tokens to the contract creator. It's based on the OpenZeppelin ERC-20 template.

1. Create a directory to store your contracts and a file for the smart contract:

    ```bash
    mkdir contracts && cd contracts && touch MyToken.sol
    ```

2. Add the following contract to `MyToken.sol`:

    ```solidity
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

    contract MyToken is ERC20 {
        constructor() ERC20("MyToken", "MYTOK") {}

        function initialize(uint initialSupply) public {
          _mint(msg.sender, initialSupply);
        }
    }
    ```

In this contract, you are creating an ERC-20 token called MyToken with the symbol MYTOK, that allows you, as the contract creator, to mint as many MYTOKs as desired.

## Use Waffle to Compile and Test {: #use-waffle-to-compile-and-test }

### Compile with Waffle {: #compile-with-waffle }

Now that you have written a smart contract, the next step is to use Waffle to compile it. Before diving into compiling your contract, you will need to configure Waffle:

1. Go back to the root project directory and create a `waffle.json` file to configure Waffle:

    ```bash
    cd .. && touch waffle.json
    ```

2. Edit the `waffle.json` to specify compiler configurations, the directory containing your contracts, and more. For this example, we'll use `solcjs` and the Solidity version you used for the contract, which is `0.8.0`:

    ```json
    {
        "compilerType": "solcjs",
        "compilerVersion": "0.8.0",
        "compilerOptions": {
            "optimizer": {
                "enabled": true,
                "runs": 20000
            }
        },
        "sourceDirectory": "./contracts",
        "outputDirectory": "./build",
        "typechainEnabled": true
    }
    ```

3. Add a script to run Waffle in the `package.json`:

    ```json
    "scripts": {
        "build": "waffle"
    },
    ```

That is all you need to do to configure Waffle, now you're all set to compile the `MyToken` contract using the `build` script:

```bash
npm run build
```

![Waffle compiler output](/images/builders/build/eth-api/dev-env/waffle-mars/waffle-mars-1.webp)

After compiling your contracts, Waffle stores the JSON output in the `build` directory. Since the contract in this guide is based on OpenZeppelin's ERC-20 template, relevant ERC-20 JSON files will appear in the `build` directory too.

### Test with Waffle {: #test-with-waffle }

Before deploying your contract and sending it off into the wild, you should test it first. Waffle provides an advanced testing framework and has plenty of tools to help you with testing.

You'll be running tests against the Moonbase Alpha TestNet and will need the corresponding RPC URL to connect to it: `{{ networks.moonbase.rpc_url }}`.

--8<-- 'text/_common/endpoint-setup.md'

Since you will be running tests against the TestNet, it might take a couple minutes to run all of the tests. If you want a more efficient testing experience, you can [spin up a Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} using [`instant seal`](/builders/get-started/networks/moonbeam-dev/#node-options){target=\_blank}. Running a local Moonbeam development node with the `instant seal` feature is similar to the quick and iterative experience you would get with [Hardhat Network](https://hardhat.org/hardhat-network/docs/overview){target=\_blank}.

1. Create a directory to contain your tests and a file to test your `MyToken` contract:

    ```bash
    mkdir test && cd test && touch MyToken.test.ts
    ```

2. Open the `MyToken.test.ts` file and setup your test file to use Waffle's Solidity plugin and use Ethers custom JSON-RPC provider to connect to Moonbase Alpha:

    ```typescript
    import { use, expect } from 'chai';
    import { Provider } from '@ethersproject/providers';
    import { solidity } from 'ethereum-waffle';
    import { ethers, Wallet } from 'ethers';
    import { MyToken, MyTokenFactory } from '../build/types';

    // Tell Chai to use Waffle's Solidity plugin
    use(solidity);

    describe ('MyToken', () => {
      // Use custom provider to connect to Moonbase Alpha
      let provider: Provider = new ethers.providers.JsonRpcProvider(
        '{{ networks.moonbase.rpc_url }}'
      );
      let wallet: Wallet;
      let walletTo: Wallet;
      let token: MyToken;

      beforeEach(async () => {
        // Logic for setting up the wallet and deploying MyToken will go here
      });

      // Tests will go here
    })
    ```

3. Before each test is run, you'll want to create wallets and connect them to the provider, use the wallets to deploy an instance of the `MyToken` contract, and then call the `initialize` function once with an initial supply of 10 tokens:

    ```typescript
      beforeEach(async () => {
        // This is for demo purposes only. Never store your private key in a JavaScript/TypeScript file
        const privateKey = 'INSERT_PRIVATE_KEY'
        // Create a wallet instance using your private key & connect it to the provider
        wallet = new Wallet(privateKey).connect(provider);

        // Create a random account to transfer tokens to & connect it to the provider
        walletTo = Wallet.createRandom().connect(provider);

        // Use your wallet to deploy the MyToken contract
        token = await new MyTokenFactory(wallet).deploy();

        // Mint 10 tokens to the contract owner, which is you
        let contractTransaction = await token.initialize(10);

        // Wait until the transaction is confirmed before running tests
        await contractTransaction.wait();
      });
    ```

4. Now you can create your first test. The first test will check your initial balance to ensure you received the initial supply of 10 tokens. However, to follow good testing practices, write a failing test first:

    ```typescript
    it('Mints the correct initial balance', async () => {
      expect(await token.balanceOf(wallet.address)).to.equal(1); // This should fail
    });
    ```

5. Before you can run your first test, you'll need to go back to the root direction and add a `.mocharc.json` Mocha configuration file:

    ```bash
    cd .. && touch .mocharc.json
    ```

6. Now edit the `.mocharc.json` file to configure Mocha:

    ```json
    {
        "require": "ts-node/register/transpile-only",
        "timeout": 600000,
        "extension": "test.ts"
    }
    ```

7. You'll also need to add a script in the `package.json` to run your tests:

    ```json
    "scripts": {
        "build": "waffle",
        "test": "mocha"
    },
    ```

8. You're all set to run the tests, simply use the `test` script you just created and run:

    ```bash
    npm run test
    ```

    Please note that it could take a few minutes to process because the tests are running against Moonbase Alpha, but if all worked as expected, you should have one failing test.

9. Next, you can go back and edit the test to check for 10 tokens:

    ```typescript
    it('Mints the correct initial balance', async () => {
      expect(await token.balanceOf(wallet.address)).to.equal(10); // This should pass
    });
    ```

10. If you run the tests again, you should now see one passing test:

    ```bash
    npm run test
    ```

11. You've tested the ability to mint tokens, next you'll test the ability to transfer the minted tokens. If you want to write a failing test first again that is up to, however the final test should look like this:

    ```typescript
    it('Should transfer the correct amount of tokens to the destination account', async () => {
      // Send the destination wallet 7 tokens
      await (await token.transfer(walletTo.address, 7)).wait();

      // Expect the destination wallet to have received the 7 tokens
      expect(await token.balanceOf(walletTo.address)).to.equal(7);
    });
    ```

Congratulations, you should now have two passing tests! Altogether, your test file should look like this:

```typescript
import { use, expect } from 'chai';
import { Provider } from '@ethersproject/providers';
import { solidity } from 'ethereum-waffle';
import { ethers, Wallet } from 'ethers';
import { MyToken, MyTokenFactory } from '../build/types';

use(solidity);

describe('MyToken', () => {
  let provider: Provider = new ethers.providers.JsonRpcProvider(
    '{{ networks.moonbase.rpc_url }}'
  );
  let wallet: Wallet;
  let walletTo: Wallet;
  let token: MyToken;

  beforeEach(async () => {
    // For demo purposes only. Never store your private key in a JavaScript/TypeScript file
    const privateKey = 'INSERT_PRIVATE_KEY';
    wallet = new Wallet(privateKey).connect(provider);
    walletTo = Wallet.createRandom().connect(provider);
    token = await new MyTokenFactory(wallet).deploy();
    let contractTransaction = await token.initialize(10);
    await contractTransaction.wait();
  });

  it('Mints the correct initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.equal(10);
  });

  it('Should transfer the correct amount of tokens to the destination account', async () => {
    await (await token.transfer(walletTo.address, 7)).wait();
    expect(await token.balanceOf(walletTo.address)).to.equal(7);
  });
});
```

If you want to write more tests on your own, you could consider testing transfers from accounts without any funds or transfers from accounts without enough funds.

## Use Mars to Deploy to Moonbase Alpha {: #use-mars-to-deploy-to-moonbase-alpha }

After you compile your contracts and before deployment, you will have to generate contract artifacts for Mars. Mars uses the contract artifacts for typechecks in deployments. Then you'll need to create a deployment script and deploy the `MyToken` smart contract.

Remember, you will be deploying to Moonbase Alpha and will need to use the TestNet RPC URL:

```text
{{ networks.moonbase.rpc_url }}
```

--8<-- 'text/_common/endpoint-setup.md'

The deployment will be broken up into three sections: [generate artifacts](#generate-artifacts), [create a deployment script](#create-a-deployment-script), and [deploy with Mars](#deploy-with-mars).

### Generate Artifacts {: #generate-artifacts }

Artifacts need to be generated for Mars so that typechecks are enabled within deployment scripts.

1. Update existing script to run Waffle in the `package.json` to include Mars:

    ```json
    "scripts": {
        "build": "waffle && mars",
        "test": "mocha"
    },
    ```

2. Generate the artifacts and create the `artifacts.ts` file needed for deployments:

    ```bash
    npm run build
    ```

![Waffle and Mars compiler output](/images/builders/build/eth-api/dev-env/waffle-mars/waffle-mars-2.webp)

If you open the `build` directory, you should now see an `artifacts.ts` file containing the artifact data needed for deployments. To continue on with the deployment process, you'll need to write a deployment script. The deployment script will be used to tell Mars which contract to deploy, to what network, and which account is to be used to trigger the deployment.

### Create a Deployment Script {: #create-a-deployment-script }

Now you need to configure the deployment for the `MyToken` contract to the Moonbase Alpha TestNet.

In this step, you'll create the deployment script which will define how the contract should be deployed. Mars offers a `deploy` function that you can pass options to such as the private key of the account to deploy the contract, the network to deploy to, and more. Inside of the `deploy` function is where the contracts to be deployed are defined. Mars has a `contract` function that accepts the `name`, `artifact`, and `constructorArgs`. This function will be used to deploy the `MyToken` contract with an initial supply of 10 MYTOKs.

1. Create a `src` directory to contain your deployment scripts and create the script to deploy the `MyToken` contract:

    ```bash
    mkdir src && cd src && touch deploy.ts
    ```

2. In `deploy.ts`, use Mars' `deploy` function to create a script to deploy to Moonbase Alpha using your account's private key:

    ```javascript
    import { deploy } from 'ethereum-mars';

    // For demo purposes only. Never store your private key in a JavaScript/TypeScript file
    const privateKey = 'INSERT_PRIVATE_KEY';
    deploy(
      { network: '{{ networks.moonbase.rpc_url }}', privateKey },
      (deployer) => {
        // Deployment logic will go here
      }
    );
    ```

3. Set up the `deploy` function to deploy the `MyToken` contract created in the previous steps:

    ```javascript
    import { deploy, contract } from 'ethereum-mars';
    import { MyToken } from '../build/artifacts';

    // For demo purposes only. Never store your private key in a JavaScript/TypeScript file
    const privateKey = 'INSERT_PRIVATE_KEY';
    deploy({ network: '{{ networks.moonbase.rpc_url }}', privateKey }, () => {
      contract('myToken', MyToken);
    });
    ```

4. Add a deploy script to the `scripts` object in the `package.json`:

    ```json
    "scripts": {
        "build": "waffle && mars",
        "test": "mocha",
        "deploy": "ts-node src/deploy.ts"
    }
    ```

So far, you should have created a deployment script in `deploy.ts` that will deploy the `MyToken` contract to Moonbase Alpha, and added the ability to easily call the script and deploy the contract.

### Deploy with Mars {: #deploy-with-mars }

You've configured the deployment, now it's time to actually deploy to Moonbase Alpha.

1. Deploy the contract using the script you just created:

    ```bash
    npm run deploy
    ```

2. In your Terminal, Mars will prompt you to press `ENTER` to send your transaction

    ![Mars confirm deployment](/images/builders/build/eth-api/dev-env/waffle-mars/waffle-mars-3.webp)

If successful, you should see details about your transaction including it's hash, the block it was included in, and it's address.

![Mars deployment output](/images/builders/build/eth-api/dev-env/waffle-mars/waffle-mars-4.webp)

Congratulations! You've deployed a contract to Moonbase Alpha using Waffle and Mars!

## Example Project {: #example-project }

If you want to see a completed example of a Waffle and Mars project on Moonbeam, check out the [moonbeam-waffle-mars-example](https://github.com/EthWorks/moonbeam-waffle-mars-example){target=\_blank} created by the team behind Waffle and Mars, EthWorks.

--8<-- 'text/_disclaimers/third-party-content.md'
