datasources: [
  {
    kind: 'substrate/Runtime',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
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
