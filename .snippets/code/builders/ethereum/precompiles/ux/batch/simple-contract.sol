// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.30;

contract SimpleContract {
    mapping(uint256 => string) public messages;
    
    function setMessage(uint256 id, string calldata message) external {
        messages[id] = message;
    }
}
