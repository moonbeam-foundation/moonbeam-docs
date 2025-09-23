pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;

    // Runs before each test
    function setUp() public {
        token = new MyToken(100);
    }

    // Tests if minting during the constructor happens properly
    function testConstructorMint() public {
        assertEq(token.balanceOf(address(this)), 100);
    }
}