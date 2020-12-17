pragma solidity ^0.6.6;

/**
 * @title Simple Interface to interact with Universal Client Contract
 * @notice Client Address 0x81f191eF90Fed48645FB846DFd7a6B8893fF5d56
 */
interface ChainlinkInterface {

  /**
   * @notice Creates a Chainlink request with the job specification ID,
   * @notice and sends it to the Oracle.
   * @notice _oracle The address of the Oracle contract fixed top
   * @notice _payment For this example the PAYMENT is set to zero
   * @param _jobId The job spec ID that we want to call in string format 
   */
    function requestPrice(string calldata _jobId) external;

    function currentPrice() external view returns (uint);

}