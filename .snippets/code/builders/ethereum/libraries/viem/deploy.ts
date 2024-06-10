// 1. Update imports
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';
import contractFile from './compile';

// 2. Create a wallet client for writing chain data
// The private key must be prepended with `0x` to avoid errors
const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = 'https://rpc.api.moonbase.moonbeam.network';
const walletClient = createWalletClient({
  account,
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});
// 3. Create a public client for reading chain data
const publicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

// 4. Load contract information
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const _initialNumber = 5;

// 5. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account: ${account.address}`);

  // 6. Send tx (initial value set to 5)
  const contract = await walletClient.deployContract({
    abi,
    account,
    bytecode,
    args: [_initialNumber],
  });

  // 7. Get the transaction receipt for the deployment
  const transaction = await publicClient.waitForTransactionReceipt({
    hash: contract,
  });

  console.log(`Contract deployed at address: ${transaction.contractAddress}`);
};

// 8. Call the deploy function
deploy();
