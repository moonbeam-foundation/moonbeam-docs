import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { In } from 'typeorm';
import { contractMapping, pilots, racecrafts } from './contracts';
import { Owner, Token, Transfer } from './model';
import * as erc721 from './abi/erc721';
import { processor, ProcessorContext, Event, Block } from './processor';
import { getEvmLog } from '@subsquid/frontier';

let contractsSaved = false;

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const event of block.events) {
      // If the event is an EVM log and the contract address emitting the log is
      // from the Exiled Racers Pilots or Racecrafts contracts, process the logs
      if (event.name === 'EVM.Log') {
        if (event.args.address) {
          if (
            event.args.address.toLowerCase() == pilots ||
            event.args.address.toLowerCase() == racecrafts
          ) {
            // For each event, get the transfer data
            const transfer = handleTransfer(block.header, event);
            transfersData.push(transfer);
          }
        }
      }
    }
  }

  // Save the contract addresses if they haven't already been saved. This will 
  // only need to happen once, so that is why the contractsSaved flag is used
  if (!contractsSaved) {
    await ctx.store.upsert([...contractMapping.values()]);
    contractsSaved = true;
  }
  await saveTransfers(ctx, transfersData);
});

type TransferData = {
  id: string;
  from: string;
  to: string;
  token: bigint;
  timestamp?: bigint;
  block: number;
  contractAddress: string;
};

function handleTransfer(block: Block, event: Event): TransferData {
  // Decode the event log into an EVM log
  const evmLog = getEvmLog(event);
  // Decode the EVM log to get the from and to addresses and the token ID
  const { from, to, tokenId } = erc721.events.Transfer.decode(evmLog);

  return {
    id: event.id,
    from,
    to,
    token: tokenId,
    timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
    block: block.height,
    contractAddress: event.args.address,
  };
}

async function saveTransfers(
  ctx: ProcessorContext<Store>,
  transfersData: TransferData[]
) {
  // Format the token ID in SYMBOL-ID format
  const getTokenId = (transferData: TransferData) =>
    `${
      contractMapping.get(transferData.contractAddress)?.symbol ?? ''
    }-${transferData.token.toString()}`;

  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  // Iterate over the transfers data to get the token IDs and owners
  for (const transferData of transfersData) {
    tokensIds.add(getTokenId(transferData));
    ownersIds.add(transferData.from);
    ownersIds.add(transferData.to);
  }

  // Use the token IDs and owners to check the database for existing entries 
  const tokens: Map<string, Token> = new Map(
    (await ctx.store.findBy(Token, { id: In([...tokensIds]) })).map((token) => [
      token.id,
      token,
    ])
  );

  const owners: Map<string, Owner> = new Map(
    (await ctx.store.findBy(Owner, { id: In([...ownersIds]) })).map((owner) => [
      owner.id,
      owner,
    ])
  );

  const transfers: Set<Transfer> = new Set();

  // Process and format all of the data to save to the database
  for (const transferData of transfersData) {
    // Create a contract instance, which will be used to query the
    // contract's tokenURI function below
    const contract = new erc721.Contract(
      ctx,
      { height: transferData.block },
      transferData.contractAddress
    );

    // Try to get the from addres from the owners pulled from the database
    let from = owners.get(transferData.from);
    // If there isn't an existing entry for this owner, create one
    if (from == null) {
      from = new Owner({ id: transferData.from });
      owners.set(from.id, from);
    }

    // Try to get the to addres from the owners pulled from the database
    let to = owners.get(transferData.to);
    // If there isn't an existing entry for this owner, create one
    if (to == null) {
      to = new Owner({ id: transferData.to });
      owners.set(to.id, to);
    }

    const tokenId = getTokenId(transferData);
    // Try to get the tokenId from the tokens pulled from the database
    let token = tokens.get(tokenId);
    // If there isn't an existing entry for this token, create one
    if (token == null) {
      token = new Token({
        id: tokenId,
        uri: await contract.tokenURI(transferData.token),
        contract: contractMapping.get(transferData.contractAddress),
      });
      tokens.set(token.id, token);
    }

    // Now that the owner entity has been created, we can establish
    // the connection between the Owner and the Token
    token.owner = to;

    // Since the Owner and Token entity objects have been created,
    // the last step is to create the Transfer entity object
    const { id, block, timestamp } = transferData;
    const transfer = new Transfer({
      id,
      block: BigInt(block),
      timestamp,
      from,
      to,
      token,
    });

    transfers.add(transfer);
  }

  // Save all of the data from this batch to the database
  await ctx.store.upsert([...owners.values()]);
  await ctx.store.upsert([...tokens.values()]);
  await ctx.store.insert([...transfers]);
}
