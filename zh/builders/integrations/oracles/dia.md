---
title: DIA Oracle
description: 了解如何为您的 dApp 请求专用的 DIA 预言机，从而能够访问 2500 多个代币的价格数据、随机数等等。
categories: Oracle Nodes
---

# DIA 预言机介绍

## 简介 {: #introduction }

[DIA](https://www.diadata.org){target=\_blank} 提供可定制的预言机，这些预言机根据每个 dApp 的需求量身定制。每个预言机都可以通过多种方式进行定制，包括数据源、数据清理过滤器、定价和计算方法、更新机制等等。这确保了数据和预言机在市场条件下保持稳健和弹性，并提供全球市场价格以及特定的个人或跨链市场价格。

通过直接从 90 多个来源（包括 CEX、DEX 和 NFT 市场）收集数十亿条原始交易，DIA 能够在整个价值堆栈中实现完全透明、定制和控制。DIA 的数据和预言机套件包含 20,000 多种资产的价格馈送，包括加密货币、NFT 系列和流动性质押代币，以及随机数生成和其他数据馈送类型。

您可以访问 DIA 的文档，了解如何[请求自定义预言机](https://www.diadata.org/docs/how-to-guides/request-a-custom-oracle#request-a-custom-oracle){target=\_blank}。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Token Price Feeds {: #token-price-feeds }
DIA 代币价格信息流为智能合约提供 [3,000 多种加密货币](https://www.diadata.org/app/price){target=\_blank} 的实时价格信息，这些信息透明地来源于 [90 多个受信任的高交易量 DEX 和 CEX](https://www.diadata.org/app/source/defi){target=\_blank}。

### Moonbeam 演示价格预言机 {: #moonbeam-demo-price-oracles }

DIA 为 Moonbeam 社区部署了以下演示预言机，这些预言机提供有限数量的加密货币价格馈送，并具有预定义的配置设置：

|    网络     |                                                                 合约地址                                                                 |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    |      [`0x1f1BAe8D7a2957CeF5ffA0d957cfEDd6828D728f`](https://moonscan.io/address/0x1f1BAe8D7a2957CeF5ffA0d957cfEDd6828D728f){target=\_blank}      |
|   Moonriver    | [`0x11f74b94afb5968119c98ea277a2b73208bb39ab`](https://moonriver.moonscan.io/address/0x11f74b94afb5968119c98ea277a2b73208bb39ab){target=\_blank} |
| Moonbase Alpha | [`0xe23d8713aa3a0a2c102af772d2467064821b8d46`](https://moonbase.moonscan.io/address/0xe23d8713aa3a0a2c102af772d2467064821b8d46){target=\_blank}  |

部署到 Moonbeam 的演示预言机合约是 [DIA 键值预言机合约 V2](https://www.diadata.org/docs/nexus/reference/smart-contracts/diaoraclev2.sol#diaoraclev2-sol){target=\_blank}。 合约结构如下：

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
    DIA 演示预言机不适用于生产环境。 开发人员可以请求具有自定义价格馈送和配置设置的专用、可用于生产的预言机。 要启动请求过程，您可以查看 [请求自定义预言机](https://www.diadata.org/docs/how-to-guides/request-a-custom-oracle#request-a-custom-oracle){target=\_blank} 文档。

#### 包含的价格馈送 {: #price-feeds }

演示 oracle 中包含的价格馈送是：

- [DIA/USD](https://www.diadata.org/app/price/asset/Ethereum/0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419){target=\_blank}
- [BTC/USD](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000){target=\_blank}
- [USDC/USD](https://www.diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48){target=\_blank}

### 如何访问 DIA 预言机 {: #how-to-access-dia-oracles }

访问 DIA 预言机上的价格值的步骤如下：

1. 在 Moonbeam 上访问您的预言机智能合约。
2. 使用 `pair_name` 调用 `getValue(pair_name)`，`pair_name` 是完整的货币对名称，例如 `BTC/USD`。您可以使用 Moonscan 上合约的**合约**选项卡下的**读取合约**功能来执行此调用。

响应包含两个值：

- 当前资产价格（美元），采用具有 8 位小数的定点逗号表示法。
- 上次预言机更新的 UNIX 时间戳。

您可以通过访问 DIA 文档站点上的[获取价格数据](https://www.diadata.org/docs/nexus/how-to-guides/fetch-price-data){target=_blank} 指南，找到 DIA 的 Solidity 和 Vyper 语言的预言机集成示例。

### 支持的 Token API 端点 {: #supported-token-api-endpoints }

DIA 还支持 Rest 和 GraphQL 端点以返回加密货币价格数据。您可以[访问 DIA 文档](https://www.diadata.org/docs/reference/apis/token-prices){target=_blank}以查看所有 API 端点。

例如，您可以使用以下 JavaScript 脚本来访问 [BTC/USD 价格馈送](#price-feeds)：

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

您可以参考 DIA 关于 [Rest API 端点](https://www.diadata.org/docs/reference/apis/token-prices/api-endpoints){target=_blank}和 [GraphQL 端点](https://www.diadata.org/docs/reference/apis/token-prices/graphql){target=_blank}的文档，以获取有关参数和返回数据的信息。

## NFT底价信息流 {: #nft-floor-price-feeds }

DIA NFT底价信息流为智能合约提供[18,000+ NFT藏品](https://www.diadata.org/nft-api-oracle/){target=_blank}的实时价格信息，这些信息100%透明地来源于链上，数据出自[多个跨链NFT市场](https://www.diadata.org/app/source/nft){target=_blank}。

请参考DIA的文档，了解如何为Moonbeam上的NFT[请求自定义NFT预言机](https://www.diadata.org/docs/request-a-custom-oracle#forum-request){target=_blank}。

## 随机数生成 {: #random-number-generation }

[DIA xRandom](https://www.diadata.org/docs/nexus/data-products/randomness#randomness){target=\_blank} 为智能合约提供不可预测且无偏的随机数，从而促进链上用例的开发，例如彩票、预测市场、NFT 发布等。

DIA 利用 Drand 公共随机信标，并使用 round 数字、随机性和签名来更新其预言机。Drand 运行分布式节点以生成其随机信标。Drand 使用 [Pedersen 的 DKG（分布式密钥生成）协议](https://docs.drand.love/docs/cryptography/#distributed-key-generation-dkg){target=\_blank} 来创建集体私钥和公钥。然后，他们的熵联盟的参与者会分轮生成随机数，并将其及其签名一起广播。

要了解有关 Drand 随机信标的更多信息，请观看 [链上随机预言机 | DIA 开发者教程](https://youtu.be/7HALDJr8V3g){target=\_blank} 并阅读 [Drand 的文档](https://docs.drand.love/#how-drand-works){target=\_blank}。

### Moonbeam Demo Randomness Oracle {: #moonbeam-demo-randomness-oracle }

```text
0x48d351ab7f8646239bbade95c3cc6de3ef4a6cec
```
DIA 随机性智能合约的结构如下：

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
    DIA 演示预言机并不适用于生产环境。开发者可以申请专用的、可用于生产环境的随机性预言机。如需开始申请流程，你可以通过 Telegram 联系 [集成团队](https://t.me/DIABDteam){target=\_blank}。


### 如何使用 DIA 随机数预言机 {: #how-to-use-the-dia-randomness-oracle }

访问已发布的随机值的步骤如下：

1. 在 Moonbeam 上访问您的随机数预言机智能合约。
2. 调用 `getLastRound()` 以获取最新发布轮次的 ID。您可以使用 Moonscan 上合约**合约**选项卡下的**读取合约**功能来执行此调用。
3. 使用获得的轮次 ID 调用 `getRandomValueFromRound(uint256 _round)`。同样，您可以使用 Moonscan 快速执行此调用。

响应包含随机数值。

也可以通过调用 `getRandomValueFromRoundWithSignature(uint256 _round)` 来请求签名，这将返回一个包含随机数值、签名和上一轮签名的元组。

要了解如何在 Moonbeam 上部署使用随机数的合约，请参阅[在 EVM 链上使用 DIA xRandom Oracle 部署使用随机数的智能合约](https://youtu.be/BzN-tBgW-xs){target=\_blank}视频教程。

## 资源 {: #resources }

- [X](https://x.com/DIAdata_org){target=\_blank}
- [Discord](https://discord.com/invite/ZvGjVY5uvs){target=\_blank}
- [网站](https://www.diadata.org/){target=\_blank}
- [文档](https://www.diadata.org/docs/home){target=\_blank}
- [探索数据](https://www.diadata.org/app){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
