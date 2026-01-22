当 DOT 从 Polkadot 转移到 Moonbeam 时，将按顺序执行以下 XCM 指令：

1. [`TransferReserveAsset`](builders/interoperability/xcm/core-concepts/instructions/#transfer-reserve-asset){target=_blank} - 在 Polkadot 上执行，将 DOT 从发送者处转移并存入 Moonbeam 在 Polkadot 上的主权账户

2. [`ReserveAssetDeposited`](builders/interoperability/xcm/core-concepts/instructions/#reserve-asset-deposited){target=_blank} - 在 Moonbeam 上执行，在 Moonbeam 上铸造 DOT (xcDOT) 的相应 ERC-20 表示

3. [`ClearOrigin`](builders/interoperability/xcm/core-concepts/instructions/#clear-origin){target=_blank} - 在 Moonbeam 上执行，清除任何原始数据（之前设置为 Polkadot 的主权账户）

4. [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} - 在 Moonbeam 上执行，确定执行费用。在此，一部分新铸造的 xcDOT 用于支付 XCM 的成本

5. [`DepositAsset`](builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank} - 在 Moonbeam 上执行，将 xcDOT 交付到 Moonbeam 上预期接收者的账户
