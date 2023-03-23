```yaml
specVersion: 0.2.0
name: starter
version: 0.0.4
description: This SubQuery project can be use as a starting point for Moonbeam network
repository: 'https://github.com/subquery/moonbeam-subql-starters'
schema:
  file: ./schema.graphql
network:
  endpoint: 'wss://wss.api.moonbase.moonbeam.network'
  genesisHash: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d'
  dictionary: 'https://api.subquery.network/sq/subquery/moonbeam-dictionary'
  chaintypes:
    file: ./dist/chaintypes.js
dataSources:
  - kind: substrate/FrontierEvm
    startBlock: 1
    processor:
      file: './node_modules/@subql/contract-processors/dist/frontierEvm.js'
      options:
        abi: erc20 # this must match one of the keys in the assets field
        address: '0xAcc15dC74880C9944775448304B263D191c6077F' # optionally get data for a specific contract
    assets: 
      erc20:
        file: './erc20.abi.json'
    mapping:
      file: './dist/index.js'
      handlers:
        - handler: handleMoonbeamEvent
          kind: substrate/FrontierEvmEvent
          filter:
            topics:
              - Transfer(address indexed from,address indexed to,uint256 value)
        - handler: handleMoonbeamCall
          kind: substrate/FrontierEvmCall
          filter:
            function: approve(address to,uint256 value)
            from: '0xAcc15dC74880C9944775448304B263D191c6077F'

```