import { ApiPromise, WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';
import batchABI from './abi/Batch.js';
import erc20ABI from './abi/ERC20.js';
import tokenRelayerABI from './abi/TokenRelayer.js';

const localXC20Address = 'INSERT_LOCAL_XC20_ADDRESS';
const transferAmount = 'INSERT_AMOUNT_TO_TRANSFER';
const xLabsRelayer = '0x9563a59c15842a6f322b10f69d1dd88b41f2e97b';
const destinationChainId = 'INSERT_DESTINATION_CHAIN_ID';
const computedOriginAccount = 'INSERT_COMPUTED_ORIGIN_ADDRESS';
// The recipient address on the destination chain needs to be formatted in 32 bytes
// You'll pad the address to the left with zeroes. Add the destination address below
// without the 0x
const destinationAddress =
  '0x000000000000000000000000' + 'INSERT_DESTINATION_ADDRESS';

// Create contract instances
const batchInterface = new ethers.Interface(batchABI);
const localXC20Interface = new ethers.Interface(erc20ABI);
const tokenRelayer = new ethers.Contract(
  xLabsRelayer,
  tokenRelayerABI,
  new ethers.JsonRpcProvider('https://rpc.api.moonbase.moonbeam.network')
);

// Get the encoded calldata for the approve transaction
const approve = localXC20Interface.encodeFunctionData('approve', [
  xLabsRelayer, // Spender
  transferAmount, // Amount
]);

// Get the encoded calldata for the transferTokensWithRelay transaction.
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

const encodedBatchAllCall = batchInterface.encodeFunctionData('batchAll', [
  [localXC20Address, xLabsRelayer], // Addresses to call
  [0, 0], // Value to send for each call
  [approve, transferTokensWithRelay], // Call data for each call
  [], // Gas limit for each call
]);

export const getTransactCall = async () => {
  // Create Moonbeam API provider
  const moonbeamProvider = new WsProvider(
    'wss://wss.api.moonbase.moonbeam.network'
  );
  const moonbeamAPI = await ApiPromise.create({ provider: moonbeamProvider });

  // Create the extrinsic for the remote EVM call
  const transact = moonbeamAPI.tx.ethereumXcm.transact({
    V2: {
      gasLimit: 350000n,
      action: {
        Call: '0x0000000000000000000000000000000000000808',
      },
      value: 0n,
      input: encodedBatchAllCall,
    },
  });

  const txWeight = (await transact.paymentInfo(computedOriginAccount)).weight;

  moonbeamAPI.disconnect();

  return { transact, txWeight };
};
