To match the Substrate standard, Moonbeam collator's session keys are [SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from/){target=\_blank}. This guide will show you how you can create/rotate your session keys associated with your collator node.

First, make sure you're [running a collator node](/node-operators/networks/run-a-node/overview/){target=\_blank}. Once you have your collator node running, your terminal should print similar logs:

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.webp)

Next, session keys can be created/rotated by sending an RPC call to the HTTP endpoint with the `author_rotateKeys` method. When you call `author_rotateKeys`, the result is the size of two keys. The response will contain a concatenated Nimbus ID and VRF key. The Nimbus ID will be used to sign blocks and the [VRF](https://wiki.polkadot.network/docs/learn-randomness#vrf/){target=\_blank} key is required for block production. The concatenated keys will be used to create an association to your H160 account for block rewards to be paid out.

For reference, if your collator's HTTP endpoint is at port `9944`, the JSON-RPC call might look like this:

```bash
curl http://127.0.0.1:9944 -H \
"Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_rotateKeys",
    "params": []
  }'
```

The collator node should respond with the concatenated public keys of your new session keys. The first 64 hexadecimal characters after the `0x` prefix represent your Nimbus ID and the last 64 hexadecimal characters are the public key of your VRF session key. You'll use the concatenated public keys when mapping your Nimbus ID and setting the session keys in the next section.

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.webp)

Make sure you write down the concatenated public keys. Each of your servers, your primary and backup, should have their own unique keys. Since the keys never leave your servers, you can consider them a unique ID for that server.

Next, you'll need to register your session keys and map them to an H160 Ethereum-styled address to which the block rewards are paid.