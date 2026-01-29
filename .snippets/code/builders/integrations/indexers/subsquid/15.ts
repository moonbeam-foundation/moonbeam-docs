const processor = new EvmBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonriver.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonriver-mainnet'
  archive: lookupArchive('moonriver', { type: 'EVM' }),
})
