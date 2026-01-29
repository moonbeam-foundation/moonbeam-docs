const processor = new EvmBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonbase.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonbase-testnet'
  archive: lookupArchive('moonbase', { type: 'EVM' }),
})
