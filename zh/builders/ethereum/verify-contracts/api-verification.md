---
title: 通过 API 验证智能合约
description: 了解如何使用可用的基于 API 的验证方法之一来验证基于 Moonbeam 的网络上的智能合约。
categories: Ethereum Toolkit
---

# 基于 API 的合约验证

## 简介 {: #introduction }

验证智能合约可以大大提高其透明性和安全性。部署在 Moonbeam 网络上的智能合约可以通过基于 API 的工具进行验证，包括 Moonscan API 和 Sourcify。

本页将概述使用这些基于 API 的工具来验证智能合约，或检索 Moonbeam 网络上智能合约的验证状态和元数据的步骤。

## 使用 Moonscan API {: #using-moonscan-api }

[Moonscan](https://moonscan.io){target=_blank} 是 Etherscan 的官方分支，可用于查看和搜索链上数据，并提供一套开发者工具和分析功能，以便与 Moonbeam 网络上的数据进行交互。

[Etherscan API](https://docs.etherscan.io){target=_blank} 提供了各种端点，用于验证智能合约、检索已验证的合约 ABI 和源代码，以及与 Moonbeam 网络上已验证的合约进行交互。

### 生成 Etherscan API 密钥 {: #generating-an-etherscan-api-key }

在使用 Moonscan API 之前，您需要生成一个 Etherscan API 密钥。请按照 Etherscan 插件验证页面的[密钥生成部分](/builders/ethereum/verify-contracts/etherscan-plugins/#generating-an-etherscan-api-key){target=_blank}中的说明进行操作，因为生成的 API 密钥用于两者。

### Moonscan 公共 API URL {: #moonscan-public-api-url }

Moonbeam 网络的 Moonscan API URL 如下：

=== "Moonbeam"

    ```text
    https://api-moonbeam.moonscan.io/api
    ```

=== "Moonriver"

    ```text
    https://api-moonriver.moonscan.io/api
    ```

=== "Moonbase Alpha"

    ```text
    https://api-moonbase.moonscan.io/api
    ```

### 验证源代码 {: #verify-source-code }

要使用 Moonscan API 验证已部署合约的源代码，您必须创建一个包含所有相关合约创建信息的 POST 请求，并将该请求发送到 Moonscan 的 REST API。以下是使用 JavaScript 和 HTTP 客户端 [Axios](https://axios-http.com/docs/intro){target=_blank} 的示例代码：

===

    ```javascript
    // 提交源代码以进行验证
    const response = await axios.post(
      'https://api-moonbeam.moonscan.io/api',
      {
        apikey: 'INSERT_API_KEY',
        module: 'contract',
        action: 'verifysourcecode',
        contractAddress: 'INSERT_CONTRACT_ADDRESS',
        sourceCode: 'INSERT_SOURCE_CODE', // 必要时进行扁平化处理
        codeformat: 'solidity-single-file', // 或者您可以使用 "solidity-standard-json-input"
        contractname: 'INSERT_CONTRACT_NAME', // 如果 codeformat = solidity-standard-json-input，则输入合约名称，例如：erc20.sol:erc20
        compilerversion: 'INSERT_COMPILER_VERSION', // 请参阅 https://etherscan.io/solcversions 获取支持版本列表
        optimizationUsed: 0, // 0 = 未使用优化，1 = 使用了优化 (当 codeformat=solidity-single-file 时适用)
        runs: 200, // 除非另有说明，否则默认设置为 200 (当 codeformat=solidity-single-file 时适用)
        constructorArguments: 'INSERT_CONSTRUCTOR_ARGUMENTS', // 如果适用
        evmversion: 'INSERT_EVM_VERSION', // 选项：homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (当 codeformat=solidity-single-file 时适用)
        licenseType: 1, // 有效代码 1-14，其中 1=无许可证 ... 14=商业源代码许可证 1.1，请参阅 https://etherscan.io/contract-license-types
        libraryname1: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第一个库的名称，即 SafeMath（最多可以使用 10 个库）
        libraryaddress1: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第一个库的地址
        libraryname2: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第二个库的名称
        libraryaddress2: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第二个库的地址
        // ...
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.status == '1') {
      // 1 = 提交成功，使用返回的 guid (response.data.result) 检查提交状态
      // 平均处理时间为 30-60 秒
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
      // response.data.result 是提交的 GUID 收据，您可以使用此 guid 检查验证状态
    } else {
      // 0 = 错误
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
    }
    ```

===

    ```javascript
    // 提交源代码以进行验证
    const response = await axios.post(
      'https://api-moonriver.moonscan.io/api', 
      {
        apikey: 'INSERT_API_KEY',
        module: 'contract',
        action: 'verifysourcecode',
        contractAddress: 'INSERT_CONTRACT_ADDRESS',
        sourceCode: 'INSERT_SOURCE_CODE', // 必要时进行扁平化处理
        codeformat: 'solidity-single-file', // 或者您可以使用 "solidity-standard-json-input"
        contractname: 'INSERT_CONTRACT_NAME', // 如果 codeformat = solidity-standard-json-input，则输入合约名称，例如：erc20.sol:erc20
        compilerversion: 'INSERT_COMPILER_VERSION', // 请参阅 https://etherscan.io/solcversions 获取支持版本列表
        optimizationUsed: 0, // 0 = 未使用优化，1 = 使用了优化 (当 codeformat=solidity-single-file 时适用)
        runs: 200, // 除非另有说明，否则默认设置为 200 (当 codeformat=solidity-single-file 时适用)
        constructorArguments: 'INSERT_CONSTRUCTOR_ARGUMENTS', // 如果适用
        evmversion: 'INSERT_EVM_VERSION', // 选项：homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (当 codeformat=solidity-single-file 时适用)
        licenseType: 1, // 有效代码 1-14，其中 1=无许可证 ... 14=商业源代码许可证 1.1，请参阅 https://etherscan.io/contract-license-types
        libraryname1: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第一个库的名称，即 SafeMath（最多可以使用 10 个库）
        libraryaddress1: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第一个库的地址
        libraryname2: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第二个库的名称
        libraryaddress2: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第二个库的地址
        // ...
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.status == '1') {
      // 1 = 提交成功，使用返回的 guid (response.data.result) 检查提交状态
      // 平均处理时间为 30-60 秒
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
      // response.data.result 是提交的 GUID 收据，您可以使用此 guid 检查验证状态
    } else {
      // 0 = 错误
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
    }
    ```

===

    ```javascript
    // 提交源代码以进行验证
    const response = await axios.post(
      'https://api-moonbase.moonscan.io/api', 
      {
        apikey: 'INSERT_API_KEY',
        module: 'contract',
        action: 'verifysourcecode',
        contractAddress: 'INSERT_CONTRACT_ADDRESS',
        sourceCode: 'INSERT_SOURCE_CODE', // 必要时进行扁平化处理
        codeformat: 'solidity-single-file', // 或者您可以使用 "solidity-standard-json-input"
        contractname: 'INSERT_CONTRACT_NAME', // 如果 codeformat = solidity-standard-json-input，则输入合约名称，例如：erc20.sol:erc20
        compilerversion: 'INSERT_COMPILER_VERSION', // 请参阅 https://etherscan.io/solcversions 获取支持版本列表
        optimizationUsed: 0, // 0 = 未使用优化，1 = 使用了优化 (当 codeformat=solidity-single-file 时适用)
        runs: 200, // 除非另有说明，否则默认设置为 200 (当 codeformat=solidity-single-file 时适用)
        constructorArguments: 'INSERT_CONSTRUCTOR_ARGUMENTS', // 如果适用
        evmversion: 'INSERT_EVM_VERSION', // 选项：homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (当 codeformat=solidity-single-file 时适用)
        licenseType: 1, // 有效代码 1-14，其中 1=无许可证 ... 14=商业源代码许可证 1.1，请参阅 https://etherscan.io/contract-license-types
        libraryname1: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第一个库的名称，即 SafeMath（最多可以使用 10 个库）
        libraryaddress1: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第一个库的地址
        libraryname2: 'INSERT_LIBRARY_NAME', // 如果适用，输入使用的第二个库的名称
        libraryaddress2: 'INSERT_LIBRARY_ADDRESS', // 如果适用，输入使用的第二个库的地址
        // ...
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.status == '1') {
      // 1 = 提交成功，使用返回的 guid (response.data.result) 检查提交状态
      // 平均处理时间为 30-60 秒
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
      // response.data.result 是提交的 GUID 收据，您可以使用此 guid 检查验证状态
    } else {
      // 0 = 错误
      console.log(
        response.data.status +
          '; ' +
          response.data.message +
          '; ' +
          response.data.result
      );
    }
    ```

成功提交后，将返回一个 GUID 作为结果的一部分。此 GUID 可用于检查提交状态。

===

    ```bash
    curl https://api-moonbeam.moonscan.io/api
      ?module=contract
      &action=checkverifystatus
      &guid=INSERT_GUID_FROM_RESPONSE
      &apikey=INSERT_API_KEY
    ```

===

    ```bash
    curl https://api-moonriver.moonscan.io/api
      ?module=contract
      &action=checkverifystatus
      &guid=INSERT_GUID_FROM_RESPONSE
      &apikey=INSERT_API_KEY
    ```

===

    ```bash
    curl https://api-moonbase.moonscan.io/api
      ?module=contract
      &action=checkverifystatus
      &guid=INSERT_GUID_FROM_RESPONSE
      &apikey=INSERT_API_KEY
    ```

### 检索已验证合约的合约 ABI {: #retrieve-contract-abi-for-verified-contracts }

一旦您的合约在 Moonscan 上得到验证，您可以使用以下端点来检索合约 ABI：

===

    bash
    curl https://api-moonbeam.moonscan.io/api
      ?module=contract
      &action=getabi
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY
    

===

    bash
    curl https://api-moonriver.moonscan.io/api
      ?module=contract
      &action=getabi
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY
    

===

    bash
    curl https://api-moonbase.moonscan.io/api
      ?module=contract
      &action=getabi
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY

### 检索已验证合约的合约源代码 {: #retrieve-contract-source-code-for-verified-contracts }

一旦您的合约在 Moonscan 上得到验证，您可以使用以下端点来检索合约源代码：

===

    bash
    curl https://api-moonbeam.moonscan.io/api
      ?module=contract
      &action=getsourcecode
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY
    

===

    bash
    curl https://api-moonriver.moonscan.io/api
      ?module=contract
      &action=getsourcecode
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY
    

===

    bash
    curl https://api-moonbase.moonscan.io/api
      ?module=contract
      &action=getsourcecode
      &address=INSERT_CONTRACT_ADDRESS
      &apikey=INSERT_API_KEY

## 使用 Sourcify API {: #using-sourcify-api }

[Sourcify](https://sourcify.dev){target=_blank} 是一个多链去中心化自动合约验证服务，并维护一个合约元数据的公共存储库。Sourcify 还提供了一个公共服务器 API 用于验证和检查合约是否已验证，以及一个存储库 API 用于检索元数据文件。

### Sourcify 公共服务器 URL {: #sourcify-public-server-url }

可以通过以下公共服务器访问 Soucify API 端点：

==="Production" （生产环境）

    text
    https://sourcify.dev/server
    

==="Staging" （测试环境）

    text
    https://staging.sourcify.dev/server

### Moonbeam网络链ID {: #moonbeam-network-chain-ids }

Sourcify使用链ID来识别请求的目标网络。Moonbeam网络的链ID如下：

===

    text
    {{ networks.moonbeam.chain_id }}
    

===

    text
    {{ networks.moonriver.chain_id }}
    

===

    bash
    {{ networks.moonbase.chain_id }}

### 完全匹配 vs. 部分匹配 {: #full-vs-partial-match }

Sourcify 支持两种类型的验证匹配结果。

完全匹配（有时称为完美匹配）指的是部署合约的字节码与给定源代码文件在元数据文件中定义的编译设置下的编译输出逐字节相同的情况。

部分匹配指的是链上合约的已部署字节码与使用元数据和源文件（元数据哈希除外）重新编译产生的字节码相匹配的情况。对于部分匹配，已部署的合约与给定的源代码和元数据在功能上是相同的，但源代码注释、变量名或其他元数据字段（如源路径）存在差异。

### 验证合约 {: #verify-contract }

POST 请求用于在 Sourcify 上验证合约。以下是使用 JavaScript 的示例代码：

===

    ```javascript
    // 提交合约源代码和元数据以进行验证
    const response = await axios.post('https://sourcify.dev/server/verify', {
      address: 'INSERT_CONTRACT_ADDRESS',
      chain: {{ networks.moonbeam.chain_id }}, // Moonbeam 的链 ID
      files: {
        'metadata-1.json': 'INSERT_JSON_FILE', // 合约文件 1 的元数据文件
        'metadata-2.json': 'INSERT_JSON_FILE', // 合约文件 2 的元数据文件
        'file1-name.sol': 'INSERT_SOL_FILE', // 合约源文件 1
        'file2-name.sol': 'INSERT_SOL_FILE', // 合约源文件 2
        //...
      },
      chosenContract: 1, //（可选）合约的索引，如果提供的文件包含多个元数据文件
    });

    if (result.status == 'perfect') {
      // 完全匹配
      console.log(result.status + ';' + result.address);
    } else if (result.status == 'partial') {
      // 部分匹配
      console.log(result.status + ';' + result.address);
    } else {
      // 不匹配
      console.log(result.status + ';' + result.address);
    }
    ```

===

    ```javascript
    // 提交合约源代码和元数据以进行验证
    const response = await axios.post('https://sourcify.dev/server/verify', {
      address: 'INSERT_CONTRACT_ADDRESS',
      chain: {{ networks.moonriver.chain_id }}, // Moonriver 的链 ID
      files: {
        'metadata-1.json': 'INSERT_JSON_FILE', // 合约文件 1 的元数据文件
        'metadata-2.json': 'INSERT_JSON_FILE', // 合约文件 2 的元数据文件
        'file1-name.sol': 'INSERT_SOL_FILE', // 合约源文件 1
        'file2-name.sol': 'INSERT_SOL_FILE', // 合约源文件 2
        //...
      },
      chosenContract: 1, //（可选）合约的索引，如果提供的文件包含多个元数据文件
    });

    if (result.status == 'perfect') {
      // 完全匹配
      console.log(result.status + ';' + result.address);
    } else if (result.status == 'partial') {
      // 部分匹配
      console.log(result.status + ';' + result.address);
    } else {
      // 不匹配
      console.log(result.status + ';' + result.address);
    }
    ```

===

    ```javascript
    // 提交合约源代码和元数据以进行验证
    const response = await axios.post('https://sourcify.dev/server/verify', {
      address: 'INSERT_CONTRACT_ADDRESS',
      chain: {{ networks.moonbase.chain_id }}, // Moonbase Alpha 的链 ID
      files: {
        'metadata-1.json': 'INSERT_JSON_FILE', // 合约文件 1 的元数据文件
        'metadata-2.json': 'INSERT_JSON_FILE', // 合约文件 2 的元数据文件
        'file1-name.sol': 'INSERT_SOL_FILE', // 合约源文件 1
        'file2-name.sol': 'INSERT_SOL_FILE', // 合约源文件 2
        //...
      },
      chosenContract: 1, //（可选）合约的索引，如果提供的文件包含多个元数据文件
    });

    if (result.status == 'perfect') {
      // 完全匹配
      console.log(result.status + ';' + result.address);
    } else if (result.status == 'partial') {
      // 部分匹配
      console.log(result.status + ';' + result.address);
    } else {
      // 不匹配
      console.log(result.status + ';' + result.address);
    }
    ```

或者，您也可以使用 [Sourcify 托管的 GUI](https://sourcify.dev/#/verifier){target=_blank} 提交合约进行验证。

### 通过地址和链 ID 检查验证状态 {: check-verification-status-by-address-and-chain-id }

Sourcify 提供了用于一次性检查多个 EVM 链上合约验证状态的端点。这可以通过 URL 参数来完成，通过指定合约地址和网络的链 ID。

此端点有两种变体，一种用于完全匹配，另一种用于部分匹配：

===

    bash
    curl https://sourcify.dev/server/check-by-addresses
      ?addresses={INSERT_ADDRESS_1, INSERT_ADDRESS_2, ...}
      &chainIds={INSERT_CHAIN_ID_1, INSERT_CHAIN_ID_2, ...}
    

===

    bash
    curl https://sourcify.dev/server/check-all-by-addresses
      ?addresses={INSERT_ADDRESS_1, INSERT_ADDRESS_2, ...}
      &chainIds={INSERT_CHAIN_ID_1, INSERT_CHAIN_ID_2, ...}
    

一个示例响应将是一个具有以下结构的 JSON 对象：

[
    {
        "address": "address1",
        "status": "perfect",
        "chainIds": [
            "chainId1",
            "chaindId2"
        ]
    },
    {
        "address": "address2",
        "status": "partial",
        "chainIds": [
            "chaindId2"
        ]
    }
]

### 检索已验证合约的合约源文件 {: get-contract-source-files-for-verified-contracts }

您还可以从 Sourcify 存储库中检索已验证合约的源文件。

此端点有两种变体，一种用于完美匹配的源文件：

===

    bash
    curl https://sourcify.dev/server/files/{{ networks.moonbeam.chain_id }}/INSERT_CONTRACT_ADDRESS
    

===

    bash
    curl https://sourcify.dev/server/files/{{ networks.moonriver.chain_id }}/INSERT_CONTRACT_ADDRESS
    

===

    bash
    curl https://sourcify.dev/server/files/{{ networks.moonbase.chain_id }}/INSERT_CONTRACT_ADDRESS
    

还有一种用于完美匹配和部分匹配的源文件：

===

    bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbeam.chain_id }}/INSERT_CONTRACT_ADDRESS
    

===

    bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonriver.chain_id }}/INSERT_CONTRACT_ADDRESS
    

===

    bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbase.chain_id }}/INSERT_CONTRACT_ADDRESS

### 将 Sourcify 与 Foundry 结合使用 {: #using-sourcify-with-foundry }

Foundry 的 Forge 工具内置了对 Sourcify 验证的支持，类似于它对[Etherscan 的内置支持](/builders/ethereum/verify-contracts/etherscan-plugins/#using-foundry-to-verify){target=_blank}。本指南的此部分中的示例将使用在[使用 Foundry 部署到 Moonbeam](/builders/ethereum/dev-env/foundry/){target=_blank} 指南中创建的 `MyToken.sol` 合约。

使用 Sourcify 的 Foundry 项目必须让其编译器发出元数据文件。这可以在 `foundry.toml` 文件中配置：

```toml
[profile.default]

```

# 在此处输入您的自定义或默认配置选项
extra_output_files = ["metadata"]

如果您已经部署了示例合约，您可以使用 `verify-contract` 命令来验证它。在验证合约之前，您需要对构造函数参数进行 ABI 编码。要对示例合约执行此操作，您可以运行以下命令：

bash
cast abi-encode "constructor(uint256)" 100

结果应该是 `0x0000000000000000000000000000000000000000000000000000000000000064`。然后，您可以使用以下命令来验证合约：

===

    bash
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify INSERT_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    

===

    bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify INSERT_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    

===

    bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify INSERT_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    

--8<-- 'code/builders/ethereum/verify-contracts/api/terminal/verify-original.md'

如果您想同时部署示例合约并进行验证，那么您可以使用以下命令：

===

    bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key INSERT_YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    

===

    bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key INSERT_YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    

===

    bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key INSERT_YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    

--8<-- 'code/builders/ethereum/verify-contracts/api/terminal/create.md'
