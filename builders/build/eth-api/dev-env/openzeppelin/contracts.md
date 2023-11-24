---
title: Deploy OpenZeppelin Contracts
description:  Learn how to create common OpenZeppelin contracts such as ERC-20, ERC-721, & ERC-1155 tokens with the OpenZeppelin Contracts Wizard and deploy them on Moonbeam.
---

# Using OpenZeppelin Contracts and Remix To Deploy To Moonbeam

## Introduction {: #introduction }

[OpenZeppelin](https://openzeppelin.com/){target=_blank} contracts and libraries have become a standard in the industry. They help developers minimize risk, as their open-source code templates are battle-tested for Ethereum and other blockchains. Their code includes the most used implementations of ERC standards and add-ons and often appears in guides and tutorials around the community.

Because Moonbeam is fully Ethereum compatible, all of OpenZeppelin's contracts and libraries can be implemented without any changes.

This guide is divided into two sections. The first part describes the OpenZeppelin Contracts Wizard, a great online tool to help you create smart contracts using OpenZeppelin code. The second section provides a step-by-step guide on how you can deploy these contracts using [Remix](https://remix.ethereum.org/){target=_blank} on Moonbeam.

## OpenZeppelin Contract Wizard {: #openzeppelin-contract-wizard }

OpenZeppelin has developed an online web-based interactive contract generator tool that is probably the easiest and fastest way to write your smart contract using OpenZeppelin code, called [Contracts Wizard](https://docs.openzeppelin.com/contracts/5.x/wizard){target=_blank}.

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/l8RTwu6hGpY' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, Open Zeppelin Wizard is used to deploy an ERC-20 token to Moonbase Alpha</a></div>

Currently, the Contracts Wizard support the following ERC standards:

 - [**ERC-20**](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/){target=_blank} — a fungible token standard that follows [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}. Fungible means that all tokens are equivalent and interchangeable that is, of equal value. One typical example of fungible tokens is fiat currencies, where each equal-denomination bill has the same value
 - [**ERC-721**](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/){target=_blank} — a non-fungible token contract that follows [EIP-721](https://eips.ethereum.org/EIPS/eip-721){target=_blank}. Non-fungible means that each token is different, and therefore, unique. An ERC-721 token can represent ownership of that unique item, whether it is a collectible item in a game, real estate, and so on
 - [**ERC-1155**](https://docs.openzeppelin.com/contracts/5.x/erc1155){target=_blank} — also known as the multi-token contract, because it can represent both fungible and non-fungible tokens in a single smart contract. It follows [EIP-1155](https://eips.ethereum.org/EIPS/eip-1155){target=_blank}

The wizard is comprised of the following sections:

 1. **Token standard selection** — shows all the different standards supported by the wizard
 2. **Settings** — provides the baseline settings for each token standard, such as token name, symbol, pre-mint (token supply when the contract is deployed), and URI (for non-fungible tokens)
 3. **Features** — list of all features available for each token standard. You can find more information about the different features in the following links:
     - [ERC-20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20){target=_blank}
     - [ERC-721](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721){target=_blank}
     - [ERC-1155](https://docs.openzeppelin.com/contracts/5.x/api/token/erc1155){target=_blank}
 4. **Access Control** — list of all the available [access control mechanisms](https://docs.openzeppelin.com/contracts/5.x/access-control){target=_blank} for each token standard
 5. **Interactive code display** — shows the smart contract code with the configuration as set by the user

![OpenZeppelin Contracts Wizard](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-wizard-1.png)

Once you have set up your contract with all the settings and features, it is just as easy as copying and pasting the code into your contract file.

## Deploying OpenZeppelin Contracts on Moonbeam {: #deploying-openzeppelin-contracts-on-moonbeam }

This section goes through the steps for deploying OpenZeppelin contracts on Moonbeam. It covers the following contracts:

 - ERC-20 (fungible tokens)
 - ERC-721 (non-fungible tokens)
 - ERC-1155 (multi-token standard)

All the code of the contracts was obtained using OpenZeppelin [Contract Wizard](https://docs.openzeppelin.com/contracts/5.x/wizard){target=_blank}.

### Checking Prerequisites {: #checking-prerequisites }

The steps described in this section assume you have [MetaMask](https://metamask.io/){target=_blank} installed and connected to the Moonbase Alpha TestNet. If you're adapting this guide for Moonbeam or Moonriver, make sure you're connected to the correct network. Contract deployment is done using the [Remix IDE](https://remix.ethereum.org/){target=_blank} via the **Injected Web3** environment. You can find corresponding tutorials in the following links:

 - [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/){target=_blank}
 - [Interacting with Moonbeam using Remix](/builders/build/eth-api/dev-env/remix/){target=_blank}

### Deploying an ERC-20 Token {: #deploying-an-erc-20-token }

For this example, an ERC-20 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **`ERC20.sol`** — ERC-20 token implementation with the optional features from the base interface. Includes the supply mechanism with a `mint` function but needs to be explicitly called from within the main contract
 - **`Ownable.sol`** — extension to restrict access to certain functions

The mintable ERC-20 OpenZeppelin token contract provides a `mint` function that the owner of the contract can only call. By default, the owner is the contract's deployer address. There is also a premint of `1000` tokens sent to the contract's deployer configured in the `constructor` function.

The first step is to go to [Remix](https://remix.ethereum.org/) and take the following steps:

 1. Click on the **Create New File** icon and set a file name. For this example, it was set to `ERC20.sol`
 2. Make sure the file was created successfully. Click on the file to open it up in the text editor
 3. Write your smart contract using the file editor. For this example, the following code was used:

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

This ERC-20 token smart contract was extracted from the [Contract Wizard](#openzeppelin-contract-wizard), setting a premint of `1000` tokens and activating the `Mintable` feature.

![Getting Started with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-1.png)

Once your smart contract is written, you can compile it by taking the following steps:

 1. Head to the **Solidity Compiler**
 2. Click on the compile button
 3. Alternatively, you can check the **Auto compile** feature

![Compile ERC-20 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-2.png)

With the contract compiled, you are ready to deploy it taking the following steps:

 1. Head to the **Deploy & Run Transactions** tab
 2. Change the environment to **Injected Web3**. This will use MetaMask's injected provider. Consequently, the contract will be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 3. Select the proper contract to deploy. In this example, it is the `MyToken` contract inside the `ERC20.sol` file
 4. If everything is ready, click on the **Deploy** button. Review the transaction information in MetaMask and confirm it
 5. After a few seconds, the transaction should get confirmed, and you should see your contract under **Deployed Contracts**

![Deploy ERC-20 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-3.png)

And that is it! You've deployed an ERC-20 token contract using OpenZeppelin's contracts and libraries. Next, you can interact with your token contract via Remix, or add it to MetaMask.

### Deploying an ERC-721 Token {: #deploying-an-erc-721-token }

For this example, an ERC-721 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **`ERC721.sol`** — ERC-721 token implementation with the optional features from the base interface. Includes the supply mechanism with a `_mint` function but needs to be explicitly called from within the main contract
 - **`ERC721Burnable.sol`** — extension to allow tokens to be destroyed by their owners (or approved addresses)
 - **`ERC721Enumerable.sol`** — extension to allow on-chain enumeration of tokens
 - **`Ownable.sol`** — extension to restrict access to certain functions

The mintable ERC-721 OpenZeppelin token contract provides a `mint` function that can only be called by the owner of the contract. By default, the owner is the contract's deployer address.

As with the [ERC-20 contract](#deploying-an-erc-20-token), the first step is to go to [Remix](https://remix.ethereum.org/){target=_blank} and create a new file. For this example, the file name will be `ERC721.sol`.

Next, you'll need to write the smart contract and compile it. For this example, the following code is used:

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "Test";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

This ERC-721 token smart contract was extracted from the [Contract Wizard](#openzeppelin-contract-wizard), setting the `Base URI` as `Test` and activating the `Mintable`, `Burnable`, and `Enumerable` features.

With the contract compiled, next you will need to:

 1. Head to the **Deploy & Run Transactions** tab
 2. Change the environment to **Injected Web3**. This will use MetaMask's injected provider. Consequently, the contract will be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 3. Select the proper contract to deploy. In this example, it is the `MyToken` contract inside the `ERC721.sol` file
 4. If everything is ready, click on the **Deploy** button. Review the transaction information in MetaMask and confirm it
 5. After a few seconds, the transaction should get confirmed, and you should see your contract under **Deployed Contracts**

![Deploy ERC-721 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-4.png)

And that is it! You've deployed an ERC-721 token contract using OpenZeppelin's contracts and libraries. Next, you can interact with your token contract via Remix, or add it to MetaMask.

### Deploying an ERC-1155 Token {: #deploying-an-erc-1155-token }

For this example, an ERC-1155 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **`ERC1155.sol`** — ERC-1155 token implementation with the optional features from the base interface. Includes the supply mechanism with a `_mint` function but needs to be explicitly called from within the main contract
 - **`Pausable.sol`** — extension to allows pausing tokens transfer, mintings and burnings
 - **`Ownable.sol`** — extension to restrict access to certain functions

OpenZeppelin's ERC-1155 token contract provides a `_mint` function that can only be called in the `constructor` function. Therefore, this example creates 1000 tokens with an ID of `0`, and 1 unique token with an ID of `1`.

The first step is to go to [Remix](https://remix.ethereum.org/){target=_blank} and create a new file. For this example, the file name will be `ERC1155.sol`.

As shown for the [ERC-20 token](#deploying-an-erc-20-token), you'll need to write the smart contract and compile it. For this example, the following code is used:

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC1155, Ownable, Pausable {
    constructor() ERC1155("Test") {
        _mint(msg.sender, 0, 1000 * 10 ** 18, "");
        _mint(msg.sender, 1, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
```

This ERC-1155 token smart contract was extracted from the [Contract Wizard](#openzeppelin-contract-wizard), setting no `Base URI` and activating `Pausable` feature. The constructor function was modified to include the minting of both a fungible and a non-fungible token.

With the contract compiled, next you will need to:

 1. Head to the **Deploy & Run Transactions** tab
 2. Change the environment to **Injected Web3**. This will use MetaMask's injected provider. Consequently, the contract will be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 3. Select the proper contract to deploy. In this example, it is the `MyToken` contract inside the `ERC1155.sol` file
 4. If everything is ready, click on the **Deploy** button. Review the transaction information in MetaMask and confirm it
 5. After a few seconds, the transaction should get confirmed, and you should see your contract under **Deployed Contracts**

![Deploy ERC-1155 Contract with Remix](/images/builders/build/eth-api/dev-env/openzeppelin/contracts/oz-contracts-5.png)

And that is it! You've deployed an ERC-1155 token contract using OpenZeppelin's contracts and libraries. Next, you can interact with your token contract via Remix.

--8<-- 'text/_disclaimers/third-party-content.md'