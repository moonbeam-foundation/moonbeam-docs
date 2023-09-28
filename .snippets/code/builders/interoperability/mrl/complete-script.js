import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { ethers } from 'ethers';
import batchABI from './abi/Batch.js';
import erc20ABI from './abi/ERC20.js';
import tokenRelayerABI from './abi/TokenRelayer.js';

// Input data
const originChainProviderWsURL = 'INSERT_ORIGIN_CHAIN_WSS_URL';
const multilocationDerivativeAccount =
  'INSERT_MULTILOCATION_DERIVATIVE_ADDRESS';
const localXC20Address = 'INSERT_LOCAL_XC20_ADDRESS';
const transferAmount = 'INSERT_AMOUNT_TO_TRANSFER';
const xLabsRelayer = '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b';
const batchPrecompile = '0x0000000000000000000000000000000000000808';
const destinationChainId = 'INSERT_DESTINATION_CHAIN_ID';
// The recipient address on the destination chain needs to be formatted in 32 bytes
// You'll pad the address to the left with zeroes. Add the destination address below
// without the 0x
const destinationAddress =
  '0x000000000000000000000000' + 'INSERT_DESTINATION_ADDRESS';

// Transfer multiassets parameters
const assets = {
  V3: [
    {
      // xcDEV
      id: {
        Concrete: {
          parents: 1,
          interior: {
            X2: [
              { Parachain: 1000 }, // Parachain ID
              { PalletInstance: 3 }, // Index of the Balances Pallet
            ],
          },
        },
      },
      fun: {
        Fungible: '100000000000000000', // 0.1 DEV as an estimation for XCM and EVM transaction fee
      },
    },
    {
      // Local XC-20 token
      id: {
        Concrete: {
          parents: 1,
          interior: {
            X3: [
              { Parachain: 1000 }, // Parachain ID
              { PalletInstance: 48 }, // Index of the ERC-20 XCM Bridge Pallet
              {
                AccountKey20: {
                  key: localXC20Address,
                },
              },
            ],
          },
        },
      },
      fun: {
        Fungible: transferAmount,
      },
    },
  ],
};
const feeItem = 0;
const destination = {
  V3: {
    parents: 1,
    interior: {
      X2: [
        { Parachain: 1000 },
        { AccountKey20: { key: multilocationDerivativeAccount } },
      ],
    },
  },
};
const weightLimit = 'Unlimited';

// Create contract instances
const batchInterface = new ethers.Interface(batchABI);
const localXC20Interface = new ethers.Interface(erc20ABI);
const tokenRelayer = new ethers.Contract(
  xLabsRelayer,
  tokenRelayerABI,
  new ethers.JsonRpcProvider('https://rpc.api.moonbase.moonbeam.network')
);

// Get the encoded call data for the approve transaction
const approve = localXC20Interface.encodeFunctionData('approve', [
  xLabsRelayer, // Spender
  transferAmount, // Amount
]);

// Get the encoded call data for the transferTokensWithRelay transaction.
// Use wrapAndTransferEthWithRelay if the token is GLMR
const transferTokensWithRelay = tokenRelayer.interface.encodeFunctionData(
  'transferTokensWithRelay',
  [
    localXC20Address, // Token
    transferAmount, // Amount to be transferred
    0, // Amount to swap into native assets on the target chain
    destinationChainId, // Target chain ID, like Ethereum MainNet or Fantom
    destinationAddress, // Target recipient address
    0, // Batch ID for Wormhole message batching
  ]
);

const batchAll = batchInterface.encodeFunctionData('batchAll', [
  [localXC20Address, xLabsRelayer], // Addresses to call
  [0, 0], // Value to send for each call
  [approve, transferTokensWithRelay], // Call data for each call
  [], // Gas limit for each call
]);

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const account = keyring.addFromUri(privateKey);

const sendBatchTx = async () => {
  // Create origin chain API [rovider
  const originChainProvider = new WsProvider(originChainProviderWsURL);
  const originChainAPI = await ApiPromise.create({
    provider: originChainProvider,
  });

  // Create Moonbeam API provider
  const moonbeamProvider = new WsProvider(
    'wss://wss.api.moonbase.moonbeam.network'
  );
  const moonbeamAPI = await ApiPromise.create({ provider: moonbeamProvider });

  // Create the transferMultiasset extrinsic
  const transferMultiassets = originChainAPI.tx.xTokens.transferMultiassets(
    assets,
    feeItem,
    destination,
    weightLimit
  );

  // Create the ethereumXCM extrinsic that uses the Batch Precompile
  const transact = moonbeamAPI.tx.ethereumXcm.transact({
    V2: {
      gasLimit: 350000n,
      action: {
        Call: batchPrecompile,
      },
      value: 0,
      input: batchAll,
    },
  });

  const txWeight = (await transact.paymentInfo(multilocationDerivativeAccount))
    .weight;

  const sendXCM = originChainAPI.tx.polkadotXcm.send(
    { V3: { parents: 1, interior: { X1: { Parachain: 1000 } } } },
    {
      V3: [
        {
          // Withdraw DEV asset (0.06) from the target account
          WithdrawAsset: [
            {
              id: {
                Concrete: {
                  parents: 0,
                  interior: { X1: { PalletInstance: 3 } },
                },
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
                Concrete: {
                  parents: 0,
                  interior: { X1: { PalletInstance: 3 } },
                },
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
                X1: { AccountKey20: { key: multilocationDerivativeAccount } },
              },
            },
          },
        },
      ],
    }
  );

  // Create batch transaction
  const batchExtrinsic = originChainAPI.tx.utility.batchAll([
    transferMultiassets,
    sendXCM,
  ]);

  // Send batch transaction
  return await batchExtrinsic.signAndSend(account, ({ status }) => {
    if (status.isInBlock) console.log(`Transaction sent!`);
  });
};

sendBatchTx();
