```solidity
pragma solidity >=0.4.21;

contract Precompiles {
    function sha3fips(bytes memory data) public view returns (bytes32) {
        bytes32[1] memory h;
        assembly {
            if iszero(
                staticcall(not(0), 0x400, add(data, 32), mload(data), h, 32)
            ) {
                invalid()
            }
        }
        return h[0];
    }
}

```