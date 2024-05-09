// Tests for negative cases of the internal _isOverflowing function
function testIsOverflowingFalse() public {
    ContainerHarness harness = new ContainerHarness(token , CAPACITY);
    assertFalse(harness.exposed_isOverflowing(CAPACITY - 1));
    assertFalse(harness.exposed_isOverflowing(CAPACITY));
    assertFalse(harness.exposed_isOverflowing(0));
}