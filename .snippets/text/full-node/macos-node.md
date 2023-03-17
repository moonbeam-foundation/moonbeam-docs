---
title: Full Node Docker Commands for MacOS
---

# Code Snippets Collator/Full Node MacOS

For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`.

For client versions prior to v0.30.0, `--rpc-port` was used to specify the port for HTTP connections and `--ws-port` was used to specify the port for WS connections. As of client v0.30.0, the `--rpc-port` flag, which defaults to port `9933`, has been deprecated and the max connections to that port have been hardcoded to 100. The `--ws-port` flag, which defaults to port `9944`, is for both HTTP and WS connections. You can use the `--ws-max-connections` to adjust the combined HTTP and WS connection limit.

## Moonbeam Full Node {: #moonbeam-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.29.0 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam Collator {: #moonbeam-collator } 

```
docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.29.0 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
## Moonriver Full Node {: #moonriver-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.30.0 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver Collator {: #moonriver-collator } 

```
docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.30.0 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Full Node {: #moonbase-alpha-full-node } 

```
docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.30.0 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--state-pruning archive \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Collator {: #moonbase-alpha-collator } 

```
docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.30.0 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--collator \
--execution wasm \
--wasm-execution compiled \
--trie-cache-size 0 \
-- \
--execution wasm \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
