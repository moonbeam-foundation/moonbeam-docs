The interface includes the following functions:

- **batchSome(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, following subcalls will still be attempted
- **batchSomeUntilFailure(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, no following subcalls will be executed
- **batchAll(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit)** — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert

The interface also includes the following required events:

- **SubcallSucceeded(*uint256* index)** - emitted when a subcall succeeds
- **SubcallFailed(*uint256* index)** - emitted when a subcall fails
