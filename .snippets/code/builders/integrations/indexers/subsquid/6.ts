const processor = new SubstrateBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonbeam.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonbeam-mainnet'
  archive: lookupArchive('moonbeam', {type: 'Substrate', release: 'ArrowSquid'}),
})
