---
title: 如何使用 Python Substrate Interface
description: 了解如何使用 Python Substrate Interface 库来查询链数据、发送交易以及在 Moonbeam 网络上执行更多操作的基础知识。
categories: Substrate Toolkit, Libraries and SDKs
---

# Python Substrate 接口

## 简介 {: #introduction }

[Python Substrate Interface](https://github.com/polkascan/py-substrate-interface){target=_blank} 库允许应用程序开发人员查询 Moonbeam 节点，并使用原生 Python 接口与节点的 Polkadot 或 Substrate 功能进行交互。在这里，您将找到可用功能的概述和一些常用的代码示例，以帮助您开始使用 Python Substrate Interface 与 Moonbeam 网络进行交互。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 安装了 [`pip`](https://pypi.org/project/pip){target=_blank}

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

### 安装 Python Substrate 接口 {: #installing-python-substrate-interface }

您可以通过 `pip` 为您的项目安装 Python Substrate 接口库。在您的项目目录中运行以下命令：

```bash
pip install substrate-interface
```

## 创建 API 提供程序实例 {: #creating-an-API-provider-instance }

与 ETH API 库类似，您必须首先实例化 Python Substrate Interface API 的 API 实例。使用您希望与之交互的 Moonbeam 网络的 websocket 端点创建 `WsProvider`。

--8<-- 'text/_common/endpoint-examples.md'

=== "Moonbeam"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface

    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbeam.wss_url }}",
    )
    ```

=== "Moonriver"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface

    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonriver.wss_url }}",
    )
    ```

=== "Moonbase Alpha"

    ```python
    # Imports
    from substrateinterface import SubstrateInterface

    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    )
    ```

=== "Moonbeam Dev Node"

    ```python
    # Import
    from substrateinterface import SubstrateInterface

    # Construct the API provider
    ws_provider = SubstrateInterface(
        url="{{ networks.development.wss_url }}",
    )
    ```

## 查询信息 {: #querying-for-information }

在本节中，您将学习如何使用 Python Substrate Interface 库查询 Moonbeam 网络的链上信息。

### 访问运行时常量 {: #accessing-runtime-constants }

所有运行时常量，例如 `BlockWeights`、`DefaultBlocksPerRound` 和 `ExistentialDeposit`，都在元数据中提供。您可以使用 [`get_metadata_constants`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_metadata_constants){target=_blank} 方法来查看 Moonbeam 网络元数据中可用的运行时常量列表。

可以通过 [`get_constant`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_constant){target=_blank} 方法查询元数据中可用的运行时常量。

```python
# 导入
from substrateinterface import SubstrateInterface

# 构建API提供者
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# 元数据中可用的运行时常量列表
constant_list = ws_provider.get_metadata_constants()
print(constant_list)

# 在 Moonbeam 上检索存在性存款常量，该常量为 0
constant = ws_provider.get_constant("Balances", "ExistentialDeposit")
print(constant.value)
```

### 检索区块和外部操作 {: #retrieving-blocks-and-extrinsics }

您可以使用 Python Substrate Interface API 检索关于 Moonbeam 网络的基本信息，例如区块和外部操作。

要检索一个区块，您可以使用 [`get_block`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_block){target=\_blank} 方法。您还可以访问区块对象中的外部操作及其数据字段，该对象只是一个 Python 字典。

要检索区块头，您可以使用 [`get_block_header`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_block_header){target=\_blank} 方法。

```python
# 导入
from substrateinterface import SubstrateInterface

# 构建 API 提供程序
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# 检索最新区块
block = ws_provider.get_block()

# 检索最新的最终确定区块
block = ws_provider.get_block_header(finalized_only=True)

# 检索给定其 Substrate 区块哈希的区块
block_hash = "0xa499d4ebccdabe31218d232460c0f8b91bd08f72aca25f9b25b04b6dfb7a2acb"
block = ws_provider.get_block(block_hash=block_hash)
```

# 迭代区块内的 extrinsics
python
for extrinsic in block["extrinsics"]:
    if "address" in extrinsic:
        signed_by_address = extrinsic["address"].value
    else:
        signed_by_address = None
    print(
        "\nPallet: {}\nCall: {}\nSigned by: {}".format(
            extrinsic["call"]["call_module"].name,
            extrinsic["call"]["call_function"].name,
            signed_by_address,
        )
    )
```

!!! note
    以上代码示例中使用的块哈希是 Substrate 块哈希。Python Substrate Interface 中的标准方法假定您正在使用 Substrate 版本的原语，例如块或 tx 哈希。

### 订阅新区块头 {: #subscribing-to-new-block-headers }

您还可以调整之前的示例，以使用基于订阅的模型来监听新的区块头。

```python
# 导入
from substrateinterface import SubstrateInterface

# 构建 API 提供者
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

def subscription_handler(obj, update_nr, subscription_id):
    print(f"新区块 #{obj['header']['number']}")

    if update_nr > 10:
        return {
            "message": "当返回值时，订阅将取消",
            "updates_processed": update_nr,
        }

result = ws_provider.subscribe_block_headers(subscription_handler)
```

### 查询存储信息 {: #querying-for-storage-information }

您可以使用 [`get_metadata_storage_functions`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_metadata_storage_functions){target=_blank} 来查看 Moonbeam 网络元数据中可用的存储函数列表。

通过存储函数在元数据中提供的链状态可以通过 [`query`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.query){target=_blank} 方法进行查询。

可以查询诸如 `System`、`Timestamp` 和 `Balances` 等 Substrate 系统模块，以提供诸如帐户随机数和余额等基本信息。可用的存储函数是从元数据中动态读取的，因此您还可以查询 Moonbeam 自定义模块（如 `ParachainStaking` 和 `Democracy`）上的存储信息，以获取特定于 Moonbeam 的状态信息。

```python
# 导入
from substrateinterface import SubstrateInterface

# 构建 API 提供程序
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# 元数据中可用存储函数列表
method_list = ws_provider.get_metadata_storage_functions()
print(method_list)

# 查询基本帐户信息
account_info = ws_provider.query(
    module="System",
    storage_function="Account",
    params=["0x578002f699722394afc52169069a1FfC98DA36f1"],
)

# 记录帐户随机数
print(account_info.value["nonce"])

# 记录帐户可用余额
print(account_info.value["data"]["free"])

# 从 Moonbeam 的平行链 Staking 模块查询候选池信息
candidate_pool_info = ws_provider.query(
    module="ParachainStaking", storage_function="CandidatePool", params=[]
)
print(candidate_pool_info)
```

## 签名和交易 {: #signing-and-transactions }

### 创建密钥对 {: #creating-a-keypair }

Python Substrate Interface 中的密钥对对象用于对所有数据进行签名，无论是转账、消息还是合约交互。

您可以从简短格式私钥或助记词创建密钥对实例。对于 Moonbeam 网络，您还需要将 `KeypairType` 指定为 `KeypairType.ECDSA`。

```python
# 导入
from substrateinterface import Keypair, KeypairType

# 定义简短格式私钥
privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

# 定义帐户助记词
mnemonic = "INSERT_MNEMONIC"

# 从简短格式私钥生成密钥对
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# 从助记词生成密钥对
keypair = Keypair.create_from_mnemonic(mnemonic, crypto_type=KeypairType.ECDSA)
```

### 构建和发送交易 {: #forming-and-sending-a-transaction }

[`compose_call`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.compose_call){target=\_blank} 方法可用于构建调用负载，该负载可用作未签名的外部操作或提案。

然后，可以使用密钥对通过 [`create_signed_extrinsic`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.create_signed_extrinsic){target=\_blank} 方法对负载进行签名。

然后，可以使用 [`submit_extrinsic`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.submit_extrinsic){target=\_blank} 方法提交已签名的外部操作。

此方法还将返回一个 `ExtrinsicReceipt` 对象，其中包含有关外部操作链上执行的信息。 如果您需要检查收据对象，则可以在提交外部操作时将 `wait_for_inclusion` 设置为 `True`，以等待外部操作成功包含到区块中。

以下示例代码将显示发送事务的完整示例。

```python
# 导入
from substrateinterface import SubstrateInterface, Keypair, KeypairType
from substrateinterface.exceptions import SubstrateRequestException

# 构造 API 提供程序
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# 定义发送帐户的简短格式私钥
privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

# 生成密钥对
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# 形成交易调用
call = ws_provider.compose_call(
    call_module="Balances",
    call_function="transfer_allow_death",
    call_params={
        "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
        "value": 1 * 10**18,
    },
)

# 形成签名的外生函数
extrinsic = ws_provider.create_signed_extrinsic(call=call, keypair=keypair)

# 提交交易

try:
    receipt = ws_provider.submit_extrinsic(extrinsic, wait_for_inclusion=True)
    print(
        "交易 '{}' 已发送并包含在区块 '{}' 中".format(
            receipt.extrinsic_hash, receipt.block_hash
        )
    )
except SubstrateRequestException as e:
    print("发送失败: {}".format(e))

### 离线签名 {: #offline-signing }

您可以使用密钥对对象通过 [`sign`](https://jamdottech.github.io/py-polkadot-sdk/reference/keypair/#substrateinterface.keypair.Keypair.sign){target=\_blank} 方法对交易负载或任何任意数据进行签名。这可用于交易的离线签名。

1. 首先，在在线机器上生成签名负载：

    ```python
    # 导入
    from substrateinterface import SubstrateInterface

    # 构建 API 提供程序
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    )

    # 构建交易调用
    call = ws_provider.compose_call(
        call_module="Balances",
        call_function="transfer_allow_death",
        call_params={
            "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
            "value": 1 * 10**18,
        },
    )

    # 生成签名负载
    signature_payload = ws_provider.generate_signature_payload(call=call)
    ```

2. 在离线机器上，使用发送帐户的私钥创建一个密钥对，并对签名负载进行签名：

    ```python
    # 导入
    from substrateinterface import Keypair, KeypairType

    # 定义来自离线机器的签名负载
    signature_payload = "INSERT_SIGNATURE_PAYLOAD"

    # 定义发送帐户的简短格式私钥
    privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

    # 从简短格式私钥生成密钥对
    keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

    # 对 signature_payload 进行签名
    signature = keypair.sign(signature_payload)
    ```

3. 在在线机器上，使用发送帐户的公钥创建一个密钥对，然后使用从离线机器生成的签名提交外部交易：

    ```python
    # 导入
    from substrateinterface import SubstrateInterface, Keypair, KeypairType

    # 构建 API 提供程序
    ws_provider = SubstrateInterface(
        url="{{ networks.moonbase.wss_url }}",
    )

    # 定义来自离线机器的签名
    signature_payload = "INSERT_SIGNATURE_PAYLOAD"

    # 使用发送帐户的以太坊风格钱包地址构建一个密钥对
    keypair = Keypair(public_key="INSERT_ADDRESS_WITHOUT_0X", crypto_type=KeypairType.ECDSA)

    # 构建与已签名的相同交易调用
    call = ws_provider.compose_call(
        call_module="Balances",
        call_function="transfer_allow_death",
        call_params={
            "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
            "value": 1 * 10**18,
        },
    )

    # 使用生成的签名构建已签名的外部交易
    extrinsic = ws_provider.create_signed_extrinsic(
        call=call, keypair=keypair, signature=signature
    )

    # 提交已签名的外部交易
    result = ws_provider.submit_extrinsic(extrinsic=extrinsic)

    # 打印执行结果
    print(result.extrinsic_hash)
    ```

## 自定义 RPC 请求 {: #custom-rpc-requests }

您还可以使用 [`rpc_request`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.rpc_request){target=_blank} 方法发出自定义 RPC 请求。

这对于与 Moonbeam 的 [Ethereum JSON-RPC](/builders/ethereum/json-rpc/eth-rpc/){target=_blank} 端点或 Moonbeam 的 [自定义 RPC](/builders/ethereum/json-rpc/moonbeam-custom-api/){target=_blank} 端点进行交互特别有用。

[共识和最终性页面](/learn/core-concepts/consensus-finality/#checking-tx-finality-with-substrate-libraries){target=_blank} 提供了通过 Python Substrate Interface 使用自定义 RPC 调用来检查给定交易哈希的交易最终性的示例。

--8<-- 'text/_disclaimers/third-party-content.md'
