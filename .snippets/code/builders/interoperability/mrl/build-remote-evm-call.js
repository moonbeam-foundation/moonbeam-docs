import { ApiPromise, WsProvider } from '@polkadot/api';
import { getTransactCall } from './build-batch-evm-call.js';

const originChainProviderWsURL = 'INSERT_ORIGIN_CHAIN_WSS_URL';
const computedOriginAccount = 'INSERT_COMPUTED_ORIGIN_ADDRESS';

export const getPolkadotXcmCall = async () => {
  // Create origin chain API provider
  const originChainProvider = new WsProvider(originChainProviderWsURL);
  const originChainAPI = await ApiPromise.create({
    provider: originChainProvider,
  });

  // Get the weight required to execute the Transact calldata
  const { transact, txWeight } = await getTransactCall();

  // Create the extrinsic for the remote EVM call
  const sendXcm = originChainAPI.tx.polkadotXcm.send(
    { V4: { parents: 1, interior: { X1: [{ Parachain: 1000 }] } } },
    {
      V4: [
        {
          // Withdraw DEV asset (0.06) from the target account
          WithdrawAsset: [
            {
              id: {
                parents: 0,
                interior: { X1: [{ PalletInstance: 3 }] },
              },
              fun: { Fungible: 60000000000000000n },
            },
          ],
        },
        {
          // Buy execution with the DEV asset
          BuyExecution: {
            fees: {
              id: {
                parents: 0,
                interior: { X1: [{ PalletInstance: 3 }] },
              },
              fun: { Fungible: 60000000000000000n },
            },
            weightLimit: 'Unlimited',
          },
        },
        {
          Transact: {
            originKind: 'SovereignAccount',
            requireWeightAtMost: {
              refTime: txWeight.refTime,
              proofSize: txWeight.proofSize,
            },
            call: {
              encoded: transact.method.toHex(),
            },
          },
        },
        {
          RefundSurplus: {},
        },
        {
          DepositAsset: {
            // Note that this must be AllCounted and not All, since All has too high of a gas requirement
            assets: { Wild: { AllCounted: 1 } },
            beneficiary: {
              parents: 0,
              interior: {
                X1: [{ AccountKey20: { key: computedOriginAccount } }],
              },
            },
          },
        },
      ],
    }
  );

  return sendXcm;
};
