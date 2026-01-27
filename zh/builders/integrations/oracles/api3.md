---
title: 使用 API3 请求链下数据
description: 了解如何使用 API3，通过 Moonbeam 网络上的 API3 Airnode 和 dAPI（数据提要）在智能合约中请求和接收链下数据。
categories: Oracle Nodes
---

# 使用 API3 在 Moonbeam 上请求链下数据

## 简介 {: #introduction }

API3 是一个去中心化解决方案，旨在以易于访问和可扩展的方式向智能合约平台提供传统的 API 服务。它由去中心化自治组织 (DAO) API3 DAO 管理。API3 使开发人员能够从他们的智能合约中访问链下资源，而无需担心安全问题。API3 通过 Airnode（第一方预言机）和来自这些预言机的链上数据流来实现这一点。

开发人员可以使用 [Airnode](https://airnode-docs.api3.org/reference/airnode/latest/understand/){target=\_blank} 在 Moonbeam 网络上的智能合约中请求链下数据。Airnode 是一种第一方预言机，可将链下 API 数据推送到您的链上合约。Airnode 让 API 提供商可以轻松运行自己的第一方预言机节点。这样，他们可以向任何对其服务感兴趣的链上 dApp 提供数据，而无需中介。

链上智能合约请求 [RRP（请求响应协议）](https://airnode-docs.api3.org/reference/airnode/latest/developers/){target=\_blank} 合约（[`AirnodeRrpV0.sol`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=\_blank}），该合约将请求添加到事件日志中。然后，Airnode 访问事件日志，获取 API 数据，并使用所请求的数据对请求者执行回调。

![详细说明 Airnode 流程的图表。](/images/builders/integrations/oracles/api3/api3-1.webp)

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 从 Airnode 请求链下数据 {: #calling-an-airnode }

请求链下数据本质上包括触发 Airnode 并通过您的智能合约获取其响应。 在这种情况下，智能合约将是请求者合约，它将向所需的链下 Airnode 发出请求，然后捕获其响应。

请求者调用 Airnode 主要侧重于两个任务：

- 发出请求
- 接受和解码响应

![详细说明从 Airnode 请求链下数据的流程的图表。](/images/builders/integrations/oracles/api3/api3-2.webp)

以下是从 Airnode 请求数据的基本请求者合约的示例：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";

// A Requester that will return the requested data by calling the specified Airnode.
contract Requester is RrpRequesterV0, Ownable {
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => int256) public fulfilledData;

    // Make sure you specify the right _rrpAddress for your chain while deploying the contract.
    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    // To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(owner()).transfer(address(this).balance);
    }

    // The main makeRequest function that will trigger the Airnode request.
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters

    ) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,                        // airnode address
            endpointId,                     // endpointId
            sponsor,                        // sponsor's address
            sponsorWallet,                  // sponsorWallet
            address(this),                  // fulfillAddress
            this.fulfill.selector,          // fulfillFunctionId
            parameters                      // encoded API parameters
        );
        incomingFulfillments[requestId] = true;
    }
    
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        int256 decodedData = abi.decode(data, (int256));
        fulfilledData[requestId] = decodedData;
    }

    // To withdraw funds from the sponsor wallet to the contract.
    function withdraw(address airnode, address sponsorWallet) external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}
```

您还可以尝试[在 Remix 上部署示例合约](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/RequesterWithWithdrawal.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=\_blank}。

### 合约地址 {: #contract-addresses }

`_rrpAddress` 是主要的 `airnodeRrpAddress`。RRP 合约已部署在链上。[`_rrpAddress` 的地址](https://airnode-docs.api3.org/reference/airnode/latest/){target=\_blank} 在 Moonbeam 网络上如下所示：

=== "Moonbeam"

    `{{ networks.moonbeam.api3.rrp }}`

|   合约   |             地址              |
|:------------:|:----------------------------------:|
| AirnodeRrpV0 | `{{ networks.moonbeam.api3.rrp }}` |
 
=== "Moonriver"

|   合约   |              地址              |
|:------------:|:-----------------------------------:|
| AirnodeRrpV0 | `{{ networks.moonriver.api3.rrp }}` |

=== "Moonbase Alpha"

|   合约   |             地址              |
|:------------:|:----------------------------------:|
| AirnodeRrpV0 | `{{ networks.moonbase.api3.rrp }}` |

### 请求参数 {: #request-params }

`makeRequest()` 函数需要以下参数才能发出有效的请求：

- [**`airnode`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/airnode.html){target=\_blank} - 指定 Airnode 地址
- [**`endpointId`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/endpoint.html){target=\_blank} - 指定要使用的端点
- [**`sponsor`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/sponsor.html){target=\_blank} 和 [**`sponsorWallet`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/sponsor.html#sponsorwallet){target=\_blank} - 指定将用于完成请求的钱包
- [**`parameters`**](https://airnode-docs.api3.org/reference/airnode/latest/specifications/reserved-parameters.html){target=\_blank} - 指定 API 和预留参数（有关这些参数的编码方式，请参阅 [Airnode ABI 规范](https://airnode-docs.api3.org/reference/airnode/latest/specifications/airnode-abi.html){target=\_blank}）。可以使用 `@airnode-abi` 库在链下对参数进行编码

### 响应参数 {: #response-params }

对请求者合约的回调包含两个参数：

- [**`requestId`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/request.html#requestid){target=\_blank} - 首次在发出请求时获得，并在此处传递，作为标识预期响应的请求的引用
- **`data`** - 如果响应成功，这是请求的数据编码，除了其他响应数据外，还包含时间戳。 使用 `abi` 对象中的 `decode()` 函数对其进行解码

!!! note
    赞助商不应对 `sponsorWallet` 注入超出他们对 Airnode 的信任范围的资金，因为 Airnode 控制着 `sponsorWallet` 的私钥。 此类 Airnode 的部署者不承担任何保管义务，发送到 `sponsorWallet` 的任何超额资金的损失或滥用风险由赞助商承担。

## dAPIs：API3 数据馈送 {: #dapis }

[dAPIs](https://docs.api3.org/oev-searchers/in-depth/data-feeds/){target=\_blank} 是链下数据的持续更新流，例如最新的加密货币、股票和大宗商品价格。它们可以为去中心化应用程序提供支持，例如 DeFi 借贷、合成资产、稳定币、衍生品、NFT 等。

数据馈送由[第一方预言机](https://docs.api3.org/oev-searchers/glossary.html#first-party-oracles){target=\_blank}使用签名数据持续更新。DApp 所有者可以实时读取任何 dAPI 的链上值。

由于它们由第一方数据馈送组成，因此 dAPI 以统包方式提供安全性、透明度、成本效益和可扩展性。

![API3 市场仪表板。](/images/builders/integrations/oracles/api3/api3-3.webp)

要了解有关 dAPI 工作原理的更多信息，请参阅 [API3 的文档](https://docs.api3.org/oev-searchers/in-depth/data-feeds/){target=\_blank}。

### 订阅 dAPI {: #subscribing-to-dapis }

通过 [API3 市场](https://market.api3.org/){target=\_blank}，用户可以在 [Moonbeam](https://market.api3.org/moonbeam){target=\_blank}、[Moonriver](https://market.api3.org/moonriver){target=\_blank} 和 [Moonbase Alpha TestNet](https://market.api3.org/moonbeam-testnet){target=\_blank}（目前标记为 Moonbeam TestNet）上访问 dAPI。
从 [API3 市场主页](https://market.api3.org/){target=\_blank} 上，您可以搜索给定的链。选择链后，您可以查看可用 dAPI的列表，然后点击一个以获取更多信息。例如，您可以点击适用于 Moonbeam 的 `USDT/USD` 交易对，以查看 dAPI 的参数，包括偏差和心跳。

dAPI 支持的参数包括：

| 偏差  | 心跳    |
|-------|---------|
| 0.25% | 24 小时 |
| 0.5%  | 24 小时 |
| 1%    | 24 小时 |
| 5%    | 24 小时 |

![USDT/USD dAPI 详情页。](/images/builders/integrations/oracles/api3/api3-4.webp)

### 配置和激活 dAPI {: #select-a-dapi }

选择要交互的 dAPI 后，请检查到期日期并根据需要更新参数。您可以通过购买新的配置来更新参数并延长订阅。如果 dAPI 已激活并且列出的配置适用于您，则可以跳到下一节，了解如何[与 dAPI 交互](#get-data)。

要购买具有新配置的套餐，请单击**购买新套餐**并执行以下步骤：

1. 选择您的参数
2. 单击**连接钱包**

![激活数据馈送页面。](/images/builders/integrations/oracles/api3/api3-5.webp)

连接后，您就可以购买新的套餐了。单击**购买**并签署交易。交易确认后，您将能够看到 dAPI 的更新配置。

### 从 dAPI 获取数据 {: #get-data}

要与 dAPI 交互，您需要获取它的代理地址。点击 dAPI 详细信息页面上的 **Integrate** 按钮。然后在集成页面上，复制代理地址。

![集成数据馈送页面。](/images/builders/integrations/oracles/api3/api3-6.webp)

有了代理地址，您就可以将 dAPI 集成到智能合约中。这是一个从 dAPI 读取数据的基本合约示例：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";
import "@api3/contracts/api3-server-v1/proxies/interfaces/IProxy.sol";

contract DataFeedReaderExample is Ownable {
    // The proxy contract address obtained from the API3 Market UI
    address public proxyAddress;

    // Updating the proxy contract address is a security-critical
    // action. In this example, only the owner is allowed to do so
    function setProxyAddress(address _proxyAddress) public onlyOwner {
        proxyAddress = _proxyAddress;
    }

    function readDataFeed()
        external
        view
        returns (int224 value, uint256 timestamp)
    {
        // Use the IProxy interface to read a dAPI via its
        // proxy contract
        (value, timestamp) = IProxy(proxyAddress).read();
        // If you have any assumptions about `value` and `timestamp`,
        // make sure to validate them after reading from the proxy
    }
}
```

示例合约包含两个函数：

- `setProxyAddress()` - 用于设置 dAPI 代理合约的地址
- `readDataFeed()` - 一个 `view` 函数，它返回设置的 dAPI 的最新价格

[尝试在 Remix 上部署它](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/DapiReader.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js){target=\_blank}！

## 更多资源 {: #additional-resources }

以下是一些额外的开发者资源：

- [API3 市场](https://market.api3.org/moonbeam){target=\_blank}
- [API3 文档](https://docs.api3.org){target=\_blank}
- [API3 DAO GitHub](https://github.com/api3dao){target=\_blank}
- [API3 Medium](https://medium.com/api3){target=\_blank}
- [API3 YouTube](https://www.youtube.com/API3DAO){target=\_blank}

--8<-- 'zh/text/_disclaimers/third-party-content.md'
