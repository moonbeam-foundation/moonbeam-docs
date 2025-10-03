// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";
import {Container, ContainerStatus} from "../src/Container.sol";

contract ContainerTest is Test {
    MyToken public token;
    Container public container;

    uint256 constant CAPACITY = 100;

    function setUp() public {
        token = new MyToken(1000);
        container = new Container(token, CAPACITY);
    }

    function testInitialUnsatisfied() public {
        assertEq(token.balanceOf(address(container)), 0);
        assertTrue(container.status() == ContainerStatus.Unsatisfied);
    }

    function testContainerFull() public {
        token.transfer(address(container), CAPACITY);
        container.updateStatus();

        assertEq(token.balanceOf(address(container)), CAPACITY);
        assertTrue(container.status() == ContainerStatus.Full);
    }

    function testIsOverflowingFalse() public {
        ContainerHarness harness = new ContainerHarness(token , CAPACITY);
        assertFalse(harness.exposed_isOverflowing(CAPACITY - 1));
        assertFalse(harness.exposed_isOverflowing(CAPACITY));
        assertFalse(harness.exposed_isOverflowing(0));
    }

    function testAlternateTokenOnMoonbaseFork() public {
        // Creates and selects a fork
        uint256 moonbaseFork = vm.createFork("moonbase");
        vm.selectFork(moonbaseFork);
        assertEq(vm.activeFork(), moonbaseFork);

        // Get token that's already deployed & deploys a container instance
        token = MyToken(0x93e1e9EC6c1A8736266A595EFe97B5673ea0fEAc);
        container = new Container(token, CAPACITY);

        // Mint tokens to the container & update container status
        token.mint(CAPACITY, address(container));
        container.updateStatus();

        // Assert that the capacity is full
        assertEq(token.balanceOf(address(container)), CAPACITY);
        assertTrue(container.status() == ContainerStatus.Full);
    }
}

contract ContainerHarness is Container {
    constructor(MyToken _token, uint256 _capacity) Container(_token, _capacity) {}

    function exposed_isOverflowing(uint256 balance) external view returns(bool) {
        return _isOverflowing(balance);
    }
}