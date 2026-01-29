pragma solidity ^0.8.30;

contract DIARandomOracle {
  struct Random {
    string randomness;
    string signature;
    string previousSignature;
  }

  mapping(uint256 => Random) public values;
  uint256 public lastRound = 0;
  address public oracleUpdater;
  event OracleUpdate(string key, uint128 value, uint128 timestamp);
  event UpdaterAddressChange(address newUpdater);

  constructor() {
      oracleUpdater = msg.sender;
  }

  function setRandomValue(
    uint256 _round,
    string memory _randomness,
    string memory _signature,
    string memory _previousSignature
  ) public {
    require(msg.sender == oracleUpdater, "not a updater");
    require(lastRound < _round, "old round");
    lastRound = _round;
    values[_round] = Random(_randomness, _signature, _previousSignature);
  }

  function getValue(uint256 _round) external view returns (Random memory) {
    return values[_round];
  }

  function updateOracleUpdaterAddress(address newOracleUpdaterAddress)
    public
  {
    require(msg.sender == oracleUpdater, "not a updater");
    oracleUpdater = newOracleUpdaterAddress;
    emit UpdaterAddressChange(newOracleUpdaterAddress);
  }

  function getRandomValueFromRound(uint256 _round)
    external
    view
    returns (string memory)
  {
    return values[_round].randomness;
  }

  function getRandomValueFromRoundWithSignature(uint256 _round)
    external
    view
    returns (Random memory)
  {
    return values[_round];
  }

    function getLastRound() public view returns (uint256) {
    return lastRound;
  }
}
