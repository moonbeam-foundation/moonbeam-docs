// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.3;

contract P256Verify {
    function verify(
        bytes32 msg_hash,
        bytes32[2] memory signature,
        bytes32[2] memory public_key
    ) public view returns (bool) {
        bool output;

        bytes memory args = abi.encodePacked(
            msg_hash,
            signature[0],
            signature[1],
            public_key[0],
            public_key[1]
        );

        bool success;
        assembly {
            success := staticcall(not(0), 0x100, add(args, 32), mload(args), output, 0x20)
        }
        require(success, "p256verify precompile call failed");

        return output;
    }
}