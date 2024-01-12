import axios from 'axios';

// This script will decode all native token transfers (Substrate & Ethereum) in a given Sidecar block, and extract the tx hash. It can be adapted for any Moonbeam network.

// Endpoint to retrieve the latest block
const endpoint = 'http://127.0.0.1:8080/blocks/head';

async function main() {
  try {
    // Retrieve the block from the Sidecar endpoint
    const response = await axios.get(endpoint);
    // Retrieve the block height of the current block
    console.log('Block Height: ' + response.data.number);

    // Iterate through all extrinsics in the block
    response.data.extrinsics.forEach((extrinsic) => {
      // Retrieve Ethereum Transfers
      if (
        extrinsic.method.pallet === 'ethereum' &&
        extrinsic.method.method === 'transact'
      ) {
        // Get the value for any of the three EIP transaction standards supported
        const value =
          (extrinsic.args.transaction.legacy &&
            extrinsic.args.transaction.legacy.value) ||
          (extrinsic.args.transaction.eip1559 &&
            extrinsic.args.transaction.eip1559.value) ||
          (extrinsic.args.transaction.eip2930 &&
            extrinsic.args.transaction.eip2930.value);

        // Iterate through the events to get transaction details
        extrinsic.events.forEach((event) => {
          if (
            event.method.pallet === 'ethereum' &&
            event.method.method === 'Executed'
          ) {
            console.log('From: ' + event.data[0]);
            console.log('To: ' + event.data[1]);
            console.log('Tx Hash: ' + event.data[2]);
            console.log('Value: ' + value);
            // Check the execution status
            if (event.data[3].succeed) {
              console.log('Status: Success');
            } else {
              console.log('Status: Failed');
            }
          }
        });
      }

      // Retrieve Substrate Transfers
      if (
        extrinsic.method.pallet === 'balances' &&
        (extrinsic.method.method === 'transferKeepAlive' ||
          extrinsic.method.method === 'transferAllowDeath')
      ) {
        // Iterate through the events to get transaction details
        extrinsic.events.forEach((event) => {
          if (
            event.method.pallet === 'balances' &&
            event.method.method === 'Transfer'
          ) {
            console.log('From: ' + event.data[0]);
            console.log('To: ' + event.data[1]);
            console.log('Tx Hash: ' + extrinsic.hash);
            console.log('Value: ' + event.data[2]);
            // Check the execution status
            if (extrinsic.success) {
              console.log('Status: Success');
            } else {
              console.log('Status: Failed');
            }
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

main();
