Copy the account of your existing or newly created account on the [Moonbase relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank}. You're going to need it to calculate the corresponding multilocation-derivative account, which is a special type of account that’s keyless (the private key is unknown). Transactions from a multilocation-derivative account can be initiated only via valid XCM instructions from the corresponding account on the relay chain. In other words, you are the only one who can initiate transactions on your multilocation-derivative account, and if you lose access to your Moonbase relay account, you’ll also lose access to your multilocation-derivative account.

To generate the multilocation-derivative account, first clone the [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} repo. Run `yarn` to install the necessary packages, and then run:

```sh
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address INSERT_MOONBASE_RELAY_ACCOUNT \
--para-id INSERT_ORIGIN_PARACHAIN_ID_IF_APPLIES \
--parents INSERT_PARENTS_VALUE_IF_APPLIES
```

Let's review the parameters passed along with this command:

- The `--ws-provider` or `-w` flag corresponds to the endpoint we’re using to fetch this information
- The `--address` or `-a` flag corresponds to your Moonbase relay chain address
- The `--para-id` or `-p` flag corresponds to the parachain ID of the origin chain (if applicable). If you are sending the XCM from the relay chain, you don't need to provide this parameter
- The `-parents` flag corresponds to the parents value of the origin chain in relation to the destination chain. If you're deriving a multi-location derivative account on a parachain destination from a relay chain origin, this value would be `1`. If left out, the parents value defaults to `0`