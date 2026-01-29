// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SayHello {
    mapping(address => string) public addressToName;

    constructor(string memory _name) {
        addressToName[msg.sender] = _name;
    }

    // Store a name associated to the address of the sender
    function setName(string memory _name) public {
        addressToName[msg.sender] = _name;
    } 

    // Use the name in storage associated to the sender
    function sayHello() external view returns (string memory) {
        return string(abi.encodePacked("Hello ", addressToName[msg.sender]));
    }
}
