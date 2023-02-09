---
title: Cross-Chain DAO
description: Go over the elements of how a cross-chain DAO could be implemented on Moonbeam in this tutorial.
---

# Thinking About a Cross-Chain DAO

![Banner Image](/images/tutorials/foundry-start-to-end/foundry-banner.png)

_February 12th, 2022 | by Jeremy Boetticher_

## Introduction {: #introduction } 

Moonbeam works hard to support interoperability and cross-chain logic. Its connected contracts initiative requires an updating of previously understood smart contract concepts so that they fit a cross-chain world. While some cross-chain primitives have been in the works for years, such as cross-chain tokens, others are only starting to be worked on: such as cross-chain swaps, AMMs, and in of particular interest for this tutorial: DAOs.  

In this tutorial, we will work through a thought process of writing smart contracts for a cross-chain DAO. The smart contracts in this example will be based off of OpenZeppelin's Governance smart contracts to demonstrate an evolution from single-chain to cross-chain and to highlight some incompatibilities that one might face when converting a dApp concept from single-chain to cross-chain. The cross-chain protocol used in this example will be [LayerZero](/builders/interoperability/protocols/layerzero){target=_blank}, but you are encouraged to adapt its concepts to any other protocol that you see fit, since cross-chain concepts often overlap between the protocols that Moonbeam hosts.  

## Checking Prerequisites {: #checking-prerequisites } 

Before we get to any theorizing, you will need the following:

 - Have an account with funds. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank}
 - Have a [Moonscan API Key](/builders/build/eth-api/verify-contracts/api-verification/#generating-a-moonscan-api-key){target=_blank}

The example project for this Tutorial will use HardHat, prerequisite knowledge of which will be helpful for this tutorial, which is slightly advanced.  

## Intuition And Planning {: #intuition-and-planning }

DAO stands for "Decentralized Autonomous Organization". In order for a smart contract to be a DAO, it must be:  

- **Decentralized** — control is separated and distributed among many actors
- **Autonomous** — much of the execution must occur without the reliance on a single person or team
- **Organized** — there must be a way for actions to be taken

One of the best single-chain DAOs is [Compound Finance's DAO](https://compound.finance/governance){target=_blank}. This DAO is a smart contract that allows proposals for on-chain transactions to be sent by the DAO, hence it is an organization that can take actions. It is decentralized because proposals are voted on by holders of the Compound Finance token. It is autonomous, because execution of the proposals are permissionless, and thus do not rely any specific person or team.  

Let's take a look at the phases that a proposal in a DAO takes:  

![Typical DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-1.png)

1. **Proposal** — a user proposes that the DAO should execute one or more transactions
2. **Voting** — after a voting delay time period, a voting period opens, which allows users to vote with their voting weight. The voting weight is determined by a token balances snapshot typically taken sometime between the proposal start and the end of the voting delay period  
3. **Timelock** — an optional period that allows users to exit the ecosystem (sell their tokens) before the proposal can be executed
4. **Execution** — if the vote is successful, any user can execute it trustlessly

But what about a cross-chain DAO? In a cross chain DAO, the actions that you would typically should also be available cross-chain: proposals, votes, executions, cancellations, etc. This requires a more complex architecture, since a lot of information has to be replicated across-chains.  

![Cross Chain DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-2.png)

Before we look through this, let's first talk a little about cross-chain models. There are many ways to architecture a cross-chain DApp. You could make a more distributed system, where data and logic are distributed to multiple chains to maximize their use. On the other hand, you could use a hub-and-spoke model, where the main logic and data are stored on a single chain, and cross-chain messages will interact with it.  

The process shown above makes it so that anyone can vote from across chains, so long as they hold the DAO token. We are using a hybrid between a hub-and-spoke and a distributed graph. For holding information that is read-only, we will be storing it on a single chain. Rare one-off actions such as proposals, cancellations, and so on are best done as a hub-and-spoke model. For information regarding voting logic, since users will be voting on multiple chains, voting weight and vote sums will be stored on each spoke chain and only sent to the hub chain after voting is over.  

Let's break down some of the steps in more detail:  

1. **Proposal** — a user proposes that the DAO should execute one or more transactions on the **hub** chain. A cross-chain message is sent to the satellite smart contracts on the **spoke** chains to let them know the parameters of the vote to take place  
2. **Voting** — after a voting delay time period, a voting period opens, which allows users to vote with their voting weight on every chain. The voting weight is determined by a cross-chain token's balance on each chain at a certain timestamp between the proposal start and end  
3. **Collection** — after the voting period, the cross-chain DAO on the **hub** chain sends a request to the **spoke** chains to send the voting results of each chain to the **hub** chain  
4. **Timelock** — an optional period that allows users to exit the ecosystem (sell their tokens) before the proposal can be executed  
5. **Execution** — if the vote is successful, any user can execute it trustlessly on the **hub** chain   

This is, of course, only one way to implement a cross-chain DAO, and you are encouraged to think of alternative and better ways. In the next section, we will look at an implementation.

## Writing the Cross-Chain DAO {: #writing-the-cross-chain-dao }

Before we start writing the entire project, it's important to note that it can be found in its own [cross-chain DAO GitHub repository](https://github.com/jboetticher/cross-chain-dao){target=_blank}, so if at any point some code doesn't make sense, you can find its full version there.  

A logical starting point for thinking about writing a cross-chain DAO is its predecessor: a single-chain DAO. There are many different implementations that exist, but since [OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank} hosts an already popular smart contract repository, we will use their Governance smart contracts. A second reason why we're using OpenZeppelin's smart contracts is because they're based off of Compound Finance's DAO, which we've already investigated in the [previous section](#intuition-and-planning).  

A good way to play with the configurations of the Governance smart contract is to use the OpenZeppelin smart contract wizard. By going to the [OpenZeppelin website's contract page](https://www.openzeppelin.com/contracts){target=_blank}, scrolling down, and clicking on the Governance tab, you can view the different ways that you can configure the Governance smart contract. Open it up and play around with it to figure out a simple base for our cross-chain DAO.  

![OpenZeppelin Contract Wizard](/images/tutorials/cross-chain-dao/cross-chain-dao-3.png)

We're going to try to keep this base smart contract as simple as possible for demonstration purposes. First, let's name the governor contract to be "CrossChainDAO", since that is what we'll turn it into. Be sure to set the voting delay as a single block or less to make it both easier for demonstrations and more difficult for certain attacks (more on that later). Additionally, be sure to set the voting period to something short, like 6 minutes. For calculating quorum (the minimum amount of vote weight required for a vote to pass), set it to the number (#) 1. Percentage increases complexity that won't add to this tutorial. Also disable Timelock, since the timelock period is optional anyways.  

Something similar to this is what you should be seeing now:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract CrossChainDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token)
        Governor("CrossChainDAO")
        GovernorSettings(1 /* 1 block */, 30 /* 6 minutes */, 0)
        GovernorVotes(_token)
    {}

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 1e18;
    }

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
```

This is the base that we will work off of to create our DAO. Let's now set up HardHat to set up our project.  

In a new folder, install hardhat:

```
npm install hardhat
```

Then, create a new project.  

```
npx hardhat
```  

You can learn more about [HardHat in our documentation](/builders/build/eth-api/dev-env/hardhat/){target=_blank} in case you haven't used it before. In the meantime, take the `CrossChainDAO` smart contract and add it to a new file `CrossChainDAO.sol` within the `contracts` folder.  

Next, let's start at the basics and sort out how users will have their voting power calculated.

### Cross-Chain DAO Token Contract {: #cross-chain-dao-token-contract }

In Compound Finance's DAO, a user needed the COMP token to vote. OpenZeppelin's `Governor` smart contract also has this feature, abstracting the tokens to votes feature into an [`IVotes` interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/utils/IVotes.sol){target=_blank}.  

The IVotes interface requires a lot of different functions to represent the different weights in a voting scheme. Fortunately, OpenZeppelin has provided an ERC-20 implementation of IVotes already, called [ERC20Votes](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol){target=_blank}. The only thing we have to do is make it cross-chain.  

Previously, it was mentioned that LayerZero is being used for this tutorial. LayerZero was chosen because of their [OFT contract](https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/oft/OFT.sol){target=_blank}, which makes it extremely easy to make an ERC-20 token cross chain. This doesn't mean that you have to use LayerZero though: every other cross-chain protocol has their own methods and ability to create cross-chain assets.  

To use LayerZero's OFT smart contracts, install them as a package:  

```
npm i @layerzerolabs/solidity-examples
```

Then, create a new file in the `contracts` folder named `OFTVotes`.  

Add the following:  

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/IOFT.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/OFTCore.sol";

abstract contract OFTVotes is OFTCore, ERC20Votes, IOFT {
    constructor(string memory _name, string memory _symbol, address _lzEndpoint) ERC20(_name, _symbol) OFTCore(_lzEndpoint) {}
}
``` 

As you can see, `OFTVotes` is an abstract smart contract that inherits from the `OFTCore`, `ERC20Votes`, and `IOFT` smart contracts. This will give it both cross-chain ERC-20 properties as well as voting properties if properly implemented. So let's do that by adding the following functions to the `OFTVotes` smart contract:  

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(OFTCore, IERC165) returns (bool) {
    return interfaceId == type(IOFT).interfaceId || interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
}

function token() public view virtual override returns (address) {
    return address(this);
}

function circulatingSupply() public view virtual override returns (uint) {
    return totalSupply();
}

function _debitFrom(address _from, uint16, bytes memory, uint _amount) internal virtual override returns(uint) {
    address spender = _msgSender();
    if (_from != spender) _spendAllowance(_from, spender, _amount);
    _burn(_from, _amount);
    return _amount;
}

function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns(uint) {
    _mint(_toAddress, _amount);
    return _amount;
}
```

Most of these functions are just ensuring compatibility with the smart contract that they inherit from. The `supportsInterface` function supports the `IERC165` standard. The `token` function indicates that, yes, the token smart contract _is indeed_ the token smart contract (some OFT implementations may want to separate the cross-chain and token aspects into different contracts). The `circulatingSupply` smart contract just rewraps circulating supply as the current `totalSupply`.  

The `_debitFrom` function is a little spicier: it includes logic to to burn tokens so that the token bridge works. Similarly, the `_creditTo` function includes logic to mint tokens. These two functions are required by the `OFTCore` smart contract. If you wondering why minting and burning is involved when most bridges wrap, it's because OFT [teleports assets](builders/xcm/overview/#xcm-transport-protocols){target=)blank} instead of wrapping them (similar to one of the XCM asset protocols).  

The `OFTVotes` contract is abstract, so lets create a final smart contract that we'll deploy. In the `contracts` folder, create a new smart contract called `CrossChainDAOToken.sol` and add the following:  

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OFTVotes.sol";

contract CrossChainDAOToken is OFTVotes {
    constructor(uint256 _initialSupply, address _lzEndpoint)
        OFTVotes("Cross Chain DAO Token", "CCDT", _lzEndpoint)
        ERC20Permit("Cross Chain DAO Token")
    {
        _mint(msg.sender, _initialSupply);
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
```

This smart contract isn't very special, since all it really does is add metadata and mint preliminary tokens to the user. All of the overriden functions are only there because of solidity rules, and simply default to the super implementation. The only reason we didn't add the metadata to `CrossChainDAOToken` is because in theory that smart contract could be reused elsewhere.  

The `CrossChainDAOToken` smart contract is ready for deployment, but we have other smart contracts to write first!  

### Cross Chain DAO Contract {: #cross-chain-dao-contract }

hoo boy

### Vote Aggregator Contract {: #vote-aggregator-contract }

maybe better

### Simple Incrementer Contract {: #simple-incrementer-contract }

This is the quick and easy one, are you ready? We need an execution to take place when testing out this cross-chain DAO, so here's a very tiny smart contract that does a quick number add. Super easy to implement and super easy to test with.  

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract SimpleIncrementer {
    uint256 public incrementer;

    function increment() external {
        incrementer += 1;
    }
}
```

## Deploying and Testing {: #deploying-and-testing }

## Caveats and Other Designs {: #caveats-and-other-designs }

--8<-- 'text/disclaimers/general.md'
