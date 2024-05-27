import { assertNotNull } from '@subsquid/util-internal';
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';
import * as erc721 from './abi/erc721';
import { pilots, racecrafts } from './contracts';

export const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: 1250496 })
  .setGateway('https://v2.archive.subsquid.io/network/moonbeam-substrate')
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ENDPOINT), // TODO: Add the RPC URL to your .env file
    rateLimit: 10,
  })
  // Filter Transfer events from the Exiled Racers Pilot contract
  .addEvmLog({
    address: [pilots],
    range: { from: 1250496 }, // Block of the first transfer
    topic0: [erc721.events.Transfer.topic],
  })
  // Filter Transfer events from the Exiled Racers Racecraft contract
  .addEvmLog({
    address: [racecrafts],
    range: { from: 1398762 }, // Block of the first transfer
    topic0: [erc721.events.Transfer.topic],
  })
  // The timestamp is not provided unless we explicitly request it
  .setFields({
    block: {
      timestamp: true,
    },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
