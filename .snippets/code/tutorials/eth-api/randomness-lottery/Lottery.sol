// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "./Randomness.sol";
import {RandomnessConsumer} from "./RandomnessConsumer.sol";

contract Lottery is RandomnessConsumer {
    // Randomness Precompile interface
    Randomness public randomness =
        Randomness(0x0000000000000000000000000000000000000809);

    // The number of winners. This number corresponds to how many random words
    // will be requested. Cannot exceed MAX_RANDOM_WORDS (from the Randomness
    // Precompile)
    uint8 public NUM_WINNERS = 2;

    // The number of blocks before the request can be fulfilled (for Local VRF
    // randomness). The MIN_VRF_BLOCKS_DELAY (from the Randomness Precompile)
    // provides a minimum number that is safe enough for games with low economical
    // value at stake. Increasing the delay slightly reduces the probability
    // (already very low) of a collator being able to predict the pseudo-random number
    uint32 public VRF_BLOCKS_DELAY = MIN_VRF_BLOCKS_DELAY;

    // The minimum number of participants to start the lottery
    uint256 public MIN_PARTICIPANTS = 3;

    // The maximum number of participants allowed to participate. It is important
    // to limit the total jackpot (by limiting the number of participants) to
    // guarantee the economic incentive of a collator to avoid trying to influence
    // the pseudo-random. (See Randomness.sol for more details)
    uint256 public MAX_PARTICIPANTS = 20;

    // The fee needed to participate in the lottery. Will go into the jackpot
    uint256 public PARTICIPATION_FEE = 100000 gwei;

    // The gas limit allowed to be used for the fulfillment, which depends on the
    // code that is executed and the number of words requested. Test and adjust
    // this limit based on the size of the request and the processing of the
    // callback request in the fulfillRandomWords() function
    uint64 public FULFILLMENT_GAS_LIMIT = 100000;

    // The minimum fee needed to start the lottery. This does not guarantee that
    // there will be enough fee to pay for the gas used by the fulfillment.
    // Ideally it should be over-estimated considering possible fluctuation of
    // the gas price. Additional fee will be refunded to the caller
    uint256 public MIN_FEE = FULFILLMENT_GAS_LIMIT * 150 gwei;

    // A string used to allow having different salt than other contracts
    bytes32 public SALT_PREFIX = "INSERT_ANY_STRING_FOR_SALT";

    // Stores the global number of requests submitted. This number is used as a
    // salt to make each request unique
    uint256 public globalRequestCount;

    // The current request id
    uint256 public requestId;

    // The list of current participants
    address[] public participants;

    // The current amount of token at stake in the lottery
    uint256 public jackpot;

    // the owner of the contract
    address owner;

    // Which randomness source to use. This correlates to the values in the
    // RandomnessSource enum in the Randomness Precompile
    Randomness.RandomnessSource randomnessSource;

    constructor(
        Randomness.RandomnessSource source
    ) payable RandomnessConsumer() {
        // Because this contract can only perform one randomness request at a time,
        // we only need to have one required deposit
        uint256 requiredDeposit = randomness.requiredDeposit();
        if (msg.value < requiredDeposit) {
            revert("Deposit too Low");
        }
        // Update parameters
        randomnessSource = source;
        owner = msg.sender;
        globalRequestCount = 0;
        jackpot = 0;
        // Set the requestId to the maximum allowed value by the precompile (64 bits)
        requestId = 2 ** 64 - 1;
    }

    function participate() external payable {
        // We check that the lottery hasn't started yet
        if (
            randomness.getRequestStatus(requestId) !=
            Randomness.RequestStatus.DoesNotExist
        ) {
            revert("Request already initiated");
        }

        // Each player must submit a fee to participate, which is added to
        // the jackpot
        if (msg.value != PARTICIPATION_FEE) {
            revert("Invalid participation fee");
        }
        participants.push(msg.sender);
        jackpot += msg.value;
    }

    function startLottery() external payable onlyOwner {
        // Check we haven't started the randomness request yet
        if (
            randomness.getRequestStatus(requestId) !=
            Randomness.RequestStatus.DoesNotExist
        ) {
            revert("Request already initiated");
        }
        // Check that the number of participants is acceptable
        if (participants.length < MIN_PARTICIPANTS) {
            revert("Not enough participants");
        }
        if (participants.length >= MAX_PARTICIPANTS) {
            revert("Too many participants");
        }
        // Check the fulfillment fee is enough
        uint256 fee = msg.value;
        if (fee < MIN_FEE) {
            revert("Not enough fee");
        }
        // Check there is enough balance on the contract to pay for the deposit.
        // This would fail only if the deposit amount required is changed in the
        // Randomness Precompile.
        uint256 requiredDeposit = randomness.requiredDeposit();
        if (address(this).balance < jackpot + requiredDeposit) {
            revert("Deposit too low");
        }

        if (randomnessSource == Randomness.RandomnessSource.LocalVRF) {
            // Request random words using local VRF randomness
            requestId = randomness.requestLocalVRFRandomWords(
                msg.sender,
                fee,
                FULFILLMENT_GAS_LIMIT,
                SALT_PREFIX ^ bytes32(globalRequestCount++),
                NUM_WINNERS,
                VRF_BLOCKS_DELAY
            );
        } else {
            // Requesting random words using BABE Epoch randomness
            requestId = randomness.requestRelayBabeEpochRandomWords(
                msg.sender,
                fee,
                FULFILLMENT_GAS_LIMIT,
                SALT_PREFIX ^ bytes32(globalRequestCount++),
                NUM_WINNERS
            );
        }
    }

    function fulfillRequest() public {
        randomness.fulfillRequest(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        pickWinners(randomWords);
    }

    // This function is called only by the fulfillment callback
    function pickWinners(uint256[] memory randomWords) internal {
        // Get the total number of winners to select
        uint256 totalWinners = NUM_WINNERS < participants.length
            ? NUM_WINNERS
            : participants.length;

        // The amount distributed to each winner
        uint256 amountAwarded = jackpot / totalWinners;
        for (uint32 i = 0; i < totalWinners; i++) {
            // This is safe to index randomWords with i because we requested
            // NUM_WINNERS random words
            uint256 randomWord = randomWords[i];

            // Using modulo is not totally fair, but fair enough for this demo
            uint256 index = randomWord % participants.length;
            address payable winner = payable(participants[index]);
            delete participants[index];
            jackpot -= amountAwarded;
            winner.transfer(amountAwarded);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
