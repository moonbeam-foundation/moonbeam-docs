<div id="termynal" data-termynal>
    <span data-ty="input"><span class="file-path"></span>npm run testnet-spy</span>
    <span data-ty>@wormhole-foundation/example-relayer-project@0.0.1 testnet-spy</span>
    <span data-ty>docker run --platform=linux/amd64 -p 7073:7073 --entrypoint /guardiand ghcr.io/wormhole-foundation/guardiand:latest spy --nodeKey /node.key --spyRPC "[::]:7073" --network /wormhole/testnet/2/1 --bootstrap /dns4/t-guardian-01.testnet.xlabs.xyz/udp/8999/quic/p2p/12D3KooWCW3LGUtkCVkHZmVSZHzL3C4WRKWfqAiJPz1NR7dT9Bxh</span>
    <span data-ty>INFO	wormhole-spy	spy/spy.go:322	status server listening on [::]:6060</span>
    <span data-ty>INFO	wormhole-spy	spy/spy.go:270	spy server listening	{"addr": "[::]:7073"}</span>
    <span data-ty>INFO	wormhole-spy	common/nodekey.go:16	No node key found, generating a new one...	{"path": "/node.key"}</span>
    <span data-ty>INFO	wormhole-spy.supervisor	supervisor/supervisor_processor.go:41	supervisor processor started</span>
    <span data-ty>INFO	wormhole-spy	spy/spy.go:413	Started internal services</span>
    <span data-ty>INFO	wormhole-spy.root.p2p	p2p/p2p.go:276	Connecting to bootstrap peers	{"bootstrap_peers": "/dns4/t-guardian-01.testnet.xlabs.xyz/udp/8999/quic-v1/p2p/12D3KooWCW3LGUtkCVkHZmVSZHzL3C4WRKWfqAiJPz1NR7dT9Bxh"}</span>
    <span data-ty>INFO	wormhole-spy.root.p2p	p2p/p2p.go:345	Subscribing pubsub topic	{"topic": "/wormhole/testnet/2/1/broadcast"}</span>
    <span data-ty>INFO	dht/RtRefreshManager	rtrefresh/rt_refresh_manager.go:322	starting refreshing cpl 0 with key CIQAAAAEGIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA (routing table size was 0)</span>
    <span data-ty>INFO	wormhole-spy.root.p2p	p2p/p2p.go:387	Connected to bootstrap peers	{"num": 1}</span>
    <span data-ty>INFO	wormhole-spy.root.p2p	p2p/p2p.go:389	Node has been started	{"peer_id": "12D3KooWJmUftCbuZH9rAF6Zzq9dhDhQ5yQrdwEVhiY8PXN3KtTG", "addrs": "[/ip4/127.0.0.1/udp/8999/quic-v1 /ip4/172.17.0.2/udp/8999/quic-v1 /ip6/::1/udp/8999/quic-v1]"}</span>
    <span data-ty>2024-08-01T23:03:51.193Z INFO    wormhole-spy    spy/spy.go:371  Received signed VAA {"vaa": "AQAAAAABAICa9rr2B5VTAg6tcYu/5DCkzbKVC5xG2CT0EZ681BP0Mxmb9RwTvSENT7Cr1GZ8LRmXbW7W0kZVELN+hhAh5boAZqwUVgAAAAAAGuEB+u2sWFHjK5sjtflBGowrrEquPtTde4Ed0acupKpxAAAAAASqMYIBQVVXVgAAAAAACT4b8wAAJxCYq1BJcB42Joc35zEoMLG3u4ARJg=="}</span>
</div>