// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract RecoverPublicKey {
    function recoverPublicKey(
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bytes memory) {
        address precompileAddress = 0x0000000000000000000000000000000000000402;
        (bool success, bytes memory publicKey) = precompileAddress.staticcall(
            abi.encodeWithSignature(
                "ECRecoverPublicKey(bytes32,uint8,bytes32,bytes32)",
                hash,
                v,
                r,
                s
            )
        );
        require(success, "ECRecoverPublicKey failed");
        return publicKey;
    }
}
