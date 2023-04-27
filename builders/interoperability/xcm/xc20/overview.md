---
title: XC-20s and Cross-Chain Assets
description:  Learn how to access and interact with an ERC-20 interface for cross-chain tokens on Moonbeam using the assets precompiled Solidity contract.
---

# Overview of XC-20s

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/interoperability/xcm/xc20/overview/overview-banner.png)

## Introduction {: #introduction } 

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transferring messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems. 

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, with no real visibility into the EVM. Consquently, interoperable Substrate assets are not that attractive for developers building on the EVM. To fix that and to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](#the-erc20-interface){target=_blank}. On the EVM side, XC-20s have [ERC-20 interface](#the-erc20-interface){target=_blank} so smart contracts and users can easily interact with them, and no knowledge of Substrate is required. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs and lending platforms, among others. Moreover, developers can integrate XC-20s with regular [Ethereum development frameworks](/builders/build/eth-api/dev-env/){target=_blank} or dApps, and create connected contracts strategies with such assets. Moreover, with the introduction of [RT2301](https://github.com/PureStake/moonbeam/tree/runtime-2301){target=_blank}, all ERC-20s are XCM-ready, meaning they can also be referred to as XC-20s.

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

## Types of XC-20s {: #types-of-xc-20s }

There are two types of XC-20s: local and external.

### What are Local XC-20s? {: #local-xc20s }

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. In order for local XC-20s to be transferred to another parachain, the asset needs to be registered on that chain. When transferring local XC-20s, the actual tokens reside in the destination chain's Sovereign account on Moonbeam. Local XC-20s must follow [the ERC-20 interface outlined in this guide](#the-erc20-interface), they cannot be customized ERC-20s.

### What are External XC-20s? {: #external-xc20s }

External XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonbeam. These assets are Substrate assets at their core. When transferring external XC-20s, the actual tokens reside in Moonbeam's Sovereign account in each of these chains. External XC-20s will all have _xc_ prepended to their names to distinguish them as native cross-chain assets.

### Local XC-20s vs External XC-20s {: #xc-20-comparison }

Both types of XC-20s can be easily sent to other parachains in the ecosystem as if they were Substrate assets, through both the Ethereum and Substrate API. However, using the Substrate API for XCM transfer will emit EVM logs for local XC-20s, but not for external XC-20s. Using the Ethereum API is recommended to provide more visiblity into the XCM actions through EVM-based explorers, such as [Moonscan](https://moonscan.io){target=_blank}.

Within Moonbeam, local XC-20s can only be transferred through their regular ERC-20 interface. On the contrary, external XC-20s can be transferred through both interfaces (Substrate and ERC-20). If external XC-20s are transferred through the Substrate API, the transaction won't be visible from EVM-based block explorers. Only transactions done via the Ethereum API are visible through such explorers.


The main difference between these two types of assets is that local XC-20s are EVM ERC-20s that have XCM-capabilities, while external XC-20s are Substrate assets with an ERC-20 interface on top.

Cross-chain transfers of XC-20s are done using the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}. To learn how to use the X-Tokens Pallet to transfer XC-20s, you can refer to the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guide. 

## Register Local XC-20s on Other Parachains {: #register-local-xc20 }

In order to enable cross-chain transfers of Moonbeam local XC-20s (XCM-enabled ERC-20s) between your chain and Moonbeam, you'll need to register the asset(s). To do so, you'll need the multilocation of each asset. The multilocation will include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

**Local XC-20s that are registered on other parachain must comply with the standard ERC-20 interface as described in the [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}.**

Currently, the support for local XC-20s is only on Moonbase Alpha. You can use the following multilocation to register a local XC-20:

=== "Moonbase Alpha"

    ```js
    {
      'parents': 1,
      'interior': {
        'X3': [
          { 
            'Parachain': 1000
          },
          {
            'PalletInstance': 48
          },
          {
            'AccountKey20': {
              'key': 'ERC20_ADDRESS_GOES_HERE'
            }
          }
        ]
      }
    }
    ```

There are additional steps aside from register assets that will need to be taken to enable a cross-chain integration with Moonbeam. For more information, please refer to the [Establishing an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-integration){target=_blank} guide.

## Current List of External XC-20s {: #current-xc20-assets }

External XC-20s are registeredThe current list of available external XC-20 assets per network is as follows:

=== "Moonbeam"
    |  Origin   | Symbol |                                                           XC-20 Address                                                           |
    |:---------:|:------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    | Polkadot  | xcDOT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |   Acala   | xcaUSD | [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=_blank} |
    |   Acala   | xcACA  | [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=_blank} |
    |   Astar   | xcASTR | [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=_blank} |
    |  Bifrost  | xcBNC  | [0xffffffff7cc06abdf7201b350a1265c62c8601d2](https://moonscan.io/token/0xffffffff7cc06abdf7201b350a1265c62c8601d2){target=_blank} |
    | Darwinia  | xcRING | [0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f](https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f){target=_blank} |
    | Interlay  | xcIBTC | [0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52](https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52){target=_blank} |
    | Interlay  | xcINTR | [0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab](https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab){target=_blank} |
    | Parallel  | xcPARA | [0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947](https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947){target=_blank} |
    |   Phala   | xcPHA  | [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=_blank} |
    | Statemint | xcUSDT | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

=== "Moonriver"
    |    Origin    | Symbol |                                                                XC-20 Address                                                                |
    |:------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Kusama    | xcKSM  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank} |
    |   Bifrost    | xcBNC  | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/token/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=_blank} |
    |   Calamari   | xcKMA  | [0xffffffffA083189F870640B141AE1E882C2B5BAD](https://moonriver.moonscan.io/token/0xffffffffA083189F870640B141AE1E882C2B5BAD){target=_blank} |
    |     Crab     | xcCRAB | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonriver.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    | Crust-Shadow | xcCSM  | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonriver.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |    Heiko     | xcHKO  | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonriver.moonscan.io/token/0xffffffFF394054BCDa1902B6A6436840435655a3){target=_blank} |
    |  Integritee  | xcTEER | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonriver.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |    Karura    | xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/token/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |    Karura    | xcaUSD | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/token/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    |    Khala     | xcPHA  | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonriver.moonscan.io/token/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=_blank} |
    |   Kintsugi   | xcKINT | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/token/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=_blank} |
    |   Kintsugi   | xckBTC | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=_blank} |
    |    Litmus    | xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |  Robonomics  | xcXRT  | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=_blank} |
    |    Shiden    | xcSDN  | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=_blank} |
    |  Statemine   | xcRMRK | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=_blank} |
    |  Statemine   | xcUSDT | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

    _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

=== "Moonbase Alpha"
    |        Origin         |  Symbol  |                                                               XC-20 Address                                                                |
    |:---------------------:|:--------:|:------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet  |  xcUNIT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |   Basilisk Alphanet   |  xcBSX   | [0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA](https://moonbase.moonscan.io/token/0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA){target=_blank} |
    |    Clover Alphanet    |  xcCLV   | [0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA](https://moonbase.moonscan.io/token/0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA){target=_blank} |
    | Crust/Shadow Alphanet |  xcCSM   | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonbase.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |  Integritee Alphanet  |  xcTEER  | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonbase.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |   Kintsugi Alphanet   |  xckBTC  | [0xFffFfFff5C2Ec77818D0863088929C1106635d26](https://moonbase.moonscan.io/token/0xFffFfFff5C2Ec77818D0863088929C1106635d26){target=_blank} |
    |   Kintsugi Alphanet   |  xcKINT  | [0xFFFfffff27C019790DFBEE7cB70F5996671B2882](https://moonbase.moonscan.io/token/0xFFFfffff27C019790DFBEE7cB70F5996671B2882){target=_blank} |
    |   Litentry Alphanet   |  xcLIT   | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonbase.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |   Pangolin Alphanet   | xcPARING | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonbase.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    |  Statemine Alphanet   |  xcTT1   | [0xfFffFfFf75976211C786fe4d73d2477e222786Ac](https://moonbase.moonscan.io/token/0xfFffFfFf75976211C786fe4d73d2477e222786Ac){target=_blank} |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

### Retrieve List of External XC-20s {: #list-xchain-assets }

To fetch a list of the currently available external XC-20s along with their associated metadata, you can query the chain state using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}. You'll take the following steps:

1. Create an API provider for the network you'd like to get the list of assets for. You can use the following WSS endpoints for each network:
    
    === "Moonbeam"
        ```
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"
        ```
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"
        ```
        {{ networks.moonbase.wss_url }}
        ```

2. Query the `assets` pallet for all assets
3. Iterate over the list of assets to get all of the asset IDs along with their associated metadata

```js
--8<-- 'code/xc20/retrieve-xc20s.js'
```

The result will display the asset ID along with some additional information for all of the registered external XC-20s. 


## XC-20s Solidity Interface

Both types of XC-20s have the standard ERC-20 interface. In addition, all external XC-20s also possess the ERC-20 Permit interface. The following two sections describe each of the interfaces separately.

### The ERC-20 Solidity Interface {: #the-erc20-interface }

As mentioned, you can interact with XC-20s via an ERC-20 interface. The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=_blank}, which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/erc20-interface/erc20-interface.md'

### The ERC-20 Permit Solidity Interface {: #the-erc20-permit-interface }

External XC-20s also have the ERC-20 Permit interface. The [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface on Moonbeam follows the [EIP-2612 standard](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}, which extends the ERC-20 interface with the `permit` function. Permits are signed messages that can be used to change an account's ERC-20 allowance. Note that local XC-20s can have also the Permit interface, but it is not a requirement for them to be XCM-ready.

The standard ERC-20 `approve` function is limited in its design as the `allowance` can only be modified by the sender of the transaction, the `msg.sender`. This can be seen in [OpenZeppelin's implementation of the ERC-20 interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}, which sets the `owner` through the [`msgSender` function](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}, which ultimately sets it to `msg.sender`.

Instead of signing the `approve` transaction, a user can sign a message, and that signature can be used to call the `permit` function to modify the `allowance`.  As such, it allows for gas-less token transfers. In addition, users no longer need to send two transactions to approve and transfer tokens. To see an example of the `permit` function, you can check out [OpenZeppelin's implementation of the ERC-20 Permit extension](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}.

The [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface includes the following functions:

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - consumes an approval permit, which can be called by anyone
- **nonces**(*address* owner) - returns the current nonce for the given owner
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator, which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} implementation

The **DOMAIN_SEPARATOR()** is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712){target=_blank}, and is calculated as:

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

The parameters of the hash can be broken down as follows:

 - **PERMIT_DOMAIN** - is the `keccak256` of `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`
 - **name** - is the token name but with the following considerations:
     - If the token has a name defined, the **name** for the domain is `XC20: <name>`, where `<name>` is the token name
     - If the token has no name defined, the **name** for the domain is `XC20: No name`
 - **version** - is the version of the signing domain. For this case, **version** is set to `1`
 - **chainId** - is the chain ID of the network
 - **verifyingContract** - is the XC-20 address

!!! note
    Prior to runtime upgrade 1600, the **name** field did not follow the standard [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} implementation.

The calculation of the domain separator can be seen in [Moonbeam's EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}.

Aside from the domain separator, the [`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank} guarantees that the signature can only be used for the `permit` function with the given function arguments. It uses a given nonce to ensure the signature is not subject to a replay attack. The calculation of the hash struct can be seen in [Moonbeam's EIP-2612](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}.

The domain separator and the hash struct can be used to build the [final hash](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank} of the fully encoded message. A practical example is shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank}.

With the final hash and the `v`, `r`, and `s` values, the signature can be [verified and recovered](https://github.com/PureStake/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224){target=_blank}. If successfully verified, the nonce will increase by one and the allowance will be updated.

## Interact with External XC-20s Using an ERC-20 Interface {: #interact-with-the-precompile-using-remix } 

This section of the guide will show you how to interact with XC-20s via the ERC-20 interface using [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}. Because local XC-20s are representation of regular ERC-20s, this section is focused on external XC-20s.

To interact with external XC-20s, you'll need to first calculate the precompile address of the XC-20 asset you want to interact with. Then, you can interact with the ERC-20 interface as you would with any other ERC-20.

You can adapt the instructions in this section to be used with the [Permit.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface.

### Checking Prerequisites {: #checking-prerequisites } 

To approve a spend or transfer external XC-20s via the ERC-20 interface, you will need:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- Create or have two accounts on Moonbase Alpha
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

### Calculate External XC-20 Precompile Addresses {: #calculate-xc20-address }

Before you can interact with an external XC-20 via the ERC-20 interface, you need to derive the external XC-20's precompile address from the asset ID.

The external XC-20 precompile address is calculated using the following:

```
address = '0xFFFFFFFF...' + DecimalToHex(AssetId)
```

Given the above calculation, the first step is to take the *u128* representation of the asset ID and convert it to a hex value. You can use your search engine of choice to look up a simple tool for converting decimals to hex values. For asset ID `42259045809535163221576417993425387648`, the hex value is `1FCACBD218EDC0EBA20FC2308C778080`.

External XC-20 precompiles can only fall between `0xFFFFFFFF00000000000000000000000000000000` and `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`.

Since Ethereum addresses are 40 characters long, you will need to start with the initial eight `F`s and then prepend `0`s to the hex value until the address has 40 characters. 

The hex value that was already calculated is 32 characters long, so prepending eight `F`s to the hex value will give you the 40-character address you need to interact with the XC-20 precompile. For this example, the full address is `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`.

Now that you've calculated the external XC-20 precompile address, you can use the address to interact with the XC-20 like you would with any other ERC-20 in Remix.

### Add & Compile the Interface {: #add-the-interface-to-remix } 

You can interact with the ERC-20 interface using [Remix](https://remix.ethereum.org/){target=_blank}. First, you will need to add the interface to Remix:

1. Get a copy of [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} 
2. Paste the file contents into a Remix file named **IERC20.sol**

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/overview/overview-1.png)

Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IERC20.sol** file

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/overview/overview-2.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile {: #access-the-precompile } 

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note that the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **IERC20 - IERC20.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead, you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the XC-20. For local XC-20s, which you should have already calculated in the  [Calculate External XC-20 Precompile Addresses](#calculate-xc20-address){target=_blank} section. For this example, you can use `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080` and click **At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/overview/overview-3.png)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead. 

The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20. 

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/overview/overview-4.png)

To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](/builders/pallets-precompiles/precompiles/erc20/){target=_blank} guide and modify it for interacting with the XC-20 Precompile.