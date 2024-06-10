pragma solidity >=0.4.21;

contract Precompiles {
    function callBn256ScalarMul(
        bytes32 x,
        bytes32 y,
        bytes32 scalar
    ) public returns (bytes32[2] memory result) {
        bytes32[3] memory input;
        input[0] = x;
        input[1] = y;
        input[2] = scalar;
        assembly {
            let success := call(gas, 0x07, 0, input, 0x60, result, 0x40)
            switch success
            case 0 {
                revert(0, 0)
            }
        }
    }
}
