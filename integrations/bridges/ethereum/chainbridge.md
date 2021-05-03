---
title: ChainBridge
description: How to use ChainBridge to connect assets between Ethereum and Moonbeam using smart contracts
---
# ChainBridge's Ethereum Moonbeam Bridge

![ChainBridge Moonbeam banner](/images/chainbridge/chainbridge-banner.png)

## Introduction

A bridge allows two economically sovereign and technologically different chains to communicate with each other. They can range from centralized and trusted, to decentralized and trust minimized. One of the currently available solutions is [ChainBridge](https://github.com/ChainSafe/ChainBridge#installation), a modular multi-directional blockchain bridge built by [ChainSafe](https://chainsafe.io/). A ChainBridge implementation is now available in Moonbeam, which connects our Moonbase Alpha TestNet and Ethereum's Kovan/Rinkeby TestNets.

This guide is broken down into two main sections. In the first part, we'll explain the general workflow of the bridge. In the second part, we'll go through a couple of examples using the bridge to transfer ERC-20 and ERC-721 assets between Moonbase Alpha and Kovan/Rinkeby. 

 - [How the bridge works](/integrations/bridges/ethereum/chainbridge/#how-the-bridge-works)
    - [General definitions](/integrations/bridges/ethereum/chainbridge/#general-definitions)
 - [Using the bridge in Moonbase Alpha](/integrations/bridges/ethereum/chainbridge/#try-it-on-moonbase-alpha)
    - [Transfer ERC-20 tokens](/integrations/bridges/ethereum/chainbridge/#erc-20-token-transfer)
    - [Transfer ERC-721 tokens](/integrations/bridges/ethereum/chainbridge/#erc-721-token-transfer)
    - [Generic handler](/integrations/bridges/ethereum/chainbridge/#generic-handler)
    
## How the Bridge Works

ChainBridge is, at its core, a message-passing protocol. Events on a source chain are used to send a message that is routed to the destination chain. There are three main roles:

 - Listener: extract events from a source chain and construct a message
 - Router: passes the message from the Listener to the Writer
 - Writer: interpret messages and submit transactions to the destination chain
 
ChainBridge currently relies on trusted relayers to perform these roles. However, it features a mechanism that prevents any individual relayer from abusing their power and mishandling funds. At a high-level, relayers create proposals in the target chain that are submitted for approval by other relayers. Approval voting happens also in the target chain, and each proposal is only executed after it meets a certain voting threshold. 

On both sides of the bridge, there are a set of smart contracts, where each has a specific function:

 - **Bridge contract** — users and relayers interact with this contract. It delegates calls to the handler contracts for deposits, starts a transaction on the source chain, and for executions of the proposals on the target chain
 - **Handler contracts** — validates the parameters provided by the user, creating a deposit/execution record
 - **Target contract** — as the name suggests, this is the contract we are going to interact with on each side of the bridge

### General Workflow


The general workflow is the following (from Chain A to Chain B):
 
  - A user initiates a transaction with the _deposit()_ function in the bridge contract of Chain A. Here, the user needs to input the target chain, the resource ID, and the _calldata_ (definitions after the diagram). After a few checks, the _deposit()_  function of the handler contract is called, which executes the corresponding call of the target contract.
  - After the function of the target contract in Chain A is executed, a _Deposit_ event is emitted by the bridge contract, which holds the necessary data to be executed on Chain B. This is called a proposal. Each proposal can have five status (inactive, active, passed, executed and cancelled). 
  - Relayers are always listening on both sides of the chain.  Once a relayer picks up the event, he initiates a voting on the proposal, which happens on the bridge contract on Chain B. This sets the state of the proposal from inactive to active.
  - Relayers must vote on the proposal. Every time a relayer votes, an event is emitted by the bridge contract that updates its status. Once a threshold is met, the status changes from active to passed. A relayer then executes the proposal on Chain B via the bridge contract.
  - After a few checks, the bridge executes the proposal in the target contract via the handler contract on Chain B. Another event is emitted, which updates the proposal status from passed to executed.

This workflow is summarized in the following diagram:

![ChainBridge Moonbeam diagram](/images/chainbridge/chainbridge-diagram.png)

The two target contracts on each side of the bridge are linked by doing a series of registrations in the corresponding handler contract via the bridge contract. These registrations currently can only be done by the bridge contract admin.

### General Definitions

Here we have put together a list of concepts applicable to the ChainBridge implementation (from Chain A to Chain B):

 - **ChainBridge Chain ID** — this is not to be confused with the chain ID of the network. It is a unique network identifier used by the protocol for each chain. It can be different from the actual chain ID of the network itself. For example, for Moonbase Alpha and Rinkeby, we've set the ChainBridge chain ID to 43 and 4 respectively (Kovan was set to 42)
 - **Resource ID** — is a 32 bytes word that is intended to uniquely identify an asset in a cross-chain environment. Note that the least significant byte is reserved for the chainId, so we would have 31 bytes in total to represent an asset of a chain in our bridge. For example, this may express tokenX on Chain A is equivalent to tokenY on Chain B
 - **Calldata** — is the parameter required for the handler that includes the information necessary to execute the proposal on Chain B. The exact serialization is defined for each handler. You can find more information [here](https://chainbridge.chainsafe.io/chains/ethereum/#erc20-erc721-handlers)

## Try it on Moonbase Alpha

We have set up a relayer with the ChainBridge implementation, which is connected to our Moonbase Alpha TestNet and both Ethereum's Rinkeby and Kovan TestNets.

ChainSafe has [pre-programmed handlers](https://chainbridge.chainsafe.io/chains/ethereum/#handler-contracts) specific to ERC-20 and ERC-721 interfaces, and these handlers are used to transfer ERC-20 and ERC-721 tokens between chains. In general terms, this is just narrowing down the general-purpose diagram that we've described before, so the handler works only with the specific token functions such as _lock/burn_, and _mint/unlock_. 

This guide will go over two different examples of using the bridge to transfer tokens between chains. You will mint ERC-20S and ERC-721 Moon tokens and transfer them over the bridge from Moonbase Alpha to Kovan. The same steps can be followed and applied to Rinkeby. To interact with Moonbase Alpha and Kovan/Rinkeby, you will need the following information:

```
# Kovan/Rinkeby - Moonbase Alpha bridge contract address:
    {{ networks.moonbase.chainbridge.bridge_address }}

 # Kovan/Rinkeby - Moonbase Alpha ERC-20 handler contract:
    {{ networks.moonbase.chainbridge.ERC20_handler }}
   
# Kovan/Rinkeby - Moonbase Alpha ERC-721 handler contract:
    {{ networks.moonbase.chainbridge.ERC721_handler }}
```

!!! note
    The bridge contract, ERC-20 handler contract, and ERC-721 handler contract addresses listed above are applicable for both Kovan and Rinkeby.

### ERC-20 Token Transfer

ERC-20 tokens that want to be moved through the bridge need to be registered by the relayers in the handler contract. Therefore, to test the bridge, we've deployed an ERC-20 token (ERC20S) where any user can mint 5 tokens:

```
# Kovan/Rinkeby - Moonbase Alpha custom ERC-20 sample token:
    {{ networks.moonbase.chainbridge.ERC20S }}
```

In similar fashion, interacting directly with the Bridge contract and calling the function `deposit()` with the correct parameters can be intimidating. To ease the process of using the bridge, we've created a modified bridge contract, which builds the necessary inputs to the `deposit()` function:

```
# Kovan/Rinkeby - Moonbase Alpha custom bridge contract:
    {{ networks.moonbase.chainbridge.bridge_address }}
```


In simple terms, the modified contract used to initiate the transfer has the _chainID_ and _resourceID_ predefined for this example. Therefore, it builds the _calldata_ object from the user's input, which is only the recipient address and the value to be sent.

The general workflow for this example can be seen in this diagram:

![ChainBridge ERC20 workflow](/images/chainbridge/chainbridge-erc20.png)

To try the bridge with this sample ERC-20 token, we must do the following steps (regardless of the direction of the transfer):
 
 - Mint tokens in source Chain (this approves the source handler contract as a spender for the amount minted)
 - Use the modified bridge contract to send tokens from source Chain to target Chain
 - Wait until the process is completed
 - Approve the handler contract as a spender to send the tokens back
 - Use the modified bridge contract to send tokens from the target Chain to the source Chain

!!! note
    Remember that tokens will be transferred only if the handler contract has enough allowance to spend tokens on behalf of the owner. If the process fails, check the allowance.

Let's send some ERC20S tokens from **Moonbase Alpha** to **Kovan**. If you wanted to try it out with Rinkeby, the steps and addresses are the same. For this, we'll use [Remix](/integrations/remix/). First, we can use the following interface to interact with this contract and mint the tokens:

```solidity
pragma solidity ^0.8.1;

/**
    Interface for the Custom ERC20 Token contract for ChainBridge implementation
    Kovan/Rinkeby - Moonbase Alpha ERC-20 Address : 
        {{ networks.moonbase.chainbridge.ERC20S }}
*/

interface ICustomERC20 {

    // Mint 5 ERC20S Tokens
    function mintTokens() external;

    // Get Token Name
    function name() external view returns (string memory);
    
    /** 
        Increase allowance to Handler
        Kovan/Rinkeby - Moonbase Alpha ERC-20 Handler:
           {{ networks.moonbase.chainbridge.ERC20_handler}}
    */
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    
    // Get allowance
    function allowance(address owner, address spender) external view returns (uint256);
}
```

Note that the ERC-20 token contract's mint function was also modified to approve the corresponding handler contract as a spender when minting tokens.

After adding the Custom ERC20 contract to Remix and compiling it, the next steps are to mint ERC20S tokens:

1. Navigate to the **Deploy & Run Transactions** page on Remix
2. Select Injected Web3 from the **Environment** dropdown
3. Load the custom ERC-20 token contract address and click **At Address**
4. Call the `mintTokens()` function and sign the transaction. 
5. Once the transaction is confirmed, you should have received 5 ERC20S tokens. You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/).

![ChainBridge ERC20 mint Tokens](/images/chainbridge/chainbridge-image1.png)

Once we have the tokens, we can proceed to send them over the bridge to the target chain. In this case, remember that we do it from **Moonbase Alpha** to **Kovan**. There is a single interface that will allow you to transfer ERC20S and ERC721M tokens. For this example you will use the `sendERC20SToken()` function to initiate the transfer of your minted ERC20S tokens:

```solidity
pragma solidity 0.8.1;

/**
    Simple Interface to interact with bridge to transfer the ERC20S and ERC721M tokens
    Kovan/Rinkeby - Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.bridge_address }}
 */

interface IBridge {

    /**
     * Calls the `deposit` function of the Chainbridge Bridge contract for the custom ERC20 (ERC20Sample) 
     * by building the requested bytes object from: the recipient, the specified amount and the destination
     * chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC20SToken(uint256 destinationChainID, address recipient, uint256 amount) external;
    
    /**
     * Calls the `deposit` function for the custom ERC721 (ERC721Moon) that is only mintable in the
     * MOON side of the bridge. It builds the bytes object requested by the method from: the recipient,
     * the specified token ID and the destination chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC721MoonToken(uint256 destinationChainID, address recipient, uint256 tokenId) external;
}
```

After adding the Bridge contract to Remix and compiling it, in order to send ERC20s tokens over the bridge you'll need to:

1. Load the bridge contract address and click **At Address**
2. To call the `sendERC20SToken()` function, enter the destination chain ID (For this example we are using Kovan: `42`)
3. Enter the recipient address on the other side of the bridge
4. Add the amount to transfer in WEI
5. Click **transact** and then MetaMask should pop-up asking you to sign the transaction. 

Once the transaction is confirmed, the process can take around 3 minutes to complete, after which you should have received the tokens in Kovan!

![ChainBridge ERC20 send Tokens](/images/chainbridge/chainbridge-image2.png)

You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/) and connecting it to the target network - in our case Kovan.

![ChainBridge ERC20 balance](/images/chainbridge/chainbridge-image3.png)

Remember that you can also mint ERC20S tokens in Kovan and send them to Moonbase Alpha. To approve a spender or increase its allowance, you can use the `increaseAllowance()` function of the interface provided. To check the allowance of the handler contract in the ERC20 token contract, you can use the `allowance()` function of the interface.

!!! note
    Tokens will be transferred only if the handler contract has enough allowance to spend tokens on behalf of the owner. If the process fails, check the allowance.

### ERC-721 Token Transfer

Similar to our previous example, ERC-721 tokens contracts need to be registered by the relayers to enable transfer through the bridge. Therefore, we've customized an ERC-721 token contract so that any user can mint a token to test the bridge out. However, as each token is non-fungible, and consequently unique, the mint function is only available in the Source chain token contract and not in the Target contract. In other words, ERC-721M tokens can only be minted on Moonbase Alpha and then transfered to Rinkeby or Kovan. The following diagram explains the workflow for this example, where it is important to highlight that the token ID and metadata is maintained.

![ChainBridge ERC721 workflow](/images/chainbridge/chainbridge-erc721.png)

To mint tokens in Moonbase Alpha (named ERC721Moon with symbol ERC721M) and send them back-and-forth to Kovan/Rinkeby, you need the following address:

```
# Kovan/Rinkeby - Moonbase Alpha ERC-721 Moon tokens (ERC721M),
# Mint function in Moonbase Alpha: 
    {{ networks.moonbase.chainbridge.ERC721M }}
```

Instead of interacting with the Bridge contract and calling the function `deposit()`, we've modified the bridge contract to ease the process of using the bridge (same address as in the previous example):

```
# Kovan/Rinkeby - Moonbase Alpha custom bridge contract:
    {{ networks.moonbase.chainbridge.bridge_address }}
```

In simple terms, the modified bridge contract used to initiate the transfer will create the _chainID_ and _resourceID_ for this example based on the destination chain ID that you provide. Therefore, it builds the _calldata_ object from the user's input, which is only the recipient address and the token ID to be sent.

Let's send an ERC721M token from **Moonbase Alpha** to **Kovan**. For that, we'll use [Remix](/integrations/remix/). The following interface can be used to interact with the source ERC721M contract and mint the tokens. The `tokenOfOwnerByIndex()` function also can be used to check the token IDs owned by a specific address, passing the address and the index to query (each token ID is stored as an array element associated to the address):

```solidity
pragma solidity ^0.8.1;

/**
    Interface for the Custom ERC721 Token contract for ChainBridge implementation:
    Kovan/Rinkeby - Moonbase Alpha:
        ERC721Moon: {{ networks.moonbase.chainbridge.ERC721M }}

    ERC721Moon tokens are only mintable on Moonbase Alpha
*/

interface ICustomERC721 {
    
    // Mint 1 ERC-721 Token
    function mintToken() external returns (uint256);
    
    // Query tokens owned by Owner
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);

    // Get Token Name
    function name() external view returns (string memory);
    
    // Get Token URI
    function tokenURI(uint256 tokenId) external view returns (string memory);
    
    /**
        Set Approval for Handler 
        Kovan/Rinkeby - Moonbase Alpha ERC-721 Handler:
           {{ networks.moonbase.chainbridge.ERC721_handler }}
    */
    function approve(address to, uint256 tokenId) external;
    
    // Check the address approved for a specific token ID
    function getApproved(uint256 tokenId) external view returns (address);
}
```

Note that the ERC-721 token contract's mint function was also modified to approve the corresponding handler contract as a spender when minting tokens.

After adding the contract to Remix and compiling it, next we'll want to mint an ERC721M token:

1. Navigate to the **Deploy & Run Transactions** page on Remix
2. Select Injected Web3 from the **Environment** dropdown
3. Load the custom ERC721M token contract address and click **At Address**
4. Call the `mintTokens()` function and sign the transaction. 
5. Once the transaction is confirmed, you should have received an ERC721M token. You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/).

![ChainBridge ERC721 mint Tokens](/images/chainbridge/chainbridge-image4.png) 

The following interface allows you to use the `sendERC721MoonToken()` function to initiate the transfer of tokens originally minted in Moonbase Alpha (ERC721M).

```solidity
pragma solidity 0.8.1;

/**
    Simple Interface to interact with bridge to transfer the ERC20S and ERC721M tokens
    Kovan/Rinkeby - Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.bridge_address }}
 */

interface IBridge {

    /**
     * Calls the `deposit` function of the Chainbridge Bridge contract for the custom ERC20 (ERC20Sample) 
     * by building the requested bytes object from: the recipient, the specified amount and the destination
     * chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC20SToken(uint256 destinationChainID, address recipient, uint256 amount) external;
    
    /**
     * Calls the `deposit` function for the custom ERC721 (ERC721Moon) that is only mintable in the
     * MOON side of the bridge. It builds the bytes object requested by the method from: the recipient,
     * the specified token ID and the destination chainId.
     * @notice Use the destination `eth_chainId`.
     */
    function sendERC721MoonToken(uint256 destinationChainID, address recipient, uint256 tokenId) external;
}
```

Now you can proceed to send the ERC721M token over the bridge to the target chain. In this case, remember that we'll do it from Moonbase Alpha to Kovan. To transfer the ERC721M token over the bridge:

1. Load the bridge contract address and click **At Address**
2. Call the `sendERC721MoonToken()` function to initiate the transfer of ERC721M tokens originally minted in Moonbase Alpha by providing the destination chain ID (For this example we're using Kovan: `42`)
3. Enter the recipient address on the other side of the bridge
4. Add the token ID to transfer
5. Click **transact** and then MetaMask should pop-up asking you to sign the transaction.

Once the transaction is confirmed, the process can take around 3 minute to complete, after which you should have received the same token ID in Kovan!

![ChainBridge ERC721 send Token](/images/chainbridge/chainbridge-image5.png)

You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/) and connecting it to the target network, in our case Kovan.

![ChainBridge ERC721 balance](/images/chainbridge/chainbridge-image6.png)

Remember that ERC721M tokens are only mintable in Moonbase Alpha and then they will be available to send back and forth to Kovan or Rinkeby. It is important to always check the allowance provided to the handler contract in the corresponding ERC721 token contract. You can approve the handler contract to send tokens on your behalf using the `approve()` function provided in the interface. You can check the approval of each of your token IDs with the `getApproved()` function.

!!! note
    Tokens will be transferred only if the handler contract is approved to transfer tokens on behalf of the owner. If the process fails, check the approval.

### Generic Handler

The Generic Handler offers the possibility of executing a function in chain A and creating a proposal to execute another function in chain B (similar to the general workflow diagram). This provides a compelling way of connecting two independent blockchains.

The generic handler address is:
```
{{ networks.moonbase.chainbridge.generic_handler }}
```

If you are interested in implementing this functionality, you can reach out directly to us via our [Discord server](https://discord.com/invite/PfpUATX). We'll be happy to discuss this implementation.

### Moonbase Alpha ChainBridge UI

If you want to play around with transferring ERC20S tokens from Moonbase Alpha to Kovan or Rinkeby without having to set up the contracts in Remix, you can checkout our [Moonbase Alpha ChainBridge UI](https://moonbase-chainbridge.netlify.app/transfer).

