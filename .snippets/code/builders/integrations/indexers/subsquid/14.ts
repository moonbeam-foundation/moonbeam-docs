const processor = new EvmBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonbeam.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonbeam-mainnet'
  archive: lookupArchive('moonbeam', { type: 'EVM' })
})
