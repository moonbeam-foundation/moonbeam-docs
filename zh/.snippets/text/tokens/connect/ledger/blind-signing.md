## 使用您的 Ledger 与合约交互 {: #interact-with-contracts-using-your-ledger }

默认情况下，Ledger 设备不允许在交易对象中使用 `data` 字段。因此，用户无法部署智能合约或与之交互。

但是，如果您想使用您的 Ledger 硬件钱包进行与智能合约相关的交易，您需要在您设备上的应用程序内更改一个配置参数。为此，请按照以下步骤操作：

 1. 在您的 Ledger 上，打开 Moonriver 或 Ethereum 应用程序
 2. 导航至 **Settings**（设置）
 3. 找到 **Blind signing**（盲签名）页面。底部应显示 **NOT Enabled**（未启用）
 4. 选择/验证该选项以将其值更改为 **Enabled**（已启用）

!!! note
    必须使用此选项，才能使用您的 Ledger 设备与可能位于 Moonbeam 生态系统中的 ERC-20 代币合约进行交互。
