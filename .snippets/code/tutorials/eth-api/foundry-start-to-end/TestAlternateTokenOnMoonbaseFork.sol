// Fork tests in the Moonbase Alpha environment
function testAlternateTokenOnMoonbaseFork() public {
    // Creates and selects a fork, returns a fork ID
    uint256 moonbaseFork = vm.createFork("moonbase");
    vm.selectFork(moonbaseFork);
    assertEq(vm.activeFork(), moonbaseFork);

    // Get token that's already deployed & deploys a container instance
    token = MyToken(0x359436610E917e477D73d8946C2A2505765ACe90);
    container = new Container(token, CAPACITY);

    // Mint tokens to the container & update container status
    token.mint(CAPACITY, address(container));
    container.updateStatus();

    // Assert that the capacity is full, just like the rest of the time
    assertEq(token.balanceOf(address(container)), CAPACITY);
    assertTrue(container.status() == ContainerStatus.Full);
}