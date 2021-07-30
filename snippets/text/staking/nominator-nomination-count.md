If you've never made a nomination from your address you can skip this section. However, if you're unsure how many existing nominations you have, you'll want to run the following JavaScript code snippet to get `nomination_count` from within [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js):

```js
// Simple script to get your number of existing nominations.
// Remember to replace YOUR_ADDRESS_HERE with your nominator address.
const yourNominatorAccount = 'YOUR_ADDRESS_HERE'; 
const nominatorInfo = await api.query.parachainStaking.nominatorState(yourNominatorAccount);
console.log(nominatorInfo.toHuman()["nominations"].length);
```

 1. Head to the "Developer" tab 
 2. Click on "JavaScript"
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get existing nominations". This will save the code snippet locally
 5. Click on the run button. This will execute the code from the editor box
 6. Copy the result, as you'll need it when initiating a nomination

![Get existing nomination count](/images/staking/staking-stake-4.png)