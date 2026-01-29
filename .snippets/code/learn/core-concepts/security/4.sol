function makeArbitraryCall(address _target, bytes calldata _bytes) public {
    // Ensure the contract address is safe
    require(_target == INSERT_CONTRACT_ADDRESS);

    // Arbitrary call
    (bool success,) = _target.call(_bytes);
    require(success);
}
