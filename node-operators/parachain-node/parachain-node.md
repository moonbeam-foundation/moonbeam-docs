---
title: Parachain Node
description: How to run a Parachain node for the Moonbeam Network
---

# Run a Parachain Node on Moonbeam

(cool image) 

## Introduction

preamble... 


!!! note 
    Moonbase is still considered an Alphanet, and as such will not have 100% uptime.  We *will* be purging the parachain from time to time.  

Differences from typical substrate node:
- A substrate parachain node will run two processes, one to sync the relay chain and one to sync the parachain.  
- As such, many things are doubled.  e.g. the data directory, the ports used, the log lines, etc.  
- You need a spec file to run the parachain.  It's included in the docker image, but if you run the binary it must be downloaded.  This file changes between versions.  

## Requirements


### Network 
The relay and parachain p2p port must be open to incoming traffic from the internet.  
```
Source: Any
Destination: 30333, 30334 TCP
```

### CPU
4-8 Cores (may require more during this development phase)

### RAM
8-16 GB (may require more during this development phase)

### SSD
In Alphanet, this will be very modest to start, 50GB, as we are running a new relay chain.  In mainnet however, you will have to add the disk requirements of Kusama or Polkadot to that of the parachain. 


## Install Instructions - Docker
A Moonbase Alphanet parachain node can be spun up quickly using the docker command below.  

1. Create a local directory to store the chain data.
   ```
   mkdir /var/lib/moonbase-alpha
   ```
2. Update the command below, replace `YOUR-NODE-NAME` (2 places), verify the sha, `sha-34ba9713`, and run the command.  Note, `sha-34ba9713` is the parachain version designation and this will change from time to time.  We will attempt to keep this documentation up to date but it may not always be.  Contact us on ________ for the latest sha to use.  If you see logs about a mismatched sha, this is the reason.  

    [WIP - this is stagenet - update for alphanet!!]

    ```
    docker run -d -p 30333:30333 -p 30334:30334 -v /var/lib/moonbase-alpha:/data/ \
    gcr.io/purestake-dev/moonbase-parachain-testnet:sha-34ba9713 \
    /moonbase-alphanet/moonbase-alphanet \
        --base-path=/data \
        --chain=/moonbase-alphanet/moonbase-alphanet-specs-raw.json \
        --name="YOUR-NODE-NAME" \
        --collator \
        --execution wasm \
        --wasm-execution compiled \
        --bootnodes=/dns4/rpcnode1.stagenet.moonbeam.gcp.purestake.run/tcp/30334/p2p/12D3KooWH8ocqod6UqhiecikyoYuNWyjcewYjQG9FyhYbo1e4sKV \
        --bootnodes=/dns4/rpcnode2.stagenet.moonbeam.gcp.purestake.run/tcp/30334/p2p/12D3KooWFmfo5EnBM1Y5w1ynLx4tvaBSLnbBz3cNfN36nU1mF6rA \
        -- \
        --chain=/polkadot/rococo-alphanet-specs-raw.json \
        --bootnodes=/dns4/rpcnode1.stagenet.moonbeam.gcp.purestake.run/tcp/30333/p2p/12D3KooWH8ocqod6UqhiecikyoYuNWyjcewYjQG9FyhYbo1e4sKV \
        --bootnodes=/dns4/rpcnode2.stagenet.moonbeam.gcp.purestake.run/tcp/30333/p2p/12D3KooWFmfo5EnBM1Y5w1ynLx4tvaBSLnbBz3cNfN36nU1mF6rA \
        --name="YOUR-NODE-NAME (Embedded Relay)"
    ```


## Installation Instructions - Binary
Moonbase Alphanet may be run on Unbuntu 18.04.  It may work with other flavors of linux, but Ubuntu is currently the only tested version.  


[WIP]

1. Each version will require two files, the parachain binary and the associated spec file.  These will both change every version upgrade.  They can both be downloaded from our repo:  [LINK]
2. Create the directory to store the binary and data.  Change the owner to your service account.  
   ```
   mkdir /var/lib/moonbase-alpha
   chown service_account:service_account /var/lib/moonbase-alpha
   ```
3. Create the systemd configuration file [WIP]
4. Register and start the service
   ```
   systemctl enable moonbeam.service
   systemctl start moonbeam.service
   ```
5. Verify the service is running 
   ```
   systemctl status moonbeam.service
   # and/or
   journalctl -f -u moonbeam.service
   ```
   




## Running Ports
The parachain node will listen on multiple ports.  The “standard” substrate ports are for the relay chain, while the parachain will listen on the next higher port.  
```
 # Default ports for relay chain
 relay_ports:
   p2p: 30333
   ws: 9944
   rpc: 9933
   prometheus: 9615
 
 # Default ports for parachain
 para_ports:
   p2p: 30334
   ws: 9945
   rpc: 9934
   prometheus: 9616
```



## Logs and Troubleshooting
You will see logs from both the Relaychain as well as the parachain.  The relay chain will be prefixed by [Relaychain] while the parachain has no prefix.  


### In Sync
Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.  
(image - Relay_Parachain_Idle.png) 

### Mismatched SHA
We will be upgrading this Alphanet often and will be contacting you in advance, but you may see a mismatched SHA log line and have your node stall.  This typically means you are running an older version and will need to upgrade.  
(image - Mismatched_Sha.png) still need to take it 









