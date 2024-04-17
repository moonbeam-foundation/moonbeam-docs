<div id="termynal" data-termynal>
  <span data-ty="input"><span class="file-path"></span>docker run --network host  \
    <br>-u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam-tracing:v0.36.0-2801-7ae4 \
    <br>--name="Moonbean-Tracing-Tutorial" \
    <br>--unsafe-rpc-external \
    <br>--ethapi=debug,trace,txpool \
    <br>--wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    <br>--runtime-cache-size 64 \
    <br>--dev
  </span>
  <br>
  <span data-ty>CLI parameter `--execution` has no effect anymore and will be removed in the future!
    <br> 2024-04-15 13:52:00 Moonbeam Parachain Collator
    <br> 2024-04-15 13:52:00 ✌️  version 0.35.0-7131ef902c0
    <br> 2024-04-15 13:52:00 ❤️  by PureStake, 2019-2024
    <br> 2024-04-15 13:52:00 📋 Chain specification: Moonbase Development Testnet
    <br> 2024-04-15 13:52:00 🏷  Node name: Moonbean-Tracing-Tutorial
    <br> 2024-04-15 13:52:00 👤 Role: AUTHORITY
    <br> 2024-04-15 13:52:00 💾 Database: RocksDb at /tmp/substrateO3YeRz/chains/moonbase_dev/db/full
    <br> 2024-04-15 14:52:13 Found wasm override. version=moonbase-300 (moonbase-0.tx2.au3) file=/moonbeam/moonbase-substitutes-tracing/moonbase-runtime-300-substitute-tracing.wasm
    <br> ...
    <br> 2024-04-15 14:56:34 💤 Idle (0 peers), best: #0 (0x18e6…2eb1), finalized #0 (0x18e6…2eb1), ⬇ 0 ⬆ 0
  </span>
</div>
