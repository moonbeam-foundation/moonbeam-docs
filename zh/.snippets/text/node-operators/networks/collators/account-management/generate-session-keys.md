为了与 Substrate 标准匹配，Moonbeam 验证人的会话密钥是 [SR25519](https://wiki.polkadot.com/learn/learn-cryptography/#what-is-sr25519-and-where-did-it-come-from){target=_blank}。本指南将向您展示如何创建/轮换与您的验证人节点关联的会话密钥。

首先，请确保您正在[运行验证人节点](/node-operators/networks/run-a-node/overview/){target=_blank}。一旦您的验证人节点运行起来，您的终端应该会打印类似的日志：

--8<-- 'code/node-operators/networks/collators/account-management/log-output.md'

接下来，可以通过向 HTTP 端点发送带有 `author_rotateKeys` 方法的 RPC 调用来创建/轮换会话密钥。当您调用 `author_rotateKeys` 时，结果是两个密钥的大小。响应将包含一个串联的 Nimbus ID 和 VRF 密钥。Nimbus ID 将用于签署区块，而 [VRF](https://wiki.polkadot.com/general/web3-and-polkadot/#vrf){target=_blank} 密钥是区块生产所必需的。串联的密钥将用于创建与您的 H160 帐户的关联，以便支付权益奖励。

作为参考，如果您的验证人的 HTTP 端点位于端口 `9944`，则 JSON-RPC 调用可能如下所示：

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

验证人节点应该响应您的新会话密钥的串联公钥。`0x` 前缀后的前 64 个十六进制字符表示您的 Nimbus ID，后 64 个十六进制字符是您的 VRF 会话密钥的公钥。在下一节中，您将在映射您的 Nimbus ID 和设置会话密钥时使用串联的公钥。

--8<-- 'code/node-operators/networks/collators/account-management/rotate-keys.md'

请务必写下串联的公钥。您的每个服务器（主服务器和备份服务器）都应该有自己唯一的密钥。由于密钥永远不会离开您的服务器，您可以将它们视为该服务器的唯一 ID。

接下来，您需要注册您的会话密钥，并将它们映射到将支付区块奖励的 H160 以太坊风格地址。
