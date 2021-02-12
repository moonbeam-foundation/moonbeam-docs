---
title: ChainBridge
description: How to use ChainBridge to connect assets between Ethereum and Moonbeam using smart contracts
---
# ChainBridge's Ethereum Moonbeam Bridge

![ChainBridge Moonbeam banner](/images/chainbridge/chainbridge-banner.png)

## Introduction

A bridge allows two economically sovereign and technologically different chains to communicate with each other. They can range from centralized and trusted, to decentralized and trust minimized. One of the currently available solutions is [ChainBridge](https://github.com/ChainSafe/ChainBridge#installation), a modular multi-directional blockchain bridge built by [ChainSafe](https://chainsafe.io/). A ChainBridge implementation is now available in Moonbeam, which connects our Moonbase Alpha TestNet and Ethereum's Rinkeby/Kovan TestNets.

This guide is broken down into two main sections. In the first part, we'll explain the general workflow of the bridge. In the second part, we'll go through a couple of examples using the bridge to transfer ERC-20 and ERC-721 assets between Moonbase Alpha and Rinkeby/Kovan. 

 - [How the bridge works](/integrations/bridges/ethereum/chainbridge/#how-the-bridge-works)
    - [General definitions](/integrations/bridges/ethereum/chainbridge/#general-definitions)
 - [Using the bridge in Moonbase Alpha](/integrations/bridges/ethereum/chainbridge/#try-it-on-moonbase-alpha)
    - [Transfer ERC-20 tokens](/integrations/bridges/ethereum/chainbridge/#erc-20-token-transfer)
    - [Transfer ERC-721 tokens](/integrations/bridges/ethereum/chainbridge/#erc-721-token-transfer)
    - [Generic handler](/integrations/bridges/ethereum/chainbridge/#generic-handler)
 - [Contact us](/integrations/bridges/ethereum/chainbridge/#we-want-to-hear-from-you)

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
 - **Calldata** — is the parameters required for the handler that includes the information necessary to execute the proposal on Chain B. The exact serialization is defined for each handler. You can find more information [here](https://chainsafe.github.io/ChainBridge/chains/ethereum/#erc20-handler)

## Try it on Moonbase Alpha

We have set up a relayer with the ChainBridge implementation, which is connected to our Moonbase Alpha TestNet and both Ethereum's Rinkeby and Kovan TestNets.

ChainSafe has [pre-programmed handlers](https://github.com/ChainSafe/chainbridge-solidity/tree/master/contracts/handlers) specific to ERC-20 and ERC-721 interfaces, and these handlers are used to transfer ERC-20 and ERC-721 tokens between chains. More information can be found [here](https://chainsafe.github.io/ChainBridge/chains/ethereum/#handler-contracts). In general terms, this is just narrowing down the general-purpose diagram that we've described before, so the handler works only with the specific token functions such as _lock/burn_, and _mint/unlock_. 

This section will go over two different examples of using the bridge to move ERC-20 and ERC-721 tokens between chains. To interact with Moonbase Alpha and Rinkeby/Kovan, you will need the following information:

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha bridge contract address:
        {{ networks.moonbase.chainbridge.rinkeby.bridge_address }}

    # Rinkeby/Moonbase Alpha ERC-20 handler contract:
        {{ networks.moonbase.chainbridge.rinkeby.ERC20_handler }}
        
    # Rinkeby/Moonbase Alpha ERC-721 handler contract:
        {{ networks.moonbase.chainbridge.rinkeby.ERC721_handler }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase Alpha bridge contract address: 
        {{ networks.moonbase.chainbridge.kovan.bridge_address }}

    # Kovan/Moonbase Alpha ERC-20 handler contract:
        {{ networks.moonbase.chainbridge.kovan.ERC20_handler }}

    # Kovan/Moonbase Alpha ERC-721 handler contract:
        {{ networks.moonbase.chainbridge.kovan.ERC721_handler }}
    ```

### ERC-20 Token Transfer

ERC-20 tokens that want to be moved through the bridge need to be registered by the relayers in the handler contracts. Therefore, to test the bridge, we've deployed an ERC-20 token (ERC20S) where any user can mint 5 tokens:

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha custom ERC-20 sample token:
        {{ networks.moonbase.chainbridge.rinkeby.ERC20S }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase Alpha custom ERC-20 sample token: 
        {{ networks.moonbase.chainbridge.kovan.ERC20S }}
    ```

In similar fashion, interacting directly with the Bridge contract and calling the function `deposit()` with the correct parameters can be intimidating. To ease the process of using the bridge, we've created a modified bridge contract, which builds the necessary inputs to the `deposit()` function:

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha custom bridge contract:
        {{ networks.moonbase.chainbridge.rinkeby.bridge_address }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase Alpha custom bridge contract: 
        {{ networks.moonbase.chainbridge.kovan.bridge_address }}
    ```

In simple terms, the modified contract used to initiate the transfer has the _chainID_ and _resourceID_ predefined for this example. Therefore, it builds the _calldata_ object from the user's input, which is only the recipient address and the value to be sent.

The general workflow for this example can be seen in this diagram:

![ChainBridge ERC20 workflow](/images/chainbridge/chainbridge-erc20.png)

To try the bridge with this sample ERC-20 token, we must do the following steps (regardless of the direction of the transfer):
 
 - Mint tokens in source Chain (this approves the source handler contract as a spender for the amount minted)
 - Use the modified bridge contract in the source Chain to send tokens
 - Wait until the process is completed
 - Approve the handler contract of the target Chain as a spender to send the tokens back
 - Use the modified bridge contract in the target Chain to send tokens

!!! note
    Remember that tokens will be transferred only if the handler contract has enough allowance to spend tokens on behalf of the owner. If the process fails, check the allowance.

Let's send some ERC20S tokens from **Moonbase Alpha** to **Kovan**. For that, we'll use [Remix](/integrations/remix/). First, we can use the following interface to interact with this contract and mint the tokens:

```solidity
pragma solidity ^0.6.4;

/**
    Interface for the Custom ERC20 Token contract for ChainBridge implementation
    Rinkeby/Moonbase Alpha ERC-20 Address : 
        {{ networks.moonbase.chainbridge.rinkeby.ERC20S }}
    Kovan/Moonbase Alpha ERC-20 Address: 
        {{ networks.moonbase.chainbridge.kovan.ERC20S }}
*/

interface ICustomERC20 {

    // Mint 5 ERC20S Tokens
    function mintTokens() external;

    // Get Token Name
    function name() external view returns (string memory);
    
    /** 
        Increase allowance to Handler
        Rinkeby/Moonbase Alpha ERC-20 Handler:
           {{ networks.moonbase.chainbridge.rinkeby.ERC20_handler}}
        Kovan/Moonbase Alpha ERC-20 Handler:
           {{ networks.moonbase.chainbridge.kovan.ERC20_handler}}
    */
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    
    // Get allowance
    function allowance(address owner, address spender) external view returns (uint256);
}
```

Note that the ERC-20 token contract's mint function was also modified to approve the corresponding handler contract as a spender when minting tokens.

In Remix, load the interface contract at the ERC-20 token address (make sure you are using MetaMask's injected web3 provider). Next, call the `mintTokens()` function and sign the transaction. Once the transaction is confirmed, you should have received 5 ERC20S tokens. You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/).

![ChainBridge ERC20 mint Tokens](/images/chainbridge/chainbridge-image1.png)

Once we have the tokens, we can proceed to send them over the bridge to the target chain. In this case, remember that we do it from Moonbase Alpha to Kovan. The following interface allows you to use the `sendERC20SToken()` function to initiate the transfer.

```solidity
pragma solidity 0.6.4;

/**
    Simple Interface to interact with bridge to transfer the ERC20S token
    Rinkeby/Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.rinkeby.bridge_address }}
    Kovan/Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.kovan.bridge_address }}
 */

interface IPSBridgeERC20 {
    
    /**
   * @notice Creates a deposit in the Bridge Contract for an ERC-20 Transfer,
   * @param _recipient Address recipient of the tokens in the other chain
   * @param _value Amount of tokens to be sent
   */
    function sendERC20SToken(address _recipient, uint _value) external;
    
}
```

So once again, in Remix, load the interface contract at the bridge address. Next, call the `sendERC20SToken()` function, providing the recipient address on the other side of the bridge and the amount to transfer in WEI. MetaMask should pop-up and ask you to sign the transaction. Once the transaction is confirmed, the process can take around 3 minute to complete, after which you should have received the tokens in Kovan! 

![ChainBridge ERC20 send Tokens](/images/chainbridge/chainbridge-image2.png)

You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/) and connecting it to the target network - in our case Kovan.

![ChainBridge ERC20 balance](/images/chainbridge/chainbridge-image3.png)

Remember that you can also mint ERC20S tokens in Kovan and send them to Moonbase Alpha. To approve a spender or increase its allowance, you can use the `increaseAllowance()` function of the interface provided. To check the allowance of the handler contract in the ERC20 token contract, you can use the `allowance()` function of the interface.

!!! note
    Tokens will be transferred only if the handler contract has enough allowance to spend tokens on behalf of the owner. If the process fails, check the allowance.

### ERC-721 Token Transfer

Similar to our previous example, ERC-721 tokens contracts need to be registered by the relayers to enable transfer through the bridge. Therefore, we've customized an ERC-721 token contract so that any user can mint a token to test the bridge out. However, as each token is non-fungible, and consequently unique, the mint function is only available in the Source chain token contract and not in the Target contract. As a consequence, you need a pair of ERC-721 contract addresses to mint tokens in Rinkeby/Kovan and transfer those to Moonbase Alpha and another pair for the opposite action. The following diagram explains the workflow for this example, where it is important to highlight that the token ID and metadata is maintained.

![ChainBridge ERC721 workflow](/images/chainbridge/chainbridge-erc721.png)

To mint tokens in Moonbase Alpha (named ERC721Moon with symbol ERC721M) and send them back-and-forth to Rinkeby/Kovan, you need the following address:

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha ERC-721 Moon tokens (ERC721M),
    # Mint function in Moonbase Alpha: 
        {{ networks.moonbase.chainbridge.rinkeby.ERC721M }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase AlphaERC-721 Moon tokens (ERC721M)
    # Mint function in Moonbase Alpha:
        {{ networks.moonbase.chainbridge.kovan.ERC721M }}
    ```

 To mint tokens in Rinkeby/Kovan (ERC721E) and send them back-and-forth to Moonbase Alpha, you need the following address:

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha ERC-721 Eth tokens (ERC721E), with mint function in Rinkeby:
        {{ networks.moonbase.chainbridge.rinkeby.ERC721E }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase Alpha ERC-721 Eth tokens (ERC721E), with mint function in Kovan: 
        {{ networks.moonbase.chainbridge.kovan.ERC721E }}
    ```

Instead of interacting with the Bridge contract and calling the function `deposit()`, we've modified the bridge contract to ease the process of using the bridge (same address as in the previous example):

=== "Rinkeby"
    ```
    # Rinkeby/Moonbase Alpha custom bridge contract:
        {{ networks.moonbase.chainbridge.rinkeby.bridge_address }}
    ```

=== "Kovan"
    ```
    # Kovan/Moonbase Alpha custom bridge contract:
        {{ networks.moonbase.chainbridge.kovan.bridge_address }}
    ```

In simple terms, the modified bridge contract used to initiate the transfer has the _chainID_ and _resourceID_ predefined for this example. Therefore, it builds the _calldata_ object from the user's input, which is only the recipient address and the token ID to be sent.

Let's send an ERC720E token from **Kovan** to **Moonbase Alpha**. For that, we'll use [Remix](/integrations/remix/). The following interface can be used to interact with the source ERC721 contracts and mint the tokens. The `tokenOfOwnerByIndex()` function also can be used to check the token IDs owned by a specific address, passing the address and the index to query (each token ID is stored as an array element associated to the address):

```solidity
pragma solidity ^0.6.4;

/**
    Interface for the Custom ERC721 Token contract for ChainBridge implementation:
    Rinkeby/Moonbase Alpha:
        ERC721Moon: {{ networks.moonbase.chainbridge.rinkeby.ERC721M }}
        ERC721Eth: {{ networks.moonbase.chainbridge.rinkeby.ERC721E }}
    Kovan/Moonbase Alpha:
        ERC721Moon: {{ networks.moonbase.chainbridge.kovan.ERC721M }}
        ERC721Eth: {{ networks.moonbase.chainbridge.kovan.ERC721E }}

interface ICustomERC721 {
    
    // Mint 1 ERC-721 Token
    function mintToken() external returns (uint256);
    
    // Query tokens owned by Owner
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);

    // Get Token Name
    function name() external view returns (string memory);
    
    // Get Token URI
    function tokenURI(uint256 tokenId) external view returns (string memory);
    
    **/
        Set Approval for Handler 
        Rinkeby/Moonbase Alpha ERC-721 Handler:
           {{ networks.moonbase.chainbridge.rinkeby.ERC721_handler }}
        Kovan/Moonbase Alpha ERC-721 Handler:
           {{ networks.moonbase.chainbridge.kovan.ERC721_handler }}
    */
    function approve(address to, uint256 tokenId) external;
    
    // Check the address approved for a specific token ID
    function getApproved(uint256 tokenId) external view returns (address);
}
```

Note that the ERC-721 token contract's mint function was also modified to approve the corresponding handler contract as a spender when minting tokens.

In Remix, load the interface contract at the ERC721E source token address (make sure you are using MetaMask's injected web3 provider). Next, call the `mintTokens()` function and sign the transaction. Once the transaction is confirmed, you should have received an ERC721E token. You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/).

![ChainBridge ERC721 mint Tokens](/images/chainbridge/chainbridge-image4.png)

Once we have the token, we can proceed to send it over the bridge to the target chain. In this case, remember that we'll do it from Kovan to Moonbase Alpha. The following interface allows you to use the `sendERC721EthToken()` function to initiate the transfer of tokens originally minted in Kovan (ERC721E). On the contrary, you can use the `sendERC721MoonToken()` function to initiate the transfer of tokens originally minted in Moonbase Alpha (ERC721M).

```solidity
pragma solidity 0.6.4;

/**
    Simple Interface to interact with bridge to transfer the ERC721 tokens
    Rinkeby/Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.rinkeby.bridge_address }}
    Kovan/Moonbase Alpha Bridge Address: 
        {{ networks.moonbase.chainbridge.kovan.bridge_address }}
 */

interface IPSBridgeERC721 {
    
    /**
   * @notice Creates a deposit in the Bridge Contract for an ERC-721 Transfer,
   * @param _recipient Address recipient of the tokens in the other chain
   * @param _tokenID Token ID of the token to be sent
   */
   // For tokens minted in Rinkeby/Kovan (ECR721E)
    function sendERC721EthToken(address _recipient, uint _tokenID) external;
    
    // For tokens minted in Moonbase Alpha (ECR721M)
    function sendERC721MoonToken(address _recipient, uint _tokenID) external;
}
```

So once again, in Remix, load the interface contract at the bridge address. Next, call the `sendERC721EthToken()` function, providing the recipient address on the other side of the bridge and the token ID to transfer. MetaMask should pop-up asking you to sign the transaction. Once the transaction is confirmed, the process can take around 3 minute to complete, after which you should have received the same token ID in Moonbase Alpha!

![ChainBridge ERC721 send Token](/images/chainbridge/chainbridge-image5.png)

You can check your balance by adding the token to [MetaMask](/integrations/wallets/metamask/) and connecting it to the target network, in our case Moonbase Alpha.

![ChainBridge ERC721 balance](/images/chainbridge/chainbridge-image6.png)

Remember that you can also mint ERC721M tokens in Moonbase Alpha and send them to Kovan. It is important to always check the allowance provided to the handler contract in the corresponding ERC721 token contract. You can approve the handler contract to send tokens on your behalf using the `approve()` function provided in the interface. You can check the approval of each of your token IDs with the `getApproved()` function.

!!! note
    Tokens will be transferred only if the handler contract is approved to transfer tokens on behalf of the owner. If the process fails, check the approval.

### Generic Handler

The Generic Handler offers the possibility of executing a function in chain A and creating a proposal to execute another function in chain B (similar to the general workflow diagram). This provides a compelling way of connecting two independent blockchains.

If you are interested in implementing this functionality, you can reach out directly to us via our [Discord server](https://discord.com/invite/PfpUATX). We'll be happy to discuss this implementation.

## We Want to Hear From You

If you have any feedback regarding implementing ChainBridge on your project or any other Moonbeam-related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
