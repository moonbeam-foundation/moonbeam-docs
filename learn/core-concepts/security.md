---
title: Security Considerations
description: A description of the main differences that Ethereum developers need to understand in terms of security considerations when developing on Moonbeam.
---

# Security Considerations

## Introduction {: #introduction }

When developing smart contracts on Moonbeam, there are some security considerations to be aware of that do not apply when developing on Ethereum. Moonbeam has several [precompiled contracts](/builders/ethereum/precompiles/){target=\_blank}, which are Solidity interfaces that enable developers to access Substrate-based functionality through the Ethereum API, but circumventing the EVM. Although the precompiled contracts are designed to improve the developer experience, there can be some unintended consequences that must be considered.

This guide will outline and provide examples of some security considerations to be cognizant of when developing on Moonbeam.

## Arbitrary Code Execution {: #arbitrary-code-execution }

Arbitrary code execution in Solidity is the ability to execute code and call functions of other contracts using an arbitrary number of arguments of any type.

A smart contract allows arbitrary execution of another contract when it allows a user to influence its own `call()` and pass in arbitrary call data and/or the `call()`s target. The [`call()` function](https://solidity-by-example.org/call){target=\_blank} is made available through the [address data type in Solidity](https://docs.soliditylang.org/en/latest/types.html#address){target=\_blank}. When the `call()` function is invoked, the target contract is called using the arbitrary call data.

Arbitrary code execution follows the pattern in the diagram below when **Contract A** allows a user to influence its call to **Contract B**.

![Arbitrary code execution](/images/learn/core-concepts/security/security-1.webp)

As previously mentioned, one major concern of arbitrarily executing code on Moonbeam is that Moonbeam has precompile contracts that can be called, which can be used to get around some protections that are typically available on Ethereum. To safely use arbitrary code execution on Moonbeam, you should consider the following, which **only applies to contracts that allow arbitrary code execution**:

- Moonbeam [precompiled contracts](/builders/ethereum/precompiles/){target=\_blank} such as the Native ERC-20 precompile, XC-20 precompiles, and XCM-related precompiles allow users to manage and transfer assets without requiring access to the EVM. Instead, these actions are done using native Substrate code. So, if your contract holds native tokens or XC-20s and allows arbitrary code execution, these precompiles can be used to drain the balance of the contract, bypassing any security checks that are normally enforced by the EVM
- Setting the value attribute of the transaction object to a fixed amount when using the `call()` function (for example, `call{value: 0}(...)`) can be bypassed by calling the native asset precompile and specifying an amount to transfer in the encoded call data
- Allowing users that consume your contract to pass in arbitrary call data that will execute any function on the target contract, especially if the contract being targeted is a precompile, is **not** safe. To be safe, you can hard code the function selector for a safe function that you want to allow to be executed
- Blacklisting target contracts (including precompiles) in the function that executes arbitrary call data is **not** considered safe, as other precompiles might be added in the future. Providing whitelisted target contracts in the function that executes the arbitrary call data is considered safe, assuming that the contracts being called are not precompiles, or that in the case they are, the contract making the call does not hold the native token or any XC-20

In the following sections, you'll learn about each of these security considerations through examples.

### Precompiles Can Override a Set Value {: #setting-a-value }

On Ethereum, a smart contract that allows for arbitrary code execution could force the value of a call to be a specific amount (for example, `{value: 0}`), guaranteeing that only that amount of native currency would be sent with the transaction. Whereas on Moonbeam, the [native ERC-20 precompile contract](/builders/ethereum/precompiles/ux/erc20/){target=\_blank} enables you to interact with the native currency on Moonbeam as an ERC-20 through the Substrate API. As a result, you can transfer the Moonbeam native asset from a smart contract by setting the `value` of a call, as well as through the native ERC-20 precompile. If you set the `value` of an arbitrary call, it can be overridden by targeting the [native ERC-20 precompile contract](/builders/ethereum/precompiles/ux/erc20/){target=\_blank} and passing in call data to transfer the native asset. Since ERC-20s and XC-20s are not native assets, setting the value attribute doesn't provide any protection for these types of assets on Ethereum or Moonbeam.

For example, if you have a contract that allows arbitrary code execution and you pass it encoded call data that transfers the balance of a contract to another address, you could essentially drain the given contract of it's balance.

To get the encoded call data, you can use any of the [ABI encoding functions outlined in the Solidity docs](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#abi-encoding-and-decoding-functions){target=\_blank}, including `abi.encodeWithSelector` as seen in the following function:

```solidity
function getBytes(address _erc20Contract, address _arbitraryCallContract, address _to) public view returns (bytes memory) {
    // Load ERC-20 interface of contract
    IERC20 erc20 = IERC20(_erc20Contract);
    // Get amount to transfer
    uint256 amount = erc20.balanceOf(_arbitraryCallContract);
    // Build the encoded call data
    return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
}
```

Once you have the encoded call data, you could make an arbitrary call to the [native ERC-20 precompile contract](/builders/ethereum/precompiles/ux/erc20/){target=\_blank}, set the value of the call to `0`, and pass in the call data in bytes:

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Value: 0 does not protect against native ERC-20 precompile calls or XCM precompiles
    (bool success,) = _target.call{value: 0}(_bytes);
    require(success);
}
```

The value of `0` will be overridden by the amount to be transferred as specified in the encoded call data, which in this example is the balance of the contract.

### Whitelisting Safe Function Selectors {: #whitelisting-function-selectors }

By whitelisting a specific function selector, you can control what functions can be executed and ensure only functions that are considered safe and do not call precompiles are allowed to be called.

To get the function selector to whitelist, you can [keccack256 hash](https://emn178.github.io/online-tools/keccak_256.html){target=\_blank} the signature of the function.

Once you have the whitelisted function selector, you can use inline assembly to get the function selector from the encoded call data and compare the two selectors using the [require function](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=\_blank}. If the function selector from the encoded call data matches the whitelisted function selector, you can make the call. Otherwise, an exception will be thrown.

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Get the function selector from the encoded call data
    bytes4 selector;
    assembly {
        selector := calldataload(_bytes.offset)
    }

    // Ensure the call data calls an approved and safe function
    require(selector == INSERT_WHITELISTED_FUNCTION_SELECTOR);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

### Whitelisting Safe Contracts {: #whitelisting-safe-contracts}

By whitelisting a specific target contract address in the function that can execute arbitrary call data, you can ensure that the call is considered safe, as the EVM will enforce that only whitelisted contracts can be called. This assumes that the contracts being called are not precompiles. If they are precompiles, you'll want to make sure that the contract making the call does not hold the native token or any XC-20.

Blacklisting contracts from arbitrary code execution is not considered safe, as other precompiles might be added in the future.

To whitelist a given contract, you can use the [require function](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=\_blank}, which will compare the target contract address to the whitelisted contract address. If the addresses match, the call can be executed. Otherwise, an exception will be thrown.

```solidity
function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Ensure the contract address is safe
    require(_target == INSERT_CONTRACT_ADDRESS);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
```

## Precompiles Can Bypass Sender vs Origin Checks {: #bypass-sender-origin-checks }

The transaction origin, or `tx.origin`, is the address of the externally owned account (EOA) the transaction originated from. Whereas the `msg.sender` is the address that has initiated the current call. The `msg.sender` can be an EOA or a contract. The two can be different values if one contract calls another contract, as opposed to directly calling a contract from an EOA. In this case, the `msg.sender` will be the calling contract and the `tx.origin` will be the EOA that initially called the calling contract.

For example, if Alice calls a function in contract A that then calls a function in contract B, when looking at the call to contract B, the `tx.origin` is Alice and the `msg.sender` is contract A.

!!! note
    As a [best practice](https://consensysdiligence.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/tx-origin/){target=\_blank}, `tx.origin` should not be used for authorization. Instead, you should use `msg.sender`.

You can use the [require function](https://docs.soliditylang.org/en/v0.8.17/control-structures.html#panic-via-assert-and-error-via-require){target=\_blank} to compare the `tx.origin` and `msg.sender`. If they are the same address, you're ensuring that only EOAs can call the function. If the `msg.sender` is a contract address, an exception will be thrown.

```solidity
function transferFunds(address payable _target) payable public {
    require(tx.origin == msg.sender);
    _target.call{value: msg.value};
}
```

On Ethereum, you can use this check to ensure that a given contract function can only be called once by an EOA. This is because on Ethereum, EOAs can only interact with a contract once per transaction. However, **this is not the case** on Moonbeam, as EOAs can interact with a contract multiple times at once by using precompiled contracts, such as the [batch](/builders/ethereum/precompiles/ux/batch/){target=\_blank} and [call permit](/builders/ethereum/precompiles/ux/call-permit/){target=\_blank} precompiles.

With the batch precompile, users can perform multiple calls to a contract atomically. The caller of the batch function will be the `msg.sender` and `tx.origin`, enabling multiple contract interactions at once.

With the call permit precompile, if a user wants to interact with a contract multiple times in one transaction, they can do so by signing a permit for each contract interaction and dispatching all of the permits in a single function call. This will only bypass the `tx.origin == msg.sender` check if the dispatcher is the same account as the permit signer. Otherwise, the `msg.sender` will be the permit signer and the `tx.origin` will be the dispatcher, causing an exception to be thrown.
