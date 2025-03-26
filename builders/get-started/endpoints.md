---
title: Moonbeam API Providers and Endpoints
description: Use one of the supported API providers to connect to a public endpoint or create custom JSON-RPC and WSS endpoints for Moonbeam-based networks.
---

# Network Endpoints

## Public Endpoints {: #public-endpoints }

Moonbeam-based networks have two endpoints available for users to connect to: one for HTTPS and one for WSS.

The endpoints in this section are for development purposes only and are not meant to be used in production applications.

If you are looking for an API provider suitable for production use, you can check out the [Endpoint Providers](#endpoint-providers) section of this guide.

### Moonbeam {: #moonbeam }

--8<-- 'text/builders/get-started/endpoints/moonbeam.md'

### Moonriver {: #moonriver }

--8<-- 'text/builders/get-started/endpoints/moonriver.md'

### Moonbase Alpha {: #moonbase-alpha }

--8<-- 'text/builders/get-started/endpoints/moonbase.md'

## RPC Endpoint Providers {: #endpoint-providers }

You can create your own endpoint suitable for development or production use using any of the following API providers:

- [1RPC](#1rpc)
- [Blast](#blast)
- [Chainstack](#chainstack)
- [Dwellir](#dwellir)
- [GetBlock](#getblock)
- [OnFinality](#onfinality)
- [Pocket Network](#pokt)
- [UnitedBloc](#unitedbloc)
- [dRPC](#drpc)

### 1RPC {: #1rpc}

[1RPC](https://www.1rpc.io){target=\_blank} is a free and private RPC relay that protects user privacy by preventing data collection, user tracking, phishing attempts from other parties. It tunnels user requests via distributed relays to other RPC providers whilst preventing the tracking of user metadata such as IP address, device information and wallet linkability with secure enclave technology.

1RPC is created to be an open initiative from the blockchain infrastructure community. They are motivated by a common good mission to help build a better Web3 and encourage anyone who values user privacy to join this open collaboration.

Head over to [1RPC](https://www.1rpc.io){target=\_blank} official site to set it up!

![1RPC](/images/builders/get-started/endpoints/endpoints-1.webp)

### Blast {: #blast}

As a user of [Blast](https://blastapi.io){target=\_blank} powered by Bware Labs, you will be able to obtain your own free endpoint allowing you to interact with Moonbeam, just by performing a few simple clicks within a user-friendly interface.

To get started, you'll need to head to [Blast](https://blastapi.io){target=\_blank}, and launch the app, and connect your wallet. Once your wallet is connected you will be able to create a project and then generate your own custom endpoint. To generate an endpoint:

1. Create a new project
2. Click on **Available Endpoints**
3. Select a network for your endpoint. There are three options to choose from: Moonbeam, Moonriver and Moonbase Alpha
4. Confirm the selected network and Press **Activate**
5. You'll now see your chosen network under **Active Endpoints**. Click on the network and you'll see your custom RPC and WSS endpoints on the next page

![Bware Labs](/images/builders/get-started/endpoints/endpoints-2.webp)

### Chainstack {: #chainstack }

[Chainstack](https://chainstack.com/){target=\_blank}, the Web3 infrastructure provider, offers free and paid endpoints for Moonbeam. The free Developer plan starts with 3 million monthly requests and 25 requests per second (RPS). You can easily scale with the paid plans.

To start with a free Developer plan endpoint, sign up using an email or any social account, like GitHub or X (Twitter).

1. Visit [Chainstack](https://console.chainstack.com/){target=\_blank}
2. Sign up
3. Deploy a Moonbeam node

![Chainstack](/images/builders/get-started/endpoints/endpoints-3.webp)

### dRPC.org {: #drpc }

dRPC.org offers public and paid [Moonbeam RPC](https://drpc.org/chainlist/moonbeam){target=\_blank} endpoints, providing an efficient, low-latency connection to blockchain nodes. The paid tiers include higher request limits, lower latency, and advanced analytics for optimized performance.

How to use dRPC:

1. Sign up or log in at [dRPC.org](https://drpc.org/){target=\_blank}
2. In the dashboard, create an API key
3. Click the key and select the desired endpoint

For 24/7 support, join dRPC's [Discord](https://drpc.org/discord){target=\_blank}.

### Dwellir {: #dwellir }

[Dwellir](https://www.dwellir.com){target=\_blank} is a blockchain operation service that ensures global scalability, low latency, and a 99.99% uptime guarantee, providing fast and reliable node operations wherever your business stands. The public endpoint service is geographically distributed bare metal servers globally. As the service is public, there are no sign-up or API keys to manage.

To get started with a developer endpoint or dedicated node, you'll need to contact us:

1. Visit [Dwellir](https://www.dwellir.com/contact){target=\_blank}
2. Submit your **email** and your node request

![Dwellir](/images/builders/get-started/endpoints/endpoints-4.webp)

### GetBlock {: #getblock }

[GetBlock](https://getblock.io){target=\_blank} is a service that provides instant API access to Moonbeam and Moonriver and is available through shared and dedicated nodes. [Dedicated nodes](https://docs.getblock.io/getting-started/plans-and-limits/choosing-your-plan#dedicated-nodes){target=\_blank} provide access to a private server with fast speeds and without rate limits. [Shared nodes](https://docs.getblock.io/getting-started/plans-and-limits/choosing-your-plan#shared-nodes){target=\_blank} provide a free API key based endpoint for you to get started quickly.

To get started with GetBlock and obtain an API key, you can go the [GetBlock registration page](https://account.getblock.io/sign-up){target=\_blank} and sign up. From the **GetBlock Dashboard**, you can view and manage your existing API keys and create new API keys.

Creating a new API key is simple, all you have to do is:

1. Click **Create a new API key**
2. Enter a name for your API key
3. Click **Create** to generate your API key

![GetBlock](/images/builders/get-started/endpoints/endpoints-5.webp)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io){target=\_blank} provides a free API key based endpoint for customers in place of a public endpoint. Additionally, OnFinality offers paid tiers of service that offer increased rate limits and higher performance than those offered by the free tier. You also receive more in depth analytics of the usage of your application.

To create a custom OnFinality endpoint, go to [OnFinality](https://onfinality.io){target=\_blank} and sign up, or if you already have signed up you can go ahead and log in. From the OnFinality **Dashboard**, you can:

1. Click on **API Service**
2. Select the network from the dropdown
3. Your custom API endpoint will be generated automatically

![OnFinality](/images/builders/get-started/endpoints/endpoints-6.webp)

### Pocket Network {: #pokt }

[Pocket Network](https://www.pokt.network){target=\_blank} is a decentralized node service that provides a free personal endpoint to DApps on Moonbeam & Moonriver.  

To get your own endpoint, go to [Pocket Network](https://mainnet.portal.pokt.network/#){target=\_blank} and sign up or log in. From the **Portal**, you can:  

1. Click on **Apps**
2. Select **Create**
3. Enter the name of your DApp and select your corresponding network
4. Your new endpoint will be generated and displayed for you in the following app screen

![Pocket Network](/images/builders/get-started/endpoints/endpoints-7.webp)

You don't have to generate a new DApp for every endpoint! You can add a new chain to your preexisting DApp:  

1. Click on your preexisting app in the **Apps** menu
2. In the **Endpoint** section, select the **Add new** button and search for your desired network in the dropdown
3. Your new endpoint will be generated and displayed for you

### UnitedBloc {: #unitedbloc }

[UnitedBloc](https://medium.com/unitedbloc/unitedbloc-rpc-c84972f69457){target=\_blank} is a collective of community collators from both Moonbeam and Moonriver. To provide value for the community, they offer public RPC services for the Moonbeam, Moonriver, and Moonbase Alpha networks.

The public endpoint service is served by eight geographically distributed bare metal servers globally balanced via GeoDNS and regionally load balanced with NGINX. As the service is public, there are no sign-up or API keys to manage.

The collators involved in this initiative are:

 - Blockshard (CH)
 - BloClick (ES)
 - BrightlyStake (IN)
 - CertHum (US)
 - GPValidator (PT)
 - Hetavalidation (AU)
 - Legend (AE)
 - PathrockNetwork (DE)
 - Polkadotters (CZ)
 - SIK | crifferent.de (DE)
 - StakeBaby (GR)
 - StakeSquid (GE)
 - TrueStaking (US)

They also provide a [public Grafana dashboard](https://monitoring.unitedbloc.com:3030/public-dashboards/7444d2ab76ee45eda181618b0f0ecb98?orgId=1){target=\_blank} with some cool metrics.

Check the [public endpoints section](#public-endpoints) to get the relevant URL. You can contact them via their [Telegram channel](https://t.me/+tRvy3z5-Kp1mMGMx){target=\_blank}, or read more about their initiative on their [blogpost page](https://medium.com/unitedbloc/unitedbloc-rpc-c84972f69457){target=\_blank}.

## Lazy Loading with RPC Endpoint Providers {: #lazy-loading-with-RPC-Endpoint-Providers }

Lazy loading lets a Moonbeam node operate while downloading network state in the background, eliminating the need to wait for full synchronization before use. To spin up a Moonbeam node with lazy loading, you'll need to either [download the Moonbeam release binary](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=_blank} or [compile the binary](/node-operators/networks/run-a-node/compile-binary/#compile-the-binary){target=_blank}. You can activate lazy loading with the following flag:

`--lazy-loading-remote-rpc 'INSERT-RPC-URL'`

Lazy loading is highly resource-intensive, requiring many RPC requests to function. To avoid being throttled, it's recommended that you use a [dedicated endpoint](#endpoint-providers) (i.e., an endpoint with an API key) rather than a public endpoint. You will likely be rate-limited if you use lazy loading with a public endpoint. Upon spooling up a node with this feature, you'll see output like the following:

--8<-- 'code/node-operators/networks/run-a-node/terminal/lazy-loading.md'

### Overriding State with Lazy Loading

By default, you won't see detailed logging in the terminal. To override this setting and show lazy loading logs, you can add the following flag to your command to start the Moonbeam node: `-l debug`. You can further customize your use of the lazy loading functionality with the following optional parameters:

- **`--lazy-loading-block`** - specifies a block hash from which to start loading data. If not provided, the latest block will be used
- **`--lazy-loading-delay-between-requests`** - the delay (in milliseconds) between RPC requests when using lazy loading. This parameter controls the amount of time to wait between consecutive RPC requests. This can help manage request rate and avoid overwhelming the server. Default value is `100` milliseconds
- **`--lazy-loading-max-retries-per-request`** - the maximum number of retries for an RPC request when using lazy loading. Default value is `10` retries
- **`--lazy-loading-runtime-override`** - path to a WASM file to override the runtime when forking. If not provided, it will fetch the runtime from the block being forked
- **`--lazy-loading-state-overrides`** - path to a JSON file containing state overrides to be applied when forking

#### Simple Storage Item Override

The state overrides file should define the respective pallet, storage item, and value that you seek to override as follows:

```json
[
 {
     "pallet": "System",
     "storage": "SelectedCandidates",
     "value": "0x04f24ff3a9cf04c71dbc94d0b566f7a27b94566cac"
 }
]
```

#### Override an Account's Free Balance

To override the balance of a particular account, you can override the account storage item of the system pallet for the respective account as follows:

```json
[
  {
    "pallet": "System",
    "storage": "Account",
    "key": "TARGET_ADDRESS",
    "value": "0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080"
  }
]
```

??? note "Details about overriding account balances"

    Overriding an account balance, as shown above, can be a complex process. However, this guide will break it down into steps that are easy to follow. Before making any changes, you should obtain the existing value corresponding to the key (i.e., the account in this case). You can go to [**Chain State** on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank} and query the System pallet by providing the account you'd like to query. Upon submitting the query, you'll get back a readable account structure like so:

    ```text
    {
      nonce: 3,142
      consumers: 2
      providers: 1
      sufficients: 6
      data: {
        free: 1,278,606,392,142,175,328,676
        reserved: 348,052,500,000,000,000,000
        frozen: 20,413,910,106,633,175,872
        flags: 170,141,183,460,469,231,731,687,303,715,884,105,728
      }
    }
    ```

    While this is useful as a reference, the information you're looking for is the encoded storage key, which is accessible even without submitting the chain state query. In this instance, the encoded storage key corresponding to the system pallet and the selected account `0x3B939FeaD1557C741Ff06492FD0127bd287A421e` is:

    ```text
    0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9b882fedb4f75b055c709ec5b66b5d9933b939fead1557c741ff06492fd0127bd287a421e
    ```

    Note that this encoded storage key will change alongside any input changes, such as a different account being queried. Then, head over the **Raw Storage** tab on [Polkadot.js Apps](https://polkadot.js.org/apps/#/chainstate/raw){target=_blank}. Input the above storage key and submit the query. The response is the SCALE encoded account struct, a part of which contains the free balance information to be modified as part of this example: 

    ```text
    0x460c0000020000000100000006000000a4d92a6a4e6b3a5045000000000000000040a556b0e032de12000000000000004083a09e15c74c1b010000000000000000000000000000000000000000000080
    ```

    There is quite a bit of data encoded in the value field because it is a complex struct comprised of multiple values. The struct is comprised of:

    ```text
    struct AccountInfo {
        nonce: u32,             // Transaction count
        consumers: u32,         // Number of consumers 
        providers: u32,         // Number of providers
        sufficients: u32,       // Number of sufficients
        data: AccountData {     // The balance info
            free: u128,         // Free balance
            reserved: u128,     // Reserved balance
            frozen: u128,       // Frozen balance
            flags: u128         // Account flags
        }
    }
    ```

    You can associate each part of the SCALE encoded struct with the corresponding piece of Alice's account information that it represents:

    ```text
    0x460c0000        // nonce (u32): 3,142 
    02000000          // consumers (u32): 2
    01000000          // providers (u32): 1  
    06000000          // sufficients (u32): 6

    a4d92a6a4e6b3a5045000000000000000  
    // free (u128): 1,278,606,392,142,175,328,676

    40a556b0e032de1200000000000000000  
    // reserved (u128): 348,052,500,000,000,000,000  

    4083a09e15c74c1b01000000000000000  
    // frozen (u128): 20,413,910,106,633,175,872

    00000000000000000000000000000080   
    // flags (u128): 170,141,183,460,469,231,731,687,303,715,884,105,728
    ```

    Remember that the values are little endian encoded. To convert the hexadecimal little endian encoded values to decimal, you can use [Substrate Utilities converter](https://www.shawntabrizi.com/substrate-js-utilities/){target=_blank}, using the **Balance to Hex (Little Endian)** converter.

    In this example, the existing free balance of `1,278,606,392,142,175,328,676` Wei or approximately `1278.60` DEV is `a4d92a6a4e6b3a5045`. The following example will change the value to `500,000` DEV, which is `500,000,000,000,000,000,000,000` Wei or `0x000080d07666e70de169` encoded as a hexadecimal little endian value. When properly padded to fit into the SCALE encoded storage value, it becomes `69e10de76676d08000000000000000000`, such that the table now looks like:

    ```text
    0x460c0000        // nonce (u32): 3,142 
    02000000          // consumers (u32): 2
    01000000          // providers (u32): 1  
    06000000          // sufficients (u32): 6

    69e10de76676d08000000000000000000
    // free (u128): 500,000,000,000,000,000,000,000

    40a556b0e032de1200000000000000000  
    // reserved (u128): 348,052,500,000,000,000,000  

    4083a09e15c74c1b01000000000000000  
    // frozen (u128): 20,413,910,106,633,175,872

    00000000000000000000000000000080   
    // flags (u128): 170,141,183,460,469,231,731,687,303,715,884,105,728
    ```

    Therefore, the SCALE encoded override value is as follows:

    ```text
    0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080
    ```

    You can now specify the SCALE encoded override value in your `state-overrides.json` file as follows:

    ```json
    [
      {
        "pallet": "System",
        "storage": "Account",
        "key": "0x3b939fead1557c741ff06492fd0127bd287a421e",
        "value": "0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080"
      }
    ]
    ```

    To run lazy loading with the balance state override, you can use the following command: 

    ```bash
    --lazy-loading-remote-rpc 'INSERT_RPC_URL' --lazy-loading-state-overrides ./state-overrides.json
    ```

#### Override an ERC-20 Token Balance

To override an ERC-20 token balance, identify the storage slot in the EVM’s AccountStorages where the `balanceOf` data for the given token contract and account is stored. This storage slot is determined by the token contract’s H160 address and the corresponding H256 storage key. Once you have this slot, specify the new balance value in the `state-overrides.json` file to implement the override.

In the example below, we override the token balance of the [Wormhole USDC Contract (`0x931715FEE2d06333043d11F658C8CE934aC61D0c`)](https://moonscan.io/address/0x931715FEE2d06333043d11F658C8CE934aC61D0c){target=\_blank} for the account `0x3b939fead1557c741ff06492fd0127bd287a421e` to $5,000 USDC. Since Wormhole USDC uses 6 decimal places, $5,000 corresponds to `5000000000` in integer form, which is `0x12a05f200` in hexadecimal.

```json
[
    {
        "pallet": "EVM",
        "storage": "AccountStorages",
        "key": [
            "0x931715FEE2d06333043d11F658C8CE934aC61D0c",
            "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
        ],
        "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
    }
]
```

You can calculate the exact storage slot to override for your own account with the following script:

```js
import { ethers } from 'ethers';

function getBalanceSlot(accountAddress) {
  // Convert address to bytes32 and normalize
  const addr = ethers.zeroPadValue(accountAddress, 32);

  // CAUTION! The storage slot used here is 5, which
  // is specific to Wormhole contracts
  // The storage slot index for other tokens may vary
  const packedData = ethers.concat([
    addr,
    ethers.zeroPadValue(ethers.toBeHex(5), 32),
  ]);

  // Calculate keccak256
  return ethers.keccak256(packedData);
}

// Example usage
const address = 'INSERT_ADDRESS';
console.log(getBalanceSlot(address));
```

You can apply the same process for other ERC-20 token contracts. The following sections demonstrate overrides for the `0x3B939FeaD1557C741Ff06492FD0127bd287A421e` account with various ERC-20 tokens. Remember to update the H160 token contract address whenever you switch to a different token. Also, you will need to recalculate the H256 storage slot for each distinct account whose balance you want to override.

??? code "Example: Override Wormhole BTC Token Balance"

    ```json
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0xE57eBd2d67B462E9926e04a8e33f01cD0D64346D",
                "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]
    ```

??? code "Example: Override Wormhole ETH Token Balance"

    ```json
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0xab3f0245B83feB11d15AAffeFD7AD465a59817eD",
                "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]
    ```

??? code "Example: Override WELL Token Balance"

    Because the [WELL token](https://moonbeam.moonscan.io/token/0x511ab53f793683763e5a8829738301368a2411e3){target=\_blank} does not use a proxy implementation contract, the storage slot calculation differs. Instead of slot `5`, the balance mapping resides at slot `1`. You can determine the exact storage slot to override the WELL token balance for your own account using the following script:

    ```js
    import { ethers } from 'ethers';

    function getBalanceSlot(accountAddress) {
      // Convert address to bytes32 and normalize
      const addr = ethers.zeroPadValue(accountAddress, 32);

      // Caution! The storage slot index used here is 1
      // The storage slot index for other tokens may vary
      const packedData = ethers.concat([
        addr,
        ethers.zeroPadValue(ethers.toBeHex(1), 32),
      ]);

      // Calculate keccak256
      return ethers.keccak256(packedData);
    }

    // Example usage
    const address = 'INSERT_ADDRESS';
    console.log(getBalanceSlot(address));
    ```

    Thus, the storage override would be:

    ```json
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0x511aB53F793683763E5a8829738301368a2411E3",
                "0x728d3daf4878939a6bb58cbc263f39655bb57ea15db7daa0b306f3bf2c3f1227"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]
    ```

## Tracing RPC Endpoint Providers {: #tracing-providers }

Tracing RPC endpoints allow you to access non-standard RPC methods, such as those that belong to Geth's `debug` and `txpool` APIs and OpenEthereum's `trace` module. To see a list of the supported non-standard RPC methods on Moonbeam for debugging and tracing, please refer to the [Debug API & Trace Module](/builders/ethereum/json-rpc/debug-trace/){target=\_blank} guide.

The following providers provide tracing RPC endpoints:

- [OnFinality](#onfinality-tracing)

### OnFinality {: #onfinality-tracing }

[OnFinality](https://onfinality.io){target=\_blank}'s Trace API can be used to quickly get started tracing and debugging transactions on Moonbeam and Moonriver. It is only available to users on their [Growth and Ultimate plans](https://onfinality.io/pricing){target=\_blank}.

To use the Trace API, you simply call the trace method of your choice from your [private RPC endpoint](#onfinality). For a list of the supported networks and trace methods, please check out [OnFinality's Trace API documentation](https://documentation.onfinality.io/support/trace-api#TraceAPI-SupportedNetworks){target=\_blank}.

Please note that if you are tracing historic blocks, it is recommended to use your own dedicated trace node to backfill any data, and then once you're caught up, you can switch to using the Trace API. You can check out the [How to Deploy a Trace Node for Moonbeam on OnFinality](https://onfinality.medium.com/how-to-deploy-a-trace-node-for-moonbeam-on-onfinality-85683181d290){target=-_blank} post for more information on how to spin up your own dedicated trace node.
