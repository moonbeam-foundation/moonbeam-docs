[Unit]
Description="Moonriver systemd service"
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=on-failure
RestartSec=10
User=moonriver_service
SyslogIdentifier=moonriver
SyslogFacility=local7
KillSignal=SIGHUP
ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
     --state-pruning archive \
     --trie-cache-size 1073741824 \
     --db-cache INSERT_RAM_IN_MB \
     --base-path {{ networks.moonriver.node_directory }} \
     --ethapi debug,trace,txpool \
     --wasm-runtime-overrides {{ networks.moonriver.node_directory }}/wasm \
     --runtime-cache-size 64 \
     --chain {{ networks.moonriver.chain_spec }} \
     --name "INSERT_YOUR_NODE_NAME" \
     -- \
     --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"

[Install]
WantedBy=multi-user.target
