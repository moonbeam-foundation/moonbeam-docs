---
title: Full Node Docker Commands for MacOS
---

# Code Snippets Collator/Full Node MacOS

## Moonbeam Full Node {: #moonbeam-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam Collator {: #moonbeam-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain moonbeam \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
## Moonriver Full Node {: #moonriver-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver Collator {: #moonriver-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain moonriver \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Full Node {: #moonbase-alpha-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Collator {: #moonbase-alpha-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:v0.24.0 \
--base-path=/data \
--chain alphanet \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 0 \
-- \
--execution wasm \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
