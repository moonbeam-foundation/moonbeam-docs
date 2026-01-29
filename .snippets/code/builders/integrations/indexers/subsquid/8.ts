const processor = new SubstrateBatchProcessor();
processor.setDataSource({
  chain: '{{ networks.moonbase.rpc_url }}',
  // Resolves to 'https://v2.archive.subsquid.io/network/moonbase-testnet'
  archive: lookupArchive('moonbase', {type: 'Substrate', release: 'ArrowSquid'}),
})
