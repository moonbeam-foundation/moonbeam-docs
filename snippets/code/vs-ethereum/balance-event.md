```js
import { typesBundle } from "moonbeam-types-bundle";
import { ApiPromise, WsProvider } from "@polkadot/api";


// This script will listen to all MOVRs transfers (Substrate & Ethereum)

const main = async () => {
  // Define the provider
  const wsProvider = new WsProvider("wss://wss.moonriver.moonbeam.network");

  // Create the provider using Moonbeam types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: typesBundle,
  });

  
  polkadotApi.query.system.events((events) => {
    // Loop through the Vec<EventRecord>
    events.forEach(({ event }) => {

      // Check if the event is related to balances.Transfer
      if (event.section == "balances" && event.method == "Transfer") {

        // Extract the relevant information
        const from = event.data[0].toString();
        const to = event.data[1].toString();
        const balance = event.data[2].toBigInt();

        // Balance is shown in the min unit
        console.log(`Transfer from ${from} to ${to} of ${balance}`);
      }
    });
  });
};

main();
```