## 网络端点 {: #network-endpoints }

Moonbeam 有两种类型的端点可供用户连接：一种用于 HTTPS，另一种用于 WSS。

如果您正在寻找适合生产使用的自己的端点，您可以查看我们文档的[端点供应商](/builders/get-started/endpoints/#endpoint-providers){target=_blank}部分。否则，要快速开始，您可以使用以下公共 HTTPS 或 WSS 端点之一：

--8<-- 'text/builders/get-started/endpoints/moonbeam.md'

## 快速开始 {: #quick-start }

在开始之前，请确保您已从自定义[端点提供商](/builders/get-started/endpoints/){target=_blank}处检索到您自己的端点和 API 密钥。 对于 [Ethers.js 库](/builders/ethereum/libraries/ethersjs/){target=_blank}，通过使用 `ethers.JsonRpcProvider(providerURL, {object})` 并将 provider URL 设置为 Moonbeam 来定义 provider：

```js
const ethers = require('ethers'); // 加载 Ethers 库

const providerURL = 'INSERT_RPC_API_ENDPOINT'; // 在此处插入您的 RPC URL

// 定义 provider
const provider = new ethers.JsonRpcProvider(providerURL, {
    chainId: 1284,
    name: 'moonbeam'
});
```

任何以太坊钱包都应该能够为 Moonbeam 生成有效的地址（例如，[MetaMask](https://metamask.io){target=_blank}）。

## 链 ID {: #chain-id }

Moonbeam 链 ID 是：`1284`，或十六进制的 `0x504`。
