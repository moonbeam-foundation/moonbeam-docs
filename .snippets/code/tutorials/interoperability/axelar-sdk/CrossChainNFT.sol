// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';

// Allows users to mint an NFT, but only cross chain
contract CrossChainNFT is ERC721, AxelarExecutable {
    constructor(
        address _gateway,
        IAxelarGasService _gasService,
        IERC20 _wDev
    ) ERC721("Cross Chain NFT", "XCNFT") AxelarExecutable(_gateway) {
        gasService = _gasService;
        wDev = _wDev;
    }

    uint256 currentNFTID;
    IAxelarGasService gasService;
    IERC20 wDev;

    // Mints the NFT for the user
    function _executeWithToken(
        string memory, /*sourceChain*/
        string memory, /*sourceAddress*/
        bytes calldata payload,
        string memory tokenSymbol,
        uint256 amount
    ) internal override {
        require(
            keccak256(abi.encodePacked(tokenSymbol)) == keccak256("WDEV"),
            "Only WDEV is accepted"
        );
        require(amount >= 0.05 ether, "Not enough to mint!");

        address user = abi.decode(payload, (address));

        _mint(user, currentNFTID);
        currentNFTID++;
    }

    function mintXCNFT(
        string memory destinationAddress,
        string memory destinationChain,
        uint256 amount
    ) external payable {
        // Create the payload
        bytes memory payload = abi.encode(msg.sender);
        
        // Takes WDEV from the user and puts them into this contract for the Gateway to take        
        wDev.transferFrom(msg.sender, address(this), amount);
        wDev.approve(address(gateway), amount);

        // Pay for gas 
        // This is a gas service SPECIFICALLY for sending with token
        gasService.payNativeGasForContractCallWithToken{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            "WDEV",
            amount,
            msg.sender
        );

        // Call remote contract
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            "WDEV",
            amount
        );
    }
}
