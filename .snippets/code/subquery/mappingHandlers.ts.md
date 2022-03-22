```ts
import { FrontierEvmEvent, FrontierEvmCall } from '@subql/contract-processors/dist/frontierEvm';
import { Approval, Transaction } from "../types";
import { BigNumber } from "ethers";

type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }

export async function handleMoonbeamEvent(event: FrontierEvmEvent<TransferEventArgs>): Promise<void> {
  const transaction = new Transaction(event.transactionHash);

  transaction.value = event.args.value.toBigInt();
  transaction.from = event.args.from;
  transaction.to = event.args.to;
  transaction.contractAddress = event.address;

  await transaction.save();
}

export async function handleMoonbeamCall(event: FrontierEvmCall<ApproveCallArgs>): Promise<void> {
  const approval = new Approval(event.hash);

  approval.owner = event.from;
  approval.value = event.args._value.toBigInt();
  approval.spender = event.args._spender;
  approval.contractAddress = event.to;

  await approval.save();
}
```