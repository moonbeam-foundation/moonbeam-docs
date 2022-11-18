```ts
const axios = require("axios");

// This script calculates the transaction fees of all transactions in a Moonbeam block
// according to the transaction type (For Ethereum API: legacy, EIP-1559 or EIP-2930 standards,
//and Substrate API), as well as calculating the total fees in the block.

// Define static basee fee per network
const baseFee = {
  moonbeam: 100000000000n,
  moonriver: 1000000000n,
  moonbase: 1000000000n,
};

// Define weight correction factor per network RT1901 ONLY!
const weightCorrection = {
  moonbeam: 86298000n,
  moonriver: 86298000n,
  moonbase: 250000000n,
};

// Endpoint to retrieve the latest block
const endpointBlock = "http://127.0.0.1:8080/blocks/head";
// Endpoint to retrieve the node client's information
const endpointNodeVersion = "http://127.0.0.1:8080/node/version";

async function main() {
  try {
    // Create a variable to sum the transaction fees in the whole block
    let totalFees = 0n;

    // Find which Moonbeam network the Sidecar is pointing to
    const response_client = await axios.get(endpointNodeVersion);
    const network = response_client.data.clientImplName;

    // Retrieve the block from the Sidecar endpoint
    const response_block = await axios.get(endpointBlock);
    // Retrieve the block height of the current block
    console.log("Block Height: " + response_block.data.number);

    // Iterate through all extrinsics in the block
    response_block.data.extrinsics.forEach((extrinsic) => {
      // Create an object to store transaction information
      let transactionData = new Object();
      // Set the network field
      transactionData["network"] = network;

      // Filter for Ethereum Transfers
      if (extrinsic.method.pallet === "ethereum" && extrinsic.method.method === "transact") {
        // Iterate through the events to get non type specific parameters
        extrinsic.events.forEach((event) => {
          if (event.method.pallet === "ethereum" && event.method.method === "Executed") {
            // Get Transaction Hash
            transactionData["hash"] = event.data[2];
          }
          if (event.method.pallet === "system" && event.method.method === "ExtrinsicSuccess") {
            // Add correction weight if needed to Transaction Weight!
            transactionData["weight"] = BigInt(event.data[0].weight) + weightCorrection[transactionData["network"]];
          }
        });

        // Get the transaction type and type specific parameters and compute the transaction fee
        if (extrinsic.args.transaction.legacy) {
          transactionData["txType"] = "legacy";
          transactionData["gasPrice"] = BigInt(extrinsic.args.transaction.legacy.gasPrice);
          transactionData["txFee"] = (transactionData["gasPrice"] * transactionData["weight"]) / 25000n;
        } else if (extrinsic.args.transaction.eip1559) {
          transactionData["txType"] = "eip1599";
          transactionData["maxFeePerGas"] = BigInt(extrinsic.args.transaction.eip1559.maxFeePerGas);
          transactionData["maxPriorityFeePerGas"] = BigInt(extrinsic.args.transaction.eip1559.maxPriorityFeePerGas);
          transactionData["baseFee"] = baseFee[transactionData["network"]];

          // Gas price dependes on the MaxFeePerGas and MaxPriorityFeePerGas set
          transactionData["gasPrice"] =
            transactionData["baseFee"] + transactionData["maxPriorityFeePerGas"] < transactionData["maxFeePerGas"]
              ? transactionData["baseFee"] + transactionData["maxPriorityFeePerGas"]
              : transactionData["maxFeePerGas"];

          transactionData["txFee"] = (transactionData["gasPrice"] * transactionData["weight"]) / 25000n;
        } else if (extrinsic.args.transaction.eip2930) {
          transactionData["txType"] = "eip2930";
          transactionData["gasPrice"] = BigInt(extrinsic.args.transaction.eip2930.gasPrice);
          transactionData["txFee"] = (transactionData["gasPrice"] * transactionData["weight"]) / 25000n;
        }

        // Increment totalFees
        totalFees += transactionData["txFee"];

        // Display the tx information to console
        console.log(transactionData);
      }
      // Filter for Substrate transactions, check if the extrinsic has a "TransactionFeePaid" event
      else {
        extrinsic.events.forEach((event) => {
          if (event.method.pallet === "transactionPayment" && event.method.method === "TransactionFeePaid") {
            transactionData["txType"] = "substrate";
            transactionData["txFee"] = event.data[1];
            transactionData["tip"] = event.data[1];
          }
          if (event.method.pallet === "system" && event.method.method === "ExtrinsicSuccess") {
            transactionData["weight"] = event.data[0].weight;
          }
        });
      }
    });

    // Output the total amount of fees in the block
    console.log("Total fees in block: " + totalFees);
  } catch (err) {
    console.log(err);
  }
}

main();
```