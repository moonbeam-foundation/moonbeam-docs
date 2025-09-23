// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PausableBox is Initializable, PausableUpgradeable, OwnableUpgradeable {
    uint256 private value;
 
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Initialize
    function initialize() initializer public {
        __Ownable_init(_msgSender());
        __Pausable_init_unchained();
    }
 
    // Stores a new value in the contract
    function store(uint256 newValue) whenNotPaused public {
        value = newValue;
        emit ValueChanged(newValue);
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
    
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}