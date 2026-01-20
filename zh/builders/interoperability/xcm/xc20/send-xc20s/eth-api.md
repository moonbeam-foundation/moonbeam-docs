---
title: XCM 预编译
description: 了解 XCM 预编译，以及如何使用它将资产从 Moonbeam 网络转移到其他平行链。
categories: XCM, Precompiles
---

# XCM 预编译

## 简介 {: #introduction }

作为 Polkadot 的平行链，Moonbeam 具有与其他连接的平行链通信和交换数据的固有能力。这种原生的跨链通信允许安全快速的代币转移，利用跨共识消息格式（简称 XCM），促进不同共识系统之间的通信。

实现代币转移的通信协议构建在 [Substrate](/builders/substrate/){target=_blank} 之上，并且运行级别低于 EVM，这使得 EVM 开发者更难访问。

尽管如此，Moonbeam 网络具有一个 XCM 预编译合约，可以填补执行层之间的空白。这个预编译合约公开了一个智能合约接口，该接口抽象了底层复杂性，使得跨链代币转移的执行变得像任何其他智能合约调用一样简单。

本指南将向您展示如何与 [XCM 接口](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=_blank} 预编译合约交互，以通过 Ethereum API 执行跨链代币转移。

XCM 预编译合约位于以下地址：

===

     ```
     {{networks.moonbeam.precompiles.xcm_interface }}
     ```

===

     ```
     {{networks.moonriver.precompiles.xcm_interface }}
     ```

===

     ```
     {{networks.moonbase.precompiles.xcm_interface }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## XCM Solidity 接口 {: #the-xcm-solidity-interface }

[`XCMInterface.sol`](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=_blank} 是一个 Solidity 接口，允许开发者与 `pallet-xcm` 的方法进行交互。

??? code "XCMInterface.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/eth-api/XcmInterface.sol'
    ```

该接口包含必要的数据结构以及以下函数：

???+ function "**transferAssetsToPara20**(_paraId, beneficiary, assets, feeAssetItem_) — 使用 XCM 将资产发送到类似 20 字节的平行链，使用 XCM pallet 模块中包含的底层 `transfer_assets()` 交易"
   
    === "Parameters"
        - `paraId` *uint32* - 目标链的 para-id
        - `beneficiary` *address* - 目标链中将接收代币的 ECDSA 类型账户
        - `assets` *AssetAddressInfo[] memory* - 要以地址格式发送的资产数组
        - `feeAssetItem` *uint32* - 将用于支付费用的资产的索引

    === "Example"
        - `paraId` - 888
        - `beneficiary` - 0x3f0Aef9Bd799F1291b80376aD57530D353ab0217
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsToPara32**(_paraId, beneficiary, assets, feeAssetItem_) — 使用 XCM 将资产发送到类似 32 字节的平行链，使用 XCM pallet 模块中包含的底层 `transfer_assets()` 交易"

    === "Parameters"
        - `paraId` *uint32* - 目标链的 para-id
        - `beneficiary` *bytes32* - 将在 paraId 目标链上接收代币的实际账户
        - `assets` *AssetAddressInfo[] memory* - 要以地址格式发送的资产数组
        - `feeAssetItem` *uint32* - 将用于支付费用的资产的索引

    === "Example"
        - `paraId` - 888
        - `beneficiary` - 0xf831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a06
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsToRelay**(_beneficiary, assets, feeAssetItem_) — 使用 XCM 将资产发送到中继链，使用 XCM pallet 模块中包含的底层 `transfer_assets()` 交易"

    === "Parameters"
        - `beneficiary` *bytes32* - 将在中继链上接收代币的实际账户
        - `assets` *AssetAddressInfo[] memory* - 要以地址格式发送的资产数组
        - `feeAssetItem` *uint32* - 将用于支付费用的资产的索引

    === "Example"
        - `beneficiary` - 0xf831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a06
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsLocation**(_dest, beneficiary, assets, feeAssetItem_) — 使用 XCM 发送资产，使用 XCM pallet 模块中包含的底层 `transfer_assets()` 交易"

    === "Parameters"
        - `dest` *Location memory* - 目标链
        - `beneficiary` *Location memory* - 目标链中将接收代币的账户
        - `assets` *AssetLocationInfo[] memory* - 要发送的资产数组
        - `feeAssetItem` *uint32* - 将用于支付费用的资产的索引

    === "Example"
        - `dest` - ["1",[]]
        - `beneficiary` - [0, ["0x01f831d83025f527daeed39a644d64d335a4e627b5f4becc78fb67f05976889a0600"]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000800"]], 1000000000000000000]]
        - `feeAssetItem` - 0

??? function "**transferAssetsUsingTypeAndThenLocation**(_dest, assets, assetsTransferType, remoteFeesIdIndex, feesTransferType, customXcmOnDest_) — 通过 `transfer_assets_using_type_and_then()` pallet-xcm extrinsic 发送资产。重要提示：禁止 RemoteReserve 类型（对于资产或费用）。要发送具有远程储备的资产和费用（以 Location 格式），请使用后续的 `transferAssetsUsingTypeAndThenLocation`，它与此函数名称相同，但采用不同的参数集"

    === "Parameters"
        - `dest` *Location memory* - 目标链
        - `assets` *AssetLocationInfo[] memory* - 要以 Location 格式发送的资产数组
        - `assetsTransferType` *TransferType* - 与发送的资产对应的 TransferType (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `remoteFeesIdIndex` *uint8* - 要用作费用的资产的索引（在 assets 数组中）
        - `feesTransferType` *TransferType* - 与用作费用的资产对应的 TransferType (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `customXcmOnDest` *bytes memory* - 要在目标链上执行的 XCM 消息

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000802"]], 1000000000000000000]]
        - `assetsTransferType` - 0  
        - `remoteFeesIdIndex` - 0
        - `feesTransferType` - 1    
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45  

??? function "**transferAssetsUsingTypeAndThenLocation**(_dest, assets, remoteFeesIdIndex, customXcmOnDest, remoteReserve_) — 通过 `transfer_assets_using_type_and_then()` pallet-xcm extrinsic 发送资产。重要提示：远程储备必须在资产和费用之间共享"

    === "Parameters"
        - `dest` *Location memory* - 目标链
        - `assets` *AssetLocationInfo[] memory* - 要以 Location 格式发送的资产数组
        - `remoteFeesIdIndex` *uint8* - 要用作费用的资产的索引（在 assets 数组中）
        - `customXcmOnDest` *bytes memory* - 要在目标链上执行的 XCM 消息
        - `remoteReserve` *Location memory* - 资产和费用对应的远程储备（必须共享）

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [[[1, ["0x010000000000000000000000000000000000000800"]], 1000000000000000000]]
        - `remoteFeesIdIndex` - 0
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45  
        - `remoteReserve` - [1,[]]  

??? function "**transferAssetsUsingTypeAndThenAddress**(_dest, assets, assetsTransferType, remoteFeesIdIndex, feesTransferType, customXcmOnDest_) — 通过 `transfer_assets_using_type_and_then()` pallet-xcm extrinsic 发送资产。重要提示：不允许 RemoteReserve 类型（对于资产或费用）。要发送具有远程储备的资产和费用（以 Address 格式），请使用后续的 `transferAssetsUsingTypeAndThenAddress`，它与此函数名称相同，但采用不同的参数集"

    === "Parameters"
        - `dest` *Location memory* - 目标链
        - `assets` *AssetAddressInfo[] memory* - 要以地址格式发送的资产数组
        - `assetsTransferType` *TransferType* - 与发送的资产对应的 TransferType (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `remoteFeesIdIndex` *uint8* - 要用作费用的资产的索引（在 assets 数组中）
        - `feesTransferType` *TransferType* - 与用作费用的资产对应的 TransferType (Teleport = 0, LocalReserve = 1, DestinationReserve = 2)
        - `customXcmOnDest` *bytes memory* - 要在目标链上执行的 XCM 消息

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `assetsTransferType` - 0  
        - `remoteFeesIdIndex` - 0
        - `feesTransferType` - 1   
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45 

??? function "**transferAssetsUsingTypeAndThenAddress**(_dest, assets, remoteFeesIdIndex, customXcmOnDest, remoteReserve_) — 通过 `transfer_assets_using_type_and_then()` pallet-xcm extrinsic 发送资产。重要提示：远程储备必须在资产和费用之间共享"

    === "Parameters"
        - `dest` *Location memory* - 目标链
        - `assets` *AssetAddressInfo[] memory* - 要以地址格式发送的资产数组
        - `remoteFeesIdIndex` *uint8* - 要用作费用的资产的索引（在 assets 数组中）
        - `customXcmOnDest` *bytes memory* - 要在目标链上执行的 XCM 消息
        - `remoteReserve` *Location memory* - 资产和费用对应的远程储备（必须共享）

    === "Example"
        - `dest` - ["1",[]]
        - `assets` - [["0x0000000000000000000000000000000000000802", 1000000000000000000]]
        - `remoteFeesIdIndex` - 0
        - `customXcmOnDest` - 0x0408000400010403001300008a5d784563010d01020400010300f8234bedd9553e7668c4e0d60aced12e22bd2d45
        - `remoteReserve` - [1,[]]

## 与 Solidity 接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您必须配置好您首选的 EVM 钱包，并且账户中有原生代币。您可以按照本指南将 Moonbeam 添加到 MetaMask 钱包：[使用 MetaMask 与 Moonbeam 交互](/tokens/connect/metamask/){target=_blank}。

### Remix 设置 {: #remix-set-up }

您可以使用 [Remix](https://remix.ethereum.org){target=_blank} 与 XCM 预编译合约进行交互。要将预编译合约添加到 Remix，您需要：

1. 获取 [`XCMInterface.sol`](https://github.com/Moonsong-Labs/moonkit/blob/main/precompiles/pallet-xcm/XcmInterface.sol){target=_blank} 的副本
2. 将文件内容粘贴到名为 `XCMInterface.sol` 的 Remix 文件中

### 编译合约 {: #compile-the-contract }

接下来，您需要在 Remix 中编译接口：

1. 点击顶部的第二个 **Compile** 选项卡
2. 通过点击 **Compile XcmInterface.sol** 编译接口

![编译 XCMInterface.sol](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-1.webp)

编译完成后，您将在 **Compile** 选项卡旁边看到一个绿色复选标记。

### 访问合约 {: #access-the-contract }

您将访问预编译合约的接口，而不是部署预编译合约，前提是您拥有预编译合约的地址：

1. 单击 Remix 中**Compile（编译）**选项卡正下方的 **Deploy and Run（部署和运行）**选项卡。请注意，预编译合约已在其各自的地址上可用。因此，没有部署步骤
2. 确保在 **ENVIRONMENT（环境）**下拉列表中选择了 **Injected Provider - Metamask（注入提供程序 - Metamask）**。选择 **Injected Provider - Metamask（注入提供程序 - Metamask）**后，如果您的帐户尚未连接到 Remix，MetaMask 可能会提示您将帐户连接到 Remix
3. 确保在 **ACCOUNT（帐户）**下显示正确的帐户
4. 确保在 **CONTRACT（合约）**下拉列表中选择了 **XCM - XcmInterface.sol**。鉴于它是一个预编译合约，因此没有部署步骤。相反，您需要在 **At Address（在地址）**字段中提供预编译合约的地址
5. 提供预编译合约的地址：`{{networks.moonbeam.precompiles.xcm_interface}}`，然后单击 **At Address（在地址）**

![访问地址](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-2.webp)

**XCM 接口**预编译将出现在 **Deployed Contracts（已部署合约）**列表中。

### 将代币发送到另一个EVM兼容的Appchain {: #transfer-to-evm-chains }

要将代币发送到另一个EVM兼容的Appchain中的帐户，请按照以下步骤操作：

1. 展开 **transferAssetsToPara20** 函数
2. 输入appchain ID (paraId)
3. 输入20字节的（类似以太坊的）目标帐户（受益人）
4. 指定要转移的代币。请注意，此参数是一个数组，其中包含至少一项资产。每项资产由其地址和要转移的总金额指定
5. 输入将用于支付费用的资产的索引。此索引从零开始，因此第一个元素是 `0`，第二个是 `1`，依此类推
6. 点击 **transact**
7. MetaMask将会弹出，并且您将被提示查看交易详情。点击 **Confirm** 以发送交易

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-3.webp)

交易确认后，等待几个区块，让转移到达目标链并反映新的余额。

### 将代币发送到 Substrate 应用链 {: #transfer-to-substrate-chains }

要将代币发送到 Substrate 应用链中的帐户，请按照以下步骤操作：

1. 展开 **transferAssetsToPara32** 函数
2. 输入应用链 ID (`paraId`)
3. 输入 sr25519 类型的目标帐户（受益人）
4. 指定要转移的代币。请注意，此参数是一个数组，其中包含至少一个资产。每个资产都由其地址和要转移的总金额指定

   --8<-- 'text/builders/ethereum/precompiles/security.md'

5. 输入将用于支付费用的资产的索引。此索引从零开始，因此第一个元素是 `0`，第二个元素是 `1`，依此类推
6. 点击 **transact**
7. MetaMask 将弹出，并提示您查看交易详情。点击 **Confirm** 发送交易

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-4.webp)

交易确认后，请等待几个区块，以便转移到达目标链并反映新的余额。

### 将代币发送到中继链 {: #transfer-to-relay-chain }

要将代币发送到中继链中的帐户，请按照以下步骤操作：

1. 展开 **transferAssetsToRelay** 函数
2. 输入 sr25519 类型的目标帐户（受益人）
3. 指定要转移的代币。请注意，此参数是一个数组，其中包含至少一项资产。每项资产都由其地址和要转移的总金额指定

   --8<-- 'text/builders/ethereum/precompiles/security.md'

4. 输入将用于支付费用的资产的索引。此索引从零开始，因此第一个元素是 `0`，第二个元素是 `1`，依此类推
5. 点击 **transact**
6. MetaMask 将会弹出，并且系统会提示您查看交易详情。点击 **Confirm** 以发送交易

![Confirm Approve Transaction](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-5.webp)

交易确认后，请等待几个区块，以便转移到达目标链并反映新的余额。

### 在特定位置发送代币 {: #transfer-locations }

有两种方法与密切相关的方法共享名称，即 `transferAssetsUsingTypeAndThenLocation` 和 `transferAssetsUsingTypeAndThenAddress`。但是，这些不是重复项。对于每个函数，一个接受五个参数，另一个接受六个参数。只有当远程储备在资产和费用之间共享时，才能使用具有五个参数的函数。如果远程储备不在资产和费用之间共享，则可以使用该方法的六个参数版本来指定所需的信息。

以下示例将演示当远程储备在资产和费用之间共享时如何使用 `transferAssetsUsingTypeAndThenAddress`。要按照本教程进行操作，请执行以下步骤：

1. 展开 **transferAssetsUsingTypeAndThenAddress** 函数
2. 输入指定目标链的多位置。请注意，可以指定任何链，无论其配置或类型如何
3. 输入要以地址格式发送的资产组合数组
4. 输入将用于支付费用的资产的索引。此索引从零开始，因此第一个元素是 `0`，第二个元素是 `1`，依此类推
5. 输入要在目标链上执行的 XCM 消息。有关创建 XCM 调用数据的更多信息，请参见[发送和执行 XCM 消息](/builders/interoperability/xcm/send-execute-xcm/)
6. 输入远程储备，例如 `[1,[]]`
7. 单击 **transact**
8. MetaMask 将弹出，系统将提示您查看交易详细信息。单击**确认**以发送交易

![确认批准交易](/images/builders/interoperability/xcm/xc20/send-xc20s/eth-api/eth-api-6.webp)

确认交易后，请等待几个区块，以使转移到达目标链并反映新的余额。
