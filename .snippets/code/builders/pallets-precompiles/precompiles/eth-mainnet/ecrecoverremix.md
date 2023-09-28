```solidity
pragma solidity ^0.7.0;

contract ECRECOVER{
    address addressTest = 0x12Cb274aAD8251C875c0bf6872b67d9983E53fDd;
    bytes32 msgHash = 0xc51dac836bc7841a01c4b631fa620904fc8724d7f9f1d3c420f0e02adf229d50;
    uint8 v = 0x1b;
    bytes32 r = 0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef;
    bytes32 s = 0x7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb4;
    
    
    function verify() public view returns(bool) {
        // Use ECRECOVER to verify address
        return (ecrecover(msgHash, v, r, s) == (addressTest));
    }
}
```