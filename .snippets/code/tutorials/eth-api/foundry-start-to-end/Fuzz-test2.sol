// Fuzz tests for failure upon minting tokens above one ether
function testFailMintAboveOneEther(uint256 amountToMint) public {
    vm.assume(amountToMint > 1 ether);
    
    token.mint(amountToMint, msg.sender);
}