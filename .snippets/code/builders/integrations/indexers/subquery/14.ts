datasources: [
  {
    kind: 'substrate/FrontierEvm',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
    processor: {
      file: './node_modules/@subql/frontier-evm-processor/dist/bundle.js',
      options: {
        abi: '',
        address: '',
      },
    },
    assets: ''
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          kind: 'INSERT_HANDLER_KIND',
          handler: 'INSERT_HANDLER_FUNCTION_NAME',
          filter: {
            'INSERT_FILTER_TYPE': 'INSERT_FILTER',
          },
        },
      ],
    },
  },
],
