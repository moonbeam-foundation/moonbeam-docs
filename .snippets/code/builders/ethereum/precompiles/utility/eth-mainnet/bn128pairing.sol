pragma solidity >=0.4.21;

contract Precompiles {
    function callBn256Pairing(
        bytes memory input
    ) public returns (bytes32 result) {
        // input is a serialized bytes stream of (a1, b1, a2, b2, ..., ak, bk) from (G_1 x G_2)^k
        uint256 len = input.length;
        require(len % 192 == 0);
        assembly {
            let memPtr := mload(0x40)
            let success := call(
                gas(),
                0x08,
                0,
                add(input, 0x20),
                len,
                memPtr,
                0x20
            )
            switch success
            case 0 {
                revert(0, 0)
            }
            default {
                result := mload(memPtr)
            }
        }
    }
}
