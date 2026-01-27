在您想要将资产移回其储备链的场景中，例如将 xcDOT 从 Moonbeam 发送到 Polkadot，Moonbeam 使用以下 XCM 指令集：

1. [`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} – 在 Moonbeam 上执行，从发送者处获取指定的代币 (xcDOT)

2. [`InitiateReserveWithdraw`](builders/interoperability/xcm/core-concepts/instructions/#initiate-reserve-withdraw){target=\_blank} – 在 Moonbeam 上执行，销毁 Moonbeam 上的代币（移除包装表示），并向 Polkadot 发送 XCM 消息，指示应在此处释放代币

3. [`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} – 在 Polkadot 上执行，从 Moonbeam 在 Polkadot 上的主权帐户中移除代币

4. [`ClearOrigin`](builders/interoperability/xcm/core-concepts/instructions/#clear-origin){target=\_blank} – 在 Polkadot 上执行。清除任何原始数据（例如，Moonbeam 上的主权帐户）

5. [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} – Polkadot 确定执行费用，并使用转移的部分 DOT 来支付这些费用

6. [`DepositAsset`](builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=\_blank} – 最后，原生 DOT 代币被存入指定的 Polkadot 帐户
