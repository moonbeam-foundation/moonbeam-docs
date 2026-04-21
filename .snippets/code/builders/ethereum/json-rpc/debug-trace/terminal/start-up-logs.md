<div id="termynal" data-termynal>
  <span data-ty="input"><span class="file-path"></span>docker run --network host  \
    <br>-u $(id -u ${USER}):$(id -g ${USER}) \
        {{ networks.development.tracing_tag }} \
    <br>--name="Moonbeam-Tracing-Tutorial" \
    <br>--unsafe-rpc-external \
    <br>--ethapi=debug,trace,txpool \
    <br>--wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    <br>--runtime-cache-size 64 \
    <br>--dev
  </span>
  <br>
  <span data-ty> 2025-07-10 09:04:26 Moonbeam Parachain Collator
    <br> 2025-07-10 09:04:26 ✌️  version {{ networks.development.build_version }}
    <br> 2025-07-10 09:04:26 ❤️  by PureStake, 2019-2025
    <br> 2025-07-10 09:04:26 📋 Chain specification: Moonbase Development Testnet
    <br> 2025-07-10 09:04:26 🏷  Node name: Moonbeam-Tracing-Tutorial
    <br> 2025-07-10 09:04:26 👤 Role: AUTHORITY
    <br> 2025-07-10 09:04:26 💾 Database: RocksDb at /tmp/substrateO3YeRz/chains/moonbase_dev/db/full
    <br> 2025-07-10 09:04:26 Found wasm override. version=moonbase-300 (moonbase-0.tx2.au3) file=/moonbeam/moonbase-substitutes-tracing/moonbase-runtime-300-substitute-tracing.wasm
    <br> ...
    <br> 2025-07-10 09:04:26 💤 Idle (0 peers), best: #0 (0x18e6…2eb1), finalized #0 (0x18e6…2eb1), ⬇ 0 ⬆ 0
  </span>
</div>
