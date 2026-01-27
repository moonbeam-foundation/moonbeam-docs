要使用该脚本，您需要提供以下必需的参数：

- `--parachain-ws-provider` 或 `--w` - 指定将发出请求的平行链 WebSocket 提供者
- `--relay-ws-provider` 或 `--wr` - 指定将发出请求的中继链 WebSocket 提供者
- `--hrmp-action` 或 `--hrmp` - 接受要执行的以下操作，可以是以下任何一种：`accept`、`cancel`、`close` 和 `open`
- `--target-para-id` 或 `-p` - 请求的目标平行链 ID
