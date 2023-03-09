---
title: Building a Cross-Chain DAO with OpenZeppelin's Governor
description: Go over the elements of how a cross-chain DAO could be implemented on Moonbeam in this tutorial.
---

# Building a Cross-Chain DAO with OpenZeppelin's Governor Contract

![Banner Image](/images/tutorials/cross-chain-dao/cross-chain-dao-banner.png)

_February 12th, 2022 | by Jeremy Boetticher_

## Introduction {: #introduction } 

Moonbeam works hard to support interoperability and cross-chain logic. Its connected contracts initiative requires an updating of previously understood smart contract concepts so that they fit a cross-chain world. While some cross-chain primitives have been available for years, such as cross-chain tokens, others are only starting to be worked on: such as cross-chain swaps, AMMs, and in of particular interest for this tutorial: DAOs.  

In this tutorial, we will work through a thought process of writing smart contracts for a cross-chain DAO. The smart contracts in this example will be based off of OpenZeppelin's Governance smart contracts to demonstrate an evolution from single-chain to cross-chain and to highlight some incompatibilities that one might face when converting a DApp concept from single-chain to cross-chain. The cross-chain protocol used in this example will be [LayerZero*](/builders/interoperability/protocols/layerzero){target=_blank}, but you are encouraged to adapt its concepts to any other protocol that you see fit, since cross-chain concepts often overlap between the protocols that Moonbeam hosts.  

The purpose of this tutorial is not to be the end-all-be-all definition of what a cross-chain DAO would be like, but instead to provide an example of thinking about the intricacies of writing a significantly complex cross-chain DApp. The focus of this tutorial will be on architecture and specifically cross-chain smart contract logic instead of deploying and testing. The following smart contracts **are not tested or recommended** for production use. That being said, feel free to take inspiration from some of the design choices if you decide to write your cross-chain DAO. The full code base and demonstration of the DAO is available in a [GitHub repository](https://github.com/jboetticher/cross-chain-dao){target=_blank}, with relevant instructions.  

<div class='disclaimer'>
--8<-- 'text/disclaimers/third-party-content-intro.md'
</div>

## Intuition And Planning {: #intuition-and-planning }

DAO stands for "Decentralized Autonomous Organization". In order for a smart contract to be a DAO, it must be:  

- **Decentralized** — control is separated and distributed among many actors
- **Autonomous** — execution must occur without the reliance on a single person, government, or team
- **Organized** — there must be a way for actions to be proposed and then taken: code is law

One of the best single-chain DAOs is [Compound Finance's DAO](https://compound.finance/governance){target=_blank}. It is organized because the smart contract allows users to propose actions to be taken on chain in the form of transaction parameters, which are later executed with the smart contract being the origin. It is autonomous, because execution of the proposals are permissionless, and thus do not rely any specific person or team. It is decentralized because proposals are voted on by holders of the Compound Finance token.  

Let's take a look at the phases that a proposal in a DAO like Compound Finance's takes:  

![Typical DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-1.png)

1. **Proposal** — a user proposes that the DAO should execute one or more transactions
2. **Voting** — after a voting delay time period, a voting period opens, which allows users to vote with their voting weight. The voting weight is determined by a token balances snapshot typically taken sometime between the proposal start and the end of the voting delay period  
3. **Timelock** — an optional period that allows users to exit the ecosystem (sell their tokens) before the proposal can be executed
4. **Execution** — if the vote is successful, any user can execute it trustlessly

But what about a cross-chain DAO? In a cross chain DAO, the actions that you would typically should also be available cross-chain: proposals, votes, executions, cancellations, etc. This requires a more complex architecture, since a lot of information has to be replicated across-chains.  

There are many ways to architecture a cross-chain DApp. You could make a more distributed system, where data and logic are distributed to multiple chains to maximize their use. On the other end of the spectrum, you could use a hub-and-spoke model: where the main logic and data are stored on a single chain, and cross-chain messages will interact with it.  

![Cross Chain DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-2.png)

Let's break down some of the steps in more detail:  

1. **Proposal** — a user proposes that the DAO should execute one or more transactions on the **hub** chain. A cross-chain message is sent to the satellite smart contracts on the **spoke** chains to let them know the parameters of the vote to take place  
2. **Voting** — after a voting delay time period, a voting period opens, which allows users to vote with their voting weight on every chain. The voting weight is determined by a cross-chain token's balance on each chain at a certain timestamp between the proposal start and end  
3. **Collection** — after the voting period, the cross-chain DAO on the **hub** chain sends a request to the **spoke** chains to send the voting results of each chain to the **hub** chain  
4. **Timelock** — an optional period that allows users to exit the ecosystem (sell their tokens) before the proposal can be executed  
5. **Execution** — if the vote is successful, any user can execute it trustlessly on the **hub** chain   

!!! note
    Take note of the new collection phase. This is where the cross-chain aspect changes the logic the most. Essentially, the votes on each spoke chain must be collected and submitted to the hub chain after the voting period is over.

The process shown here makes it so that anyone can vote from across chains, so long as they hold the DAO token. For holding information that is read-only, we will be storing it on a single chain. Rare one-off actions such as proposals, cancellations, and so on are best done as a hub-and-spoke model. For information regarding voting logic, since users will be voting on multiple chains, voting weight and vote sums will be stored on each spoke chain and only sent to the hub chain after voting is over, since doing cross-chain actions are generally expensive.  

![Smart contracts overview](/images/tutorials/cross-chain-dao/cross-chain-dao-3.png)  

This is, of course, only one way to implement a cross-chain DAO, and you are encouraged to think of alternative and better ways. In the next section, we will look at an implementation.  

## Writing the Cross-Chain DAO {: #writing-the-cross-chain-dao }

Before we start writing the entire project, it's important to note that its finished form can be found in its own [cross-chain DAO GitHub repository](https://github.com/jboetticher/cross-chain-dao){target=_blank}. It uses HardHat, so [prerequisite knowledge](/builders/build/eth-api/dev-env/hardhat){target=_blank} will be helpful for understanding how the repository works. This tutorial will not include information how to use HardHat, and will instead focus solely on the smart contracts.   

A logical starting point for thinking about writing a cross-chain DAO is its predecessor: a single-chain DAO. There are many different implementations that exist, but since [OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank} hosts an already popular smart contract repository, we will use their Governance smart contracts. A second reason why we're using OpenZeppelin's smart contracts is because they're based off of Compound Finance's DAO, which we've already investigated in the [previous section](#intuition-and-planning).  

A good way to play with the configurations of the Governance smart contract is to use the OpenZeppelin smart contract wizard. By going to the [OpenZeppelin contract page](https://www.openzeppelin.com/contracts){target=_blank}, scrolling down, and clicking on the Governance tab, you can view the different ways that you can configure the Governance smart contract. Open it up and play around with it to figure out a simple base for our cross-chain DAO.  

![OpenZeppelin Contract Wizard](/images/tutorials/cross-chain-dao/cross-chain-dao-4.png)

We're going to try to keep this base smart contract as simple as possible for demonstration purposes. First, let's name the governor contract to be "CrossChainDAO", since that is what we'll turn it into. Set the voting delay as 0 for simplicity and to make it so that the voting weight snapshot is taken immediately. It is easiest to set the voting period to something short, like 6 minutes. For calculating quorum (the minimum amount of vote weight required for a vote to pass), set it to the number (#) 1. Also disable Timelock, since the timelock period is optional anyways.  

You should see a contract similar to this:

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

    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }
}
```

Let's take the `CrossChainDAO` smart contract and add it to our working directory as `CrossChainDAO.sol`.  

Next, let's start at the basics and sort out how users will have their voting power calculated.

### Cross-Chain DAO Token Contract {: #cross-chain-dao-token-contract }

In Compound Finance's DAO, a user needed the COMP token to vote, which enables the decentralization aspect of a DAO. OpenZeppelin's `Governor` smart contract also has this feature, abstracting the tokens to votes feature into an [`IVotes` interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/utils/IVotes.sol){target=_blank}.  

The IVotes interface requires a lot of different functions to represent the different weights in a voting scheme. Fortunately, OpenZeppelin has provided an ERC-20 implementation of IVotes already, called [ERC20Votes](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol){target=_blank}.  

Recall [from earlier](#intuition-and-planning){target=_blank} that we intend to have users vote on each chain, and to only send voting data to the hub chain during the collection phase. This means that the voting weights must be stored on each chain. This is very easy, since all we have to do is ensure that the `ERC20Votes` contract is deployed on each chain, or in other words, make the DAO token a cross-chain token.  

Previously, it was mentioned that LayerZero is being used as the cross-chain protocol for this tutorial. LayerZero was chosen because of their [OFT contract](https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/oft/OFT.sol){target=_blank}, which makes it extremely easy to make an ERC-20 token cross chain. This doesn't mean that you have to use LayerZero though: every other cross-chain protocol has their own methods and ability to create cross-chain assets.  

To use LayerZero's OFT smart contracts in a smart contract project, you can install them as a package:  

```
npm i @layerzerolabs/solidity-examples
```

We will create a new file named `OFTVotes`:  

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

As you can see, `OFTVotes` is an abstract smart contract that inherits from the `OFTCore`, `ERC20Votes`, and `IOFT` smart contracts. This will give it both cross-chain ERC-20 properties as well as voting properties if properly implemented. Let's add the following function overrides to the `OFTVotes` smart contract:  

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

Most of these functions are just ensuring compatibility with the smart contracts that they inherit from. The `_debitFrom` function is a little spicier: it includes logic to burn tokens so that the token bridge works. Similarly, the `_creditTo` function includes logic to mint tokens. These two functions are required by the `OFTCore` smart contract. If you are wondering why minting and burning is involved when most bridges wrap, it's because OFT [teleports assets](builders/xcm/overview/#xcm-transport-protocols){target=_blank} instead of wrapping them (similar to one of the XCM asset protocols).  

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

This smart contract isn't very special, since all it really does is add metadata in the constructor and mint preliminary tokens to the user. All of the overriden functions are only there because of solidity rules, and they simply default to a parent contract's implementation. The only reason we didn't add the metadata to `OFTVotes` is because in theory that smart contract could be reused elsewhere.  

The `CrossChainDAOToken` smart contract is now ready for deployment on both spoke and hub chains. You can check its complete version in the [example repository](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainDAOToken.sol){target=_blank}.  

### Cross Chain DAO Contract Part 1 {: #cross-chain-dao-contract-part-1 }

Now to the meat of this tutorial: the cross chain DAO. To be clear, not *all* of the cross-chain logic will be stored in the cross-chain DAO smart contract. Instead, we will separate the hub logic into one contract and the [spoke chain logic into another](#dao-satellite-contract). This makes sense because of the hub-and-spoke model: some of the logic is stored on a single hub chain while the spoke chains interface with it through a simpler satellite contract. We don't need logic meant to be on spoke chains to be on the hub chain.  

We've already got a base for the cross-chain DAO when we used the OpenZeppelin Wizard in a [previous step](#writing-the-cross-chain-dao). It's time to edit it so that it is cross-chain. Let's list out the different functionalities that need to be added:  

1. Support for cross-chain messaging (through LayerZero in this specific example)
2. A new collection phase between voting and execution
3. Requesting the collection of votes from spoke chains
4. Receiving the collection of votes from spoke chains
5. (Optional) Receiving cross-chain messages to do non-voting actions, like proposing or executing

Let's start with the first task: supporting cross-chain messaging. For this implementation, we will use the `NonblockingLzApp` smart contract provided by LayerZero to make it easy to receive and send cross-chain messages. Most cross-chain protocols will have some smart contract to inherit from to receive a generic bytes payload, so you can use similar logic with a different parent smart contract.  

Let's import `NonblockingLzApp` and add it to the parent smart contracts of `CrossChainDAO`:  

```solidity
// ...other imports go here
import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract CrossChainDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, NonblockingLzApp {
    // ...
}
```

The `NonblockingLzApp` smart contract also requires an addition to the constructor, because it takes in LayerZero's on-chain smart contract as an input:

```solidity
    constructor(IVotes _token, address lzEndpoint)
        Governor("CrossChainDAO")
        GovernorSettings(0 /* 0 blocks */, 30 /* 6 minutes */, 0)
        GovernorVotes(_token)
        NonblockingLzApp(lzEndpoint)
    { }
```

The abstract contract `NonblockingLzApp` requires instructions on what to do when it receives cross-chain data data. To do this, override the following function like so:  

```solidity
function _nonblockingLzReceive( uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
    // TODO: add cross-chain logic
}
```

Now, what to put in the function? Let's think back to the requirements. For incoming messages, we must be able to receive the voting data from other chains during the collection phase. But we might also want to receive messages that do other actions, like execution or propose. How do we resolve this issue?  

!!! note
    For sake of simplicity, we won't implement cross-chain execution or proposals in this tutorial. The function selector concept is being introduced because it is an important topic in cross-chain DApps.  

Let's think about the EVM. How does a smart contract know that a transaction wants to call a specific function? Each function has a function selector, a hashed value that is mapped to a specific action. We can do the same thing, but with cross-chain messages and with integers instead of hashes.  

Add the following code to the `_nonblockingLzReceive` function:  

```solidity
// Gets a function selector option
uint16 option;
assembly {
    option := mload(add(_payload, 32))
}

// Some options for cross-chain actions are: propose, vote, vote with reason, vote with reason and params, cancel, etc...
if (option == 0) {
    onReceiveSpokeVotingData(_srcChainId, payload);
} else if (option == 1) {
    // TODO: Feel free to put your own cross-chain actions (propose, execute, etc)...
} else {
    // TODO: you could revert here if you wanted to
}
```

When cross-chain messages are received (from any cross-chain protocol), they come with an arbitrary bytes payload. Typically this bytes payload is created from an invocation of `abi.encode`, where multiple types of data are inserted. For the smart contract that receives this data, data must be decoded with `abi.decode`, where information is decoded in a manner that is expected. For example, if the receiving smart contract's logic requires a `uint16` and an `address` to function properly, it will decode by including `abi.decode(payload, (uint16, address))`.  

When we have multiple functionalities packed into a message with a single payload, that payload might come in multiple formats, since different functions will require different bytes. Hence, we must examine the function selector before decoding the entire message.  

By convention, we will define the function selector as a `uint16` variable stored at the start of the bytes payload. From here on out, we will ensure in our design that **every cross-chain message sent will have this `uint16` function selector at the start of its payload**.  

The assembly block loads data at `payload's address + 32 bytes` into the `option` variable. Understanding why this is necessary requires a bit of understanding of how `abi.encode` works. The first 32 bytes in an ABI encoded payload are dedicated to information on the entire payload's size. After these first 32 bytes, the rest of the information stored, which in this case is the function selector.  

!!! note
    The `abi.encode` function is used the most because it has the most support for dynamic types, but you could feasibly use `abi.encodePacked` if your use case permits. Assembly-level logic would have to change if you chose to make this change.

In the if statement below the assembly block, the number 0 maps to the option to receive the voting data from the other chains. You could add additional functionality to the next number, 1, such as proposing or executing. Feel free to do so in your own time. We will revisit this concept when writing the [`DAOSatellite` contract](#dao-satellite-contract).  

In the first block of the if statement, a function is being called, with the `_srcChainId` and the newly unwrapped `payload` being injected into it. We haven't written the `onReceiveSpokeVotingData` function yet, so let's add it to the smart contract:  

```solidity
function onReceiveSpokeVotingData(uint16 _srcChainId, bytes memory payload) internal virtual {
    // TODO: do something to store the external voting data for future use
}
```  

We'll finish this function later, because we need to override one of the OpenZeppelin parent smart contracts first before we implement it properly.  

### Cross Chain Governor Counting Contract {: #cross-chain-governor-counting-contract }

Receiving cross-chain voting data from `_nonblockingLzReceive` is pointless if is not stored or counted. Instead of housing this in the `CrossChainDAO`, that logic and storage will be in a parent contract.  

OpenZeppelin has divided many of the aspects of a DAO into multiple smart contracts, making it easier to replace sections of logic without having to change others. This helps with code base scalability and modularity, which we will take advantage of. We don't have to go over all of the different smart contracts that came with what came out of the OpenZeppelin smart contract wizard, but we do have to know what the [`GovernorCountingSimple` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target=_blank} does.  

The `GovernorCountingSimple` contract defines how votes are counted, and what votes are. It stores how many votes have been cast per proposal, what a vote can be (for, against, abstain), and it controls whether or not quorum has been reached.  

Fortunately, when converting to a cross-chain version, a lot of the counting logic does not change. The only difference between our cross-chain variant and the single-chain variant is that the cross-chain variant must account for the collection phase and the votes that come with it. Let's add in some of that logic.  

Before we write any custom code ourselves, copy and paste the [`GovernorCountingSimple` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target=_blank} into a new file named `CrossChainGovernorCountingSimple.sol`. You can get the contract from its repository or within the `node_modules` folder.  

Let's start making changes. Let's rename the contract to `CrossChainGovernorCountingSimple`:  

```solidity
abstract contract CrossChainGovernorCountingSimple is Governor {
    // ...
}
```

Now let's add a constructor. This constructor will take in a `uint16[]` to define the spoke chains that the `CrossChainDAO` smart contract will connect with.  

```solidity
// The lz-chain IDs that the DAO expects to receive data from during the collection phase
uint16[] public spokeChains;

constructor(uint16[] memory _spokeChains) {
    spokeChains = _spokeChains;
}
```

!!! challenge
    In a production-ready cross-chain DAO, you would make the spoke chains modifiable by governance instead of keeping it static. Can you add an additional function that would make this possible? Which address should have access to this function?  
    
    *Hint: replace the array with a mapping.*

As alluded to, add a struct and a corresponding map of them that will store the vote data received from other chains.  

```solidity
struct SpokeProposalVote {
    uint256 forVotes;
    uint256 againstVotes;
    uint256 abstainVotes;
    bool initialized;
}

// Maps a proposal ID to a map of a chain ID to summarized spoke voting data
mapping(uint256 => mapping(uint16 => SpokeProposalVote)) public spokeVotes;
```

You might notice that the `SpokeProposalVote` is based off of the [`ProposalVote` struct](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/dfcc1d16c5efd0fd2a7abac56680810c861a9cd3/contracts/governance/extensions/GovernorCountingSimple.sol#L23){target=_blank} in `GovernorCountingSimple`. The first difference is that the new struct includes a bool called `initialized` so that it's possible to check whether or not data was received from the spoke chain by retrieving the struct from the `spokeVotes` map. The second difference is that `SpokeProposalVote` does not include a map of users to votes because that information stays on the spoke chains and is not necessary for the calculations of whether or not a vote succeeded.  

!!! challenge
    The new `SpokeProposalVote` struct is very similar to the `ProposalVote` struct. Can you think of a more optimal data structure for the smart contract that requires only one struct?

Now we have a place to store the cross-chain data, and we have a data structure to organize it with. We also want the cross-chain data to matter when calculating if a vote reached quorum and if a vote passed. To do so, you'll need to edit the `_quorumReached` and `_voteSucceeded` functions.  

```solidity
function _quorumReached(uint256 proposalId) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    uint256 abstainVotes = proposalVote.abstainVotes;
    uint256 forVotes = proposalVote.forVotes;

    for (uint16 i = 0; i < spokeChains.length; i++) {
        SpokeProposalVote storage v = spokeVotes[proposalId][spokeChains[i]];
        abstainVotes += v.abstainVotes;
        forVotes += v.forVotes;
    }

    return quorum(proposalSnapshot(proposalId)) <= forVotes + abstainVotes;
}

function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool) {
    ProposalVote storage proposalVote = _proposalVotes[proposalId];
    uint256 againstVotes = proposalVote.againstVotes;
    uint256 forVotes = proposalVote.forVotes;

    for (uint16 i = 0; i < spokeChains.length; i++) {
        SpokeProposalVote storage v = spokeVotes[proposalId][spokeChains[i]];
        againstVotes += v.againstVotes;
        forVotes += v.forVotes;
    }
    return forVotes > againstVotes;
}
```

Here, the primary change is that it's not only the hub chain's votes being counted. By iterating through the stored cross-chain data from each of the spoke chains, the votes for each spoke chain are being added to the quorum and vote success calculations.  

That should be it for changes to how cross-chain votes are counted and stored. You can view the smart contract in its completed state in the [GitHub repository](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainGovernorCountingSimple.sol){target=_blank}.  

In regards to the cross-chain data, the only thing left is to finally *store* it. While the variable that it must be stored in, `spokeVotes`, is in `CrossChainGovernorCountingSimple`, it must be set within `CrossChainDAO`. Move on to the next section, where we'll finish the implementation of `_nonblockingLzReceive`.  

### Cross Chain DAO Contract Part 2 {: #cross-chain-dao-contract-part-2 }

Now it's time to come back to an implementation of the receiving function `onReceiveSpokeVotingData`, which will store the data received from spoke chains' cross-chain messages.  

We have already defined what type of information we want in `CrossChainGovernorCountingSimple`. Here we get to define what kind of information we want from the other chains. Of course, when looking at the `SpokeProposalVote` struct defined previously, we want three vote values: `forVotes`, `againstVotes`, and `abstainVotes`. Plus, we want to know for which proposal the data received is for, so we also want a proposal ID. Let's deconstruct the payload within `onReceiveSpokeVotingData` with that in mind:  

```solidity
function onReceiveSpokeVotingData(uint16 _srcChainId, bytes memory payload) internal virtual {
    (
        , // uint16 option
        uint256 _proposalId,
        uint256 _for,
        uint256 _against,
        uint256 _abstain
    ) = abi.decode(payload, (uint16, uint256, uint256, uint256, uint256));
}
```

We can now store the data within the `spokeVotes` map defined in `CrossChainGovernorCountingSimple`, so long as that data hasn't already been stored:  

```solidity
    // As long as the received data isn't already initialized...
    if (spokeVotes[_proposalId][_srcChainId].initialized) {
        revert("Already initialized!");
    } else {
        // Add it to the map (while setting initialized true)
        spokeVotes[_proposalId][_srcChainId] = SpokeProposalVote(
            _for,
            _against,
            _abstain,
            true
        );
    }
```

That's it for the `onReceiveSpokeVotingData` function. It required a lot of setup, but now the smart contract is ready to receive collection info. What about sending notices of proposals to other chains and requesting voting data?  

OpenZeppelin's `Governor` smart contract came with a `propose` function, but unfortunately it doesn't work for our purposes. When a user sends a proposal, the smart contract needs to send cross-chain messages to let the spoke chains know that there is a new proposal to vote on. But to transact those messages on the destination chains, we also need to pay for the gas. Most cross-chain protocols currently require extra gas paid in the origin chain's native currency for the destination chain's transaction, and that can only be sent via a payable function. The `propose` function is not payable, hence why we must write our own cross-chain version.  

!!! note
    Technically, the cross-chain messages should be sent when the voting delay is over to sync with when the voting weight snapshot is taken. In this instance, since the proposal and snapshot are made at the same time.

```solidity
function crossChainPropose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) 
    public payable virtual returns (uint256) {
    uint256 proposalId = super.propose(targets, values, calldatas, description);

    // Now send the proposal to all of the other chains
    if (spokeChains.length > 0) {
        uint256 crossChainFee = msg.value / spokeChains.length;

        // Iterate over every spoke chain
        for (uint16 i = 0; i < spokeChains.length; i++) {
            bytes memory payload = abi.encode(
                0, // Function selector "0" for destination contract
                // Encoding the proposal start
                abi.encode(proposalId, block.timestamp)
            );

            // Send a cross-chain message with LayerZero to the chain in the iterator
            _lzSend({
                _dstChainId: spokeChains[i],
                _payload: payload,
                _refundAddress: payable(address(this)),
                _zroPaymentAddress: address(0x0),
                _adapterParams: bytes(""),
                _nativeFee: crossChainFee
            });
        }
    }

    return proposalId;
}
```

This cross-chain version uses the original `propose` function included in the `Governor` smart contract, since all of its data structures and logic are still helpful. The only addition is a cross-chain message with information on the proposal (ID & snapshot timestamp) being sent to every spoke chain: the IDs of which are stored in the `CrossChainGovernorCountingSimple` contract.  

!!! note
    By using LayerZero, multiple messages must be sent in a single transaction so that every spoke chain can receive data. LayerZero, along with other cross-chain protocols, [is **unicast** instead of **multicast**](https://layerzero.gitbook.io/docs/faq/messaging-properties#multicast){target=_blank}. As in, a cross-chain message can only arrive to a single destination. When designing a hub-and-spoke architecture, research if your [protocol supports multicast messaging](https://book.wormhole.com/wormhole/3_coreLayerContracts.html?highlight=multicast#multicasting){target=_blank}, as it may be more succinct. 

Remember when we designed the `CrossChainDAO` smart contract's `_nonblockingLzReceive` function to expect a function selector? This is the same idea, except now we're expecting the satellite smart contract to also implement these features. So in this case, we've defined `0` as receiving a new proposal.  

Now, let's add functions to begin and end the collections phase. This can be done with a new public facing function similar to the `execute` and `propose` functions. 

```solidity
// Requests the voting data from all of the spoke chains
function requestCollections(uint256 proposalId) public payable {
    require(
        block.number > proposalDeadline(proposalId),
        "Cannot request for vote collection until after the vote period is over!"
    );
    require(
        !collectionStarted[proposalId],
        "Collection phase for this proposal has already started!"
    );

    collectionStarted[proposalId] = true;

    // Sends an empty message to each of the aggregators. If they receive a message at all,
    // it is their cue to send data back
    uint256 crossChainFee = msg.value / spokeChains.length;
    for (uint16 i = 0; i < spokeChains.length; i++) {
        // Using "1" as the function selector
        bytes memory payload = abi.encode(1, abi.encode(proposalId));
        _lzSend({
            _dstChainId: spokeChains[i],
            _payload: payload,
            _refundAddress: payable(address(this)),
            _zroPaymentAddress: address(0x0),
            _adapterParams: bytes(""),
            _nativeFee: crossChainFee
        });
    }
}
```

Starting the collection phase requires that a proposal must exist and that the collection phase for the proposal has not started. Similar to the proposal function, this function sends a cross-chain message to every spoke chain. The only information that the message includes is a function selector and a proposal ID.    

Finally, let's also make it so that the execution of a proposal cannot occur without the collection phase being finished:  

```solidity
function _beforeExecute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override {
    finishCollectionPhase(proposalId);

    require(
        collectionFinished[proposalId],
        "Collection phase for this proposal is unfinished!"
    );

    super._beforeExecute(proposalId, targets, values, calldatas, descriptionHash);
}

// Marks a collection phase as true if all of the satellite chains have sent a cross-chain message back
function finishCollectionPhase(uint256 proposalId) public {
    bool phaseFinished = true;
    for (uint16 i = 0; i < spokeChains.length && phaseFinished; i++) {
        phaseFinished =
            phaseFinished &&
            spokeVotes[proposalId][spokeChains[i]].initialized;
    }

    collectionFinished[proposalId] = phaseFinished;
}
```

Here, before a proposal is executed, the collection phase must be finished. This ensures that a proposal will not be executed until all of the votes from all of the chains are counted.  

If you wanted, you could turn the `requestCollections` function into a cross-chain action as well, but this will not be included in this tutorial. If you want to view the completed smart contract, it is available in its [GitHub repository](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/CrossChainDAO.sol){target=_blank}. 

### DAO Satellite Contract {: #dao-satellite-contract }

So far, we've only talked about the cross-chain DAO and its accompanying token. The cross-chain DAO is never deployed on the spoke chains, because it wouldn't be efficient to replicate *all* of the data across each spoke chain. But, we still need an interface to work with the `CrossChainDAO` smart contract on the spoke chains. Hence, we will create a satellite contract named `DAOSatellite`.  

Let's add the following dependencies and contract to a new contract `DAOSatellite`:  

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "@openzeppelin/contracts/utils/Checkpoints.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract DAOSatellite is NonblockingLzApp { 
    // TODO: add cross-chain interactions
}
```

Let's also add a constructor, some structs, and storage variables to use later. They're mainly stripped down versions of what are found in the `CrossChainDAO` and its parent contracts:  

```solidity
struct ProposalVote {
    uint256 againstVotes;
    uint256 forVotes;
    uint256 abstainVotes;
    mapping(address => bool) hasVoted;
}

enum VoteType {
    Against,
    For,
    Abstain
}

struct RemoteProposal {
    // Blocks provided by the hub chain as to when the local votes should start/finish.
    uint256 localVoteStart;
    bool voteFinished;
}

constructor(uint16 _hubChain, address _endpoint, IVotes _token, uint _targetSecondsPerBlock) 
    NonblockingLzApp(_endpoint) payable {
    hubChain = _hubChain;
    token = _token;
    targetSecondsPerBlock = _targetSecondsPerBlock;
}

uint16 public immutable hubChain;
IVotes public immutable token;
uint256 public immutable targetSecondsPerBlock;
mapping(uint256 => RemoteProposal) public proposals;
mapping(uint256 => ProposalVote) public proposalVotes;

function isProposal(uint256 proposalId) view public returns(bool) {
    return proposals[proposalId].localVoteStart != 0;
}
```

The constructor defines what the hub chain is (every chain has its own ID in LayerZero, and every other cross-chain protocol), the LayerZero endpoint, the cross-chain token that defines voting weight, and the average seconds per block on this weight (more on that later).  

Since this smart contract inherits from `NonblockingLzApp`, it requires `_nonblockingLzReceive` to receive cross-chain messages. This smart contract communicates with the `CrossChainDAO` smart contract, and recall that there are currently two instances that the `CrossChainDAO` sends a message:  

1. When the `CrossChainDAO` wants to notify the spoke chains of a new proposal (function selector is 0)  
2. When the `CrossChainDAO` wants the spoke chains to send their voting data to the hub chain (function selector is 1)  

Keeping that in mind, let's start with writing the receiving function `_nonblockingLzReceive` with a function selector just like the `CrossChainDAO`:  

```solidity
function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
    require(_srcChainId == hubChain, "Only messages from the hub chain can be received!");

    uint16 option;
    assembly {
        option := mload(add(_payload, 32))
    }

    // Do 1 of 2 things:
    // 0. Begin a proposal on the local chain, with local block times
    if (option == 0) { }
    // 1. Send vote results back to the hub chain
    else if (option == 1) { }
}
```

Let's tackle the first action, beginning a proposal on the local chain:  

```solidity
(, uint256 proposalId, uint256 proposalStart) = abi.decode(payload, (uint16, uint256, uint256));
require(!isProposal(proposalId), "Proposal ID must be unique.");

uint256 cutOffBlockEstimation = 0;
if(proposalStart < block.timestamp) {
    uint256 blockAdjustment = (block.timestamp - proposalStart) / targetSecondsPerBlock;
    if(blockAdjustment < block.number) {
        cutOffBlockEstimation = block.number - blockAdjustment;
    }
    else {
        cutOffBlockEstimation = block.number;
    }
}
else {
    cutOffBlockEstimation = block.number;
}

proposals[proposalId] = RemoteProposal(cutOffBlockEstimation, false);
```

This is some funky code because of a funky issue. Let's start at the first two lines. If you remember from the [CrossChainDAO section](#cross-chain-dao-contract-part-2), the information provided in the internal ABI encoded payload includes a proposal ID and the timestamp of when the proposal was made.  

Afterwards, some funky calculations are made to generate a `cutOffBlockEstimation`. This is a series of calculations to convert a timestamp to a block on the local spoke chain as accurately as possible. While it may not matter as much when people can start voting, it does matter when the vote weight snapshot is made. If the vote weight snapshot is made too far apart between the spoke and hub chains, a user could send a token from one chain to another and effectively double their voting weight. Note that the calculations made in the example code above are not enough to ensure a correct setup. Some [example mitigation strategies](#double-weight-attack-from-snapshot-mismatch) are listed below, but are too complex to investigate in detail for this tutorial. In the meantime, the only strategy is to subtract blocks from the current block based off of the timestamp a predetermined seconds-per-block estimate.  

After the calculation, a `RemoteProposal` struct is added to the proposals map, effectively registering the proposal and its voting related data on the spoke chain.  

Now let's look at how to send vote results back to the hub chain:  

```solidity
uint256 proposalId = abi.decode(payload, (uint256));
ProposalVote storage votes = proposalVotes[proposalId];
bytes memory votingPayload = abi.encode(
    0, 
    abi.encode(proposalId, votes.forVotes, votes.againstVotes, votes.abstainVotes)
);
_lzSend({
    _dstChainId: hubChain,
    _payload: votingPayload,
    _refundAddress: payable(address(this)),
    _zroPaymentAddress: address(0x0),
    _adapterParams: bytes(""),
    // NOTE: DAOSatellite needs to be funded beforehand, in the constructor.
    //       There are better solutions, such as cross-chain swaps being built in from the hub chain, but
    //       this is the easiest solution for demonstration purposes.
    _nativeFee: 0.1 ether 
});
proposals[proposalId].voteFinished = true;
```

This logic is relatively simple: first retrieving the proposal ID from the cross-chain message. Then, getting the data for said proposal from the relevant map. Next, encoding that data into a payload as defined by the `CrossChainDAO`. Finally, sending that data through LayerZero. The only issue here is that the gas payment for the cross-chain message's transaction on the hub chain must be included, and there is no simple way to receive it. There are [options that potentially avert this issue as explained below](#chained-cross-chain-message-fees), but for simplicity's sake, the satellite contract will have to be sent native currency every once in a while.  

Finally, the last thing to add is a vote mechanism that allows users to vote. This mechanism is nearly exactly the same as the mechanism in the [`GovernorCountingSimple` smart contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol){target=_blank}, so much of the code can be copied over:  

```
function castVote(uint256 proposalId, uint8 support) public virtual returns (uint256 balance)
{
    RemoteProposal storage proposal = proposals[proposalId];
    require(
        !proposal.voteFinished,
        "DAOSatellite: vote not currently active"
    );
    require(
        isProposal(proposalId), 
        "DAOSatellite: not a started vote"
    );

    uint256 weight = token.getPastVotes(msg.sender, proposal.localVoteStart);
    _countVote(proposalId, msg.sender, support, weight);

    return weight;
}

function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight) internal virtual 
{
    ProposalVote storage proposalVote = proposalVotes[proposalId];

    require(!proposalVote.hasVoted[account], "DAOSatellite: vote already cast");
    proposalVote.hasVoted[account] = true;

    if (support == uint8(VoteType.Against)) {
        proposalVote.againstVotes += weight;
    } else if (support == uint8(VoteType.For)) {
        proposalVote.forVotes += weight;
    } else if (support == uint8(VoteType.Abstain)) {
        proposalVote.abstainVotes += weight;
    } else {
        revert("DAOSatellite: invalid value for enum VoteType");
    }
}
```

Note that the `castVote` function requires that:  

1. The proposal isn't finished
2. The proposal exists, as in, there is data that's stored within the `proposals` map.

In fact, the `_countVote` function is [directly copied](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4fb6833e325658946c2185862b8e57e32f3683bc/contracts/governance/extensions/GovernorCountingSimple.sol#L78){target=_blank} from the hub chain! Much of the logic of single-chain dApps can be reused in cross-chain dApps with minor tweaks.  

That's it for breaking down the satellite contract. It was more or less simple because most of the logic is just a reflection of what happens on the hub chain. You can view the completed smart contract in its [GitHub repository](https://github.com/jboetticher/cross-chain-dao/blob/main/contracts/DAOSatellite.sol){target=_blank}.  

At this point, every single smart contract has been finished, and a deployment scheme like the one below can be made. If you are interested in seeing this in action, the [GitHub repository](https://github.com/jboetticher/cross-chain-dao){target=_blank} that hosts the cross-chain DAO allows you to deploy on TestNets.  

![Smart contracts overview](/images/tutorials/cross-chain-dao/cross-chain-dao-3.png)  

## Caveats and Other Designs {: #caveats-and-other-designs }

Every single part of the smart contract system has been written, and if you got through it all, good job! It's a lot to soak in, and there are still parts that need to be developed for it to be production ready.    

The design of this cross-chain DAO was created off of OpenZeppelin's Governor base, but that doesn't mean that it's flawless. It's good to work off of preexisting smart contracts for a version 1 cross-chain DApp, but as you get closer to production-ready code, it's best to start from scratch and leave only the parts that are still relevant to the design. Working off of logic that's meant for single-chain can get in the way several times, which you will find a common occurrence when working with cross-chain smart contracts.  

For example, the `propose` function from the `Governor` smart contract couldn't be used, and had to be replaced with a new cross-chain function. It would be best to completely remove the `propose` function, but that can't be done because of the way the `Governor` smart contract was designed. This is an obvious issue, and it goes to show that while it's good to prototype cross-chain DApps using preexisting smart contracts, it can be better to completely rewrite them while still reusing some logic.  

!!! challenge
    Can you rewrite the `CrossChainDAO` smart contract to only include the logic and functions necessary for cross-chain interactions? While you're at it, can you implement any of the alternate designs suggested below?

### Division of the Cross-Chain Selector Into Multiple Contracts {: #division-of-the-cross-chain-selector-into-multiple-contracts }

The cross-chain function selection method that was used in the `CrossChainDAO` and `DAOSatellite` smart contracts works fine enough. But instead of having a selector within a single smart contract, you could have cross-chain messages be directed at multiple smart contracts that have special permissions within the `CrossChainDAO`. You may find this helpful in case you believe in single responsibility (SRP) for smart contracts.  

For example, the hub chain's `CrossChainDAO` could be composed of the main contract that receives cross-chain data as well as two other smart contracts: `CrossChainExecutor` and `CrossChainProposer`. So, when interacting with the `DAOSatellite` contract to send a message to `CrossChainDAO`, the spoke chain's smart contract could target `CrossChainExecutor` to execute or `CrossChainProposer` to propose. This would remove the need to double-wrap payloads and the need to include function selecting logic in the cross-chain message receiving function. It could even help convert a single-chain DAO into one with cross-chain abilities.  

![Single Responsibility Principle](/images/tutorials/cross-chain-dao/cross-chain-dao-5.png)  

### Distributed Proposal and Execution {: #distributed-proposal-and-execution }

What if you wanted users to be able to execute a proposal on multiple chains instead of just the hub chain? There are a few ways to go about it:  

1. Stick with a hub-and-spoke model
2. Completely decentralize  

The hub-and-spoke model is already laid out in detail in this tutorial. In such a case where an execution could occur on multiple chains, you would have to have a smart contract on each chain that executes on behalf of the hub-chain (could be added to `DAOSatellite`). This smart contract would receive a message from the `execute` function provided by the `Governor` smart contract. This is simple enough, but it might be too many cross-chain messages to be efficient.  

If you decide to completely decentralize the DAO, it would be most likely to remove the `DAOSatellite` smart contract and deploy a modified `CrossChainDAO` smart contract on every chain. Each `CrossChainDAO` could control the proposals meant to be executed on their chain. It would require a redesign of how proposals are made and sent, however.  

You may also find an issue when generating the proposal ID. Take a look at how the IDs are being generated now:  

```solidity
function hashProposal(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public pure virtual override returns (uint256) {
    return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash)));
}
```

Conceivably, the same description and transaction details could be sent on both chain A and on chain B. This could cause errors, because then there would be conflicting transactions. It may serve best to include another parameter to hash a proposal ID: the chain ID of the chain on which the proposal is meant to execute.

### Double-Weight Attack from Snapshot Mismatch {: #double-weight-attack-from-snapshot-mismatch }

One primary issue with the distribution of voting weight across chains via the `CrossChainDAOToken` is that blocks are not properly aligned across networks. This can cause a situation where the vote snapshots between multiple chains are not close together enough, resulting in a situation where voting weight is doubled when a cross-chain transfer of the DAO token front-runs a new proposal's voting weight snapshot.   

One option is using an oracle that aligns blocks with timestamps to ensure that snapshots on spoke chains are as close to the hub chain's timestamp as possible.

A more simple solution would be to alter the `ERC20Votes` smart contract to depend on timestamps instead of blocks, but this could still be open to attacks in case the block producers on two chains collude.  

Alternatively, you could alter the `OFTVotes` smart contract to postpone the addition of voting weight until a few blocks after the weight was received.

### Chained Cross-Chain Message Fees {: chained-cross-chain-message-fees }

One of the flaws overlooked with the spoke chain's `DAOSatellite` smart contract is that whenever voting data is requested from the hub chain, the destination chain fees must be stored in the smart contract beforehand. Here are two plausible solutions to this:  

1. Storing the request for data, and allowing anyone to trustlessly send the data back
2. Sending the gas from the hub chain with the cross-chain message that requests the data

The first is the simplest solution, though it may increase the turn around time for proposal to execution if you don't plan on running additional infrastructure. Similar to how the `execute` function can be ran by anyone once a proposal has been finished, a new function would be written to allow anyone to send the vote data to the hub chain. Preferably, this would also require a [timeout to the collection phase](#collection-phase-time-out).  

![Chained Execution](/images/tutorials/cross-chain-dao/cross-chain-dao-6.png)  

The second is significantly more complex. It would require a setup that sends tokens with a payload instead of just a payload like the current contract does, and for a swap to occur on the destination chain to retrieve native currency for a cross-chain transaction.  

### Collection Phase Time Out {: collection-phase-time-out }

In case you want to be safe, and you believe that a spoke chain might stall or even stop being supported, you would want to include a way to cap the amount of time that the collection phase takes and also add a way for your DAO's governance to add and remove spoke chains.  

For example, the hub chain would wait 30 blocks until it disregards voting data from spoke chains. And if the DAO's participants believes that chain A should be removed from the future voting, they could start a proposal to do so, similar to OpenZeppelin's `GovernorSettings` contract.  


<div class='disclaimer'>
--8<-- 'text/disclaimers/general.md'
</div>
