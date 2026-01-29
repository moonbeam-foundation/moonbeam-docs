yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
--parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
--relay-ws-provider wss://kusama-rpc.polkadot.io \
--max-capacity 1000 --max-message-size 102400 \
--hrmp-action open
