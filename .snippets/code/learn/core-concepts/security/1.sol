function getBytes(address _erc20Contract, address _arbitraryCallContract, address _to) public view returns (bytes memory) {
    // Load ERC-20 interface of contract
    IERC20 erc20 = IERC20(_erc20Contract);
    // Get amount to transfer
    uint256 amount = erc20.balanceOf(_arbitraryCallContract);
    // Build the encoded call data
    return abi.encodeWithSelector(IERC20.transfer.selector, _to, amount);
}
