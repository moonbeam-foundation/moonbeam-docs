First, you need to get the `collator_nominator_count` as you'll need to submit this parameter in a later transaction. To do so, you'll have to run the following JavaScript code snippet from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js):

```js
// Simple script to get collator_nominator_count
// Remember to replace COLLATOR_ADDRESS with the address of desired collator.
const collatorAccount = 'COLLATOR_ADDRESS'; 
const collatorInfo = await api.query.parachainStaking.collatorState2(collatorAccount);
console.log(collatorInfo.toHuman()["nominators"].length);
```

 1. Head to the "Developer" tab 
 2. Click on "JavaScript"
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get collator_nominator_count". This will save the code snippet locally
 5. Click on the run button. This will execute the code from the editor box
 6. Copy the result, as you'll need it when initiating a nomination

![Get collator nominator count](/images/tokens/staking/stake/stake-3.png)