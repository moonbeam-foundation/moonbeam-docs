// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface ISupraOraclePull {
    //Verified price data
    struct PriceData {
        // List of pairs
        uint256[] pairs;
        // List of prices
        // prices[i] is the price of pairs[i]
        uint256[] prices;
        // List of decimals
        // decimals[i] is the decimals of pairs[i]
        uint256[] decimals;
    }

    function verifyOracleProof(
        bytes calldata _bytesProof
    ) external returns (PriceData memory);
}

// Mock contract which can consume oracle pull data
contract MockOracleClient {
    // The oracle contract
    ISupraOraclePull internal oracle;

    // Event emitted when a pair price is received
    event PairPrice(uint256 pair, uint256 price, uint256 decimals);

    constructor(address oracle_) {
        oracle = ISupraOraclePull(oracle_);
    }

    function GetPairPrice(
        bytes calldata _bytesProof,
        uint256 pair
    ) external returns (uint256) {
        ISupraOraclePull.PriceData memory prices = oracle.verifyOracleProof(
            _bytesProof
        );
        uint256 price = 0;
        uint256 decimals = 0;
        for (uint256 i = 0; i < prices.pairs.length; i++) {
            if (prices.pairs[i] == pair) {
                price = prices.prices[i];
                decimals = prices.decimals[i];
                break;
            }
        }
        require(price != 0, "Pair not found");
        return price;
    }
}
