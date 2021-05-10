---
title: Contracts & Libraries
description:  Learn how to deploy the most common OpenZeppelin contracts on Moonbeam thanks to its Ethereum compatibility features
---

# OpenZeppelin Contracts & Libraries

![OpenZeppelin Contracts Banner](/images/openzeppelin/ozcontracts-banner.png)

## Introduction

OpenZeppelin contracts and libraries have become a standard in the industry. They help developers minimize risk, as their open-source code templates are battle-tested for Ethereum and other blockchains. Their code includes the most used implementations of ERC standards and add-ons and often appears in guides and tutorials around the community.

Because Moonbeam is fully Ethereum compatible, all of OpenZeppelin's contracts and libraries can be implemented without any changes.

This guide is divided into two sections. The first part outlines a conceptual introduction to the most common OpenZeppelin libraries and ERC token standards. The second section provides a step-by-step guide on how you can deploy these contracts on Moonbeam. 

## Introduction to OpenZeppelin's Contracts & Libraries

This section outlines some of the most commonly used contracts/libraries from OpenZeppelin. Each contract might have variants to expand its functionalities.

You can find a list of all the available contracts and libraries in OpenZeppelin's [documentation site](https://docs.openzeppelin.com/contracts/4.x/).

### ERC20 Token Contract

It is a fungible token contract that follows the [ERC20 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/). Fungible means that all tokens are equivalent and interchangeable that is, of equal value. One typical example of fungible tokens is fiat currencies, where each equal-denomination bill has the same value.

One way of looking at ERC20 token contracts is as a table where each row represents an address and each column a different property. For example, three basic properties are the balance of the address, spenders, and allowances. The owner of that balance can approve other addresses to make transfers on their behalf. Each spender has an allowance, or a balance they are allowed to transfer.

The basic interface of the ERC20 token standard is covered in the [EIP-20](https://eips.ethereum.org/EIPS/eip-20). Tokens can have (but are not obliged to) have a name, symbol, and custom decimal structure.

OpenZeppelin provides a set of core contracts that implement the behavior specified in the EIP.

 - [**IERC20**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20) — the basic interface that all ERC20 tokens must have
 - [**IERC20Metadata**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20Metadata) — extended interface to include the three optional functions: name, symbol and decimals
 - [**ERC20**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20) — implementation of the ERC20 interface, including the three optional functions. In addition, it includes a supply mechanism with a minting function

Some of the extensions available are:

 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroyed, meaning that the total supply contracts
 - [**ERC20Capped**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Capped) — adds a cap to the supply of tokens
 - [**ERC20Pausable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Pausable) — allows pausing token transfers, minting, and burning
 - [**ERC20Snapshot**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Snapshot) — allows for balances and total supply to be recorded when a snapshot is created

You can find more information regarding draft EIPs, presets, and utilities in their [ERC20 documentation site](https://docs.openzeppelin.com/contracts/4.x/erc20).

All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC20 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC20).

### ERC721 Token Contract

It is a non-fungible token contract that follows the [ERC721 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/). Non-fungible means that each token is different, and therefore, unique. An ERC721 token can represent ownership of that unique item, whether it is a collectible item in a game, real state, and so on. 

The basic interface of the ERC721 token standard is covered in the [EIP-721](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin provides a set of core contracts that implement the behavior specified in the EIP.

 - [**IERC721**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721) — required interface that is ERC721 compliant
 - [**IERC721Metadata**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Metadata) — extended interface to include the token name, symbol and token URI (Uniform Resource Identifier), which represents the token metadata
 - [**IERC721Enumerable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Enumerable) — extended interface to enumerate tokens in the contracts, making them discoverable though some added functions
 - [**ERC721**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721) — implementation of the ERC721 interface, including the Metadata extension
 - [**ERC721Enumerable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Enumerable) — implementation of the ERC721 interface, including the Metadata and Enumerable extensions

Some of the extensions available are:

 - [**ERC721Pausable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Pausable) — allows pausing token transfers, minting, and burning
 - [**ERC721Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Burnable) — allows for tokens to be irreversibly destroyed (burned)
 - [**ERC721URIStorage**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage) — allows for storage base token URI management

You can find more information regarding draft EIPs, presets, and utilities in their [ERC721 documentation site](https://docs.openzeppelin.com/contracts/4.x/erc721).

All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC721 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC721).

### ERC1155 Token Contract

It is also known as the multi-token contract, because it is able to represent both fungible and non-fungible tokens in a single smart contract. It draws ideas from all [ERC20](https://docs.openzeppelin.com/contracts/4.x/erc20), [ERC721](https://docs.openzeppelin.com/contracts/4.x/erc1155#721.adoc) and [ERC777](https://docs.openzeppelin.com/contracts/4.x/erc777) token standards.

Tokens are organized by IDs, similar to the ERC721 token contract. But each ID can have multiple units (or tokens). Therefore, if a token ID has only 1 unit, it acts as a non-fungible token. On the contrary, if a token ID has multiple units, it acts as a fungible token

The basic interface of the ERC1155 token standard is covered in the [EIP-1155](https://eips.ethereum.org/EIPS/eip-1155). OpenZeppelin provides a set of core contracts that implement the behavior specified in the EIP.

 - [**IERC1155**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#IERC1155) — required interface that is ERC1155 compliant
 - [**IERC1155MetadataURI**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#IERC1155MetadataURI) — extended interface to include the token URI (Uniform Resource Identifier), which represents the token metadata
 - [**ERC1155**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#ERC1155) — implementation of the ERC1155 interface, including the Metadata extension
 - [**IERC1155Receiver**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#IERC1155Receiver) — interface to accept transfers of ERC1155 tokens

Some of the extensions available are:

 - [**ERC1155Pausable**](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/token/ERC1155/extensions/ERC1155Pausable.sol) — allows pausing token transfers, minting, and burning
 - [**ERC1155Burnable**](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.1/contracts/token/ERC1155/extensions/ERC1155Burnable.sol) — allows for tokens to be irreversibly destroyed (burned)

You can find more information regarding draft EIPs, presets and utilities in their [ERC1155 documentation site](https://docs.openzeppelin.com/contracts/4.x/erc1155).

All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC1155 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC1155).

### Safe Math

Basic mathematic calculations on smart contracts can produce under and overflow vulnerabilities. This happens when a variable type is not able to store a value, so it wraps around. For example, a `uint8` can store numbers between 0-255. If an `uint8` variable equals 255, and you add one, it will wrap around (overflow) and return 0.

With the introduction of Solidity `0.8`, the compiler has now built-in overflow checking. Nevertheless, OpenZeppelin provides the [SafeMath library](https://docs.openzeppelin.com/contracts/4.x/utilities#math), which protects contracts from under and overflows if you are using Solidity prior `0.8`. Make sure to use the right version for your contracts. You can find the master `SafeMath.sol` file in their [GitHub repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/utils/math).

The library provides the following functions (names are dependant on the version being used):
 
 - **add** — adds two unsigned integers, checking for overflow
 - **subtract** — subtracts two unsigned integers, checking for underflow
 - **multiply** — multiplies two unsigned integers, checking for overflow 
 - **divide** — divides two unsigned integers, checking for division by zero
 - **modulus** — returns the remainder of dividing two unsigned integers, checking for division by zero

### Address

Sometimes it is important to check if the address a smart contract is interacting with is another smart contract. `Address.sol` is a set of functions related to address type. For example, it has a method called `isContract(address)` that returns `false` if the input address is:

 - An externally-owned account
 - A contract in construction
 - An address where a contract will be created
 - An address where a contract lived, but was destroyed

The contract has other functions as well. You can find all the information regarding the `Address.sol` contract in OpenZeppelin's [documentation site](https://docs.openzeppelin.com/contracts/4.x/api/utils#Address). Also, the master file can be found in their [GitHub repo](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol).

### Ownable

Developers might want to restrict access to certain functions in their smart contracts. `Ownable.sol` provides the most common and basic form of access control, where there is an address/account saved in the contract's storage as the owner. The contract has the modifier `onlyOwner` that restricts access to a function when used.

By default, the deployer of the contract is marked as the owner, and it allows the owner to:

 - Transfer ownership to another account
 - Renounce ownership by setting the owner to a null address. Note that when doing so, all functions that rely on the `onlyOwner` modifier will no longer be accessible

 You can find all the information regarding the `Ownable.sol` contract in OpenZeppelin's [documentation site](https://docs.openzeppelin.com/contracts/4.x/access-control#ownership-and-ownable). Also, the master file can be found in their [GitHub repo](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol).


## Deploying OpenZeppelin Contracts on Moonbeam

This section goes through the steps for deploying OpenZeppelin contracts on Moonbeam Currently, it covers the following contracts:

 - ERC20 (fungible tokens)
 - ERC721 (non-fungible tokens)
 - ERC1155 (multi-token standard)
 
### Checking Prerequisites

The steps described in this section assumes you have [MetaMask](https://metamask.io/) installed and connected to the Moonbase Alpha TestNet. Contract deployment is done using the [Remix IDE](https://remix.ethereum.org/) via the "Injected Web3" environment. You can corresponding tutorials in the following links:

 - [Interacting with Moonbeam using MetaMask](https://docs.moonbeam.network/integrations/wallets/metamask/)
 - [Interacting with Moonbeam using Remix](https://docs.moonbeam.network/integrations/remix/)

### Deploying an ERC20 Token

For this example, an ERC20 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **ERC20.sol** — ERC20 token implementation with the optional features from the base interface. Includes the supply mechanism with a `mint` function, but needs to be explicitly called from within the main contract
 - **Ownable.sol** — extension to restrict access to certain functions

The mintable ERC20 OpenZeppelin token contract provides a `mint` function that can only be called by the owner of the contract. By default, the owner is the contract's deployer address. There is also a premint of `1000` tokens sent to the contract's deployer configured in the `constructor` function.

The first step is to go to [Remix](https://remix.ethereum.org/) and create a new file. For this example, the file name will be `ERC20.sol`.

IMAGE HERE

Next, it is time to write your smart contract. In this case, the following code is used:

```
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

Once your smart contract is written, head to the "Solidity Compiler` tab and click on the compile button. Alternatively, you can check the "Auto compile" feature.

IMAGE HERE

With the contract compiled, head to the "Deploy & Run Transactions" tab. In here, you need to:

 1. Change the environment to "Injected Web3". This will use MetaMask's injected provider. Consequently, the contract wil be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 2. Select the right contract to deploy. In this example, it is the `MyToken` contract inside the `ERC20.sol` file
 3. If everything is ready, click on the "Deploy" button. Review the transaction information in MetaMask and confirm it
 4. After a few seconds, the transaction should get confirmed and you should see your contract under "Deployed Contracts"

IMAGE HERE

And that is it! You've deployed an ERC20 token contract using OpenZeppeling's contracts and libraries. Next, you can interact with your token contract via Remix, or add it to MetaMask.

### Deploying an ERC721 Token

For this example, an ERC721 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **ERC721** — ERC721 token implementation with the optional features from the base interface. Includes the supply mechanism with a `_mint` function, but needs to be explicitly called from within the main contract
 - **Burnable** — extension to allow tokens to be destroyed by their owners (or approved addresses)
 - **Enumerable** — extension to allow on-chain enumeration of tokens
 - **Ownable.sol** — extension to restrict access to certain functions

The mintable ERC721 OpenZeppelin token contract provides a `mint` function that can only be called by the owner of the contract. By default, the owner is the contract's deployer address.

The first step is to go to [Remix](https://remix.ethereum.org/) and create a new file. For this example, the file name will be `ERC721.sol`.

As shown for the [ERC20 token](#deploying-an-erc20-token), you'll need to write the smart contract and compile it. For this example, the following code is used:

```
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

With the contract compiled, head to the "Deploy & Run Transactions" tab. In here, you need to:

 1. Change the environment to "Injected Web3". This will use MetaMask's injected provider. Consequently, the contract wil be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 2. Select the right contract to deploy. In this example, it is the `MyToken` contract inside the `ERC721.sol` file
 3. If everything is ready, click on the "Deploy" button. Review the transaction information in MetaMask and confirm it
 4. After a few seconds, the transaction should get confirmed and you should see your contract under "Deployed Contracts"

IMAGE HERE

And that is it! You've deployed an ERC721 token contract using OpenZeppeling's contracts and libraries. Next, you can interact with your token contract via Remix, or add it to MetaMask.

### Deploying an ERC1155 Token

For this example, an ERC1155 token will be deployed to Moonbase Alpha. The final code used combines different contracts from OpenZeppelin:

 - **ERC1155** — ERC1155 token implementation with the optional features from the base interface. Includes the supply mechanism with a `_mint` function, but needs to be explicitly called from within the main contract
 - **Pausable** — extension to allows pausing tokens transfer, mintings and burnings
 - **Ownable.sol** — extension to restrict access to certain functions

OpenZeppelin's ERC1155 token contract provides a `_mint` function that can only be called in the `constructor` function. Therefore, this examples creates 1000 tokens withn an ID of `0`, and 1 unique token with an ID of `1`.

The first step is to go to [Remix](https://remix.ethereum.org/) and create a new file. For this example, the file name will be `ERC1155.sol`.

As shown for the [ERC20 token](#deploying-an-erc20-token), you'll need to write the smart contract and compile it. For this example, the following code is used:

```
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

With the contract compiled, head to the "Deploy & Run Transactions" tab. In here, you need to:

 1. Change the environment to "Injected Web3". This will use MetaMask's injected provider. Consequently, the contract wil be deployed to whatever network MetaMask is connected to. MetaMask might show a pop-up outlining that Remix is trying to connect to your wallet
 2. Select the right contract to deploy. In this example, it is the `MyToken` contract inside the `ERC1155.sol` file
 3. If everything is ready, click on the "Deploy" button. Review the transaction information in MetaMask and confirm it
 4. After a few seconds, the transaction should get confirmed and you should see your contract under "Deployed Contracts"

IMAGE HERE

And that is it! You've deployed an ERC1155 token contract using OpenZeppeling's contracts and libraries. Next, you can interact with your token contract via Remix.