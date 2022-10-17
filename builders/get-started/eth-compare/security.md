---
title: Security Considerations
description: A description of the main differences that Ethereum developers need to understand in terms of security considerations when developing on Moonbeam.
---

# Security Considerations

![Moonbeam v Ethereum - Security Banner](/images/builders/get-started/eth-compare/security-banner.png)

## Introduction {: #introduction }

When developing smart contracts on Moonbeam, there are some security considerations to be aware of that do not apply when developing on Ethereum. Moonbeam has several [precompiled contracts](/builders/pallets-precompiles/precompiles/){target=_blank}, which are Solidity interfaces that enable developers to access Substrate-based functionality through the Ethereum API. Although the precompiled contracts are designed to improve the developer experience, there can be some unintended consequences that must be considered.

This guide will outline and provide examples of some security considerations to be cognizant of when developing on Moonbeam.

## Arbitrary Code Execution {: #arbitrary-code-execution }

Smart contracts can allow arbitrary code exeuction through low-level message passing to other smart contracts via the [`call()` function](https://solidity-by-example.org/call/){target=_blank}, which is an available method for the [address data type in Solidity](https://docs.soliditylang.org/en/latest/types.html#address){target=_blank}.

The `call()` function accepts ABI encoded call data that is then passed to the target contract. To get the encoded call data, you can use any of the [ABI encoding functions outlined in the Solidity docs](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#abi-encoding-and-decoding-functions){target=_blank}, including `abi.encodeWithSelector` which will be used in the examples in this guide. 

As previously mentioned, one major concern of allowing low-level calls to arbitrarily execute code on Moonbeam is that Moonbeam has precompile contracts that can be called, which can be used to get around some protections that are typically available on Ethereum. To safely use arbitrary code execution on Moonbeam, you should consider the following, which **only applies to contracts that allow arbitrary code execution**:

- Moonbeam [precompiled contracts](builders/pallets-precompiles/precompiles/){target=_blank} such as the Native ERC-20 precompile, XC-20 precompiles, and XCM-related precompiles allow users to manage and transfer assets without requiring access to the EVM. Instead, these actions are done using the Substrate API. So, if your contract holds native tokens or XC-20s and allows arbitrary code execution, these precompiles can be used to drain the balance of the contract
- Setting a value of `0` when using the `call()` function (for example, `call{value: 0}(...)`) can be overridden by calling the native asset precompile and specifying an amount to transfer in the encoded call data
- Providing the function selector for the function that you want to allow to be executed is considered safe, assuming that the function call is safe and does not call precompiles
- Blacklisting contracts that can execute arbitrary call data is not considered safe, as other precompiles might be added in the future. Providing whitelisted contracts that can execute the arbitrary call data is considered safe, assuming that the contracts being called are not precompiles, or that in the case they are, the contract making the call does not hold the native token or any XC-20

In the following sections, you'll learn about each of these security considerations through examples.

### Precompiles Can Override a Set Value {: #setting-a-value }

On Ethereum, a smart contract that allows for arbitrary code execution could force the value of a call to be `0`, guaranteeing that no amount of native currency would be sent with the transaction. Whereas on Moonbeam, setting the value of an arbitrary call to `0` can be overridden by calling the native ERC-20 precompile contract and transferring the native asset through the Substrate API. Since ERC-20s and XC-20s are not native assets, setting a value to `0` doesn't provide any protection for these types of assets on Ethereum or Moonbeam.

For example, if you have a contract that allows arbitrary code execution and you pass it encoded call data that transfers the balance of a contract to another address, you could essentially drain the given contract of it's balance.

To get the encoded call data, you could use a function like the following:

```
function getBytes(address _contract, address _to) public view returns (bytes memory) {
    // Load ERC-20 interface of contract
    IERC20 erc20 = IERC20(_contract);
    // Get amount to transfer
    uint256 amount = erc20.balanceOf(address(this));
    // Build the encoded call data
    return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
}
```

Once you have the encoded call data, you could make an arbitrary call to the native ERC-20 precompile contract, set the value of the call to `0`, and pass in the call data in bytes:

```
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Value: 0 does not protect against native ERC-20 precompile calls or XCM precompiles
    (bool success,) = _target.call{value: 0}(_bytes);
    require(success);
}
```

The value of `0` will be overridden by the amount to be transferred as specified in the encoded call data, which in this example is the balance of the contract.

### Whitelisting Safe Function Selectors {: #whitelisting-function-selectors }

By whitelisting a specific function selector, you can control what functions can be executed and ensure only functions that are considered safe and do not call precompiles are allowed to be called. 

To get the function selector to whitelist, you can [keccack256 hash](https://emn178.github.io/online-tools/keccak_256.html){target=_blank} the signature of the function.

Once you have the whitelisted function selector, you can use inline assembly to get the function selector from the encoded call data and compare the two selectors using the [require function](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}. If the function selector from the encoded call data matches the whitelisted function selector, you can make the call. Otherwise, an exception will be thrown.

```
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Get the function selector from the encoded call data
    bytes4 selector;
    assembly {
        selector := calldataload(_bytes.offset)
    }

    // Ensure the call data calls an approved and safe function
    require(selector == INSERT-WHITELISTED-FUNCTION-SELECTOR);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

### Whitelisting Safe Contracts {: #whitelisting-safe-contracts}

By whitelisting a specific contract address that can execute arbitrary call data, it ensures that the call is considered safe, assuming that the contracts being called are not precompiles. If they are precompiles, you'll want to make sure that the contract making the call does not hold the native token or any XC-20. 

Blacklisting contracts from arbitrary code execution is not considered safe, as other precompiles might be added in the future.

To whitelist a given contract, you can use the [require function](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=_blank}, which will compare the target contract address to the whitelisted contract address. If the addresses match, the call can be executed. Otherwise, an exception will be thrown.

```
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Ensure the contract address is safe
    require(_target == INSERT-CONTRACT-ADDRESS);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```