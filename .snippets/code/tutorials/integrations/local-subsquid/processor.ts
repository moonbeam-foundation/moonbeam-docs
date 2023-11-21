import { assertNotNull } from '@subsquid/util-internal';
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import * as erc20 from './abi/erc20';

// Here you'll need to import the contract
export const contractAddress =
  '0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3'.toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: {
      url: assertNotNull('http://127.0.0.1:9944'),
      rateLimit: 300,
    },
  })
  .setFinalityConfirmation(10)
  .setFields({
    log: {
      topics: true,
      data: true,
    },
    transaction: {
      hash: true,
    },
  })
  .addLog({
    address: [contractAddress],
    topic0: [erc20.events.Transfer.topic],
    transaction: true,
  })
  .setBlockRange({
    from: 0, // Note the lack of quotes here
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
