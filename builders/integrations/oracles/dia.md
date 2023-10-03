---
title: DIA Oracle
description: Learn how to request a dedicated DIA oracle for your dApp, enabling access to price data for 2500+ tokens, randomness, and more. 
---

# Introduction to DIA Oracles

## Requesting a custom oracle

[DIA](https://www.diadata.org/) offers **customizable oracles that are tailored to each dApp’s needs**. Each oracle can be customized in several ways, including data sources, data cleansing filters, pricing and computational methodologies, update mechanisms and more. This ensures that the data and oracle remain robust and resilient to the market conditions and provide a global market price as well as specific individual or cross-chain market prices.

By collecting billions of raw trades directly from over **90 sources, including CEXs, DEXs, and NFT marketplaces**, DIA enables full transparency, customization, and control throughout the entire value stack. DIA's data and oracle suite comprise **price feeds for 20,000+ assets** including cryptocurrencies, NFT collections, and liquid-staked tokens, as well as random number generation and other data feed types.

→ [Request a Custom Oracle | DIA Documentation](https://docs.diadata.org/introduction/intro-to-dia-oracles/request-an-oracle)

# 🪙 Token Price Feeds

DIA token price feeds provide smart contracts with real-time price information for [3,000+ cryptocurrencies](https://diadata.org/app/price), sourced transparently from [90+ trusted, high-volume DEXs and CEXs](https://diadata.org/app/source/defi).

## How to access DIA oracles?

Here is an example of how to access a price value on DIA oracles:

1. Access your custom oracle smart contract on Moonbeam.
2. Call `getValue(pair_name)` with `pair_name` being the full pair name such as `BTC/USD`. You can use the "Read" section on the explorer to execute this call.
3. The response of the call contains two values:
- The current asset price in USD with a fix-comma notation of 8 decimals.
- The UNIX timestamp of the last oracle update.

You can find DIA's oracle integration samples in Solidity and Vyper languages by visiting:

→ [Access the Oracle | DIA Documentation](https://docs.diadata.org/products/token-price-feeds/access-the-oracle)

## Moonbeam demo price oracles

DIA has deployed the following demo oracles for the Moonbeam community. It provides a limited selection of cryptocurrency price feeds with predefined configuration settings.

> ⚠️ NOTE: DIA demo oracles are not intended for use in production environments. Developers can request a dedicated, production-ready oracle with custom price feeds and configuration settings. Start the request process: [Request a Custom Oracle | DIA Documentation](https://docs.diadata.org/introduction/intro-to-dia-oracles/request-an-oracle)

### Demo Oracle Smart Contracts

| Network        | Contract address      
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Moonbeam Alpha  | [`0xe23d8713aa3a0a2c102af772d2467064821b8d46`](https://moonbase.moonscan.io/address/0xe23d8713aa3a0a2c102af772d2467064821b8d46)        |
| Moonriver  | [`0x11f74b94afb5968119c98ea277a2b73208bb39ab`](https://moonriver.moonscan.io/address/0x11f74b94afb5968119c98ea277a2b73208bb39ab)        |

### Included Price Feeds

[DIA/USD](https://diadata.org/app/price/asset/Ethereum/0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419/), [BTC/USD](https://diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000/), [USDC/USD](https://diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/)

## Supported token API endpoints

DIA also supports API and GraphQL endpoints to return cryptocurrency price data. You can [visit the DIA Documentation](https://docs.diadata.org/products/token-price-feeds/access-api-endpoints) to see all API endpoints.

# 🎨 NFT Floor Price Feeds

DIA NFT floor price feeds provide smart contracts with real-time price information of [18,000+ NFT collections](https://diadata.org/app/floor-price), sourced on-chain with 100% transparency from [multiple, cross-chain NFT marketplaces](https://diadata.org/app/source/nft).

## Supported NFT API endpoints

DIA also supports API endpoints to return cryptocurrency price data. Developers can directly access the example endpoints listed below or [visit the DIA Documentation](https://docs.diadata.org/products/nft-floor-price-feeds/access-api-endpoints) to see all API endpoints.

# 🎲 Random Number Generation
DIA xRandom provides smart contracts with unpredictable and unbiased random numbers, facilitating the development of on-chain use cases such as lotteries, prediction markets, NFT launches and more.
## Understanding Randomness
DIA leverages the Drand public randomness beacon, and updates its oracle with round numbers, randomness and a signature. Drand runs distributed nodes to produce their randomness beacon. Drand uses [Pedersen's DKG (Distributed Key Generation) protocol](https://drand.love/docs/cryptography/#distributed-key-generation-dkg) to create collective private/public keys. Participants in their League of Entropy then generate randomness in rounds and broadcast it together with its signature.
To learn more about Drand’s randomness beacon, watch the [following DIA tutorial](https://youtu.be/7HALDJr8V3g) and read [Drand’s documentation](https://drand.love/docs/overview/#how-drand-works).
## How to use the DIA Randomness Oracle
Anyone can access published random values via round ID.
```
{
	"round": 1597683,
	"randomness": "24138936fcbf7fc3951c928158be6998cee3af622142d0790333608d17a5c5f6",
	"signature": "8c04905c0adf34f1fb007915d9ccc7d07b97305fc63952726f9367c87f36ab687c5e190c151f6ac4d760a9e009fc54230adb8513885449d649a229bc727be9ff347bdbce1c609cebf993b6ae57133fbcf23f96b15dbd3510cb5f2ade6b30b647",
	"previous_signature": "ada42197a2db89866da4c44348f77f7868e41e961ec32e636b912d43c625386afae9e54944ac573047dbd227ee495b52059586c8d8cd0edfe18cc15ca0666a66651da1d62b12af2d0fac19735bed9298690a593571965c3ad7c7b11947e76ec0"
}
```


The DIA randomness smart contract is structured as follows
```pragma solidity ^0.8.0;
contract DIARandomOracle {
struct Random {
string randomness;
string signature;
string previousSignature;
}
mapping (uint256 => Random) public values;
uint256 public lastRound = 0;
address public oracleUpdater;
event OracleUpdate(string key, uint128 value, uint128 timestamp);
event UpdaterAddressChange(address newUpdater);
constructor() {
oracleUpdater = msg.sender;
}
function setRandomValue(uint256 _round, string memory _randomness, string memory _signature, string memory _previousSignature) public {
require(msg.sender == oracleUpdater,"not a updater");
require(lastRound<_round, "old round");
lastRound = _round;
values[_round] = Random(_randomness, _signature, _previousSignature);
}
function getValue(uint256 _round) external view returns (Random memory) {
return values[_round];
}
function updateOracleUpdaterAddress(address newOracleUpdaterAddress) public {
require(msg.sender == oracleUpdater,"not a updater");
oracleUpdater = newOracleUpdaterAddress;
emit UpdaterAddressChange(newOracleUpdaterAddress);
}
function getRandomValueFromRound(uint256 _round) external view returns (string memory) {
return values[_round].randomness;
}
function getRandomValueFromRoundWithSignature(uint256 _round) external view returns (Random memory) {
return values[_round];
}
function getLastRound() public view returns(uint256) {
return lastRound;
}
}
```

Users can call `getLastRound()`to obtain the ID of the latest published round. To obtain the randomness of a certain round, users can call `getRandomValueFromRound(uint256 _round)` using the obtained round ID.

The signature can also be requested by calling `getRandomValueFromRoundWithSignature(uint256 _round)`.

## Video Tutorial: Deploying a randomness-consuming smart contract on an EVM chain
https://youtu.be/BzN-tBgW-xs


> ⚠️ **Note:** DApps can request a dedicated, production-ready oracle for their dApp with custom price feeds and configuration settings. [Learn: requesting an oracle](https://docs.google.com/document/d/1Rbeic7f3e5an-ZT7rJSB_svCBRWTlSISsmnpOo18HQ0/edit#heading=h.ysc3hbr0lfty).


# Learn more about DIA

- [Twitter](https://twitter.com/DIAdata_org)
- [Discord](https://discord.gg/dia-dao)
- [Website](https://diadata.org/)
- [Docs](https://docs.diadata.org/)
- [Explore data](https://www.diadata.org/app/)
