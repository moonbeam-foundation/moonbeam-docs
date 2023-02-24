The interface includes the following functions:

- **batchSome**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, following subcalls will still be attempted
- **batchSomeUntilFailure**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, no following subcalls will be executed
- **batchAll**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) — performs multiple calls atomically, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert

Each of these functions have the following parameters:

--8<-- 'text/batch/batch-parameters.md'

The interface also includes the following required events:

- **SubcallSucceeded**(*uint256* index) - emitted when subcall of the given index succeeds
- **SubcallFailed**(*uint256* index) - emitted when a subcall of the given index  fails
