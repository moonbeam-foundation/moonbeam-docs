<div id="termynal" data-termynal>
  <span data-ty="input"><span class="file-path"></span>docker run --network host  \
    <br>-u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam-tracing:v0.45.0-3700-4174 \
    <br>--name="Moonbean-Tracing-Tutorial" \
    <br>--unsafe-rpc-external \
    <br>--ethapi=debug,trace,txpool \
    <br>--wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    <br>--runtime-cache-size 64 \
    <br>--dev
  </span>
  <br>
  <span data-ty> 2025-04-01 16:02:43 Moonbeam Parachain Collator
    <br> 2025-04-01 16:02:43 ✌️  version 0.44.1-a8825ca4776
    <br> 2025-04-01 16:02:43 ❤️  by PureStake, 2019-2025
    <br> 2025-04-01 16:02:43 📋 Chain specification: Moonbase Development Testnet
    <br> 2025-04-01 16:02:43 🏷  Node name: Moonbean-Tracing-Tutorial
    <br> 2025-04-01 16:02:43 👤 Role: AUTHORITY
    <br> 2025-04-01 16:02:43 💾 Database: RocksDb at /tmp/substrateO3YeRz/chains/moonbase_dev/db/full
    <br> 2025-04-01 16:02:43 Found wasm override. version=moonbase-300 (moonbase-0.tx2.au3) file=/moonbeam/moonbase-substitutes-tracing/moonbase-runtime-300-substitute-tracing.wasm
    <br> ...
    <br> 2025-04-01 16:02:43 💤 Idle (0 peers), best: #0 (0x18e6…2eb1), finalized #0 (0x18e6…2eb1), ⬇ 0 ⬆ 0
  </span>
</div>
