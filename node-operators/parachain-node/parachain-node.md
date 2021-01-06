---
title: Parachain Node
description: How to run a Parachain node for the Moonbeam Network
---

# Run a Parachain Node on Moonbeam

(cool image) 

## Introduction

With the v5 release of Moonbeam, we now support multiple collators and rpc nodes.  We invite everyone to spin up a node and join the Moonbase network.  Collation slots will be limited for now, but anyone can run a full node to connect to their own private RPC endpoint.  PureStake will be hosting the relay chain in PoA mode, and the instructions below explain how to run our parachain and connect it to the Moonbase network.  As development progresses, Kusama and then Polkadot will become the relay chains.  Here's how we will name these upcoming environments: 

- Moonbase  <-> PureStake
- Moonriver <-> Kusama
- Moonbeam  <-> Polkadot

This guide is targeted toward someone with experience running substrate based chains.  Running a parachain is similar to running a substrate node, with a few differences. A substrate parachain node will run two processes, one to sync the relay chain and one to sync the parachain.  As such, many things are doubled.  e.g. the data directory, the ports used, the log lines, etc.  

!!! note 
    Moonbase is still considered an Alphanet, and as such *will not* have 100% uptime.  We *will* be purging the parachain from time to time.  During development of your application, make sure you implement a method to quickly redeploy your contracts and accounts to a fresh parachain.  Join us on Twitter, Discord, or Telegram to be notified of upcoming purges. 
## Requirements


### Network 
The relay and parachain p2p port must be open to incoming traffic from the internet.  
```
Source: Any
Destination: 30333, 30334 TCP
```
If you are planning to run external RPC endpoints, you will need to allow those incoming ports as well.  See below for information on default ports. 

### CPU
8 Cores (early development phase - not optimized yet)

### RAM
16 GB (early development phase - not optimized yet)

### SSD
In Alphanet, this will be very modest to start, 50GB, as we are running a new relay chain.  In mainnet however, you will have to add the disk requirements of Kusama or Polkadot to that of the parachain. 


## Install Instructions - Docker
A Moonbase Alphanet parachain node can be spun up quickly using the docker command below.  

Create a local directory to store the chain data.
   ```
   mkdir /var/lib/moonbase-alpha
   ```
Update the command below, replace `YOUR-NODE-NAME` (2 places), verify the sha, `sha-34ba9713`, and run the command.  Note, `sha-34ba9713` is the parachain version designation and this will change from time to time.  We will attempt to keep this documentation up to date but it may not always be.  Contact us on ________ for the latest sha to use.  If you see logs about a mismatched sha, this is the reason.  

- [WIP] - this is stagenet - update for alphanet!!

```
docker run -d -p 30333:30333 -p 30334:30334 -v /var/lib/moonbase-alpha:/data/ \
gcr.io/purestake-dev/moonbase-parachain-testnet:sha-34ba9713 \
/moonbase-alphanet/moonbase-alphanet \
    --base-path=/data \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    -- \
    --name="YOUR-NODE-NAME (Embedded Relay)"
```

If you want to expose WS or RPC ports, enable those on the docker run command line.  e.g. 
   ```
   docker run -d -p 30333:30333 -p 30334:30334 -p 9934:9934 -p 9945:9945 .... 
   ```

## Installation Instructions - Binary
Moonbase Alphanet may be run on Unbuntu 18.04.  It may work with other flavors of linux, but Ubuntu is currently the only tested version.  

Below are the steps to compile the binary and run moonbeam as a systemd service. 

### Compiling the Binary 


The following commands will build the latest release of the moonbeam parachain. 


Clone the moonbeam repo.
```
cd ~
git clone git@github.com:PureStake/moonbeam.git
cd moonbeam
```
View the latest release .
```
git tag | tail -1
```
Checkout the latest release.
```
git checkout tags/$(git tag | tail -1)
```
Get the latest version of substrate.
```
curl https://getsubstrate.io -sSf | bash -s -- --fast
```
Run the init script.
```
./scripts/init.sh
```
Build the release.
```
cd ./node/parachain
cargo build --release
```
If needed, add Rust to your path.
```
source $HOME/.cargo/env
```

### Running the Systemd Service

Create a service account to run the service. 
```
adduser moonbase_service --system --no-create-home
```
Create the directory to store the binary and data.  Set permissions.   
```
mkdir /var/lib/moonbase-alpha
chmod 0755 /var/lib/moonbase-alpha
chown moonbase_service /var/lib/moonbase-alpha
```
Copy the binary to the folder you created. 
```
cp ~/moonbeam/target/release/moonbase-alphanet /var/lib/moonbase-alpha/
```
Create the systemd configuration file.
- Update the `YOUR-NODE-NAME` (2 places) and base path if you changed it. 
- Double check the binaries and spec files are in the proper paths as described below.
- Name the file `/etc/systemd/system/moonbeam.service`
```
[Unit]
Description="Moonbase alpha systemd service"
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=on-failure
RestartSec=10
User=moonbase_service
SyslogIdentifier=moonbase
SyslogFacility=local7
KillSignal=SIGHUP
ExecStart=/var/lib/moonbase-alpha/moonbase-parachain \
     --parachain-id 1000 \
     --no-telemetry \
     --port 30334 \
     --rpc-port 9934 \
     --ws-port 9945 \
     --pruning=archive \
     --unsafe-rpc-external \
     --unsafe-ws-external \
     --rpc-methods=Safe \
     --rpc-cors all \
     --log rpc=info \
     --base-path /var/lib/moonbase-alpha \
     --name "YOUR-NODE-NAME" \
     -- \
     --port 30333 \
     --rpc-port 9933 \
     --ws-port 9944 \
     --pruning=archive \
     --name="YOUR-NODE-NAME (Embedded Relay)"
     
[Install]
WantedBy=multi-user.target
```
Register and start the service.
```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```
Verify the service is running.
```
systemctl status moonbeam.service
# and/or
journalctl -f -u moonbeam.service
```
   

## Telemetry Exporter
Moonbeam will run a telemetry server which will collect Prometheus metrics from all the Moonbeam parachain nodes on the network.  Running this will be a great help to us during our development phase.  

The metrics exporter can run either as a kubernetes sidecar, or as a local binary if you are running a VM.  It will push data out to our servers, so you do not have to enable any incoming ports for this service.  

- [WIP] : Gantree info here
- or substrate telemetry exporter?  https://github.com/w3f/substrate-telemetry-exporter
- how to run this with docker?




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
!!! note There is currently a cumulus [bug](https://github.com/paritytech/cumulus/issues/257) regarding this.


### In Sync
Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.  
(image - Relay_Parachain_Idle.png) 

### Mismatched SHA
We will be upgrading this Alphanet often and will be contacting you in advance, but you may see a mismatched SHA log line and have your node stall.  This typically means you are running an older version and will need to upgrade.  
(image - Mismatched_Sha.png) still need to take it 









