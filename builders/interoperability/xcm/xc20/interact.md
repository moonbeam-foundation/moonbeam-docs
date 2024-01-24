---
title: Interact with XC-20s
description: Check out the XC-20 Solidity interfaces, including the ERC-20 and ERC-20 Permit interfaces, and how to interact with external XC-20s using these interfaces.
---

# Interact with XC-20s on Moonbeam

## Introduction {: #introduction }

As mentioned in the [XC-20s Overview](/builders/interoperability/xcm/xc20/overview){target=_blank} page, XC-20s are a unique asset class on Moonbeam. Although they are Substrate-native assets, they also have an ERC-20 interface and can be interacted with like any other ERC-20. Additionally, the ERC-20 Permit interface is available for all external XC-20s.

This guide covers the XC-20 Solidity interfaces, including the standard ERC-20 interface and the ERC-20 Permit interface, and how to interact with external XC-20s using these interfaces.

## XC-20s Solidity Interface {: #xc20s-solidity-interface }

Both types of XC-20s have the standard ERC-20 interface. In addition, all external XC-20s also possess the ERC-20 Permit interface. The following two sections describe each of the interfaces separately.

### The ERC-20 Solidity Interface {: #the-erc20-interface }

As mentioned, you can interact with XC-20s via an ERC-20 interface. The [ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=_blank}, which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/builders/pallets-precompiles/precompiles/erc20/erc20-interface.md'

### The ERC-20 Permit Solidity Interface {: #the-erc20-permit-interface }

External XC-20s also have the ERC-20 Permit interface. The [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface on Moonbeam follows the [EIP-2612 standard](https://eips.ethereum.org/EIPS/eip-2612){target=_blank}, which extends the ERC-20 interface with the `permit` function. Permits are signed messages that can be used to change an account's ERC-20 allowance. Note that local XC-20s can have also the Permit interface, but it is not a requirement for them to be XCM-ready.

The standard ERC-20 `approve` function is limited in its design as the `allowance` can only be modified by the sender of the transaction, the `msg.sender`. This can be seen in [OpenZeppelin's implementation of the ERC-20 interface](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L136){target=_blank}, which sets the `owner` through the [`msgSender` function](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol#L17){target=_blank}, which ultimately sets it to `msg.sender`.

Instead of signing the `approve` transaction, a user can sign a message, and that signature can be used to call the `permit` function to modify the `allowance`.  As such, it allows for gas-less token transfers. In addition, users no longer need to send two transactions to approve and transfer tokens. To see an example of the `permit` function, you can check out [OpenZeppelin's implementation of the ERC-20 Permit extension](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L41){target=_blank}.

The [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface includes the following functions:

- **permit**(*address* owner, *address* spender, *uint256*, value, *uint256*, deadline, *uint8* v, *bytes32* r, *bytes32* s) - consumes an approval permit, which can be called by anyone
- **nonces**(*address* owner) - returns the current nonce for the given owner
- **DOMAIN_SEPARATOR**() - returns the EIP-712 domain separator, which is used to avoid replay attacks. It follows the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} implementation

The **DOMAIN_SEPARATOR()** is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712){target=_blank}, and is calculated as:

```text
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

The calculation of the domain separator can be seen in [Moonbeam's EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L130-L154){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L70-L84){target=_blank}.

Aside from the domain separator, the [`hashStruct`](https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct){target=_blank} guarantees that the signature can only be used for the `permit` function with the given function arguments. It uses a given nonce to ensure the signature is not subject to a replay attack. The calculation of the hash struct can be seen in [Moonbeam's EIP-2612](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L167-L175){target=_blank} implementation, with a practical example shown in [OpenZeppelin's `ERC20Permit` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L52){target=_blank}.

The domain separator and the hash struct can be used to build the [final hash](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L177-L181){target=_blank} of the fully encoded message. A practical example is shown in [OpenZeppelin's `EIP712` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/4a9cc8b4918ef3736229a5cc5a310bdc17bf759f/contracts/utils/cryptography/draft-EIP712.sol#L101){target=_blank}.

With the final hash and the `v`, `r`, and `s` values, the signature can be [verified and recovered](https://github.com/moonbeam-foundation/moonbeam/blob/perm-runtime-1502/precompiles/assets-erc20/src/eip2612.rs#L212-L224){target=_blank}. If successfully verified, the nonce will increase by one and the allowance will be updated.

## Interact with External XC-20s Using an ERC-20 Interface {: #interact-with-the-precompile-using-remix }

This section of the guide will show you how to interact with XC-20s via the ERC-20 interface using [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}. Because local XC-20s are representations of regular ERC-20s, this section is focused on external XC-20s.

To interact with external XC-20s, you'll need to first calculate the precompile address of the XC-20 asset you want to interact with. Then, you can interact with the ERC-20 interface as you would with any other ERC-20.

You can adapt the instructions in this section to be used with the [Permit.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/Permit.sol){target=_blank} interface.

### Checking Prerequisites {: #checking-prerequisites }

To approve a spend or transfer external XC-20s via the ERC-20 interface, you will need:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- Create or have two accounts on Moonbase Alpha
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Calculate External XC-20 Precompile Addresses {: #calculate-xc20-address }

Before you can interact with an external XC-20 via the ERC-20 interface, you need to derive the external XC-20's precompile address from the asset ID.

The external XC-20 precompile address is calculated using the following:

```text
address = '0xFFFFFFFF...' + DecimalToHex(AssetId)
```

Given the above calculation, the first step is to take the *u128* representation of the asset ID and convert it to a hex value. You can use your search engine of choice to look up a simple tool for converting decimals to hex values. For asset ID `42259045809535163221576417993425387648`, the hex value is `1FCACBD218EDC0EBA20FC2308C778080`.

External XC-20 precompiles can only fall between `0xFFFFFFFF00000000000000000000000000000000` and `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`.

Since Ethereum addresses are 40 characters long, you will need to start with the initial eight `F`s and then prepend `0`s to the hex value until the address has 40 characters.

The hex value that was already calculated is 32 characters long, so prepending eight `F`s to the hex value will give you the 40-character address you need to interact with the XC-20 precompile. For this example, the full address is `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`.

Now that you've calculated the external XC-20 precompile address, you can use the address to interact with the XC-20 like you would with any other ERC-20 in Remix.

### Add & Compile the Interface {: #add-the-interface-to-remix }

You can interact with the ERC-20 interface using [Remix](https://remix.ethereum.org/){target=_blank}. First, you will need to add the interface to Remix:

1. Get a copy of [ERC20.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank}
2. Paste the file contents into a Remix file named **IERC20.sol**

![Load the interface in Remix](/images/builders/interoperability/xcm/xc20/interact/interact-1.webp)

Once you have the ERC-20 interface loaded in Remix, you will need to compile it:

1. Click on the **Compile** tab, second from top
2. Compile the **IERC20.sol** file

![Compiling IERC20.sol](/images/builders/interoperability/xcm/xc20/interact/interact-2.webp)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile {: #access-the-precompile }

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the XC-20:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note that the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **IERC20 - IERC20.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead, you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the XC-20. For local XC-20s, which you should have already calculated in the  [Calculate External XC-20 Precompile Addresses](#calculate-xc20-address){target=_blank} section. For this example, you can use `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080` and click **At Address**

![Access the address](/images/builders/interoperability/xcm/xc20/interact/interact-3.webp)

!!! note
    Optionally, you can checksum the XC-20 precompile address by going to your search engine of choice and searching for a tool to checksum the address. Once the address has been checksummed, you can use it in the **At Address** field instead.

The **IERC20** precompile for the XC-20 will appear in the list of **Deployed Contracts**. Now you can feel free to call any of the standard ERC-20 functions to get information about the XC-20 or transfer the XC-20.

![Interact with the precompile functions](/images/builders/interoperability/xcm/xc20/interact/interact-4.webp)

To learn how to interact with each of the functions, you can check out the [ERC-20 Precompile](/builders/pallets-precompiles/precompiles/erc20/){target=_blank} guide and modify it for interacting with the XC-20 Precompile.
