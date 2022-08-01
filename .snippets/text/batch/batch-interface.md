The interface includes the following functions:

- **batchSome**(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit) — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, following subcalls will still be attempted
- **batchSomeUntilFailure**(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit) — performs multiple calls, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, no following subcalls will be executed
- **batchAll**(*address[]* to, *uint256[]* value, *bytes[]* call_data, *uint64[]* gas_limit) — performs multiple calls atomically, where the same index of each array combine into the information required for a single subcall. If a subcall reverts, all subcalls will revert

Each of these functions have the following parameters:

- ***address[]* to** - an array of addresses to direct subtransactions to, where each entry is a subtransaction
- ***uint256[]* value** - an array of native currency values to send in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. If this array is shorter than the *to* array, all the following subtransactions will default to a value of 0
- ***bytes[]* call_data** - an array of call data to include in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. If this array is shorter than the *to* array, all of the following subtransactions will include no call data
- ***uint64[]* gas_limit** - an array of gas limits in the subtransactions, where the index corresponds to the subtransaction of the same index in the *to* array. Values of 0 are interpreted as unlimited and will have all remaining gas of the batch transaction forwarded. If this array is shorter than the *to* array, all of the following subtransactions will have all remaining gas forwarded

The interface also includes the following required events:

- **SubcallSucceeded**(*uint256* index) - emitted when subcall of the given index succeeds
- **SubcallFailed**(*uint256* index) - emitted when a subcall of the given index  fails
