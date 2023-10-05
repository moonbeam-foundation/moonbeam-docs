To use the script, you'll need to provide the following required arguments:

- `--parachain-ws-provider` or `--w` - specifies the parachain WebSocket provider that will be issuing the requests
- `--relay-ws-provider` or `--wr` - specifies the relay chain WebSocket provider that will be issuing the requests
- `--hrmp-action` or `--hrmp` - accepts the following action to take, which can be any of the following: `accept`, `cancel`, `close`, and `open`
- `--target-para-id` or `-p` - the target parachain ID for the requests
