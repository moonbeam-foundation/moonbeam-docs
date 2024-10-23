function mintXCNFT(
    string memory destinationAddress,
    string memory destinationChain,
    uint256 amount
) external payable {
    // Create the payload
    bytes memory payload = abi.encode(msg.sender);
    
    // Takes WDEV from the user and puts them into this contract for the Gateway to take        
    wDev.transferFrom(msg.sender, address(this), amount);
    wDev.approve(address(gateway), amount);

    // Pay for gas
    // This is a gas service SPECIFICALLY for sending with token
    gasService.payNativeGasForContractCallWithToken{value: msg.value}(
        address(this),
        destinationChain,
        destinationAddress,
        payload,
        "WDEV",
        amount,
        msg.sender
    );

    // Call remote contract
    gateway.callContractWithToken(
        destinationChain,
        destinationAddress,
        payload,
        "WDEV",
        amount
    );
}