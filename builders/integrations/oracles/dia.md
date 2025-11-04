---
title: DIA Oracle
description: Learn how to request a dedicated DIA oracle for your dApp, enabling access to price data for 2500+ tokens, randomness, and more.
categories: Oracle Nodes
---

# Introduction to DIA Oracles

## Introduction {: #introduction }

[DIA](https://www.diadata.org){target=\_blank} offers customizable oracles that are tailored to each dApp’s needs. Each oracle can be customized in several ways, including data sources, data cleansing filters, pricing and computational methodologies, update mechanisms, and more. This ensures that the data and oracle remain robust and resilient to market conditions and provide a global market price as well as specific individual or cross-chain market prices.

By collecting billions of raw trades directly from over 90 sources, including CEXs, DEXs, and NFT marketplaces, DIA enables full transparency, customization, and control throughout the entire value stack. DIA's data and oracle suite comprise price feeds for 20,000+ assets, including cryptocurrencies, NFT collections, and liquid-staked tokens, as well as random number generation and other data feed types.

You can visit DIA's documentation to learn how to [Request a Custom Oracle](https://www.diadata.org/docs/how-to-guides/request-a-custom-oracle#request-a-custom-oracle){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Token Price Feeds {: #token-price-feeds }
DIA token price feeds provide smart contracts with real-time price information for [3,000+ cryptocurrencies](https://www.diadata.org/app/price){target=\_blank}, sourced transparently from [90+ trusted, high-volume DEXs and CEXs](https://www.diadata.org/app/source/defi){target=\_blank}.

### Moonbeam Demo Price Oracles {: #moonbeam-demo-price-oracles }

DIA has deployed the following demo oracles for the Moonbeam community, which provide a limited selection of cryptocurrency price feeds with predefined configuration settings:

|    Network     |                                                                 Contract Address                                                                 |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    |      [`0x1f1BAe8D7a2957CeF5ffA0d957cfEDd6828D728f`](https://moonscan.io/address/0x1f1BAe8D7a2957CeF5ffA0d957cfEDd6828D728f){target=\_blank}      |
|   Moonriver    | [`0x11f74b94afb5968119c98ea277a2b73208bb39ab`](https://moonriver.moonscan.io/address/0x11f74b94afb5968119c98ea277a2b73208bb39ab){target=\_blank} |
| Moonbase Alpha | [`0xe23d8713aa3a0a2c102af772d2467064821b8d46`](https://moonbase.moonscan.io/address/0xe23d8713aa3a0a2c102af772d2467064821b8d46){target=\_blank}  |

The demo oracle contracts deployed to Moonbeam are the [DIA Key-Value Oracle Contract V2](https://www.diadata.org/docs/nexus/reference/smart-contracts/diaoraclev2.sol#diaoraclev2-sol){target=\_blank}. The contract is structured as follows:

```solidity
pragma solidity 0.7.4;

contract DIAOracleV2 {
	mapping (string => uint256) public values;
	address oracleUpdater;

	event OracleUpdate(string key, uint128 value, uint128 timestamp);
	event UpdaterAddressChange(address newUpdater);

	constructor() {
		oracleUpdater = msg.sender;
	}

	function setValue(string memory key, uint128 value, uint128 timestamp) public {
		require(msg.sender == oracleUpdater);
		uint256 cValue = (((uint256)(value)) << 128) + timestamp;
		values[key] = cValue;
		emit OracleUpdate(key, value, timestamp);
	}

	function getValue(string memory key) external view returns (uint128, uint128) {
		uint256 cValue = values[key];
		uint128 timestamp = (uint128)(cValue % 2**128);
		uint128 value = (uint128)(cValue >> 128);
		return (value, timestamp);
	}

	function updateOracleUpdaterAddress(address newOracleUpdaterAddress) public {
	  require(msg.sender == oracleUpdater);
		oracleUpdater = newOracleUpdaterAddress;
		emit UpdaterAddressChange(newOracleUpdaterAddress);
	}
}
```

!!! note
    DIA demo oracles are not intended for use in production environments. Developers can request a dedicated, production-ready oracle with custom price feeds and configuration settings. To start the request process, you can check out the [Request a Custom Oracle](https://www.diadata.org/docs/how-to-guides/request-a-custom-oracle#request-a-custom-oracle){target=\_blank} documentation.

#### Included Price Feeds {: #price-feeds }

The price feeds included with the demo oracles are:

- [DIA/USD](https://www.diadata.org/app/price/asset/Ethereum/0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419){target=\_blank}
- [BTC/USD](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000){target=\_blank}
- [USDC/USD](https://www.diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48){target=\_blank}

### How to Access DIA Oracles {: #how-to-access-dia-oracles }

The steps for accessing a price value on DIA oracles are as follows:

1. Access your oracle smart contract on Moonbeam
2. Call `getValue(pair_name)` with `pair_name` being the full pair name, such as `BTC/USD`. You can use the **Read Contract** functionality under the **Contract** tab of the contract on Moonscan to execute this call

The response contains two values:

- The current asset price in USD with a fix-comma notation of 8 decimals
- The UNIX timestamp of the last oracle update

You can find DIA's oracle integration samples in Solidity and Vyper languages by visiting the [Fetch Price Data](https://www.diadata.org/docs/nexus/how-to-guides/fetch-price-data){target=\_blank} guide on DIA's documentation site.

### Supported Token API Endpoints {: #supported-token-api-endpoints }

DIA also supports Rest and GraphQL endpoints to return cryptocurrency price data. You can [visit the DIA documentation](https://www.diadata.org/docs/reference/apis/token-prices){target=\_blank} to see all API endpoints.

For example, you can use the following JavaScript scripts to access the [BTC/USD price feed](#price-feeds):

=== "Rest"

    ```js
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000',
      headers: { 'Content-Type': 'application/json' },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    ```

=== "GraphQL"

    ```js
    const axios = require('axios');

    const url = 'https://api.diadata.org/graphql/query';

    const query = `
      {
        GetFeed(
          Filter: "mair",
          BlockSizeSeconds: 480,
          BlockShiftSeconds: 480,
          StartTime: 1690449575,
          EndTime: 1690535975,
          FeedSelection: [
            {
              Address: "0x0000000000000000000000000000000000000000",
              Blockchain:"Bitcoin",
              Exchangepairs:[],
            },
          ],
        )
        {
          Name
          Time
          Value
          Pools
          Pairs
        }
      }`;

    const data = {
      query: query,
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Request failed:', error.message);
      });
    ```

You can refer to DIA's documentation on [Rest API endpoints](https://www.diadata.org/docs/reference/apis/token-prices/api-endpoints){target=\_blank} and the [GraphQL Endpoint](https://www.diadata.org/docs/reference/apis/token-prices/graphql){target=\_blank} for information on the parameters and return data.

## NFT Floor Price Feeds {: #nft-floor-price-feeds }

DIA NFT floor price feeds provide smart contracts with real-time price information for [18,000+ NFT collections](https://www.diadata.org/nft-api-oracle/){target=\_blank}, sourced on-chain with 100% transparency from [multiple cross-chain NFT marketplaces](https://www.diadata.org/app/source/nft){target=\_blank}.

Please refer to DIA's documentation to find out how you can [request a custom NFT oracle](https://www.diadata.org/docs/request-a-custom-oracle#forum-request){target=\_blank} for NFTs on Moonbeam.

## Random Number Generation {: #random-number-generation }

[DIA xRandom](https://www.diadata.org/docs/nexus/data-products/randomness#randomness){target=\_blank} provides smart contracts with unpredictable and unbiased random numbers, facilitating the development of on-chain use cases such as lotteries, prediction markets, NFT launches, and more.

DIA leverages the Drand public randomness beacon, and updates its oracle with round numbers, randomness and a signature. Drand runs distributed nodes to produce their randomness beacon. Drand uses [Pedersen's DKG (Distributed Key Generation) protocol](https://docs.drand.love/docs/cryptography/#distributed-key-generation-dkg){target=\_blank} to create collective private and public keys. Participants in their League of Entropy then generate randomness in rounds and broadcast it together with its signature.

To learn more about Drand’s randomness beacon, watch the [On-Chain Randomness Oracle | DIA Developer Tutorial](https://youtu.be/7HALDJr8V3g){target=\_blank} and read [Drand’s documentation](https://docs.drand.love/#how-drand-works){target=\_blank}.

### Moonbeam Demo Randomness Oracle {: #moonbeam-demo-randomness-oracle }

DIA has deployed a demo oracle on Moonbase Alpha, which can be accessed at the following address:

```text
0x48d351ab7f8646239bbade95c3cc6de3ef4a6cec
```

The DIA randomness smart contract is structured as follows:

```solidity
pragma solidity ^0.8.30;

contract DIARandomOracle {
  struct Random {
    string randomness;
    string signature;
    string previousSignature;
  }

  mapping(uint256 => Random) public values;
  uint256 public lastRound = 0;
  address public oracleUpdater;
  event OracleUpdate(string key, uint128 value, uint128 timestamp);
  event UpdaterAddressChange(address newUpdater);

  constructor() {
      oracleUpdater = msg.sender;
  }

  function setRandomValue(
    uint256 _round,
    string memory _randomness,
    string memory _signature,
    string memory _previousSignature
  ) public {
    require(msg.sender == oracleUpdater, "not a updater");
    require(lastRound < _round, "old round");
    lastRound = _round;
    values[_round] = Random(_randomness, _signature, _previousSignature);
  }

  function getValue(uint256 _round) external view returns (Random memory) {
    return values[_round];
  }

  function updateOracleUpdaterAddress(address newOracleUpdaterAddress)
    public
  {
    require(msg.sender == oracleUpdater, "not a updater");
    oracleUpdater = newOracleUpdaterAddress;
    emit UpdaterAddressChange(newOracleUpdaterAddress);
  }

  function getRandomValueFromRound(uint256 _round)
    external
    view
    returns (string memory)
  {
    return values[_round].randomness;
  }

  function getRandomValueFromRoundWithSignature(uint256 _round)
    external
    view
    returns (Random memory)
  {
    return values[_round];
  }

    function getLastRound() public view returns (uint256) {
    return lastRound;
  }
}
```

!!! note
    DIA demo oracles are not intended for use in production environments. Developers can request a dedicated, production-ready randomness oracle. To start the request process, you can contact the [integrations team](https://t.me/DIABDteam){target=\_blank} on Telegram.

### How to Use the DIA Randomness Oracle {: #how-to-use-the-dia-randomness-oracle }

The steps for accessing a published random value are as follows:

1. Access your randomness oracle smart contract on Moonbeam
2. Call `getLastRound()`to obtain the ID of the latest published round. You can use the **Read Contract** functionality under the **Contract** tab of the contract on Moonscan to execute this call
3. Call `getRandomValueFromRound(uint256 _round)` using the obtained round ID. Again, you can use Moonscan to quickly execute this call

The response contains the randomness value.

The signature can also be requested by calling `getRandomValueFromRoundWithSignature(uint256 _round)`, which returns a tuple containing the randomness value, the signature, and the previous signature.

To learn how to deploy a randomness-consuming contract on Moonbeam, please refer to the [Deploying a Randomness Consuming Smart Contract on EVM chains with DIA xRandom Oracle](https://youtu.be/BzN-tBgW-xs){target=\_blank} video tutorial.

## Resources {: #resources }

- [Twitter](https://x.com/DIAdata_org){target=\_blank}
- [Discord](https://discord.com/invite/ZvGjVY5uvs){target=\_blank}
- [Website](https://www.diadata.org/){target=\_blank}
- [Docs](https://www.diadata.org/docs/home){target=\_blank}
- [Explore data](https://www.diadata.org/app){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
