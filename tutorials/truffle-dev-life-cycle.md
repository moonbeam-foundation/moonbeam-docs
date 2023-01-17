---
title: Contract Development Life Cycle with Truffle
description: Learn how to develop, test, and deploy smart contracts with Truffle and how to take your contracts from a local development node to Moonbeam MainNet.
---

# Smart Contract Development: From a Local Moonbeam Development Node to Moonbeam MainNet

![Banner Image](/images/tutorials/truffle-dev-life-cycle/truffle-banner.png)

_January 10, 2022 | by Erin Shaben_

## Introduction {: #introduction } 

For this tutorial, we'll be going through the smart contract development life cycle with [Truffle](/builders/build/eth-api/dev-env/truffle){target=_blank}. As we're starting to develop our contracts, we'll use a [Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=_blank} so we can quickly iterate on our code as we build it and test it. Then we'll progress to using the [Moonbase Alpha TestNet](/builders/get-started/networks/moonbase){target=_blank} so we can test our contracts on a live network with tokens that do not hold any real value, so we don't have to worry about paying for any mistakes. Finally, once we feel confident in our code, we'll deploy our contracts to [Moonbeam MainNet](/builders/get-started/networks/moonbeam){target=_blank}.

For the purposes of this tutorial, we'll create a simple NFT marketplace to list and sell a NFT collection that we'll call Dizzy Dragons. We'll create two contracts in our Truffle project: the NFT marketplace contract where we'll list the Dizzy Dragon NFTs and a Dizzy Dragons contract that we'll use to mint the NFTs. Then we'll use Truffle's built-in testing features to test our contracts and ensure they work as expected before deploying them to each network. 

## Checking Prerequisites {: #checking-prerequisites }

For this tutorial, you'll need the following:

- Have [Docker installed](https://docs.docker.com/get-docker/){target=_blank}
- An account funded with DEV tokens to be used on the Moonbase Alpha TestNet and GLMR tokens to be used on Moonbeam MainNet.
  --8<-- 'text/faucet/faucet-list-item.md'
- Your own endpoint and API key for Moonbeam, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}

## Create a Truffle Project {: #create-a-truffle-project }

To quickly get started with Truffle, we're going to use the [Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}, which provides a boilerplate setup for developing and deploying smart contracts on Moonbeam. 

The Moonbeam Truffle Box comes pre-configured for a local Moonbeam development node and Moonbase Alpha. We'll need to add support for Moonbeam so when we're ready to deploy our contracts to MainNet, we'll be all set!

It also comes with a couple of plugins: the [Moonbeam Truffle plugin](https://github.com/purestake/moonbeam-truffle-plugin){target=_blank} and the [Truffle verify plugin](https://github.com/rkalis/truffle-plugin-verify){target=_blank}. The Moonbeam Truffle plugin will help us quickly get started with a local Moonbeam development node. The Truffle verify plugin will allow us to verify our smart contracts directly from within our Truffle project.

Without further ado, let's create our project:

1. You can either install Truffle globally or clone the [Moonbeam Truffle Box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank} repository:

    ```
    npm install -g truffle
    mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
    truffle unbox PureStake/moonbeam-truffle-box
    ```

    To avoid globally installing Truffle, you can run the following command and then access the Truffle commands by using `npx truffle <command>`:

    ```
    git clone https://github.com/PureStake/moonbeam-truffle-box
    cd moonbeam-truffle-box
    ```

2. Install the dependencies that come with the Moonbeam Truffle Box:

    ```
    npm install
    ```

3. Open the `truffle-config.js` file, where you'll find the network configurations for a local development node and Moonbase Alpha. We'll need to add the Moonbeam configurations here:

    ```
    ...
    moonbeam: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbeam.chain_id }} (hex: {{ networks.moonbeam.hex_chain_id }}),
    },
    ```

Now we should have a Truffle project that is configured for each of the networks we'll be deploying smart contracts to in this guide.

For the sake of this guide, we can remove the `MyToken.sol` contract and the associated tests that come with the project:

```
rm contracts/MyToken.sol test/test_MyToken.js
```

## Add Simple NFT Marketplace Contract {: #example-nft-marketplace-contract }

As the goal is to go over the development life cycle, let's start off with a simple NFT marketplace contract with minimal functionality. We'll create this marketplace specifically for our new Dizzy Dragons NFT collection. 

The marketplace contract will have two functions that allow a Dizzy Dragon NFT to be listed and purchased: `listNft` and `purchaseNft`. Ideally, an NFT marketplace would have additional functionality such as the ability to fetch a listing, update or cancel listings, and more. However, **this contract and our Dizzy Dragon NFT collection is just for demonstration purposes**.

We'll add our contract to the `contracts` directory:

```
touch contracts/NftMarketplace.sol
```

In the `NftMarketplace.sol` file, we'll add the following example contract:

```Solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NotOwner();
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    // Map the NFT address to the listing information
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    event NftListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event NftPurchased(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        // Ensure that only the owner of an NFT can list it
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    function listNft(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        // Make sure that the marketplace has been approved to transfer the NFT
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        // Save the NFT to state
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit NftListed(msg.sender, nftAddress, tokenId, price);
    }

    function purchaseNft(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        // Make sure the payment received is not less than the listing price
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        // Remove the NFT from state
        delete (s_listings[nftAddress][tokenId]);
        // Transfer the NFT to the buyer
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit NftPurchased(msg.sender, nftAddress, tokenId, listedItem.price);
        // Send the payment to the seller
        (bool success, ) = payable(listedItem.seller).call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}
```

!!! challenge
    Try to create a `getListing` function that, given the address of an NFT and its token ID, returns the listing.

## Add NFT Contract {: #add-nft-contract }

In order to test our NFT Marketplace contract, we'll need to mint a Dizzy Dragon NFT. To do so, we'll create a simple NFT contract named `DizzyDragons.sol`:

```
touch contracts/DizzyDragons.sol
```

In the `DizzyDragons.sol` file, we'll add the following example contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DizzyDragons is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  address nftMarketplace;

  event NFTMinted(uint256);

  constructor(address _nftMarketplace) ERC721("DizzyDragons", "DDRGN") {
    nftMarketplace = _nftMarketplace;
  }

  function mint(string memory _tokenURI) public {
    // Increase the token ID counter
    _tokenIds.increment();
    // Save the token ID to be used to safely mint a new NFT
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    // Set the token URI metadata for the NFT
    _setTokenURI(newTokenId, _tokenURI);
    // Approve the NFT marketplace to transfer the NFT
    approve(nftMarketplace, newTokenId);
    emit NFTMinted(newTokenId);
  }
}
```

## Start up the Development Node {: #start-development-node }

Before we jump into writing our tests, let's take some time now to start up our develpoment node so that we can run our tests against it.

Since the Moonbeam Truffle box comes with the Moonbeam Truffle plugin, starting up a development node is a breeze.

You'll need to install the latest Docker image by running:

```
npx truffle run moonbeam install
```

Then you can start the node:

```
npx truffle run moonbeam start
```

Once your node has been successfully started, you should see the following output in your terminal:

```
Node has started - Endpoits: HTTP http://127.0.0.1:9933 WS ws://127.0.0.1:9944 - Container ID
```

You can check out all of the available commands in the [Using the Moonbeam Truffle Plugin to Run a Node](/builders/build/eth-api/dev-env/truffle/#using-the-moonbeam-truffle-plugin-to-run-a-node){target=_blank} section of our Truffle docs. 

You can also set up a development node without the Moonbeam Truffle plugin, to do so, please refer to the [Getting Started with a Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev/){target=_blank} guide.

## Write Tests {: #write-tests }

Before sending our code out into the wild, we'll want to test our smart contracts to ensure they function as expected. Truffle provides the option of writing tests in JavaScript, TypeScript, or Solidity. It also comes with out-of-the-box support for [Mocha](https://mochajs.org/){target=_blank} and [Chai](https://chaijs.com/){target=_blank}.

For this guide, we'll write our tests in JavaScript so we can take advantage of the built-in support for Mocha and Chai. 

If you're familiar with Mocha, you're probably used to using the `describe` function to group tests and the `it` function for each individual test. When writing tests with Truffle, you'll replace `describe` with `contract`. The `contract` function is exactly like `describe`, but it includes additional functionality that will re-deploy your migrations at the beginning of every test file, providing a clean-room environment. You'll still use the `it` function like you normally would for the individual tests.

Truffle also makes testing easier by including a `web3` instance in each test file that is configured for the correct network, so you don't have to configure anything yourself. You'll simply run `npx truffle test --network <network-name>`.

### Test Setup {: #test-setup }

Before getting started, we'll need to generate artifacts for our contract, which will be used in our tests. We can run the following command:

```
npx truffle compile
```

The artifacts will be written to the `build/contracts` directory. Next, we can add our test file, which will start with `test_` to indicate that it's a test file:

```
touch test test_NftMarketplace.js
```

Now that we can set up our test file, let's take a minute to review what we'll need to do next:

- Import the artifacts for the `NftMarketplace` and `DizzyDragons` contracts using Truffle's `artifacts.require()`, which provides an abstraction instance of a contract
- Create a `contract` function to group our tests. The `contract` function will also provide us with our account we have setup in our `truffle-config.js` file. As we used the Moonbeam Truffle box, our development account has been set up for us. When we move on to deploy and test our contracts on Moonbase Alpha and Moonbeam, we'll need to configure our accounts
- For each test, we're going to need to deploy our contracts and mint an NFT. To do this, we can take advantage of the [`beforeEach` hook provided by Mocha](https://mochajs.org/#hooks){target=_blank}
- As we'll be minting an NFT for each test, we'll need to have a `tokenUri`. The `tokenUri` that we'll use for our examples will be for Daizy, our first Dizzy Dragon NFT. The `tokenUri` will be set to `"https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9"`

So, now that we have a game plan, let's implement it! In the `test_NftMarketplace.js` file, we can add the following code:

```js
const NftMarketplace = artifacts.require("NftMarketplace");
const DizzyDragons = artifacts.require("DizzyDragons");

contract("NftMarketplace", (accounts) => {
  const tokenUri =
    "https://gateway.pinata.cloud/ipfs/QmTCib5LvSrb7sshLhLvzmV7wdSdmSt3yjB4dqQaA58Td9";
  let nftMarketplace;
  let dizzyDragonsNft;
  let mintedNft;

  beforeEach(async () => {
    // Deploy the marketplace
    nftMarketplace = await NftMarketplace.deployed();
    // Deploy a Dizzy Dragon NFT
    dizzyDragonsNft = await DizzyDragons.deployed();
    // Mint Daizy the Dizzy Dragon NFT
    mintedNft = await dizzyDragonsNft.mint(tokenUri);
  });

  // TODO: Add tests here
});
```

!!! note
    You don't have to import Mocha or Web3 as both packages comes out-of-the-box with Truffle!

Now we're ready to start writing our tests!

### Test Minting NFTs {: #test-minting-nfts }

For our first test, let's make sure that we are minting our new Dizzy Dragon NFT as expected. We'll use the event logs from the transaction to ensure that the `NftMinted` event of the `DizzyDragons` contract has been emitted. We'll also test that the token ID of the NFT is `1`, as we are deploying the `DizzyDragons` contract fresh before each test, so it should always be the first NFT minted.

In place of the `// TODO: Add tests here` comment, you can add the following test:

```js
  it("should mint a new Dizzy Dragon NFT", async () => {
      // Access the logs of the mint transaction
      // Remember: mintedNft was created in the beforeEach function
      const nftMintedLog = mintedNft.logs[2];

      const event = nftMintedLog.event;
      const tokenId = nftMintedLog.args[0].toNumber();

      // Use Mocha's assert to test that the NftMinted event was emitted
      // and the token ID of the NFT is 1
      assert.equal(event, "NftMinted");
      assert.equal(tokenId, 1);
  });
```

Assuming your [Moonbeam development node is up and running](#start-development-node), you can run the test with the following command:

```
npx truffle test --network dev
```

### Test Listing NFTs {: #test-listing-nfts }

For our next test, we're going to test that we can successfully list our freshly minted NFT using the `listNft` function of the `NftMarketplace` contract. So, again we'll use our event logs to test that the `NftListed` event has been emitted along with the correct state variables such as the seller and token ID.

After our first test, we can go ahead and the following test:

```js
  it("should list a new Dizzy Dragon NFT", async () => {
    // Access the logs of the mint transaction
    const nftMintedLog = mintedNft.logs[2];
    // Set the price for the NFT to 1 ether
    const price = await web3.utils.toWei("1", "ether");
    const nftAddress = nftMintedLog.address;
    const tokenId = nftMintedLog.args[0]

    // Call the listNft function of the NftMarketplace contract with the
    // address of the NFT, the token ID, and the price
    const listResult = await nftMarketplace.listNft(
      nftAddress,
      tokenId,
      price
    );
    
    const event = listResult.logs[0].event;
    const seller = listResult.logs[0].args[0];
    const tokenId = listResult.logs[0].args[2];

    // Use Mocha's assert to test that the NftListed event was emitted
    // with the correct arguments for the seller and token ID
    assert.equal(event, 'NftListed')
    assert.equal(seller, accounts[0])
    assert.equal(tokenId.toNumber(), nftMintedLog.args[0].toNumber())
  });
```

Again, you can run the tests to make sure that the tests pass as expected.

### Test Purchasing NFTs {: #test-purchasing-nfts }

Finally, let's test that an NFT on our marketplace can be purchased using the `purchaseNft` function of the `NftMarketplace` contract. Similarly to our previous tests, we'll use the event logs to test that the `NftPurchased` event has been emitted along with the correct state variables such as the buyer and token ID.

Let's add the following test:

```js
  it("should buy a new Dizzy Dragon NFT", async () => {
    const nftMintedLog = mintedNft.logs[2];

    // List the NFT first
    const price = await web3.utils.toWei("1", "ether");
    const nftAddress = nftMintedLog.address;
    const tokenId = nftMintedLog.args[0]
    await nftMarketplace.listNft(
      nftAddress,
      tokenId,
      price
    );
    
    // Purchase the NFT using the purchaseNft function and passing in the
    // address of the NFT and the token ID. We'll also send a payment along
    // for the asking price of the NFT
    const purchaseNft = await nftMarketplace.purchaseNft(
        nftAddress,
        tokenId,
        {value: price}
    );

    const event = purchaseNft.logs[0].event;
    const buyer = purchaseNft.logs[0].args[0];
    const tokenId = listResult.logs[0].args[2];

    // Use Mocha's assert to test that the NftPurchased event was emitted
    // with the correct argument for the buyer and token ID
    assert.equal(event, 'NftPurchased')
    assert.equal(buyer, accounts[0])
    assert.equal(tokenId.toNumber(), nftMintedLog.args[0].toNumber())
  });
```

That's it for the tests! To run them all, go ahead and run:

```
npx truffle test --network dev
```

!!! challenge
    Try adding a test that uses a `tokenUri` for an NFT that hasn't approved the `NftMarketplace` contract to transfer it. You should assert that the call will fail.

## Deploy to a Local Development Node {: #deploy-to-local-dev-node }

Now that we feel confident in our NFT marketplace, we can go ahead and deploy our contracts. First, we'll need to update the deployment migration so that we deploy the `NftMarketplace` contract followed by the `DizzyDragons` contract, as we'll need to pass in the address of the marketplace to the constructor of the `DizzyDragons` contract. 

To update the deployment script, open up the `migrations/2_deploy_contracts.js` migration file and replace it with the following:

```js
var NftMarketplace = artifacts.require("NftMarketplace");
var DizzyDragons = artifacts.require("DizzyDragons");

module.exports = async function (deployer) {
  // Deploy the NFT Marketplace
  await deployer.deploy(NftMarketplace);
  const nftMarketplace = await NftMarketplace.deployed();
  // Deploy the Dizzy Dragons contract
  await deployer.deploy(DizzyDragons, nftMarketplace.address);
};
```

Now we're all set to deploy our contracts. To do deploy our contracts to our local development node, run this command:

```
npx truffle migrate --network dev
```

You should see the transaction hashes for the deployment of each contract in your terminal. With our contracts deployed, we could begin to build a dApp with a frontend that interacts with these contracts, but it's out of scope for this tutorial.

Now that we're done testing on the Moonbeam development node, don't forget to stop and remove the node! You can do so by running:

```
npx truffle run moonbeam stop && \
npx truffle run moonbeam remove
```

## Deploying to Moonbase Alpha TestNet {: #deploying-to-moonbase-alpha }

Now that we've been able to rapidly develop our contracts with our Moonbeam development node and feel confident with our code, we can move on to testing it on the Moonbase Alpha TestNet. 

First, you'll need to update your `truffle-config.js` file and add in the private key of your account on Moonbase Alpha. The `privateKeyMoonbase` variable already exists, you just need to set it to your private key. **This is just for demonstration purposes only, never store your private keys in a JavaScript file**.

Once you've set your account up, you can run your tests on Moonbase Alpha to make sure they work as expected on a live network:

```
npx truffle test --network moonbase
```

If your tests all pass, you can feel free to deploy your contracts using this command:

```
npx truffle migrate --network moonbase
```

Feel free to play around and interact with your contracts on the TestNet! Since DEV tokens have no real monetary value, now is a good time to work out any kinks before we deploy our contracts to Moonbeam MainNet where the tokens do have value!

## Deploying to Production on Moonbeam MainNet {: #deploying-to-production }

We thought we felt confident before, but now that we've tested our contracts on Moonbase Alpha we feel even more confident. So let's do it and test and deploy our contracts on Moonbeam!

Again, you'll need to update your `truffle-config.js` and add in the private key of your account on Moonbeam. If you're interested in a secure way to add your private keys, you can check out the [Truffle Dashboard](https://trufflesuite.com/blog/introducing-truffle-dashboard/){target=_blank}, which allows you to connect to your MetaMask wallet without any configuration. For more information, please refer to the [Truffle docs on using the Truffle Dashboard](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/){target=_blank}. Whatever you do, **never store your private keys in a JavaScript file**.

Since the Moonbeam Truffle box doesn't come with the Moonbeam network configurations, you'll need to add them:

```
...
module.exports = {
  networks: {
    ...
    moonbeam: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbeam.chain_id }} (hex: {{ networks.moonbeam.hex_chain_id }}),
    },
  }
}
```

If you're using Truffle Dashboard, you'll need to [add the host/port configuration for your dashboard](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/#connecting-to-the-dashboard){target=_blank}.

Once you've set your account up, you can run your tests on Moonbeam:

```
npx truffle test --network moonbeam
```

!!! note
    If you're using a Truffle Dashboard, you'll replace `--network moonbeam` with `--network dashboard` for any of the Truffle commands.

If your tests all pass, you can feel free to deploy your contracts using this command:

```
npx truffle migrate --network moonbase
```

And that's it! You've successfully deployed your contracts to Moonbeam MainNet after thoroughly testing them out on a local Moonbeam development node and the Moonbase Alpha TestNet! Congrats! You've gone through the entire development lifecycle using Truffle!