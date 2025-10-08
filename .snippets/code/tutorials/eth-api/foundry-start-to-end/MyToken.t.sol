// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;

    function setUp() public {
        token = new MyToken(100);
    }

    function testConstructorMint() public {
        assertEq(token.balanceOf(address(this)), 100);
    }

    function testMintOneEtherOrBelow(uint256 amountToMint) public {
        vm.assume(amountToMint <= 1 ether);

        token.mint(amountToMint, msg.sender);
        assertEq(token.balanceOf(msg.sender), amountToMint);
    }

    function testFailMintAboveOneEther(uint256 amountToMint) public {
        vm.assume(amountToMint > 1 ether);
        
        token.mint(amountToMint, msg.sender);
    }
}
