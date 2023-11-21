import { In } from 'typeorm';
import { assertNotNull } from '@subsquid/evm-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';
import * as erc20 from './abi/erc20';
import { Account, Transfer } from './model';
import {
  Block,
  contractAddress,
  Log,
  Transaction,
  processor,
} from './processor';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  ctx.log.info('Processor started');
  let transfers: TransferEvent[] = [];

  ctx.log.info(`Processing ${ctx.blocks.length} blocks`);
  for (let block of ctx.blocks) {
    ctx.log.debug(`Processing block number ${block.header.height}`);
    for (let log of block.logs) {
      ctx.log.debug(`Processing log with address ${log.address}`);
      if (
        log.address === contractAddress &&
        log.topics[0] === erc20.events.Transfer.topic
      ) {
        ctx.log.info(`Transfer event found in block ${block.header.height}`);
        transfers.push(getTransfer(ctx, log));
      }
    }
  }

  ctx.log.info(`Found ${transfers.length} transfers, processing...`);
  await processTransfers(ctx, transfers);
  ctx.log.info('Processor finished');
});

interface TransferEvent {
  id: string;
  block: Block;
  transaction: Transaction;
  from: string;
  to: string;
  amount: bigint;
}

function getTransfer(ctx: any, log: Log): TransferEvent {
  let event = erc20.events.Transfer.decode(log);

  let from = event.from.toLowerCase();
  let to = event.to.toLowerCase();
  let amount = event.value;

  let transaction = assertNotNull(log.transaction, `Missing transaction`);

  ctx.log.debug(
    `Decoded transfer event: from ${from} to ${to} amount ${amount.toString()}`
  );
  return {
    id: log.id,
    block: log.block,
    transaction,
    from,
    to,
    amount,
  };
}

async function processTransfers(ctx: any, transfersData: TransferEvent[]) {
  ctx.log.info('Starting to process transfer data');
  let accountIds = new Set<string>();
  for (let t of transfersData) {
    accountIds.add(t.from);
    accountIds.add(t.to);
  }

  ctx.log.debug(`Fetching accounts for ${accountIds.size} addresses`);
  let accounts = await ctx.store
    .findBy(Account, { id: In([...accountIds]) })
    .then((q: any[]) => new Map(q.map((i: any) => [i.id, i])));
  ctx.log.info(
    `Accounts fetched, processing ${transfersData.length} transfers`
  );

  let transfers: Transfer[] = [];

  for (let t of transfersData) {
    let { id, block, transaction, amount } = t;

    let from = getAccount(accounts, t.from);
    let to = getAccount(accounts, t.to);

    transfers.push(
      new Transfer({
        id,
        blockNumber: block.height,
        timestamp: new Date(block.timestamp),
        txHash: transaction.hash,
        from,
        to,
        amount,
      })
    );
  }

  ctx.log.debug(`Upserting ${accounts.size} accounts`);
  await ctx.store.upsert(Array.from(accounts.values()));
  ctx.log.debug(`Inserting ${transfers.length} transfers`);
  await ctx.store.insert(transfers);
  ctx.log.info('Transfer data processing completed');
}

function getAccount(m: Map<string, Account>, id: string): Account {
  let acc = m.get(id);
  if (acc == null) {
    acc = new Account();
    acc.id = id;
    m.set(id, acc);
  }
  return acc;
}
