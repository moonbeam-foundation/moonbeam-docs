<div id="termynal" data-termynal>
  <span data-ty="input"><span class="file-path"></span>docker run --network host  \
    <br>-u $(id -u ${USER}):$(id -g ${USER}) 
        moonbeamfoundation/moonbeam-tracing:v0.49.2-4100-4d7b 
    <br>--name="Moonbeam-Tracing-Tutorial" 
    <br>--unsafe-rpc-external 
    <br>--ethapi=debug,trace,txpool 
    <br>--wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing 
    <br>--runtime-cache-size 64 
    <br>--dev
  </span>
  <br>
  <span data-ty> 2025-07-10 09:04:26 Moonbeam Parachain Collator
    <br> 2025-07-10 09:04:26 ✌️  版本 0.49.2
    <br> 2025-07-10 09:04:26 ❤️  由 PureStake 提供，2019-2025
    <br> 2025-07-10 09:04:26 📋 链规范：Moonbase 开发测试网
    <br> 2025-07-10 09:04:26 🏷  节点名称：Moonbeam-Tracing-Tutorial
    <br> 2025-07-10 09:04:26 👤 角色：权威
    <br> 2025-07-10 09:04:26 💾 数据库：RocksDb 位于 /tmp/substrateO3YeRz/chains/moonbase_dev/db/full
    <br> 2025-07-10 09:04:26 发现 wasm 覆盖。版本=moonbase-300 (moonbase-0.tx2.au3) 文件=/moonbeam/moonbase-substitutes-tracing/moonbase-runtime-300-substitute-tracing.wasm
    <br> ...
    <br> 2025-07-10 09:04:26 💤 空闲（0 个对等节点），最佳：#0 (0x18e6…2eb1)，已完成 #0 (0x18e6…2eb1)，⬇ 0 ⬆ 0
  </span>
</div>
