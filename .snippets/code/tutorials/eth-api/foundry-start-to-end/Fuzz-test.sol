// Fuzz tests for success upon minting tokens one ether or below
function testMintOneEtherOrBelow(uint256 amountToMint) public {
    vm.assume(amountToMint <= 1 ether);

    token.mint(amountToMint, msg.sender);
    assertEq(token.balanceOf(msg.sender), amountToMint);
}