---
title: 中继数据验证器预编译合约
description: 了解如何通过 Moonbeam 的中继数据验证器预编译合约的 Solidity 接口来验证中继链上的数据可用性和真实性。
keywords: solidity, ethereum, 验证, 证明, 中继链, 交易, moonbeam, 预编译, 合约
categories: 预编译, Ethereum 工具包
---

# 与中继数据验证器预编译交互

## 简介 {: #introduction }

Polkadot 依赖于状态证明来保证特定时间的数据完整性。状态证明是一种简洁的密码学数据结构，表示 trie 中特定交易或状态数据的子集。它由一组哈希值组成，这些哈希值形成从目标数据到存储在区块头中的根哈希值的路径。

客户端可以通过提供状态证明来独立地重建根哈希值，并将其与区块头中存储的原始根哈希值进行比较。如果重建的根哈希值与原始值匹配，则确认目标数据的真实性、有效性以及在区块链中的包含性。

Polkadot 独特的架构和平行链区块验证过程意味着像 Moonbeam 这样的区块链在其状态中具有中继链存储根哈希值。因此，Moonbeam 可以提供一种机制，通过检查存储的存储根哈希值的证明来验证中继链状态。

Moonbeam 的 [中继数据验证器预编译](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-data-verifier/RelayDataVerifier.sol){target=\_blank} 合约为智能合约提供了一种简便的方法，可以通过编程方式构建依赖于在合约调用中验证中继链状态的函数。因此，无需预言机将中继链数据馈送到 Moonbeam。此功能在以下合约地址中随时可用：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.relay_data_verifier }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.relay_data_verifier }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.relay_data_verifier }}`

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## 中继数据验证器 Solidity 接口 {: #the-relay-data-verifier-solidity-interface }

[`RelayDataVerifier.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-data-verifier/RelayDataVerifier.sol){target=\_blank} 是一个 Solidity 接口，允许开发者与预编译的方法进行交互。

??? code "RelayDataVerifier.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/RelayDataVerifier.sol'
    ```

该接口包括以下函数：

???+ function "**latestRelayBlockNumber**() — 检索区块链本身存储的最新中继链区块的存储根"

    === "参数"

        无

    === "返回值"

        链上存储有存储根的最新中继区块号。

??? function "**verifyEntry**(_uint32_ relayBlockNumber, _ReadProof_ calldata readProof, _bytes_ callData key) — 使用中继区块号、存储证明和存储密钥验证中继链中的存储条目。如果验证成功，它将返回与密钥关联的值"

    === "参数"

        - `relayBlockNumber` - 用于验证数据的中继区块号。最新的中继区块号可以从 `latestRelayBlockNumber()` 函数中获取
        - `readProof` - 预编译合约中定义的结构体，包含用于验证数据的存储证明。`ReadProof` 结构体定义如下：
          ```
          struct ReadProof {
              // The block hash against which the proof is generated
              bytes32 at;
              /// The storage proof
              bytes[] proof;
          }
          ```
        - `key` - 生成证明的存储密钥
    
    === "返回值"

        在 `verifyEntry` 函数上执行[静态调用](https://docs.ethers.org/v6/api/contract/#BaseContractMethod-staticCall){target=\_blank}时，您可以查看与十六进制格式的密钥关联的返回值。

        ```js
        --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/1.js'
        ```

??? function "**verifyEntries**(_uint32_ relayBlockNumber, _ReadProof_ calldata readProof, _bytes[]_ callData keys) — 验证中继链中的一组条目，并返回相应的值。此函数接受中继区块号、存储证明和要验证的存储密钥数组。它返回与密钥关联的值数组，顺序与密钥相同"

    === "参数"

        - `relayBlockNumber` - 用于验证数据的中继区块号。最新的中继区块号可以从 `latestRelayBlockNumber()` 函数中获取
        - `readProof` - 预编译合约中定义的结构体，包含用于验证数据的存储证明。`ReadProof` 结构体定义如下：
        ```
        struct ReadProof {
            // The block hash against which the proof is generated
            bytes32 at;
            /// The storage proof
            bytes[] proof;
        }
        ```
        - `keys` - 生成证明的存储密钥

    === "返回值"

        在 `verifyEntries` 函数上执行[静态调用](https://docs.ethers.org/v6/api/contract/#BaseContractMethod-staticCall){target=\_blank}时，您可以查看包含映射到各自密钥的相应值的数组，以十六进制格式表示。

        ```js
        --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/2.js'
        ```

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

验证中继链数据的典型工作流程包括以下步骤：

1. **Moonbeam RPC调用** - 调用`latestRelayBlockNumber`函数获取链在`pallet-storage-root`中跟踪的最新中继区块号
2. **中继RPC调用** - 调用`chain_getBlockHash(blockNumber)` RPC方法获取第一步中获得区块号对应的中继区块哈希
3. **中继RPC调用** - 调用`state_getReadProof(keys, at)` RPC方法检索存储证明，其中`at`是第二步中获得的中继区块哈希，而`keys`是字符串数组，其中包含目标存储项的键。对于`@polkadot/api`，可以通过`api.query.module.key()`函数获得
4. **Moonbeam RPC调用** - 提交一笔以太坊交易，调用`verifyEntry`或`verifyEntries`函数，以根据中继区块号验证数据。调用数据应包含第一步中获得的中继区块号、第三步中生成的读取证明以及要验证的键

以下章节将介绍如何使用以太坊库（例如Ethers.js和Web3.py）与中继数据验证器预编译进行交互。本指南中的示例将在Moonbase Alpha上进行。

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备：

- 在 Moonbase Alpha 上创建或拥有一个帐户，以测试预编译中的不同功能
- 该帐户需要用 `DEV` 代币充值。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### 使用以太坊库 {: #using-ethereum-libraries }

要使用以太坊库与Solidity接口进行交互，您需要预编译的ABI（应用程序二进制接口）。中继链数据验证器预编译的ABI如下：

??? code "中继数据验证器预编译ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/abi.js'
    ```

获得ABI后，您可以使用您选择的以太坊库与预编译进行交互，例如[Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}或[Web3.py](/builders/ethereum/libraries/web3py/){target=\_blank}。一般步骤如下：

1.  创建一个provider
2.  创建预编译的合约实例
3.  与预编译的函数交互

提供的代码示例演示了如何使用Ethers.js库与Moonbase Alpha网络及其中继链进行交互，并使用`verifyEntry`函数验证数据条目。

!!! note
     以下各节中提供的代码段不适用于生产环境。请确保针对每个用例进行调整。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/ethers-relay-data-verifier.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/ethereum/precompiles/utility/relay-data-verifier/web3py-relay-data-verifier.py'
    ```
