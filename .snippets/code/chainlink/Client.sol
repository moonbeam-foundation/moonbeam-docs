pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";

/**
 * @title Client based in ChainlinkClient
 * @notice End users can deploy this contract to request the Prices from an Oracle
 */
contract Client is ChainlinkClient {
  // Stores the answer from the Chainlink oracle
  uint256 public currentPrice;
  address public owner;
  
  // Deploy with the address of the LINK token
  constructor(address _link) public {
    // Set the address for the LINK token for the network
    setChainlinkToken(_link);
    owner = msg.sender;
  }

  // Creates Chainlink Request
  function requestPrice(address _oracle, string memory _jobId, uint256 _payment) 
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
  }

  // Callback function called by the Oracle when it has resolved the request
  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }
  
  // Allows the owner to cancel an unfulfilled request
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  // Allows the owner to withdraw the LINK tokens in the contract to the address calling this function
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  // Decodes an input string in a bytes32 word
  function stringToBytes32(string memory _source)
    private
    pure
    returns (bytes32 result) 
  {
    bytes memory emptyStringTest = bytes(_source);
    if (emptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(_source, 32))
    }

    return result;
  }
  
  // Reverts if the sender is not the owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
}