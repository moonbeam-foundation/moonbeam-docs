=== "Moonbeam Development Node"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --dev
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --chain moonriver \
    --name="Moonbeam-Tutorial" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```
