The domain separator is defined in the [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712){target=_blank} and is calculated as:

```text
keccak256(PERMIT_DOMAIN, name, version, chain_id, address)
```

The parameters of the hash can be broken down as follows:

 - **PERMIT_DOMAIN** - is the `keccak256` of `EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)`
 - **name** - is the name of the signing domain and must be `'Call Permit Precompile'` exactly
 - **version** - is the version of the signing domain. For this case **version** is set to `1`
 - **chainId** - is the chain ID of the network
 - **verifyingContract** - is the address of the contract that will verify the signature. In this case, the Call Permit Precompile address