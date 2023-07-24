// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol";
import {RandomnessConsumer} from "https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/RandomnessConsumer.sol";

contract RandomNumber is RandomnessConsumer {
    // The Randomness Precompile Interface
    Randomness public randomness =
        Randomness(0x0000000000000000000000000000000000000809);

    // Variables required for randomness requests
    uint256 public requiredDeposit = randomness.requiredDeposit();
    uint64 public FULFILLMENT_GAS_LIMIT = 100000;
    // The fee can be set to any value as long as it is enough to cover
    // the fulfillment costs. Any leftover fees will be refunded to the
    // refund address specified in the requestRandomness function below.
    // 150 Gwei should be sufficient for all networks.
    // For Moonbase Alpha and Moonriver, you can specify 5 Gwei 
    uint256 public MIN_FEE = FULFILLMENT_GAS_LIMIT * 150 gwei; 
    uint32 public VRF_BLOCKS_DELAY = MIN_VRF_BLOCKS_DELAY;
    bytes32 public SALT_PREFIX = "INSERT_ANY_STRING_FOR_SALT";

    // Storage variables for the current request
    uint256 public requestId;
    uint256[] public random;

    constructor() payable RandomnessConsumer() {
        // Because this contract can only perform 1 random request at a time,
        // We only need to have 1 required deposit
        require(msg.value >= requiredDeposit);
    }

    function requestRandomness() public payable {
        // Make sure that the value sent is enough
        require(msg.value >= MIN_FEE);
        // Request local VRF randomness
        requestId = randomness.requestLocalVRFRandomWords(
            msg.sender, // Refund address
            msg.value, // Fulfillment fee
            FULFILLMENT_GAS_LIMIT, // Gas limit for the fulfillment
            SALT_PREFIX ^ bytes32(requestId++), // A salt to generate unique results
            1, // Number of random words
            VRF_BLOCKS_DELAY // Delay before request can be fulfilled
        );
    }

    function fulfillRequest() public {
        randomness.fulfillRequest(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // Save the randomness results
        random = randomWords;
    }
}