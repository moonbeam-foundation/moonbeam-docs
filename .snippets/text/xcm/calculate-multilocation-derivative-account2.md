Copy the account of your existing or newly created account on [Statemint Alphanet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-sm-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation-derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation-derivative account can be initiated only via valid XCM instructions from its corresponding account. In other words, you are the only one who can initiate transactions on your multilocation-derivative account - and if you lose access to your Statemine Alphanet account, you’ll also lose access to your multilocation-derivative account.

To generate the multilocation-derivative account, first clone the [xcm-tools](https://github.com/PureStake/xcm-tools){target=_blank} repo. Run `yarn` to install the necessary packages, and then set up your request as follows:

```sh
yarn calculate-multilocation-derivative-account \
--w wss://wss.api.moonbase.moonbeam.network \
--a YOUR_STATEMINT_ALPHANET_ACCOUNT_HERE \
--p PARACHAIN_ID_IF_APPLIES \
--n westend
```

Let's review the parameters passed along with this command:

- The `-w` flag corresponds to the endpoint we’re using to fetch this information
- The `-a` flag corresponds to your Statemint Alphanet address
- The `-p` flag corresponds to the parachain ID of the origin chain (if applies), if you are sending the XCM from the relay chain, you don't need to provide this parameter. We're sending the message from Statemint Alphanet, which is a parachain with ID: `1001`.
- The `-n` flag corresponds to the name of the relay chain that Moonbase relay is based on. The Moonbase relay chain is based on the architecture of the Westend network.  

After filling in the required parameters, your request should look like the below (remember to add your account address): 

```sh
yarn calculate-multilocation-derivative-account \
--w wss://wss.api.moonbase.moonbeam.network \
--a YOUR_STATEMINT_ALPHANET_ACCOUNT_HERE \
--p 1001 \
--n westend
```
