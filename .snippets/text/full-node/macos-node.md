---
title: Full Node Docker Commands for MacOS
---

# Code Snippets Collator/Full Node MacOS

## Moonbeam Full Node {: #moonbeam-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbeam.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbeam Collator {: #moonbeam-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbeam.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
## Moonriver Full Node {: #moonriver-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonriver.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonriver Collator {: #moonriver-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonriver.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Full Node {: #moonbase-alpha-full-node } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbase.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```

## Moonbase Alpha Collator {: #moonbase-alpha-collator } 

```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--base-path=/data \
--chain {{ networks.moonbase.chain_spec }} \
--name="YOUR-NODE-NAME" \
--validator \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning 1000 \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
