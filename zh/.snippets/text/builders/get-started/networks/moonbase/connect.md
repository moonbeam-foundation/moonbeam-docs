## 网络端点 {: #network-endpoints }

Moonbase Alpha 有两种类型的端点可供用户连接：一种用于 HTTPS，另一种用于 WSS。

如果您正在寻找适合生产用途的自己的端点，您可以查看我们文档中的[端点提供商](builders/get-started/endpoints/#endpoint-providers){target=_blank}部分。否则，要快速开始，您可以使用以下公共 HTTPS 或 WSS 端点之一。

--8<-- 'text/builders/get-started/endpoints/moonbase.md'

## 快速入门 {: #quick-start }

对于 [Ethers.js 库](builders/ethereum/libraries/ethersjs/){target=_blank}，通过使用 `ethers.JsonRpcProvider(providerURL, {object})` 并将提供程序 URL 设置为 Moonbase Alpha 来定义提供程序：

```js
const ethers = require('ethers'); // Load Ethers library

const providerURL = 'https://rpc.api.moonbase.moonbeam.network';
// Define provider
const provider = new ethers.JsonRpcProvider(providerURL, {
    chainId: 1287,
    name: 'moonbase-alphanet'
});
```

任何以太坊钱包都应该能够为 Moonbeam 生成有效的地址（例如，[MetaMask](https://metamask.io){target=\_blank}）。

## 链 ID {: #chain-id }

Moonbase Alpha TestNet 链 ID 为：`1287`，十六进制表示为 `0x507`。
