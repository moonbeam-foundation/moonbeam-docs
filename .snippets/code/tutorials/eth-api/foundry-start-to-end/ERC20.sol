// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
        _mint(msg.sender, initialSupply);
    }

    // An external minting function allows anyone to mint as many tokens as they want
    function mint(uint256 toMint, address to) external {
        require(toMint <= 1 ether);
        _mint(to, toMint);
    }
}
