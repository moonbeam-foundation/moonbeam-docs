// Get the price of a pair from oracle data received from supra pull model
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
