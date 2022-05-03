---
title: XC-20s and Cross-Chain Assets
description:  Learn how to access and interact with an ERC-20 interface for cross-chain tokens on Moonbeam using the assets precompiled Solidity contract.
---

# XC-20s and Cross-Chain Assets

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/xcm/xc20/overview/xc20-banner.png)

## Introduction {: #introduction } 

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transfer messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems. 

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, making the developer experience unideal, especially for those from the Ethereum world. Consequently, to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} via a precompile contract (Ethereum API). Moreover, developers can integrate XC-20s with regular Ethereum development frameworks or dApps. 

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/xcm/overview/overview-4.png)

XC-20 assets will be differentiated by having `xc` prepended to their name. For example, Polkadot's DOT representation on Moonbeam is known as _xcDOT_ and Kusama's KSM representation on Moonriver is _xcKSM_. Please note that XC-20 precompiles do not support cross-chain transfers, and this is intentionally done to stay as close as possible to the standard ERC-20 interface.

XC-20s need to be registered and linked to another asset in the ecosystem before being used. This is done through a whitelisting process via a democracy proposal. If you are interested in testing XCM features in our TestNet, please contact us through our [Discord Server](https://discord.gg/PfpUATX){target=_blank}. For more information on XCM, you can check out the [XCM Overview](/builders/xcm/overview/){target=_blank} page of our documentation.

## Current XC-20 Assets {: #current-xc20-assets}

The current list of available XC-20 assets per network is the following:

=== "Moonbeam"
    |  Origin  | Symbol |                                                            XC-20 Address                                                            |
    |:--------:|:------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
    | Polkadot | xcDOT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/address/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |

     _*You can check each Asset ID from the [Assets tab on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/assets){target=_blank}_

=== "Moonriver"
    |  Origin   | Symbol |                                                                 XC-20 Address                                                                 |
    |:---------:|:------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Kusama   | xcKSM  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/address/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank} |
    |  Bifrost  | xcBNC  | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/address/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=_blank} |
    |  Karura   | xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/address/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |  Karura   | xcaUSD | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/address/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    | Kintsugi  | xcKINT | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/address/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=_blank} |
    | Kintsugi  | xckBTC | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/address/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=_blank} |
    | Statemine | xcRMRK | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/address/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=_blank} |
    | Statemine | xcUSDT | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/address/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

     _*You can check each Asset ID from the [Assets tab on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network#/assets){target=_blank}_

=== "Moonbase Alpha"
    |         Origin          | Symbol  |                                                                 XC20 Address                                                                 |
    |:-----------------------:|:-------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Relay Chain Alphanet   | xcUNIT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/address/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |    Basilisk Alphanet    |  xcBSX  | [0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA](https://moonbase.moonscan.io/address/0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA){target=_blank} |
    |    Bifrost Alphanet     |  xcBNC  | [0xFffFFFfF1FAE104Dc4C134306bCA8e2E1990aCfd](https://moonbase.moonscan.io/address/0xFffFFFfF1FAE104Dc4C134306bCA8e2E1990aCfd){target=_blank} |
    |    Calamari Alphanet    |  xcKMA  | [0xFFffFffFA083189f870640b141ae1E882c2b5bad](https://moonbase.moonscan.io/address/0xFFffFffFA083189f870640b141ae1E882c2b5bad){target=_blank} |
    |  Crust/Shadow Alphanet  |  xcCSM  | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonbase.moonscan.io/address/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |     Karura Alphanet     |  xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonbase.moonscan.io/address/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |     Karura Alphanet     | xckUSD  | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonbase.moonscan.io/address/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    |     Khala Alphanet      |  xcPHA  | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonbase.moonscan.io/address/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=_blank} |
    |    Kintsugi Alphanet    | xcKINT  | [0xFFFfffff27C019790DFBEE7cB70F5996671B2882](https://moonbase.moonscan.io/address/0xFFFfffff27C019790DFBEE7cB70F5996671B2882){target=_blank} |
    |    Kintsugi Alphanet    | xckBTC  | [0xFffFfFff5C2Ec77818D0863088929C1106635d26](https://moonbase.moonscan.io/address/0xFffFfFff5C2Ec77818D0863088929C1106635d26){target=_blank} |
    |    Litentry Alphanet    |  xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonbase.moonscan.io/address/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    | Parallel Heiko Alphanet |  xcHKO  | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonbase.moonscan.io/address/0xffffffFF394054BCDa1902B6A6436840435655a3){target=_blank} |
    |   Statemine Alphanet    | xcMRMRK | [0xFFffffFfd2aaD7f60626608Fa4a5d34768F7892d](https://moonbase.moonscan.io/address/0xFFffffFfd2aaD7f60626608Fa4a5d34768F7892d){target=_blank} |
    

     _*You can check each Asset ID from the [Assets tab on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/assets){target=_blank}_

This guide will show you how to retrieve the available XC-20s and calculate their precompile addresses for the Moonbase Alpha TestNet using Polkadot.js Apps. In addition, you will learn how to interact with an XC-20 precompile using Remix.

## XC-20 vs ERC-20 {: #xc-20-vs-erc-20 }

Although XC-20s and ERC-20s are very similar, some distinct differences are to be aware of. 

First and foremost, XC-20s are Substrate-based assets, and as such, they are also subject to be directly impacted by Substrate features such as governance. In addition, XC-20s transactions done via the Substrate API won't be visible from EVM-based block explorers such as [Moonscan](https://moonscan.io){target=_blank}. Only transactions done via the Ethereum API are visible through such explorers.

Nevertheless, XC-20s can be interacted with through an ERC-20 interface, so they have the additional benefit of being accessible from both the Substrate and Ethereum APIs. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs, lending platforms, among others.

## Retrieve List of Cross-Chain Assets {: #list-xchain-assets }

To fetch a list of the XC-20s currently available on the Moonbase Alpha TestNet, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank} and make sure you're connected to Moonbase Alpha. Then click on the **Developer** tab and select **Chain State** from the dropdown. To query the available XC-20s, you can follow these steps:

1. From the **selected state query** dropdown, choose **assets**
2. Select the **asset** extinsic
3. Disable the **include option** slider
4. Send the query by clicking on the **+** button

![Fetch list of cross-chain assets](/images/builders/xcm/xc20/overview/xc20-1.png)

The result will display the asset ID along with some additional information for all of the registered XC-20s on Moonbase Alpha. 

## Retrieve Cross-Chain Assets Metadata {: #x-chain-assets-metadata }

To quickly get more information about a specific XC-20 such as the name, symbol and multi location of the asset, you can use the **metadata** extrinsic to return metadata:

1. From the **selected state query** dropdown, choose **assets**
2. Select the **metadata** extinsic
3. Enable the **include option** slider
4. Enter in the asset ID that was returned from calling the **asset** extrinsic. Please note that if you copy and paste the asset ID with the commas, the commas will automatically be removed and the number might be cut off. Make sure it's the exact same number as the ID. For this example, you can use asset ID `42259045809535163221576417993425387648`
4. Send the query by clicking on the **+** button 

![Get asset metadata](/images/builders/xcm/xc20/overview/xc20-2.png)

With the results from the metadata, you can see that the asset ID corresponds to the VUNIT XC-20.

## Calculate Precompile Addresses {: #calculate-xc20-address}

Now that you have retrieved a list of the available XC-20s, before you can interact with them via the precompile, you need to derive the precompile address from the asset ID.

The XC-20 precompile address is calculated using the following:

```
address = "0xFFF..." + DecimalToHex(AssetId)
```

Given the above calculation, the first step is to take the u128 representation of the asset ID and convert it to a hex value. You can use your search engine of choice to look up a simple tool for converting decimals to hex values. For asset ID `42259045809535163221576417993425387648`, the hex value is `1FCACBD218EDC0EBA20FC2308C778080`.

Since Ethereum addresses are 40 characters long, you will need to prepend `F`s to the hex value until the address has 40 characters. 

The hex value that was already calculated is 32 characters long, so prepending 8 `F`s to the hex value will give you the 40 character address you need to interact with the XC-20 precompile. For this example, the full address is `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`.

Asset precompiles can only fall between `0xFFFFFFFF00000000000000000000000000000000` and `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`.

Now that you've calculated the XC-20 precompile address, you can use the address to interact with the XC-20 like you would with any other ERC-20 in Remix.

## The ERC-20 Interface {: #the-erc20-interface }

The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol) interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20) which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/erc20-interface/erc20-interface.md'

## Checking Prerequisites {: #checking-prerequisites } 

To approve a spend or transfer XC-20s via the XC-20 precompile, you will need:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- Create or have two accounts on Moonbase Alpha
- At least one of the accounts will need to be funded with `DEV` tokens. You can obtain tokens for testing purposes from [Mission Control](/builders/get-started/networks/moonbase/#get-tokens/){target=_blank}

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

You can interact with the XC-20 precompile using [Remix](https://remix.ethereum.org/){target=_blank}. First, you will need to add the ERC-20 interface to Remix:

1. Get a copy of [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} 
2. Paste the file contents into a Remix file named **IERC20.sol**

![Load the interface in Remix](/images/builders/xcm/xc20/overview/xc20-3.png)

### Compile the Contract {: #compile-the-contract } 

Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IER20.sol** file

![Compiling IERC20.sol](/images/builders/xcm/xc20/overview/xc20-4.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Contract {: #access-the-contract } 

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20 precompile:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **Environment** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **Account**
4. Ensure **IERC20 - IERC20.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead we are going to provide the address of the precompile in the **At Address** Field
5. Provide the address of the XC-20 precompile calculated in the [Calculate Precompile Address](#calculate-precompile-address) section, `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`, and click **At Address**

![Access the address](/images/builders/xcm/xc20/overview/xc20-5.png)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead. 

The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20. 

![Interact with the precompile functions](/images/builders/xcm/xc20/overview/xc20-6.png)

To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](/builders/build/canonical-contracts/precompiles/erc20/){target=_blank} guide and modify it for interacting with the XC-20 precompile.