// src/contract.ts
import { Contract as ContractAPI } from './abi/erc721';
import { BigNumber } from 'ethers';
import { Context } from './processor';
import { Contract } from './model';

export const contractAddress = 'wss://moonbeam.public.blastapi.io';

export async function createContractEntity(ctx: Context): Promise<Contract> {
  const lastBlock = ctx.blocks[ctx.blocks.length - 1].header;
  const contractAPI = new ContractAPI(
    { ...ctx, block: lastBlock },
    contractAddress
  );
  let name = '',
    symbol = '',
    totalSupply = BigNumber.from(0);
  ctx.log.info('Creating new Contract model instance');
  try {
    name = await contractAPI.name();
    symbol = await contractAPI.symbol();
    totalSupply = await contractAPI.totalSupply();
  } catch (error) {
    ctx.log.warn(
      `[API] Error while fetching Contract metadata for address ${contractAddress}`
    );
    if (error instanceof Error) {
      ctx.log.warn(`${error.message}`);
    }
  }
  return new Contract({
    id: contractAddress,
    name: name,
    symbol: symbol,
    totalSupply: totalSupply.toBigInt(),
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity(ctx: Context): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await ctx.store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = await createContractEntity(ctx);
      await ctx.store.insert(contractEntity);
    }
  }
  return contractEntity;
}
