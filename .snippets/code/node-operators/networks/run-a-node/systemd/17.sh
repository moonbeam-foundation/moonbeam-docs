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
     --chain {{ networks.moonriver.chain_spec }} \
     --name "INSERT_YOUR_NODE_NAME" \
     -- \
     --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
     --sync fast

[Install]
WantedBy=multi-user.target
