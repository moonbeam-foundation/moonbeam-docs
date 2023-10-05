```ts
import axios from 'axios';

// This script calculates the transaction fees of all transactions in a block
// according to the transaction type (for Ethereum API: legacy, EIP-1559 or
// EIP-2930 standards, and Substrate API) using the dynamic fee mechanism.
// It also calculates the total fees in the block

// Endpoint to retrieve the latest block
const endpointBlock = 'http://127.0.0.1:8080/blocks/head';
// Endpoint to retrieve the latest nextFeeMultiplier
const endpointPallet =
  'http://127.0.0.1:8080/pallets/transaction-payment/storage/nextFeeMultiplier?at=';
// Endpoint to retrieve the node client's information
const endpointNodeVersion = 'http://127.0.0.1:8080/node/version';

// Define the minimum base fee for each network
const baseFee = {
  moonbeam: 125000000000n,
  moonriver: 1250000000n,
  moonbase: 125000000n,
};

async function main() {
  try {
    // Create a variable to sum the transaction fees in the whole block
    let totalFees = 0n;

    // Find which Moonbeam network the Sidecar is pointing to
    const responseClient = await axios.get(endpointNodeVersion);
    const network = responseClient.data.clientImplName;

    // Retrieve the block from the Sidecar endpoint
    const responseBlock = await axios.get(endpointBlock);
    // Retrieve the block height of the current block
    console.log('Block Height: ' + responseBlock.data.number);

    // Due to a current bug, use the previous block's base fee
    // to match the on-chain data
    // Find the block's nextFeeMultiplier
    const prevBlock = Number(responseBlock.data.number) - 1;
    const responsePallet = await axios.get(endpointPallet + prevBlock);

    // Iterate through all extrinsics in the block
    responseBlock.data.extrinsics.forEach((extrinsic) => {
      // Create an object to store transaction information
      let transactionData = new Object();
      // Set the network field
      transactionData['network'] = network;

      // Filter for Ethereum Transfers
      if (
        extrinsic.method.pallet === 'ethereum' &&
        extrinsic.method.method === 'transact'
      ) {
        // Iterate through the events to get non type specific parameters
        extrinsic.events.forEach((event) => {
          if (
            event.method.pallet === 'ethereum' &&
            event.method.method === 'Executed'
          ) {
            // Get Transaction Hash
            transactionData['hash'] = event.data[2];
          }
          if (
            event.method.pallet === 'system' &&
            event.method.method === 'ExtrinsicSuccess'
          ) {
            // Add correction weight if needed to Transaction Weight!
            transactionData['weight'] = BigInt(event.data[0].weight.refTime);
          }
        });

        // Get the transaction type and type specific parameters and compute the
        // transaction fee
        if (extrinsic.args.transaction.legacy) {
          transactionData['txType'] = 'legacy';
          transactionData['gasPrice'] = BigInt(
            extrinsic.args.transaction.legacy.gasPrice
          );
          transactionData['txFee'] =
            (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
        } else if (extrinsic.args.transaction.eip1559) {
          transactionData['txType'] = 'eip1599';
          transactionData['maxFeePerGas'] = BigInt(
            extrinsic.args.transaction.eip1559.maxFeePerGas
          );
          transactionData['maxPriorityFeePerGas'] = BigInt(
            extrinsic.args.transaction.eip1559.maxPriorityFeePerGas
          );
          // Update based on the network you're getting tx fees for
          transactionData['baseFee'] =
            (BigInt(responsePallet.data.value) * baseFee.moonbeam) /
            BigInt('1000000000000000000');

          // Gas price dependes on the MaxFeePerGas and MaxPriorityFeePerGas set
          transactionData['gasPrice'] =
            transactionData['baseFee'] +
              transactionData['maxPriorityFeePerGas'] <
            transactionData['maxFeePerGas']
              ? transactionData['baseFee'] +
                transactionData['maxPriorityFeePerGas']
              : transactionData['maxFeePerGas'];

          transactionData['txFee'] =
            (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
        } else if (extrinsic.args.transaction.eip2930) {
          transactionData['txType'] = 'eip2930';
          transactionData['gasPrice'] = BigInt(
            extrinsic.args.transaction.eip2930.gasPrice
          );
          transactionData['txFee'] =
            (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
        }

        // Increment totalFees
        totalFees += transactionData['txFee'];

        // Display the tx information to console
        console.log(transactionData);
      }
      // Filter for Substrate transactions, check if the extrinsic has a
      // 'TransactionFeePaid' event
      else {
        extrinsic.events.forEach((event) => {
          if (
            event.method.pallet === 'transactionPayment' &&
            event.method.method === 'TransactionFeePaid'
          ) {
            transactionData['txType'] = 'substrate';
            transactionData['txFee'] = event.data[1];
            transactionData['tip'] = event.data[1];
          }
          if (
            event.method.pallet === 'system' &&
            event.method.method === 'ExtrinsicSuccess'
          ) {
            transactionData['weight'] = event.data[0].weight.refTime;
          }
        });
      }
    });

    // Output the total amount of fees in the block
    console.log('Total fees in block: ' + totalFees);
  } catch (err) {
    console.log(err);
  }
}

main();
```