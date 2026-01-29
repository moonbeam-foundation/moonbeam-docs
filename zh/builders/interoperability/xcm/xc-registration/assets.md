---
title: 注册 XC 资产
description: 本指南包含注册本地和外部 XC-20 的所有必要信息，以便您可以通过 XCM 开始跨链转移资产。
categories: XC-20
---

# 如何通过治理注册跨链资产

## 简介 {: #introduction }

要通过 XCM 在链之间转移资产，需要在两条链之间建立开放通道，并且需要在目标链上注册该资产。如果两条链之间不存在通道，则需要打开一个通道。请查看 [XC 通道注册](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} 指南，了解如何在 Moonbeam 和另一条链之间建立通道。

本指南将向您展示如何在 Moonbeam 上注册 [外部 XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}，并提供您需要在另一个链上注册 Moonbeam 资产的信息，包括 Moonbeam 原生资产（GLMR、MOVR 和 DEV）和[本地 XC-20](/Builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}（支持 XCM 的 ERC-20）。

本指南中的示例使用了一个 CLI 工具，该工具旨在简化整个过程，您可以在 [xcm-tools GitHub 存储库](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 中找到它。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## 在 Moonbeam 上注册外部 XC-20 {: #register-xc-20s }

在 Moonbeam 上注册外部 XC-20 是一个多步骤的过程，从高层次上讲，涉及到在 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank} 上提出资产注册，并创建一个链上治理提案。

如果 Moonbeam 和资产的原始链之间尚不存在通道，则需要打开一个通道。您可以将通道相关的调用与资产注册调用进行批处理，这样您只需要提交一个提案即可。您必须首先创建几个论坛帖子：一个 [XCM 披露](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-disclosures){target=\_blank} 帖子和一个 [XCM 提案](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-proposals){target=\_blank} 帖子。

在您收集到社区成员的反馈后，您可以创建一个提案来开通一个通道并注册任何资产。有关开通通道的更多信息，请参阅 [与 Moonbeam 建立 XC 集成](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} 指南。

![如果 XC 通道不存在，则进行资产注册](/images/builders/interoperability/xcm/xc-registration/assets/assets-1.webp)

如果链之间的通道已经存在，您需要创建一个论坛帖子来注册资产，收集反馈，然后提交提案来注册资产。

![如果 XC 通道存在，则进行资产注册](/images/builders/interoperability/xcm/xc-registration/assets/assets-2.webp)

### 创建论坛帖子 {: #create-a-forum-post }

要在 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank} 上创建论坛帖子，您需要确保将帖子添加到正确的类别并添加相关内容。有关一般指南和要遵循的模板，请参阅[Moonbeam 社区论坛 XCM 集成模板](/builders/interoperability/xcm/xc-registration/forum-templates/#){target=\_blank} 页面。

### 计算相对价格 {: #calculate-relative-price }

资产的 `relativePrice` 指的是一个 `u128` 值，它表示该资产有多少个单位（以其最小面额表示）相当于一个单位（即 `1 × 10^18 Wei`）的本地代币（GLMR 或 MOVR）。这有助于确定在最初以本地代币报价的费用中使用多少您的资产，尤其是在跨链消息传递（XCM）中。

您可以使用以下脚本（也可作为 [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 的一部分）来计算资产的正确 `relativePrice` 值。

??? code "计算相对价格"
    ```typescript
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/calculate-relative-price.ts'
    ```

计算资产的相对价格只需要三个参数：

- **资产价格（美元）** - 一个正数，表示您的资产的 1 个单位（以人类可读的形式）以美元计算的成本
- **资产小数位数** - 您的资产使用的小数位数。例如，如果您的代币有 12 个小数位，请指定 12
- **网络** - GLMR（Moonbeam）或 MOVR（Moonriver）。这应对应于您在其上注册资产的网络，并且这决定了脚本将从 CoinGecko 获取哪个本地代币的美元价格

首先，通过运行以下命令确保您已安装所需的依赖项：

```bash
yarn
```

执行脚本，确保提供您要注册的资产的美元价格、它的小数位数以及您在其上注册资产的网络（GLMR 或 MOVR）：

```bash
yarn calculate-relative-price INSERT_ASSET_PRICE INSERT_DECIMALS GLMR
```

例如，如果您要注册的资产的美元价格为 0.25 美元，并且有 12 个小数位，并且您要在 Moonbeam 网络上注册该资产，您将运行：

```bash
yarn calculate-relative-price 0.25 12 GLMR
```

这指示脚本计算有多少最小单位的资产（价格为 0.25 美元，有 12 个小数位）对应于 1 个 GLMR 代币。

--8<-- 'zh/code/builders/interoperability/xcm/xc-registration/assets/terminal/calculate-relative-price.md'

成功执行后，脚本会将计算出的 `relativePrice` 打印为 `BigInt`。此值表示资产的美元价格与本地代币的美元价格之间的缩放比率，最高乘以 18 个小数位。然后，您可以在链上资产注册或费用计算场景中使用此结果，尤其是在需要 `u128` 18 位小数格式的情况下。

有关更多信息、使用详情或查看实际示例，您可以通过运行以下命令来调用帮助命令：

```bash
yarn calculate-relative-price --help
```

### 生成用于资产注册的编码 calldata {: #generate-encoded-calldata-for-asset-registration }

在 Moonbeam 上提交治理提案需要两步：首先提交一个预映像（preimage）来定义要执行的操作，然后基于该预映像提交提案。更多信息请参阅 [Moonbeam 治理](/learn/features/governance/){target=\_blank} 页面。要为资产注册提交预映像，您需要同时准备 `evmForeignAssets.createForeignAsset` 与 `xcmWeightTrader.addAsset` 这两个 extrinsic 的编码 calldata。现有资产的价格可以通过 `xcmWeightTrader.editAsset` 更新。

提案必须通过 Fast General Admin 轨道提交。在注册资产之前必须先建立通道。要获取 `evmForeignAssets.createForeignAsset` extrinsic 的编码 calldata，您需要提供以下参数：

- **`assetId`** - 资产的唯一标识符，可通过 [`calculate-external-asset-info.ts`](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-external-asset-info.ts){target=\_blank} 脚本生成
- **`xcmLocation`** - 相对于 Moonbeam 的资产 multilocation
- **`decimals`** - 资产的小数位数
- **`symbol`** - 资产的符号。请记得在符号前加上 `xc` 以表明该资产支持 XCM
- **`name`** - 资产名称

基于上述信息，您可以通过 Polkadot API 或在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/extrinsics){target=\_blank} 上为 `createForeignAsset` 生成编码 call data。

您也可以使用 [xcm-asset-registrator 脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank} 来生成所需的 calldata，例如：

```bash
yarn register-asset --w wss://wss.api.moonbeam.network  \
--asset "INSERT_MULTILOCATION" \
--symbol "INSERT_ASSET_SYMBOL" \
--decimals INSERT_DECIMALS \
--name "INSERT_ASSET_NAME" \
--relative-price INSERT_RELATIVE_PRICE
```

使用相关参数运行脚本后，您将看到类似如下的输出：

--8<-- 'zh/code/builders/interoperability/xcm/xc-registration/assets/terminal/register-asset.md'

脚本将为以下调用提供编码后的 call data：

- `registerAsset` 调用
- `setRelativePrice` 调用
- 将以上所有调用组合在一起的 `batch` 调用

![提案流程概览](/images/builders/interoperability/xcm/xc-registration/assets/assets-3.webp)

### 构建添加资产调用

如果您已经使用了上面显示的 [xcm-asset-registrator 脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank}，则可以跳过本节。本节将更详细地介绍如何构建 `xcmWeightTrader.addAsset` 调用。要获取 `xcmWeightTrader.addAsset` 外部函数的编码调用数据，您需要提供以下参数：

- **`xcmLocation`** - 相对于 Moonbeam 的资产多重位置
- **`relativePrice`** - 一个数值 (u128)，表示您的资产价格占原生代币价格的比例，缩放到 18 位小数。此值通过确定需要多少单位的非原生资产来支付 XCM 操作成本来计算跨链费用

使用上述信息，您可以通过 Polkadot API 或 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/extrinsics){target=\_blank} 生成 `addAsset` 调用的编码调用数据。

要创建一个批处理事务，将 `xcmWeightTrader.addAsset` 和 `evmForeignAssets.createForeignAsset` 调用组合在一起，您可以使用 [Polkadot API 的 `batch` 方法](/builders/substrate/libraries/polkadot-js-api/#batching-transactions){target=\_blank}。如前所述，[XCM 资产注册器脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/xcm-asset-registrator.ts){target=\_blank} 可以帮助您构建和提交所需的调用。

### 提交资产注册的预映像和提案 {: #submit-preimage-proposal }

您的下一个任务是为包含 `xcmWeightTrader.addAsset` 与 `evmForeignAssets.createForeignAsset` 的批处理调用提交预映像（preimage）。请参考[提交民主提案指南](/tokens/governance/proposals/#submitting-a-preimage-of-the-proposal){target=\_blank}中的说明进行操作。

对于 Moonbase Alpha，您无需走治理流程，因为 Moonbase Alpha 具有 sudo 权限。相反，您可以将批处理调用数据（batch call data）的输出提供给 Moonbeam 团队，由他们使用 sudo 提交该调用。这比通过治理流程更快、更简单。不过，您也可以选择在 Moonbase Alpha 上走一遍治理流程，以便为 Moonbeam 的治理过程做准备。

提交预映像后，您可以根据[提交提案](/tokens/governance/proposals/#submitting-a-proposal-v2){target=\_blank}部分的指南提交提案。

如果您更倾向于使用脚本方式，并且熟悉 XCM tools 仓库中的脚本，您可以使用 [generic call proposer](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/generic-call-proposer.ts){target=\_blank}，将所需的调用（包括 XCM 通道的接受与提案，以及资产注册）作为参数传入。该脚本可以帮助您组装多个必需的调用，例如：

```bash
yarn generic-call-propose \
  --call INSERT_CALLDATA_INCOMING_XCM_CHANNEL \
  --call INSERT_CALLDATA_OUTGOING_XCM_CHANNEL \
  --call INSERT_CALLDATA_BATCH_ASSET_REGISTRATION \
  --ws-provider INSERT_WSS_PROVIDER
```

### 在 Moonbeam 上测试资产注册 {: #test-asset-registration }

在您的资产注册后，团队将提供资产 ID 和 [XC-20 预编译](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=\_blank}地址。您的 XC-20 预编译地址通过将资产 ID 十进制数转换为十六进制，并在其前面加上 F，直到获得一个 40 个十六进制字符（加上“0x”）的地址来计算得出。有关如何计算的更多信息，请参阅外部 XC-20 指南的 [计算外部 XC-20 预编译地址](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=\_blank} 部分。资产成功注册后，您可以将代币从您的平行链转移到您正在集成的基于 Moonbeam 的网络。

!!! note
    请记住，基于 Moonbeam 的网络使用 AccountKey20（以太坊风格的地址）。

为了进行测试，请提供您的平行链 WSS 端点，以便 [Moonbeam dApp](https://apps.moonbeam.network){target=\_blank} 可以连接到它。最后，请为相应的帐户提供资金：

=== "Moonbeam"

    ```text
    AccountId: {{ networks.moonbeam.xcm.channel.account_id }}
    Hex:       {{ networks.moonbeam.xcm.channel.account_id_hex }}
    ```

=== "Moonriver"

    ```text
    AccountId: {{ networks.moonriver.xcm.channel.account_id }}
    Hex:       {{ networks.moonriver.xcm.channel.account_id_hex }}
    ```

=== "Moonbase Alpha"

    ```text
    AccountId: {{ networks.moonbase.xcm.channel.account_id }}
    Hex:       {{ networks.moonbase.xcm.channel.account_id_hex }}
    ```

!!! note
    对于 Moonbeam 和 Moonriver 测试，请向上述帐户发送价值 50 美元的代币。此外，请提供一个以太坊风格的帐户，用于发送价值 50 美元的 GLMR/MOVR 以进行测试。

[XC-20s](/builders/interoperability/xcm/xc20/){target=\_blank} 是具有 [ERC-20 接口](/builders/interoperability/xcm/xc20/overview/#the-erc20-interface){target=\_blank} 的基于 Substrate 的资产。这意味着可以将它们添加到 MetaMask，并可以与生态系统中存在的任何 EVM DApp 组合使用。 团队可以将您与您认为与 XC-20 集成相关的任何 DApp 联系起来。

如果您需要 DEV 代币（Moonbase Alpha 的本地代币）来使用您的 XC-20 资产，您可以从 [Moonbase Alpha 水龙头](/builders/get-started/networks/moonbase/#moonbase-alpha-faucet){target=\_blank} 获得一些，该水龙头每 24 小时分配 {{ networks.moonbase.website_faucet_amount }} 。如果您需要更多，请随时通过 [Telegram](https://t.me/Moonbeam_Official){target=\_blank} 或 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 与团队联系。

### 设置 XC-20 预编译字节码 {: #set-bytecode }

一旦您的 XC-20 在 Moonbeam 上注册，您就可以设置 XC-20 的预编译字节码。这是必要的，因为预编译是在 Moonbeam 运行时内部实现的，并且默认情况下没有字节码。在 Solidity 中，当调用合约时，会有一些检查要求合约字节码不能为空。因此，将字节码设置为占位符可以绕过这些检查，并允许调用预编译。

您可以使用 [预编译注册表](/builders/ethereum/precompiles/utility/registry/){target=\_blank}（它是一个 Solidity 接口）来更新 XC-20 预编译的字节码，以避免任何问题并确保可以从 Solidity 调用该预编译。为此，您将使用预编译注册表的 [`updateAccountCode` 函数](/builders/ethereum/precompiles/utility/registry/#the-solidity-interface){target=\_blank}。

要开始，您需要[计算 XC-20 的预编译地址](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=\_blank}并拥有预编译注册表的 ABI。

??? code "预编译注册表 ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/abi.js'
    ```

然后，您可以使用以下脚本为您的 XC-20 预编译设置虚拟代码。

!!! remember
    以下代码段仅用于演示目的。切勿将您的私钥存储在 JavaScript 或 Python 文件中。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc-registration/assets/web3.py'
    ```

运行脚本以设置字节码后，您应该在终端上看到 `The XC-20 precompile's bytecode is: 0x60006000fd`。

## 在另一条链上注册 Moonbeam 资产 {: #register-moonbeam-assets-on-another-chain }

为了实现 Moonbeam 资产（包括 Moonbeam 原生资产 (GLMR、MOVR、DEV) 和部署在 Moonbeam 上的本地 XC-20 (支持 XCM 的 ERC-20)）在 Moonbeam 和另一条链之间的跨链转移，您需要在另一条链上注册这些资产。由于每条链存储跨链资产的方式不同，因此在另一条链上注册 Moonbeam 资产的具体步骤会因链而异。至少，您需要知道 Moonbeam 上资产的元数据和多重位置。

除了资产注册之外，还需要采取其他步骤才能实现与 Moonbeam 的跨链集成。有关更多信息，请参阅[与 Moonbeam 建立 XC 集成](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank} 指南。

### 在另一条链上注册 Moonbeam 原生资产 {: #register-moonbeam-native-assets }

每个网络的元数据如下：

=== "Moonbeam"
    |      变量       |        值        |
    |:-------------------:|:-------------------:|
    |        名称         |       Glimmer       |
    |       符号        |        GLMR         |
    |      小数位       |         18          |
    | 存在性存款 | 1 (1 * 10^-18 GLMR) |

=== "Moonriver"
    |      变量       |        值        |
    |:-------------------:|:-------------------:|
    |        名称         |      Moonriver      |
    |       符号        |        MOVR         |
    |      小数位       |         18          |
    | 存在性存款 | 1 (1 * 10^-18 MOVR) |

=== "Moonbase Alpha"
    |      变量       |       值        |
    |:-------------------:|:------------------:|
    |        名称         |        DEV         |
    |       符号        |        DEV         |
    |      小数位       |         18         |
    | 存在性存款 | 1 (1 * 10^-18 DEV) |

Moonbeam 原生资产的多重定位包括 Moonbeam 网络的平行链 ID 和 Moonbeam 资产所在的 pallet 实例，它对应于 Balances Pallet 的索引。每个网络的多重定位如下：

=== "Moonbeam"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2004
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 2023
            },
            {
              PalletInstance: 10
            }
          ]
        }
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      V4: {
        parents: 1,
        interior: {
          X2: [
            { 
              Parachain: 1000
            },
            {
              PalletInstance: 3
            }
          ]
        }
      }
    }
    ```

### 在另一个链上注册本地 XC-20 {: #register-local-xc20 }

本地 XC-20 的多重定位包括 Moonbeam 的平行链 ID、pallet 实例和 ERC-20 的地址。pallet 实例对应于 ERC-20 XCM 桥接 Pallet 的索引，因为这是允许通过 XCM 传输任何 ERC-20 的 pallet。

**要在其他链上注册，本地 XC-20 必须严格遵守 [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=\_blank} 中描述的标准 ERC-20 接口。特别是，[`transfer` 函数](https://eips.ethereum.org/EIPS/eip-20#transfer){target=\_blank} 必须如 EIP-20 中所述：**

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

如果 `transfer` 函数的函数选择器偏离标准，则跨链传输将失败。

您可以使用以下多重定位来注册本地 XC-20：

=== "Moonbeam"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          {
            Parachain: 2004
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          {
            Parachain: 2023
          },
          {
            PalletInstance: 110
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      parents: 1,
      interior: {
        X3: [
          {
            Parachain: 1000
          },
          {
            PalletInstance: 48
          },
          {
            AccountKey20: {
              key: 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

由于本地 XC-20 是 Moonbeam 上的 ERC-20，因此在 Moonbeam 上创建 ERC-20 不需要任何存款。 但是，可能需要存款才能在另一个平行链上注册资产。 请咨询您希望注册资产的平行链团队以获取更多信息。

## 管理 XC 资产

在完成 XC 资产的[注册过程](#introduction)后，您可能需要定期更新资产详细信息，例如 XCM 多位置详细信息或资产价格。本节将介绍这些主题。

### 更新外部资产 XCM 位置 {: #updating-foreign-asset-xcm-location }

您可以使用 `evmForeignAssets.changeXcmLocation` 调用来更新资产的多重位置，该调用使用 `assetId` 和新的多重位置作为参数。您需要发起一个[治理提案](/tokens/governance/proposals/)，并在通用管理轨道下提交更新。如果您在 Moonbase Alpha 中进行测试，您可以要求 Moonbeam 团队使用 Sudo 提交外部函数调用以加快流程。您也可以在 Moonbase Alpha 上提交必要的治理提案。

### 冻结外部资产 {: #freezing-a--foreign-asset }

您可以通过调用 `evmForeignAssets.freezeForeignAsset` 来冻结外部资产，该方法接收 `assetId` 和一个 `allowXcmDeposit` 布尔值作为参数。如果设置为 true，则仍然允许来自远程链的 XCM 存款并铸造代币。如果设置为 false，则来自远程链的 XCM 存款将失败，因为不允许铸造。

### 使用外部资产支付 XCM 费用 {: #paying-xcm-fees-with-foreign-assets }

在您通过 `evmForeignAssets` 和 `xcmWeightTrader` pallet 注册外部资产后，您的资产现在将成为支付 XCM 费用的受支持资产之一。要验证，您可以查询 `xcmWeightTrader` pallet 和 `supportedAssets` 链状态查询。关闭**包含选项**滑块以查看完整列表，或者您可以按资产的多重位置筛选列表。
