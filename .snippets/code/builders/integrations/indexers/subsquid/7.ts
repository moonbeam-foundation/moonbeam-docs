const processor = new SubstrateBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonriver.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonriver-mainnet'
  archive: lookupArchive('moonriver', {type: 'Substrate', release: 'ArrowSquid'}),
})
