// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Import OpenZeppelin Contract
import {MyToken} from "./MyToken.sol";

enum ContainerStatus {
    Unsatisfied,
    Full,
    Overflowing
}

contract Container {
    MyToken token;
    uint256 capacity;
    ContainerStatus public status;

    constructor(MyToken _token, uint256 _capacity) {
        token = _token;
        capacity = _capacity;
        status = ContainerStatus.Unsatisfied;
    }

    // Updates the status value based on the number of tokens that this contract has
    function updateStatus() public {
        address container = address(this);
        uint256 balance = token.balanceOf(container);
        if (balance < capacity) {
            status = ContainerStatus.Unsatisfied;
        } else if (balance == capacity) {
            status = ContainerStatus.Full;
        } else if (_isOverflowing(balance)) {
            status = ContainerStatus.Overflowing;
        }
    }

    // Returns true if the contract should be in an overflowing state, false if otherwise
    function _isOverflowing(uint256 balance) internal view returns (bool) {
        return balance > capacity;
    }
}