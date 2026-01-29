// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

import "https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol";

contract MultilocationWhitelistExample {
    XcmUtils xcmutils = XcmUtils(0x000000000000000000000000000000000000080C);
    mapping(address => bool) public whitelistedAddresses;

    modifier onlyWhitelisted(address addr) {
        _;
        require(whitelistedAddresses[addr], "Address not whitelisted!");
        _;
    }

    function addWhitelistedMultilocation(
        XcmUtils.Multilocation calldata externalMultilocation
    ) external onlyWhitelisted(msg.sender) {
        address derivedAddress = xcmutils.multilocationToAddress(
            externalMultilocation
        );
        whitelistedAddresses[derivedAddress] = true;
    }

    ...
}
