function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Value: 0 does not protect against native ERC-20 precompile calls or XCM precompiles
    (bool success,) = _target.call{value: 0}(_bytes);
    require(success);
}
