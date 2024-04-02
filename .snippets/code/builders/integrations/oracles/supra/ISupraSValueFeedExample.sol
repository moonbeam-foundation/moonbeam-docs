// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISupraSValueFeed {
    function getSvalue(uint64 _pairIndex) external view returns (bytes32, bool);

    function getSvalues(
        uint64[] memory _pairIndexes
    ) external view returns (bytes32[] memory, bool[] memory);
}

contract SupraSValueFeedExample {
    ISupraSValueFeed internal sValueFeed;

    constructor() {
        sValueFeed = ISupraSValueFeed(
            0x4591d1B110ad451d8220d82252F829E8b2a91B17
        );
    }

    function unpack(bytes32 data) internal pure returns (uint256[4] memory) {
        uint256[4] memory info;

        info[0] = bytesToUint256(abi.encodePacked(data >> 192)); // round
        info[1] = bytesToUint256(abi.encodePacked((data << 64) >> 248)); // decimal
        info[2] = bytesToUint256(abi.encodePacked((data << 72) >> 192)); // timestamp
        info[3] = bytesToUint256(abi.encodePacked((data << 136) >> 160)); // price

        return info;
    }

    function bytesToUint256(
        bytes memory _bs
    ) internal pure returns (uint256 value) {
        require(_bs.length == 32, "bytes length is not 32.");
        assembly {
            value := mload(add(_bs, 0x20))
        }
    }

    function getPrice(
        uint64 _priceIndex
    ) external view returns (uint256[4] memory) {
        (bytes32 val, ) = sValueFeed.getSvalue(_priceIndex);

        uint256[4] memory decoded = unpack(val);

        return decoded;
    }

    function getPriceForMultiplePair(
        uint64[] memory _pairIndexes
    ) external view returns (uint256[4][] memory) {
        (bytes32[] memory val, ) = sValueFeed.getSvalues(_pairIndexes);

        uint256[4][] memory decodedArray = new uint256[4][](val.length);

        for (uint256 i = 0; i < val.length; i++) {
            uint256[4] memory decoded = unpack(val[i]);
            decodedArray[i] = decoded;
        }

        return decodedArray;
    }
}
