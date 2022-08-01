The **DOMAIN_SEPARATOR()** is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712){target=_blank}, and is calculated as:

```
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

The parameters of the hash can be broken down as follows:

 - **PERMIT_DOMAIN** - is the `keccak256` of `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`
 - **name** - is the token name but with the following considerations:
     - If the token has a name defined, the **name** for the domain is `XC20: <name>`, where `<name>` is the token name
     - If the token has no name defined, the **name** for the domain is `XC20: No name`
 - **version** - is the version of the signing domain. For this case **version** is set to `1`
 - **chainId** - is the chain ID of the network
 - **verifyingContract** - is the XC-20 address

!!! note
    Prior to runtime upgrade 1600, the **name** field does not follow the standard [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612#specification){target=_blank} implementation.