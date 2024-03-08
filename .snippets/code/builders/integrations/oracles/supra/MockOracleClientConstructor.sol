// Mock contract which can consume oracle pull data
contract MockOracleClient {
    // The oracle contract
    ISupraOraclePull internal oracle;

    // Event emitted when a pair price is received
    event PairPrice(uint256 pair, uint256 price, uint256 decimals);

    constructor(address oracle_) {
        oracle = ISupraOraclePull(oracle_);
    }
}
