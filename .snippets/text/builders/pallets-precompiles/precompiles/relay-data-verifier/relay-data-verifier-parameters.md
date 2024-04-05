- ***uint32* relayBlockNumber** - The relay block number for which the data is being verified. The latest relay block number can be obtained from the `latestRelayBlockNumber()` function
- ***ReadProof* calldata readProof** - A struct defined in the precompile contract, containing the storage proof used to verify the data. The `ReadProof` struct is defined as:
    ```
    struct ReadProof {
            // The block hash against which the proof is generated
            bytes32 at;
            /// The storage proof
            bytes[] proof;
        }
    ```