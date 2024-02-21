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