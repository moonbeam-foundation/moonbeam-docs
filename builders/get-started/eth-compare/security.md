---
title: Security Considerations
description: A description of the main differences that Ethereum developers need to understand in terms of security considerations when developing on Moonbeam.
---

# Security Considerations

![Moonbeam v Ethereum - Security Banner](/images/builders/get-started/eth-compare/security/security-banner.png)

## Introduction {: #introduction }

When developing smart contracts on Moonbeam, there are some security considerations to be aware of that do not apply when developing on Ethereum. Moonbeam has several [precompiled contracts](/builders/pallets-precompiles/precompiles/){target=_blank}, which are Solidity interfaces that enable developers to access Substrate-based functionality through the Ethereum API. Although the precompiled contracts are designed to improve the developer experience, there can be some unintended consequences that must be considered.

If a smart contract allows arbitrary code execution, the precompiled contracts can be called to access Substrate functionality and can circumvent some protections that are typically available when developing on Ethereum.

This guide will outline and provide examples of some security considerations to be cognizant of when developing on Moonbeam.

## Security Considerations {: #security-considerations }

Smart contracts can allow arbitrary code exeuction through low-level message passing to other smart contracts via the [`call()` function](https://solidity-by-example.org/call/){target=_blank}, which is an available method for the [address data type in Solidity](https://docs.soliditylang.org/en/latest/types.html#address){target=_blank}.

The `call()` function accepts ABI encoded call data that is then passed to the target contract. To get the encoded call data, you can use any of the [ABI encoding functions outlined in the Solidity docs](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#abi-encoding-and-decoding-functions){target=_blank}, including `abi.encodeWithSelector` which will be used in the examples in this guide. 

As previously mentioned, one major concern of allowing low-level calls to arbitrarily execute code on Moonbeam is that Moonbeam has precompile contracts that can be called, which can be used to get around some protections that are typically available on Ethereum. To safely use arbitrary code execution on Moonbeam, you should consider the following:

- Your contract should not hold native tokens or [XC-20s](/builders/xcm/xc20/overview/){target=_blank}. The [Native ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20/){target=_blank} can be used to transfer Moonbeam's native asset and drain the contract of any tokens it holds. Similarly, if your contract holds XC-20s, the precompile address for the XC-20 can be used to transfer the asset and drain the balance of the contract
- Setting a value of `0` when using the `call()` function can be overridden by calling the native asset or XC-20 precompile and specifying an amount to transfer in the encoded call data
- Providing the function selector for the function that you want to allow to be executed, assuming that the function call is considered safe and does not call precompiles
- Providing whitelisted contracts that can execute the arbitrary call data. The whitelisted contracts should not include precompiles

In the following sections, you'll learn about each of these security considerations through examples.

## Checking Prerequisites {: #checking-prerequisites } 

To follow along with the examples in this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- Have an account funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

## Use Precompiles to Exploit Contracts {: #use-precompiles-to-exploit-contracts }

Assets can be drained from contracts that allow arbitrary code execution by using precompiled contracts to make transfers. Similarly, the precompiled contracts can override values set when making an arbitrary code execution call. As a result, smart contracts should not hold native tokens or XC-20s and you should not rely on setting the value of the call to `0`.

To get a better understanding of what exactly can happen, you'll learn firsthand by creating a contract with a balance and purposefully draining the contract using arbitrary code execution. In general you will deploy the example contract, send DEV tokens to it, then use the [native ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20){target=_blank} to drain the contract of it's balance. You can replicate this example with any XC-20 and their respective precompile address.

### Example Contract {: #example-contract }

The following is an example contract that contains three functions which will be used to receive assets and drain the contract:

- **getBytes**(*address* _to) - generates the ABI encoded call to transfer the contract's balance in bytes given an address to transfer the assets to
- **drainContract**(*address* _target, *bytes calldata* _bytes) - calls the given address, which will be the ERC-20 native precompile, using the low level `call` function and passing in the provided ABI encoded bytes retrieved from the `getBytes` function to drain the contract of it's balance
- **drainContractRegardlessOfValue**(*address* _target, *bytes calldata* _bytes) - has the same functionality as the `drainContract` function except this function explicitly sets the call value to `0` to show that values can be overridden by calling the precompile and setting the transfer amount in the encoded call data
- **receive**() - allows the contract to receive assets

```sol
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract DrainContract {
    address internal constant NATIVE_ADDRESS = {{ networks.moonbase.precompiles.erc20 }};
    IERC20 public erc20 = IERC20(NATIVE_ADDRESS);

    function getBytes(address _to) public view returns (bytes memory) {
        uint256 amount = erc20.balanceOf(address(this));
        return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
    }

    function drainContract(address _target, bytes calldata _bytes) public {
        // For the attack to work, you need to bump the estimated gas
        require(gasleft() > 500000);

        _target.call(_bytes);
    }

    function drainContractRegardlessOfValue(address _target, bytes calldata _bytes) public {
        // For the attack to work, you need to bump the estimated gas
        require(gasleft() > 500000);

        _target.call{value: 0}(_bytes);
    }

    receive() external payable {}
}
```

### Remix Set Up {: #remix-set-up }

To get started, head to [Remix](https://remix.ethereum.org/){target=_blank} and take the following steps:

1. Click on the **File explorer** tab
2. Copy and paste the [example contract](#example-contract) into a Remix file named `DrainContract.sol`

![Copying and Pasting the example contract into Remix](/images/builders/get-started/eth-compare/security/security-1.png)

Next, you'll need to compile the contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the contract, click on **Compile DrainContract.sol**

![Compiling DrainContract.sol](/images/builders/get-started/eth-compare/security/security-2.png)

Then take the following steps to deploy the contract on Moonbase Alpha:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down and that you're connected to Moonbase Alpha in MetaMask
3. Ensure **DrainContract - DrainContract.sol** is selected in the **CONTRACT** dropdown
4. Click **Deploy** and confirm the transaction in MetaMask

![Deploy the contract](/images/builders/get-started/eth-compare/security/security-3.png)

Once the transaction goes through, the `DrainContract.sol` contract will appear in the list of **Deployed Contracts**.

### Fund the Contract {: #fund-the-contract }

To fund the contract with some DEV tokens, you can take the following steps:

1. Enter in an amount to send in the **VALUE** field. For this example, you can send `100000000` Gwei, which is the equivalent to `.1` DEV
2. Expand the **DRAINCONTRACT** contract
3. Notice that the contract's starting balance is **0 ETH**
4. Scroll down to the **Low level interactions** section and click **Transact** and confirm the transaction in MetaMask

![Fund the contract](/images/builders/get-started/eth-compare/security/security-3.png)

Once the transaction goes through, the balance should update to **.1 ETH** (which is ultimately `.1` DEV on Moonbase Alpha).

### Drain the Contract {: #drain-the-contract }

Now that you have funded your contract, you can start the process to drain it. For this example, the ABI encoded call will include instructions to transfer the total balance of the contract to an address of your choice. First, you'll need to obtain the ABI encoded call data in bytes using the `getBytes` function:

1. Expand the **getBytes** function
2. For the **_to** field, enter an address where you would like to transfer the DEV tokens to. For simplicity, it can be the same account you used to fund the contract
3. Click on **call**
4. The results will appear just below the **call** button. You can copy the results as you'll need to pass them in as an argument to the **drainContract** function

![Get the bytes](/images/builders/get-started/eth-compare/security/security-3.png)

Now to drain the contract, you can take the following steps:

1. Expand the **drainContract** function
2. Enter the address of the Native ERC-20 precompile, which is `{{ networks.moonbase.precompiles.erc20 }}`
3. Paste the bytes returned from the **getBytes** function into the **_bytes** field
4. Click **transact** and confirm the transaction in MetaMask

![Call the drainContract function](/images/builders/get-started/eth-compare/security/security-3.png)

Once the transaction goes through, the contract will be drained of its balance and you should see **Balance: 0 ETH**.

### Drain the Contract Regardless of the Set Value {: #drain-the-contract-regardless }

In Ethereum, you would typically be able to set the value of the call to be `0` to avoid assets from being transferred. However, when calling the Moonbeam precompiles, you can set an amount to be transferred in the ABI encoded call data. To see how this could happen firsthand, you can use the `drainContractRegardlessOfValue` function of the example contract.

First, you'll need to fund your contract again. To do so, you can refer back to the instructions in the [Fund the Contract](#fund-the-contract) section. 

Next, you'll need to retrieve the ABI encoded call data in bytes. If you've funded the contract with the same amount as the previous example, `.1` DEV, you can also use the bytes returned from the previous example. Otherwise, you can call the **getBytes** function, passing in your address to transfer the DEV tokens to in the **_to** field.

Once your contract has a balance and you've retrieved the call data in bytes, you can take the following steps to see that the contract can still be drained of it's balance regardless if the value of the call is set to `0`:

1. Expand the **drainContractRegardlessOfValue** function
2. Enter the address of the Native ERC-20 precompile, which is `{{ networks.moonbase.precompiles.erc20 }}`
3. Paste the bytes returned from the **getBytes** function into the **_bytes** field
4. Click **transact** and confirm the transaction in MetaMask

![Call the drainContract function](/images/builders/get-started/eth-compare/security/security-3.png)

Once the transaction goes through, you'll notice that the value argument was overridden and the contract has been drained of its balance. You should see **Balance: 0 ETH**.

## Whitelist a Specific Function Selector {: #whitelist-specific-function-selector }

The example in this section will show you how to whitelist a specific function selector. By whitelisting a specific function, you can control what code can be executed by whitelisting functions that are  considered safe and do not call any of the precompiles. The important takeaway here is that you should only allow arbitrary execution of safe functions.

### Example Contracts {: #example-contracts }

The following is an example contract, `WhitelistFunctionSelector.sol`, that contains a `whitelistFunctionSelector` function which accepts the contract address to call and the bytes of the ABI encoded call data. The function uses inline assembly to retrieve the first four bytes of the call data, which corresponds to the function selector. You can take the function selector and make sure it corresponds to the function selector of the function that you consider safe and want to whitelist, if it matches you can make the call, otherwise an exception will be thrown.

```
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract WhitelistFunctionSelector {
    function whitelistFunctionSelector(address _target, bytes calldata _bytes) public {
        // For the attack to work, you need to bump the estimated gas
        require(gasleft() > 500000);
        bytes4 selector;
        assembly {
            selector := calldataload(_bytes.offset)
        }

        require(selector == INSERT-FUNCTION-SELECTOR);
        _target_.call(_bytes);
    }
}
```

You'll need to replace `INSERT-FUNCTION-SELECTOR` with the function selector of a safe function. For example purposes, you can test the functionality using the `SetMessage.sol` contract and the function selector of the `set` function:

```
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract SetMessage {
    string storedMessage;

    function set(string calldata x) public {
        storedMessage = x;
    }

    function get() public view returns (string memory) {
        return storedMessage;
    }
}
```

The function selector of the `set` function is `0x4ed3885e`, so you can replace `INSERT-FUNCTION-SELECTOR` in the `require` function of the `WhitelistFunctionSelector.sol` contract with the selector. You can calculate the function selector yourself by keccak256 hashing the signature of the function.

### Remix Set Up {: #remix-set-up }

To get started, head to [Remix](https://remix.ethereum.org/){target=_blank} and take the following steps:

1. Click on the **File explorer** tab
2. Copy and paste the [`WhitelistFunctionSelector` contract](#example-contract) into a Remix file named `WhitelistFunctionSelector.sol`
3. Copy and paste the [`SetMessage` contract](#example-contract) into a Remix file named `SetMessage.sol`

![Copying and Pasting the example contract into Remix](/images/builders/get-started/eth-compare/security/security-4.png)

Next, you'll need to compile and deploy each contract, one at a time. First, you can compile the `WhitelistFunctionSelector.sol` contract:

1. Click on the **Compile** tab, second from top
2. Then to compile the contract, click on **Compile WhitelistFunctionSelector.sol**

![Compiling WhitelistFunctionSelector.sol](/images/builders/get-started/eth-compare/security/security-5.png)

Then take the following steps to deploy the contract on Moonbase Alpha:

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down and that you're connected to Moonbase Alpha in MetaMask
3. Ensure **WhitelistFunctionSelector - WhitelistFunctionSelector.sol** is selected in the **CONTRACT** dropdown
4. Click **Deploy** and confirm the transaction in MetaMask

![Deploy the contract](/images/builders/get-started/eth-compare/security/security-6.png)

Once the transaction goes through, the `WhitelistFunctionSelector.sol` contract will appear in the list of **Deployed Contracts**.

You can repeat these steps to compile and deploy the `SetMessage.sol` contract.

### Execute the Whitelisted Function {: #execute-the-whitelisted-function }

Now that you have the example contracts deployed, you can verify that you can execute the whitelisted function only. To do so, you can take the following steps:

1. Copy the address of the **SETMESSAGE** contract
2. Expand the **WHITELISTFUNCTIONSELECTOR** contract
3. Expand the **whitelistFunctionSelector** function
4. Paste the address of the `SetMessage.sol` contract in the **_target** field
5. For the **_bytes** field, you can enter the following encoded call data which will set the message to `hello`: 
    ```
    0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000
    ```
6. Click on **transact** and confirm the transaction in MetaMask

![Execute the whitelisted function](/images/builders/get-started/eth-compare/security/security-7.png)

Once the transaction goes through, you can then verify that the message has been set to `hello` in the `SetMessage.sol` contract:

1. Expand the **SETMESSAGE** contract
2. Click on **get**
3. The response will appear right below the **get** button, which should be `hello`

![Verify the whitelisted function was executed](/images/builders/get-started/eth-compare/security/security-8.png)

To make sure that you cannot call any other function, you can repeat the previous steps to call the `whitelistFunctionSelector` function by taking the following steps:

1. Expand the **whitelistFunctionSelector** function
2. In the **_target** field, enter the contract address of the `SetMessage.sol` contract
3. In the **_bytes** field, you can enter any other ABI-encoded call data. For example, you can use the bytes from the previous example that called 
4. Click on **transact**

You'll see a **"VM Exeception while processing transaction: revert"** error message. If you attempt to send the transaction anyway, it will fail.

![Non-whitelisted function will fail](/images/builders/get-started/eth-compare/security/security-9.png)

## Whitelist a Specific Contract Address {: #whitelist-specific-contract }

The example in this section will show you how to whitelist a specific contract address. By whitelisting a specific contract address, you can ensure that the precompiles cannot be arbitrarily called. 

### Example Contract {: #example-contract }

For this example contract, you can whitelist the contract address for the `SetMessage.sol` contract used in the previous example. You can easily copy the contract address from Remix and replace `INSERT-CONTRACT-ADDRESS` with it in the following example contract, `WhitelistContract.sol`: 

```
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract WhitelistContract {
    function whitelistContract(address _target, bytes calldata _bytes) public {
        // For the attack to work, you need to bump the estimated gas
        require(gasleft() > 500000);

        require(_target == INSERT-CONTRACT-ADDRESS);
        _target_.call(_bytes);
    }
}
```

### Remix Set Up {: #remix-set-up }

First you'll need to create a new contract file in Remix named `WhitelistContract.sol` and paste the contents of the example contract in it. Then you can repeat the steps outlined in the previous [Remix Set Up](#remix-set-up--remix-set-up) sections to compile and deploy the contract on Moonbase Alpha.

### Execute Code Using the Whitelisted Contract {: #execute-code-using-whitelisted-contract }

Now that you have the example contracts deployed, you can verify that you can execute calls to the whitelisted contract only. To do so, you can take the following steps:

1. Copy the address of the **SETMESSAGE** contract
2. Expand the **WHITELISTCONTRACT** contract
3. Expand the **whitelistContract** function
4. Paste the address of the `SetMessage.sol` contract in the **_target** field
5. For the **_bytes** field, you can enter the following encoded call data which will reset the message to an empty string: 
    ```
    0x4ed3885e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000
    ```
6. Click on **transact** and confirm the transaction in MetaMask

![Verify the whitelisted contract can be called](/images/builders/get-started/eth-compare/security/security-10.png)

You can verify that the call was successfully executed by clicking on the **get** button under the **SETMESSAGE** contract, which should return an empty string as the result. 

To verify that another contract, such as the native ERC-20 precompile cannot be called, you can take the following steps:

1. Update the **_target** field of the **whitelistContract** function to be the native ERC-20 precompile address: `{{ networks.moonbase.precompiles.erc20 }}`
2. For the **_bytes** field, you can use the following ABI encoded call data to attempt to check the balance of the `WhitelistContract.sol` contract, replacing `<INSERT-CONTRACT-ADDRESS>` with the address of the `WhitelistContract.sol` contract: `0x70a08231000000000000000000000000<INSERT-CONTRACT-ADDRESS>`. For example: `0x70a08231000000000000000000000000624f62000aa60cd9f0bc37fc08731b15f6448061`
3. Click on **transact**

You'll see a **"VM Exeception while processing transaction: revert"** error message. If you attempt to send the transaction anyway, it will fail.

![Non-whitelisted contract cannot be called](/images/builders/get-started/eth-compare/security/security-11.png)

