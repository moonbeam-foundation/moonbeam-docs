An Oracle node has a set of job IDs, where each corresponds to a task that can be requested by a user, for example, fetch a price feed. To do so, the user needs to send a request through a contract, we'll name it the _Client_ contract, passing in the following information:

 - Oracle address: address of the contract deployed by the Oracle node
 - Job ID: task to be executed
 - Payment: payment in LINK tokens that the Oracle will receive for fulfiling the request

This request actually sends a _transferAndCall_ to the LINK token contract, which handles the payment and relays the request to the Oracle contract. Here, an event is emited with the request, which is picked up by the Oracle node. Next, the node fetches the necessary data and executes the _fulfilOracleRequest_ function, which executes a callback that stores the requested information in the Client contract. The following diagram explains this workflow.

![Basic Request Diagram](/images/chainlink/chainlink-basicrequest.png)