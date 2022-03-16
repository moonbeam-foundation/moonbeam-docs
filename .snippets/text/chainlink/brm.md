Before going into fetching the data itself, it is important to understand the basics of the "basic request model." The generic flow for requesting and receiving data from a Chainlink oracle is as follows:

1. A client contract creates and makes a request for data to a Chainlink oracle
2. The request is sent through the `transferAndCall` function of the LINK token contract, which is an [ERC-677](https://github.com/ethereum/EIPs/issues/677){target=_blank} compliant token, that allows tokens to be transferred and relays the request to the oracle contract
3. Once the token is transferred the LINK contract calls the oracle contract's `onTokenTransfer` function
4. The oracle contract is owned by the oracle node operators and is responsible for handling on-chain requests made through the LINK token. Once the request is received by the oracle contract an event is emitted to the node which acts upon it
5. After the request has been fulfilled by the oracle node, the node uses the `fulfillOracleRequest` function of the oracle contract to return the result to the client via the callback function defined in the original request

![Basic Request Diagram](/images/builders/integrations/oracles/chainlink/chainlink-basic-request.png)

When a request for data is created through the client contract, the following parameters need to be passed in to ensure the transaction will go through and the correct information will be returned:

 - **Oracle address** - address of the contract deployed by the oracle node
 - **Job ID** - the task to be executed. An oracle node has a set of job IDs, where each job corresponds to a task that can be requested by a user, for example, fetching a price feed
 - **Payment** - payment in LINK tokens that the oracle will receive for fulfiling the request