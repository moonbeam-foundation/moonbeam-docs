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
